from django.db import models
from django.utils.translation import gettext_lazy as _


class DashboardMetric(models.Model):
    """Stores dashboard metrics for analytics."""

    class MetricType(models.TextChoices):
        EMPLOYEE_COUNT = 'Employee Count', _('Employee Count')
        ATTENDANCE_RATE = 'Attendance Rate', _('Attendance Rate')
        PERFORMANCE_SCORE = 'Performance Score', _('Performance Score')
        TURNOVER_RATE = 'Turnover Rate', _('Turnover Rate')
        LEAVE_UTILIZATION = 'Leave Utilization', _('Leave Utilization')
        TRAINING_COMPLETION = 'Training Completion', _('Training Completion')
        CUSTOM = 'Custom', _('Custom')

    class MetricCategory(models.TextChoices):
        HEADCOUNT = 'Headcount', _('Headcount')
        ATTENDANCE = 'Attendance', _('Attendance')
        PERFORMANCE = 'Performance', _('Performance')
        ENGAGEMENT = 'Engagement', _('Engagement')
        FINANCIAL = 'Financial', _('Financial')
        OTHER = 'Other', _('Other')

    title = models.CharField(_('title'), max_length=100)
    metric_type = models.CharField(_('metric type'), max_length=30, choices=MetricType.choices)
    category = models.CharField(_('category'), max_length=20, choices=MetricCategory.choices)
    value = models.DecimalField(_('value'), max_digits=10, decimal_places=2)
    unit = models.CharField(_('unit'), max_length=20, blank=True)  # e.g., "%", "count", "$"
    description = models.TextField(_('description'), blank=True)

    # Date range for the metric
    date_recorded = models.DateField(_('date recorded'))
    period_start = models.DateField(_('period start'), null=True, blank=True)
    period_end = models.DateField(_('period end'), null=True, blank=True)

    # Department filter (optional)
    department = models.CharField(_('department'), max_length=100, blank=True)

    # Metadata
    is_active = models.BooleanField(_('is active'), default=True)
    data_source = models.CharField(_('data source'), max_length=100, blank=True)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['-date_recorded']
        indexes = [
            models.Index(fields=['metric_type', 'date_recorded']),
            models.Index(fields=['category', 'department']),
        ]

    def __str__(self):
        return f"{self.title} - {self.value}{self.unit}"


class Report(models.Model):
    """Generated reports for HR analytics."""

    class ReportType(models.TextChoices):
        DASHBOARD = 'Dashboard', _('Dashboard Summary')
        EMPLOYEE_ANALYTICS = 'Employee Analytics', _('Employee Analytics')
        ATTENDANCE_REPORT = 'Attendance Report', _('Attendance Report')
        PERFORMANCE_REPORT = 'Performance Report', _('Performance Report')
        TURNOVER_ANALYSIS = 'Turnover Analysis', _('Turnover Analysis')
        CUSTOM = 'Custom', _('Custom Report')

    class ReportStatus(models.TextChoices):
        DRAFT = 'Draft', _('Draft')
        GENERATED = 'Generated', _('Generated')
        SCHEDULED = 'Scheduled', _('Scheduled')
        FAILED = 'Failed', _('Failed')

    title = models.CharField(_('title'), max_length=200)
    report_type = models.CharField(_('report type'), max_length=30, choices=ReportType.choices)
    description = models.TextField(_('description'), blank=True)
    status = models.CharField(_('status'), max_length=20, choices=ReportStatus.choices, default=ReportStatus.DRAFT)

    # Report parameters
    parameters = models.JSONField(_('parameters'), default=dict, blank=True)  # Store filter parameters as JSON
    date_range_start = models.DateField(_('date range start'), null=True, blank=True)
    date_range_end = models.DateField(_('date range end'), null=True, blank=True)

    # Generated content
    file_path = models.FileField(_('file path'), upload_to='reports/', null=True, blank=True)
    file_size = models.PositiveIntegerField(_('file size'), null=True, blank=True)
    generated_at = models.DateTimeField(_('generated at'), null=True, blank=True)

    # Scheduling
    is_scheduled = models.BooleanField(_('is scheduled'), default=False)
    schedule_frequency = models.CharField(_('schedule frequency'), max_length=20, blank=True)  # e.g., "weekly", "monthly"
    next_run = models.DateTimeField(_('next run'), null=True, blank=True)

    # Metadata
    created_by = models.CharField(_('created by'), max_length=100, blank=True)
    format = models.CharField(_('format'), max_length=10, default='pdf')  # pdf, csv, xlsx

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} ({self.report_type})"
