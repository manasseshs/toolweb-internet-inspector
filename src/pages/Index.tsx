
import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TabNavigation, { ToolCategory } from '@/components/TabNavigation';
import ToolSelector from '@/components/ToolSelector';
import ToolExecutor from '@/components/ToolExecutor';
import SEOHead from '@/components/SEOHead';
import HeaderSection from '@/components/layout/HeaderSection';
import HeroSection from '@/components/layout/HeroSection';
import FooterSection from '@/components/layout/FooterSection';
import { useToolNavigation } from '@/hooks/useToolNavigation';
import { getToolInfo } from '@/utils/toolsConfig';
import { getSEOConfig } from '@/utils/seoUtils';

const Index = () => {
  const [userIP, setUserIP] = useState('192.168.1.1');
  const { activeTab, selectedTool, handleToolSelect, handleTabChange } = useToolNavigation();

  // Map tool IDs to URL paths (needed for SEO config)
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

  useEffect(() => {
    // Simulate getting user IP
    setUserIP('192.168.1.1');
  }, []);

  const isDarkMode = activeTab === 'web';
  const seoConfig = getSEOConfig(selectedTool, toolToUrlMap);

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

        <HeaderSection />

        {/* Main Content */}
        <main className="container mx-auto px-4 py-4">
          <HeroSection selectedTool={selectedTool} userIP={userIP} />

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

        <FooterSection onToolSelect={handleToolSelect} />
      </div>
    </HelmetProvider>
  );
};

export default Index;
