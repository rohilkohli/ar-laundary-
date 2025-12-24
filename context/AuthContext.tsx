
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockLogin } from '../services/mockDb';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fix: Added optional modifier to children prop to resolve TS errors in consumers
export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem('dhobighat_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, role: UserRole) => {
    setLoading(true);
    try {
      const loggedInUser = await mockLogin(email, role);
      setUser(loggedInUser);
      localStorage.setItem('dhobighat_session', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dhobighat_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
