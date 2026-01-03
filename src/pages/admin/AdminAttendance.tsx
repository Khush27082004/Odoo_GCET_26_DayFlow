import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Calendar } from 'lucide-react';
import { getUsers, getAttendanceRecords } from '@/services/storage';
import { User, AttendanceRecord } from '@/services/types';

const AdminAttendance: React.FC = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const users = getUsers();
    setEmployees(users);

    const records = getAttendanceRecords();
    setAttendanceRecords(records);
  };

  const getEmployeeName = (userId: string) => {
    const emp = employees.find((e) => e.id === userId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  };

  const getEmployeeInfo = (userId: string) => {
    return employees.find((e) => e.id === userId);
  };

  const filteredRecords = attendanceRecords
    .filter((record) => {
      const matchesEmployee =
        selectedEmployee === 'all' || record.userId === selectedEmployee;
      const matchesDate = record.date === selectedDate;
      const emp = getEmployeeInfo(record.userId);
      const matchesSearch =
        !searchQuery ||
        emp?.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp?.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp?.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesEmployee && matchesDate && matchesSearch;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

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

  // Calculate stats for selected date
  const dateStats = {
    present: filteredRecords.filter((r) => r.status === 'present').length,
    absent: filteredRecords.filter((r) => r.status === 'absent').length,
    halfDay: filteredRecords.filter((r) => r.status === 'half-day').length,
    leave: filteredRecords.filter((r) => r.status === 'leave').length,
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Attendance Management"
        description="View and manage employee attendance records"
      />

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-success">{dateStats.present}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">{dateStats.absent}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-warning">{dateStats.halfDay}</p>
            <p className="text-sm text-muted-foreground">Half-Day</p>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-info">{dateStats.leave}</p>
            <p className="text-sm text-muted-foreground">On Leave</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-lg">Attendance Records</CardTitle>
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 pl-9"
                />
              </div>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-44 pl-9"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No attendance records found for the selected filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords.map((record) => {
                  const emp = getEmployeeInfo(record.userId);
                  return (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {emp?.firstName[0]}
                            {emp?.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium">
                              {emp?.firstName} {emp?.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{emp?.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{emp?.employeeId}</TableCell>
                      <TableCell>{emp?.department}</TableCell>
                      <TableCell>{record.checkIn || '-'}</TableCell>
                      <TableCell>{record.checkOut || '-'}</TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminAttendance;
