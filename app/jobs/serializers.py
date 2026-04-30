from rest_framework import serializers
from .models import Job, Application

class JobSerializer(serializers.ModelSerializer):
 
    employer_name = serializers.ReadOnlyField(source='employer.username')

    class Meta:
        model = Job
        fields = ['id', 'employer', 'employer_name', 'title', 'description', 'location', 'job_type', 'salary', 'is_active', 'created_at']
      
        read_only_fields = ['employer', 'created_at']

class ApplicationSerializer(serializers.ModelSerializer):
    # API response mein thori asani ke liye naam aur job title bhej rahe hain
    seeker_name = serializers.ReadOnlyField(source='seeker.username')
    job_title = serializers.ReadOnlyField(source='job.title')

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'seeker', 'seeker_name', 'cover_letter', 'resume', 'status', 'applied_at']
        # seeker, status, aur applied_at hum khud backend se handle karenge
        read_only_fields = ['seeker', 'status', 'applied_at']
