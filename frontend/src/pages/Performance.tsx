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
        <Button>
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
                <TableHead>Overall Score</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Task Quality</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>AI Recommendation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={employee.score} className="w-20" />
                      <span className="text-sm font-medium">{employee.score}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.attendance}%</TableCell>
                  <TableCell>{employee.taskQuality}%</TableCell>
                  <TableCell>
                    {employee.trend === "up" && (
                      <TrendingUp className="h-4 w-4 text-success" />
                    )}
                    {employee.trend === "down" && (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    )}
                    {employee.trend === "stable" && (
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employee.recommendation === "Promotion"
                          ? "default"
                          : employee.recommendation === "Bonus"
                            ? "secondary"
                            : employee.recommendation === "Training"
                              ? "outline"
                              : "secondary"
                      }
                    >
                      {employee.recommendation}
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
        {/* Performance Scoring Breakdown */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance Scoring Weights</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceCategories} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="weight" fill="hsl(var(--primary))" name="Weight %" />
                <Bar dataKey="score" fill="hsl(var(--accent))" name="Avg Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skill Gap Analysis */}
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
                <Radar
                  name="Current Level"
                  dataKey="current"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Required Level"
                  dataKey="required"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  fillOpacity={0.6}
                />
                <Legend />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
