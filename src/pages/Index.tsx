import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Network, User, LogIn, Settings } from 'lucide-react';
import { HelmetProvider } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import TabNavigation, { ToolCategory } from '@/components/TabNavigation';
import ToolSelector from '@/components/ToolSelector';
import ToolExecutor from '@/components/ToolExecutor';
import SEOHead from '@/components/SEOHead';
import { toolSEOConfig } from '@/utils/seoConfig';

const Index = () => {
  const [userIP, setUserIP] = useState('192.168.1.1');
  const [activeTab, setActiveTab] = useState<ToolCategory>('network');
  const [selectedTool, setSelectedTool] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Map URL paths to tool IDs
  const urlToToolMap: Record<string, string> = {
    '/blacklist-check': 'blacklist',
    '/ptr-lookup': 'ptr',
    '/arin-lookup': 'arin',
    '/tcp-port-test': 'tcp',
    '/ping-test': 'ping',
    '/traceroute': 'trace',
    '/geoip-lookup': 'geoip',
    '/a-record': 'a',
    '/mx-record': 'mx',
    '/spf-check': 'spf',
    '/txt-records': 'txt',
    '/cname-lookup': 'cname',
    '/soa-record': 'soa',
    '/dns-diagnostic': 'dns',
    '/dnssec-check': 'dnssec',
    '/https-test': 'https',
    '/whois-lookup': 'whois',
    '/dns-propagation': 'propagation',
    '/smtp-test': 'smtp-test',
    '/email-validation': 'email-validation',
    '/email-deliverability': 'deliverability',
    '/spf-generator': 'spf-generator',
    '/header-analyzer': 'header-analyzer',
    '/email-migration': 'email-migration'
  };

  // Map tool IDs to URL paths
  const toolToUrlMap: Record<string, string> = {
    'blacklist': '/blacklist-check',
    'ptr': '/ptr-lookup',
    'arin': '/arin-lookup',
    'tcp': '/tcp-port-test',
    'ping': '/ping-test',
    'trace': '/traceroute',
    'geoip': '/geoip-lookup',
    'a': '/a-record',
    'mx': '/mx-record',
    'spf': '/spf-check',
    'txt': '/txt-records',
    'cname': '/cname-lookup',
    'soa': '/soa-record',
    'dns': '/dns-diagnostic',
    'dnssec': '/dnssec-check',
    'https': '/https-test',
    'whois': '/whois-lookup',
    'propagation': '/dns-propagation',
    'smtp-test': '/smtp-test',
    'email-validation': '/email-validation',
    'deliverability': '/email-deliverability',
    'spf-generator': '/spf-generator',
    'header-analyzer': '/header-analyzer',
    'email-migration': '/email-migration'
  };

  // Map tool IDs to categories
  const toolCategoryMap: Record<string, ToolCategory> = {
    'blacklist': 'network',
    'ptr': 'network',
    'arin': 'network',
    'tcp': 'network',
    'ping': 'network',
    'trace': 'network',
    'geoip': 'network',
    'a': 'dns',
    'mx': 'dns',
    'spf': 'dns',
    'txt': 'dns',
    'cname': 'dns',
    'soa': 'dns',
    'dns': 'dns',
    'dnssec': 'dns',
    'https': 'dns',
    'whois': 'dns',
    'propagation': 'dns',
    'smtp-test': 'email',
    'email-validation': 'email',
    'deliverability': 'email',
    'spf-generator': 'email',
    'header-analyzer': 'email',
    'email-migration': 'email'
  };

  useEffect(() => {
    // Simulate getting user IP
    setUserIP('192.168.1.1');
  }, []);

  // Handle URL-based tool selection
  useEffect(() => {
    const currentPath = location.pathname;
    const toolId = urlToToolMap[currentPath];
    
    if (toolId) {
      setSelectedTool(toolId);
      const category = toolCategoryMap[toolId];
      if (category) {
        setActiveTab(category);
      }
    } else if (currentPath === '/') {
      setSelectedTool('');
    }
  }, [location.pathname]);

  const toolsInfo = {
    'blacklist': { name: 'Blacklist Check', inputType: 'IP address', free: true },
    'ptr': { name: 'PTR Lookup', inputType: 'IP address', free: true },
    'arin': { name: 'ARIN Lookup', inputType: 'IP address', free: true },
    'tcp': { name: 'TCP Port Test', inputType: 'IP/Domain:Port', free: true },
    'ping': { name: 'Ping Test', inputType: 'IP address', free: true },
    'trace': { name: 'Traceroute', inputType: 'IP address', free: true },
    'geoip': { name: 'GeoIP Lookup', inputType: 'IP address', free: true },
    'a': { name: 'A Record', inputType: 'Domain name', free: true },
    'mx': { name: 'MX Record', inputType: 'Domain name', free: true },
    'spf': { name: 'SPF Check', inputType: 'Domain name', free: true },
    'txt': { name: 'TXT Records', inputType: 'Domain name', free: true },
    'cname': { name: 'CNAME Lookup', inputType: 'Domain name', free: true },
    'soa': { name: 'SOA Record', inputType: 'Domain name', free: true },
    'dns': { name: 'DNS Diagnostic', inputType: 'Domain name', free: false },
    'dnssec': { name: 'DNSSEC Check', inputType: 'Domain name', free: true },
    'https': { name: 'HTTPS Test', inputType: 'Domain name', free: true },
    'whois': { name: 'WHOIS Lookup', inputType: 'Domain name', free: true },
    'propagation': { name: 'DNS Propagation', inputType: 'Domain name', free: true },
    'smtp-test': { name: 'SMTP Test', inputType: 'SMTP details', free: true },
    'email-validation': { name: 'Email Validation', inputType: 'Email addresses', free: true },
    'deliverability': { name: 'Email Deliverability', inputType: 'Domain name', free: true },
    'spf-generator': { name: 'SPF Generator', inputType: 'Domain details', free: true },
    'header-analyzer': { name: 'Header Analyzer', inputType: 'Email headers', free: true },
    'email-migration': { name: 'Email Migration', inputType: 'IMAP details', free: true }
  };

  const getToolInfo = (toolId: string) => {
    return toolsInfo[toolId as keyof typeof toolsInfo] || { name: 'Unknown Tool', inputType: 'Input', free: true };
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    const url = toolToUrlMap[toolId];
    if (url) {
      navigate(url);
    }
  };

  const handleTabChange = (tab: ToolCategory) => {
    setActiveTab(tab);
    // Clear selected tool when changing tabs if not on home
    if (location.pathname !== '/') {
      navigate('/');
      setSelectedTool('');
    }
  };

  const isDarkMode = activeTab === 'web';

  // Get SEO config for current tool
  const getSEOConfig = () => {
    if (selectedTool && toolSEOConfig[selectedTool]) {
      const config = toolSEOConfig[selectedTool];
      return {
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        canonicalUrl: toolToUrlMap[selectedTool],
        toolName: getToolInfo(selectedTool).name
      };
    }
    
    // Default homepage SEO
    return {
      title: 'Professional Network & Email Diagnostic Tools',
      description: 'Professional network analysis and email testing suite. IP blacklist checks, DNS lookups, email deliverability tests, and more. Free online tools for IT professionals.',
      keywords: 'network tools, DNS lookup, IP blacklist, email testing, SMTP test, network diagnostic, email verification, domain analysis',
      canonicalUrl: '/',
      toolName: 'ToolWeb.io'
    };
  };

  const seoConfig = getSEOConfig();

  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#f8f9fa]">
        <SEOHead
          title={seoConfig.title}
          description={seoConfig.description}
          keywords={seoConfig.keywords}
          canonicalUrl={seoConfig.canonicalUrl}
          toolName={seoConfig.toolName}
        />

        {/* Header */}
        <header className="bg-white border-b border-[#dee2e6] shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] rounded-xl flex items-center justify-center shadow-sm">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#212529]">ToolWeb.io</h1>
                <p className="text-sm text-[#6c757d]">The essential toolkit for domains, IP addresses, and network diagnostics.</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')} 
                    className="bg-white border-[#0d6efd] text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white transition-colors duration-200"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button 
                    onClick={() => navigate('/pricing')} 
                    className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white shadow-sm"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Upgrade
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/login')} 
                    className="bg-white border-[#0d6efd] text-[#0d6efd] hover:bg-[#0d6efd] hover:text-white transition-colors duration-200"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <Button 
                    onClick={() => navigate('/pricing')} 
                    className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white shadow-sm"
                  >
                    Upgrade
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-4">
          {/* Hero Section */}
          <div className="text-center mb-4">
            <div className="mb-4">
              {/* Robot Mascot */}
              <div className="w-16 h-16 bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Network className="w-8 h-8 text-white" />
              </div>
              
              {selectedTool && toolSEOConfig[selectedTool] ? (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#212529] mb-3 leading-tight">
                    {toolSEOConfig[selectedTool].h1}
                  </h1>
                  <h2 className="text-xl text-[#6c757d] mb-4 max-w-2xl mx-auto">
                    {toolSEOConfig[selectedTool].h2}
                  </h2>
                </>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#212529] mb-3 leading-tight">
                    Professional Network
                    <span className="block bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] bg-clip-text text-transparent">
                      Diagnostic Tools
                    </span>
                  </h1>
                  <h2 className="text-lg text-[#6c757d] mb-4 max-w-2xl mx-auto">
                    Analyze IP addresses, domains, and email systems with precision and ease
                  </h2>
                </>
              )}
              
              <div className="inline-flex items-center bg-white rounded-full px-5 py-2 border border-[#dee2e6] shadow-sm">
                <span className="text-[#6c757d] mr-2">Hello</span>
                <span className="text-[#0d6efd] font-mono font-semibold bg-[#f8f9fa] px-3 py-1 rounded-full text-sm border border-[#dee2e6]">
                  {userIP}
                </span>
                <span className="text-[#6c757d] ml-2">, what can I help you with today?</span>
              </div>
            </div>
          </div>

          {/* Tool Categories Navigation */}
          <TabNavigation 
            activeTab={activeTab} 
            onTabChange={handleTabChange} 
          />

          {/* Tool Selection */}
          <Card className={`mt-4 mb-4 shadow-sm transition-colors duration-200 ${
            isDarkMode 
              ? 'border-[#475569] bg-[#1e293b]' 
              : 'border-[#dee2e6] bg-white'
          }`}>
            <CardHeader className={`rounded-t-lg border-b transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-[#334155] border-[#475569]' 
                : 'bg-[#f8f9fa] border-[#dee2e6]'
            }`}>
              <CardTitle className={`text-xl ${
                isDarkMode ? 'text-[#f1f5f9]' : 'text-[#212529]'
              }`}>
                Select Tool
              </CardTitle>
              <CardDescription className={isDarkMode ? 'text-[#94a3b8]' : 'text-[#6c757d]'}>
                Choose from our comprehensive suite of network and email analysis tools
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <ToolSelector 
                activeCategory={activeTab}
                selectedTool={selectedTool}
                onToolSelect={handleToolSelect}
              />
            </CardContent>
          </Card>

          {/* Tool Executor */}
          <div className="mb-4">
            <ToolExecutor 
              selectedTool={selectedTool}
              toolName={getToolInfo(selectedTool).name}
              inputType={getToolInfo(selectedTool).inputType}
              isFree={getToolInfo(selectedTool).free}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#dee2e6] mt-8">
          <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] rounded-lg flex items-center justify-center">
                    <Network className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-[#212529]">ToolWeb.io</h3>
                </div>
                <p className="text-[#6c757d] text-sm">The essential toolkit for domains, IP addresses, and network diagnostics.</p>
              </div>
              <div>
                <h4 className="text-[#212529] font-semibold mb-3 text-sm">Popular Tools</h4>
                <ul className="space-y-2 text-sm text-[#6c757d]">
                  <li><button onClick={() => handleToolSelect('blacklist')} className="hover:text-[#0d6efd] transition-colors">Blacklist Check</button></li>
                  <li><button onClick={() => handleToolSelect('mx')} className="hover:text-[#0d6efd] transition-colors">MX Lookup</button></li>
                  <li><button onClick={() => handleToolSelect('ping')} className="hover:text-[#0d6efd] transition-colors">Ping Test</button></li>
                  <li><button onClick={() => handleToolSelect('whois')} className="hover:text-[#0d6efd] transition-colors">WHOIS</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[#212529] font-semibold mb-3 text-sm">Account</h4>
                <ul className="space-y-2 text-sm text-[#6c757d]">
                  <li><a href="/login" className="hover:text-[#0d6efd] transition-colors">Login</a></li>
                  <li><a href="/register" className="hover:text-[#0d6efd] transition-colors">Register</a></li>
                  <li><a href="/pricing" className="hover:text-[#0d6efd] transition-colors">Pricing</a></li>
                  <li><a href="/dashboard" className="hover:text-[#0d6efd] transition-colors">Dashboard</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-[#212529] font-semibold mb-3 text-sm">Support</h4>
                <ul className="space-y-2 text-sm text-[#6c757d]">
                  <li><a href="/contact" className="hover:text-[#0d6efd] transition-colors">Contact Us</a></li>
                  <li><a href="/help" className="hover:text-[#0d6efd] transition-colors">Help Center</a></li>
                  <li><a href="/privacy" className="hover:text-[#0d6efd] transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-[#0d6efd] transition-colors">Terms of Use</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-[#dee2e6] mt-6 pt-6 text-center text-[#6c757d] text-sm">
              <p>&copy; 2024 ToolWeb.io. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default Index;
