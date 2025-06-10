
import React from 'react';
import { ToolConfig } from '@/config/toolsConfig';
import { useToolCategoryLogic } from './hooks/useToolCategoryLogic';
import ToolCategoryHeader from './ToolCategoryHeader';
import ToolCategoryContent from './ToolCategoryContent';

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
  const {
    executionStates,
    inputs,
    handleInputChange,
    executeToolAnalysis
  } = useToolCategoryLogic(user);

  return (
    <div className="space-y-6">
      <ToolCategoryHeader
        title={title}
        description={description}
        toolsCount={tools.length}
        userPlan={user?.plan || 'free'}
      />

      <ToolCategoryContent
        tools={tools}
        user={user}
        inputs={inputs}
        executionStates={executionStates}
        onInputChange={handleInputChange}
        onExecute={executeToolAnalysis}
      />
    </div>
  );
};

export default ToolCategoryPage;
