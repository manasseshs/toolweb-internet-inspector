
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Play, RefreshCw, CheckCircle, XCircle, Clock, Zap, Crown } from 'lucide-react';
import { ToolConfig, getUserToolAccess } from '@/config/toolsConfig';
import { ToolExecutionState } from './types/ToolExecutionState';

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
  const access = getUserToolAccess(tool, user?.plan || 'free');

  return (
    <Card className="border-[#dee2e6] bg-white">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-[#212529]">{tool.name}</h3>
              <div className="flex gap-1">
                {!tool.free && (
                  <Badge variant="secondary" className="bg-[#f8f9fa] text-[#6c757d] border border-[#dee2e6]">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                )}
                {tool.monitor && (
                  <Badge variant="outline" className="bg-[#e7f3ff] text-[#0d6efd] border border-[#b3d7ff]">
                    <Zap className="w-3 h-3 mr-1" />
                    Monitoring
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-[#6c757d] mb-3">{tool.description}</p>
            <div className="flex flex-wrap gap-1">
              {tool.features.slice(0, 3).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs border-[#dee2e6] text-[#6c757d]">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Input Section */}
          <div className="space-y-2">
            <Input
              placeholder={tool.inputPlaceholder}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              className="border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
              disabled={executionState.isLoading || !access.canUse}
              onKeyPress={(e) => e.key === 'Enter' && onExecute()}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#6c757d]">
                {executionState.usage && (
                  <span>
                    {executionState.usage.dailyUsed}/{executionState.usage.dailyLimit === -1 ? '∞' : executionState.usage.dailyLimit} today
                  </span>
                )}
                {executionState.executionTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {executionState.executionTime}ms
                  </span>
                )}
              </div>
              
              <Button
                onClick={onExecute}
                disabled={executionState.isLoading || !access.canUse || !input.trim()}
                size="sm"
                className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-none"
              >
                {executionState.isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {executionState.isLoading ? 'Running' : 'Analyze'}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {executionState.isLoading && (
            <div className="space-y-2">
              <Progress value={executionState.progress} className="h-2" />
              <p className="text-xs text-[#6c757d] text-center">
                Processing... {executionState.progress}%
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

          {/* Results */}
          {executionState.result && (
            <div className="p-3 bg-[#d4edda] border border-[#c3e6cb] rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-[#155724] mt-0.5" />
                <div className="text-sm text-[#155724]">
                  <p className="font-medium mb-2">Analysis completed successfully</p>
                  <pre className="text-xs bg-white/50 p-2 rounded border overflow-auto max-h-32">
                    {JSON.stringify(executionState.result, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {executionState.error && (
            <div className="p-3 bg-[#f8d7da] border border-[#f5c6cb] rounded-lg">
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-[#721c24] mt-0.5" />
                <div className="text-sm text-[#721c24]">
                  <p className="font-medium">Execution failed</p>
                  <p>{executionState.error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolCard;
