from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User

class AccountsAPITests(APITestCase):
    
    def setUp(self):
        self.register_seeker_url = reverse('api_register', kwargs={'role_type': 'seeker'})
        self.register_employer_url = reverse('api_register', kwargs={'role_type': 'employer'})
        self.login_url = reverse('api_login')
        self.profile_url = reverse('api_profile')
        
        # Test Data
        self.seeker_data = {
            'username': 'testseeker',
            'email': 'seeker@test.com',
            'password': 'testpassword123',
            'phone': '1234567890'
        }
        
        self.employer_data = {
            'username': 'testemployer',
            'email': 'employer@test.com',
            'password': 'testpassword123',
            'phone': '0987654321'
        }

    def test_register_seeker(self):
        """Test seeker registration API"""
        response = self.client.post(self.register_seeker_url, self.seeker_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('token' in response.data)
        self.assertTrue(User.objects.filter(username='testseeker', is_seeker=True).exists())

    def test_register_employer(self):
        """Test employer registration API"""
        response = self.client.post(self.register_employer_url, self.employer_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue('token' in response.data)
        self.assertTrue(User.objects.filter(username='testemployer', is_employer=True).exists())

    def test_login_user(self):
        """Test login API"""
        # Register first
        self.client.post(self.register_seeker_url, self.seeker_data, format='json')
        
        # Now login
        login_data = {
            'username': 'testseeker',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('token' in response.data)

    def test_profile_api_authenticated(self):
        """Test profile API with authentication"""
        # Register first
        register_response = self.client.post(self.register_seeker_url, self.seeker_data, format='json')
        token = register_response.data['token']
        
        # Setup auth header
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        
        # Access profile
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testseeker')
        self.assertTrue(response.data['is_seeker'])

    def test_profile_api_unauthenticated(self):
        """Test profile API without authentication fails"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
