
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  planExpiry?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updatePlan: (plan: 'free' | 'pro' | 'enterprise', expiry?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('toolweb_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email && password) {
      const userData = {
        id: '1',
        email,
        plan: 'free' as const
      };
      setUser(userData);
      localStorage.setItem('toolweb_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    if (email && password) {
      const userData = {
        id: Date.now().toString(),
        email,
        plan: 'free' as const
      };
      setUser(userData);
      localStorage.setItem('toolweb_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('toolweb_user');
  };

  const updatePlan = (plan: 'free' | 'pro' | 'enterprise', expiry?: string) => {
    if (user) {
      const updatedUser = { ...user, plan, planExpiry: expiry };
      setUser(updatedUser);
      localStorage.setItem('toolweb_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updatePlan }}>
      {children}
    </AuthContext.Provider>
  );
};
