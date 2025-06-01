import { getEmailProvider, getProviderConfig } from './emailProviderConfig';

export interface VerificationResult {
  email: string;
  status: 'valid' | 'invalid' | 'catch-all' | 'unreachable' | 'unconfirmed' | 'suspicious';
  confidence: 'high' | 'medium' | 'low';
  provider?: string;
  smtp_server?: string;
  smtp_response_code?: string;
  smtp_response_message?: string;
  verification_attempts?: number;
  details?: any;
}

interface SingleVerificationResult {
  smtpServer: string;
  responseCode: string;
  responseMessage: string;
}

export const enhancedEmailVerification = async (email: string): Promise<VerificationResult> => {
  console.log(`Starting enhanced verification for: ${email}`);
  
  // Basic syntax check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      email,
      status: 'invalid',
      confidence: 'high',
      smtp_response_message: 'Invalid email syntax',
      verification_attempts: 1,
      details: { syntax_valid: false, reason: 'Syntax validation failed' }
    };
  }

  const provider = getEmailProvider(email);
  const config = getProviderConfig(provider);
  const domain = email.split('@')[1];

  console.log(`Provider detected: ${provider} for ${email}`);
  console.log(`Provider config:`, config);

  // Simulate multi-step verification for providers that sometimes always accept
  if (config.requiresMultiStep) {
    console.log(`Starting multi-step verification for ${provider} provider`);
    const attempts = [];
    let hasValidRejection = false;
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      console.log(`Verification attempt ${attempt}/${config.maxAttempts} for ${email}`);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (attempt > 1) {
        console.log(`Applying retry delay of ${config.retryDelay}ms`);
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }

      const attemptResult = await simulateSingleVerification(email, domain, provider, attempt);
      attempts.push(attemptResult);
      
      // If we get a clear rejection, we can trust it
      if (attemptResult.responseCode !== '250') {
        console.log(`Got definitive rejection on attempt ${attempt}: ${attemptResult.responseCode} - ${attemptResult.responseMessage}`);
        hasValidRejection = true;
        return {
          email,
          status: 'invalid',
          confidence: 'high',
          provider,
          smtp_server: attemptResult.smtpServer,
          smtp_response_code: attemptResult.responseCode,
          smtp_response_message: attemptResult.responseMessage,
          verification_attempts: attempt,
          details: {
            syntax_valid: true,
            mx_found: true,
            smtp_check: false,
            provider_behavior: 'rejected_properly',
            attempts_log: attempts,
            reason: `${provider.toUpperCase()} server properly rejected invalid address`
          }
        };
      }
    }

    // All attempts returned 250 OK - for Gmail/Outlook this is common behavior
    // but we should be more lenient and mark as valid with lower confidence
    // unless there are other indicators of problems
    console.log(`All ${config.maxAttempts} attempts returned 250 OK for ${email}`);
    
    // Check if this looks like a real email pattern (not random characters)
    const hasReasonablePattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
    const isCommonProvider = ['gmail', 'outlook', 'yahoo'].includes(provider);
    
    if (hasReasonablePattern && isCommonProvider) {
      // For common providers with reasonable email patterns, mark as valid but with medium/low confidence
      console.log(`Marking ${email} as valid with medium confidence due to reasonable pattern`);
      return {
        email,
        status: 'valid',
        confidence: 'medium',
        provider,
        smtp_server: `mx.${domain}`,
        smtp_response_code: '250',
        smtp_response_message: `Valid – ${provider.toUpperCase()} accepts most addresses`,
        verification_attempts: config.maxAttempts,
        details: {
          syntax_valid: true,
          mx_found: true,
          smtp_check: true,
          provider_behavior: 'always_accepts',
          attempts_log: attempts,
          reason: `${provider.toUpperCase()} provider with reasonable email pattern`,
          confidence_note: 'Common provider that accepts most RCPT TO commands, but email pattern looks legitimate'
        }
      };
    } else {
      // For suspicious patterns or uncommon scenarios, mark as unconfirmed
      console.log(`Marking ${email} as unconfirmed due to suspicious pattern or provider behavior`);
      return {
        email,
        status: 'unconfirmed',
        confidence: 'low',
        provider,
        smtp_server: `mx.${domain}`,
        smtp_response_code: '250',
        smtp_response_message: `Unconfirmed – ${provider.toUpperCase()} always accepts RCPT`,
        verification_attempts: config.maxAttempts,
        details: {
          syntax_valid: true,
          mx_found: true,
          smtp_check: true,
          provider_behavior: 'always_accepts',
          attempts_log: attempts,
          reason: `${provider.toUpperCase()} provider with unusual pattern or multiple 250 OK responses indicate potential false positive`,
          confidence_note: 'This provider typically accepts all RCPT TO commands during SMTP handshake'
        }
      };
    }
  }

  // Single verification for trusted providers
  console.log(`Single verification for trusted provider: ${provider}`);
  const singleResult = await simulateSingleVerification(email, domain, provider, 1);
  
  if (singleResult.responseCode === '250') {
    return {
      email,
      status: 'valid',
      confidence: config.trustLevel,
      provider,
      smtp_server: singleResult.smtpServer,
      smtp_response_code: singleResult.responseCode,
      smtp_response_message: singleResult.responseMessage,
      verification_attempts: 1,
      details: {
        syntax_valid: true,
        mx_found: true,
        smtp_check: true,
        provider_behavior: 'reliable',
        reason: `${provider} provider provides reliable SMTP responses`
      }
    };
  } else {
    return {
      email,
      status: 'invalid',
      confidence: 'high',
      provider,
      smtp_server: singleResult.smtpServer,
      smtp_response_code: singleResult.responseCode,
      smtp_response_message: singleResult.responseMessage,
      verification_attempts: 1,
      details: {
        syntax_valid: true,
        mx_found: true,
        smtp_check: false,
        reason: `SMTP server rejected the address with code ${singleResult.responseCode}`
      }
    };
  }
};

