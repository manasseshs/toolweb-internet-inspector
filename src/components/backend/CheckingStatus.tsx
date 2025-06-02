
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { BackendDiagnostics } from '@/types/backendStatus';

interface CheckingStatusProps {
  diagnostics: BackendDiagnostics | null;
}

export const CheckingStatus: React.FC<CheckingStatusProps> = ({ diagnostics }) => {
  return (
    <Alert className="border-blue-200 bg-blue-50 mb-4">
      <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
      <AlertDescription className="text-blue-700">
        Checking backend server connection...
        {diagnostics && (
          <p className="text-xs mt-1">Testing: {diagnostics.url}</p>
        )}
      </AlertDescription>
    </Alert>
  );
};
