from rest_framework import serializers
from .models import DashboardMetric, Report


class DashboardMetricSerializer(serializers.ModelSerializer):
    """Serializer for DashboardMetric model."""

    class Meta:
        model = DashboardMetric
        fields = [
            'id', 'title', 'metric_type', 'category', 'value', 'unit',
            'description', 'date_recorded', 'period_start', 'period_end',
            'department', 'is_active', 'data_source', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ReportSerializer(serializers.ModelSerializer):
    """Serializer for Report model."""

    class Meta:
        model = Report
        fields = [
            'id', 'title', 'report_type', 'description', 'status',
            'parameters', 'date_range_start', 'date_range_end', 'file_path',
            'file_size', 'generated_at', 'is_scheduled', 'schedule_frequency',
            'next_run', 'created_by', 'format', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'file_path', 'file_size', 'generated_at', 'created_at', 'updated_at']


class ReportCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating reports."""

    class Meta:
        model = Report
        fields = [
            'title', 'report_type', 'description', 'parameters',
            'date_range_start', 'date_range_end', 'is_scheduled',
            'schedule_frequency', 'created_by', 'format'
        ]
