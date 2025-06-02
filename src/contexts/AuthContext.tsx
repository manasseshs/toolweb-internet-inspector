
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';

interface AuthUser {
  id: string;
  email: string;
  plan?: 'free' | 'pro' | 'enterprise';
  planExpiry?: string;
  subscribed?: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updatePlan: (plan: 'free' | 'pro' | 'enterprise', expiry?: string) => void;
  checkSubscription: () => Promise<void>;
  loading: boolean;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!user) return;
    
    try {
      const response = await apiService.checkSubscription();

      if (response.error) {
        console.error('Error checking subscription:', response.error);
        return;
      }

      if (user && response.data) {
        let plan: 'free' | 'pro' | 'enterprise' = 'free';
        if (response.data.subscribed && response.data.subscription_tier) {
          switch (response.data.subscription_tier.toLowerCase()) {
            case 'pro':
              plan = 'pro';
              break;
            case 'enterprise':
              plan = 'enterprise';
              break;
            default:
              plan = 'free';
              break;
          }
        }

        const updatedUser: AuthUser = {
          ...user,
          subscribed: response.data.subscribed,
          subscription_tier: response.data.subscription_tier,
          subscription_end: response.data.subscription_end,
          plan
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const verifyStoredToken = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.verifyToken();
      if (response.error) {
        localStorage.removeItem('auth_token');
        setUser(null);
        setSession(null);
      } else if (response.data?.user) {
        const authUser: AuthUser = {
          ...response.data.user,
          plan: 'free'
        };
        setUser(authUser);
        setSession({ access_token: token });
        
        // Check subscription after setting user
        setTimeout(() => {
          checkSubscription();
        }, 1000);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('auth_token');
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyStoredToken();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.login(email, password);

      if (response.error) {
        console.error('Login error:', response.error);
        throw new Error(response.error);
      }

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('auth_token', response.data.token);
        
        const authUser: AuthUser = {
          ...response.data.user,
          plan: 'free'
        };
        setUser(authUser);
        setSession({ access_token: response.data.token });

        // Check subscription after login
        setTimeout(() => {
          checkSubscription();
        }, 1000);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiService.register(email, password);

      if (response.error) {
        console.error('Registration error:', response.error);
        throw new Error(response.error);
      }

      if (response.data?.token && response.data?.user) {
        localStorage.setItem('auth_token', response.data.token);
        
        const authUser: AuthUser = {
          ...response.data.user,
          plan: 'free'
        };
        setUser(authUser);
        setSession({ access_token: response.data.token });

        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      localStorage.removeItem('auth_token');
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updatePlan = (plan: 'free' | 'pro' | 'enterprise', expiry?: string) => {
    if (user) {
      const updatedUser: AuthUser = { ...user, plan, planExpiry: expiry };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login, 
      register, 
      logout, 
      updatePlan, 
      checkSubscription,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
