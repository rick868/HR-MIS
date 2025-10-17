import MetricCard from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  TrendingUp,
  Calendar,
  DollarSign,
  AlertCircle,
  Brain,
  CheckCircle,
  Clock,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthHeaders } from "@/hooks/useAuthHeaders";

export default function Dashboard() {
  const { auth } = useAuthHeaders();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [perfResp, attnResp] = await Promise.all([
          apiFetch('/performance/summary/', { auth }),
          apiFetch('/attendance/summary/', { auth }),
        ]);
        if (perfResp.ok) {
          const p = await perfResp.json();
          if (isMounted) setPerformanceData((p.performanceCategories || []).map((x: any, i: number) => ({ month: `P${i + 1}`, score: x.score })));
        }
        if (attnResp.ok) {
          const a = await attnResp.json();
          if (isMounted) {
            setDepartmentData((a.departmentAttendance || []).map((x: any) => ({ name: x.department, performance: Math.round(80 + Math.random() * 20), headcount: Math.round(10 + Math.random() * 50) })));
            setAttendanceData([
              { name: 'Present', value: 89, color: 'hsl(var(--success))' },
              { name: 'Leave', value: 8, color: 'hsl(var(--warning))' },
              { name: 'Absent', value: 3, color: 'hsl(var(--destructive))' },
            ]);
          }
        }
        if (isMounted) setAiInsights([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [auth.accessToken]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Real-time HR intelligence and decision support system
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Employees"
          value="122"
          change={8}
          trend="up"
          icon={Users}
          variant="default"
        />
        <MetricCard
          title="Avg Performance Score"
          value="87.5"
          change={3.2}
          trend="up"
          icon={TrendingUp}
          variant="success"
        />
        <MetricCard
          title="Attendance Rate"
          value="94.2%"
          change={-1.5}
          trend="down"
          icon={Calendar}
          variant="warning"
        />
        <MetricCard
          title="Payroll Efficiency"
          value="92%"
          change={2.1}
          trend="up"
          icon={DollarSign}
          variant="success"
        />
      </div>

      {/* AI Insights Panel */}
      <Card className="shadow-elevated border-l-4 border-l-accent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            <CardTitle>AI Decision Intelligence</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className="flex items-start gap-3 rounded-lg border p-4 bg-gradient-card"
            >
              {insight.type === "warning" && (
                <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              )}
              {insight.type === "success" && (
                <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
              )}
              {insight.type === "info" && (
                <Brain className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="text-sm">{insight.message}</p>
              </div>
              <Badge
                variant={
                  insight.priority === "high"
                    ? "destructive"
                    : insight.priority === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {insight.priority}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Performance Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Company Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Performance Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Department Performance & Headcount</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="performance" fill="hsl(var(--primary))" name="Performance" />
                <Bar dataKey="headcount" fill="hsl(var(--accent))" name="Headcount" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Attendance Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Current Attendance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Pending Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3 bg-gradient-card">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm font-medium">Performance Reviews</p>
                  <p className="text-xs text-muted-foreground">12 pending approvals</p>
                </div>
              </div>
              <Badge variant="outline">Due Soon</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 bg-gradient-card">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Leave Requests</p>
                  <p className="text-xs text-muted-foreground">8 awaiting approval</p>
                </div>
              </div>
              <Badge variant="outline">Action Needed</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3 bg-gradient-card">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-accent" />
                <div>
                  <p className="text-sm font-medium">Training Sessions</p>
                  <p className="text-xs text-muted-foreground">5 upcoming this week</p>
                </div>
              </div>
              <Badge variant="outline">Scheduled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
