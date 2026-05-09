import re
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from .models import Job, Application

User = get_user_model()

@receiver(post_save, sender=Job)
def auto_apply_to_new_job(sender, instance, created, **kwargs):
    if created:
        # 1. Fetch all job seekers with AI Auto-Apply enabled
        seekers = User.objects.filter(is_seeker=True, auto_apply_enabled=True)
        
        # 2. Extract and format job content for keyword evaluation
        job_text = f"{instance.title} {instance.description}".lower()
        
        applications = []
        seekers_to_email = []
        
        for seeker in seekers:
            # Skip candidates with no specified skills
            if not seeker.skills:
                continue
                
            # 3. Parse comma-separated candidate skills into a clean, normalized list
            seeker_skills = [skill.strip().lower() for skill in seeker.skills.split(',') if skill.strip()]
            
            if len(seeker_skills) == 0:
                continue
 
            # 4. Evaluate skill matching metrics
            matched_skills = [skill for skill in seeker_skills if skill in job_text]
            
            # Calculate match percentage
            match_percentage = (len(matched_skills) / len(seeker_skills)) * 100
            
            # 5. Automatically apply if the skill match is 50% or higher
            if match_percentage >= 50:
                applications.append(
                    Application(
                        job=instance,
                        seeker=seeker,
                        status='Pending'
                    )
                )
                seekers_to_email.append(seeker)
                print(f"Match found for {seeker.username}! Matched skills: {matched_skills}")
        
        # 6. Bulk create matching applications for database performance optimization
        if applications:
            Application.objects.bulk_create(applications)
            print(f"Smart Automation: Successfully auto-applied {len(applications)} matched seekers!")
            
            # 7. Despatch confirmation emails asynchronously to matched applicants
            for seeker in seekers_to_email:
                if seeker.email:
                    try:
                        subject = f"Auto-Apply Successful: {instance.title}"
                        message = f"Hello {seeker.username},\n\nAapki profile requirements match hone par AI ne automatically '{instance.title}' position ke liye apply kar diya hai. Employer username: {instance.employer.username}.\n\nGood Luck!\n\nRegards,\nJob Portal AI"
                        
                        send_mail(
                            subject,
                            message,
                            'noreply@jobportal.com',
                            [seeker.email],
                            fail_silently=False,
                        )
                        print(f"Email sent to {seeker.email} successfully.")
                    except Exception as e:
                        print(f"Failed to send email to {seeker.email}: {e}")
