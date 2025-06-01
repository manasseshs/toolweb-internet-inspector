
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ToolExecutorInputProps {
  selectedTool: string;
  input: string;
  setInput: (value: string) => void;
  emailList: string;
  setEmailList: (value: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  inputType: string;
  onExecute: () => void;
}

const ToolExecutorInput: React.FC<ToolExecutorInputProps> = ({
  selectedTool,
  input,
  setInput,
  emailList,
  setEmailList,
  uploadedFile,
  setUploadedFile,
  inputType,
  onExecute
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const isEmailValidationTool = selectedTool === 'email-validation';
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

  if (isEmailValidationTool) {
    return (
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-[#212529] mb-2 block">
            Email Addresses (one per line, max {isPaidUser ? 'unlimited' : '10'} for free users)
          </label>
          <Textarea
            placeholder="Enter email addresses, one per line..."
            value={emailList}
            onChange={(e) => setEmailList(e.target.value)}
            className="min-h-[120px] border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
            rows={10}
          />
          <p className="text-xs text-[#6c757d] mt-1">
            {emailList.split('\n').filter(email => email.trim()).length} emails entered
            {!isPaidUser && ` (${Math.max(0, 10 - emailList.split('\n').filter(email => email.trim()).length)} remaining for free users)`}
          </p>
        </div>
        
        {isPaidUser && (
          <div>
            <label className="text-sm font-medium text-[#212529] mb-2 block">
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
                className="flex items-center gap-2 px-3 py-2 border border-[#dee2e6] rounded-md cursor-pointer hover:bg-[#f8f9fa] text-sm text-[#6c757d]"
              >
                <Upload className="w-4 h-4" />
                Choose File
              </label>
              {uploadedFile && (
                <span className="text-sm text-[#28a745]">
                  {uploadedFile.name} uploaded
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Input
        placeholder={`Enter ${inputType}...`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
        onKeyPress={(e) => e.key === 'Enter' && onExecute()}
      />
    </div>
  );
};

export default ToolExecutorInput;
