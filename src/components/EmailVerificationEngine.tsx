
import React from 'react';

interface EmailVerificationResult {
  email: string;
  status: 'valid' | 'invalid' | 'catch-all' | 'unreachable' | 'unconfirmed';
  confidence: 'high' | 'medium' | 'low' | 'suspected';
  smtp_server?: string;
  smtp_response_code?: string;
  smtp_response_message?: string;
  debug_info?: {
    mx_record: string;
    attempt_count: number;
    response_time: number;
    server_behavior: string;
    domain_flags: string[];
    retry_results?: string[];
  };
  notes?: string;
}

interface DomainHeuristics {
  domain: string;
  is_catch_all_suspected: boolean;
  accepts_all_rcpt: boolean;
  server_type: 'cpanel' | 'gmail' | 'hotmail' | 'generic' | 'unknown';
  reputation_score: number;
}

class EmailVerificationEngine {
  private domainCache: Map<string, DomainHeuristics> = new Map();
  private knownCatchAllPatterns = [
    /mail\..*\.com\.br$/i,
    /mx\..*\.hostgator\./i,
    /mx\..*\.godaddy\./i,
    /.*\.cpanel\./i,
    /.*\.exim\./i
  ];

  private gmailPatterns = [
    /gmail-smtp-in\.l\.google\.com$/i,
    /aspmx.*\.googlemail\.com$/i,
    /alt.*\.aspmx\.l\.google\.com$/i
  ];

  private hotmailPatterns = [
    /.*\.hotmail\.com$/i,
    /.*\.outlook\.com$/i,
    /.*\.protection\.outlook\.com$/i
  ];

  async verifyEmail(email: string, enableContentProbe: boolean = false): Promise<EmailVerificationResult> {
    const domain = email.split('@')[1];
    const startTime = Date.now();
    
    // Basic syntax validation
    if (!this.isValidSyntax(email)) {
      return {
        email,
        status: 'invalid',
        confidence: 'high',
        smtp_response_message: 'Invalid email syntax',
        debug_info: {
          mx_record: 'N/A',
          attempt_count: 0,
          response_time: Date.now() - startTime,
          server_behavior: 'syntax_error',
          domain_flags: ['invalid_format']
        },
        notes: 'Failed basic syntax validation'
      };
    }

    // Get or create domain heuristics
    let domainInfo = this.domainCache.get(domain);
    if (!domainInfo) {
      domainInfo = await this.analyzeDomain(domain);
      this.domainCache.set(domain, domainInfo);
    }

    // Simulate MX lookup and SMTP connection
    const mxRecord = await this.getMXRecord(domain);
    if (!mxRecord) {
      return {
        email,
        status: 'invalid',
        confidence: 'high',
        smtp_response_message: 'No MX record found',
        debug_info: {
          mx_record: 'Not found',
          attempt_count: 1,
          response_time: Date.now() - startTime,
          server_behavior: 'no_mx',
          domain_flags: ['no_mx_record']
        },
        notes: 'Domain has no mail exchange records'
      };
    }

    // Perform SMTP verification with retries and delays
    const verificationResult = await this.performSMTPVerification(
      email, 
      mxRecord, 
      domainInfo,
      enableContentProbe
    );

    verificationResult.debug_info!.response_time = Date.now() - startTime;
    return verificationResult;
  }

  private isValidSyntax(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private async getMXRecord(domain: string): Promise<string | null> {
    // Simulate MX lookup with realistic delays
    await this.delay(100 + Math.random() * 200);
    
    // Simulate some domains not having MX records
    if (Math.random() < 0.05) {
      return null;
    }
    
    return `mx.${domain}`;
  }

  private async analyzeDomain(domain: string): Promise<DomainHeuristics> {
    await this.delay(50 + Math.random() * 100);
    
    let serverType: DomainHeuristics['server_type'] = 'unknown';
    let reputationScore = 0.7; // Default reputation
    
    // Detect server type based on domain patterns
    if (this.gmailPatterns.some(pattern => pattern.test(domain))) {
      serverType = 'gmail';
      reputationScore = 0.9;
    } else if (this.hotmailPatterns.some(pattern => pattern.test(domain))) {
      serverType = 'hotmail';
      reputationScore = 0.85;
    } else if (this.knownCatchAllPatterns.some(pattern => pattern.test(domain))) {
      serverType = 'cpanel';
      reputationScore = 0.4;
    }

    return {
      domain,
      is_catch_all_suspected: serverType === 'cpanel',
      accepts_all_rcpt: serverType === 'cpanel',
      server_type: serverType,
      reputation_score: reputationScore
    };
  }

  private async performSMTPVerification(
    email: string,
    mxRecord: string,
    domainInfo: DomainHeuristics,
    enableContentProbe: boolean
  ): Promise<EmailVerificationResult> {
    const maxAttempts = domainInfo.server_type === 'gmail' || domainInfo.server_type === 'hotmail' ? 3 : 1;
    const retryResults: string[] = [];
    let finalResult: EmailVerificationResult | null = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (attempt > 1) {
        // Use random delays for Gmail/Hotmail
        const delay = (domainInfo.server_type === 'gmail' || domainInfo.server_type === 'hotmail') 
          ? 2000 + Math.random() * 3000 
          : 500 + Math.random() * 1000;
        await this.delay(delay);
      }

      const result = await this.simulateSMTPConnection(email, mxRecord, domainInfo, enableContentProbe, attempt);
      retryResults.push(`Attempt ${attempt}: ${result.smtp_response_code} - ${result.smtp_response_message}`);
      
      if (attempt === maxAttempts || this.isDefinitiveResult(result, domainInfo)) {
        finalResult = result;
        break;
      }
    }

    if (!finalResult) {
      throw new Error('No result obtained from SMTP verification');
    }

    finalResult.debug_info!.retry_results = retryResults;
    finalResult.debug_info!.attempt_count = retryResults.length;
    
    return finalResult;
  }

