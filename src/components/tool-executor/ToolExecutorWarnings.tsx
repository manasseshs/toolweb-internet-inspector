
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

interface ToolExecutorWarningsProps {
  selectedTool: string;
  requiresLogin: boolean;
  canUseTool: boolean;
}

const ToolExecutorWarnings: React.FC<ToolExecutorWarningsProps> = ({
  selectedTool,
  requiresLogin,
  canUseTool
}) => {
  const { user } = useAuth();
  
  const requiresLoginCheck = () => {
    return ['email-validation', 'email-migration'].includes(selectedTool);
  };

  return (
    <div className="space-y-3">
      {requiresLoginCheck() && (
        <Badge variant="outline" className="bg-[#e7f3ff] text-[#0d6efd] border border-[#b3d7ff]">
          Login Required
        </Badge>
      )}
      
      {requiresLogin && !user && (
        <div className="p-4 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
          <p className="text-[#856404] text-sm">
            This tool requires you to be logged in. 
            <a href="/login" className="text-[#856404] hover:text-[#533608] underline ml-1">
              Please log in
            </a>
          </p>
        </div>
      )}

      {!canUseTool && !requiresLogin && (
        <div className="p-4 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
          <p className="text-[#856404] text-sm">
            This tool requires a Pro or Enterprise plan. 
            <a href="/pricing" className="text-[#856404] hover:text-[#533608] underline ml-1">
              Upgrade now
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolExecutorWarnings;
