
import { useCallback } from 'react';
import { apiService } from '@/services/api';
import { AuthUser } from '@/types/auth';

export const useSubscription = () => {
  const checkSubscription = useCallback(async (user: AuthUser | null): Promise<AuthUser | null> => {
    if (!user) return null;
    
    try {
      const response = await apiService.checkSubscription();

      if (response.error) {
        console.error('Error checking subscription:', response.error);
        return user;
      }

      if (response.data) {
        let plan: 'free' | 'pro' | 'enterprise' = 'free';
        if (response.data.subscribed && response.data.subscription_tier) {
          switch (response.data.subscription_tier.toLowerCase()) {
            case 'pro':
              plan = 'pro';
              break;
            case 'enterprise':
              plan = 'enterprise';
              break;
            default:
              plan = 'free';
              break;
          }
        }

        return {
          ...user,
          subscribed: response.data.subscribed,
          subscription_tier: response.data.subscription_tier,
          subscription_end: response.data.subscription_end,
          plan
        };
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
    
    return user;
  }, []);

  return { checkSubscription };
};
