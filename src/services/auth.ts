/**
 * Authentication Service
 * 
 * Handles user authentication operations:
 * - User registration with validation
 * - User login with credentials verification
 * - User logout
 * - Role-based access checks
 * 
 * All user data is stored in browser localStorage.
 */

import { User, UserRole } from './types';
import {
  getAuthState,
  setAuthState,
  clearAuthState,
  getUserByEmail,
  getUserByEmployeeId,
  addUser,
  getUsers,
} from './storage';
import { z } from 'zod';

export const signUpSchema = z.object({
  employeeId: z.string().min(3, 'Employee ID must be at least 3 characters').max(20, 'Employee ID must be less than 20 characters'),
  email: z.string().email('Invalid email address').max(100, 'Email must be less than 100 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must be less than 50 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  role: z.enum(['employee', 'admin'] as const),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;

interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

/**
 * Register a new user
 * Validates input, checks for duplicates, and creates user account
 */
export const signUp = (data: SignUpData): AuthResult => {
  try {
    // Validate input data against schema
    signUpSchema.parse(data);

    // Check if email already exists in system
    if (getUserByEmail(data.email)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Check if employee ID already exists in system
    if (getUserByEmployeeId(data.employeeId)) {
      return { success: false, error: 'This Employee ID is already registered' };
    }

    const users = getUsers();
    const newUser: User = {
      id: String(users.length + 1),
      employeeId: data.employeeId,
      email: data.email,
      password: data.password,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: '',
      address: '',
      department: data.role === 'admin' ? 'Human Resources' : 'General',
      designation: data.role === 'admin' ? 'HR Manager' : 'Employee',
      joiningDate: new Date().toISOString().split('T')[0],
      profilePicture: '',
      salary: {
        basic: data.role === 'admin' ? 60000 : 45000,
        hra: data.role === 'admin' ? 12000 : 9000,
        allowances: data.role === 'admin' ? 8000 : 6000,
        deductions: data.role === 'admin' ? 6000 : 4500,
      },
    };

    addUser(newUser);
    setAuthState({ isAuthenticated: true, user: newUser });

    return { success: true, user: newUser };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
};

/**
 * Authenticate an existing user
 * Validates credentials and sets authentication state
 */
export const signIn = (data: SignInData): AuthResult => {
  try {
    // Validate input data
    signInSchema.parse(data);

    // Find user by email
    const user = getUserByEmail(data.email);

    if (!user) {
      return { success: false, error: 'No account found with this email' };
    }

    // Verify password (in production, use hashed passwords)
    if (user.password !== data.password) {
      return { success: false, error: 'Incorrect password' };
    }

    setAuthState({ isAuthenticated: true, user });

    return { success: true, user };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'An unexpected error occurred' };
  }
};

export const signOut = (): void => {
  clearAuthState();
};

export const getCurrentUser = (): User | null => {
  const authState = getAuthState();
  return authState.user;
};

export const isAuthenticated = (): boolean => {
  const authState = getAuthState();
  return authState.isAuthenticated;
};

export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

export const isAdmin = (): boolean => hasRole('admin');
export const isEmployee = (): boolean => hasRole('employee');
