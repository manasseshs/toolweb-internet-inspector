
import { useState, useCallback } from 'react';
import { apiService } from '@/services/api';
import { AuthUser } from '@/types/auth';

export const useAuthToken = () => {
  const [loading, setLoading] = useState(true);

  const verifyStoredToken = useCallback(async (): Promise<{ user: AuthUser | null; session: any | null }> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.log('No token found in localStorage');
      setLoading(false);
      return { user: null, session: null };
    }

    try {
      console.log('Verifying stored token');
      const response = await apiService.verifyToken();
      console.log('Token verification response:', response);
      
      if (response.error) {
        console.error('Token verification failed:', response.error);
        localStorage.removeItem('auth_token');
        setLoading(false);
        return { user: null, session: null };
      } 
      
      if (response.data?.user || response.user) {
        const userData = response.data?.user || response.user;
        const authUser: AuthUser = {
          id: userData.id.toString(),
          email: userData.email,
          plan: userData.plan || 'free',
          is_admin: userData.is_admin || false
        };
        
        console.log('Token verification successful, user:', authUser);
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
