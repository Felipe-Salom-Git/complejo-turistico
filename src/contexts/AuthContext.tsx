'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'admin' | 'user' | 'mucama' | 'developer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  staffId?: string; // Links to StaffContext ID
}

interface AuthContextType {
  user: User | null;
  login: (name: string, role: UserRole, staffId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // FORCE LOGIN AS GREENDEVS (As requested by user)
    const devUser: User = { id: 'dev-001', name: 'GreenDevs', role: 'developer' };
    setUser(devUser);
    localStorage.setItem('auth_user', JSON.stringify(devUser));
  }, []);

  const login = (name: string, role: UserRole, staffId?: string) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      role,
      staffId
    };
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
