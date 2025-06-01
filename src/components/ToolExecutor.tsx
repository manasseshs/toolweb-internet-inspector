
import React from 'react';
import { useToolAccess } from './tool/ToolAccessControl';
import { useToolExecution } from './tool/ToolExecutionEngine';
import ToolInputSection from './tool/ToolInputSection';
import EmptyToolState from './tool/EmptyToolState';
import ExecutionProgress from './ExecutionProgress';
import ToolResults from './ToolResults';
import EmailVerification from './EmailVerification';
import EmailMigration from './EmailMigration';

interface ToolExecutorProps {
  selectedTool: string;
  toolName: string;
  inputType: string;
  isFree: boolean;
}

const ToolExecutor: React.FC<ToolExecutorProps> = ({ selectedTool, toolName, inputType, isFree }) => {
  const {
    requiresLogin,
    canUseTool,
    requiresCaptcha,
    user
  } = useToolAccess(selectedTool, isFree);

  const {
    isLoading,
    progress,
    logs,
    result,
    executionId,
    executeToolAnalysis
  } = useToolExecution();

  // Special tools that have their own components
  if (selectedTool === 'email-validation') {
    return <EmailVerification />;
  }
  
  if (selectedTool === 'email-migration') {
    return <EmailMigration />;
  }

  if (!selectedTool) {
    return <EmptyToolState />;
  }

  const handleExecute = (input: string, captchaVerified: boolean) => {
    executeToolAnalysis(
      selectedTool,
      input,
      toolName,
      canUseTool,
      requiresLogin,
      requiresCaptcha,
      captchaVerified,
      user
    );
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <ToolInputSection
        toolName={toolName}
        inputType={inputType}
        isFree={isFree}
        onExecute={handleExecute}
        isLoading={isLoading}
        canUseTool={canUseTool}
        requiresLogin={requiresLogin}
        requiresCaptcha={requiresCaptcha}
        user={user}
        executionId={executionId}
      />

      {/* Progress */}
      <ExecutionProgress 
        isLoading={isLoading}
        progress={progress}
        logs={logs}
        input=""
      />

      {/* Results */}
      <ToolResults 
        result={result}
        input=""
        toolId={selectedTool}
      />
    </div>
  );
};

export default ToolExecutor;
