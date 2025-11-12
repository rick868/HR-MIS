from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from employees.models import Employee


class PerformanceReview(models.Model):
    """Tracks employee performance reviews."""

    class ReviewType(models.TextChoices):
        ANNUAL = 'Annual', _('Annual Review')
        MID_YEAR = 'Mid Year', _('Mid Year Review')
        PROBATION = 'Probation', _('Probation Review')
        PROJECT = 'Project', _('Project Review')
        AD_HOC = 'Ad Hoc', _('Ad Hoc Review')

    class OverallRating(models.TextChoices):
        EXCELLENT = 'Excellent', _('Excellent')
        GOOD = 'Good', _('Good')
        SATISFACTORY = 'Satisfactory', _('Satisfactory')
        NEEDS_IMPROVEMENT = 'Needs Improvement', _('Needs Improvement')
        UNSATISFACTORY = 'Unsatisfactory', _('Unsatisfactory')

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='performance_reviews')
    reviewer = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True, related_name='reviews_given')
    review_type = models.CharField(_('review type'), max_length=20, choices=ReviewType.choices)
    review_date = models.DateField(_('review date'))
    review_period_start = models.DateField(_('review period start'))
    review_period_end = models.DateField(_('review period end'))

    # Ratings (0-100 scale)
    overall_score = models.PositiveIntegerField(_('overall score'), validators=[MinValueValidator(0), MaxValueValidator(100)])
    overall_rating = models.CharField(_('overall rating'), max_length=20, choices=OverallRating.choices)

    # Detailed scores
    technical_skills = models.PositiveIntegerField(_('technical skills'), validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    communication = models.PositiveIntegerField(_('communication'), validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    teamwork = models.PositiveIntegerField(_('teamwork'), validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    leadership = models.PositiveIntegerField(_('leadership'), validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)
    initiative = models.PositiveIntegerField(_('initiative'), validators=[MinValueValidator(0), MaxValueValidator(100)], null=True, blank=True)

    # Review content
    achievements = models.TextField(_('achievements'), blank=True)
    areas_for_improvement = models.TextField(_('areas for improvement'), blank=True)
    development_plan = models.TextField(_('development plan'), blank=True)
    reviewer_comments = models.TextField(_('reviewer comments'), blank=True)
    employee_comments = models.TextField(_('employee comments'), blank=True)

    # Status
    is_completed = models.BooleanField(_('is completed'), default=False)
    employee_acknowledged = models.BooleanField(_('employee acknowledged'), default=False)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['-review_date']

    def __str__(self):
        return f"{self.employee.name} - {self.review_type} ({self.review_date})"


class Goal(models.Model):
    """Tracks employee goals and objectives."""

    class GoalStatus(models.TextChoices):
        DRAFT = 'Draft', _('Draft')
        ACTIVE = 'Active', _('Active')
        COMPLETED = 'Completed', _('Completed')
        CANCELLED = 'Cancelled', _('Cancelled')
        OVERDUE = 'Overdue', _('Overdue')

    class GoalType(models.TextChoices):
        INDIVIDUAL = 'Individual', _('Individual')
        TEAM = 'Team', _('Team')
        DEPARTMENT = 'Department', _('Department')
        ORGANIZATIONAL = 'Organizational', _('Organizational')

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='goals')
    title = models.CharField(_('title'), max_length=200)
    description = models.TextField(_('description'))
    goal_type = models.CharField(_('goal type'), max_length=20, choices=GoalType.choices, default=GoalType.INDIVIDUAL)
    status = models.CharField(_('status'), max_length=20, choices=GoalStatus.choices, default=GoalStatus.DRAFT)

    # Timeline
    start_date = models.DateField(_('start date'))
    target_completion_date = models.DateField(_('target completion date'))
    actual_completion_date = models.DateField(_('actual completion date'), null=True, blank=True)

    # Progress tracking
    progress_percentage = models.PositiveIntegerField(_('progress percentage'), default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    progress_notes = models.TextField(_('progress notes'), blank=True)

    # Associated review (optional)
    performance_review = models.ForeignKey(PerformanceReview, on_delete=models.SET_NULL, null=True, blank=True, related_name='goals')

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.employee.name} - {self.title}"


class KPI(models.Model):
    """Key Performance Indicators for employees."""

    class KPICategory(models.TextChoices):
        PRODUCTIVITY = 'Productivity', _('Productivity')
        QUALITY = 'Quality', _('Quality')
        EFFICIENCY = 'Efficiency', _('Efficiency')
        CUSTOMER_SATISFACTION = 'Customer Satisfaction', _('Customer Satisfaction')
        FINANCIAL = 'Financial', _('Financial')
        OTHER = 'Other', _('Other')

    class KPIMetric(models.TextChoices):
        PERCENTAGE = 'Percentage', _('Percentage')
        NUMBER = 'Number', _('Number')
        CURRENCY = 'Currency', _('Currency')
        RATIO = 'Ratio', _('Ratio')
        TIME = 'Time', _('Time')

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='kpis')
    title = models.CharField(_('title'), max_length=200)
    description = models.TextField(_('description'))
    category = models.CharField(_('category'), max_length=30, choices=KPICategory.choices)
    metric_type = models.CharField(_('metric type'), max_length=20, choices=KPIMetric.choices, default=KPIMetric.PERCENTAGE)

    # Target values
    target_value = models.DecimalField(_('target value'), max_digits=10, decimal_places=2)
    current_value = models.DecimalField(_('current value'), max_digits=10, decimal_places=2, default=0)
    unit = models.CharField(_('unit'), max_length=20, blank=True)  # e.g., "hours", "tasks", "%"

    # Period
    period_start = models.DateField(_('period start'))
    period_end = models.DateField(_('period end'))

    # Weight for overall performance calculation
    weight = models.DecimalField(_('weight'), max_digits=5, decimal_places=2, default=1.0, validators=[MinValueValidator(0)])

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['-period_end']

    def __str__(self):
        return f"{self.employee.name} - {self.title}"

    @property
    def achievement_percentage(self):
        """Calculate achievement percentage."""
        if self.target_value == 0:
            return 0
        return min(100, (self.current_value / self.target_value) * 100)
