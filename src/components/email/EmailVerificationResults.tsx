
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, HelpCircle, Download } from 'lucide-react';
import { VerificationResult } from '@/utils/emailVerificationEngine';

interface EmailVerificationResultsProps {
  results: VerificationResult[];
  onExportResults: () => void;
}

const EmailVerificationResults: React.FC<EmailVerificationResultsProps> = ({
  results,
  onExportResults
}) => {
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

  if (results.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enhanced Verification Results</CardTitle>
            <p className="text-sm text-gray-600">
              Results include confidence levels and provider-specific analysis to reduce false positives.
            </p>
          </div>
          <Button onClick={onExportResults} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
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
  );
};

export default EmailVerificationResults;