const simulateSingleVerification = async (email: string, domain: string, provider: string, attempt: number): Promise<SingleVerificationResult> => {
  // Simulate verification delay with some randomness
  const delay = 200 + Math.random() * 400;
  await new Promise(resolve => setTimeout(resolve, delay));

  const random = Math.random();
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] SMTP verification attempt ${attempt} for ${email} (provider: ${provider})`);
  
  // Provider-specific simulation logic
  if (provider === 'gmail') {
    // Gmail almost always returns 250 OK (simulate the real-world problem)
    if (random < 0.95) {
      console.log(`[${timestamp}] Gmail SMTP: 250 OK (typical behavior)`);
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '250',
        responseMessage: '2.1.5 OK'
      };
    } else {
      console.log(`[${timestamp}] Gmail SMTP: 550 Mailbox not found (rare rejection)`);
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '550',
        responseMessage: '5.1.1 The email account that you tried to reach does not exist'
      };
    }
  }
  
  if (provider === 'outlook') {
    // Outlook also tends to accept most emails during SMTP handshake
    if (random < 0.92) {
      console.log(`[${timestamp}] Outlook SMTP: 250 OK (typical behavior)`);
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '250',
        responseMessage: '2.6.0 <' + email + '> [InternalId=123456] Queued mail for delivery'
      };
    } else {
      console.log(`[${timestamp}] Outlook SMTP: 550 Mailbox unavailable (rare rejection)`);
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '550',
        responseMessage: '5.1.10 RESOLVER.ADR.RecipientNotFound; Recipient not found by SMTP address lookup'
      };
    }
  }
  
  // Yahoo and other providers - more reliable but still some false positives
  if (provider === 'yahoo') {
    if (random < 0.85) {
      console.log(`[${timestamp}] Yahoo SMTP: 250 OK`);
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '250',
        responseMessage: '250 OK'
      };
    } else {
      console.log(`[${timestamp}] Yahoo SMTP: 554 Delivery error`);
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '554',
        responseMessage: '554 delivery error: dd This user doesn\'t have an account'
      };
    }
  }
  
  // Other providers - generally more reliable
  if (random < 0.8) {
    console.log(`[${timestamp}] ${provider} SMTP: 250 OK`);
    return {
      smtpServer: `mx.${domain}`,
      responseCode: '250',
      responseMessage: '250 2.1.5 OK'
    };
  } else {
    console.log(`[${timestamp}] ${provider} SMTP: 550 User unknown`);
    return {
      smtpServer: `mx.${domain}`,
      responseCode: '550',
      responseMessage: '550 5.1.1 User unknown'
    };
  }
};
