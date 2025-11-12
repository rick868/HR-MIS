from rest_framework.routers import DefaultRouter
from .views import DashboardMetricViewSet, ReportViewSet

router = DefaultRouter()
router.register(r'dashboard-metrics', DashboardMetricViewSet)
router.register(r'reports', ReportViewSet)

urlpatterns = router.urls
