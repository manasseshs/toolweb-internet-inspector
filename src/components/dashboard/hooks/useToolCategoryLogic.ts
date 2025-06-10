
import { useState } from 'react';
import { ToolConfig, getUserToolAccess } from '@/config/toolsConfig';
import { toolEngine } from '@/services/toolEngine';
import { useToast } from '@/hooks/use-toast';
import { ToolExecutionState } from '../types/ToolExecutionState';
import { trackToolUsage, updateDailyUsageLimit, checkDailyUsageLimit } from '@/services/usageTracker';

export const useToolCategoryLogic = (user: any) => {
  const [executionStates, setExecutionStates] = useState<Record<string, ToolExecutionState>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const getExecutionState = (toolId: string): ToolExecutionState => {
    return executionStates[toolId] || {
      isLoading: false,
      progress: 0,
      result: null,
      error: null,
      executionTime: null
    };
  };

  const updateExecutionState = (toolId: string, updates: Partial<ToolExecutionState>) => {
    setExecutionStates(prev => ({
      ...prev,
      [toolId]: { ...getExecutionState(toolId), ...updates }
    }));
  };

  const handleInputChange = (toolId: string, value: string) => {
    setInputs(prev => ({ ...prev, [toolId]: value }));
  };

  const executeToolAnalysis = async (tool: ToolConfig) => {
    const input = inputs[tool.id];
    if (!input?.trim()) {
      toast({
        title: "Input required",
        description: `Please enter a valid ${tool.inputType.toLowerCase()}.`,
        variant: "destructive",
      });
      return;
    }

    // Check daily usage limit
    const { canUse, used, limit } = await checkDailyUsageLimit(tool.id);
    if (!canUse) {
      toast({
        title: "Daily limit reached",
        description: `You've reached your daily limit of ${limit} uses for this tool.`,
        variant: "destructive",
      });
      return;
    }

    const access = getUserToolAccess(tool, user?.plan || 'free');
    if (!access.canUse) {
      toast({
        title: "Access restricted",
        description: access.reason,
        variant: "destructive",
      });
      return;
    }

    const startTime = Date.now();
    updateExecutionState(tool.id, { 
      isLoading: true, 
      progress: 0, 
      result: null, 
      error: null,
      executionTime: null,
      usage: {
        dailyUsed: used,
        dailyLimit: limit,
        remaining: limit - used
      }
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        updateExecutionState(tool.id, { 
          progress: Math.min(getExecutionState(tool.id).progress + 10, 90) 
        });
      }, 200);

      const result = await toolEngine.executeJavaScriptTool(tool, {
        input,
        userPlan: user?.plan || 'free',
        userId: user?.id
      });

      clearInterval(progressInterval);
      const executionTime = Date.now() - startTime;

      if (result.success) {
        // Track successful usage
        await trackToolUsage({
          toolId: tool.id,
          inputData: input,
          success: true,
          executionTime,
          resultData: result.data,
          userPlan: user?.plan || 'free'
        });

        await updateDailyUsageLimit(tool.id, 1);

        updateExecutionState(tool.id, {
          isLoading: false,
          progress: 100,
          result: result.data,
          executionTime,
          usage: {
            dailyUsed: used + 1,
            dailyLimit: limit,
            remaining: limit - used - 1
          }
        });

        toast({
          title: "Analysis complete",
          description: `${tool.name} executed successfully.`,
        });
      } else {
        // Track failed usage
        await trackToolUsage({
          toolId: tool.id,
          inputData: input,
          success: false,
          executionTime,
          errorMessage: result.error || 'Unknown error occurred',
          userPlan: user?.plan || 'free'
        });

        updateExecutionState(tool.id, {
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
      const executionTime = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Track failed usage
      await trackToolUsage({
        toolId: tool.id,
        inputData: input,
        success: false,
        executionTime,
        errorMessage,
        userPlan: user?.plan || 'free'
      });

      updateExecutionState(tool.id, {
        isLoading: false,
        progress: 0,
        error: errorMessage
      });

      toast({
        title: "Execution failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return {
    executionStates,
    inputs,
    handleInputChange,
    executeToolAnalysis
  };
};
