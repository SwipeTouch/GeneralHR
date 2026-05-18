import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface AuthUser {
  email: string;
  name: string;
  role: 'hr_admin' | 'system_admin';
  tenantName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, tenant?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'ghr_session';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email: string, _password: string, tenant?: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const session: AuthUser = {
      email,
      name: email.startsWith('hr') ? 'Priya HR' : 'Admin User',
      role: 'hr_admin',
      tenantName: tenant?.trim() || 'Demo Company',
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(session);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
