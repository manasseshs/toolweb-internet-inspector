
import React from 'react';
import { ToolConfig } from '@/config/toolsConfig';
import { ToolExecutionState } from './types/ToolExecutionState';
import ToolGrid from './ToolGrid';
import EmptyToolsState from './EmptyToolsState';

interface ToolCategoryContentProps {
  tools: ToolConfig[];
  user: any;
  inputs: Record<string, string>;
  executionStates: Record<string, ToolExecutionState>;
  onInputChange: (toolId: string, value: string) => void;
  onExecute: (tool: ToolConfig) => void;
}

const ToolCategoryContent: React.FC<ToolCategoryContentProps> = ({
  tools,
  user,
  inputs,
  executionStates,
  onInputChange,
  onExecute
}) => {
  if (tools.length === 0) {
    return <EmptyToolsState />;
  }

  return (
    <ToolGrid
      tools={tools}
      user={user}
      inputs={inputs}
      executionStates={executionStates}
      onInputChange={onInputChange}
      onExecute={onExecute}
    />
  );
};

export default ToolCategoryContent;
