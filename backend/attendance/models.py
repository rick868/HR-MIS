from django.db import models
from django.utils.translation import gettext_lazy as _
from employees.models import Employee


class AttendanceRecord(models.Model):
    """Tracks employee attendance records."""

    class AttendanceStatus(models.TextChoices):
        PRESENT = 'Present', _('Present')
        ABSENT = 'Absent', _('Absent')
        LATE = 'Late', _('Late')
        HALF_DAY = 'Half Day', _('Half Day')

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='attendance_records')
    date = models.DateField(_('date'))
    check_in_time = models.TimeField(_('check in time'), null=True, blank=True)
    check_out_time = models.TimeField(_('check out time'), null=True, blank=True)
    status = models.CharField(_('status'), max_length=20, choices=AttendanceStatus.choices, default=AttendanceStatus.PRESENT)
    hours_worked = models.DecimalField(_('hours worked'), max_digits=5, decimal_places=2, default=0)
    notes = models.TextField(_('notes'), blank=True)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['-date', '-created_at']
        unique_together = ['employee', 'date']

    def __str__(self):
        return f"{self.employee.name} - {self.date} ({self.status})"


class LeaveRequest(models.Model):
    """Manages employee leave requests."""

    class LeaveType(models.TextChoices):
        ANNUAL = 'Annual', _('Annual Leave')
        SICK = 'Sick', _('Sick Leave')
        MATERNITY = 'Maternity', _('Maternity Leave')
        PATERNITY = 'Paternity', _('Paternity Leave')
        EMERGENCY = 'Emergency', _('Emergency Leave')
        OTHER = 'Other', _('Other')

    class LeaveStatus(models.TextChoices):
        PENDING = 'Pending', _('Pending')
        APPROVED = 'Approved', _('Approved')
        REJECTED = 'Rejected', _('Rejected')
        CANCELLED = 'Cancelled', _('Cancelled')

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(_('leave type'), max_length=20, choices=LeaveType.choices)
    start_date = models.DateField(_('start date'))
    end_date = models.DateField(_('end date'))
    days_requested = models.PositiveIntegerField(_('days requested'))
    reason = models.TextField(_('reason'))
    status = models.CharField(_('status'), max_length=20, choices=LeaveStatus.choices, default=LeaveStatus.PENDING)
    approved_by = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_leaves')
    approval_date = models.DateTimeField(_('approval date'), null=True, blank=True)
    rejection_reason = models.TextField(_('rejection reason'), blank=True)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.employee.name} - {self.leave_type} ({self.start_date} to {self.end_date})"


class WorkSchedule(models.Model):
    """Defines employee work schedules."""

    class ScheduleType(models.TextChoices):
        FULL_TIME = 'Full Time', _('Full Time')
        PART_TIME = 'Part Time', _('Part Time')
        FLEXIBLE = 'Flexible', _('Flexible')

    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, related_name='work_schedule')
    schedule_type = models.CharField(_('schedule type'), max_length=20, choices=ScheduleType.choices, default=ScheduleType.FULL_TIME)
    work_days = models.CharField(_('work days'), max_length=20, default='Monday-Friday')  # e.g., "Monday-Friday"
    start_time = models.TimeField(_('start time'), default='09:00')
    end_time = models.TimeField(_('end time'), default='17:00')
    break_duration = models.PositiveIntegerField(_('break duration (minutes)'), default=60)
    overtime_allowed = models.BooleanField(_('overtime allowed'), default=True)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    def __str__(self):
        return f"{self.employee.name} - {self.schedule_type}"
