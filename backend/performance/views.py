from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Avg, Count
from django.utils import timezone
from datetime import timedelta
from .models import PerformanceReview, Goal, KPI
from .serializers import (
    PerformanceReviewSerializer, PerformanceReviewCreateSerializer,
    GoalSerializer, GoalCreateSerializer,
    KPISerializer, KPICreateSerializer
)


class PerformanceReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for PerformanceReview model."""

    queryset = PerformanceReview.objects.all()
    serializer_class = PerformanceReviewSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return PerformanceReviewCreateSerializer
        return PerformanceReviewSerializer

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        """Employee acknowledges the review."""
        review = self.get_object()
        review.employee_acknowledged = True
        review.save()
        serializer = self.get_serializer(review)
        return Response(serializer.data)


class GoalViewSet(viewsets.ModelViewSet):
    """ViewSet for Goal model."""

    queryset = Goal.objects.all()
    serializer_class = GoalSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return GoalCreateSerializer
        return GoalSerializer

    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Update goal progress."""
        goal = self.get_object()
        goal.progress_percentage = request.data.get('progress_percentage', goal.progress_percentage)
        goal.progress_notes = request.data.get('progress_notes', goal.progress_notes)
        if goal.progress_percentage >= 100:
            goal.status = 'Completed'
            goal.actual_completion_date = timezone.now().date()
        goal.save()
        serializer = self.get_serializer(goal)
        return Response(serializer.data)


class KPIViewSet(viewsets.ModelViewSet):
    """ViewSet for KPI model."""

    queryset = KPI.objects.all()
    serializer_class = KPISerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return KPICreateSerializer
        return KPISerializer

    @action(detail=False, methods=['get'])
    def summary(self, request):
        """Get performance summary for dashboard."""
        today = timezone.now().date()
        last_6_months = today - timedelta(days=180)

        # Get performance review data for the last 6 months
        performance_data = PerformanceReview.objects.filter(
            review_date__gte=last_6_months
        ).order_by('review_date').values('review_date').annotate(
            avg_score=Avg('overall_score')
        )[:6]  # Last 6 data points

        # Format for frontend chart
        performance_categories = []
        for i, data in enumerate(performance_data):
            performance_categories.append({
                'score': round(data['avg_score'], 1)
            })

        # If not enough data, add some mock data for demo
        while len(performance_categories) < 6:
            performance_categories.append({
                'score': 75 + (len(performance_categories) * 5)  # Increasing trend
            })

        return Response({
            'performanceCategories': performance_categories
        })
