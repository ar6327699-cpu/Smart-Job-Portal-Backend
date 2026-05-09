from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Job, Application

User = get_user_model()

class JobPortalTests(APITestCase):

    def setUp(self):
        # Har test se pehle yeh setup chalega
        
        # 1. Ek Employer banate hain
        self.employer = User.objects.create_user(
            username='testemployer',
            password='testpassword123',
            is_employer=True
        )
        
        # 2. Ek Seeker banate hain (Auto-apply ON, skills = Python, Django)
        self.seeker = User.objects.create_user(
            username='testseeker',
            password='testpassword123',
            is_seeker=True,
            auto_apply_enabled=True,
            skills='Python, Django'
        )
        
        # API test karne ke liye URL
        self.jobs_url = '/api/jobs/jobs/'

    def test_seeker_cannot_post_job(self):
        """Test: Kya Seeker job post kar sakta hai? Nahi."""
        self.client.force_authenticate(user=self.seeker)
        
        data = {
            'title': 'Frontend Developer',
            'description': 'React developer chahiye',
            'location': 'Lahore'
        }
        
        response = self.client.post(self.jobs_url, data)
        # 403 ka matlab hai Permission Denied
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_employer_can_post_job(self):
        """Test: Kya Employer job post kar sakta hai? Haan."""
        self.client.force_authenticate(user=self.employer)
        
        data = {
            'title': 'Frontend Developer',
            'description': 'React developer chahiye',
            'location': 'Lahore'
        }
        
        response = self.client.post(self.jobs_url, data)
        # 201 ka matlab hai Created Successfully
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Job.objects.count(), 1)
        self.assertEqual(Job.objects.get().title, 'Frontend Developer')

    def test_auto_apply_signal_works(self):
        """Test: Kya Auto-Apply (AI Feature) theek se kaam kar raha hai?"""
        self.client.force_authenticate(user=self.employer)
        
        # Aisi job banate hain jisme 'Python' required hai
        data = {
            'title': 'Python',
            'description': 'Django',
            'location': 'Karachi'
        }
        
      
        self.client.post(self.jobs_url, data)
        
        # Ab check karte hain ke kya seeker ki application khud bakhud ban gayi?
        # (Kyunke seeker ki skills mein 'Python' hai)
        self.assertEqual(Application.objects.count(), 1)
        
        # Check karte hain ke application testseeker ki hi hai
        application = Application.objects.first()
        self.assertEqual(application.seeker.username, 'testseeker')

    def test_search_and_filter(self):
        """Test: Kya Search aur Filter sahi kaam kar rahe hain?"""
        # Pehle database mein 2 fake jobs banate hain
        Job.objects.create(employer=self.employer, title='Python Dev', description='abc', location='Lahore', job_type='Remote')
        Job.objects.create(employer=self.employer, title='React Dev', description='xyz', location='Karachi', job_type='Full-time')
        
        # 1. Filter Test (Sirf Lahore ki jobs mango)
        response = self.client.get(self.jobs_url + '?location=Lahore')
        # Response ke 'results' mein sirf 1 job honi chahiye
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Python Dev')
        
        # 2. Search Test ('React' word search karo)
        response = self.client.get(self.jobs_url + '?search=React')
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['location'], 'Karachi')
