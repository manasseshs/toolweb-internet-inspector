
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser extends User {
  plan?: 'free' | 'pro' | 'enterprise';
  planExpiry?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updatePlan: (plan: 'free' | 'pro' | 'enterprise', expiry?: string) => void;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        if (session?.user) {
          const authUser = {
            ...session.user,
            plan: 'free' as const
          };
          setUser(authUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const authUser = {
          ...session.user,
          plan: 'free' as const
        };
        setUser(authUser);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Registration error:', error.message);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error.message);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updatePlan = (plan: 'free' | 'pro' | 'enterprise', expiry?: string) => {
    if (user) {
      const updatedUser = { ...user, plan, planExpiry: expiry };
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
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
