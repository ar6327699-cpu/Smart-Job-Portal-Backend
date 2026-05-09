from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import PermissionDenied
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = JobSerializer
    
    # Configuration for API filters and search fields
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['job_type', 'location'] # Precise attribute filters
    search_fields = ['title', 'description', 'employer__username'] # Full-text query fields
    
    def get_permissions(self):
        # Allow unrestricted viewing (list & retrieve).
        # Require authentication for creating, updating, or deleting listings.
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Ensure the request user is registered as an employer
        if not getattr(self.request.user, 'is_employer', False):
            raise PermissionDenied("Only registered employers are allowed to publish job listings.")
        
        # Automatically assign the authenticated user as the job owner
        serializer.save(employer=self.request.user)

    def perform_update(self, serializer):
        # Enforce strict object-level update permissions
        if serializer.instance.employer != self.request.user:
            raise PermissionDenied("Aap sirf apni hi posted jobs edit kar sakte hain.")
        serializer.save()

    def perform_destroy(self, instance):
        # Enforce strict object-level destruction permissions
        if instance.employer != self.request.user:
            raise PermissionDenied("Aap sirf apni hi posted jobs delete kar sakte hain.")
        instance.delete()

    def get_queryset(self):
        # Return default active listings (can be customized for specific employer views)
        return super().get_queryset()

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'is_employer', False):
            # Employers see incoming applications for jobs they posted
            return Application.objects.filter(job__employer=user).order_by('-applied_at')
        elif getattr(user, 'is_seeker', False):
            # Job seekers see application entries they submitted
            return Application.objects.filter(seeker=user).order_by('-applied_at')
        return Application.objects.none()

    def perform_create(self, serializer):
        # Ensure only job seekers can apply to listings
        if not getattr(self.request.user, 'is_seeker', False):
            raise PermissionDenied("Only registered job seekers can submit applications.")
        
        # Link application securely to the authenticated seeker
        application = serializer.save(seeker=self.request.user)
        
        # Dispatch confirmation email for manual application submissions
        seeker = application.seeker
        job = application.job
        if seeker.email:
            try:
                from django.core.mail import send_mail
                subject = f"Application Received: {job.title}"
                message = f"Hello {seeker.username},\n\nAapne successfully '{job.title}' position ke liye apply kar diya hai. Employer username: {job.employer.username}.\n\nGood Luck!\n\nRegards,\nJob Portal"
                
                send_mail(
                    subject,
                    message,
                    'noreply@jobportal.com',
                    [seeker.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"Failed to send manual application email to {seeker.email}: {e}")
