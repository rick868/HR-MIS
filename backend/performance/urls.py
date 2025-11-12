from rest_framework.routers import DefaultRouter
from .views import PerformanceReviewViewSet, GoalViewSet, KPIViewSet

router = DefaultRouter()
router.register(r'performance-reviews', PerformanceReviewViewSet)
router.register(r'goals', GoalViewSet)
router.register(r'kpis', KPIViewSet, basename='kpi')

urlpatterns = router.urls
