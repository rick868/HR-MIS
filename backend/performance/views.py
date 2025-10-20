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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review(request):
    """Compute simple performance analysis based on provided (or sample) data.

    Input (optional JSON body): {
      employees: [{ name, department, score, attendance, taskQuality, teamwork }]
    }
    """
    payload = request.data or {}
    employees = payload.get('employees')
    if not isinstance(employees, list):
        employees = [
            {"name": "Sarah Johnson", "department": "Engineering", "score": 94, "attendance": 98, "taskQuality": 96, "teamwork": 92},
            {"name": "Michael Chen", "department": "Sales", "score": 89, "attendance": 92, "taskQuality": 90, "teamwork": 85},
            {"name": "Emily Rodriguez", "department": "Marketing", "score": 72, "attendance": 85, "taskQuality": 70, "teamwork": 68},
            {"name": "David Kim", "department": "Engineering", "score": 91, "attendance": 95, "taskQuality": 93, "teamwork": 88},
            {"name": "Lisa Thompson", "department": "Finance", "score": 86, "attendance": 94, "taskQuality": 84, "teamwork": 82},
        ]

    # Weighted score components
    weight_score = 0.5
    weight_task_quality = 0.25
    weight_teamwork = 0.15
    weight_attendance = 0.10

    analyzed = []
    dept_totals = {}
    for e in employees:
        total = (
            (e.get('score', 0) * weight_score)
            + (e.get('taskQuality', 0) * weight_task_quality)
            + (e.get('teamwork', 0) * weight_teamwork)
            + (e.get('attendance', 0) * weight_attendance)
        )

        # Simple recommendation rules
        if total >= 90:
            recommendation = 'Promotion'
        elif total >= 80:
            recommendation = 'Bonus'
        elif total >= 70:
            recommendation = 'Training'
        else:
            recommendation = 'Performance Plan'

        analyzed.append({
            "name": e.get('name'),
            "department": e.get('department'),
            "composite": round(total, 1),
            "score": e.get('score'),
            "taskQuality": e.get('taskQuality'),
            "teamwork": e.get('teamwork'),
            "attendance": e.get('attendance'),
            "recommendation": recommendation,
        })

        dept = e.get('department') or 'Unknown'
        d = dept_totals.setdefault(dept, {"sum": 0.0, "count": 0})
        d["sum"] += total
        d["count"] += 1

    # Department averages
    dept_averages = sorted(
        (
            {"department": k, "average": round(v["sum"] / max(v["count"], 1), 1)}
            for k, v in dept_totals.items()
        ),
        key=lambda x: x["average"], reverse=True
    )

    # Insights
    top_performers = sorted(analyzed, key=lambda x: x["composite"], reverse=True)[:3]
    needs_attention = [e for e in analyzed if e["composite"] < 70]

    insights = [
        {
            "title": "Top Performers",
            "items": [f"{e['name']} ({e['department']}) — {e['composite']}" for e in top_performers],
        },
        {
            "title": "Needs Attention",
            "items": [f"{e['name']} ({e['department']}) — {e['composite']}" for e in needs_attention],
        },
        {
            "title": "Department Averages",
            "items": [f"{d['department']}: {d['average']}" for d in dept_averages],
        },
    ]

    return Response({
        "employees": analyzed,
        "deptAverages": dept_averages,
        "insights": insights,
    })

# Create your views here.
