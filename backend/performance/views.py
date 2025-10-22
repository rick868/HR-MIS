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
    """Compute expanded performance analysis across multiple categories.

    Input (optional JSON body): {
      employees: [{ name, department, score, attendance, taskQuality, teamwork }],
      weights?: { job_performance?: number, behavioral?: number, attendance?: number,
                  learning?: number, leadership?: number, customer?: number,
                  innovation?: number, cultural?: number }
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

    # Category weights (sum to 1.0)
    weights = payload.get('weights') or {}
    category_weights = {
        "job_performance": float(weights.get('job_performance', 0.4)),
        "behavioral": float(weights.get('behavioral', 0.15)),
        "attendance": float(weights.get('attendance', 0.1)),
        "learning": float(weights.get('learning', 0.1)),
        "leadership": float(weights.get('leadership', 0.1)),
        "customer": float(weights.get('customer', 0.075)),
        "innovation": float(weights.get('innovation', 0.05)),
        "cultural": float(weights.get('cultural', 0.025)),
    }
    total_w = sum(category_weights.values()) or 1.0
    for k in category_weights:
        category_weights[k] = category_weights[k] / total_w

    analyzed = []
    dept_totals = {}
    for e in employees:
        # Per-category scoring (0-100) using available inputs; placeholders default to 0
        job_performance = round((e.get('score', 0) * 0.6) + (e.get('taskQuality', 0) * 0.4), 1)
        behavioral = round((e.get('teamwork', 0) * 0.7) + (min(e.get('score', 0), 100) * 0.3), 1)
        attendance = float(e.get('attendance', 0))
        learning = 0.0  # integrate LMS: completed trainings, skill gains
        leadership = 0.0  # for supervisors: team outcomes, decision quality
        customer = 0.0  # CRM/CSAT inputs
        innovation = 0.0  # ideas submitted/implemented
        cultural = 0.0  # participation & sentiment alignment

        per_category = {
            "job_performance": job_performance,
            "behavioral": behavioral,
            "attendance": attendance,
            "learning": learning,
            "leadership": leadership,
            "customer": customer,
            "innovation": innovation,
            "cultural": cultural,
        }

        total = sum(per_category[c] * category_weights[c] for c in category_weights)

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
            "categories": per_category,
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

    # Calibration bands and risk flags
    calibration_bands = {"Outstanding": 0, "Strong": 0, "Solid": 0, "Concern": 0}
    risk_employees = []
    for e in analyzed:
        c = e["composite"]
        if c >= 90:
            calibration_bands["Outstanding"] += 1
        elif c >= 80:
            calibration_bands["Strong"] += 1
        elif c >= 70:
            calibration_bands["Solid"] += 1
        else:
            calibration_bands["Concern"] += 1

        # simple risk: low attendance or low behavioral category
        behavioral_score = e.get("categories", {}).get("behavioral", 0)
        if (e.get("attendance", 100) < 85) or (behavioral_score < 70):
            risk_employees.append({"name": e["name"], "department": e["department"], "composite": e["composite"]})

    # Simple correlation between attendance and composite (Pearson)
    def pearson(xs, ys):
        n = len(xs)
        if n == 0:
            return 0.0
        mean_x = sum(xs) / n
        mean_y = sum(ys) / n
        num = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))
        den_x = (sum((x - mean_x) ** 2 for x in xs) or 1.0) ** 0.5
        den_y = (sum((y - mean_y) ** 2 for y in ys) or 1.0) ** 0.5
        return round(num / (den_x * den_y), 3)

    corr_attendance_composite = pearson([e.get("attendance", 0) for e in analyzed], [e["composite"] for e in analyzed])

    category_definitions = {
        "job_performance": {
            "title": "Job Performance & Results",
            "purpose": "Assess effectiveness in core responsibilities and goals.",
            "metrics": [
                "Task completion rate (PM tools)",
                "KPI/OKR attainment",
                "Work quality (reviews/audits)",
                "Efficiency vs estimates",
            ],
            "features": [
                "Auto-sync with task/OKR tools",
                "Weighted scoring (~40%)",
                "Trend dashboards",
                "AI productivity insights",
            ],
        },
        "behavioral": {
            "title": "Behavioral & Soft Skills",
            "purpose": "Evaluate interpersonal effectiveness and adaptability.",
            "metrics": [
                "360° communication feedback",
                "Initiative logs",
                "Teamwork/engagement",
            ],
            "features": [
                "NLP sentiment on comments",
                "Comparative dashboards",
                "Balanced qual/quant scoring",
            ],
        },
        "attendance": {
            "title": "Attendance & Reliability",
            "purpose": "Measure punctuality and dependability.",
            "metrics": [
                "Attendance rate",
                "Late check-ins",
                "Leave balances & trends",
            ],
            "features": [
                "Real-time viz & alerts",
                "Payroll linkage",
                "Configurable thresholds",
            ],
        },
        "learning": {
            "title": "Learning & Growth",
            "purpose": "Assess professional development and skill gains.",
            "metrics": [
                "Completed trainings (LMS)",
                "Skill assessments",
                "Application of new skills",
            ],
            "features": [
                "AI course recommendations",
                "External platform integration",
                "ROI/growth dashboards",
            ],
        },
        "leadership": {
            "title": "Leadership & Management",
            "purpose": "Evaluate managerial competence and team outcomes.",
            "metrics": [
                "Team performance average",
                "Decision quality ratings",
                "Conflict resolution & morale",
            ],
            "features": [
                "Leadership analytics",
                "Real-time gap alerts",
                "Coaching recommendations",
            ],
        },
        "customer": {
            "title": "Customer/Stakeholder Satisfaction",
            "purpose": "Integrate external perspectives into evaluation.",
            "metrics": [
                "CSAT/NPS ratings (CRM)",
                "Response/resolution time",
                "Relationship feedback",
            ],
            "features": [
                "CRM integration",
                "Role-weighted factor",
                "Predictive correlation analysis",
            ],
        },
        "innovation": {
            "title": "Innovation & Continuous Improvement",
            "purpose": "Encourage creative problem-solving.",
            "metrics": [
                "Ideas submitted",
                "Approved/implemented",
                "Efficiency gains",
            ],
            "features": [
                "Innovation leaderboard",
                "Idea tracking",
                "Gamified rewards",
            ],
        },
        "cultural": {
            "title": "Cultural & Organizational Alignment",
            "purpose": "Measure alignment with values and culture.",
            "metrics": [
                "Program participation",
                "Value alignment sentiment",
                "Recognition & awards",
            ],
            "features": [
                "Culture index viz",
                "Recognition reminders",
                "Engagement-retention analytics",
            ],
        },
    }

    return Response({
        "employees": analyzed,
        "deptAverages": dept_averages,
        "insights": insights,
        "categoryWeights": category_weights,
        "categoryDefinitions": category_definitions,
        "calibrationBands": calibration_bands,
        "riskEmployees": risk_employees,
        "correlations": {"attendance_vs_overall": corr_attendance_composite},
    })

# Create your views here.
