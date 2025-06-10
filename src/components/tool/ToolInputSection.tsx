
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, RefreshCw } from 'lucide-react';
import CaptchaComponent from '@/components/CaptchaComponent';
import { AccessBadges, AccessWarnings, useToolAccess } from './ToolAccessControl';

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
  const [dailyUsage, setDailyUsage] = useState<any>(null);
  const [accessControlLoading, setAccessControlLoading] = useState(true);
  const [toolCanUse, setToolCanUse] = useState(false);
  
  const { getDailyLimit, userPlan } = useToolAccess(toolName.toLowerCase().replace(' ', '-'), isFree);

  useEffect(() => {
    const checkAccess = async () => {
      setAccessControlLoading(true);
      try {
        const usage = await getDailyLimit();
        setDailyUsage(usage);
        setToolCanUse(usage.canUse && canUseTool);
      } catch (error) {
        console.error('Error checking tool access:', error);
        setToolCanUse(false);
      } finally {
        setAccessControlLoading(false);
      }
    };

    checkAccess();
  }, [getDailyLimit, canUseTool]);

  const handleExecute = () => {
    if (toolCanUse && (!requiresCaptcha || captchaVerified)) {
      onExecute(input, captchaVerified);
    }
  };

  const isExecuteDisabled = isLoading || 
    !toolCanUse || 
    (requiresCaptcha && !captchaVerified) || 
    accessControlLoading ||
    !input.trim();

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
              userPlan={userPlan}
              dailyUsage={dailyUsage}
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
              disabled={isLoading || accessControlLoading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              {requiresCaptcha && (
                <CaptchaComponent 
                  onVerify={setCaptchaVerified}
                  isRequired={requiresCaptcha}
                  userLoggedIn={!!user}
                />
              )}
            </div>
            
            <Button 
              onClick={handleExecute}
              disabled={isExecuteDisabled}
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

          {accessControlLoading && (
            <div className="text-center py-2">
              <div className="text-sm text-[#6c757d]">Checking access permissions...</div>
            </div>
          )}
        </div>
        
        <AccessWarnings 
          requiresLogin={requiresLogin}
          canUseTool={toolCanUse}
          user={user}
          userPlan={userPlan}
          dailyUsage={dailyUsage}
        />
      </CardContent>
    </Card>
  );
};

export default ToolInputSection;
