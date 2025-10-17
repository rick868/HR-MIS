from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def summary(request):
    attendance_records = [
        {"id": 1, "name": "Sarah Johnson", "department": "Engineering", "presentDays": 22, "leaveDays": 2, "absentDays": 0, "rate": 100, "pattern": "None", "status": "excellent"},
        {"id": 2, "name": "Michael Chen", "department": "Sales", "presentDays": 20, "leaveDays": 3, "absentDays": 1, "rate": 91, "pattern": "None", "status": "good"},
    ]
    monthly_trend = [
        {"month": "Jan", "attendance": 94, "leaves": 5, "absences": 1},
        {"month": "Feb", "attendance": 92, "leaves": 6, "absences": 2},
    ]
    department_attendance = [
        {"department": "Engineering", "rate": 96},
        {"department": "Sales", "rate": 91},
    ]
    leave_balances = [
        {"department": "Engineering", "available": 180, "used": 45},
        {"department": "Sales", "available": 128, "used": 52},
    ]
    return Response({
        "attendanceRecords": attendance_records,
        "monthlyTrend": monthly_trend,
        "departmentAttendance": department_attendance,
        "leaveBalances": leave_balances,
    })

# Create your views here.
