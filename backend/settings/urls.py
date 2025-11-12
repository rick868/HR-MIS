from rest_framework.routers import DefaultRouter
from .views import SystemSettingsViewSet, NotificationSettingsViewSet

router = DefaultRouter()
router.register(r'system-settings', SystemSettingsViewSet)
router.register(r'notification-settings', NotificationSettingsViewSet)

urlpatterns = router.urls
