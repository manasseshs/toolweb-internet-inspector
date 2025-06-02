
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

      console.error('Login failed: missing token or user data in response:', response);
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      
      // Provide more user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('Cannot connect to server')) {
          throw new Error('Cannot connect to server. Please ensure you have an internet connection and try again.');
        }
        if (error.message.includes('Email ou senha inválidos')) {
          throw new Error('Invalid email or password');
        }
        if (error.message.includes('Conta desativada')) {
          throw new Error('Account is disabled');
        }
      }
      
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

      console.error('Registration failed: missing token or user data in response:', response);
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Provide more user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('Cannot connect to server')) {
          throw new Error('Cannot connect to server. Please ensure the backend is running and try again.');
        }
        if (error.message.includes('Email já está em uso')) {
          throw new Error('This email is already registered. Please try signing in instead.');
        }
        if (error.message.includes('Email inválido')) {
          throw new Error('Please enter a valid email address');
        }
        if (error.message.includes('Senha deve ter pelo menos')) {
          throw new Error('Password must be at least 6 characters long');
        }
      }
      
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
