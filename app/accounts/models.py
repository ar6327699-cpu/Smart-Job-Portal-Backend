from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Role Selection (Seeker ya Employer)
    is_seeker = models.BooleanField(default=False)
    is_employer = models.BooleanField(default=False)
    
    # AI Feature Toggle
    auto_apply_enabled = models.BooleanField(default=False, help_text="AI ko ijazat dein ke wo aapke liye apply kare")
    
    # Extra Profile Fields
    phone = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({'Seeker' if self.is_seeker else 'Employer'})"

    class Meta:
        db_table = 'auth_user' 