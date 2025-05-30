
const generateToolResponse = (toolId: string, input: string, toolName: string): string => {
  const responses: Record<string, string | (() => string)> = {
    'blacklist': `Blacklist Check Results for ${input}:
✅ Spamhaus SBL: Not Listed
✅ Spamhaus CSS: Not Listed  
✅ Spamhaus PBL: Not Listed
✅ SURBL: Not Listed
✅ URIBL: Not Listed
✅ Barracuda: Not Listed
✅ SpamCop: Not Listed

Status: CLEAN - No blacklists detected`,

    'tcp': () => {
      const parts = input.split(':');
      const host = parts[0] || input;
      const port = parts[1] || '80';
      return `TCP Port Test Results for ${host}:${port}:

Connection Test: ✅ SUCCESS
Response Time: 23ms
Port Status: OPEN
Service Detection: HTTP/HTTPS Server
Banner Grab: "Server: nginx/1.18.0"

Network Path:
Hop 1: Local Gateway (192.168.1.1) - 2ms
Hop 2: ISP Router (10.0.0.1) - 15ms 
Hop 3: Target Host (${host}) - 23ms

Summary: Port ${port} is accessible and responding`;
    },

    'a': () => `A Record Lookup for ${input}:

Primary Records:
${input}    IN  A   93.184.216.34
${input}    IN  A   93.184.216.35

Additional Information:
TTL: 3600 seconds (1 hour)
Name Servers: ns1.${input}, ns2.${input}
DNSSEC: Signed
Query Time: 45ms
Authoritative: Yes

IPv4 Addresses Found: 2
Load Balancing: Active (Multiple A records detected)`,

    'spf': () => `SPF Record Analysis for ${input}:

SPF Record Found:
v=spf1 include:_spf.google.com include:mailgun.org ~all

Analysis Results:
✅ Valid SPF Syntax
✅ Proper Version Tag (v=spf1)
✅ Include Mechanisms: 2 found
✅ Soft Fail Policy (~all)
⚠️  Recommendation: Consider using hard fail (-all) for better security

Included Domains:
- _spf.google.com (Google Workspace)
- mailgun.org (Mailgun Service)

DNS Lookups: 3/10 (Within RFC limit)
Policy: SOFT FAIL - Suspicious emails marked but not rejected`,

    'txt': () => `TXT Records for ${input}:

Found 6 TXT Records:

1. SPF Record:
   "v=spf1 include:_spf.google.com include:mailgun.org ~all"

2. DMARC Policy:
   "v=DMARC1; p=quarantine; rua=mailto:dmarc@${input}"

3. DKIM Selector (google):
   "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKB..."

4. Domain Verification:
   "google-site-verification=abc123def456ghi789"

5. Microsoft Verification:
   "MS=ms12345678"

6. Custom TXT:
   "custom-verification-code=xyz789abc123"

Total Records: 6
DNSSEC Status: Signed and Validated`,

    'cname': () => `CNAME Record Lookup for ${input}:

CNAME Chain Analysis:
${input} → ${input}.cdn.cloudflare.net
${input}.cdn.cloudflare.net → target.example.com

Final Resolution:
Target: target.example.com
IP Address: 104.16.132.229
TTL: 300 seconds (5 minutes)

Chain Details:
Hop 1: ${input} (CNAME) → ${input}.cdn.cloudflare.net
Hop 2: ${input}.cdn.cloudflare.net (CNAME) → target.example.com
Hop 3: target.example.com (A) → 104.16.132.229

CDN Detection: Cloudflare
Chain Length: 2 hops (Normal)
Total Query Time: 67ms`,

    'soa': () => `SOA Record for ${input}:

Start of Authority (SOA) Record:
Primary Name Server: ns1.${input}
Responsible Email: admin.${input}
Serial Number: 2024053001
Refresh Interval: 3600 seconds (1 hour)
Retry Interval: 1800 seconds (30 minutes)
Expire Time: 1209600 seconds (14 days)
Minimum TTL: 86400 seconds (24 hours)

Zone Information:
Zone File Last Update: 2024-05-30 10:15:23 UTC
Next Refresh Due: In 47 minutes
Authority Status: Authoritative
DNSSEC: Enabled and Validated

Name Server Details:
Primary: ns1.${input} (195.154.228.5)
Secondary: ns2.${input} (195.154.228.6)`,

    'https': () => `HTTPS/SSL Certificate Test for ${input}:

SSL Certificate Information:
✅ Certificate Valid
✅ Certificate Chain Complete
✅ Strong Encryption (TLS 1.3)
✅ HSTS Header Present
✅ Perfect Forward Secrecy

Certificate Details:
Issued To: ${input}
Issued By: Let's Encrypt Authority X3
Valid From: 2024-03-15 00:00:00 UTC
Valid Until: 2024-06-13 23:59:59 UTC
Serial Number: 04:B2:F8:7A:9C:3D:E1:2F
Signature Algorithm: SHA256withRSA

Security Analysis:
Grade: A+
Protocol Support: TLS 1.2, TLS 1.3
Cipher Strength: 256-bit
Key Exchange: ECDHE (Perfect Forward Secrecy)
Vulnerability Scan: No known vulnerabilities

HSTS Policy: max-age=31536000; includeSubDomains`,

    'whois': () => `WHOIS Information for ${input}:

Domain Information:
Domain Name: ${input.toUpperCase()}
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.registrar-servers.com
Registrar URL: http://www.registrar.com
Updated Date: 2024-01-15T10:30:45Z
Creation Date: 2020-08-14T04:00:00Z
Registry Expiry Date: 2025-08-13T04:00:00Z
Registrar: Example Registrar, Inc.
Registrar IANA ID: 1234

Registrant Information:
Organization: Example Corporation
Country: US
State/Province: California
City: San Francisco
Postal Code: 94102

Administrative Contact:
Name: John Smith
Email: admin@${input}
Phone: +1.4155551234

Technical Contact:
Name: Tech Support
Email: tech@${input}
Phone: +1.4155555678

Name Servers:
ns1.${input}
ns2.${input}
ns3.cloudflare.com
ns4.cloudflare.com

Domain Status:
clientTransferProhibited
clientUpdateProhibited
clientDeleteProhibited

DNSSEC: signedDelegation

Last Updated: 2024-05-30T12:00:00Z
Query Time: 156ms`,

    'mx': `MX Records for ${input}:
Priority: 10    Mail Server: mail1.${input}
Priority: 20    Mail Server: mail2.${input}
Priority: 30    Mail Server: backup.${input}

Total MX Records Found: 3`,

    'ping': `Ping Results for ${input}:
PING ${input} (93.184.216.34): 56 data bytes
64 bytes from 93.184.216.34: icmp_seq=0 time=14.2ms
64 bytes from 93.184.216.34: icmp_seq=1 time=13.8ms
64 bytes from 93.184.216.34: icmp_seq=2 time=14.1ms
64 bytes from 93.184.216.34: icmp_seq=3 time=13.9ms

--- ${input} ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 13.8/14.0/14.2/0.2 ms`
  };

  const response = responses[toolId];
  if (typeof response === 'function') {
    return response();
  }
  
  return response || `Analysis completed for ${input}.\n\nThis is a simulated result for the ${toolName} tool.\nIn a real implementation, this would show actual diagnostic data.`;
};

export { generateToolResponse };
