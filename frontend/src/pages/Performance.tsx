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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
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
    // derive categories for quick chart visualization
    const pc = Object.entries(data.categoryWeights || {}).map(([category, weight]) => {
      const w = Number(weight) || 0;
      const s = Number(data.employees?.[0]?.categories?.[category] ?? 0) || 0;
      return { category, weight: Math.round(w * 100), score: Math.round(s) };
    });
    setPerformanceCategories(pc);
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
                <div className="text-2xl font-bold">15</div>
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
                <div className="text-2xl font-bold">8</div>
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
                <div className="text-2xl font-bold">86.4</div>
                <p className="text-xs text-muted-foreground">Company average</p>
              </div>
            </div>
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

        {/* Skill Gap Analysis (placeholder retained) */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Skill Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={skillGapData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" />
                <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                <Radar name="Current Level" dataKey="current" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Radar name="Required Level" dataKey="required" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.6} />
                <Legend />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

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
