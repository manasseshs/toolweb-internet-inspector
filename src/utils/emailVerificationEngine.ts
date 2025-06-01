
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
  // Basic syntax check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      email,
      status: 'invalid',
      confidence: 'high',
      smtp_response_message: 'Invalid email syntax',
      verification_attempts: 1,
      details: { syntax_valid: false }
    };
  }

  const provider = getEmailProvider(email);
  const config = getProviderConfig(provider);
  const domain = email.split('@')[1];

  console.log(`Provider detected: ${provider} for ${email}`);
  console.log(`Config:`, config);

  // Simulate multi-step verification for providers that always accept
  if (config.requiresMultiStep) {
    const attempts = [];
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      console.log(`Attempt ${attempt} for ${email}`);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (attempt > 1) {
        // Add retry delay
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      }

      const attemptResult = await simulateSingleVerification(email, domain, provider);
      attempts.push(attemptResult);
      
      // If we get a clear rejection, we can trust it
      if (attemptResult.responseCode !== '250') {
        console.log(`Got rejection on attempt ${attempt}: ${attemptResult.responseCode}`);
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
            provider_behavior: 'rejected_properly'
          }
        };
      }
    }

    // All attempts returned 250 OK - this is suspicious for Gmail/Outlook
    console.log(`All ${config.maxAttempts} attempts returned 250 OK for ${email} - marking as unconfirmed`);
    
    return {
      email,
      status: 'unconfirmed',
      confidence: 'low',
      provider,
      smtp_server: `mx.${domain}`,
      smtp_response_code: '250',
      smtp_response_message: `Valid? (Unconfirmed - ${provider.toUpperCase()} always accepts RCPT)`,
      verification_attempts: config.maxAttempts,
      details: {
        syntax_valid: true,
        mx_found: true,
        smtp_check: true,
        provider_behavior: 'always_accepts',
        reason: `${provider.toUpperCase()} provider detected - multiple 250 OK responses indicate potential false positive`
      }
    };
  }

  // Single verification for trusted providers
  console.log(`Single verification for trusted provider: ${provider}`);
  const singleResult = await simulateSingleVerification(email, domain, provider);
  
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
        provider_behavior: 'reliable'
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
        smtp_check: false
      }
    };
  }
};

const simulateSingleVerification = async (email: string, domain: string, provider: string): Promise<SingleVerificationResult> => {
  // Simulate verification delay
  await new Promise(resolve => setTimeout(resolve, 300));

  const random = Math.random();
  
  // Provider-specific simulation logic
  if (provider === 'gmail') {
    // Gmail almost always returns 250 OK (simulate the real-world problem)
    if (random < 0.95) {
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '250',
        responseMessage: 'OK'
      };
    } else {
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '550',
        responseMessage: 'Mailbox not found'
      };
    }
  }
  
  if (provider === 'outlook') {
    // Outlook also tends to accept most emails during SMTP handshake
    if (random < 0.9) {
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '250',
        responseMessage: 'OK'
      };
    } else {
      return {
        smtpServer: `mx.${domain}`,
        responseCode: '550',
        responseMessage: 'Mailbox not found'
      };
    }
  }
  
  // Yahoo and other providers - more reliable
  if (random < 0.7) {
    return {
      smtpServer: `mx.${domain}`,
      responseCode: '250',
      responseMessage: 'OK'
    };
  } else {
    return {
      smtpServer: `mx.${domain}`,
      responseCode: '550',
      responseMessage: 'Mailbox not found'
    };
  }
};
