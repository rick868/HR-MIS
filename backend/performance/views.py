from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def summary(request):
    employees = [
        {"id": 1, "name": "Sarah Johnson", "department": "Engineering", "score": 94, "attendance": 98, "taskQuality": 96, "teamwork": 92, "trend": "up", "recommendation": "Promotion"},
        {"id": 2, "name": "Michael Chen", "department": "Sales", "score": 89, "attendance": 92, "taskQuality": 90, "teamwork": 85, "trend": "up", "recommendation": "Bonus"},
    ]
    performance_categories = [
        {"category": "Punctuality", "weight": 30, "score": 92},
        {"category": "Task Quality", "weight": 40, "score": 88},
        {"category": "Teamwork", "weight": 30, "score": 85},
    ]
    skill_gap_data = [
        {"skill": "Leadership", "current": 75, "required": 90},
        {"skill": "Technical", "current": 88, "required": 85},
    ]
    return Response({
        "employees": employees,
        "performanceCategories": performance_categories,
        "skillGapData": skill_gap_data,
    })

# Create your views here.
