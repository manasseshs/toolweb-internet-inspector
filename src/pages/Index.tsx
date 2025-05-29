
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">ToolWeb.io</h1>
              <p className="text-sm text-slate-600">Network & Email Diagnostic Tools</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <User className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button onClick={() => navigate('/pricing')} className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-md">
                  <Settings className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')} className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button onClick={() => navigate('/pricing')} className="bg-indigo-500 hover:bg-indigo-600 text-white shadow-md">
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
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Network className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-4 leading-tight">
              Professional Network
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Diagnostic Tools
              </span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-4 max-w-2xl mx-auto">
              Analyze IP addresses, domains, and email systems with precision and ease
            </p>
            
            <div className="inline-flex items-center bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 border border-slate-200 shadow-sm">
              <span className="text-slate-600 mr-2">Hello</span>
              <span className="text-indigo-600 font-mono font-semibold bg-indigo-50 px-3 py-1 rounded-full text-sm">
                {userIP}
              </span>
              <span className="text-slate-600 ml-2">, what can I help you with today?</span>
            </div>
          </div>
        </div>

        {/* Tool Categories Navigation */}
        <div className="mb-8">
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>

        {/* Tool Selection */}
        <Card className="mb-8 border-slate-200 shadow-lg bg-white/60 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
            <CardTitle className="text-slate-800 text-xl">Select Tool</CardTitle>
            <CardDescription className="text-slate-600">
              Choose from our comprehensive suite of network and email analysis tools
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <ToolSelector 
              activeCategory={activeTab}
              selectedTool={selectedTool}
              onToolSelect={setSelectedTool}
            />
          </CardContent>
        </Card>

        {/* Tool Executor */}
        <div className="mb-8">
          <ToolExecutor 
            selectedTool={selectedTool}
            toolName={getToolInfo(selectedTool).name}
            inputType={getToolInfo(selectedTool).inputType}
            isFree={getToolInfo(selectedTool).free}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-slate-200 mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">ToolWeb.io</h3>
              </div>
              <p className="text-slate-600">Professional network and email diagnostic tools for IT professionals and businesses.</p>
            </div>
            <div>
              <h4 className="text-slate-800 font-semibold mb-4">Popular Tools</h4>
              <ul className="space-y-2 text-slate-600">
                <li><button onClick={() => setSelectedTool('blacklist')} className="hover:text-indigo-600 transition-colors">Blacklist Check</button></li>
                <li><button onClick={() => setSelectedTool('mx')} className="hover:text-indigo-600 transition-colors">MX Lookup</button></li>
                <li><button onClick={() => setSelectedTool('ping')} className="hover:text-indigo-600 transition-colors">Ping Test</button></li>
                <li><button onClick={() => setSelectedTool('whois')} className="hover:text-indigo-600 transition-colors">WHOIS</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="/login" className="hover:text-indigo-600 transition-colors">Login</a></li>
                <li><a href="/register" className="hover:text-indigo-600 transition-colors">Register</a></li>
                <li><a href="/pricing" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-slate-800 font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="/contact" className="hover:text-indigo-600 transition-colors">Contact Us</a></li>
                <li><a href="/help" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 mt-8 pt-8 text-center text-slate-500">
            <p>&copy; 2024 ToolWeb.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
