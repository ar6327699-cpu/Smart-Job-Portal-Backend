from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import User

# 1. Seeker ke liye Signup Form
class SeekerSignupForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ['username', 'email', 'phone'] # Jo jo fields chahiye

    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_seeker = True # Isse ye pakka Seeker ban jayega
        if commit:
            user.save()
        return user

# 2. Employer ke liye Signup Form
class EmployerSignupForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = ['username', 'email', 'phone']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.is_employer = True # Isse ye pakka Employer ban jayega
        if commit:
            user.save()
        return user