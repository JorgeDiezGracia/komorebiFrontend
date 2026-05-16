import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface UserData {
  token: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  saveSession: (data: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');

    if (token && username && role) {
      setUser({ token, username, role });
    }
    setLoading(false);
  }, []);

  const saveSession = (data: UserData) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, saveSession, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}