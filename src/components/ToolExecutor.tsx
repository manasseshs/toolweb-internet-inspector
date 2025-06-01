
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Play, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CaptchaComponent from './CaptchaComponent';
import ExecutionProgress from './ExecutionProgress';
import ToolResults from './ToolResults';
import EmailVerification from './EmailVerification';
import EmailMigration from './EmailMigration';
import { generateToolResponse } from './ToolSimulator';

interface ToolExecutorProps {
  selectedTool: string;
  toolName: string;
  inputType: string;
  isFree: boolean;
}

const ToolExecutor: React.FC<ToolExecutorProps> = ({ selectedTool, toolName, inputType, isFree }) => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [executionId, setExecutionId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  // Special tools that have their own components
  if (selectedTool === 'email-validation') {
    return <EmailVerification />;
  }
  
  if (selectedTool === 'email-migration') {
    return <EmailMigration />;
  }

  const requiresLogin = () => {
    return false; // Removed login requirement for most tools
  };

  const canUseTool = () => {
    if (requiresLogin() && !user) return false;
    if (isFree) return true;
    return user && (user.plan === 'pro' || user.plan === 'enterprise');
  };

  const requiresCaptcha = () => {
    return isFree && !user;
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleExecute = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: `Please enter a ${inputType}.`,
        variant: "destructive",
      });
      return;
    }

    if (requiresLogin() && !user) {
      toast({
        title: "Login required",
        description: "Please log in to use this tool.",
        variant: "destructive",
      });
      return;
    }

    if (!canUseTool()) {
      toast({
        title: "Upgrade required",
        description: "This tool requires a Pro or Enterprise plan.",
        variant: "destructive",
      });
      return;
    }

    if (requiresCaptcha() && !captchaVerified) {
      toast({
        title: "CAPTCHA required",
        description: "Please complete the security verification first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult('');
    setLogs([]);
    setProgress(0);
    
    const newExecutionId = `exec_${Date.now()}`;
    setExecutionId(newExecutionId);

    try {
      addLog(`Starting ${toolName} analysis for: ${input}`);
      setProgress(10);

      await new Promise(resolve => setTimeout(resolve, 500));
      addLog('Establishing connection...');
      setProgress(25);

      await new Promise(resolve => setTimeout(resolve, 800));
      addLog('Performing DNS lookups...');
      setProgress(50);

      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('Analyzing results...');
      setProgress(75);

      await new Promise(resolve => setTimeout(resolve, 600));
      addLog('Generating report...');
      setProgress(90);

      const simulatedResult = generateToolResponse(selectedTool, input, toolName);
      setResult(simulatedResult);
      setProgress(100);
      addLog('Analysis completed successfully!');
      
      toast({
        title: "Analysis complete",
        description: "Tool execution finished successfully.",
      });
    } catch (error) {
      addLog(`Error: ${error}`);
      toast({
        title: "Execution failed",
        description: "An error occurred during tool execution.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <Card className="border-[#dee2e6] bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-[#212529] font-medium">{toolName}</h3>
              {!isFree && <Badge variant="secondary" className="bg-[#f8f9fa] text-[#6c757d] border border-[#dee2e6]">Pro</Badge>}
              {requiresLogin() && <Badge variant="outline" className="bg-[#e7f3ff] text-[#0d6efd] border border-[#b3d7ff]">Login Required</Badge>}
            </div>
            {executionId && (
              <Badge variant="outline" className="text-xs border-[#dee2e6] text-[#6c757d]">
                ID: {executionId}
              </Badge>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <Input
                placeholder={`Enter ${inputType}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
                onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                {/* CAPTCHA moved here - same div as form */}
                {requiresCaptcha() && (
                  <CaptchaComponent 
                    onVerify={setCaptchaVerified}
                    isRequired={requiresCaptcha()}
                  />
                )}
              </div>
              
              <Button 
                onClick={handleExecute}
                disabled={isLoading || !canUseTool() || (requiresCaptcha() && !captchaVerified)}
                className="min-w-[120px] bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-none ml-4"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Play className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Running...' : 'Analyze'}
              </Button>
            </div>
          </div>
          
          {requiresLogin() && !user && (
            <div className="mt-4 p-4 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
              <p className="text-[#856404] text-sm">
                This tool requires you to be logged in. 
                <a href="/login" className="text-[#856404] hover:text-[#533608] underline ml-1">
                  Please log in
                </a>
              </p>
            </div>
          )}

          {!canUseTool() && !requiresLogin() && (
            <div className="mt-4 p-4 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
              <p className="text-[#856404] text-sm">
                This tool requires a Pro or Enterprise plan. 
                <a href="/pricing" className="text-[#856404] hover:text-[#533608] underline ml-1">
                  Upgrade now
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Progress */}
      <ExecutionProgress 
        isLoading={isLoading}
        progress={progress}
        logs={logs}
        input={input}
      />

      {/* Results */}
      <ToolResults 
        result={result}
        input={input}
        toolId={selectedTool}
      />
    </div>
  );
};

export default ToolExecutor;
