
import { useState, useCallback } from 'react';
import { apiService } from '@/services/api';
import { AuthUser } from '@/types/auth';

export const useAuthToken = () => {
  const [loading, setLoading] = useState(true);

  const verifyStoredToken = useCallback(async (): Promise<{ user: AuthUser | null; session: any | null }> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return { user: null, session: null };
    }

    try {
      const response = await apiService.verifyToken();
      if (response.error) {
        localStorage.removeItem('auth_token');
        setLoading(false);
        return { user: null, session: null };
      } else if (response.data?.user) {
        const authUser: AuthUser = {
          ...response.data.user,
          plan: 'free'
        };
        setLoading(false);
        return { 
          user: authUser, 
          session: { access_token: token } 
        };
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      localStorage.removeItem('auth_token');
    }
    
    setLoading(false);
    return { user: null, session: null };
  }, []);

  return { verifyStoredToken, loading };
};
