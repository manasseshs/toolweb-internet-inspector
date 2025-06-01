
export const toolIdToPath: Record<string, string> = {
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

export const pathToToolId: Record<string, string> = {
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

export const getToolIdFromPath = (pathname: string): string => {
  return pathToToolId[pathname] || '';
};

export const getPathFromToolId = (toolId: string): string => {
  return toolIdToPath[toolId] || `/tools/${toolId}`;
};
