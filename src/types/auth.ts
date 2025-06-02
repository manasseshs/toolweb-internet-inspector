
export interface AuthUser {
  id: string;
  email: string;
  plan?: 'free' | 'pro' | 'enterprise';
  planExpiry?: string;
  subscribed?: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  is_admin?: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updatePlan: (plan: 'free' | 'pro' | 'enterprise', expiry?: string) => void;
  checkSubscription: () => Promise<void>;
  loading: boolean;
}
