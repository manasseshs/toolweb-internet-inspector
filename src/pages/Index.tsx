
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Network, Mail, Shield, Globe, Server, Zap, Star, ArrowRight, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const [searchInput, setSearchInput] = useState('');
  const [selectedTool, setSelectedTool] = useState('');
  const [userIP, setUserIP] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Simulate getting user IP
    setUserIP('192.168.1.1');
  }, []);

  const toolCategories = {
    'IP & Network': [
      { id: 'blacklist', name: 'Blacklist Check', icon: Shield, description: 'Check if IP is blacklisted', free: true },
      { id: 'ptr', name: 'PTR Lookup', icon: Network, description: 'Reverse DNS lookup', free: true },
      { id: 'arin', name: 'ARIN Lookup', icon: Globe, description: 'ASN, country and provider info', free: true },
      { id: 'tcp', name: 'TCP Port Test', icon: Server, description: 'Check if TCP port is open', free: true },
      { id: 'ping', name: 'Ping Test', icon: Zap, description: 'ICMP latency test', free: true },
      { id: 'trace', name: 'Traceroute', icon: Network, description: 'Network path tracing', free: false },
      { id: 'geoip', name: 'GeoIP Lookup', icon: Globe, description: 'Geographic IP location', free: true }
    ],
    'DNS & Domain': [
      { id: 'a', name: 'A Record', icon: Globe, description: 'Main IP address lookup', free: true },
      { id: 'mx', name: 'MX Record', icon: Mail, description: 'Email server records', free: true },
      { id: 'spf', name: 'SPF Check', icon: Shield, description: 'SPF record verification', free: true },
      { id: 'txt', name: 'TXT Records', icon: Globe, description: 'All TXT records', free: true },
      { id: 'cname', name: 'CNAME Lookup', icon: Network, description: 'Alias records', free: true },
      { id: 'soa', name: 'SOA Record', icon: Server, description: 'Authority record', free: false },
      { id: 'dns', name: 'DNS Diagnostic', icon: Network, description: 'Complete DNS analysis', free: false },
      { id: 'dnssec', name: 'DNSSEC Check', icon: Shield, description: 'DNSSEC validation', free: false },
      { id: 'https', name: 'HTTPS Test', icon: Shield, description: 'SSL certificate test', free: true },
      { id: 'whois', name: 'WHOIS Lookup', icon: Search, description: 'Domain registration data', free: true },
      { id: 'propagation', name: 'DNS Propagation', icon: Globe, description: 'Global DNS propagation', free: false }
    ],
    'Email Tools': [
      { id: 'smtp-test', name: 'SMTP Test', icon: Mail, description: 'Test SMTP authentication', free: true },
      { id: 'deliverability', name: 'Email Deliverability', icon: Shield, description: 'SPF, DKIM, DMARC analysis', free: false },
      { id: 'spf-generator', name: 'SPF Generator', icon: Shield, description: 'Generate SPF records', free: true },
      { id: 'header-analyzer', name: 'Header Analyzer', icon: Search, description: 'Email header analysis', free: false },
      { id: 'email-migration', name: 'Email Migration', icon: Server, description: 'IMAP email migration', free: false }
    ]
  };

  const popularTools = [
    { id: 'blacklist', name: 'Blacklist Check', icon: Shield },
    { id: 'mx', name: 'MX Lookup', icon: Mail },
    { id: 'ping', name: 'Ping Test', icon: Zap },
    { id: 'whois', name: 'WHOIS', icon: Search }
  ];

  const handleSearch = () => {
    if (!searchInput || !selectedTool) return;
    navigate(`/tools/${selectedTool}?input=${encodeURIComponent(searchInput)}`);
  };

  const handleQuickTool = (toolId: string) => {
    navigate(`/tools/${toolId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">ToolWeb.io</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/login')} className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
            <Button onClick={() => navigate('/pricing')} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Upgrade
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Network & Email
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Diagnostic Tools
              </span>
            </h2>
            <p className="text-xl text-gray-400 mb-2">
              Professional network analysis and email testing suite
            </p>
            <p className="text-gray-500">
              Hello <span className="text-blue-400 font-mono">{userIP}</span>, what can I help you with today?
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter IP, domain, or email..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="bg-gray-900 border-gray-600 text-white placeholder-gray-400 text-lg py-6"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                  </div>
                  <div className="md:w-64">
                    <Select value={selectedTool} onValueChange={setSelectedTool}>
                      <SelectTrigger className="bg-gray-900 border-gray-600 text-white py-6">
                        <SelectValue placeholder="Select tool..." />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {Object.entries(toolCategories).map(([category, tools]) => (
                          <div key={category}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                              {category}
                            </div>
                            {tools.map((tool) => (
                              <SelectItem key={tool.id} value={tool.id} className="text-white hover:bg-gray-700">
                                <div className="flex items-center space-x-2">
                                  <tool.icon className="w-4 h-4" />
                                  <span>{tool.name}</span>
                                  {!tool.free && <Badge variant="secondary" className="ml-auto text-xs">Pro</Badge>}
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleSearch} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 py-6 px-8">
                    <Search className="w-5 h-5 mr-2" />
                    Analyze
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access Tools */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-white mb-6">Quick Access</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularTools.map((tool) => (
                <Card 
                  key={tool.id} 
                  className="bg-gray-800/30 border-gray-700 hover:bg-gray-700/50 cursor-pointer transition-all duration-200 hover:scale-105"
                  onClick={() => handleQuickTool(tool.id)}
                >
                  <CardContent className="p-6 text-center">
                    <tool.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h4 className="text-white font-semibold">{tool.name}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tool Categories */}
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-8">All Tools</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(toolCategories).map(([category, tools]) => (
                <Card key={category} className="bg-gray-800/30 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {category === 'IP & Network' && <Network className="w-5 h-5 text-blue-400" />}
                      {category === 'DNS & Domain' && <Globe className="w-5 h-5 text-green-400" />}
                      {category === 'Email Tools' && <Mail className="w-5 h-5 text-purple-400" />}
                      {category}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {category === 'IP & Network' && 'Network analysis and IP investigation tools'}
                      {category === 'DNS & Domain' && 'DNS records and domain information'}
                      {category === 'Email Tools' && 'Email testing and migration utilities'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tools.map((tool) => (
                        <div 
                          key={tool.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 hover:bg-gray-700/50 cursor-pointer transition-colors"
                          onClick={() => handleQuickTool(tool.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <tool.icon className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="text-white font-medium">{tool.name}</div>
                              <div className="text-xs text-gray-500">{tool.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {!tool.free && <Badge variant="secondary" className="text-xs">Pro</Badge>}
                            <ArrowRight className="w-4 h-4 text-gray-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-black/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">ToolWeb.io</h3>
              </div>
              <p className="text-gray-400">Professional network and email diagnostic tools for IT professionals.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/tools/blacklist" className="hover:text-white">Blacklist Check</a></li>
                <li><a href="/tools/mx" className="hover:text-white">MX Lookup</a></li>
                <li><a href="/tools/ping" className="hover:text-white">Ping Test</a></li>
                <li><a href="/tools/whois" className="hover:text-white">WHOIS</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/login" className="hover:text-white">Login</a></li>
                <li><a href="/register" className="hover:text-white">Register</a></li>
                <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-white">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Use</a></li>
                <li><a href="/contact" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 ToolWeb.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
