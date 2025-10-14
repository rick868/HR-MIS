from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser
    """
    email = models.EmailField(_('email address'), unique=True)
    phone = models.CharField(_('phone number'), max_length=20, blank=True)
    department = models.CharField(_('department'), max_length=100, blank=True)
    bio = models.TextField(_('bio'), blank=True)
    location = models.CharField(_('location'), max_length=100, blank=True)

    # Notification preferences
    email_alerts = models.BooleanField(_('email alerts'), default=True)
    push_notifications = models.BooleanField(_('push notifications'), default=False)
    weekly_reports = models.BooleanField(_('weekly reports'), default=True)
    performance_alerts = models.BooleanField(_('performance alerts'), default=True)
    attendance_alerts = models.BooleanField(_('attendance alerts'), default=False)

    # Security settings
    two_factor_auth = models.BooleanField(_('two factor authentication'), default=False)
    session_timeout = models.CharField(_('session timeout'), max_length=10, default='30')
    password_expiry = models.CharField(_('password expiry'), max_length=10, default='90')

    # App preferences
    language = models.CharField(_('language'), max_length=10, default='en')
    timezone = models.CharField(_('timezone'), max_length=50, default='UTC')
    date_format = models.CharField(_('date format'), max_length=20, default='MM/DD/YYYY')
    currency = models.CharField(_('currency'), max_length=10, default='KSH')
    number_format = models.CharField(_('number format'), max_length=20, default='1,000.00')
    week_starts_on = models.CharField(_('week starts on'), max_length=10, default='monday')

    # Theme preference
    theme = models.CharField(_('theme'), max_length=20, default='light')

    # Data settings
    data_retention = models.CharField(_('data retention'), max_length=10, default='365')
    auto_backup = models.BooleanField(_('auto backup'), default=True)
    export_format = models.CharField(_('export format'), max_length=10, default='csv')

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"
