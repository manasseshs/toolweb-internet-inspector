
interface ToolSEOConfig {
  title: string;
  description: string;
  keywords: string;
  h1: string;
  h2: string;
}

export const toolSEOConfig: Record<string, ToolSEOConfig> = {
  'blacklist': {
    title: 'IP Blacklist Check - Free Online Blacklist Scanner',
    description: 'Check if your IP address is blacklisted across 100+ spam databases. Free IP blacklist checker tool for email deliverability and server reputation monitoring.',
    keywords: 'IP blacklist check, spam blacklist checker, email deliverability, IP reputation, DNSBL check, RBL lookup',
    h1: 'IP Blacklist Check Tool',
    h2: 'Check Your IP Reputation Across Major Blacklists'
  },
  'ptr': {
    title: 'PTR Record Lookup - Reverse DNS Lookup Tool',
    description: 'Perform reverse DNS lookup to find PTR records for any IP address. Free PTR record checker for email server configuration and network diagnostics.',
    keywords: 'PTR lookup, reverse DNS, PTR record check, email server setup, DNS diagnostics, IP to domain',
    h1: 'PTR Record Lookup',
    h2: 'Reverse DNS Lookup for IP Addresses'
  },
  'arin': {
    title: 'ARIN WHOIS Lookup - IP Address Owner Information',
    description: 'Find IP address ownership, organization details, and network information using ARIN WHOIS database. Free IP owner lookup tool.',
    keywords: 'ARIN lookup, IP owner, WHOIS IP, network information, IP address details, internet registry',
    h1: 'ARIN IP Lookup Tool',
    h2: 'Find IP Address Ownership and Network Details'
  },
  'tcp': {
    title: 'TCP Port Checker - Online Port Testing Tool',
    description: 'Test TCP port connectivity and check if ports are open or closed. Free online port scanner for network troubleshooting and firewall testing.',
    keywords: 'port checker, TCP port test, open port scanner, network connectivity, firewall test, port status',
    h1: 'TCP Port Checker',
    h2: 'Test Network Port Connectivity'
  },
  'ping': {
    title: 'Online Ping Test - Network Connectivity Checker',
    description: 'Test network connectivity and measure response times with our online ping tool. Check server availability and network latency for free.',
    keywords: 'ping test, network connectivity, latency test, server response time, network diagnostics, online ping',
    h1: 'Online Ping Test Tool',
    h2: 'Test Network Connectivity and Response Times'
  },
  'trace': {
    title: 'Traceroute Tool - Network Path Tracing',
    description: 'Trace network path and identify routing issues with our online traceroute tool. Diagnose network connectivity problems for free.',
    keywords: 'traceroute, network path, routing diagnostics, network hops, connectivity troubleshooting, route tracing',
    h1: 'Online Traceroute Tool',
    h2: 'Trace Network Path and Routing'
  },
  'geoip': {
    title: 'GeoIP Lookup - IP Address Location Finder',
    description: 'Find geographic location, country, city, and ISP information for any IP address. Free GeoIP lookup tool for location tracking.',
    keywords: 'GeoIP lookup, IP location, IP geolocation, find IP location, IP address tracker, geographic lookup',
    h1: 'GeoIP Location Lookup',
    h2: 'Find Geographic Location of IP Addresses'
  },
  'a': {
    title: 'A Record Lookup - DNS A Record Checker',
    description: 'Look up A records for any domain name. Check DNS A record configuration and IP address mapping for domain troubleshooting.',
    keywords: 'A record lookup, DNS A record, domain IP address, DNS checker, domain resolution, DNS diagnostics',
    h1: 'A Record Lookup Tool',
    h2: 'Check DNS A Records for Domains'
  },
  'mx': {
    title: 'MX Record Lookup - Email Server DNS Checker',
    description: 'Check MX records for email server configuration. Free MX record lookup tool for email troubleshooting and mail server diagnostics.',
    keywords: 'MX record lookup, email server, mail server DNS, email configuration, MX record checker, email delivery',
    h1: 'MX Record Lookup Tool',
    h2: 'Check Email Server DNS Configuration'
  },
  'spf': {
    title: 'SPF Record Checker - Email Authentication Validator',
    description: 'Validate SPF records for email authentication and anti-spam protection. Free SPF record checker and validation tool.',
    keywords: 'SPF checker, SPF record validation, email authentication, anti-spam, SPF syntax check, email security',
    h1: 'SPF Record Checker',
    h2: 'Validate Email Authentication SPF Records'
  },
  'txt': {
    title: 'TXT Record Lookup - DNS TXT Record Checker',
    description: 'Look up DNS TXT records for domain verification, SPF, DKIM, and other domain configurations. Free TXT record lookup tool.',
    keywords: 'TXT record lookup, DNS TXT, domain verification, SPF DKIM records, DNS text records, domain configuration',
    h1: 'TXT Record Lookup Tool',
    h2: 'Check DNS TXT Records for Domains'
  },
  'cname': {
    title: 'CNAME Lookup - DNS Alias Record Checker',
    description: 'Check CNAME records and DNS aliases for domain configuration. Free CNAME lookup tool for DNS troubleshooting.',
    keywords: 'CNAME lookup, DNS alias, CNAME record checker, domain alias, DNS CNAME, subdomain configuration',
    h1: 'CNAME Record Lookup',
    h2: 'Check DNS Alias Records'
  },
  'soa': {
    title: 'SOA Record Lookup - DNS Authority Record Checker',
    description: 'Check SOA (Start of Authority) records for DNS zone configuration. Free SOA record lookup for domain authority verification.',
    keywords: 'SOA record lookup, DNS authority, zone configuration, DNS SOA, domain authority, nameserver check',
    h1: 'SOA Record Lookup Tool',
    h2: 'Check DNS Start of Authority Records'
  },
  'dns': {
    title: 'DNS Diagnostic Tool - Complete DNS Analysis',
    description: 'Comprehensive DNS diagnostic tool for complete domain analysis. Check all DNS records and identify configuration issues.',
    keywords: 'DNS diagnostic, DNS analysis, complete DNS check, DNS troubleshooting, domain diagnostics, DNS health check',
    h1: 'Complete DNS Diagnostic Tool',
    h2: 'Comprehensive Domain DNS Analysis'
  },
  'dnssec': {
    title: 'DNSSEC Checker - DNS Security Validation',
    description: 'Validate DNSSEC configuration and check DNS security extensions. Free DNSSEC checker for domain security verification.',
    keywords: 'DNSSEC checker, DNS security, DNSSEC validation, secure DNS, DNS integrity, domain security',
    h1: 'DNSSEC Security Checker',
    h2: 'Validate DNS Security Extensions'
  },
  'https': {
    title: 'HTTPS SSL Checker - Website Security Test',
    description: 'Test HTTPS configuration and SSL certificate validity. Free SSL checker for website security and certificate diagnostics.',
    keywords: 'HTTPS checker, SSL test, certificate validation, website security, SSL diagnostics, TLS checker',
    h1: 'HTTPS SSL Security Checker',
    h2: 'Test Website SSL Certificate and Security'
  },
  'whois': {
    title: 'WHOIS Lookup - Domain Registration Information',
    description: 'Look up domain registration details, owner information, and expiration dates. Free WHOIS domain lookup tool.',
    keywords: 'WHOIS lookup, domain registration, domain owner, domain expiration, domain information, registrar details',
    h1: 'WHOIS Domain Lookup',
    h2: 'Find Domain Registration Information'
  },
  'propagation': {
    title: 'DNS Propagation Checker - Global DNS Status',
    description: 'Check DNS propagation status worldwide. Monitor DNS changes and verify global DNS record updates across multiple locations.',
    keywords: 'DNS propagation, DNS checker, global DNS, DNS update status, nameserver propagation, DNS changes',
    h1: 'DNS Propagation Checker',
    h2: 'Monitor Global DNS Propagation Status'
  },
  'smtp-test': {
    title: 'SMTP Test Tool - Email Server Connectivity',
    description: 'Test SMTP server connectivity and email delivery. Free SMTP testing tool for mail server configuration and troubleshooting.',
    keywords: 'SMTP test, email server test, mail server connectivity, SMTP configuration, email delivery test, mail server diagnostics',
    h1: 'SMTP Server Test Tool',
    h2: 'Test Email Server Connectivity'
  },
  'email-validation': {
    title: 'Email Verification Tool - Bulk Email Validator',
    description: 'Verify email addresses in bulk and check email deliverability. Professional email validation service for clean mailing lists.',
    keywords: 'email verification, email validation, bulk email checker, email deliverability, verify email addresses, email list cleaning',
    h1: 'Email Verification Tool',
    h2: 'Validate Email Addresses and Deliverability'
  },
  'deliverability': {
    title: 'Email Deliverability Test - Inbox Placement Checker',
    description: 'Test email deliverability and check inbox placement rates. Analyze email reputation and spam score for better delivery.',
    keywords: 'email deliverability, inbox placement, spam score, email reputation, delivery rate, email marketing',
    h1: 'Email Deliverability Tester',
    h2: 'Test Inbox Placement and Email Reputation'
  },
  'spf-generator': {
    title: 'SPF Record Generator - Email Authentication Setup',
    description: 'Generate SPF records for email authentication and anti-spam protection. Free SPF record generator with validation.',
    keywords: 'SPF generator, SPF record creator, email authentication setup, anti-spam configuration, SPF builder, email security',
    h1: 'SPF Record Generator',
    h2: 'Create Email Authentication SPF Records'
  },
  'header-analyzer': {
    title: 'Email Header Analyzer - Email Diagnostic Tool',
    description: 'Analyze email headers for delivery issues and authentication problems. Professional email header analysis tool.',
    keywords: 'email header analyzer, email diagnostics, header analysis, email troubleshooting, email authentication check, delivery analysis',
    h1: 'Email Header Analyzer',
    h2: 'Analyze Email Headers and Delivery Path'
  },
  'email-migration': {
    title: 'Email Migration Tool - IMAP Email Transfer',
    description: 'Migrate emails between servers with our secure IMAP transfer tool. Professional email migration service for businesses.',
    keywords: 'email migration, IMAP transfer, email server migration, mailbox migration, email backup, email transfer tool',
    h1: 'Email Migration Tool',
    h2: 'Secure Email Server Migration'
  }
};
