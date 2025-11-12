from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import timedelta
from .models import AttendanceRecord, LeaveRequest, WorkSchedule
from .serializers import (
    AttendanceRecordSerializer, AttendanceRecordCreateSerializer,
    LeaveRequestSerializer, LeaveRequestCreateSerializer,
    WorkScheduleSerializer
)


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    """ViewSet for AttendanceRecord model."""

    queryset = AttendanceRecord.objects.all()
    serializer_class = AttendanceRecordSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return AttendanceRecordCreateSerializer
        return AttendanceRecordSerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get attendance summary for dashboard."""
        today = timezone.now().date()
        month_start = today.replace(day=1)
        last_30_days = today - timedelta(days=30)

        # Department attendance data
        department_data = AttendanceRecord.objects.filter(
            date__gte=last_30_days
        ).values('employee__department').annotate(
            total_records=Count('id'),
            present_count=Count('id', filter=Q(status='Present')),
            attendance_rate=Avg('hours_worked')  # Simplified calculation
        ).filter(employee__department__isnull=False)

        # Format for frontend
        departments = []
        for dept in department_data:
            rate = (dept['present_count'] / dept['total_records'] * 100) if dept['total_records'] > 0 else 0
            departments.append({
                'department': dept['employee__department'],
                'performance': round(rate, 1),  # Using attendance rate as performance
                'headcount': dept['total_records']
            })

        return Response({
            'departmentAttendance': departments
        })


class LeaveRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for LeaveRequest model."""

    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return LeaveRequestCreateSerializer
        return LeaveRequestSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a leave request."""
        leave_request = self.get_object()
        leave_request.status = 'Approved'
        leave_request.approved_by = request.user.employee_profile  # Assuming user has employee profile
        leave_request.approval_date = timezone.now()
        leave_request.save()
        serializer = self.get_serializer(leave_request)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a leave request."""
        leave_request = self.get_object()
        leave_request.status = 'Rejected'
        leave_request.rejection_reason = request.data.get('reason', '')
        leave_request.save()
        serializer = self.get_serializer(leave_request)
        return Response(serializer.data)


class WorkScheduleViewSet(viewsets.ModelViewSet):
    """ViewSet for WorkSchedule model."""

    queryset = WorkSchedule.objects.all()
    serializer_class = WorkScheduleSerializer
