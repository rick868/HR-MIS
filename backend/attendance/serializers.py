from rest_framework import serializers
from .models import AttendanceRecord, LeaveRequest, WorkSchedule


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """Serializer for AttendanceRecord model."""

    employee_name = serializers.CharField(source='employee.name', read_only=True)
    employee_department = serializers.CharField(source='employee.department', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'employee', 'employee_name', 'employee_department',
            'date', 'check_in_time', 'check_out_time', 'status',
            'hours_worked', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class AttendanceRecordCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating attendance records."""

    class Meta:
        model = AttendanceRecord
        fields = [
            'employee', 'date', 'check_in_time', 'check_out_time',
            'status', 'hours_worked', 'notes'
        ]

    def validate(self, data):
        # Ensure no duplicate attendance for same employee and date
        employee = data.get('employee')
        date = data.get('date')
        if AttendanceRecord.objects.filter(employee=employee, date=date).exists():
            raise serializers.ValidationError("Attendance record already exists for this employee on this date.")
        return data


class LeaveRequestSerializer(serializers.ModelSerializer):
    """Serializer for LeaveRequest model."""

    employee_name = serializers.CharField(source='employee.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.name', read_only=True)

    class Meta:
        model = LeaveRequest
        fields = [
            'id', 'employee', 'employee_name', 'leave_type', 'start_date',
            'end_date', 'days_requested', 'reason', 'status', 'approved_by',
            'approved_by_name', 'approval_date', 'rejection_reason',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'approved_by', 'approved_by_name', 'approval_date', 'created_at', 'updated_at']


class LeaveRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating leave requests."""

    class Meta:
        model = LeaveRequest
        fields = ['employee', 'leave_type', 'start_date', 'end_date', 'days_requested', 'reason']

    def validate(self, data):
        if data['start_date'] > data['end_date']:
            raise serializers.ValidationError("Start date cannot be after end date.")
        return data


class WorkScheduleSerializer(serializers.ModelSerializer):
    """Serializer for WorkSchedule model."""

    employee_name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = WorkSchedule
        fields = [
            'id', 'employee', 'employee_name', 'schedule_type', 'work_days',
            'start_time', 'end_time', 'break_duration', 'overtime_allowed',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
