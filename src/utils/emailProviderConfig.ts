
export interface ProviderConfig {
  alwaysAccepts: boolean;
  requiresMultiStep: boolean;
  retryDelay: number;
  maxAttempts: number;
  trustLevel: 'high' | 'medium' | 'low';
}

export const getEmailProvider = (email: string): string => {
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain?.includes('gmail')) return 'gmail';
  if (domain?.includes('hotmail') || domain?.includes('outlook') || domain?.includes('live')) return 'outlook';
  if (domain?.includes('yahoo')) return 'yahoo';
  if (domain?.includes('aol')) return 'aol';
  return 'other';
};

export const getProviderConfig = (provider: string): ProviderConfig => {
  const configs = {
    gmail: {
      alwaysAccepts: true,
      requiresMultiStep: true,
      retryDelay: 5000,
      maxAttempts: 3,
      trustLevel: 'low' as const
    },
    outlook: {
      alwaysAccepts: true,
      requiresMultiStep: true,
      retryDelay: 7000,
      maxAttempts: 2,
      trustLevel: 'low' as const
    },
    yahoo: {
      alwaysAccepts: false,
      requiresMultiStep: false,
      retryDelay: 0,
      maxAttempts: 1,
      trustLevel: 'high' as const
    },
    other: {
      alwaysAccepts: false,
      requiresMultiStep: false,
      retryDelay: 0,
      maxAttempts: 1,
      trustLevel: 'medium' as const
    }
  };
  return configs[provider as keyof typeof configs] || configs.other;
};
