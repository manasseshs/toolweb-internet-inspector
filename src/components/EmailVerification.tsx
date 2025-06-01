
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Upload, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VerificationResult {
  email: string;
  status: 'valid' | 'invalid' | 'catch-all' | 'unreachable';
  smtp_server?: string;
  smtp_response_code?: string;
  smtp_response_message?: string;
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

        // Simulate email verification logic
        const result = await simulateEmailVerification(email);
        verificationResults.push(result);

        // Store result in database
        await supabase.from('email_verifications').insert({
          user_id: user?.id,
          email_address: email,
          status: result.status,
          smtp_server: result.smtp_server,
          smtp_response_code: result.smtp_response_code,
          smtp_response_message: result.smtp_response_message,
          verification_details: result.details
        });
      }

      setResults(verificationResults);
      setProgress(100);
      
      toast({
        title: "Verification complete",
        description: `Verified ${emails.length} email addresses.`,
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

  const simulateEmailVerification = async (email: string): Promise<VerificationResult> => {
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Basic syntax check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        email,
        status: 'invalid',
        smtp_response_message: 'Invalid email syntax',
        details: { syntax_valid: false }
      };
    }

    // Simulate different verification outcomes
    const domain = email.split('@')[1];
    const random = Math.random();
    
    if (random < 0.7) {
      return {
        email,
        status: 'valid',
        smtp_server: `mx.${domain}`,
        smtp_response_code: '250',
        smtp_response_message: 'OK',
        details: { 
          syntax_valid: true,
          mx_found: true,
          smtp_check: true,
          catch_all: false
        }
      };
    } else if (random < 0.85) {
      return {
        email,
        status: 'catch-all',
        smtp_server: `mx.${domain}`,
        smtp_response_code: '250',
        smtp_response_message: 'Catch-all domain',
        details: { 
          syntax_valid: true,
          mx_found: true,
          smtp_check: true,
          catch_all: true
        }
      };
    } else if (random < 0.95) {
      return {
        email,
        status: 'unreachable',
        smtp_server: `mx.${domain}`,
        smtp_response_code: '421',
        smtp_response_message: 'Service not available',
        details: { 
          syntax_valid: true,
          mx_found: true,
          smtp_check: false
        }
      };
    } else {
      return {
        email,
        status: 'invalid',
        smtp_response_code: '550',
        smtp_response_message: 'Mailbox not found',
        details: { 
          syntax_valid: true,
          mx_found: true,
          smtp_check: false
        }
      };
    }
  };

  const exportResults = () => {
    if (!results.length) return;

    const csv = [
      'Email,Status,SMTP Server,Response Code,Response Message',
      ...results.map(r => 
        `${r.email},${r.status},${r.smtp_server || ''},${r.smtp_response_code || ''},${r.smtp_response_message || ''}`
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'catch-all': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'unreachable': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'catch-all': return 'bg-yellow-100 text-yellow-800';
      case 'unreachable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
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
              <p className="text-sm text-gray-600">Verifying emails... {Math.round(progress)}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <span className="font-mono text-sm">{result.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
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
