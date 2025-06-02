
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthContextType } from '@/types/auth';
import { useAuthToken } from '@/hooks/useAuthToken';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuthOperations } from '@/hooks/useAuthOperations';

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
  
  const { verifyStoredToken, loading } = useAuthToken();
  const { checkSubscription } = useSubscription();
  const { login: performLogin, register: performRegister, logout: performLogout } = useAuthOperations();

  const handleCheckSubscription = async () => {
    const updatedUser = await checkSubscription(user);
    if (updatedUser) {
      setUser(updatedUser);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const { user: verifiedUser, session: verifiedSession } = await verifyStoredToken();
      setUser(verifiedUser);
      setSession(verifiedSession);
      
      // Check subscription after setting user
      if (verifiedUser) {
        setTimeout(async () => {
          const updatedUser = await checkSubscription(verifiedUser);
          if (updatedUser) {
            setUser(updatedUser);
          }
        }, 1000);
      }
    };

    initializeAuth();
  }, [verifyStoredToken, checkSubscription]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { success, user: loginUser, session: loginSession } = await performLogin(email, password);
    
    if (success && loginUser && loginSession) {
      setUser(loginUser);
      setSession(loginSession);

      // Check subscription after login
      setTimeout(async () => {
        const updatedUser = await checkSubscription(loginUser);
        if (updatedUser) {
          setUser(updatedUser);
        }
      }, 1000);

      return true;
    }

    return false;
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    const { success, user: registerUser, session: registerSession } = await performRegister(email, password);
    
    if (success && registerUser && registerSession) {
      setUser(registerUser);
      setSession(registerSession);
      return true;
    }

    return false;
  };

  const logout = async (): Promise<void> => {
    await performLogout();
    setUser(null);
    setSession(null);
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
      checkSubscription: handleCheckSubscription,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
