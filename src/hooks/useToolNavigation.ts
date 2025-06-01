
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToolCategory } from '@/components/TabNavigation';

export const useToolNavigation = () => {
  const [activeTab, setActiveTab] = useState<ToolCategory>('network');
  const [selectedTool, setSelectedTool] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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

  return {
    activeTab,
    selectedTool,
    handleToolSelect,
    handleTabChange
  };
};
