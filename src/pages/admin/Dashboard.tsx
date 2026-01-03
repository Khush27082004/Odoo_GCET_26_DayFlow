import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import StatCard from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import {
  getUsers,
  getAttendanceRecords,
  getLeaveRequests,
} from '@/services/storage';
import { User, AttendanceRecord, LeaveRequest } from '@/services/types';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const users = getUsers().filter((u) => u.role === 'employee');
    setEmployees(users);

    const today = new Date().toISOString().split('T')[0];
    const records = getAttendanceRecords().filter((r) => r.date === today);
    setAttendanceRecords(records);

    const requests = getLeaveRequests();
    setLeaveRequests(requests);
  };

  const pendingLeaves = leaveRequests.filter((r) => r.status === 'pending');
  const todayPresent = attendanceRecords.filter((r) => r.status === 'present').length;
  const todayAbsent = employees.length - todayPresent;

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/10 text-success border-success/20">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome, ${user?.firstName}!`}
        description="Here's an overview of your organization today."
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={employees.length}
          subtitle="Active employees"
          icon={Users}
          variant="primary"
        />
        <StatCard
          title="Present Today"
          value={todayPresent}
          subtitle={`${employees.length > 0 ? Math.round((todayPresent / employees.length) * 100) : 0}% attendance`}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Absent Today"
          value={todayAbsent}
          subtitle="Employees not checked in"
          icon={XCircle}
          variant="warning"
        />
        <StatCard
          title="Pending Requests"
          value={pendingLeaves.length}
          subtitle="Leave requests"
          icon={AlertCircle}
          variant="info"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Employees */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Employees</CardTitle>
            <Link to="/admin/employees">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employees.slice(0, 5).map((emp) => (
                <div
                  key={emp.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {emp.firstName[0]}
                    {emp.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">
                      {emp.firstName} {emp.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{emp.designation}</p>
                  </div>
                  <Badge variant="secondary">{emp.department}</Badge>
                </div>
              ))}
              {employees.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                  No employees found
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending Leave Requests */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pending Leave Requests</CardTitle>
            <Link to="/admin/leave">
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingLeaves.slice(0, 5).map((leave) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">{leave.employeeName}</p>
                    <p className="text-sm text-muted-foreground">
                      {leave.startDate} to {leave.endDate}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {leave.leaveType} leave
                    </p>
                  </div>
                  {getStatusBadge(leave.status)}
                </div>
              ))}
              {pendingLeaves.length === 0 && (
                <p className="py-8 text-center text-muted-foreground">
                  No pending leave requests
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link to="/admin/employees">
                <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-card">
                  <div className="rounded-xl bg-primary/10 p-3 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Manage Employees</span>
                  <span className="text-sm text-muted-foreground">
                    View all employees
                  </span>
                </div>
              </Link>
              <Link to="/admin/attendance">
                <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-card">
                  <div className="rounded-xl bg-info/10 p-3 text-info">
                    <Clock className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Attendance</span>
                  <span className="text-sm text-muted-foreground">
                    Track attendance
                  </span>
                </div>
              </Link>
              <Link to="/admin/leave">
                <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-card">
                  <div className="rounded-xl bg-success/10 p-3 text-success">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Leave Approval</span>
                  <span className="text-sm text-muted-foreground">
                    Manage requests
                  </span>
                </div>
              </Link>
              <Link to="/admin/payroll">
                <div className="flex flex-col items-center gap-2 rounded-xl border bg-card p-6 text-center transition-all hover:border-primary hover:shadow-card">
                  <div className="rounded-xl bg-warning/10 p-3 text-warning">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <span className="font-medium">Payroll</span>
                  <span className="text-sm text-muted-foreground">
                    View payroll
                  </span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
