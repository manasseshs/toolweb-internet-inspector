
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import ExecutionProgress from './ExecutionProgress';
import ToolResults from './ToolResults';
import ToolExecutorInput from './tool-executor/ToolExecutorInput';
import ToolExecutorActions from './tool-executor/ToolExecutorActions';
import ToolExecutorWarnings from './tool-executor/ToolExecutorWarnings';
import { useToolExecution } from './tool-executor/hooks/useToolExecution';

interface ToolExecutorProps {
  selectedTool: string;
  toolName: string;
  inputType: string;
  isFree: boolean;
}

const ToolExecutor: React.FC<ToolExecutorProps> = ({ selectedTool, toolName, inputType, isFree }) => {
  const [input, setInput] = useState('');
  const [emailList, setEmailList] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const {
    result,
    isLoading,
    progress,
    logs,
    captchaVerified,
    setCaptchaVerified,
    executionId,
    executeAnalysis,
    requiresLogin,
    canUseTool,
    requiresCaptcha
  } = useToolExecution({ selectedTool, toolName, isFree });

  const handleExecute = () => {
    executeAnalysis(input, emailList);
  };

  if (!selectedTool) {
    return (
      <Card className="border-[#dee2e6] bg-white">
        <CardContent className="p-8 text-center">
          <div className="text-[#6c757d] mb-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-[#212529] mb-2">Select a Tool</h3>
          <p className="text-[#6c757d]">Choose a tool from the categories above to get started.</p>
        </CardContent>
      </Card>
    );
  }

  const isEmailValidationTool = selectedTool === 'email-validation';

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <Card className="border-[#dee2e6] bg-white">
        <CardContent className="p-4">
          <ToolExecutorActions
            toolName={toolName}
            isFree={isFree}
            isLoading={isLoading}
            canUseTool={canUseTool()}
            requiresCaptcha={requiresCaptcha()}
            captchaVerified={captchaVerified}
            setCaptchaVerified={setCaptchaVerified}
            executionId={executionId}
            onExecute={handleExecute}
          />
          
          <div className="mt-4">
            <ToolExecutorInput
              selectedTool={selectedTool}
              input={input}
              setInput={setInput}
              emailList={emailList}
              setEmailList={setEmailList}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              inputType={inputType}
              onExecute={handleExecute}
            />
          </div>
          
          <div className="mt-4">
            <ToolExecutorWarnings
              selectedTool={selectedTool}
              requiresLogin={requiresLogin()}
              canUseTool={canUseTool()}
            />
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <ExecutionProgress 
        isLoading={isLoading}
        progress={progress}
        logs={logs}
        input={isEmailValidationTool ? emailList : input}
      />

      {/* Results */}
      <ToolResults 
        result={result}
        input={isEmailValidationTool ? emailList : input}
        toolId={selectedTool}
      />
    </div>
  );
};

export default ToolExecutor;
