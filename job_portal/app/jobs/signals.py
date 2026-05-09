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
        # 1. Sirf un seekers ko nikalo jinka 'auto_apply_enabled' True hai
        seekers = User.objects.filter(is_seeker=True, auto_apply_enabled=True)
        
        # 2. Job ka text lein (title + description) aur lower case kar lein matching ke liye
        job_text = f"{instance.title} {instance.description}".lower()
        
        applications = []
        seekers_to_email = []
        
        for seeker in seekers:
            # Agar seeker ne skills nahi likhi toh skip karein
            if not seeker.skills:
                continue
                
            # 3. Seeker ki skills ko comma (,) se alag karein aur list banayein
            seeker_skills = [skill.strip().lower() for skill in seeker.skills.split(',') if skill.strip()]
            
            if len(seeker_skills) == 0:
                continue

            # 4. Check karein ke seeker ki kitni skills job description mein mojood hain
            matched_skills = [skill for skill in seeker_skills if skill in job_text]
            
            # Kitne percent skills match huin
            match_percentage = (len(matched_skills) / len(seeker_skills)) * 100
            
            # Agar 50% ya us se zyada skills match karti hain, tou auto-apply kar do
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
        
        # 5. Jinki skills match hui hain, sirf unko hi auto-apply karo
        if applications:
            Application.objects.bulk_create(applications)
            print(f"Smart Automation: {len(applications)} seekers ki skills match hui aur auto-apply ho gaya!")
            
            # 6. Jin logon ka apply hua hai unko Email bhejain
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
