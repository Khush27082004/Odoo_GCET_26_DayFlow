import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getUsers, getAttendanceRecords, getLeaveRequests } from '@/services/storage';
import { User, AttendanceRecord, LeaveRequest } from '@/services/types';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626'];

const Reports: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setEmployees(getUsers());
    setAttendanceRecords(getAttendanceRecords());
    setLeaveRequests(getLeaveRequests());
  };

  // Attendance Summary Data
  const attendanceSummary = [
    { name: 'Present', value: attendanceRecords.filter((r) => r.status === 'present').length, color: '#16a34a' },
    { name: 'Absent', value: attendanceRecords.filter((r) => r.status === 'absent').length, color: '#dc2626' },
    { name: 'Half-Day', value: attendanceRecords.filter((r) => r.status === 'half-day').length, color: '#f59e0b' },
    { name: 'Leave', value: attendanceRecords.filter((r) => r.status === 'leave').length, color: '#2563eb' },
  ];

  // Leave Summary Data
  const leaveSummary = [
    { name: 'Paid Leave', value: leaveRequests.filter((r) => r.leaveType === 'paid').length, color: '#2563eb' },
    { name: 'Sick Leave', value: leaveRequests.filter((r) => r.leaveType === 'sick').length, color: '#f59e0b' },
    { name: 'Unpaid Leave', value: leaveRequests.filter((r) => r.leaveType === 'unpaid').length, color: '#dc2626' },
  ];

  // Department Distribution
  const departmentData = employees.reduce((acc: { name: string; value: number }[], emp) => {
    const existing = acc.find((d) => d.name === emp.department);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: emp.department, value: 1 });
    }
    return acc;
  }, []);

  // Monthly Attendance (mock data for chart)
  const monthlyAttendance = [
    { month: 'Jan', present: 85, absent: 10, leave: 5 },
    { month: 'Feb', present: 88, absent: 8, leave: 4 },
    { month: 'Mar', present: 82, absent: 12, leave: 6 },
    { month: 'Apr', present: 90, absent: 6, leave: 4 },
    { month: 'May', present: 87, absent: 9, leave: 4 },
    { month: 'Jun', present: 85, absent: 10, leave: 5 },
  ];

  // Salary Distribution
  const salaryData = employees.map((emp) => ({
    name: `${emp.firstName} ${emp.lastName[0]}.`,
    salary: emp.salary.basic + emp.salary.hra + emp.salary.allowances - emp.salary.deductions,
  }));

  return (
    <DashboardLayout>
      <PageHeader
        title="Reports & Analytics"
        description="View organization statistics and reports"
      />

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="salary">Salary</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="mt-4 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Attendance Distribution */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Attendance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceSummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {attendanceSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Attendance Trend */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Monthly Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyAttendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#16a34a" name="Present %" />
                      <Bar dataKey="absent" fill="#dc2626" name="Absent %" />
                      <Bar dataKey="leave" fill="#2563eb" name="Leave %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Department Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2563eb" name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave" className="mt-4 space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Leave Type Distribution */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Leave Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={leaveSummary}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {leaveSummary.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Leave Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Leave Request Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Approved', value: leaveRequests.filter((r) => r.status === 'approved').length, color: '#16a34a' },
                          { name: 'Pending', value: leaveRequests.filter((r) => r.status === 'pending').length, color: '#f59e0b' },
                          { name: 'Rejected', value: leaveRequests.filter((r) => r.status === 'rejected').length, color: '#dc2626' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        <Cell fill="#16a34a" />
                        <Cell fill="#f59e0b" />
                        <Cell fill="#dc2626" />
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leave Summary Table */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Leave Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-primary/5 p-4 text-center">
                  <p className="text-3xl font-bold text-primary">
                    {leaveRequests.filter((r) => r.status === 'approved').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Approved Leaves</p>
                </div>
                <div className="rounded-lg border bg-warning/5 p-4 text-center">
                  <p className="text-3xl font-bold text-warning">
                    {leaveRequests.filter((r) => r.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                </div>
                <div className="rounded-lg border bg-destructive/5 p-4 text-center">
                  <p className="text-3xl font-bold text-destructive">
                    {leaveRequests.filter((r) => r.status === 'rejected').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Rejected Requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="salary" className="mt-4 space-y-6">
          {/* Salary Distribution */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Salary Distribution by Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Net Salary']}
                    />
                    <Bar dataKey="salary" fill="#2563eb" name="Net Salary" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Salary Summary */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Salary Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                  <p className="text-2xl font-bold">
                    ₹{employees.reduce((sum, emp) => sum + emp.salary.basic, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Basic</p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4 text-center">
                  <p className="text-2xl font-bold">
                    ₹{employees.reduce((sum, emp) => sum + emp.salary.hra, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total HRA</p>
                </div>
                <div className="rounded-lg border bg-success/5 p-4 text-center">
                  <p className="text-2xl font-bold text-success">
                    +₹{employees.reduce((sum, emp) => sum + emp.salary.allowances, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Allowances</p>
                </div>
                <div className="rounded-lg border bg-destructive/5 p-4 text-center">
                  <p className="text-2xl font-bold text-destructive">
                    -₹{employees.reduce((sum, emp) => sum + emp.salary.deductions, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Deductions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Reports;
