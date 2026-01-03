import { User, AttendanceRecord, LeaveRequest } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    email: 'admin@company.com',
    password: 'Admin@123',
    role: 'admin',
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1 234 567 8900',
    address: '123 Corporate Drive, Business City, BC 12345',
    department: 'Human Resources',
    designation: 'HR Manager',
    joiningDate: '2020-01-15',
    profilePicture: '',
    salary: {
      basic: 75000,
      hra: 15000,
      allowances: 10000,
      deductions: 8000,
    },
  },
  {
    id: '2',
    employeeId: 'EMP002',
    email: 'john@company.com',
    password: 'John@123',
    role: 'employee',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1 234 567 8901',
    address: '456 Employee Lane, Work Town, WT 67890',
    department: 'Engineering',
    designation: 'Software Engineer',
    joiningDate: '2021-03-20',
    profilePicture: '',
    salary: {
      basic: 60000,
      hra: 12000,
      allowances: 8000,
      deductions: 6000,
    },
  },
  {
    id: '3',
    employeeId: 'EMP003',
    email: 'jane@company.com',
    password: 'Jane@123',
    role: 'employee',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '+1 234 567 8902',
    address: '789 Staff Street, Office City, OC 11223',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    joiningDate: '2022-06-10',
    profilePicture: '',
    salary: {
      basic: 55000,
      hra: 11000,
      allowances: 7000,
      deductions: 5500,
    },
  },
];

const generatePastDates = (days: number): string[] => {
  const dates: string[] = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

export const generateMockAttendance = (): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];
  const dates = generatePastDates(30);
  const statuses: AttendanceRecord['status'][] = ['present', 'present', 'present', 'present', 'half-day', 'absent', 'leave'];

  mockUsers.forEach(user => {
    dates.forEach((date, index) => {
      const dayOfWeek = new Date(date).getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) return;

      const status = statuses[Math.floor(Math.random() * statuses.length)];
      records.push({
        id: `${user.id}-${date}`,
        date,
        userId: user.id,
        checkIn: status === 'present' || status === 'half-day' ? '09:00' : null,
        checkOut: status === 'present' ? '18:00' : status === 'half-day' ? '13:00' : null,
        status,
      });
    });
  });

  return records;
};

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    userId: '2',
    employeeName: 'John Smith',
    leaveType: 'paid',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    remarks: 'Family vacation',
    status: 'approved',
    adminComment: 'Approved. Enjoy your vacation!',
    createdAt: '2024-01-25',
  },
  {
    id: '2',
    userId: '3',
    employeeName: 'Jane Doe',
    leaveType: 'sick',
    startDate: '2024-02-10',
    endDate: '2024-02-11',
    remarks: 'Not feeling well',
    status: 'pending',
    createdAt: '2024-02-09',
  },
  {
    id: '3',
    userId: '2',
    employeeName: 'John Smith',
    leaveType: 'unpaid',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    remarks: 'Personal matters',
    status: 'rejected',
    adminComment: 'Cannot approve during project deadline',
    createdAt: '2024-03-01',
  },
];
