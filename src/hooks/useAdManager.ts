
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdManagerState {
  shouldShowAds: boolean;
  isAdBlocked: boolean;
  executionCount: number;
}

export const useAdManager = () => {
  const { user } = useAuth();
  const [adState, setAdState] = useState<AdManagerState>({
    shouldShowAds: false,
    isAdBlocked: false,
    executionCount: 0
  });

  useEffect(() => {
    // Determine if ads should be shown based on user plan
    const shouldShow = shouldShowAdsForUser(user);
    
    // Check if ads are blocked (simple detection)
    const adBlocked = detectAdBlocker();
    
    setAdState(prev => ({
      ...prev,
      shouldShowAds: shouldShow,
      isAdBlocked: adBlocked
    }));
  }, [user]);

  const shouldShowAdsForUser = (currentUser: any): boolean => {
    // Show ads for all free users (anonymous and logged in)
    if (!currentUser) return true; // Anonymous users
    
    const userPlan = currentUser.plan || 'free';
    return userPlan === 'free'; // Only free plan users see ads
  };

  const detectAdBlocker = (): boolean => {
    // Simple ad blocker detection
    try {
      const testAd = document.createElement('div');
      testAd.innerHTML = '&nbsp;';
      testAd.className = 'adsbox';
      testAd.style.position = 'absolute';
      testAd.style.left = '-10000px';
      document.body.appendChild(testAd);
      
      const blocked = testAd.offsetHeight === 0;
      document.body.removeChild(testAd);
      
      return blocked;
    } catch (e) {
      return false;
    }
  };

  const incrementExecutionCount = () => {
    setAdState(prev => ({
      ...prev,
      executionCount: prev.executionCount + 1
    }));
  };

  const refreshAds = () => {
    // Trigger ad refresh by incrementing execution count
    incrementExecutionCount();
  };

  return {
    shouldShowAds: adState.shouldShowAds,
    isAdBlocked: adState.isAdBlocked,
    executionCount: adState.executionCount,
    refreshAds,
    incrementExecutionCount
  };
};
