
import { useCallback } from 'react';
import { apiService } from '@/services/api';
import { AuthUser } from '@/types/auth';

export const useAuthOperations = () => {
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; user: AuthUser | null; session: any | null }> => {
    try {
      console.log('Attempting login with email:', email);
      const response = await apiService.login(email, password);
      console.log('Login response:', response);

      if (response.error) {
        console.error('Login error:', response.error);
        throw new Error(response.error);
      }

      // Check different possible response structures
      const tokenData = response.data?.token || response.token;
      const userData = response.data?.user || response.user || response.data;

      if (tokenData && userData) {
        localStorage.setItem('auth_token', tokenData);
        
        const authUser: AuthUser = {
          id: userData.id.toString(),
          email: userData.email,
          plan: userData.plan || 'free',
          is_admin: userData.is_admin || false
        };

        console.log('Login successful, user:', authUser);
        return {
          success: true,
          user: authUser,
          session: { access_token: tokenData }
        };
      }

      console.error('Login failed: missing token or user data');
      return { success: false, user: null, session: null };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (email: string, password: string): Promise<{ success: boolean; user: AuthUser | null; session: any | null }> => {
    try {
      console.log('Attempting registration with email:', email);
      const response = await apiService.register(email, password);
      console.log('Registration response:', response);

      if (response.error) {
        console.error('Registration error:', response.error);
        throw new Error(response.error);
      }

      // Check different possible response structures
      const tokenData = response.data?.token || response.token;
      const userData = response.data?.user || response.user || response.data;

      if (tokenData && userData) {
        localStorage.setItem('auth_token', tokenData);
        
        const authUser: AuthUser = {
          id: userData.id.toString(),
          email: userData.email,
          plan: userData.plan || 'free',
          is_admin: userData.is_admin || false
        };

        console.log('Registration successful, user:', authUser);
        return {
          success: true,
          user: authUser,
          session: { access_token: tokenData }
        };
      }

      console.error('Registration failed: missing token or user data');
      return { success: false, user: null, session: null };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log('Logging out user');
      localStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return { login, register, logout };
};
