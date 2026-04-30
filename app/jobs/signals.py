import re
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Job, Application

User = get_user_model()

def get_words(text):
    # Ye function text ko chota (lower case) karta hai aur usme se sirf alfaz nikalta hai
    if not text:
        return set()
    return set(re.findall(r'\b\w+\b', text.lower()))

@receiver(post_save, sender=Job)
def auto_apply_to_new_job(sender, instance, created, **kwargs):
    if created:
        # 1. Sirf un seekers ko nikalo jinka 'auto_apply_enabled' True hai
        seekers = User.objects.filter(is_seeker=True, auto_apply_enabled=True)
        
        # 2. Job ke title aur description se saare alfaz (words) nikal lo
        job_text = f"{instance.title} {instance.description}"
        job_words = get_words(job_text)
        
        applications = []
        for seeker in seekers:
            # Agar user ne na skills likhi hain aur na bio, toh next user par jao
            if not seeker.skills and not seeker.bio:
                continue
                
            # User ki skills aur bio ke words nikal lo
            seeker_text = f"{seeker.skills or ''} {seeker.bio or ''}"
            seeker_words = get_words(seeker_text)
            
            # 3. Asal jadoo: Check karein ke dono mein kitne alfaz match hue (Intersection)
            common_words = job_words.intersection(seeker_words)
            
            # Check karte hain ke kitne percentage words match hue (Job ke total words ke hisab se)
            if len(job_words) > 0:
                match_percentage = (len(common_words) / len(job_words)) * 100
            else:
                match_percentage = 0
            
            # Agar match 80% ya is se zyada hai
            if match_percentage >= 80:
                applications.append(
                    Application(
                        job=instance,
                        seeker=seeker,
                        status='Pending'
                    )
                )
                print(f"Match found for {seeker.username}! Matched skills: {common_words}")
        
        # 4. Jinki skills match hui hain, sirf unko hi auto-apply karo
        if applications:
            Application.objects.bulk_create(applications)
            print(f"Smart Automation: {len(applications)} seekers ki skills match hui aur auto-apply ho gaya!")
