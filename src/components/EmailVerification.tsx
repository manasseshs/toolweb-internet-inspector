
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import EmailVerificationForm from './email/EmailVerificationForm';
import EmailVerificationResults from './email/EmailVerificationResults';

// Define our own VerificationResult interface that matches the API response
interface VerificationResult {
  email: string;
  status: string;
  confidence: number;
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
      console.log(`Starting verification for ${emails.length} emails`);
      setProgress(50);

      const response = await apiService.verifyEmails(emails);
      
      if (response.error) {
        throw new Error(response.error);
      }

      if (response.data?.results) {
        setResults(response.data.results);
      }

      setProgress(100);
      
      toast({
        title: "Verification complete",
        description: `Verified ${emails.length} email addresses.`,
      });
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification failed",
        description: error.message || "An error occurred during email verification.",
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
    a.download = `email-verification-${new Date().toISOString().split('T')[0]}.csv`;
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