  private async simulateSMTPConnection(
    email: string,
    mxRecord: string,
    domainInfo: DomainHeuristics,
    enableContentProbe: boolean,
    attempt: number
  ): Promise<EmailVerificationResult> {
    const domain = email.split('@')[1];
    
    // Simulate network delay
    await this.delay(300 + Math.random() * 500);

    // Server-specific behavior simulation
    switch (domainInfo.server_type) {
      case 'cpanel':
        return this.simulateCPanelBehavior(email, mxRecord, enableContentProbe);
      
      case 'gmail':
        return this.simulateGmailBehavior(email, mxRecord, attempt);
      
      case 'hotmail':
        return this.simulateHotmailBehavior(email, mxRecord, attempt);
      
      default:
        return this.simulateGenericSMTPBehavior(email, mxRecord, domainInfo);
    }
  }

  private simulateCPanelBehavior(
    email: string,
    mxRecord: string,
    enableContentProbe: boolean
  ): EmailVerificationResult {
    const domain = email.split('@')[1];
    
    // cPanel/Exim typically accepts all RCPT TO commands
    if (!enableContentProbe) {
      return {
        email,
        status: 'unconfirmed',
        confidence: 'suspected',
        smtp_server: mxRecord,
        smtp_response_code: '250',
        smtp_response_message: '2.1.5 Recipient OK',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: 1,
          response_time: 0,
          server_behavior: 'accepts_all_rcpt',
          domain_flags: ['catch_all_suspected', 'cpanel_exim']
        },
        notes: 'Server accepts all RCPT commands. Marked as Unconfirmed Valid'
      };
    }

    // With content probe enabled, we can sometimes detect non-existent mailboxes
    const actuallyExists = Math.random() > 0.7; // 30% chance it actually exists
    
