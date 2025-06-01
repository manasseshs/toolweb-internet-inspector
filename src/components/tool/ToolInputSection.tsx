
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, RefreshCw } from 'lucide-react';
import CaptchaComponent from '@/components/CaptchaComponent';
import { AccessBadges, AccessWarnings } from './ToolAccessControl';

interface ToolInputSectionProps {
  toolName: string;
  inputType: string;
  isFree: boolean;
  onExecute: (input: string, captchaVerified: boolean) => void;
  isLoading: boolean;
  canUseTool: boolean;
  requiresLogin: boolean;
  requiresCaptcha: boolean;
  user: any;
  executionId: string | null;
}

const ToolInputSection: React.FC<ToolInputSectionProps> = ({
  toolName,
  inputType,
  isFree,
  onExecute,
  isLoading,
  canUseTool,
  requiresLogin,
  requiresCaptcha,
  user,
  executionId
}) => {
  const [input, setInput] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);

  const handleExecute = () => {
    onExecute(input, captchaVerified);
  };

  return (
    <Card className="border-[#dee2e6] bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-[#212529] font-medium">{toolName}</h3>
            <AccessBadges 
              isFree={isFree}
              requiresLogin={requiresLogin}
              executionId={executionId}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Input
              placeholder={`Enter ${inputType}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
              onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              {requiresCaptcha && (
                <CaptchaComponent 
                  onVerify={setCaptchaVerified}
                  isRequired={requiresCaptcha}
                />
              )}
            </div>
            
            <Button 
              onClick={handleExecute}
              disabled={isLoading || !canUseTool || (requiresCaptcha && !captchaVerified)}
              className="min-w-[120px] bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-none ml-4"
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
        
        <AccessWarnings 
          requiresLogin={requiresLogin}
          canUseTool={canUseTool}
          user={user}
        />
      </CardContent>
    </Card>
  );
};

export default ToolInputSection;
