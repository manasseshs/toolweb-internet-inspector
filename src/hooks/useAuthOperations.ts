
import { useCallback } from 'react';
import { apiService } from '@/services/api';
import { AuthUser } from '@/types/auth';

export const useAuthOperations = () => {
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; user: AuthUser | null; session: any | null }> => {
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

        return {
          success: true,
          user: authUser,
          session: { access_token: response.data.token }
        };
      }

      return { success: false, user: null, session: null };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<{ success: boolean; user: AuthUser | null; session: any | null }> => {
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

        return {
          success: true,
          user: authUser,
          session: { access_token: response.data.token }
        };
      }

      return { success: false, user: null, session: null };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return { login, register, logout };
};
