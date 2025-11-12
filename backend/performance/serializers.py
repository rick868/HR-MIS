from rest_framework import serializers
from .models import PerformanceReview, Goal, KPI


class PerformanceReviewSerializer(serializers.ModelSerializer):
    """Serializer for PerformanceReview model."""

    employee_name = serializers.CharField(source='employee.name', read_only=True)
    reviewer_name = serializers.CharField(source='reviewer.name', read_only=True)

    class Meta:
        model = PerformanceReview
        fields = [
            'id', 'employee', 'employee_name', 'reviewer', 'reviewer_name',
            'review_type', 'review_date', 'review_period_start', 'review_period_end',
            'overall_score', 'overall_rating', 'technical_skills', 'communication',
            'teamwork', 'leadership', 'initiative', 'achievements',
            'areas_for_improvement', 'development_plan', 'reviewer_comments',
            'employee_comments', 'is_completed', 'employee_acknowledged',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PerformanceReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating performance reviews."""

    class Meta:
        model = PerformanceReview
        fields = [
            'employee', 'reviewer', 'review_type', 'review_date',
            'review_period_start', 'review_period_end', 'overall_score',
            'overall_rating', 'technical_skills', 'communication', 'teamwork',
            'leadership', 'initiative', 'achievements', 'areas_for_improvement',
            'development_plan', 'reviewer_comments'
        ]


class GoalSerializer(serializers.ModelSerializer):
    """Serializer for Goal model."""

    employee_name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model = Goal
        fields = [
            'id', 'employee', 'employee_name', 'title', 'description',
            'goal_type', 'status', 'start_date', 'target_completion_date',
            'actual_completion_date', 'progress_percentage', 'progress_notes',
            'performance_review', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class GoalCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating goals."""

    class Meta:
        model = Goal
        fields = [
            'employee', 'title', 'description', 'goal_type', 'start_date',
            'target_completion_date'
        ]


class KPISerializer(serializers.ModelSerializer):
    """Serializer for KPI model."""

    employee_name = serializers.CharField(source='employee.name', read_only=True)
    achievement_percentage = serializers.ReadOnlyField()

    class Meta:
        model = KPI
        fields = [
            'id', 'employee', 'employee_name', 'title', 'description',
            'category', 'metric_type', 'target_value', 'current_value',
            'unit', 'period_start', 'period_end', 'weight',
            'achievement_percentage', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'achievement_percentage', 'created_at', 'updated_at']


class KPICreateSerializer(serializers.ModelSerializer):
    """Serializer for creating KPIs."""

    class Meta:
        model = KPI
        fields = [
            'employee', 'title', 'description', 'category', 'metric_type',
            'target_value', 'unit', 'period_start', 'period_end', 'weight'
        ]
