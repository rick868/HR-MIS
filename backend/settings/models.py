from django.db import models
from django.utils.translation import gettext_lazy as _


class SystemSettings(models.Model):
    """Global system settings for the HR platform."""

    class SettingCategory(models.TextChoices):
        GENERAL = 'General', _('General')
        SECURITY = 'Security', _('Security')
        NOTIFICATIONS = 'Notifications', _('Notifications')
        INTEGRATIONS = 'Integrations', _('Integrations')
        COMPLIANCE = 'Compliance', _('Compliance')

    key = models.CharField(_('key'), max_length=100, unique=True)
    value = models.TextField(_('value'))
    category = models.CharField(_('category'), max_length=20, choices=SettingCategory.choices, default=SettingCategory.GENERAL)
    description = models.TextField(_('description'), blank=True)
    is_public = models.BooleanField(_('is public'), default=False)  # Can be viewed by regular users
    requires_restart = models.BooleanField(_('requires restart'), default=False)

    # Data type hints
    data_type = models.CharField(_('data type'), max_length=20, default='string')  # string, integer, boolean, json

    # Validation
    validation_regex = models.CharField(_('validation regex'), max_length=200, blank=True)
    min_value = models.DecimalField(_('min value'), max_digits=10, decimal_places=2, null=True, blank=True)
    max_value = models.DecimalField(_('max value'), max_digits=10, decimal_places=2, null=True, blank=True)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['category', 'key']

    def __str__(self):
        return f"{self.category}: {self.key}"


class NotificationSettings(models.Model):
    """Notification preferences for users."""

    class NotificationType(models.TextChoices):
        EMAIL = 'Email', _('Email')
        PUSH = 'Push', _('Push Notification')
        SMS = 'SMS', _('SMS')
        IN_APP = 'In App', _('In-App Notification')

    class NotificationEvent(models.TextChoices):
        LEAVE_REQUEST = 'Leave Request', _('Leave Request')
        LEAVE_APPROVAL = 'Leave Approval', _('Leave Approval')
        PERFORMANCE_REVIEW = 'Performance Review', _('Performance Review')
        ATTENDANCE_ALERT = 'Attendance Alert', _('Attendance Alert')
        SYSTEM_UPDATE = 'System Update', _('System Update')
        SECURITY_ALERT = 'Security Alert', _('Security Alert')

    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='notification_settings')

    # Notification preferences by type and event
    leave_requests = models.BooleanField(_('leave requests'), default=True)
    leave_approvals = models.BooleanField(_('leave approvals'), default=True)
    performance_reviews = models.BooleanField(_('performance reviews'), default=True)
    attendance_alerts = models.BooleanField(_('attendance alerts'), default=True)
    system_updates = models.BooleanField(_('system updates'), default=True)
    security_alerts = models.BooleanField(_('security alerts'), default=True)

    # Delivery methods
    email_notifications = models.BooleanField(_('email notifications'), default=True)
    push_notifications = models.BooleanField(_('push notifications'), default=False)
    sms_notifications = models.BooleanField(_('sms notifications'), default=False)
    in_app_notifications = models.BooleanField(_('in app notifications'), default=True)

    # Schedule preferences
    quiet_hours_start = models.TimeField(_('quiet hours start'), null=True, blank=True)
    quiet_hours_end = models.TimeField(_('quiet hours end'), null=True, blank=True)
    timezone = models.CharField(_('timezone'), max_length=50, default='UTC')

    # Frequency settings
    digest_frequency = models.CharField(_('digest frequency'), max_length=20, default='daily')  # immediate, daily, weekly
    batch_notifications = models.BooleanField(_('batch notifications'), default=True)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    def __str__(self):
        return f"Notification settings for {self.user.email}"
