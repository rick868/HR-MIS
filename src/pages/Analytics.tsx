import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, Users, DollarSign, AlertCircle, Target } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const turnoverPrediction = [
  { month: "Jul", predicted: 3, actual: 2 },
  { month: "Aug", predicted: 4, actual: 3 },
  { month: "Sep", predicted: 2, actual: 2 },
  { month: "Oct", predicted: 5, actual: null },
  { month: "Nov", predicted: 3, actual: null },
  { month: "Dec", predicted: 4, actual: null },
];

const payrollForecast = [
  { month: "Jul", amount: 485000, forecast: 490000 },
  { month: "Aug", amount: 492000, forecast: 495000 },
  { month: "Sep", amount: 488000, forecast: 500000 },
  { month: "Oct", amount: null, forecast: 510000 },
  { month: "Nov", amount: null, forecast: 515000 },
  { month: "Dec", amount: null, forecast: 525000 },
];

const performanceVsSalary = [
  { name: "Eng-1", performance: 94, salary: 95000, size: 3 },
  { name: "Sales-1", performance: 89, salary: 82000, size: 2.5 },
  { name: "Mkt-1", performance: 72, salary: 78000, size: 1.8 },
  { name: "Eng-2", performance: 91, salary: 88000, size: 2.8 },
  { name: "Fin-1", performance: 86, salary: 85000, size: 2.4 },
  { name: "HR-1", performance: 90, salary: 75000, size: 2.6 },
  { name: "Sales-2", performance: 78, salary: 92000, size: 2 },
];

const trainingROI = [
  { program: "Leadership", cost: 15000, improvement: 18, roi: 120 },
  { program: "Technical", cost: 22000, improvement: 25, roi: 145 },
  { program: "Communication", cost: 8000, improvement: 12, roi: 95 },
  { program: "Analytics", cost: 18000, improvement: 22, roi: 135 },
  { program: "Project Mgmt", cost: 12000, improvement: 15, roi: 110 },
];

const attritionRisk = [
  { name: "Sarah Johnson", department: "Engineering", risk: 15, reason: "Low engagement" },
  { name: "Emily Rodriguez", department: "Marketing", risk: 68, reason: "Performance drop + absences" },
  { name: "David Kim", department: "Engineering", risk: 22, reason: "Market opportunities" },
  { name: "Lisa Thompson", department: "Finance", risk: 54, reason: "Frequent absences" },
  { name: "Michael Chen", department: "Sales", risk: 28, reason: "High overtime" },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Analytics & Insights</h1>
          <p className="text-muted-foreground mt-2">
            Predictive analytics and data-driven decision intelligence
          </p>
        </div>
        <Button>
          <Brain className="mr-2 h-4 w-4" />
          Run Prediction Models
        </Button>
      </div>

      {/* Key Predictions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Turnover Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">High-risk employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Hiring Needs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Positions in 3 months</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Budget Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold">$1.55M</div>
                <p className="text-xs text-muted-foreground">Next quarter</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Training ROI</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-accent" />
              <div>
                <div className="text-2xl font-bold">121%</div>
                <p className="text-xs text-muted-foreground">Average return</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attrition Risk Table */}
      <Card className="shadow-elevated border-l-4 border-l-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Employee Attrition Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attritionRisk.map((employee, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4 bg-gradient-card"
              >
                <div className="flex-1">
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-sm text-muted-foreground">{employee.department}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Risk Factor</p>
                    <p className="text-sm font-medium">{employee.reason}</p>
                  </div>
                  <Badge
                    variant={
                      employee.risk > 60
                        ? "destructive"
                        : employee.risk > 40
                        ? "outline"
                        : "secondary"
                    }
                    className="w-20 justify-center"
                  >
                    {employee.risk}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Turnover Prediction */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Employee Turnover Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={turnoverPrediction}>
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
                  dataKey="actual"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Actual"
                  strokeDasharray="0"
                />
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  name="Predicted"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Payroll Forecast */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Payroll Expense Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={payrollForecast}>
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
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.6}
                  name="Actual"
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent))"
                  fillOpacity={0.3}
                  name="Forecast"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance vs Salary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Performance vs Salary Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  dataKey="performance"
                  name="Performance"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Performance Score", position: "bottom" }}
                />
                <YAxis
                  type="number"
                  dataKey="salary"
                  name="Salary"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: "Salary ($)", angle: -90, position: "left" }}
                />
                <ZAxis type="number" dataKey="size" range={[100, 400]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                  cursor={{ strokeDasharray: "3 3" }}
                />
                <Scatter
                  name="Employees"
                  data={performanceVsSalary}
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Training ROI */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Training Program ROI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trainingROI}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="program" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="improvement" fill="hsl(var(--primary))" name="Performance Improvement %" />
                <Bar dataKey="roi" fill="hsl(var(--success))" name="ROI %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="shadow-elevated border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            Strategic Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-4 bg-gradient-card">
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Recruitment Priority</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Sales department showing highest attrition risk. Recommend proactive hiring of 3
                  sales representatives in Q4 to maintain team strength.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-gradient-card">
            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Budget Optimization</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Technical training programs showing 145% ROI. Recommend 30% budget increase for
                  technical skill development to maximize returns.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-4 bg-gradient-card">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Retention Focus</p>
                <p className="text-sm text-muted-foreground mt-1">
                  2 high-performing employees (Emily Rodriguez, Lisa Thompson) showing elevated
                  attrition risk. Immediate intervention recommended - consider retention bonuses or
                  career development plans.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
