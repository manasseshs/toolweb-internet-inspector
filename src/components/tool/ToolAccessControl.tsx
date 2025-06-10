
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { checkDailyUsageLimit } from '@/services/usageTracker';

interface ToolAccessControlProps {
  selectedTool: string;
  isFree: boolean;
}

export const useToolAccess = (selectedTool: string, isFree: boolean) => {
  const { user } = useAuth();

  const requiresLogin = () => {
    // No tools require login anymore - all are publicly accessible
    return false;
  };

  const canUseTool = async () => {
    // Check daily usage limits
    const usageCheck = await checkDailyUsageLimit(selectedTool);
    
    if (!usageCheck.canUse) {
      return false;
    }

    // For anonymous users, only check usage limits
    if (!user) {
      return true;
    }

    // For authenticated users, check plan restrictions
    if (isFree) return true;
    
    const userPlan = user.user_metadata?.plan || user.plan || 'free';
    return userPlan === 'pro' || userPlan === 'enterprise';
  };

  const requiresCaptcha = () => {
    return true; // Required for ALL users, logged in or not
  };

  const getUserPlan = () => {
    if (!user) return 'anonymous';
    return user.user_metadata?.plan || user.plan || 'free';
  };

  const getDailyLimit = async () => {
    const usageCheck = await checkDailyUsageLimit(selectedTool);
    return {
      used: usageCheck.used,
      limit: usageCheck.limit,
      remaining: usageCheck.remaining || 0,
      canUse: usageCheck.canUse
    };
  };

  return {
    requiresLogin: requiresLogin(),
    canUseTool,
    requiresCaptcha: requiresCaptcha(),
    user,
    userPlan: getUserPlan(),
    getDailyLimit
  };
};

interface AccessBadgesProps {
  isFree: boolean;
  requiresLogin: boolean;
  executionId: string | null;
  userPlan?: string;
  dailyUsage?: {
    used: number;
    limit: number;
    remaining: number;
  };
}

export const AccessBadges: React.FC<AccessBadgesProps> = ({
  isFree,
  requiresLogin,
  executionId,
  userPlan = 'anonymous',
  dailyUsage
}) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!isFree && (
        <Badge variant="secondary" className="bg-[#f8f9fa] text-[#6c757d] border border-[#dee2e6]">
          Pro
        </Badge>
      )}
      {requiresLogin && (
        <Badge variant="outline" className="bg-[#e7f3ff] text-[#0d6efd] border border-[#b3d7ff]">
          Login Required
        </Badge>
      )}
      <Badge variant="outline" className="bg-[#fff3cd] text-[#856404] border border-[#ffeaa7]">
        CAPTCHA Required
      </Badge>
      <Badge variant="outline" className="bg-[#e7f3ff] text-[#0d6efd] border border-[#b3d7ff]">
        Plan: {userPlan.toUpperCase()}
      </Badge>
      {dailyUsage && (
        <Badge variant="outline" className="text-xs border-[#dee2e6] text-[#6c757d]">
          {dailyUsage.used}/{dailyUsage.limit === -1 ? '∞' : dailyUsage.limit} today
        </Badge>
      )}
      {executionId && (
        <Badge variant="outline" className="text-xs border-[#dee2e6] text-[#6c757d]">
          ID: {executionId}
        </Badge>
      )}
    </div>
  );
};

interface AccessWarningsProps {
  requiresLogin: boolean;
  canUseTool: boolean;
  user: any;
  userPlan?: string;
  dailyUsage?: {
    used: number;
    limit: number;
    remaining: number;
    canUse: boolean;
  };
}

export const AccessWarnings: React.FC<AccessWarningsProps> = ({
  requiresLogin,
  canUseTool,
  user,
  userPlan = 'anonymous',
  dailyUsage
}) => {
  if (requiresLogin && !user) {
    return (
      <div className="mt-4 p-4 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
        <p className="text-[#856404] text-sm">
          This tool requires you to be logged in. 
          <a href="/login" className="text-[#856404] hover:text-[#533608] underline ml-1">
            Please log in
          </a>
        </p>
      </div>
    );
  }

  if (dailyUsage && !dailyUsage.canUse) {
    return (
      <div className="mt-4 p-4 bg-[#f8d7da] border border-[#f5c6cb] rounded-lg">
        <p className="text-[#721c24] text-sm">
          <strong>Daily limit reached!</strong> You've used {dailyUsage.used}/{dailyUsage.limit === -1 ? '∞' : dailyUsage.limit} executions today.
          {userPlan === 'anonymous' || userPlan === 'free' ? (
            <>
              {' '}
              <a href="/pricing" className="text-[#721c24] hover:text-[#491217] underline">
                Upgrade to Pro
              </a> for higher limits.
            </>
          ) : null}
        </p>
      </div>
    );
  }

  if (!canUseTool && !requiresLogin) {
    return (
      <div className="mt-4 p-4 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
        <p className="text-[#856404] text-sm">
          This tool requires a Pro or Enterprise plan. 
          <a href="/pricing" className="text-[#856404] hover:text-[#533608] underline ml-1">
            Upgrade now
          </a>
        </p>
      </div>
    );
  }

  return null;
};
