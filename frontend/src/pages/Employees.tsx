import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Filter, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthHeaders } from "@/hooks/useAuthHeaders";

const staticEmployees = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 234-567-8901",
    department: "Engineering",
    role: "Senior Developer",
    performanceScore: 94,
    attendanceRate: 98,
    status: "Active",
    initials: "SJ",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.c@company.com",
    phone: "+1 234-567-8902",
    department: "Sales",
    role: "Sales Manager",
    performanceScore: 89,
    attendanceRate: 92,
    status: "Active",
    initials: "MC",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.r@company.com",
    phone: "+1 234-567-8903",
    department: "Marketing",
    role: "Marketing Specialist",
    performanceScore: 72,
    attendanceRate: 85,
    status: "Active",
    initials: "ER",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.k@company.com",
    phone: "+1 234-567-8904",
    department: "Engineering",
    role: "Team Lead",
    performanceScore: 91,
    attendanceRate: 95,
    status: "Active",
    initials: "DK",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa.t@company.com",
    phone: "+1 234-567-8905",
    department: "Finance",
    role: "Financial Analyst",
    performanceScore: 86,
    attendanceRate: 94,
    status: "Active",
    initials: "LT",
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.w@company.com",
    phone: "+1 234-567-8906",
    department: "HR",
    role: "HR Manager",
    performanceScore: 90,
    attendanceRate: 97,
    status: "Active",
    initials: "JW",
  },
];

type Employee = typeof staticEmployees[number];

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(staticEmployees);
  const [loading, setLoading] = useState(false);
  const { auth } = useAuthHeaders();

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const resp = await apiFetch('/employees/', { auth });
        if (!resp.ok) return;
        const data = await resp.json();
        if (isMounted && Array.isArray(data.results)) setEmployees(data.results);
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
          <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
          <p className="text-muted-foreground mt-2">
            Manage and view employee information and profiles
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search employees..." className="pl-9" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {employees.map((employee) => (
          <Card key={employee.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 bg-gradient-primary">
                    <AvatarFallback className="text-primary-foreground font-semibold">
                      {employee.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-base">{employee.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                </div>
                <Badge variant="secondary">{employee.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{employee.phone}</span>
                </div>
              </div>

              {/* Department */}
              <div className="flex items-center justify-between py-2 border-t">
                <span className="text-sm text-muted-foreground">Department</span>
                <Badge variant="outline">{employee.department}</Badge>
              </div>

              {/* Metrics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Performance</span>
                  <span className="font-medium">{employee.performanceScore}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-gradient-primary transition-all"
                    style={{ width: `${employee.performanceScore}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Attendance</span>
                  <span className="font-medium">{employee.attendanceRate}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-success transition-all"
                    style={{ width: `${employee.attendanceRate}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {loading && <p className="text-sm text-muted-foreground">Loading employees...</p>}
    </div>
  );
}
