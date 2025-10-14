from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom admin for User model
    """
    list_display = ('email', 'first_name', 'last_name', 'department', 'is_active', 'is_staff')
    list_filter = ('is_active', 'is_staff', 'department', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'department')
    ordering = ('-created_at',)

    fieldsets = UserAdmin.fieldsets + (
        ('Profile Information', {
            'fields': ('phone', 'department', 'bio', 'location')
        }),
        ('Notification Preferences', {
            'fields': ('email_alerts', 'push_notifications', 'weekly_reports',
                      'performance_alerts', 'attendance_alerts')
        }),
        ('Security Settings', {
            'fields': ('two_factor_auth', 'session_timeout', 'password_expiry')
        }),
        ('App Preferences', {
            'fields': ('language', 'timezone', 'date_format', 'currency',
                      'number_format', 'week_starts_on', 'theme')
        }),
        ('Data Settings', {
            'fields': ('data_retention', 'auto_backup', 'export_format')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Profile Information', {
            'fields': ('phone', 'department', 'bio', 'location')
        }),
    )
