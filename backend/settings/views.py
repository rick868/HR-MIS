from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import SystemSettings, NotificationSettings
from .serializers import SystemSettingsSerializer, NotificationSettingsSerializer


class SystemSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for SystemSettings model."""

    queryset = SystemSettings.objects.all()
    serializer_class = SystemSettingsSerializer
    permission_classes = [IsAdminUser]  # Only admins can modify system settings

    @action(detail=False, methods=['get'])
    def public(self, request):
        """Get only public settings."""
        settings = self.get_queryset().filter(is_public=True)
        serializer = self.get_serializer(settings, many=True)
        return Response(serializer.data)


class NotificationSettingsViewSet(viewsets.ModelViewSet):
    """ViewSet for NotificationSettings model."""

    queryset = NotificationSettings.objects.all()
    serializer_class = NotificationSettingsSerializer

    def get_queryset(self):
        """Users can only see their own notification settings."""
        return self.queryset.filter(user=self.request.user)

    @action(detail=False, methods=['get'])
    def my_settings(self, request):
        """Get current user's notification settings."""
        settings, created = NotificationSettings.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(settings)
        return Response(serializer.data)
