
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RefreshCw } from 'lucide-react';
import CaptchaComponent from '@/components/CaptchaComponent';

interface ToolExecutorActionsProps {
  toolName: string;
  isFree: boolean;
  isLoading: boolean;
  canUseTool: boolean;
  requiresCaptcha: boolean;
  captchaVerified: boolean;
  setCaptchaVerified: (verified: boolean) => void;
  executionId: string | null;
  onExecute: () => void;
}

const ToolExecutorActions: React.FC<ToolExecutorActionsProps> = ({
  toolName,
  isFree,
  isLoading,
  canUseTool,
  requiresCaptcha,
  captchaVerified,
  setCaptchaVerified,
  executionId,
  onExecute
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h3 className="text-[#212529] font-medium">{toolName}</h3>
        {!isFree && <Badge variant="secondary" className="bg-[#f8f9fa] text-[#6c757d] border border-[#dee2e6]">Pro</Badge>}
        {executionId && (
          <Badge variant="outline" className="text-xs border-[#dee2e6] text-[#6c757d]">
            ID: {executionId}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {requiresCaptcha && (
          <CaptchaComponent 
            onVerify={setCaptchaVerified}
            isRequired={requiresCaptcha}
          />
        )}
        
        <Button 
          onClick={onExecute}
          disabled={isLoading || !canUseTool || (requiresCaptcha && !captchaVerified)}
          className="min-w-[120px] bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-none"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isLoading ? 'Running...' : 'Analyze'}
        </Button>
      </div>
    </div>
  );
};

export default ToolExecutorActions;
