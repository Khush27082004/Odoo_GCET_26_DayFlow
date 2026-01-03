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
  User,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import {
  getTodayAttendance,
  getAttendanceByUserId,
  getLeaveRequestsByUserId,
  addAttendanceRecord,
} from '@/services/storage';
import { AttendanceRecord, LeaveRequest } from '@/services/types';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [recentLeaves, setRecentLeaves] = useState<LeaveRequest[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    present: 0,
    absent: 0,
    leaves: 0,
  });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;

    const today = getTodayAttendance(user.id);
    setTodayAttendance(today || null);

    const leaves = getLeaveRequestsByUserId(user.id);
    setRecentLeaves(leaves.slice(-3).reverse());

    const attendance = getAttendanceByUserId(user.id);
    const stats = attendance.reduce(
      (acc, record) => {
        if (record.status === 'present') acc.present++;
        else if (record.status === 'absent') acc.absent++;
        else if (record.status === 'leave') acc.leaves++;
        return acc;
      },
      { present: 0, absent: 0, leaves: 0 }
    );
    setAttendanceStats(stats);
  };

  const handleCheckIn = () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const record: AttendanceRecord = {
      id: `${user.id}-${today}`,
      date: today,
      userId: user.id,
      checkIn: now,
      checkOut: null,
      status: 'present',
    };

    addAttendanceRecord(record);
    setTodayAttendance(record);
  };

  const handleCheckOut = () => {
    if (!user || !todayAttendance) return;

    const now = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    const updatedRecord = { ...todayAttendance, checkOut: now };
    addAttendanceRecord(updatedRecord);
    setTodayAttendance(updatedRecord);
  };

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

  const quickLinks = [
    { to: '/profile', icon: User, label: 'View Profile', color: 'primary' },
    { to: '/attendance', icon: Clock, label: 'Attendance', color: 'info' },
    { to: '/leave', icon: Calendar, label: 'Leave Requests', color: 'success' },
    { to: '/payroll', icon: DollarSign, label: 'Payroll', color: 'warning' },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={`Welcome back, ${user?.firstName}!`}
        description="Here's what's happening with your work today."
      />

      {/* Quick Check-in/out */}
      <Card className="mb-6 border-0 bg-gradient-primary shadow-elevated">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-primary-foreground">
              <h3 className="text-lg font-semibold">Today's Attendance</h3>
              <p className="text-sm opacity-90">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {todayAttendance && (
                <p className="mt-2 text-sm opacity-90">
                  Check-in: {todayAttendance.checkIn || 'Not checked in'}
                  {todayAttendance.checkOut && ` | Check-out: ${todayAttendance.checkOut}`}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              {!todayAttendance?.checkIn ? (
                <Button
                  onClick={handleCheckIn}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Check In
                </Button>
              ) : !todayAttendance?.checkOut ? (
                <Button
                  onClick={handleCheckOut}
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Check Out
                </Button>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/20 px-4 py-2 text-primary-foreground">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Completed for today</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Days Present"
          value={attendanceStats.present}
          subtitle="This month"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Days Absent"
          value={attendanceStats.absent}
          subtitle="This month"
          icon={XCircle}
          variant="warning"
        />
        <StatCard
          title="Leaves Taken"
          value={attendanceStats.leaves}
          subtitle="This month"
          icon={Calendar}
          variant="info"
        />
        <StatCard
          title="Pending Requests"
          value={recentLeaves.filter((l) => l.status === 'pending').length}
          subtitle="Leave requests"
          icon={AlertCircle}
          variant="primary"
        />
      </div>

      {/* Quick Links & Recent Leaves */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Links */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center transition-all hover:border-primary hover:shadow-card"
                >
                  <div
                    className={`rounded-xl p-3 ${
                      link.color === 'primary'
                        ? 'bg-primary/10 text-primary'
                        : link.color === 'info'
                        ? 'bg-info/10 text-info'
                        : link.color === 'success'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    <link.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Leave Requests */}
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Leave Requests</CardTitle>
            <Link to="/leave">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentLeaves.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                No leave requests yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentLeaves.map((leave) => (
                  <div
                    key={leave.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium capitalize">{leave.leaveType} Leave</p>
                      <p className="text-sm text-muted-foreground">
                        {leave.startDate} to {leave.endDate}
                      </p>
                    </div>
                    {getStatusBadge(leave.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
