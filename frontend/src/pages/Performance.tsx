import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis } from "recharts";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthHeaders } from "@/hooks/useAuthHeaders";

export default function Performance() {
  const { auth } = useAuthHeaders();
  const [employees, setEmployees] = useState<any[]>([]);
  const [performanceCategories, setPerformanceCategories] = useState<any[]>([]);
  const [skillGapData, setSkillGapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [categoryWeights, setCategoryWeights] = useState<Record<string, number>>({});
  const [categoryDefinitions, setCategoryDefinitions] = useState<Record<string, any>>({});
  const [insights, setInsights] = useState<Array<{ title: string; items: string[] }>>([]);
  const [performanceDistribution, setPerformanceDistribution] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [departmentComparison, setDepartmentComparison] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const resp = await apiFetch('/performance/summary/', { auth });
        if (!resp.ok) return;
        const data = await resp.json();
        if (!isMounted) return;
        setEmployees(data.employees || []);
        setPerformanceCategories(data.performanceCategories || []);
        setSkillGapData(data.skillGapData || []);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [auth.accessToken]);

  async function runReview() {
    const resp = await apiFetch('/performance/review/', { method: 'POST', auth });
    if (!resp.ok) return;
    const data = await resp.json();
    setEmployees(data.employees || []);
    setCategoryWeights(data.categoryWeights || {});
    setCategoryDefinitions(data.categoryDefinitions || {});
    setInsights(data.insights || []);

    // Generate additional analysis data
    const employees = data.employees || [];

    // Performance distribution (histogram)
    const distribution = generatePerformanceDistribution(employees);
    setPerformanceDistribution(distribution);

    // Trend data (simulated historical performance)
    const trends = generateTrendData(employees);
    setTrendData(trends);

    // Department comparison
    const deptComparison = generateDepartmentComparison(employees);
    setDepartmentComparison(deptComparison);

    // Category breakdown for radar chart
    const breakdown = generateCategoryBreakdown(employees, data.categoryWeights || {});
    setCategoryBreakdown(breakdown);

    // derive categories for quick chart visualization
    const pc = Object.entries(data.categoryWeights || {}).map(([category, weight]) => {
      const w = Number(weight) || 0;
      const s = Number(data.employees?.[0]?.categories?.[category] ?? 0) || 0;
      return { category, weight: Math.round(w * 100), score: Math.round(s) };
    });
    setPerformanceCategories(pc);
  }

  // Helper functions for data analysis
  function generatePerformanceDistribution(employees: any[]) {
    const ranges = [
      { range: '0-20', min: 0, max: 20, count: 0 },
      { range: '21-40', min: 21, max: 40, count: 0 },
      { range: '41-60', min: 41, max: 60, count: 0 },
      { range: '61-80', min: 61, max: 80, count: 0 },
      { range: '81-100', min: 81, max: 100, count: 0 },
    ];

    employees.forEach(emp => {
      const score = emp.composite || emp.score || 0;
      const range = ranges.find(r => score >= r.min && score <= r.max);
      if (range) range.count++;
    });

    return ranges.map(r => ({ ...r, percentage: Math.round((r.count / employees.length) * 100) }));
  }

  function generateTrendData(employees: any[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const avgScore = employees.reduce((sum, emp) => sum + (emp.composite || emp.score || 0), 0) / employees.length;
      const variance = Math.random() * 10 - 5; // Simulate monthly variation
      return {
        month,
        average: Math.round(avgScore + variance),
        top: Math.round(avgScore + variance + 15),
        bottom: Math.round(avgScore + variance - 10),
      };
    });
  }

  function generateDepartmentComparison(employees: any[]) {
    const deptMap = new Map();
    employees.forEach(emp => {
      const dept = emp.department || 'Unknown';
      if (!deptMap.has(dept)) {
        deptMap.set(dept, { scores: [], attendance: [], taskQuality: [] });
      }
      deptMap.get(dept).scores.push(emp.composite || emp.score || 0);
      deptMap.get(dept).attendance.push(emp.attendance || 0);
      deptMap.get(dept).taskQuality.push(emp.taskQuality || 0);
    });

    return Array.from(deptMap.entries()).map(([dept, data]) => ({
      department: dept,
      avgScore: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      avgAttendance: Math.round(data.attendance.reduce((a, b) => a + b, 0) / data.attendance.length),
      avgTaskQuality: Math.round(data.taskQuality.reduce((a, b) => a + b, 0) / data.taskQuality.length),
      employeeCount: data.scores.length,
    }));
  }

  function generateCategoryBreakdown(employees: any[], weights: Record<string, number>) {
    const categories = Object.keys(weights);
    const avgScores = categories.map(cat => {
      const scores = employees.map(emp => emp.categories?.[cat] || 0);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return { category: cat, score: Math.round(avg), weight: Math.round((weights[cat] || 0) * 100) };
    });
    return avgScores;
  }

  function calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.sqrt(avgSquaredDiff);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Performance Management</h1>
          <p className="text-muted-foreground mt-2">
            AI-driven performance scoring and recommendations
          </p>
        </div>
        <Button onClick={runReview}>
          <Award className="mr-2 h-4 w-4" />
          Run Performance Review
        </Button>
      </div>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold">{employees.filter(e => (e.composite || e.score || 0) >= 90).length}</div>
                <p className="text-xs text-muted-foreground">Score above 90</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Needs Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold">{employees.filter(e => (e.composite || e.score || 0) < 75).length}</div>
                <p className="text-xs text-muted-foreground">Score below 75</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">
                  {employees.length > 0 ? Math.round(employees.reduce((sum, e) => sum + (e.composite || e.score || 0), 0) / employees.length) : 0}
                </div>
                <p className="text-xs text-muted-foreground">Company average</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analysis Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Performance Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.length > 0 ? Math.max(...employees.map(e => e.composite || e.score || 0)) - Math.min(...employees.map(e => e.composite || e.score || 0)) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Score spread</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">High Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((employees.filter(e => (e.composite || e.score || 0) >= 85).length / Math.max(employees.length, 1)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Above 85</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employees.length > 1 ? Math.round(100 - (calculateStandardDeviation(employees.map(e => e.composite || e.score || 0)) / 10)) : 100}%
            </div>
            <p className="text-xs text-muted-foreground">Score consistency</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Improvement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12%</div>
            <p className="text-xs text-muted-foreground">vs last quarter</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Performance Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Employee Performance Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Overall</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Task Quality</TableHead>
                <TableHead>Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.composite ?? employee.score} className="w-20" />
                      <span className="text-sm font-medium">{employee.composite ?? employee.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.attendance}%</TableCell>
                  <TableCell>{employee.taskQuality}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        (employee.recommendation ?? 'None') === "Promotion"
                          ? "default"
                          : (employee.recommendation ?? 'None') === "Bonus"
                            ? "secondary"
                            : (employee.recommendation ?? 'None') === "Training"
                              ? "outline"
                              : "secondary"
                      }
                    >
                      {employee.recommendation ?? 'None'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Category Weights vs Scores */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Category Weights & Scores</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Legend />
                <Bar dataKey="weight" fill="hsl(var(--primary))" name="Weight %" />
                <Bar dataKey="score" fill="hsl(var(--accent))" name="Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ range, percentage }) => `${range}: ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${120 + index * 30}, 70%, 50%)`} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analysis Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Performance Trends */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Legend />
                <Line type="monotone" dataKey="average" stroke="hsl(var(--primary))" strokeWidth={2} name="Average" />
                <Line type="monotone" dataKey="top" stroke="hsl(var(--success))" strokeWidth={2} name="Top Performers" />
                <Line type="monotone" dataKey="bottom" stroke="hsl(var(--destructive))" strokeWidth={2} name="Needs Improvement" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Comparison */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Department Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Legend />
                <Bar dataKey="avgScore" fill="hsl(var(--primary))" name="Avg Score" />
                <Bar dataKey="avgAttendance" fill="hsl(var(--success))" name="Avg Attendance" />
                <Bar dataKey="avgTaskQuality" fill="hsl(var(--accent))" name="Avg Task Quality" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown Radar */}
      {categoryBreakdown.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Category Performance Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={categoryBreakdown}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                <Radar name="Performance Score" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Radar name="Weight %" dataKey="weight" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <Card className="shadow-elevated border-l-4 border-l-accent">
          <CardHeader>
            <CardTitle>AI-Driven Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insights.map((block, i) => (
              <div key={i} className="rounded-lg border p-4 bg-gradient-card">
                <p className="font-medium text-sm">{block.title}</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
                  {block.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
