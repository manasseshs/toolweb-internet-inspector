
import React, { useState } from 'react';
import { ToolConfig, getUserToolAccess } from '@/config/toolsConfig';
import { toolEngine } from '@/services/toolEngine';
import { useToast } from '@/hooks/use-toast';
import { ToolExecutionState } from './types/ToolExecutionState';
import CategoryHeader from './CategoryHeader';
import EmptyToolsState from './EmptyToolsState';
import ToolGrid from './ToolGrid';

interface ToolCategoryPageProps {
  category: string;
  title: string;
  description: string;
  tools: ToolConfig[];
  user: any;
}

const ToolCategoryPage: React.FC<ToolCategoryPageProps> = ({
  category,
  title,
  description,
  tools,
  user
}) => {
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

    const access = getUserToolAccess(tool, user?.plan || 'free');
    if (!access.canUse) {
      toast({
        title: "Access restricted",
        description: access.reason,
        variant: "destructive",
      });
      return;
    }

    updateExecutionState(tool.id, { 
      isLoading: true, 
      progress: 0, 
      result: null, 
      error: null,
      executionTime: null 
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

      if (result.success) {
        updateExecutionState(tool.id, {
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
      updateExecutionState(tool.id, {
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

  return (
    <div className="space-y-6">
      <CategoryHeader
        title={title}
        description={description}
        toolsCount={tools.length}
        userPlan={user?.plan || 'free'}
      />

      {tools.length > 0 ? (
        <ToolGrid
          tools={tools}
          user={user}
          inputs={inputs}
          executionStates={executionStates}
          onInputChange={handleInputChange}
          onExecute={executeToolAnalysis}
        />
      ) : (
        <EmptyToolsState />
      )}
    </div>
  );
};

export default ToolCategoryPage;
