/**
 * Authentication Context
 * 
 * Manages user authentication state throughout the application.
 * Provides login, registration, logout, and user refresh functionality.
 * All authentication state is persisted in localStorage.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/services/types';
import { getAuthState, initializeStorage } from '@/services/storage';
import { signIn, signUp, signOut, SignInData, SignUpData } from '@/services/auth';

interface AuthContextType {
  user: User | null; // Current logged-in user data
  isAuthenticated: boolean; // Whether user is logged in
  isLoading: boolean; // Loading state during auth check
  login: (data: SignInData) => { success: boolean; error?: string };
  register: (data: SignUpData) => { success: boolean; error?: string };
  logout: () => void;
  refreshUser: () => void; // Refresh user data from storage
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({ isAuthenticated: false, user: null });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize authentication state on component mount
  // Checks localStorage for existing session
  useEffect(() => {
    initializeStorage();
    const state = getAuthState();
    setAuthState(state);
    setIsLoading(false);
  }, []);

  // Handle user login
  const login = (data: SignInData) => {
    const result = signIn(data);
    if (result.success && result.user) {
      setAuthState({ isAuthenticated: true, user: result.user });
    }
    return result;
  };

  const register = (data: SignUpData) => {
    const result = signUp(data);
    if (result.success && result.user) {
      setAuthState({ isAuthenticated: true, user: result.user });
    }
    return result;
  };

  const logout = () => {
    signOut();
    setAuthState({ isAuthenticated: false, user: null });
  };

  // Refresh user data from storage (useful after profile updates)
  const refreshUser = () => {
    const state = getAuthState();
    setAuthState(state);
  };

  return (
    <AuthContext.Provider
      value={{
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
