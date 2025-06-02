
const API_BASE_URL = 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  errors?: Array<{ msg: string; field?: string }>;
}

class ApiService {
  private getHeaders(includeAuth: boolean = true): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getHeaders(options.headers?.Authorization !== undefined),
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Request failed' };
      }

      return { data };
    } catch (error) {
      console.error('API request error:', error);
      return { error: 'Network error occurred' };
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { Authorization: undefined },
    });
  }

  async register(email: string, password: string) {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { Authorization: undefined },
    });
  }

  async verifyToken() {
    return this.makeRequest('/auth/verify');
  }

  // Email verification methods
  async verifyEmails(emails: string[]) {
    return this.makeRequest('/email/verify', {
      method: 'POST',
      body: JSON.stringify({ emails }),
    });
  }

  async getVerificationHistory(page: number = 1, limit: number = 50) {
    return this.makeRequest(`/email/history?page=${page}&limit=${limit}`);
  }

  // Subscription methods
  async createCheckoutSession(priceId: string, planName: string) {
    return this.makeRequest('/subscription/create-checkout', {
      method: 'POST',
      body: JSON.stringify({ priceId, planName }),
    });
  }

  async checkSubscription() {
    return this.makeRequest('/subscription/status');
  }

  async createCustomerPortal() {
    return this.makeRequest('/subscription/customer-portal', {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();
export default apiService;
