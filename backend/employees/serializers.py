from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for Employee model."""

    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'email', 'phone', 'department', 'role',
            'performance_score', 'attendance_rate', 'status', 'initials',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class EmployeeCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating employees."""

    class Meta:
        model = Employee
        fields = [
            'name', 'email', 'phone', 'department', 'role',
            'performance_score', 'attendance_rate', 'status'
        ]

    def create(self, validated_data):
        # Generate initials from name
        name = validated_data.get('name', '')
        words = name.split()
        initials = ''.join(word[0].upper() for word in words if word)[:4]
        validated_data['initials'] = initials
        return super().create(validated_data)


class EmployeeListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for employee lists."""

    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'email', 'department', 'role',
            'performance_score', 'attendance_rate', 'status', 'initials'
        ]
