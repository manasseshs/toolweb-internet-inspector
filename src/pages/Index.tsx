
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, User, LogIn, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import TabNavigation, { ToolCategory } from '@/components/TabNavigation';
import ToolSelector from '@/components/ToolSelector';
import ToolExecutor from '@/components/ToolExecutor';

const Index = () => {
  const [userIP, setUserIP] = useState('192.168.1.1');
  const [activeTab, setActiveTab] = useState<ToolCategory>('network');
  const [selectedTool, setSelectedTool] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Simulate getting user IP
    setUserIP('192.168.1.1');
  }, []);

  const toolsInfo = {
    'blacklist': { name: 'Blacklist Check', inputType: 'IP address', free: true },
    'ptr': { name: 'PTR Lookup', inputType: 'IP address', free: true },
    'arin': { name: 'ARIN Lookup', inputType: 'IP address', free: true },
    'tcp': { name: 'TCP Port Test', inputType: 'IP:Port', free: true },
    'ping': { name: 'Ping Test', inputType: 'IP address', free: true },
    'trace': { name: 'Traceroute', inputType: 'IP address', free: false },
    'geoip': { name: 'GeoIP Lookup', inputType: 'IP address', free: true },
    'a': { name: 'A Record', inputType: 'Domain name', free: true },
    'mx': { name: 'MX Record', inputType: 'Domain name', free: true },
    'spf': { name: 'SPF Check', inputType: 'Domain name', free: true },
    'txt': { name: 'TXT Records', inputType: 'Domain name', free: true },
    'cname': { name: 'CNAME Lookup', inputType: 'Domain name', free: true },
    'soa': { name: 'SOA Record', inputType: 'Domain name', free: false },
    'dns': { name: 'DNS Diagnostic', inputType: 'Domain name', free: false },
    'dnssec': { name: 'DNSSEC Check', inputType: 'Domain name', free: false },
    'https': { name: 'HTTPS Test', inputType: 'Domain name', free: true },
    'whois': { name: 'WHOIS Lookup', inputType: 'Domain name', free: true },
    'propagation': { name: 'DNS Propagation', inputType: 'Domain name', free: false },
    'smtp-test': { name: 'SMTP Test', inputType: 'SMTP details', free: true },
    'email-validation': { name: 'Email Validation', inputType: 'Email address', free: true },
    'deliverability': { name: 'Email Deliverability', inputType: 'Domain name', free: false },
    'spf-generator': { name: 'SPF Generator', inputType: 'Domain details', free: true },
    'header-analyzer': { name: 'Header Analyzer', inputType: 'Email headers', free: false },
    'email-migration': { name: 'Email Migration', inputType: 'IMAP details', free: false }
  };

  const getToolInfo = (toolId: string) => {
    return toolsInfo[toolId as keyof typeof toolsInfo] || { name: 'Unknown Tool', inputType: 'Input', free: true };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ToolWeb.io</h1>
              <p className="text-sm text-gray-600">Network & Email Diagnostic Tools</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/pricing')} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <Settings className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button onClick={() => navigate('/pricing')} className="bg-blue-500 hover:bg-blue-600 text-white">
                  Upgrade
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            {/* Robot Mascot */}
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Network className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Professional Network
              <span className="block text-blue-600">Diagnostic Tools</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-2">
              Analyze IP addresses, domains, and email systems with precision
            </p>
            
            <p className="text-gray-500">
              Hello <span className="text-blue-600 font-mono font-semibold">{userIP}</span>, what can I help you with today?
            </p>
          </div>
        </div>

        {/* Tool Categories Navigation */}
        <TabNavigation 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />

        {/* Tool Selection */}
        <Card className="mb-8 border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Select Tool</CardTitle>
            <CardDescription className="text-gray-600">
              Choose from our comprehensive suite of network and email analysis tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ToolSelector 
              activeCategory={activeTab}
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
            />
          </CardContent>
        </Card>

        {/* Tool Executor */}
        <ToolExecutor 
          selectedTool={selectedTool}
          toolName={getToolInfo(selectedTool).name}
          inputType={getToolInfo(selectedTool).inputType}
          isFree={getToolInfo(selectedTool).free}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">ToolWeb.io</h3>
              </div>
              <p className="text-gray-600">Professional network and email diagnostic tools for IT professionals and businesses.</p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Popular Tools</h4>
              <ul className="space-y-2 text-gray-600">
                <li><button onClick={() => setSelectedTool('blacklist')} className="hover:text-blue-600">Blacklist Check</button></li>
                <li><button onClick={() => setSelectedTool('mx')} className="hover:text-blue-600">MX Lookup</button></li>
                <li><button onClick={() => setSelectedTool('ping')} className="hover:text-blue-600">Ping Test</button></li>
                <li><button onClick={() => setSelectedTool('whois')} className="hover:text-blue-600">WHOIS</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/login" className="hover:text-blue-600">Login</a></li>
                <li><a href="/register" className="hover:text-blue-600">Register</a></li>
                <li><a href="/pricing" className="hover:text-blue-600">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-blue-600">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="/contact" className="hover:text-blue-600">Contact Us</a></li>
                <li><a href="/help" className="hover:text-blue-600">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-600">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>&copy; 2024 ToolWeb.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
