from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Avg, Count
from django.utils import timezone
from datetime import timedelta
from .models import DashboardMetric, Report
from .serializers import DashboardMetricSerializer, ReportSerializer, ReportCreateSerializer


class DashboardMetricViewSet(viewsets.ModelViewSet):
    """ViewSet for DashboardMetric model."""

    queryset = DashboardMetric.objects.filter(is_active=True)
    serializer_class = DashboardMetricSerializer

    @action(detail=False, methods=['get'])
    def dashboard_data(self, request):
        """Get all active dashboard metrics."""
        metrics = self.get_queryset()
        serializer = self.get_serializer(metrics, many=True)
        return Response(serializer.data)


class ReportViewSet(viewsets.ModelViewSet):
    """ViewSet for Report model."""

    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get_serializer_class(self):
        if self.action == 'create':
            return ReportCreateSerializer
        return ReportSerializer

    @action(detail=True, methods=['post'])
    def generate(self, request, pk=None):
        """Generate a report."""
        report = self.get_object()
        # In a real implementation, this would generate the actual report file
        # For now, just mark as generated
        report.status = 'Generated'
        report.generated_at = timezone.now()
        report.save()
        serializer = self.get_serializer(report)
        return Response(serializer.data)
