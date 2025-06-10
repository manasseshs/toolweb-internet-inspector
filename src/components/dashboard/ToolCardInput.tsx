
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, RefreshCw, Clock } from 'lucide-react';
import { ToolConfig } from '@/config/toolsConfig';
import { ToolExecutionState } from './types/ToolExecutionState';

interface UsageInfo {
  used: number;
  limit: number;
  canUse: boolean;
}

interface ToolCardInputProps {
  tool: ToolConfig;
  input: string;
  executionState: ToolExecutionState;
  usageInfo: UsageInfo;
  canExecute: boolean;
  onInputChange: (value: string) => void;
  onExecute: () => void;
}

const ToolCardInput: React.FC<ToolCardInputProps> = ({
  tool,
  input,
  executionState,
  usageInfo,
  canExecute,
  onInputChange,
  onExecute
}) => {
  return (
    <div className="space-y-2">
      <Input
        placeholder={tool.inputPlaceholder}
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        className="border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
        disabled={executionState.isLoading}
        onKeyPress={(e) => e.key === 'Enter' && canExecute && onExecute()}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[#6c757d]">
          <span>
            {usageInfo.used}/{usageInfo.limit === -1 ? '∞' : usageInfo.limit} today
          </span>
          {executionState.executionTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {executionState.executionTime}ms
            </span>
          )}
        </div>
        
        <Button
          onClick={onExecute}
          disabled={!canExecute}
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

      {/* Progress Bar */}
      {executionState.isLoading && (
        <div className="space-y-2">
          <Progress value={executionState.progress} className="h-2" />
          <p className="text-xs text-[#6c757d] text-center">
            Processing... {executionState.progress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default ToolCardInput;
