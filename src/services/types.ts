export type UserRole = 'employee' | 'admin';

export interface User {
  id: string;
  employeeId: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  department: string;
  designation: string;
  joiningDate: string;
  profilePicture: string;
  salary: {
    basic: number;
    hra: number;
    allowances: number;
    deductions: number;
  };
}

export interface AttendanceRecord {
  id: string;
  date: string;
  userId: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'present' | 'absent' | 'half-day' | 'leave';
}

export interface LeaveRequest {
  id: string;
  userId: string;
  employeeName: string;
  leaveType: 'paid' | 'sick' | 'unpaid';
  startDate: string;
  endDate: string;
  remarks: string;
  status: 'pending' | 'approved' | 'rejected';
  adminComment?: string;
  createdAt: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}
