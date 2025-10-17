from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def summary(request):
    """Return analytics datasets used by the Analytics page."""
    turnover_prediction = [
        {"month": "Jul", "predicted": 3, "actual": 2},
        {"month": "Aug", "predicted": 4, "actual": 3},
        {"month": "Sep", "predicted": 2, "actual": 2},
        {"month": "Oct", "predicted": 5, "actual": None},
        {"month": "Nov", "predicted": 3, "actual": None},
        {"month": "Dec", "predicted": 4, "actual": None},
    ]

    payroll_forecast = [
        {"month": "Jul", "amount": 485000, "forecast": 490000},
        {"month": "Aug", "amount": 492000, "forecast": 495000},
        {"month": "Sep", "amount": 488000, "forecast": 500000},
        {"month": "Oct", "amount": None, "forecast": 510000},
        {"month": "Nov", "amount": None, "forecast": 515000},
        {"month": "Dec", "amount": None, "forecast": 525000},
    ]

    performance_vs_salary = [
        {"name": "Eng-1", "performance": 94, "salary": 95000, "size": 3},
        {"name": "Sales-1", "performance": 89, "salary": 82000, "size": 2.5},
        {"name": "Mkt-1", "performance": 72, "salary": 78000, "size": 1.8},
        {"name": "Eng-2", "performance": 91, "salary": 88000, "size": 2.8},
        {"name": "Fin-1", "performance": 86, "salary": 85000, "size": 2.4},
        {"name": "HR-1", "performance": 90, "salary": 75000, "size": 2.6},
        {"name": "Sales-2", "performance": 78, "salary": 92000, "size": 2},
    ]

    training_roi = [
        {"program": "Leadership", "cost": 15000, "improvement": 18, "roi": 120},
        {"program": "Technical", "cost": 22000, "improvement": 25, "roi": 145},
        {"program": "Communication", "cost": 8000, "improvement": 12, "roi": 95},
        {"program": "Analytics", "cost": 18000, "improvement": 22, "roi": 135},
        {"program": "Project Mgmt", "cost": 12000, "improvement": 15, "roi": 110},
    ]

    attrition_risk = [
        {"name": "Sarah Johnson", "department": "Engineering", "risk": 15, "reason": "Low engagement"},
        {"name": "Emily Rodriguez", "department": "Marketing", "risk": 68, "reason": "Performance drop + absences"},
        {"name": "David Kim", "department": "Engineering", "risk": 22, "reason": "Market opportunities"},
        {"name": "Lisa Thompson", "department": "Finance", "risk": 54, "reason": "Frequent absences"},
        {"name": "Michael Chen", "department": "Sales", "risk": 28, "reason": "High overtime"},
    ]

    return Response({
        "turnoverPrediction": turnover_prediction,
        "payrollForecast": payroll_forecast,
        "performanceVsSalary": performance_vs_salary,
        "trainingROI": training_roi,
        "attritionRisk": attrition_risk,
    })

# Create your views here.
