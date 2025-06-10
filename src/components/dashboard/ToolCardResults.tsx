
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { ToolExecutionState } from './types/ToolExecutionState';

interface ToolCardResultsProps {
  executionState: ToolExecutionState;
}

const ToolCardResults: React.FC<ToolCardResultsProps> = ({ executionState }) => {
  return (
    <>
      {/* Results */}
      {executionState.result && (
        <div className="p-3 bg-[#d4edda] border border-[#c3e6cb] rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#155724] mt-0.5" />
            <div className="text-sm text-[#155724]">
              <p className="font-medium mb-2">Analysis completed successfully</p>
              <pre className="text-xs bg-white/50 p-2 rounded border overflow-auto max-h-32">
                {JSON.stringify(executionState.result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {executionState.error && (
        <div className="p-3 bg-[#f8d7da] border border-[#f5c6cb] rounded-lg">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-[#721c24] mt-0.5" />
            <div className="text-sm text-[#721c24]">
              <p className="font-medium">Execution failed</p>
              <p>{executionState.error}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ToolCardResults;
