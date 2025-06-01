
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateToolResponse } from '@/components/ToolSimulator';

export const useToolExecution = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState('');
  const [executionId, setExecutionId] = useState<string | null>(null);
  
  const { toast } = useToast();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const executeToolAnalysis = async (
    selectedTool: string,
    input: string,
    toolName: string,
    canUseTool: boolean,
    requiresLogin: boolean,
    requiresCaptcha: boolean,
    captchaVerified: boolean,
    user: any
  ) => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: `Please enter a valid input.`,
        variant: "destructive",
      });
      return;
    }

    if (requiresLogin && !user) {
      toast({
        title: "Login required",
        description: "Please log in to use this tool.",
        variant: "destructive",
      });
      return;
    }

    if (!canUseTool) {
      toast({
        title: "Upgrade required",
        description: "This tool requires a Pro or Enterprise plan.",
        variant: "destructive",
      });
      return;
    }

    if (requiresCaptcha && !captchaVerified) {
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

  return {
    isLoading,
    progress,
    logs,
    result,
    executionId,
    executeToolAnalysis
  };
};
