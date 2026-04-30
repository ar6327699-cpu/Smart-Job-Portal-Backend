from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JobViewSet, ApplicationViewSet

# Router banaya jo hamare ModelViewSets ke liye khud bakhud links (URLs) bana dega
router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', ApplicationViewSet, basename='application')

urlpatterns = [
    # Router ke saare banaye hue URLs ko shamil kar lo
    path('', include(router.urls)),
]
