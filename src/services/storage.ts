import { User, AttendanceRecord, LeaveRequest, AuthState } from './types';
import { mockUsers, generateMockAttendance, mockLeaveRequests } from './mockData';

const STORAGE_KEYS = {
  AUTH: 'hrms_auth',
  USERS: 'hrms_users',
  ATTENDANCE: 'hrms_attendance',
  LEAVE_REQUESTS: 'hrms_leave_requests',
};

// Initialize storage with mock data if empty
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ATTENDANCE)) {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(generateMockAttendance()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(mockLeaveRequests));
  }
};

// Auth functions
export const getAuthState = (): AuthState => {
  const auth = sessionStorage.getItem(STORAGE_KEYS.AUTH);
  if (auth) {
    return JSON.parse(auth);
  }
  return { isAuthenticated: false, user: null };
};

export const setAuthState = (state: AuthState): void => {
  sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(state));
};

export const clearAuthState = (): void => {
  sessionStorage.removeItem(STORAGE_KEYS.AUTH);
};

// User functions
export const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : [];
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

export const getUserByEmployeeId = (employeeId: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.employeeId.toLowerCase() === employeeId.toLowerCase());
};

export const addUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const updateUser = (updatedUser: User): void => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === updatedUser.id);
  if (index !== -1) {
    users[index] = updatedUser;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Update session if current user is updated
    const auth = getAuthState();
    if (auth.user && auth.user.id === updatedUser.id) {
      setAuthState({ ...auth, user: updatedUser });
    }
  }
};

// Attendance functions
export const getAttendanceRecords = (): AttendanceRecord[] => {
  const records = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
  return records ? JSON.parse(records) : [];
};

export const getAttendanceByUserId = (userId: string): AttendanceRecord[] => {
  const records = getAttendanceRecords();
  return records.filter(record => record.userId === userId);
};

export const getTodayAttendance = (userId: string): AttendanceRecord | undefined => {
  const today = new Date().toISOString().split('T')[0];
  const records = getAttendanceRecords();
  return records.find(record => record.userId === userId && record.date === today);
};

export const addAttendanceRecord = (record: AttendanceRecord): void => {
  const records = getAttendanceRecords();
  const existingIndex = records.findIndex(
    r => r.userId === record.userId && r.date === record.date
  );
  
  if (existingIndex !== -1) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }
  
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
};

export const updateAttendanceRecord = (record: AttendanceRecord): void => {
  const records = getAttendanceRecords();
  const index = records.findIndex(r => r.id === record.id);
  if (index !== -1) {
    records[index] = record;
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  }
};

// Leave request functions
export const getLeaveRequests = (): LeaveRequest[] => {
  const requests = localStorage.getItem(STORAGE_KEYS.LEAVE_REQUESTS);
  return requests ? JSON.parse(requests) : [];
};

export const getLeaveRequestsByUserId = (userId: string): LeaveRequest[] => {
  const requests = getLeaveRequests();
  return requests.filter(request => request.userId === userId);
};

export const addLeaveRequest = (request: LeaveRequest): void => {
  const requests = getLeaveRequests();
  requests.push(request);
  localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(requests));
};

export const updateLeaveRequest = (updatedRequest: LeaveRequest): void => {
  const requests = getLeaveRequests();
  const index = requests.findIndex(request => request.id === updatedRequest.id);
  if (index !== -1) {
    requests[index] = updatedRequest;
    localStorage.setItem(STORAGE_KEYS.LEAVE_REQUESTS, JSON.stringify(requests));
  }
};