    if (actuallyExists) {
      return {
        email,
        status: 'valid',
        confidence: 'medium',
        smtp_server: mxRecord,
        smtp_response_code: '250',
        smtp_response_message: '2.1.5 Recipient OK - Content probe successful',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: 1,
          response_time: 0,
          server_behavior: 'content_probe_success',
          domain_flags: ['cpanel_exim', 'content_verified']
        },
        notes: 'Content probe confirmed mailbox existence'
      };
    } else {
      return {
        email,
        status: 'invalid',
        confidence: 'high',
        smtp_server: mxRecord,
        smtp_response_code: '550',
        smtp_response_message: '5.1.1 User unknown - Content probe detected no mailbox',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: 1,
          response_time: 0,
          server_behavior: 'content_probe_failed',
          domain_flags: ['cpanel_exim', 'user_unknown']
        },
        notes: 'Content probe revealed mailbox does not exist'
      };
    }
  }

  private simulateGmailBehavior(email: string, mxRecord: string, attempt: number): EmailVerificationResult {
    const random = Math.random();
    
    // Gmail's aggressive protection - first attempts often get temporary failures
    if (attempt === 1 && random < 0.4) {
      return {
        email,
        status: 'unreachable',
        confidence: 'low',
        smtp_server: mxRecord,
        smtp_response_code: '421',
        smtp_response_message: '4.7.0 Try again later - Gmail rate limiting',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: attempt,
          response_time: 0,
          server_behavior: 'gmail_rate_limit',
          domain_flags: ['gmail', 'rate_limited', 'retry_needed']
        },
        notes: 'Gmail rate limiting detected, retry recommended'
      };
    }

    // Gmail sometimes accepts invalid addresses due to aliasing complexity
    if (random < 0.15) {
      return {
        email,
        status: 'unconfirmed',
        confidence: 'suspected',
        smtp_server: mxRecord,
        smtp_response_code: '250',
        smtp_response_message: '2.1.5 OK - Gmail alias handling unclear',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: attempt,
          response_time: 0,
          server_behavior: 'gmail_alias_uncertainty',
          domain_flags: ['gmail', 'alias_complexity']
        },
        notes: 'Gmail accepted address but aliasing rules make verification uncertain'
      };
    }

    // Normal Gmail validation
    const isValid = random > 0.3;
    return {
      email,
      status: isValid ? 'valid' : 'invalid',
      confidence: isValid ? 'high' : 'high',
      smtp_server: mxRecord,
      smtp_response_code: isValid ? '250' : '550',
      smtp_response_message: isValid 
        ? '2.1.5 OK - Gmail validation successful'
        : '5.1.1 The email account that you tried to reach does not exist',
      debug_info: {
        mx_record: mxRecord,
        attempt_count: attempt,
        response_time: 0,
        server_behavior: 'gmail_standard',
        domain_flags: ['gmail', 'validated']
      },
      notes: isValid ? 'Gmail validation successful' : 'Gmail confirmed mailbox does not exist'
    };
  }

  private simulateHotmailBehavior(email: string, mxRecord: string, attempt: number): EmailVerificationResult {
    const random = Math.random();
    
    // Microsoft's protection - similar to Gmail but different patterns
    if (attempt === 1 && random < 0.35) {
      return {
        email,
        status: 'unreachable',
        confidence: 'low',
        smtp_server: mxRecord,
        smtp_response_code: '450',
        smtp_response_message: '4.3.2 Service temporarily unavailable - Microsoft protection',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: attempt,
          response_time: 0,
          server_behavior: 'microsoft_protection',
          domain_flags: ['hotmail', 'protection_active', 'retry_needed']
        },
        notes: 'Microsoft protection triggered, retry recommended'
      };
    }

    // Hotmail can accept invalid addresses
    if (random < 0.12) {
      return {
        email,
        status: 'unconfirmed',
        confidence: 'suspected',
        smtp_server: mxRecord,
        smtp_response_code: '250',
        smtp_response_message: '2.6.0 Message accepted - Verification uncertain',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: attempt,
          response_time: 0,
          server_behavior: 'hotmail_uncertain',
          domain_flags: ['hotmail', 'verification_unclear']
        },
        notes: 'Hotmail accepted but verification confidence is low'
      };
    }

    // Standard Hotmail behavior
    const isValid = random > 0.25;
    return {
      email,
      status: isValid ? 'valid' : 'invalid',
      confidence: isValid ? 'high' : 'high',
      smtp_server: mxRecord,
      smtp_response_code: isValid ? '250' : '550',
      smtp_response_message: isValid 
        ? '2.6.0 Message accepted for delivery'
        : '5.1.1 Recipient address rejected: User unknown',
      debug_info: {
        mx_record: mxRecord,
        attempt_count: attempt,
        response_time: 0,
        server_behavior: 'hotmail_standard',
        domain_flags: ['hotmail', 'validated']
      },
      notes: isValid ? 'Hotmail validation successful' : 'Hotmail confirmed mailbox does not exist'
    };
  }

  private simulateGenericSMTPBehavior(
    email: string,
    mxRecord: string,
    domainInfo: DomainHeuristics
  ): EmailVerificationResult {
    const random = Math.random();
    const adjustedProbability = random * domainInfo.reputation_score;
    
    if (adjustedProbability > 0.7) {
      return {
        email,
        status: 'valid',
        confidence: 'high',
        smtp_server: mxRecord,
        smtp_response_code: '250',
        smtp_response_message: '2.1.5 Recipient OK',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: 1,
          response_time: 0,
          server_behavior: 'standard_validation',
          domain_flags: ['generic_smtp']
        },
        notes: 'Standard SMTP validation successful'
      };
    } else if (adjustedProbability > 0.15) {
      return {
        email,
        status: 'invalid',
        confidence: 'high',
        smtp_server: mxRecord,
        smtp_response_code: '550',
        smtp_response_message: '5.1.1 User unknown',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: 1,
          response_time: 0,
          server_behavior: 'user_not_found',
          domain_flags: ['generic_smtp']
        },
        notes: 'SMTP server confirmed mailbox does not exist'
      };
    } else {
      return {
        email,
        status: 'unreachable',
        confidence: 'medium',
        smtp_server: mxRecord,
        smtp_response_code: '421',
        smtp_response_message: '4.3.0 Mail system temporarily unavailable',
        debug_info: {
          mx_record: mxRecord,
          attempt_count: 1,
          response_time: 0,
          server_behavior: 'temporary_failure',
          domain_flags: ['generic_smtp', 'temp_unavailable']
        },
        notes: 'Temporary server issue, verification inconclusive'
      };
    }
  }

  private isDefinitiveResult(result: EmailVerificationResult, domainInfo: DomainHeuristics): boolean {
    // For Gmail/Hotmail, only trust results with high confidence
    if (domainInfo.server_type === 'gmail' || domainInfo.server_type === 'hotmail') {
      return result.confidence === 'high';
    }
    
    // For other servers, most results are definitive
    return result.smtp_response_code !== '421' && result.smtp_response_code !== '450';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export { EmailVerificationEngine };
export type { EmailVerificationResult, DomainHeuristics };
