from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'email', 'phone', 'department', 'role',
            'performance_score', 'attendance_rate', 'status', 'initials',
            'created_at', 'updated_at'
        ]


