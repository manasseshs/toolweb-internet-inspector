
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Copy, Download, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CaptchaComponent from './CaptchaComponent';

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

  const canUseTool = () => {
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

  const simulateToolExecution = async (toolId: string, input: string): Promise<string> => {
    const responses = {
      'blacklist': `Blacklist Check Results for ${input}:
✅ Spamhaus SBL: Not Listed
✅ Spamhaus CSS: Not Listed  
✅ Spamhaus PBL: Not Listed
✅ SURBL: Not Listed
✅ URIBL: Not Listed
✅ Barracuda: Not Listed
✅ SpamCop: Not Listed

Status: CLEAN - No blacklists detected`,

      'mx': `MX Records for ${input}:
Priority: 10    Mail Server: mail1.${input}
Priority: 20    Mail Server: mail2.${input}
Priority: 30    Mail Server: backup.${input}

Total MX Records Found: 3`,

      'ping': `Ping Results for ${input}:
PING ${input} (93.184.216.34): 56 data bytes
64 bytes from 93.184.216.34: icmp_seq=0 time=14.2ms
64 bytes from 93.184.216.34: icmp_seq=1 time=13.8ms
64 bytes from 93.184.216.34: icmp_seq=2 time=14.1ms
64 bytes from 93.184.216.34: icmp_seq=3 time=13.9ms

--- ${input} ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 13.8/14.0/14.2/0.2 ms`,

      'whois': `WHOIS Information for ${input}:
Domain Name: ${input.toUpperCase()}
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.iana.org
Creation Date: 1995-08-14T04:00:00Z
Registry Expiry Date: 2030-08-13T04:00:00Z
Registrar: Internet Assigned Numbers Authority
Name Server: A.IANA-SERVERS.NET
Name Server: B.IANA-SERVERS.NET
DNSSEC: unsigned`
    };

    return responses[toolId as keyof typeof responses] || `Analysis completed for ${input}.\n\nThis is a simulated result for the ${toolName} tool.\nIn a real implementation, this would show actual diagnostic data.`;
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
      // Simulate progress steps
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

      const simulatedResult = await simulateToolExecution(selectedTool, input);
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

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copied",
      description: "Result copied to clipboard.",
    });
  };

  const downloadResult = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTool}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Result saved to file.",
    });
  };

  if (!selectedTool) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Tool</h3>
          <p className="text-gray-600">Choose a tool from the categories above to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              {toolName}
              {!isFree && <Badge variant="secondary">Pro</Badge>}
            </CardTitle>
            {executionId && (
              <Badge variant="outline" className="text-xs">
                ID: {executionId}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder={`Enter ${inputType}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
            />
            <Button 
              onClick={handleExecute}
              disabled={isLoading || !canUseTool() || (requiresCaptcha() && !captchaVerified)}
              className="bg-blue-500 hover:bg-blue-600 min-w-[120px]"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Running...' : 'Analyze'}
            </Button>
          </div>
          
          {!canUseTool() && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                This tool requires a Pro or Enterprise plan. 
                <a href="/pricing" className="text-yellow-700 hover:text-yellow-600 underline ml-1">
                  Upgrade now
                </a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CAPTCHA */}
      {requiresCaptcha() && (
        <CaptchaComponent 
          onVerify={setCaptchaVerified}
          isRequired={requiresCaptcha()}
        />
      )}

      {/* Progress and Logs */}
      {isLoading && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-800 text-sm">Execution Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
            <div className="max-h-32 overflow-y-auto space-y-1">
              {logs.map((log, index) => (
                <div key={index} className="text-sm text-blue-700 font-mono">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Results
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyResult}>
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={downloadResult}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={result}
              readOnly
              className="bg-white border-green-200 text-gray-900 font-mono text-sm min-h-[300px] resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ToolExecutor;
