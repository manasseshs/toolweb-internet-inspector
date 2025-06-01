
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { enhancedEmailVerification, VerificationResult } from '@/utils/emailVerificationEngine';
import EmailVerificationForm from './email/EmailVerificationForm';
import EmailVerificationResults from './email/EmailVerificationResults';

const EmailVerification: React.FC = () => {
  const [emailList, setEmailList] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<VerificationResult[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const isPaidUser = user && (user.plan === 'pro' || user.plan === 'enterprise');

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

  return (
    <div className="space-y-6">
      <EmailVerificationForm
        emailList={emailList}
        setEmailList={setEmailList}
        isVerifying={isVerifying}
        progress={progress}
        onVerifyEmails={verifyEmails}
        isPaidUser={isPaidUser}
      />
      
      <EmailVerificationResults
        results={results}
        onExportResults={exportResults}
      />
    </div>
  );
};

export default EmailVerification;
