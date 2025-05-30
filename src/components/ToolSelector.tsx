
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
    { id: 'tcp', name: 'TCP Port Test', icon: Server, description: 'Check if TCP port is open', inputType: 'IP:Port', free: true, category: 'network' },
    { id: 'ping', name: 'Ping Test', icon: Zap, description: 'ICMP latency test', inputType: 'IP address', free: true, category: 'network' },
    { id: 'trace', name: 'Traceroute', icon: Network, description: 'Network path tracing', inputType: 'IP address', free: false, category: 'network' },
    { id: 'geoip', name: 'GeoIP Lookup', icon: Globe, description: 'Geographic IP location', inputType: 'IP address', free: true, category: 'network' },

    // DNS & Domain Tools
    { id: 'a', name: 'A Record', icon: Globe, description: 'Main IP address lookup', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'mx', name: 'MX Record', icon: Mail, description: 'Email server records', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'spf', name: 'SPF Check', icon: Shield, description: 'SPF record verification', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'txt', name: 'TXT Records', icon: Globe, description: 'All TXT records', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'cname', name: 'CNAME Lookup', icon: Network, description: 'Alias records', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'soa', name: 'SOA Record', icon: Server, description: 'Authority record', inputType: 'Domain name', free: false, category: 'dns' },
    { id: 'dns', name: 'DNS Diagnostic', icon: Network, description: 'Complete DNS analysis', inputType: 'Domain name', free: false, category: 'dns' },
    { id: 'dnssec', name: 'DNSSEC Check', icon: Shield, description: 'DNSSEC validation', inputType: 'Domain name', free: false, category: 'dns' },
    { id: 'https', name: 'HTTPS Test', icon: Shield, description: 'SSL certificate test', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'whois', name: 'WHOIS Lookup', icon: Search, description: 'Domain registration data', inputType: 'Domain name', free: true, category: 'dns' },
    { id: 'propagation', name: 'DNS Propagation', icon: Globe, description: 'Global DNS propagation', inputType: 'Domain name', free: false, category: 'dns' },

    // Email Tools
    { id: 'smtp-test', name: 'SMTP Test', icon: Mail, description: 'Test SMTP authentication', inputType: 'SMTP details', free: true, category: 'email' },
    { id: 'email-validation', name: 'Email Validation', icon: Shield, description: 'Validate email addresses', inputType: 'Email address', free: true, category: 'email' },
    { id: 'deliverability', name: 'Email Deliverability', icon: Shield, description: 'SPF, DKIM, DMARC analysis', inputType: 'Domain name', free: false, category: 'email' },
    { id: 'spf-generator', name: 'SPF Generator', icon: Shield, description: 'Generate SPF records', inputType: 'Domain details', free: true, category: 'email' },
    { id: 'header-analyzer', name: 'Header Analyzer', icon: Search, description: 'Email header analysis', inputType: 'Email headers', free: false, category: 'email' },
    { id: 'email-migration', name: 'Email Migration', icon: Server, description: 'IMAP email migration', inputType: 'IMAP details', free: false, category: 'email' }
  ];

  const filteredTools = tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {filteredTools.map((tool) => {
        const ToolIcon = tool.icon;
        const isSelected = selectedTool === tool.id;
        
        return (
          <Button
            key={tool.id}
            variant="outline"
            className={`h-20 p-3 justify-start text-left border transition-all duration-200 ${
              isSelected 
                ? 'bg-[#e9ecef] border-[#0d6efd] text-[#212529] shadow-sm' 
                : 'bg-white border-[#dee2e6] text-[#212529] hover:bg-[#f8f9fa] hover:border-[#0d6efd]'
            }`}
            onClick={() => onToolSelect(tool.id)}
          >
            <div className="flex items-center space-x-2 w-full">
              <ToolIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-[#0d6efd]' : 'text-[#6c757d]'}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`font-medium text-sm truncate ${isSelected ? 'text-[#212529]' : 'text-[#212529]'}`}>
                    {tool.name}
                  </h4>
                  {!tool.free && (
                    <Badge variant="outline" className="text-xs ml-1 border-[#dee2e6] text-[#6c757d]">
                      Pro
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-[#6c757d] truncate">
                  {tool.inputType}
                </p>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};

export default ToolSelector;
