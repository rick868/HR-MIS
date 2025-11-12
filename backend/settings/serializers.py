from rest_framework import serializers
from .models import SystemSettings, NotificationSettings


class SystemSettingsSerializer(serializers.ModelSerializer):
    """Serializer for SystemSettings model."""

    class Meta:
        model = SystemSettings
        fields = [
            'id', 'key', 'value', 'category', 'description', 'is_public',
            'requires_restart', 'data_type', 'validation_regex', 'min_value',
            'max_value', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NotificationSettingsSerializer(serializers.ModelSerializer):
    """Serializer for NotificationSettings model."""

    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = NotificationSettings
        fields = [
            'id', 'user', 'user_email', 'leave_requests', 'leave_approvals',
            'performance_reviews', 'attendance_alerts', 'system_updates',
            'security_alerts', 'email_notifications', 'push_notifications',
            'sms_notifications', 'in_app_notifications', 'quiet_hours_start',
            'quiet_hours_end', 'timezone', 'digest_frequency',
            'batch_notifications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
