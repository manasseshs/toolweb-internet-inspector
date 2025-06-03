
export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: 'network' | 'dns' | 'email' | 'security' | 'monitoring';
  inputType: string;
  inputPlaceholder: string;
  features: string[];
  free: boolean;
  dailyLimit?: {
    free: number;
    pro: number;
    enterprise: number;
  };
  monitor?: boolean;
}

const tools: ToolConfig[] = [
  // Network Tools
  {
    id: 'blacklist-check',
    name: 'Blacklist Check',
    description: 'Check if an IP address is listed on spam blacklists',
    category: 'network',
    inputType: 'IP address',
    inputPlaceholder: 'Enter IP address (e.g., 8.8.8.8)',
    features: ['Spam blacklist check', 'Reputation scoring', 'Multiple databases'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  },
  {
    id: 'ptr-lookup',
    name: 'PTR Lookup',
    description: 'Reverse DNS lookup to find hostname from IP',
    category: 'network',
    inputType: 'IP address',
    inputPlaceholder: 'Enter IP address (e.g., 8.8.8.8)',
    features: ['Reverse DNS', 'Hostname resolution', 'Fast lookup'],
    free: true,
    dailyLimit: { free: 100, pro: 1000, enterprise: -1 }
  },
  {
    id: 'arin-lookup',
    name: 'ARIN Lookup',
    description: 'Get ASN, country, and provider information for IP',
    category: 'network',
    inputType: 'IP address',
    inputPlaceholder: 'Enter IP address (e.g., 8.8.8.8)',
    features: ['ASN lookup', 'Geolocation', 'Provider info'],
    free: true,
    dailyLimit: { free: 75, pro: 750, enterprise: -1 }
  },
  {
    id: 'tcp-port-test',
    name: 'TCP Port Test',
    description: 'Test if a TCP port is open on a host',
    category: 'network',
    inputType: 'Host:Port',
    inputPlaceholder: 'Enter host:port (e.g., google.com:80)',
    features: ['Port connectivity', 'Service detection', 'Response time'],
    free: true,
    dailyLimit: { free: 25, pro: 250, enterprise: -1 }
  },
  {
    id: 'ping-test',
    name: 'Ping Test',
    description: 'ICMP ping test to measure latency and packet loss',
    category: 'network',
    inputType: 'Host or IP',
    inputPlaceholder: 'Enter hostname or IP (e.g., google.com)',
    features: ['Latency measurement', 'Packet loss detection', 'Multiple packets'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  },
  {
    id: 'traceroute',
    name: 'Traceroute',
    description: 'Trace network path to destination',
    category: 'network',
    inputType: 'Host or IP',
    inputPlaceholder: 'Enter hostname or IP (e.g., google.com)',
    features: ['Network path tracing', 'Hop analysis', 'Latency per hop'],
    free: true,
    dailyLimit: { free: 25, pro: 250, enterprise: -1 }
  },
  {
    id: 'geoip-lookup',
    name: 'GeoIP Lookup',
    description: 'Get geographic location of an IP address',
    category: 'network',
    inputType: 'IP address',
    inputPlaceholder: 'Enter IP address (e.g., 8.8.8.8)',
    features: ['Geographic location', 'ISP information', 'Timezone data'],
    free: true,
    dailyLimit: { free: 100, pro: 1000, enterprise: -1 }
  },

  // DNS Tools
  {
    id: 'a-record',
    name: 'A Record Lookup',
    description: 'Get A records (IPv4 addresses) for a domain',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['IPv4 addresses', 'TTL values', 'Multiple records'],
    free: true,
    dailyLimit: { free: 100, pro: 1000, enterprise: -1 }
  },
  {
    id: 'mx-record',
    name: 'MX Record Lookup',
    description: 'Get mail exchange records for a domain',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['Mail servers', 'Priority levels', 'Email routing'],
    free: true,
    dailyLimit: { free: 100, pro: 1000, enterprise: -1 }
  },
  {
    id: 'txt-record',
    name: 'TXT Record Lookup',
    description: 'Get TXT records for a domain',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['Text records', 'SPF records', 'Verification tokens'],
    free: true,
    dailyLimit: { free: 100, pro: 1000, enterprise: -1 }
  },
  {
    id: 'cname-lookup',
    name: 'CNAME Lookup',
    description: 'Get CNAME (alias) records for a domain',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., www.example.com)',
    features: ['Alias resolution', 'Canonical names', 'Chain following'],
    free: true,
    dailyLimit: { free: 100, pro: 1000, enterprise: -1 }
  },
  {
    id: 'soa-record',
    name: 'SOA Record Lookup',
    description: 'Get Start of Authority record for a domain',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['Authority info', 'Serial numbers', 'Refresh intervals'],
    free: true,
    dailyLimit: { free: 100, pro: 1000, enterprise: -1 }
  },
  {
    id: 'dnssec-check',
    name: 'DNSSEC Validation',
    description: 'Validate DNSSEC signatures for a domain',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['DNSSEC validation', 'Chain of trust', 'Signature verification'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  },
  {
    id: 'whois-lookup',
    name: 'WHOIS Lookup',
    description: 'Get domain registration information',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['Registration details', 'Nameservers', 'Expiration dates'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  },
  {
    id: 'dns-propagation',
    name: 'DNS Propagation Check',
    description: 'Check DNS propagation across global servers',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['Global propagation', 'Multiple servers', 'Real-time status'],
    free: true,
    dailyLimit: { free: 25, pro: 250, enterprise: -1 }
  },
  {
    id: 'spf-check',
    name: 'SPF Record Check',
    description: 'Validate SPF records for email authentication',
    category: 'dns',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['SPF validation', 'Syntax checking', 'Include resolution'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  },

  // Email Tools
  {
    id: 'smtp-test',
    name: 'SMTP Test',
    description: 'Test SMTP server connectivity and authentication',
    category: 'email',
    inputType: 'SMTP server',
    inputPlaceholder: 'Enter SMTP server (e.g., smtp.gmail.com:587)',
    features: ['Connection test', 'Authentication', 'TLS support'],
    free: true,
    dailyLimit: { free: 25, pro: 250, enterprise: -1 }
  },
  {
    id: 'email-validation',
    name: 'Email Validation',
    description: 'Validate email address syntax and deliverability',
    category: 'email',
    inputType: 'Email address',
    inputPlaceholder: 'Enter email address (e.g., user@example.com)',
    features: ['Syntax validation', 'Domain verification', 'MX checking'],
    free: true,
    dailyLimit: { free: 100, pro: 1000, enterprise: -1 }
  },
  {
    id: 'email-deliverability',
    name: 'Email Deliverability',
    description: 'Analyze email deliverability with SPF, DKIM, DMARC',
    category: 'email',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['SPF check', 'DKIM validation', 'DMARC analysis'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  },
  {
    id: 'spf-generator',
    name: 'SPF Generator',
    description: 'Generate SPF records for email authentication',
    category: 'email',
    inputType: 'Domain configuration',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['SPF generation', 'Syntax validation', 'Best practices'],
    free: true,
    dailyLimit: { free: 25, pro: 250, enterprise: -1 }
  },
  {
    id: 'header-analyzer',
    name: 'Email Header Analyzer',
    description: 'Analyze email headers for routing and security',
    category: 'email',
    inputType: 'Email headers',
    inputPlaceholder: 'Paste email headers here...',
    features: ['Header parsing', 'Route analysis', 'Security checks'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  },
  {
    id: 'email-migration',
    name: 'Email Migration',
    description: 'IMAP-based email migration between providers',
    category: 'email',
    inputType: 'Migration details',
    inputPlaceholder: 'Configure migration settings...',
    features: ['IMAP migration', 'Folder mapping', 'Progress tracking'],
    free: false,
    dailyLimit: { free: 0, pro: 10, enterprise: 50 }
  },

  // Security Tools
  {
    id: 'https-test',
    name: 'HTTPS/SSL Test',
    description: 'Test SSL certificate and HTTPS configuration',
    category: 'security',
    inputType: 'Domain name',
    inputPlaceholder: 'Enter domain (e.g., example.com)',
    features: ['SSL validation', 'Certificate analysis', 'Security grading'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  },
  {
    id: 'header-security',
    name: 'Security Headers',
    description: 'Analyze HTTP security headers',
    category: 'security',
    inputType: 'URL',
    inputPlaceholder: 'Enter URL (e.g., https://example.com)',
    features: ['Header analysis', 'Security scoring', 'Recommendations'],
    free: true,
    dailyLimit: { free: 50, pro: 500, enterprise: -1 }
  }
];

export const getToolsByCategory = (category: string): ToolConfig[] => {
  return tools.filter(tool => tool.category === category);
};

export const getToolById = (id: string): ToolConfig | undefined => {
  return tools.find(tool => tool.id === id);
};

export const getUserToolAccess = (tool: ToolConfig, userPlan: string = 'free') => {
  const planHierarchy = { free: 0, pro: 1, enterprise: 2 };
  const userPlanLevel = planHierarchy[userPlan as keyof typeof planHierarchy] || 0;

  if (!tool.free && userPlanLevel === 0) {
    return {
      canUse: false,
      reason: 'This tool requires a Pro or Enterprise plan.',
      upgradeRequired: true
    };
  }

  if (tool.dailyLimit) {
    const limit = tool.dailyLimit[userPlan as keyof typeof tool.dailyLimit] || 0;
    if (limit === 0) {
      return {
        canUse: false,
        reason: 'This tool is not available on your current plan.',
        upgradeRequired: true
      };
    }
  }

  return {
    canUse: true,
    reason: '',
    upgradeRequired: false
  };
};
