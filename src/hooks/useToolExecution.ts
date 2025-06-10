
import { useState } from 'react';
import { toolEngine } from '@/services/toolEngine';
import { useToast } from '@/hooks/use-toast';
import { ToolConfig, getUserToolAccess } from '@/config/toolsConfig';

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

export const useToolExecution = (tool: ToolConfig, user: any) => {
  const { toast } = useToast();
  const [executionState, setExecutionState] = useState<ToolExecutionState>({
    isLoading: false,
    progress: 0,
    result: null,
    error: null,
    executionTime: null
  });

  const access = getUserToolAccess(tool, user?.plan || 'free');

  const updateExecutionState = (updates: Partial<ToolExecutionState>) => {
    setExecutionState(prev => ({ ...prev, ...updates }));
  };

  const executeToolAnalysis = async (input: string) => {
    if (!input?.trim()) {
      toast({
        title: "Input required",
        description: `Please enter a valid ${tool.inputType.toLowerCase()}.`,
        variant: "destructive",
      });
      return;
    }

    if (!access.canUse) {
      toast({
        title: "Access restricted",
        description: access.reason,
        variant: "destructive",
      });
      return;
    }

    updateExecutionState({ 
      isLoading: true, 
      progress: 0, 
      result: null, 
      error: null,
      executionTime: null 
    });

    try {
      const progressInterval = setInterval(() => {
        setExecutionState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 15, 90)
        }));
      }, 300);

      const result = await toolEngine.executeJavaScriptTool(tool, {
        input,
        userPlan: user?.plan || 'free',
        userId: user?.id
      });

      clearInterval(progressInterval);

      if (result.success) {
        updateExecutionState({
          isLoading: false,
          progress: 100,
          result: result.data,
          executionTime: result.executionTime,
          usage: result.usage
        });

        toast({
          title: "Analysis complete",
          description: `${tool.name} executed successfully.`,
        });
      } else {
        updateExecutionState({
          isLoading: false,
          progress: 0,
          error: result.error || 'Unknown error occurred'
        });

        toast({
          title: "Execution failed",
          description: result.error || 'An error occurred during execution.',
          variant: "destructive",
        });
      }
    } catch (error) {
      updateExecutionState({
        isLoading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });

      toast({
        title: "Execution failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return {
    executionState,
    executeToolAnalysis,
    access
  };
};
