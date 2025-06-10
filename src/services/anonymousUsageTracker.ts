
interface AnonymousUsageCheckResult {
  canUse: boolean;
  usedToday: number;
  dailyLimit: number;
  remaining: number;
}

interface AnonymousUsageData {
  toolId: string;
  inputData: string;
  success: boolean;
  executionTime?: number;
  errorMessage?: string;
  userAgent?: string;
}

class AnonymousUsageTracker {
  private baseUrl: string;

  constructor() {
    // Use the backend URL from environment or default to localhost
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-backend-domain.com/api' 
      : 'http://localhost:5000/api';
  }

  private async getClientIP(): Promise<string> {
    try {
      // Try to get IP from a reliable service
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.warn('Could not get client IP:', error);
      // Fallback to a default IP for development
      return '127.0.0.1';
    }
  }

  async checkUsageLimit(toolId: string): Promise<AnonymousUsageCheckResult> {
    try {
      const ip = await this.getClientIP();
      
      const response = await fetch(`${this.baseUrl}/anonymous/check-limit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip_address: ip,
          tool_id: toolId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check usage limit');
      }

      const result = await response.json();
      
      return {
        canUse: result.can_use || false,
        usedToday: result.used_today || 0,
        dailyLimit: result.daily_limit || 10,
        remaining: result.remaining || 0
      };
    } catch (error) {
      console.error('Error checking anonymous usage limit:', error);
      // Return conservative defaults on error
      return {
        canUse: false,
        usedToday: 0,
        dailyLimit: 10,
        remaining: 0
      };
    }
  }

  async trackUsage(data: AnonymousUsageData): Promise<void> {
    try {
      const ip = await this.getClientIP();
      const userAgent = navigator.userAgent;

      const response = await fetch(`${this.baseUrl}/anonymous/track-usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip_address: ip,
          tool_id: data.toolId,
          input_data: data.inputData,
          success: data.success,
          execution_time: data.executionTime,
          error_message: data.errorMessage,
          user_agent: userAgent
        })
      });

      if (!response.ok) {
        console.warn('Failed to track anonymous usage');
      }
    } catch (error) {
      console.error('Error tracking anonymous usage:', error);
      // Don't throw error to avoid breaking tool execution
    }
  }

  async getUsageStats(dateFrom?: string, dateTo?: string): Promise<any[]> {
    try {
      const ip = await this.getClientIP();
      
      const params = new URLSearchParams({
        ip_address: ip,
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo })
      });

      const response = await fetch(`${this.baseUrl}/anonymous/usage-stats?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to get usage stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting anonymous usage stats:', error);
      return [];
    }
  }
}

export const anonymousUsageTracker = new AnonymousUsageTracker();
