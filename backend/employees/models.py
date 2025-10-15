from django.db import models
from django.utils.translation import gettext_lazy as _


class Employee(models.Model):
    """Basic employee profile used by the dashboard and directory."""

    class EmploymentStatus(models.TextChoices):
        ACTIVE = 'Active', _('Active')
        INACTIVE = 'Inactive', _('Inactive')
        ON_LEAVE = 'On Leave', _('On Leave')

    name = models.CharField(_('name'), max_length=150)
    email = models.EmailField(_('email'), unique=True)
    phone = models.CharField(_('phone'), max_length=30, blank=True)
    department = models.CharField(_('department'), max_length=100, blank=True)
    role = models.CharField(_('role'), max_length=100, blank=True)

    performance_score = models.PositiveSmallIntegerField(_('performance score'), default=0)
    attendance_rate = models.PositiveSmallIntegerField(_('attendance rate'), default=0)
    status = models.CharField(_('status'), max_length=20, choices=EmploymentStatus.choices, default=EmploymentStatus.ACTIVE)

    initials = models.CharField(_('initials'), max_length=4, blank=True)

    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.name}"
