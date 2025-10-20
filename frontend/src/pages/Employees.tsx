import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [openAdd, setOpenAdd] = useState(false);
  const [saving, setSaving] = useState(false);

  const addEmployeeSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email required"),
    phone: z.string().optional().or(z.literal("")),
    department: z.string().min(1, "Department is required"),
    role: z.string().min(1, "Role is required"),
    status: z.enum(["Active", "Inactive", "On Leave"], { required_error: "Status is required" }),
  });

  type AddEmployeeForm = z.infer<typeof addEmployeeSchema>;

  const { register, handleSubmit, reset, formState: { errors, isValid }, setValue, watch } = useForm<AddEmployeeForm>({
    resolver: zodResolver(addEmployeeSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', phone: '', department: '', role: '', status: 'Active' },
  });
  const statusValue = watch('status');

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
        <Button onClick={() => setOpenAdd(true)}>
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

      <Dialog open={openAdd} onOpenChange={(v) => { setOpenAdd(v); if (!v) reset(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit(async (values) => {
            setSaving(true);
            try {
              const initials = values.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
              const payload = { ...values, initials };
              const resp = await apiFetch('/employees/', { method: 'POST', body: JSON.stringify(payload), auth });
              if (resp.ok) {
                const created = await resp.json();
                setEmployees((prev) => [created, ...prev]);
                setOpenAdd(false);
                reset();
              }
            } finally {
              setSaving(false);
            }
          })}>
            <div className="space-y-2">
              <Label htmlFor="emp-name">Full Name</Label>
              <Input id="emp-name" placeholder="Jane Doe" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-email">Email</Label>
              <Input id="emp-email" type="email" placeholder="jane@company.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emp-phone">Phone</Label>
                <Input id="emp-phone" placeholder="+1 234 567 890" {...register('phone')} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-dept">Department</Label>
                <Input id="emp-dept" placeholder="Engineering" {...register('department')} />
                {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-role">Role</Label>
              <Input id="emp-role" placeholder="Software Engineer" {...register('role')} />
              {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusValue} onValueChange={(v) => setValue('status', v as AddEmployeeForm['status'], { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-destructive">{errors.status.message}</p>}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setOpenAdd(false); reset(); }} disabled={saving}>Cancel</Button>
              <Button type="submit" disabled={saving || !isValid}>Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
