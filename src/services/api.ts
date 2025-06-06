
// Simple relative path for production, localhost for development
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  errors?: Array<{ msg: string; field?: string }>;
  // Add support for direct response properties
  token?: string;
  user?: any;
}

// Define specific response types
interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    plan?: string;
    is_admin?: boolean;
  };
}

interface VerifyEmailsResponse {
  results: Array<{
    email: string;
    status: string;
    confidence: number;
    provider?: string;
    smtp_server?: string;
    smtp_response_code?: string;
    smtp_response_message?: string;
    verification_attempts?: number;
    details?: any;
  }>;
}

interface VerificationHistoryResponse {
  verifications: Array<{
    id: string;
    email_address: string;
    status: string;
    smtp_server?: string;
    smtp_response_code?: string;
    smtp_response_message?: string;
    verification_details?: any;
    verification_attempts?: number;
    created_at: string;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface SubscriptionResponse {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

interface CustomerPortalResponse {
  url: string;
}

interface UserResponse {
  user: {
    id: string;
    email: string;
    plan?: string;
    is_admin?: boolean;
  };
}

class ApiService {
  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const shouldIncludeAuth = !options.headers || !('Authorization' in options.headers);
      const url = `${API_BASE_URL}${endpoint}`;
      
      console.log(`Making request to: ${url}`);
      console.log('Environment:', import.meta.env.DEV ? 'development' : 'production');
      console.log('API Base URL:', API_BASE_URL);
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(shouldIncludeAuth),
          ...options.headers,
        },
      });

      console.log(`Response status: ${response.status} ${response.statusText}`);
      console.log(`Response URL: ${response.url}`);

      // Log response body for debugging
      const responseText = await response.text();
      console.log(`Raw response from ${endpoint}:`, responseText);
      
      let data;
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        console.error('Response text was:', responseText);
        return { error: 'Invalid response format from server' };
      }

      if (!response.ok) {
        console.error(`HTTP Error ${response.status}:`, data);
        
        // Handle validation errors from express-validator
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessage = data.errors.map((err: any) => err.msg).join(', ');
          return { error: errorMessage };
        }
        
        // Specific error handling for common HTTP status codes
        switch (response.status) {
          case 404:
            return { error: `API endpoint not found: ${endpoint}. Please check if the backend is running and accessible.` };
          case 500:
            return { error: 'Internal server error. Please try again later.' };
          case 502:
            return { error: 'Bad gateway. The server cannot reach the backend.' };
          case 503:
            return { error: 'Service unavailable. The backend server may be down.' };
          default:
            return { error: data.error || data.message || `HTTP ${response.status}: ${response.statusText}` };
        }
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      console.error('Full error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        url: `${API_BASE_URL}${endpoint}`,
        environment: import.meta.env.DEV ? 'development' : 'production'
      });
      
      // Provide more specific error messages based on error type
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        if (import.meta.env.DEV) {
          return { 
            error: 'Cannot connect to server. Please ensure the backend is running on localhost:5000.' 
          };
        } else {
          return { 
            error: `Cannot connect to API at ${API_BASE_URL}${endpoint}. Please check server configuration.` 
          };
        }
      }
      
      return { error: 'Network error occurred. Please check your connection and try again.' };
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Authorization': '' },
    });
  }

  async register(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return this.makeRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Authorization': '' },
    });
  }

  async verifyToken(): Promise<ApiResponse<UserResponse>> {
    return this.makeRequest<UserResponse>('/auth/verify');
  }

  // Email verification methods
  async verifyEmails(emails: string[]): Promise<ApiResponse<VerifyEmailsResponse>> {
    return this.makeRequest<VerifyEmailsResponse>('/email/verify', {
      method: 'POST',
      body: JSON.stringify({ emails }),
    });
  }

  async getVerificationHistory(page: number = 1, limit: number = 50): Promise<ApiResponse<VerificationHistoryResponse>> {
    return this.makeRequest<VerificationHistoryResponse>(`/email/history?page=${page}&limit=${limit}`);
  }

  async createCheckoutSession(priceId: string, planName: string): Promise<ApiResponse<any>> {
    return this.makeRequest<any>('/subscription/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ priceId, planName }),
    });
  }

  async checkSubscription(): Promise<ApiResponse<SubscriptionResponse>> {
    return this.makeRequest<SubscriptionResponse>('/subscription/status');
  }

  async createCustomerPortal(): Promise<ApiResponse<CustomerPortalResponse>> {
    return this.makeRequest<CustomerPortalResponse>('/subscription/customer-portal', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
