from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_list(request):
    """
    Temporary employees list endpoint returning sample data.
    Replace with database-backed implementation later.
    """
    data = [
        {
            "id": 1,
            "name": "Sarah Johnson",
            "email": "sarah.j@company.com",
            "phone": "+1 234-567-8901",
            "department": "Engineering",
            "role": "Senior Developer",
            "performanceScore": 94,
            "attendanceRate": 98,
            "status": "Active",
            "initials": "SJ",
        },
        {
            "id": 2,
            "name": "Michael Chen",
            "email": "michael.c@company.com",
            "phone": "+1 234-567-8902",
            "department": "Sales",
            "role": "Sales Manager",
            "performanceScore": 89,
            "attendanceRate": 92,
            "status": "Active",
            "initials": "MC",
        },
    ]
    return Response({"results": data})

# Create your views here.
