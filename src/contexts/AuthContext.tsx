
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser extends User {
  plan?: 'free' | 'pro' | 'enterprise';
  planExpiry?: string;
  subscribed?: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSubscription = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      if (user && data) {
        // Ensure proper type casting for plan
        let plan: 'free' | 'pro' | 'enterprise' = 'free';
        if (data.subscribed && data.subscription_tier) {
          switch (data.subscription_tier.toLowerCase()) {
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
          subscribed: data.subscribed,
          subscription_tier: data.subscription_tier,
          subscription_end: data.subscription_end,
          plan
        };
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        if (session?.user) {
          const authUser: AuthUser = {
            ...session.user,
            plan: 'free'
          };
          setUser(authUser);
          
          // Check subscription status after login
          if (event === 'SIGNED_IN') {
            setTimeout(() => {
              checkSubscription();
            }, 1000);
          }
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
        const authUser: AuthUser = {
          ...session.user,
          plan: 'free'
        };
        setUser(authUser);
        // Check subscription for existing session
        setTimeout(() => {
          checkSubscription();
        }, 1000);
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
