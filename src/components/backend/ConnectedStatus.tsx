
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { BackendDiagnostics } from '@/types/backendStatus';

interface ConnectedStatusProps {
  diagnostics: BackendDiagnostics | null;
}

export const ConnectedStatus: React.FC<ConnectedStatusProps> = ({ diagnostics }) => {
  return (
    <Alert className="border-green-200 bg-green-50 mb-4">
      <CheckCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-700">
        <div className="space-y-1">
          <p>Backend server is connected and running properly.</p>
          {diagnostics && (
            <p className="text-xs text-green-600">
              Environment: {diagnostics.environment} | API: {diagnostics.url}
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};
