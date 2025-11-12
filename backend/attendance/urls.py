from rest_framework.routers import DefaultRouter
from .views import AttendanceRecordViewSet, LeaveRequestViewSet, WorkScheduleViewSet

router = DefaultRouter()
router.register(r'attendance-records', AttendanceRecordViewSet)
router.register(r'leave-requests', LeaveRequestViewSet)
router.register(r'work-schedules', WorkScheduleViewSet)

urlpatterns = router.urls
