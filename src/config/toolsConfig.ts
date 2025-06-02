
export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  category: 'network' | 'dns' | 'email' | 'security' | 'monitoring';
  icon: string;
  inputType: string;
  inputPlaceholder: string;
  free: boolean;
  requiresAuth: boolean;
  planRequired?: 'free' | 'pro' | 'enterprise';
  dailyLimit?: {
    free: number;
    pro: number;
    enterprise: number;
  };
  features: string[];
  endpoint?: string;
  monitor?: boolean;
}

export const TOOLS_CONFIG: Record<string, ToolConfig> = {
  // Network Tools
  'blacklist-check': {
    id: 'blacklist-check',
    name: 'Blacklist Check',
    description: 'Check if IP address is listed on spam blacklists',
    category: 'network',
    icon: 'Shield',
    inputType: 'IP address',
    inputPlaceholder: '192.168.1.1',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 50, pro: 1000, enterprise: -1 },
    features: ['Multiple blacklist databases', 'Detailed reputation score', 'Historical tracking'],
    endpoint: '/api/tools/blacklist-check',
    monitor: true
  },
  'ptr-lookup': {
    id: 'ptr-lookup',
    name: 'PTR Lookup',
    description: 'Reverse DNS lookup for IP addresses',
    category: 'network',
    icon: 'Network',
    inputType: 'IP address',
    inputPlaceholder: '8.8.8.8',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 100, pro: 2000, enterprise: -1 },
    features: ['Reverse DNS resolution', 'PTR record validation', 'Bulk lookup support'],
    endpoint: '/api/tools/ptr-lookup'
  },
  'arin-lookup': {
    id: 'arin-lookup',
    name: 'ARIN Lookup',
    description: 'Get ASN, country and ISP information',
    category: 'network',
    icon: 'Globe',
    inputType: 'IP address',
    inputPlaceholder: '8.8.8.8',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 100, pro: 2000, enterprise: -1 },
    features: ['ASN information', 'Geolocation data', 'ISP details'],
    endpoint: '/api/tools/arin-lookup'
  },
  'tcp-port-test': {
    id: 'tcp-port-test',
    name: 'TCP Port Test',
    description: 'Check if TCP ports are open and accessible',
    category: 'network',
    icon: 'Server',
    inputType: 'IP/Domain:Port',
    inputPlaceholder: 'google.com:80',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 50, pro: 1000, enterprise: -1 },
    features: ['Port connectivity test', 'Response time measurement', 'Multiple port scanning'],
    endpoint: '/api/tools/tcp-port-test',
    monitor: true
  },
  'ping-test': {
    id: 'ping-test',
    name: 'Ping Test',
    description: 'ICMP ping test for latency measurement',
    category: 'network',
    icon: 'Zap',
    inputType: 'IP address or domain',
    inputPlaceholder: 'google.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 100, pro: 2000, enterprise: -1 },
    features: ['Latency measurement', 'Packet loss detection', 'Continuous monitoring'],
    endpoint: '/api/tools/ping-test',
    monitor: true
  },
  'traceroute': {
    id: 'traceroute',
    name: 'Traceroute',
    description: 'Network path tracing and hop analysis',
    category: 'network',
    icon: 'Network',
    inputType: 'IP address or domain',
    inputPlaceholder: 'google.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 20, pro: 500, enterprise: -1 },
    features: ['Network path visualization', 'Hop latency analysis', 'Route optimization'],
    endpoint: '/api/tools/traceroute'
  },
  'geoip-lookup': {
    id: 'geoip-lookup',
    name: 'GeoIP Lookup',
    description: 'Geographic location lookup for IP addresses',
    category: 'network',
    icon: 'Globe',
    inputType: 'IP address',
    inputPlaceholder: '8.8.8.8',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 100, pro: 2000, enterprise: -1 },
    features: ['Country and city location', 'ISP information', 'Timezone data'],
    endpoint: '/api/tools/geoip-lookup'
  },

  // DNS Tools
  'a-record': {
    id: 'a-record',
    name: 'A Record Lookup',
    description: 'Get IPv4 addresses for domain names',
    category: 'dns',
    icon: 'Globe',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 200, pro: 5000, enterprise: -1 },
    features: ['IPv4 address resolution', 'Multiple A records', 'TTL information'],
    endpoint: '/api/tools/a-record'
  },
  'mx-record': {
    id: 'mx-record',
    name: 'MX Record Lookup',
    description: 'Get mail server records for domains',
    category: 'dns',
    icon: 'Mail',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 200, pro: 5000, enterprise: -1 },
    features: ['Mail server discovery', 'Priority rankings', 'Mail routing analysis'],
    endpoint: '/api/tools/mx-record'
  },
  'txt-record': {
    id: 'txt-record',
    name: 'TXT Record Lookup',
    description: 'Get all TXT records for domains',
    category: 'dns',
    icon: 'Globe',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 200, pro: 5000, enterprise: -1 },
    features: ['SPF record detection', 'DKIM keys', 'Domain verification records'],
    endpoint: '/api/tools/txt-record'
  },
  'cname-lookup': {
    id: 'cname-lookup',
    name: 'CNAME Lookup',
    description: 'Get canonical name records',
    category: 'dns',
    icon: 'Network',
    inputType: 'Domain name',
    inputPlaceholder: 'www.example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 200, pro: 5000, enterprise: -1 },
    features: ['Alias resolution', 'CNAME chain following', 'Canonical mapping'],
    endpoint: '/api/tools/cname-lookup'
  },
  'soa-record': {
    id: 'soa-record',
    name: 'SOA Record Lookup',
    description: 'Get Start of Authority records',
    category: 'dns',
    icon: 'Server',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 200, pro: 5000, enterprise: -1 },
    features: ['Authority server info', 'Serial numbers', 'Refresh intervals'],
    endpoint: '/api/tools/soa-record'
  },
  'dns-diagnostic': {
    id: 'dns-diagnostic',
    name: 'DNS Diagnostic',
    description: 'Complete DNS health analysis',
    category: 'dns',
    icon: 'Network',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: false,
    requiresAuth: true,
    planRequired: 'pro',
    dailyLimit: { free: 0, pro: 100, enterprise: 1000 },
    features: ['Complete DNS audit', 'Performance analysis', 'Security recommendations'],
    endpoint: '/api/tools/dns-diagnostic'
  },
  'dnssec-check': {
    id: 'dnssec-check',
    name: 'DNSSEC Check',
    description: 'Validate DNSSEC implementation',
    category: 'dns',
    icon: 'Shield',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 100, pro: 2000, enterprise: -1 },
    features: ['DNSSEC validation', 'Chain of trust verification', 'Security status'],
    endpoint: '/api/tools/dnssec-check'
  },
  'whois-lookup': {
    id: 'whois-lookup',
    name: 'WHOIS Lookup',
    description: 'Get domain registration information',
    category: 'dns',
    icon: 'Search',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 50, pro: 1000, enterprise: -1 },
    features: ['Registration details', 'Expiration dates', 'Nameserver info'],
    endpoint: '/api/tools/whois-lookup'
  },
  'dns-propagation': {
    id: 'dns-propagation',
    name: 'DNS Propagation',
    description: 'Check global DNS propagation status',
    category: 'dns',
    icon: 'Globe',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 20, pro: 500, enterprise: -1 },
    features: ['Global server checking', 'Propagation mapping', 'TTL analysis'],
    endpoint: '/api/tools/dns-propagation'
  },

  // Email Tools
  'spf-check': {
    id: 'spf-check',
    name: 'SPF Check',
    description: 'Validate SPF records for domains',
    category: 'email',
    icon: 'Shield',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 100, pro: 2000, enterprise: -1 },
    features: ['SPF record validation', 'Syntax checking', 'Include chain analysis'],
    endpoint: '/api/tools/spf-check'
  },
  'smtp-test': {
    id: 'smtp-test',
    name: 'SMTP Test',
    description: 'Test SMTP server connectivity and auth',
    category: 'email',
    icon: 'Mail',
    inputType: 'SMTP details',
    inputPlaceholder: 'smtp.gmail.com:587',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 20, pro: 500, enterprise: -1 },
    features: ['SMTP connectivity test', 'Authentication validation', 'Security analysis'],
    endpoint: '/api/tools/smtp-test'
  },
  'email-validation': {
    id: 'email-validation',
    name: 'Email Validation',
    description: 'Bulk email address validation',
    category: 'email',
    icon: 'Shield',
    inputType: 'Email addresses',
    inputPlaceholder: 'test@example.com',
    free: true,
    requiresAuth: true,
    dailyLimit: { free: 10, pro: 100000, enterprise: 1000000 },
    features: ['Bulk validation', 'Deliverability scoring', 'Export results'],
    endpoint: '/api/tools/email-validation'
  },
  'email-deliverability': {
    id: 'email-deliverability',
    name: 'Email Deliverability',
    description: 'Comprehensive deliverability analysis',
    category: 'email',
    icon: 'Shield',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: false,
    requiresAuth: true,
    planRequired: 'pro',
    dailyLimit: { free: 0, pro: 100, enterprise: 1000 },
    features: ['SPF/DKIM/DMARC analysis', 'Reputation scoring', 'Improvement recommendations'],
    endpoint: '/api/tools/email-deliverability'
  },
  'spf-generator': {
    id: 'spf-generator',
    name: 'SPF Generator',
    description: 'Generate SPF records for domains',
    category: 'email',
    icon: 'Shield',
    inputType: 'Domain details',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 50, pro: 1000, enterprise: -1 },
    features: ['Interactive SPF builder', 'Validation included', 'Best practices'],
    endpoint: '/api/tools/spf-generator'
  },
  'header-analyzer': {
    id: 'header-analyzer',
    name: 'Email Header Analyzer',
    description: 'Analyze email headers for security',
    category: 'email',
    icon: 'Search',
    inputType: 'Email headers',
    inputPlaceholder: 'Paste email headers...',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 50, pro: 1000, enterprise: -1 },
    features: ['Security analysis', 'Route tracing', 'Authentication validation'],
    endpoint: '/api/tools/header-analyzer'
  },
  'email-migration': {
    id: 'email-migration',
    name: 'Email Migration',
    description: 'IMAP to IMAP email migration',
    category: 'email',
    icon: 'Server',
    inputType: 'IMAP details',
    inputPlaceholder: 'Source and destination servers',
    free: true,
    requiresAuth: true,
    dailyLimit: { free: 1, pro: 20, enterprise: 100 },
    features: ['IMAP migration', 'Progress tracking', 'Error handling'],
    endpoint: '/api/tools/email-migration'
  },

  // Security Tools
  'https-test': {
    id: 'https-test',
    name: 'SSL/HTTPS Test',
    description: 'SSL certificate and HTTPS analysis',
    category: 'security',
    icon: 'Shield',
    inputType: 'Domain name',
    inputPlaceholder: 'example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 100, pro: 2000, enterprise: -1 },
    features: ['SSL certificate validation', 'Security grade analysis', 'Expiration monitoring'],
    endpoint: '/api/tools/https-test',
    monitor: true
  },
  'malware-scanner': {
    id: 'malware-scanner',
    name: 'Malware Scanner',
    description: 'Scan websites for malware patterns',
    category: 'security',
    icon: 'Shield',
    inputType: 'URL or domain',
    inputPlaceholder: 'https://example.com',
    free: false,
    requiresAuth: true,
    planRequired: 'pro',
    dailyLimit: { free: 0, pro: 50, enterprise: 500 },
    features: ['Pattern-based detection', 'Security scoring', 'Threat identification'],
    endpoint: '/api/tools/malware-scanner'
  },
  'header-security': {
    id: 'header-security',
    name: 'HTTP Security Headers',
    description: 'Analyze HTTP security headers',
    category: 'security',
    icon: 'Shield',
    inputType: 'URL or domain',
    inputPlaceholder: 'https://example.com',
    free: true,
    requiresAuth: false,
    dailyLimit: { free: 100, pro: 2000, enterprise: -1 },
    features: ['Security header analysis', 'Compliance checking', 'Best practices'],
    endpoint: '/api/tools/header-security'
  }
};

export const getToolsByCategory = (category: string) => {
  return Object.values(TOOLS_CONFIG).filter(tool => tool.category === category);
};

export const getToolConfig = (toolId: string): ToolConfig | null => {
  return TOOLS_CONFIG[toolId] || null;
};

export const getUserToolAccess = (tool: ToolConfig, userPlan: string = 'free'): {
  canUse: boolean;
  reason?: string;
  upgradeRequired?: boolean;
} => {
  if (!tool.free && userPlan === 'free') {
    return {
      canUse: false,
      reason: 'This tool requires a Pro or Enterprise plan',
      upgradeRequired: true
    };
  }

  if (tool.planRequired && userPlan !== tool.planRequired && 
      !(tool.planRequired === 'pro' && userPlan === 'enterprise')) {
    return {
      canUse: false,
      reason: `This tool requires a ${tool.planRequired} plan`,
      upgradeRequired: true
    };
  }

  return { canUse: true };
};
