
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ToolConfig, getUserToolAccess } from '@/config/toolsConfig';
import { ToolExecutionState } from './types/ToolExecutionState';
import { checkDailyUsageLimit } from '@/services/usageTracker';
import { useAdManager } from '@/hooks/useAdManager';
import CaptchaComponent from '@/components/CaptchaComponent';
import AdContainer from '@/components/ads/AdContainer';
import ToolCardHeader from './ToolCardHeader';
import ToolCardInput from './ToolCardInput';
import ToolCardStatus from './ToolCardStatus';
import ToolCardResults from './ToolCardResults';

interface ToolCardProps {
  tool: ToolConfig;
  user: any;
  input: string;
  executionState: ToolExecutionState;
  onInputChange: (value: string) => void;
  onExecute: () => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  user,
  input,
  executionState,
  onInputChange,
  onExecute
}) => {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [usageInfo, setUsageInfo] = useState({ used: 0, limit: 50, canUse: true });
  const { refreshAds, executionCount } = useAdManager();
  const access = getUserToolAccess(tool, user?.plan || 'free');

  useEffect(() => {
    const checkUsage = async () => {
      const usage = await checkDailyUsageLimit(tool.id);
      setUsageInfo(usage);
    };
    
    if (user) {
      checkUsage();
    }
  }, [tool.id, user]);

  const handleExecute = () => {
    if (captchaVerified) {
      onExecute();
      refreshAds();
    }
  };

  const requiresCaptcha = true; // Now required for all users
  const canExecute = access.canUse && 
                    input.trim() && 
                    !executionState.isLoading && 
                    usageInfo.canUse && 
                    (requiresCaptcha ? captchaVerified : true);

  return (
    <Card className="border-[#dee2e6] bg-white">
      <CardHeader className="pb-3">
        <ToolCardHeader tool={tool} />
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Input Section */}
          <ToolCardInput
            tool={tool}
            input={input}
            executionState={executionState}
            usageInfo={usageInfo}
            canExecute={canExecute}
            onInputChange={onInputChange}
            onExecute={handleExecute}
          />

          {/* Ad Below Input (for listing pages) */}
          <AdContainer 
            placement="listing" 
            className="my-3"
            refreshTrigger={executionCount}
          />

          {/* reCAPTCHA - Now required for all users */}
          {input.trim() && (
            <div className="flex justify-center">
              <CaptchaComponent 
                onVerify={setCaptchaVerified}
                isRequired={requiresCaptcha}
                userLoggedIn={!!user}
              />
            </div>
          )}

          {/* Status Messages */}
          <ToolCardStatus usageInfo={usageInfo} access={access} />

          {/* Ad Above Results */}
          {(executionState.result || executionState.error) && (
            <AdContainer 
              placement="above-results" 
              className="my-3"
              refreshTrigger={executionCount}
            />
          )}

          {/* Results */}
          <ToolCardResults executionState={executionState} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
