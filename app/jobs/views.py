from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobSerializer
    
    # Filtering aur Search ki settings
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['job_type', 'location'] # In fields par exact filter lagega
    search_fields = ['title', 'description', 'employer__username'] # In fields mein word search hoga
    
    def get_permissions(self):
        # List aur Retrieve (dekhne ke liye) har kisi ko ijazat hai.
        # Job bananay, edit karne ya delete karne ke liye login hona zaroori hai.
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Check karna ke kya user employer hai?
        if not getattr(self.request.user, 'is_employer', False):
            raise PermissionDenied("Sirf employers job post kar sakte hain.")
        
        # Save karte waqt employer ko logged-in user set kar dena
        serializer.save(employer=self.request.user)

    def get_queryset(self):
        # Agar request employer ki taraf se hai aur wo apni jobs dekhna chahta hai
        # (Hum yahan default queryset hi return kar rahe hain, magar ise customize kiya ja sakta hai)
        return super().get_queryset()

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_employer', False):
            # Agar employer hai toh usko sirf uski jobs ki applications dikhao
            return Application.objects.filter(job__employer=user).order_by('-applied_at')
        elif getattr(user, 'is_seeker', False):
            # Agar seeker hai toh usne jahan apply kiya hai wo dikhao
            return Application.objects.filter(seeker=user).order_by('-applied_at')
        return Application.objects.none()

    def perform_create(self, serializer):
        # Check karna ke kya user job seeker hai?
        if not getattr(self.request.user, 'is_seeker', False):
            raise PermissionDenied("Sirf job seekers apply kar sakte hain.")
        
        # Save karte waqt seeker ko logged-in user set kar dena
        serializer.save(seeker=self.request.user)
