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
import { Calendar, AlertTriangle, CheckCircle, Clock, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const attendanceRecords = [
  {
    id: 1,
    name: "Sarah Johnson",
    department: "Engineering",
    presentDays: 22,
    leaveDays: 2,
    absentDays: 0,
    rate: 100,
    pattern: "None",
    status: "excellent",
  },
  {
    id: 2,
    name: "Michael Chen",
    department: "Sales",
    presentDays: 20,
    leaveDays: 3,
    absentDays: 1,
    rate: 91,
    pattern: "None",
    status: "good",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    department: "Marketing",
    presentDays: 18,
    leaveDays: 4,
    absentDays: 2,
    rate: 82,
    pattern: "Frequent Mondays",
    status: "review",
  },
  {
    id: 4,
    name: "David Kim",
    department: "Engineering",
    presentDays: 21,
    leaveDays: 3,
    absentDays: 0,
    rate: 95,
    pattern: "None",
    status: "good",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    department: "Finance",
    presentDays: 17,
    leaveDays: 5,
    absentDays: 2,
    rate: 77,
    pattern: "Frequent Fridays",
    status: "alert",
  },
];

const monthlyTrend = [
  { month: "Jan", attendance: 94, leaves: 5, absences: 1 },
  { month: "Feb", attendance: 92, leaves: 6, absences: 2 },
  { month: "Mar", attendance: 95, leaves: 4, absences: 1 },
  { month: "Apr", attendance: 93, leaves: 5, absences: 2 },
  { month: "May", attendance: 91, leaves: 7, absences: 2 },
  { month: "Jun", attendance: 94, leaves: 5, absences: 1 },
];

const departmentAttendance = [
  { department: "Engineering", rate: 96 },
  { department: "Sales", rate: 91 },
  { department: "Marketing", rate: 88 },
  { department: "HR", rate: 97 },
  { department: "Finance", rate: 89 },
];

const leaveBalances = [
  { department: "Engineering", available: 180, used: 45 },
  { department: "Sales", available: 128, used: 52 },
  { department: "Marketing", available: 72, used: 38 },
  { department: "HR", available: 48, used: 12 },
  { department: "Finance", available: 60, used: 28 },
];

export default function Attendance() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance & Leave Management</h1>
          <p className="text-muted-foreground mt-2">
            Track attendance patterns and manage workforce availability
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pattern Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Need review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Leave requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Employee Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Present Days</TableHead>
                <TableHead>Leave Days</TableHead>
                <TableHead>Absent Days</TableHead>
                <TableHead>Attendance Rate</TableHead>
                <TableHead>Pattern Alert</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.presentDays}</TableCell>
                  <TableCell>{record.leaveDays}</TableCell>
                  <TableCell>{record.absentDays}</TableCell>
                  <TableCell>{record.rate}%</TableCell>
                  <TableCell>
                    {record.pattern !== "None" ? (
                      <Badge variant="outline" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {record.pattern}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === "excellent"
                          ? "default"
                          : record.status === "good"
                          ? "secondary"
                          : record.status === "review"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {record.status === "excellent" && "Excellent"}
                      {record.status === "good" && "Good"}
                      {record.status === "review" && "Review"}
                      {record.status === "alert" && "Alert"}
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
        {/* Monthly Trend */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Monthly Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrend}>
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
                  dataKey="attendance"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  name="Attendance %"
                />
                <Line
                  type="monotone"
                  dataKey="leaves"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  name="Leaves %"
                />
                <Line
                  type="monotone"
                  dataKey="absences"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  name="Absences %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Attendance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Department-wise Attendance Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="rate" fill="hsl(var(--primary))" name="Attendance Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leave Balance Analysis */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Department Leave Balance Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={leaveBalances}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="department" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Bar dataKey="available" fill="hsl(var(--success))" name="Available Days" />
                <Bar dataKey="used" fill="hsl(var(--warning))" name="Used Days" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="shadow-elevated border-l-4 border-l-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-accent" />
            Smart Scheduling Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border p-4 bg-gradient-card">
            <p className="text-sm">
              <strong>Marketing Department:</strong> High leave concentration detected in Week 3.
              Suggest redistributing workload or hiring temporary support.
            </p>
          </div>
          <div className="rounded-lg border p-4 bg-gradient-card">
            <p className="text-sm">
              <strong>Pattern Alert:</strong> 3 employees showing consistent Monday absences.
              Recommend HR review for potential burnout or scheduling conflicts.
            </p>
          </div>
          <div className="rounded-lg border p-4 bg-gradient-card">
            <p className="text-sm">
              <strong>Optimization:</strong> Sales team can handle +15% workload during low-leave
              periods (Weeks 1-2). Consider strategic project scheduling.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
