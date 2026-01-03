import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle2, XCircle, Clock, Calendar } from 'lucide-react';
import {
  getTodayAttendance,
  getAttendanceByUserId,
  addAttendanceRecord,
} from '@/services/storage';
import { AttendanceRecord } from '@/services/types';

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = () => {
    if (!user) return;

    const today = getTodayAttendance(user.id);
    setTodayAttendance(today || null);

    const records = getAttendanceByUserId(user.id);
    setAttendanceRecords(records.sort((a, b) => b.date.localeCompare(a.date)));
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
    loadData();
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
    loadData();
  };

  const getStatusBadge = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success/10 text-success border-success/20">Present</Badge>;
      case 'absent':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Absent</Badge>;
      case 'half-day':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Half-Day</Badge>;
      case 'leave':
        return <Badge className="bg-info/10 text-info border-info/20">Leave</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates();
  const weekRecords = weekDates.map((date) => {
    const record = attendanceRecords.find((r) => r.date === date);
    return {
      date,
      dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      record,
    };
  });

  return (
    <DashboardLayout>
      <PageHeader
        title="Attendance"
        description="Track your daily attendance and view history"
      />

      {/* Today's Attendance Card */}
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
                <div className="mt-2 flex items-center gap-4 text-sm opacity-90">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    In: {todayAttendance.checkIn || '--:--'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Out: {todayAttendance.checkOut || '--:--'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {!todayAttendance?.checkIn ? (
                <Button
                  onClick={handleCheckIn}
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Check In
                </Button>
              ) : !todayAttendance?.checkOut ? (
                <Button
                  onClick={handleCheckOut}
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Check Out
                </Button>
              ) : (
                <div className="flex items-center gap-2 rounded-lg bg-primary-foreground/20 px-6 py-3 text-primary-foreground">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-medium">Completed for today</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList>
          <TabsTrigger value="weekly">Weekly View</TabsTrigger>
          <TabsTrigger value="daily">Daily History</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekRecords.map(({ date, dayName, record }) => {
                  const isToday = date === new Date().toISOString().split('T')[0];
                  const isWeekend =
                    new Date(date).getDay() === 0 || new Date(date).getDay() === 6;

                  return (
                    <div
                      key={date}
                      className={`rounded-lg border p-3 text-center transition-all ${
                        isToday ? 'border-primary bg-primary/5 ring-2 ring-primary' : ''
                      } ${isWeekend ? 'bg-muted/50' : ''}`}
                    >
                      <p className="text-xs font-medium text-muted-foreground">{dayName}</p>
                      <p className="text-sm font-semibold">
                        {new Date(date).getDate()}
                      </p>
                      <div className="mt-2">
                        {isWeekend ? (
                          <span className="text-xs text-muted-foreground">Weekend</span>
                        ) : record ? (
                          <div className="space-y-1">
                            {getStatusBadge(record.status)}
                            {record.checkIn && (
                              <p className="text-xs text-muted-foreground">
                                {record.checkIn}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Attendance History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.slice(0, 20).map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.date}</TableCell>
                      <TableCell>
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                        })}
                      </TableCell>
                      <TableCell>{record.checkIn || '-'}</TableCell>
                      <TableCell>{record.checkOut || '-'}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Attendance;
