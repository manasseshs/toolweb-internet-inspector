
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface UsageInfo {
  used: number;
  limit: number;
  canUse: boolean;
}

interface ToolAccess {
  canUse: boolean;
  reason: string;
  upgradeRequired?: boolean;
}

interface ToolCardStatusProps {
  usageInfo: UsageInfo;
  access: ToolAccess;
}

const ToolCardStatus: React.FC<ToolCardStatusProps> = ({ usageInfo, access }) => {
  return (
    <>
      {/* Usage Limit Warning */}
      {!usageInfo.canUse && (
        <div className="p-3 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#856404] mt-0.5" />
            <div className="text-sm text-[#856404]">
              <p>Daily usage limit reached ({usageInfo.limit} uses per day)</p>
              <p className="text-xs mt-1">Upgrade to Pro for unlimited usage</p>
            </div>
          </div>
        </div>
      )}

      {/* Access Warning */}
      {!access.canUse && (
        <div className="p-3 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-[#856404] mt-0.5" />
            <div className="text-sm text-[#856404]">
              <p>{access.reason}</p>
              {access.upgradeRequired && (
                <a 
                  href="/pricing" 
                  className="text-[#856404] hover:text-[#533608] underline font-medium"
                >
                  Upgrade now →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToolCardStatus;
