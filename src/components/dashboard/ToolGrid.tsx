
import React from 'react';
import { ToolConfig } from '@/config/toolsConfig';
import { ToolExecutionState } from './types/ToolExecutionState';
import ToolCard from './ToolCard';

interface ToolGridProps {
  tools: ToolConfig[];
  user: any;
  inputs: Record<string, string>;
  executionStates: Record<string, ToolExecutionState>;
  onInputChange: (toolId: string, value: string) => void;
  onExecute: (tool: ToolConfig) => void;
}

const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  user,
  inputs,
  executionStates,
  onInputChange,
  onExecute
}) => {
  const getExecutionState = (toolId: string): ToolExecutionState => {
    return executionStates[toolId] || {
      isLoading: false,
      progress: 0,
      result: null,
      error: null,
      executionTime: null
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          tool={tool}
          user={user}
          input={inputs[tool.id] || ''}
          executionState={getExecutionState(tool.id)}
          onInputChange={(value) => onInputChange(tool.id, value)}
          onExecute={() => onExecute(tool)}
        />
      ))}
    </div>
  );
};

export default ToolGrid;
