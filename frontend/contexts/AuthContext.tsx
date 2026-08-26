'use client';

import React, {
  createContext, useContext, useState, useCallback,
  useEffect, ReactNode,
} from 'react';

export type AuthRole = 'user' | 'admin' | null;

interface AuthUser {
  role: AuthRole;
  name?: string;
  email?: string;
  username?: string;
}

interface AuthContextType {
  auth: AuthUser;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;           // true while reading from sessionStorage
  loginAsUser: (name: string, email: string) => void;
  loginAsAdmin: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'propai_auth';

// Demo admin credentials
const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

function readStorage(): AuthUser {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AuthUser;
  } catch {}
  return { role: null };
}

function writeStorage(user: AuthUser) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Start with role: null + loading until we check sessionStorage
  const [auth, setAuth] = useState<AuthUser>({ role: null });
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from sessionStorage on first mount (client-only)
  useEffect(() => {
    const stored = readStorage();
    setAuth(stored);
    setIsLoading(false);
  }, []);

  const loginAsUser = useCallback((name: string, email: string) => {
    const user: AuthUser = { role: 'user', name, email };
    setAuth(user);
    writeStorage(user);
  }, []);

  const loginAsAdmin = useCallback((username: string, password: string): boolean => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const user: AuthUser = { role: 'admin', username };
      setAuth(user);
      writeStorage(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    const empty: AuthUser = { role: null };
    setAuth(empty);
    writeStorage(empty);
  }, []);

  return (
    <AuthContext.Provider value={{
      auth,
      isAuthenticated: auth.role !== null,
      isAdmin: auth.role === 'admin',
      isLoading,
      loginAsUser,
      loginAsAdmin,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      auth: { role: null },
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      loginAsUser: () => {},
      loginAsAdmin: () => false,
      logout: () => {},
    };
  }
  return ctx;
}
