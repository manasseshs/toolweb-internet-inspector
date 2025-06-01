
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { generateToolResponse } from '@/components/ToolSimulator';

interface UseToolExecutionProps {
  selectedTool: string;
  toolName: string;
  isFree: boolean;
}

export const useToolExecution = ({ selectedTool, toolName, isFree }: UseToolExecutionProps) => {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [executionId, setExecutionId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const requiresLogin = () => {
    return ['email-validation', 'email-migration'].includes(selectedTool);
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

  const validateEmailInput = (emailList: string, input: string) => {
    const isEmailValidationTool = selectedTool === 'email-validation';
    const isPaidUser = user && (user.plan === 'pro' || user.plan === 'enterprise');
    
    if (isEmailValidationTool) {
      const emails = emailList.split('\n').filter(email => email.trim());
      if (!isPaidUser && emails.length > 10) {
        toast({
          title: "Limit exceeded",
          description: "Free users can validate up to 10 emails at once.",
          variant: "destructive",
        });
        return false;
      }
      return emails.length > 0;
    }
    return input.trim() !== '';
  };

  const executeAnalysis = async (input: string, emailList: string) => {
    const isEmailValidationTool = selectedTool === 'email-validation';
    
    if (!validateEmailInput(emailList, input)) {
      toast({
        title: "Input required",
        description: isEmailValidationTool ? "Please enter at least one email address." : `Please enter a valid input.`,
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
      const analysisInput = isEmailValidationTool ? emailList : input;
      addLog(`Starting ${toolName} analysis for: ${analysisInput.split('\n')[0]}${isEmailValidationTool && emailList.split('\n').length > 1 ? ` and ${emailList.split('\n').length - 1} more emails` : ''}`);
      setProgress(10);

      await new Promise(resolve => setTimeout(resolve, 500));
      addLog('Establishing connection...');
      setProgress(25);

      await new Promise(resolve => setTimeout(resolve, 800));
      if (isEmailValidationTool) {
        addLog('Validating email addresses...');
      } else {
        addLog('Performing DNS lookups...');
      }
      setProgress(50);

      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('Analyzing results...');
      setProgress(75);

      await new Promise(resolve => setTimeout(resolve, 600));
      addLog('Generating report...');
      setProgress(90);

      const simulatedResult = generateToolResponse(selectedTool, analysisInput, toolName);
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
  };
};
