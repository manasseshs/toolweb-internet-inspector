
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmailVerificationFormProps {
  emailList: string;
  setEmailList: (value: string) => void;
  isVerifying: boolean;
  progress: number;
  onVerifyEmails: () => void;
  isPaidUser: boolean;
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
  emailList,
  setEmailList,
  isVerifying,
  progress,
  onVerifyEmails,
  isPaidUser
}) => {
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'text/plain' || file.type === 'text/csv')) {
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

  const emailCount = emailList.split('\n').filter(email => email.trim()).length;

  return (
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
            {emailCount} emails entered
            {!isPaidUser && ` (${Math.max(0, 10 - emailCount)} remaining for free users)`}
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
            </div>
          </div>
        )}

        <Button 
          onClick={onVerifyEmails}
          disabled={isVerifying || !emailList.trim()}
          className="w-full"
        >
          {isVerifying ? 'Verifying...' : 'Verify Emails'}
        </Button>

        {isVerifying && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-600">
              Verifying emails with enhanced provider detection... {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmailVerificationForm;
