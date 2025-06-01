
export const toolsInfo = {
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

export const getToolInfo = (toolId: string) => {
  return toolsInfo[toolId as keyof typeof toolsInfo] || { name: 'Unknown Tool', inputType: 'Input', free: true };
};
