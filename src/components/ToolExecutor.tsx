import React, { useState, useEffect } from 'react';
import { useToolAccess } from './tool/ToolAccessControl';
import { useToolExecution } from './tool/ToolExecutionEngine';
import { useAdManager } from '@/hooks/useAdManager';
import ToolInputSection from './tool/ToolInputSection';
import EmptyToolState from './tool/EmptyToolState';
import ExecutionProgress from './ExecutionProgress';
import ToolResults from './ToolResults';
import EmailVerification from './EmailVerification';
import EmailMigration from './EmailMigration';
import AdContainer from './ads/AdContainer';

interface ToolExecutorProps {
  selectedTool: string;
  toolName: string;
  inputType: string;
  isFree: boolean;
}

const ToolExecutor: React.FC<ToolExecutorProps> = ({ selectedTool, toolName, inputType, isFree }) => {
  const [canUseToolState, setCanUseToolState] = useState(false);
  const [accessCheckLoading, setAccessCheckLoading] = useState(true);
  const { refreshAds, executionCount } = useAdManager();

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

  // Check tool access when component mounts or dependencies change
  useEffect(() => {
    const checkAccess = async () => {
      setAccessCheckLoading(true);
      try {
        const canUse = await canUseTool();
        setCanUseToolState(canUse);
      } catch (error) {
        console.error('Error checking tool access:', error);
        setCanUseToolState(false);
      } finally {
        setAccessCheckLoading(false);
      }
    };

    checkAccess();
  }, [canUseTool, selectedTool]);

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
      canUseToolState,
      requiresLogin,
      requiresCaptcha,
      captchaVerified,
      user
    );
    
    // Refresh ads on each execution for monetization
    refreshAds();
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <ToolInputSection
        toolName={toolName}
        inputType={inputType}
        isFree={isFree}
        onExecute={handleExecute}
        isLoading={isLoading || accessCheckLoading}
        canUseTool={canUseToolState}
        requiresLogin={requiresLogin}
        requiresCaptcha={requiresCaptcha}
        user={user}
        executionId={executionId}
      />

      {/* Ad Below Form */}
      <AdContainer 
        placement="below-form" 
        className="my-4"
        refreshTrigger={executionCount}
      />

      {/* Progress */}
      <ExecutionProgress 
        isLoading={isLoading}
        progress={progress}
        logs={logs}
        input=""
      />

      {/* Ad Above Results */}
      {(result || isLoading) && (
        <AdContainer 
          placement="above-results" 
          className="mb-4"
          refreshTrigger={executionCount}
        />
      )}

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
