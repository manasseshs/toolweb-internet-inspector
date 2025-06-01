import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle, Upload, Download, HelpCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { EmailVerificationEngine, EmailVerificationResult } from './EmailVerificationEngine';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface VerificationResult {
  email: string;
  status: 'valid' | 'invalid' | 'catch-all' | 'unreachable' | 'unconfirmed';
  smtp_server?: string;
  smtp_response_code?: string;
  smtp_response_message?: string;
  details?: any;
}

const EmailVerification: React.FC = () => {
  const [emailList, setEmailList] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<EmailVerificationResult[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [enableContentProbe, setEnableContentProbe] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const verificationEngine = new EmailVerificationEngine();

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
      const verificationResults: EmailVerificationResult[] = [];
      
      for (let i = 0; i < emails.length; i++) {
        const email = emails[i].trim();
        setProgress((i / emails.length) * 100);

        console.log(`Starting verification for: ${email}`);
        
        // Use the enhanced verification engine
        const result = await verificationEngine.verifyEmail(email, enableContentProbe);
        verificationResults.push(result);

        console.log(`Verification result for ${email}:`, result);

        // Store result in database with enhanced data
        await supabase.from('email_verifications').insert({
          user_id: user?.id,
          email_address: email,
          status: result.status,
          smtp_server: result.smtp_server,
          smtp_response_code: result.smtp_response_code,
          smtp_response_message: result.smtp_response_message,
          verification_details: {
            confidence: result.confidence,
            debug_info: result.debug_info,
            notes: result.notes
          }
        });
      }

      setResults(verificationResults);
      setProgress(100);
      
      toast({
        title: "Verification complete",
        description: `Verified ${emails.length} email addresses with enhanced detection.`,
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
      case 'unconfirmed': return <HelpCircle className="w-4 h-4 text-orange-500" />;
      case 'unreachable': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, confidence: string) => {
    switch (status) {
      case 'valid': 
        return confidence === 'high' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-700';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'catch-all': return 'bg-yellow-100 text-yellow-800';
      case 'unconfirmed': return 'bg-orange-100 text-orange-800';
      case 'unreachable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high': return <Badge className="bg-green-100 text-green-800 text-xs">High Confidence</Badge>;
      case 'medium': return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium Confidence</Badge>;
      case 'low': return <Badge className="bg-orange-100 text-orange-800 text-xs">Low Confidence</Badge>;
      case 'suspected': return <Badge className="bg-red-100 text-red-800 text-xs">Suspected False Positive</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Email Verification</CardTitle>
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

          {isPaidUser && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h4 className="text-sm font-medium text-blue-900 mb-3">Advanced Options (Pro Users)</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="content-probe"
                    checked={enableContentProbe}
                    onCheckedChange={setEnableContentProbe}
                  />
                  <Label htmlFor="content-probe" className="text-sm">
                    Enable Content Probes (Better detection for cPanel/Exim servers)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="debug-info"
                    checked={showDebugInfo}
                    onCheckedChange={setShowDebugInfo}
                  />
                  <Label htmlFor="debug-info" className="text-sm">
                    Show Debug Information
                  </Label>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                <Info className="w-3 h-3 inline mr-1" />
                Content probes help detect false positives from servers that accept all RCPT commands
              </p>
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
              <p className="text-sm text-gray-600">Verifying emails with enhanced detection... {Math.round(progress)}% complete</p>
            </div>
          )}
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enhanced Verification Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <span className="font-mono text-sm">{result.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(result.status, result.confidence)}>
                        {result.status}
                      </Badge>
                      {getConfidenceBadge(result.confidence)}
                      {result.smtp_response_code && (
                        <span className="text-xs text-gray-500">
                          {result.smtp_response_code}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {result.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      📝 {result.notes}
                    </p>
                  )}

                  {showDebugInfo && result.debug_info && (
                    <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono">
                      <div>Email: {result.email}</div>
                      <div>MX: {result.debug_info.mx_record}</div>
                      <div>SMTP Code: {result.smtp_response_code}</div>
                      <div>Response Time: {result.debug_info.response_time}ms</div>
                      <div>Server Behavior: {result.debug_info.server_behavior}</div>
                      <div>Domain Flags: {result.debug_info.domain_flags.join(', ')}</div>
                      {result.debug_info.retry_results && (
                        <div>Retries: {result.debug_info.retry_results.join(' | ')}</div>
                      )}
                    </div>
                  )}
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
