
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Network, ArrowLeft, Play, Copy, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
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
    'deliverability': { name: 'Email Deliverability', description: 'SPF, DKIM, DMARC analysis', inputType: 'Domain name', free: false },
    'spf-generator': { name: 'SPF Generator', description: 'Generate SPF records', inputType: 'Domain details', free: true },
    'header-analyzer': { name: 'Header Analyzer', description: 'Email header analysis', inputType: 'Email headers', free: false },
    'email-migration': { name: 'Email Migration', description: 'IMAP email migration', inputType: 'IMAP details', free: false }
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

  const simulateToolExecution = (toolId: string, input: string): string => {
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

      'tcp': () => {
        const parts = input.split(':');
        const host = parts[0] || input;
        const port = parts[1] || '80';
        return `TCP Port Test Results for ${host}:${port}:

Connection Test: ✅ SUCCESS
Response Time: 23ms
Port Status: OPEN
Service Detection: HTTP/HTTPS Server
Banner Grab: "Server: nginx/1.18.0"

Network Path:
Hop 1: Local Gateway (192.168.1.1) - 2ms
Hop 2: ISP Router (10.0.0.1) - 15ms 
Hop 3: Target Host (${host}) - 23ms

Summary: Port ${port} is accessible and responding`;
      },

      'whois': () => `WHOIS Information for ${input}:

Domain Information:
Domain Name: ${input.toUpperCase()}
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar-servers.com
Registrar URL: http://www.registrar.com
Updated Date: 2024-01-15T10:30:45Z
Creation Date: 2020-08-14T04:00:00Z
Registry Expiry Date: 2025-08-13T04:00:00Z
Registrar: Example Registrar, Inc.
Registrar IANA ID: 1234

Registrant Information:
Organization: Example Corporation
Country: US
State/Province: California
City: San Francisco
Postal Code: 94102

Administrative Contact:
Name: John Smith
Email: admin@${input}
Phone: +1.4155551234

Technical Contact:
Name: Tech Support
Email: tech@${input}
Phone: +1.4155555678

Name Servers:
ns1.${input}
ns2.${input}
ns3.cloudflare.com
ns4.cloudflare.com

Domain Status:
clientTransferProhibited
clientUpdateProhibited
clientDeleteProhibited

DNSSEC: signedDelegation

Last Updated: 2024-05-30T12:00:00Z
Query Time: 156ms`,

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
round-trip min/avg/max/stddev = 13.8/14.0/14.2/0.2 ms`
    };

    if (typeof responses[toolId as keyof typeof responses] === 'function') {
      return (responses[toolId as keyof typeof responses] as Function)();
    }
    
    return responses[toolId as keyof typeof responses] || `Analysis completed for ${input}.\n\nThis is a simulated result for the ${tool?.name} tool.\nIn a real implementation, this would show actual diagnostic data.`;
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
      const simulatedResult = simulateToolExecution(toolId!, input);
      setResult(simulatedResult);
      setIsLoading(false);
      
      toast({
        title: "Analysis complete",
        description: "Tool execution finished successfully.",
      });
    }, 2000);
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
    a.download = `${toolId}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded",
      description: "Result saved to file.",
    });
  };

  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <Card className="bg-gray-800/50 border-gray-700 max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Tool Not Found</h2>
            <p className="text-gray-400 mb-6">The requested tool does not exist.</p>
            <Link to="/">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ToolWeb.io</h1>
              <p className="text-sm text-gray-400">{tool.name}</p>
            </div>
          </div>
          <Link to="/" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Tool Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-white">{tool.name}</h1>
              {!tool.free && <Badge variant="secondary">Pro</Badge>}
            </div>
            <p className="text-gray-400 text-lg">{tool.description}</p>
          </div>

          {/* Input Section */}
          <Card className="bg-gray-800/50 border-gray-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Input</CardTitle>
              <CardDescription className="text-gray-400">
                Enter the {tool.inputType} you want to analyze
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder={`Enter ${tool.inputType}...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleExecute()}
                />
                <Button 
                  onClick={handleExecute}
                  disabled={isLoading || !canUseTool()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 min-w-[120px]"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isLoading ? 'Running...' : 'Execute'}
                </Button>
              </div>
              
              {!canUseTool() && (
                <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
                  <p className="text-yellow-400 text-sm">
                    This tool requires a Pro or Enterprise plan. 
                    <Link to="/pricing" className="text-yellow-300 hover:text-yellow-200 underline ml-1">
                      Upgrade now
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {(result || isLoading) && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Results</CardTitle>
                    <CardDescription className="text-gray-400">
                      Analysis output for {input}
                    </CardDescription>
                  </div>
                  {result && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyResult} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadResult} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <RefreshCw className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
                      <p className="text-gray-400">Analyzing {input}...</p>
                    </div>
                  </div>
                ) : (
                  <Textarea
                    value={result}
                    readOnly
                    className="bg-gray-900 border-gray-600 text-gray-300 font-mono text-sm min-h-[300px] resize-none"
                  />
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools;
