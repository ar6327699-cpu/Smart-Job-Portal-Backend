from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # 1. Admin list mein jo columns nazar aayenge (Table view)
    list_display = ('username', 'email', 'is_seeker', 'is_employer', 'is_staff', 'is_active')
    
    # 2. List mein hi filter karne ka option (Side bar)
    list_filter = ('is_seeker', 'is_employer', 'is_staff', 'is_active')

    # 3. Admin panel mein user edit karte waqt jo fields dikhengi
    # Humne default fields mein apna naya section "Role Information" add kiya hai
    fieldsets = UserAdmin.fieldsets + (
        ('Role Information', {
            'fields': ('is_seeker', 'is_employer', 'phone', 'auto_apply_enabled', 'profile_picture', 'bio')
        }),
    )
    
    # 4. Naya user banate waqt jo fields dikhengi (Add User form)
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role Information', {
            'fields': ('is_seeker', 'is_employer', 'phone')
        }),
    )

    # 5. Search karne ke liye fields
    search_fields = ('username', 'email', 'phone')
    ordering = ('username',)

# Register karein apne custom model aur admin class ko
admin.site.register(User, CustomUserAdmin)