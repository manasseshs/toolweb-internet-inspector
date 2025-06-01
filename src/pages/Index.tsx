
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToolCategory } from '@/components/TabNavigation';
import ToolExecutor from '@/components/ToolExecutor';
import HomeLayout from '@/components/home/HomeLayout';
import HeroSection from '@/components/home/HeroSection';
import ToolCategoriesSection from '@/components/home/ToolCategoriesSection';
import { getToolIdFromPath, getPathFromToolId } from '@/utils/toolRoutes';

const Index = () => {
  const [userIP, setUserIP] = useState('192.168.1.1');
  const [activeTab, setActiveTab] = useState<ToolCategory>('network');
  const [selectedTool, setSelectedTool] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Simulate getting user IP
    setUserIP('192.168.1.1');
  }, []);

  // Check if current path corresponds to a tool
  useEffect(() => {
    const toolId = getToolIdFromPath(location.pathname);
    if (toolId && toolId !== selectedTool) {
      setSelectedTool(toolId);
      // Set appropriate tab based on tool
      const toolCategories = {
        'blacklist': 'network', 'ptr': 'network', 'arin': 'network', 'tcp': 'network', 'ping': 'network', 'trace': 'network', 'geoip': 'network',
        'a': 'dns', 'mx': 'dns', 'spf': 'dns', 'txt': 'dns', 'cname': 'dns', 'soa': 'dns', 'dns': 'dns', 'dnssec': 'dns', 'https': 'dns', 'whois': 'dns', 'propagation': 'dns',
        'smtp-test': 'email', 'email-validation': 'email', 'deliverability': 'email', 'spf-generator': 'email', 'header-analyzer': 'email', 'email-migration': 'email'
      };
      const category = toolCategories[toolId as keyof typeof toolCategories] as ToolCategory;
      if (category) {
        setActiveTab(category);
      }
    }
  }, [location.pathname, selectedTool]);

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    const path = getPathFromToolId(toolId);
    navigate(path, { replace: true });
  };

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

  return (
    <HomeLayout>
      <HeroSection userIP={userIP} />
      
      <ToolCategoriesSection 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedTool={selectedTool}
        onToolSelect={handleToolSelect}
      />

      {/* Tool Executor */}
      <div className="mb-4">
        <ToolExecutor 
          selectedTool={selectedTool}
          toolName={getToolInfo(selectedTool).name}
          inputType={getToolInfo(selectedTool).inputType}
          isFree={getToolInfo(selectedTool).free}
        />
      </div>
    </HomeLayout>
  );
};

export default Index;
