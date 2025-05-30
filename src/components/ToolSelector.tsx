
import React from 'react';
import { Shield, Network, Globe, Mail, Server, Zap, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ToolCategory } from './TabNavigation';

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  inputType: string;
  free: boolean;
  category: ToolCategory;
}

interface ToolSelectorProps {
  activeCategory: ToolCategory;
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const ToolSelector: React.FC<ToolSelectorProps> = ({ activeCategory, selectedTool, onToolSelect }) => {
  const tools: Tool[] = [
    // Network & IP Tools
    { id: 'blacklist', name: 'Blacklist Check', icon: Shield, description: 'Check if IP is blacklisted', inputType: 'IP address', free: true, category: 'network' },
    { id: 'ptr', name: 'PTR Lookup', icon: Network, description: 'Reverse DNS lookup', inputType: 'IP address', free: true, category: 'network' },
    { id: 'arin', name: 'ARIN Lookup', icon: Globe, description: 'ASN, country and provider info', inputType: 'IP address', free: true, category: 'network' },
    { id: 'tcp', name: 'TCP Port Test', icon: Server, description: 'Check if TCP port is open', inputType: 'IP/Domain:Port', free: true, category: 'network' },
    { id: 'ping', name: 'Ping Test', icon: Zap, description: 'ICMP latency test', inputType: 'IP address', free: true, category: 'network' },
    { id: 'trace', name: 'Traceroute', icon: Network, description: 'Network path tracing', inputType: 'IP address', free: true, category: 'network' },
    { id: 'geoip', name: 'GeoIP Lookup', icon: Globe, description: 'Geographic IP location', inputType: 'IP address', free: true, category: 'network' },

    // DNS & Domain Tools
    { id: 'a', name: 'A Record', icon: Globe, description: 'Main IP address lookup', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'mx', name: 'MX Record', icon: Mail, description: 'Email server records', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'spf', name: 'SPF Check', icon: Shield, description: 'SPF record verification', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'txt', name: 'TXT Records', icon: Globe, description: 'All TXT records', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'cname', name: 'CNAME Lookup', icon: Network, description: 'Alias records', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'soa', name: 'SOA Record', icon: Server, description: 'Authority record', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'dns', name: 'DNS Diagnostic', icon: Network, description: 'Complete DNS analysis', inputType: 'Domain name', free: false, category: 'dns' },
    { id: 'dnssec', name: 'DNSSEC Check', icon: Shield, description: 'DNSSEC validation', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'https', name: 'HTTPS Test', icon: Shield, description: 'SSL certificate test', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'whois', name: 'WHOIS Lookup', icon: Search, description: 'Domain registration data', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'propagation', name: 'DNS Propagation', icon: Globe, description: 'Global DNS propagation', inputType: 'Domain name', free: true, category: 'dns' },

    // Email Tools
    { id: 'smtp-test', name: 'SMTP Test', icon: Mail, description: 'Test SMTP authentication', inputType: 'SMTP details', free: true, category: 'email' },
    { id: 'email-validation', name: 'Email Validation', icon: Shield, description: 'Validate email addresses', inputType: 'Email address', free: true, category: 'email' },
    { id: 'deliverability', name: 'Email Deliverability', icon: Shield, description: 'SPF, DKIM, DMARC analysis', inputType: 'Domain name', free: false, category: 'email' },
    { id: 'spf-generator', name: 'SPF Generator', icon: Shield, description: 'Generate SPF records', inputType: 'Domain details', free: true, category: 'email' },
    { id: 'header-analyzer', name: 'Header Analyzer', icon: Search, description: 'Email header analysis', inputType: 'Email headers', free: false, category: 'email' },
    { id: 'email-migration', name: 'Email Migration', icon: Server, description: 'IMAP email migration', inputType: 'IMAP details', free: false, category: 'email' }
  ];

  const filteredTools = tools.filter(tool => tool.category === activeCategory);
  const isDarkMode = activeCategory === 'web';

  return (
    <div className="flex flex-wrap gap-2 justify-start">
      {filteredTools.map((tool) => {
        const ToolIcon = tool.icon;
        const isSelected = selectedTool === tool.id;
        
        return (
          <Button
            key={tool.id}
            variant="outline"
            className={`
              min-w-[150px] max-w-[220px] h-[80px] p-3 
              flex flex-col items-start justify-center text-left
              transition-all duration-200 cursor-pointer
              ${isDarkMode 
                ? isSelected
                  ? 'bg-[#334155] border-[#cbd5e1] text-[#f1f5f9] shadow-sm'
                  : 'bg-[#1e293b] border-[#475569] text-[#e5e7eb] hover:bg-[#334155] hover:border-[#cbd5e1]'
                : isSelected 
                  ? 'bg-[#e9ecef] border-[#0d6efd] text-[#212529] shadow-sm' 
                  : 'bg-white border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:border-[#0d6efd]'
              }
            `}
            onClick={() => onToolSelect(tool.id)}
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <ToolIcon className={`w-4 h-4 flex-shrink-0 ${
                    isDarkMode 
                      ? isSelected ? 'text-[#cbd5e1]' : 'text-[#94a3b8]'
                      : isSelected ? 'text-[#0d6efd]' : 'text-[#6c757d]'
                  }`} />
                  <h4 className={`font-medium text-sm truncate ${
                    isDarkMode ? 'text-[#f1f5f9]' : 'text-[#212529]'
                  }`}>
                    {tool.name}
                  </h4>
                </div>
                {!tool.free && (
                  <Badge variant="outline" className={`text-xs ml-1 ${
                    isDarkMode 
                      ? 'border-[#475569] text-[#94a3b8]'
                      : 'border-[#dee2e6] text-[#6c757d]'
                  }`}>
                    Pro
                  </Badge>
                )}
              </div>
              <p className={`text-xs truncate ${
                isDarkMode ? 'text-[#94a3b8]' : 'text-[#6c757d]'
              }`}>
                {tool.inputType}
              </p>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default ToolSelector;
