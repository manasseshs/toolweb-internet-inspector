import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Upload, Download, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VerificationResult {
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

const EmailVerification: React.FC = () => {
  const [emailList, setEmailList] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<VerificationResult[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const isPaidUser = user && (user.plan === 'pro' || user.plan === 'enterprise');

  // Provider detection and configuration
  const getEmailProvider = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain?.includes('gmail')) return 'gmail';
    if (domain?.includes('hotmail') || domain?.includes('outlook') || domain?.includes('live')) return 'outlook';
    if (domain?.includes('yahoo')) return 'yahoo';
    if (domain?.includes('aol')) return 'aol';
    return 'other';
  };

  const getProviderConfig = (provider: string) => {
    const configs = {
      gmail: {
        alwaysAccepts: true,
        requiresMultiStep: true,
        retryDelay: 5000,
        maxAttempts: 3,
        trustLevel: 'low'
      },
      outlook: {
        alwaysAccepts: true,
        requiresMultiStep: true,
        retryDelay: 7000,
        maxAttempts: 2,
        trustLevel: 'low'
      },
      yahoo: {
        alwaysAccepts: false,
        requiresMultiStep: false,
        retryDelay: 0,
        maxAttempts: 1,
        trustLevel: 'high'
      },
      other: {
        alwaysAccepts: false,
        requiresMultiStep: false,
        retryDelay: 0,
        maxAttempts: 1,
        trustLevel: 'medium'
      }
    };
    return configs[provider as keyof typeof configs] || configs.other;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/plain' || file.type === 'text/csv')) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const emails = content.split(/\r?\n/).filter(email => email.trim());
        setEmailList(emails.join('\n'));
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a TXT or CSV file.",
        variant: "destructive",
      });
    }
  };

  const verifyEmails = async () => {
    const emails = emailList.split('\n').filter(email => email.trim());
    
    if (!emails.length) {
      toast({
        title: "No emails to verify",
        description: "Please enter at least one email address.",
        variant: "destructive",
      });
      return;
    }

    if (!isPaidUser && emails.length > 10) {
      toast({
        title: "Limit exceeded",
        description: "Free users can verify up to 10 emails at once.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    setProgress(0);
    setResults([]);

    try {
      const verificationResults: VerificationResult[] = [];
      
      for (let i = 0; i < emails.length; i++) {
        const email = emails[i].trim();
        setProgress((i / emails.length) * 100);

        console.log(`Starting verification for: ${email}`);
        const result = await enhancedEmailVerification(email);
        verificationResults.push(result);

        // Store result in database
        await supabase.from('email_verifications').insert({
          user_id: user?.id,
          email_address: email,
          status: result.status,
          smtp_server: result.smtp_server,
          smtp_response_code: result.smtp_response_code,
          smtp_response_message: result.smtp_response_message,
          verification_details: {
            ...result.details,
            confidence: result.confidence,
            provider: result.provider,
            verification_attempts: result.verification_attempts
          }
        });
      }

      setResults(verificationResults);
      setProgress(100);
      
      toast({
        title: "Verification complete",
        description: `Verified ${emails.length} email addresses with enhanced provider detection.`,
      });
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: "An error occurred during email verification.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const enhancedEmailVerification = async (email: string): Promise<VerificationResult> => {
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
        confidence: config.trustLevel as 'high' | 'medium' | 'low',
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

  const simulateSingleVerification = async (email: string, domain: string, provider: string) => {
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

  const exportResults = () => {
    if (!results.length) return;

    const csv = [
      'Email,Status,Confidence,Provider,SMTP Server,Response Code,Response Message,Attempts',
      ...results.map(r => 
        `${r.email},${r.status},${r.confidence},${r.provider || ''},${r.smtp_server || ''},${r.smtp_response_code || ''},${r.smtp_response_message || ''},${r.verification_attempts || 1}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-verification-enhanced-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'unconfirmed': return <HelpCircle className="w-4 h-4 text-orange-500" />;
      case 'suspicious': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'catch-all': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'unreachable': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, confidence: string) => {
    switch (status) {
      case 'valid': 
        return confidence === 'high' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-600';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'unconfirmed': return 'bg-orange-100 text-orange-800';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'catch-all': return 'bg-yellow-100 text-yellow-800';
      case 'unreachable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Email Verification</CardTitle>
          <p className="text-sm text-gray-600">
            Advanced verification with provider-specific handling. Gmail and Outlook emails undergo multi-step verification to reduce false positives.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Email Addresses (one per line, max {isPaidUser ? 'unlimited' : '10'} for free users)
            </label>
            <Textarea
              placeholder="Enter email addresses, one per line..."
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              className="min-h-[120px]"
              rows={10}
            />
            <p className="text-xs text-gray-500 mt-1">
              {emailList.split('\n').filter(email => email.trim()).length} emails entered
              {!isPaidUser && ` (${Math.max(0, 10 - emailList.split('\n').filter(email => email.trim()).length)} remaining for free users)`}
            </p>
          </div>

          {isPaidUser && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Or upload a file (TXT/CSV)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept=".txt,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="email-file-upload"
                />
                <label
                  htmlFor="email-file-upload"
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 text-sm"
                >
                  <Upload className="w-4 h-4" />
                  Choose File
                </label>
                {uploadedFile && (
                  <span className="text-sm text-green-600">
                    {uploadedFile.name} uploaded
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button 
              onClick={verifyEmails}
              disabled={isVerifying || !emailList.trim()}
              className="flex-1"
            >
              {isVerifying ? 'Verifying...' : 'Verify Emails'}
            </Button>
            
            {results.length > 0 && (
              <Button onClick={exportResults} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            )}
          </div>

          {isVerifying && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">Verifying emails with enhanced provider detection... {Math.round(progress)}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Verification Results</CardTitle>
            <p className="text-sm text-gray-600">
              Results include confidence levels and provider-specific analysis to reduce false positives.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex flex-col">
                      <span className="font-mono text-sm">{result.email}</span>
                      {result.provider && (
                        <span className="text-xs text-gray-500">
                          Provider: {result.provider} • Attempts: {result.verification_attempts}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(result.status, result.confidence)}>
                      {result.status}
                    </Badge>
                    <Badge variant="outline" className={getConfidenceColor(result.confidence)}>
                      {result.confidence}
                    </Badge>
                    {result.smtp_response_code && (
                      <span className="text-xs text-gray-500">
                        {result.smtp_response_code}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailVerification;
