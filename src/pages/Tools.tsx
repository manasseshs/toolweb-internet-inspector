import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import ToolHeader from '@/components/ToolHeader';
import ToolInput from '@/components/ToolInput';
import ToolResults from '@/components/ToolResults';
import { generateToolResponse } from '@/components/ToolSimulator';
import { useToast } from '@/hooks/use-toast';

const Tools = () => {
  const { toolId } = useParams();
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState(searchParams.get('input') || '');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const toolsInfo = {
    'blacklist': { name: 'Blacklist Check', description: 'Check if IP is on spam blacklists', inputType: 'IP address', free: true },
    'ptr': { name: 'PTR Lookup', description: 'Reverse DNS lookup', inputType: 'IP address', free: true },
    'arin': { name: 'ARIN Lookup', description: 'ASN, country and provider info', inputType: 'IP address', free: true },
    'tcp': { name: 'TCP Port Test', description: 'Check if TCP port is open', inputType: 'IP/Domain:Port', free: true },
    'ping': { name: 'Ping Test', description: 'ICMP latency test', inputType: 'IP address or domain', free: true },
    'trace': { name: 'Traceroute', description: 'Network path tracing', inputType: 'IP address or domain', free: true },
    'geoip': { name: 'GeoIP Lookup', description: 'Geographic IP location', inputType: 'IP address', free: true },
    'a': { name: 'A Record', description: 'Main IP address lookup', inputType: 'Domain name', free: true },
    'mx': { name: 'MX Record', description: 'Email server records', inputType: 'Domain name', free: true },
    'spf': { name: 'SPF Check', description: 'SPF record verification', inputType: 'Domain name', free: true },
    'txt': { name: 'TXT Records', description: 'All TXT records', inputType: 'Domain name', free: true },
    'cname': { name: 'CNAME Lookup', description: 'Alias records', inputType: 'Domain name', free: true },
    'soa': { name: 'SOA Record', description: 'Authority record', inputType: 'Domain name', free: true },
    'dns': { name: 'DNS Diagnostic', description: 'Complete DNS analysis', inputType: 'Domain name', free: false },
    'dnssec': { name: 'DNSSEC Check', description: 'DNSSEC validation', inputType: 'Domain name', free: true },
    'https': { name: 'HTTPS Test', description: 'SSL certificate test', inputType: 'Domain name', free: true },
    'whois': { name: 'WHOIS Lookup', description: 'Domain registration data', inputType: 'Domain name', free: true },
    'propagation': { name: 'DNS Propagation', description: 'Global DNS propagation', inputType: 'Domain name', free: true },
    'smtp-test': { name: 'SMTP Test', description: 'Test SMTP authentication', inputType: 'SMTP details', free: true },
    'email-validation': { name: 'Email Validation', description: 'Validate email addresses', inputType: 'Email addresses', free: true },
    'deliverability': { name: 'Email Deliverability', description: 'SPF, DKIM, DMARC analysis', inputType: 'Domain name', free: true },
    'spf-generator': { name: 'SPF Generator', description: 'Generate SPF records', inputType: 'Domain details', free: true },
    'header-analyzer': { name: 'Header Analyzer', description: 'Email header analysis', inputType: 'Email headers', free: true },
    'email-migration': { name: 'Email Migration', description: 'IMAP email migration', inputType: 'IMAP details', free: true }
  };

  const tool = toolsInfo[toolId as keyof typeof toolsInfo];

  useEffect(() => {
    const inputParam = searchParams.get('input');
    if (inputParam) {
      setInput(inputParam);
    }
  }, [searchParams]);

  const canUseTool = () => {
    if (tool?.free) return true;
    return user && (user.plan === 'pro' || user.plan === 'enterprise');
  };

  const handleExecute = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: `Please enter a ${tool?.inputType}.`,
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

    setIsLoading(true);
    setResult('');

    // Simulate API call
    setTimeout(() => {
      const simulatedResult = generateToolResponse(toolId!, input, tool?.name || 'Unknown Tool');
      setResult(simulatedResult);
      setIsLoading(false);
      
      toast({
        title: "Analysis complete",
        description: "Tool execution finished successfully.",
      });
    }, 2000);
  };

  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Tool Not Found</h2>
            <p className="text-gray-400 mb-6">The requested tool does not exist.</p>
            <Link to="/" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded">
              Back to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <ToolHeader toolName={tool.name} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tool Info */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-white">{tool.name}</h1>
              {!tool.free && <Badge variant="secondary">Pro</Badge>}
            </div>
            <p className="text-gray-400 text-lg">{tool.description}</p>
          </div>

          {/* Tool Input */}
          <ToolInput
            toolName={tool.name}
            inputType={tool.inputType}
            isFree={tool.free}
            input={input}
            onInputChange={setInput}
            onExecute={handleExecute}
            isLoading={isLoading}
            canUseTool={canUseTool()}
          />

          {/* Results */}
          {(result || isLoading) && (
            <ToolResults
              result={result}
              input={input}
              toolId={toolId!}
              isLegacyTool={true}
            />
          )}

          {/* Loading State */}
          {isLoading && !result && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Analyzing {input}...</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools;
