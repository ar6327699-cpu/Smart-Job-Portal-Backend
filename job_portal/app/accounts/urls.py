from django.urls import path
from .views import RegisterAPI, LoginAPI, ProfileAPI

urlpatterns = [
    path('api/register/<str:role_type>/', RegisterAPI.as_view(), name='api_register'),
    path('api/login/', LoginAPI.as_view(), name='api_login'),
    path('api/profile/', ProfileAPI.as_view(), name='api_profile'),
]