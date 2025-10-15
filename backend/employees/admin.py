from django.contrib import admin
from .models import Employee


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "department", "role", "status")
    search_fields = ("name", "email", "department", "role")
    list_filter = ("status", "department")
