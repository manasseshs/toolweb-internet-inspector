
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface ToolAccessControlProps {
  selectedTool: string;
  isFree: boolean;
}

export const useToolAccess = (selectedTool: string, isFree: boolean) => {
  const { user } = useAuth();

  const requiresLogin = () => {
    return false; // Removed login requirement for most tools
  };

  const canUseTool = () => {
    if (requiresLogin() && !user) return false;
    if (isFree) return true;
    return user && (user.plan === 'pro' || user.plan === 'enterprise');
  };

  const requiresCaptcha = () => {
    return true; // Now required for ALL users, logged in or not
  };

  return {
    requiresLogin: requiresLogin(),
    canUseTool: canUseTool(),
    requiresCaptcha: requiresCaptcha(),
    user
  };
};

interface AccessBadgesProps {
  isFree: boolean;
  requiresLogin: boolean;
  executionId: string | null;
}

export const AccessBadges: React.FC<AccessBadgesProps> = ({
  isFree,
  requiresLogin,
  executionId
}) => {
  return (
    <div className="flex items-center gap-2">
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
}

export const AccessWarnings: React.FC<AccessWarningsProps> = ({
  requiresLogin,
  canUseTool,
  user
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
