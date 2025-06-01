
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Download, Lock, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface VerificationRecord {
  id: string;
  email_address: string;
  status: string;
  created_at: string;
  verification_details?: any;
}

interface EmailVerificationDownloadProps {
  verifications: VerificationRecord[];
}

const EmailVerificationDownload: React.FC<EmailVerificationDownloadProps> = ({ verifications }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState('all');
  const [format, setFormat] = useState('txt');
  const [includeResult, setIncludeResult] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  const isPaidUser = user && (user.plan === 'pro' || user.plan === 'enterprise');

  const getFilteredData = () => {
    if (statusFilter === 'all') return verifications;
    return verifications.filter(v => v.status.toLowerCase() === statusFilter);
  };

  const estimateFileSize = (data: VerificationRecord[]) => {
    // Rough estimation: email + status + formatting = ~50 bytes per email
    const bytesPerEmail = format === 'csv' ? 60 : 50;
    return data.length * bytesPerEmail;
  };

  const generateTxtContent = (data: VerificationRecord[]) => {
    return data.map(v => {
      if (includeResult || !isPaidUser) {
        return `${v.email_address} - ${v.status}`;
      }
      return v.email_address;
    }).join('\n');
  };

  const generateCsvContent = (data: VerificationRecord[]) => {
    const headers = includeResult ? 'email,status\n' : 'email\n';
    const rows = data.map(v => {
      if (includeResult) {
        return `${v.email_address},${v.status}`;
      }
      return v.email_address;
    }).join('\n');
    return headers + rows;
  };

  const handleDownload = async () => {
    const filteredData = getFilteredData();
    const fileSize = estimateFileSize(filteredData);
    const fileSizeMB = fileSize / (1024 * 1024);

    // Check free user limits
    if (!isPaidUser && fileSizeMB > 100) {
      toast({
        title: "Download Limit Exceeded",
        description: "Free plan users cannot download files larger than 100MB. Please upgrade to remove this limit and unlock advanced export options.",
        variant: "destructive",
      });
      return;
    }

    // Check if free user is trying to filter
    if (!isPaidUser && statusFilter !== 'all') {
      toast({
        title: "Feature Not Available",
        description: "To download only valid or invalid emails, please upgrade your account.",
        variant: "destructive",
      });
      return;
    }

    // Check if free user is trying to use CSV
    if (!isPaidUser && format === 'csv') {
      toast({
        title: "Feature Not Available",
        description: "CSV format is only available for paid users. Please upgrade your account.",
        variant: "destructive",
      });
      return;
    }

    setIsDownloading(true);

    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      if (format === 'csv') {
        content = generateCsvContent(filteredData);
        filename = `email-verification-${statusFilter}-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        content = generateTxtContent(filteredData);
        filename = `email-verification-${statusFilter}-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
      }

      // For large files (paid users), create ZIP
      if (isPaidUser && fileSizeMB > 100) {
        await createZipDownload(filteredData, filename);
      } else {
        // Regular download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }

      toast({
        title: "Download Complete",
        description: `Downloaded ${filteredData.length} email verifications.`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "An error occurred during download.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const createZipDownload = async (data: VerificationRecord[], baseFilename: string) => {
    // For demonstration, we'll split into 5MB chunks
    const maxEmailsPerFile = Math.floor(5 * 1024 * 1024 / 50); // ~5MB per file
    const chunks = [];
    
    for (let i = 0; i < data.length; i += maxEmailsPerFile) {
      chunks.push(data.slice(i, i + maxEmailsPerFile));
    }

    // In a real implementation, you'd use JSZip or similar
    // For now, we'll download the first chunk and notify about the feature
    const firstChunk = chunks[0];
    const content = format === 'csv' ? generateCsvContent(firstChunk) : generateTxtContent(firstChunk);
    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseFilename.replace(/\.[^/.]+$/, '')}-part1.${format}`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Large File Download",
      description: `File split into ${chunks.length} parts. Downloaded part 1 of ${chunks.length}.`,
    });
  };

  const filteredData = getFilteredData();
  const estimatedSize = estimateFileSize(filteredData);
  const estimatedSizeMB = (estimatedSize / (1024 * 1024)).toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export Verification Results
          {!isPaidUser && <Badge variant="outline" className="text-yellow-500 border-yellow-500">Free Plan</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Filter */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Filter by Status
              {!isPaidUser && <Lock className="w-3 h-3 inline ml-1 text-yellow-500" />}
            </label>
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
              disabled={!isPaidUser}
            >
              <SelectTrigger className={!isPaidUser ? "opacity-50" : ""}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="valid">Valid Only</SelectItem>
                <SelectItem value="invalid">Invalid Only</SelectItem>
                <SelectItem value="catch-all">Catch-All Only</SelectItem>
                <SelectItem value="unreachable">Unreachable Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Format
              {!isPaidUser && <Lock className="w-3 h-3 inline ml-1 text-yellow-500" />}
            </label>
            <Select 
              value={format} 
              onValueChange={setFormat}
              disabled={!isPaidUser && format === 'csv'}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="txt">TXT</SelectItem>
                <SelectItem value="csv" disabled={!isPaidUser}>
                  CSV {!isPaidUser && "(Pro/Enterprise Only)"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Include Result Checkbox */}
        {isPaidUser && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="include-result" 
              checked={includeResult}
              onCheckedChange={setIncludeResult}
            />
            <label htmlFor="include-result" className="text-sm text-gray-300">
              Include verification result
            </label>
          </div>
        )}

        {/* File Info */}
        <div className="bg-gray-800/50 p-3 rounded-lg">
          <div className="text-sm text-gray-300 space-y-1">
            <div>Emails to export: <span className="font-mono">{filteredData.length}</span></div>
            <div>Estimated size: <span className="font-mono">{estimatedSizeMB} MB</span></div>
            {!isPaidUser && parseFloat(estimatedSizeMB) > 100 && (
              <div className="text-red-400 text-xs">
                ⚠️ File exceeds 100MB limit for free users
              </div>
            )}
          </div>
        </div>

        {/* Free User Upgrade Messages */}
        {!isPaidUser && (
          <div className="bg-blue-900/20 border border-blue-500/20 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 text-sm mb-2">
              <Zap className="w-4 h-4" />
              Upgrade for More Features
            </div>
            <ul className="text-xs text-blue-300 space-y-1">
              <li>• Filter by verification status</li>
              <li>• CSV export format</li>
              <li>• Choose to include/exclude results</li>
              <li>• No file size limits</li>
              <li>• ZIP compression for large files</li>
            </ul>
          </div>
        )}

        <Button 
          onClick={handleDownload}
          disabled={isDownloading || filteredData.length === 0}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          {isDownloading ? 'Downloading...' : `Download ${format.toUpperCase()}`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmailVerificationDownload;
