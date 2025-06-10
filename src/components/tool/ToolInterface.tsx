
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Play, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ToolConfig } from '@/config/toolsConfig';
import { useAdManager } from '@/hooks/useAdManager';
import AdContainer from '@/components/ads/AdContainer';

interface ToolExecutionState {
  isLoading: boolean;
  progress: number;
  result: any;
  error: string | null;
  executionTime: number | null;
  usage?: {
    dailyUsed: number;
    dailyLimit: number;
    remaining: number;
  };
}

interface ToolAccess {
  canUse: boolean;
  reason: string;
  upgradeRequired?: boolean;
}

interface ToolInterfaceProps {
  tool: ToolConfig;
  executionState: ToolExecutionState;
  access: ToolAccess;
  onExecute: (input: string) => void;
}

const ToolInterface: React.FC<ToolInterfaceProps> = ({
  tool,
  executionState,
  access,
  onExecute
}) => {
  const [input, setInput] = useState('');
  const { refreshAds, executionCount } = useAdManager();

  const handleExecute = () => {
    onExecute(input);
    refreshAds();
  };

  return (
    <Card className="border-[#dee2e6] bg-white">
      <CardHeader>
        <CardTitle className="text-[#212529] text-lg">Tool Input</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder={tool.inputPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
              disabled={executionState.isLoading || !access.canUse}
              onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
            />
            
            <Button
              onClick={handleExecute}
              disabled={executionState.isLoading || !access.canUse || !input.trim()}
              className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-none min-w-[120px]"
            >
              {executionState.isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {executionState.isLoading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>

          <div className="flex items-center justify-between text-xs text-[#6c757d]">
            <div className="flex items-center gap-2">
              {executionState.usage && (
                <span>
                  {executionState.usage.dailyUsed}/{executionState.usage.dailyLimit === -1 ? '∞' : executionState.usage.dailyLimit} uses today
                </span>
              )}
              {executionState.executionTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {executionState.executionTime}ms
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ad Below Form */}
        <AdContainer 
          placement="below-form" 
          className="my-6"
          refreshTrigger={executionCount}
        />

        {/* Progress Bar */}
        {executionState.isLoading && (
          <div className="space-y-2">
            <Progress value={executionState.progress} className="h-2" />
            <p className="text-xs text-[#6c757d] text-center">
              Analyzing {input}... {executionState.progress}%
            </p>
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

        {/* Ad Above Results */}
        {(executionState.result || executionState.error) && (
          <AdContainer 
            placement="above-results" 
            className="my-6"
            refreshTrigger={executionCount}
          />
        )}

        {/* Results */}
        {executionState.result && (
          <div className="p-4 bg-[#d4edda] border border-[#c3e6cb] rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-[#155724] mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-[#155724] mb-3">Analysis completed successfully</p>
                <pre className="text-sm bg-white/80 p-3 rounded border overflow-auto max-h-96 whitespace-pre-wrap font-mono">
                  {JSON.stringify(executionState.result, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {executionState.error && (
          <div className="p-4 bg-[#f8d7da] border border-[#f5c6cb] rounded-lg">
            <div className="flex items-start gap-2">
              <XCircle className="w-5 h-5 text-[#721c24] mt-0.5" />
              <div className="text-sm text-[#721c24]">
                <p className="font-medium">Execution failed</p>
                <p>{executionState.error}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToolInterface;
