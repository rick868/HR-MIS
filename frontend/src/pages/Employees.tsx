import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Filter, Mail, Phone, X, ChevronDown } from "lucide-react";
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
  const [openProfile, setOpenProfile] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    departments: [] as string[],
    status: [] as string[],
    performance: [] as string[],
    attendance: [] as string[],
  });

  // Available filter options
  const departmentOptions = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const statusOptions = ['Active', 'Inactive', 'On Leave'];
  const performanceOptions = ['Excellent', 'Good', 'Average', 'Needs Improvement'];
  const attendanceOptions = ['Excellent', 'Good', 'Review', 'Alert'];

  // Filter helper functions
  const updateFilter = (category: keyof typeof filters, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked
        ? [...prev[category], value]
        : prev[category].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      departments: [],
      status: [],
      performance: [],
      attendance: [],
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).flat().length;
  };

  // Filter and search employees
  const filteredEmployees = employees.filter(employee => {
    // Search filter
    const matchesSearch = !searchTerm ||
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase());

    // Department filter
    const matchesDepartment = filters.departments.length === 0 ||
      filters.departments.includes(employee.department);

    // Status filter
    const matchesStatus = filters.status.length === 0 ||
      filters.status.includes(employee.status);

    // Performance filter (based on performance score)
    const matchesPerformance = filters.performance.length === 0 ||
      filters.performance.some(perf => {
        const score = employee.performanceScore;
        switch (perf) {
          case 'Excellent': return score >= 90;
          case 'Good': return score >= 75 && score < 90;
          case 'Average': return score >= 60 && score < 75;
          case 'Needs Improvement': return score < 60;
          default: return false;
        }
      });

    // Attendance filter (based on attendance rate)
    const matchesAttendance = filters.attendance.length === 0 ||
      filters.attendance.some(att => {
        const rate = employee.attendanceRate;
        switch (att) {
          case 'Excellent': return rate >= 95;
          case 'Good': return rate >= 85 && rate < 95;
          case 'Review': return rate >= 70 && rate < 85;
          case 'Alert': return rate < 70;
          default: return false;
        }
      });

    return matchesSearch && matchesDepartment && matchesStatus && matchesPerformance && matchesAttendance;
  });

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
              <Input
                placeholder="Search employees..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filter Employees</h4>
                    {getActiveFilterCount() > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear All
                      </Button>
                    )}
                  </div>

                  {/* Department Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Department</Label>
                    <div className="space-y-2">
                      {departmentOptions.map((dept) => (
                        <div key={dept} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dept-${dept}`}
                            checked={filters.departments.includes(dept)}
                            onCheckedChange={(checked) => updateFilter('departments', dept, checked as boolean)}
                          />
                          <Label htmlFor={`dept-${dept}`} className="text-sm">{dept}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.status.includes(status)}
                            onCheckedChange={(checked) => updateFilter('status', status, checked as boolean)}
                          />
                          <Label htmlFor={`status-${status}`} className="text-sm">{status}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Performance</Label>
                    <div className="space-y-2">
                      {performanceOptions.map((perf) => (
                        <div key={perf} className="flex items-center space-x-2">
                          <Checkbox
                            id={`perf-${perf}`}
                            checked={filters.performance.includes(perf)}
                            onCheckedChange={(checked) => updateFilter('performance', perf, checked as boolean)}
                          />
                          <Label htmlFor={`perf-${perf}`} className="text-sm">{perf}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Attendance Filter */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Attendance</Label>
                    <div className="space-y-2">
                      {attendanceOptions.map((att) => (
                        <div key={att} className="flex items-center space-x-2">
                          <Checkbox
                            id={`att-${att}`}
                            checked={filters.attendance.includes(att)}
                            onCheckedChange={(checked) => updateFilter('attendance', att, checked as boolean)}
                          />
                          <Label htmlFor={`att-${att}`} className="text-sm">{att}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters & Results Counter */}
      {(searchTerm || getActiveFilterCount() > 0) && (
        <div className="space-y-2">
          {/* Active Filter Chips */}
          {getActiveFilterCount() > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([category, values]) =>
                values.map((value) => (
                  <Badge key={`${category}-${value}`} variant="secondary" className="gap-1">
                    {category === 'departments' ? 'Dept' :
                      category === 'performance' ? 'Perf' :
                        category === 'attendance' ? 'Att' : category}: {value}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => updateFilter(category as keyof typeof filters, value, false)}
                    />
                  </Badge>
                ))
              )}
            </div>
          )}

          {/* Results Counter */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredEmployees.length} of {employees.length} employees
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>
      )}

      {/* Employee Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No employees found</h3>
              <p className="text-sm">
                {searchTerm || getActiveFilterCount() > 0
                  ? "Try adjusting your search or filters"
                  : "No employees match your criteria"}
              </p>
            </div>
          </div>
        ) : (
          filteredEmployees.map((employee) => (
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
                <Button variant="outline" className="w-full" onClick={async () => {
                  setProfileLoading(true);
                  try {
                    const resp = await apiFetch(`/employees/${employee.id}/`, { auth });
                    if (resp.ok) {
                      const data = await resp.json();
                      setSelected(data);
                      setOpenProfile(true);
                    }
                  } finally {
                    setProfileLoading(false);
                  }
                }}>
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {loading && <p className="text-sm text-muted-foreground">Loading employees...</p>}
      {profileLoading && <p className="text-sm text-muted-foreground">Loading profile...</p>}

      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
            <DialogDescription>Review core information and current status for the selected employee.</DialogDescription>
          </DialogHeader>
          {selected ? (
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium">{selected.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium">{selected.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium">{selected.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{selected.department || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm font-medium">{selected.role || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant="outline">{selected.status}</Badge>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Performance Score</p>
                  <p className="text-sm font-medium">{selected.performance_score ?? selected.performanceScore ?? 0}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Attendance Rate</p>
                  <p className="text-sm font-medium">{selected.attendance_rate ?? selected.attendanceRate ?? 0}%</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenProfile(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openAdd} onOpenChange={(v) => { setOpenAdd(v); if (!v) reset(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>Enter details to create a new employee profile.</DialogDescription>
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
