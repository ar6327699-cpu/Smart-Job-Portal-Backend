from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Sirf accounts ko rasta dikhayein, jobs ka zikr mita dein
    path('accounts/', include('app.accounts.urls')),
]