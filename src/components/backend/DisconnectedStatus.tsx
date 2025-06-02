
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Info } from 'lucide-react';
import { BackendDiagnostics } from '@/types/backendStatus';

interface DisconnectedStatusProps {
  error: string;
  diagnostics: BackendDiagnostics | null;
  onRetry: () => void;
}

export const DisconnectedStatus: React.FC<DisconnectedStatusProps> = ({
  error,
  diagnostics,
  onRetry
}) => {
  return (
    <Alert className="border-red-200 bg-red-50 mb-4">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-700">
        <div className="space-y-2">
          <p>Backend server is not accessible: {error}</p>
          
          {diagnostics && (
            <div className="text-xs bg-red-100 p-2 rounded space-y-1">
              <p><strong>Diagnostics:</strong></p>
              <p>URL: {diagnostics.url}</p>
              <p>Environment: {diagnostics.environment}</p>
              <p>Time: {new Date(diagnostics.timestamp).toLocaleString()}</p>
              
              {!import.meta.env.DEV && diagnostics.directUrl && (
                <>
                  <p>Direct Backend URL: {diagnostics.directUrl}</p>
                  <p>Direct Backend Working: {diagnostics.directBackendWorking ? '✅ Yes' : '❌ No'}</p>
                  <p>Reverse Proxy Working: {diagnostics.reverseProxyWorking ? '✅ Yes' : '❌ No'}</p>
                </>
              )}
            </div>
          )}
          
          {import.meta.env.DEV ? (
            <div className="text-sm">
              <p>Development troubleshooting:</p>
              <p>Ensure backend is running:</p>
              <code className="block bg-red-100 p-1 mt-1 rounded text-xs">
                cd backend && npm start
              </code>
            </div>
          ) : (
            <div className="text-sm space-y-2">
              <p>Production troubleshooting:</p>
              
              {diagnostics?.directBackendWorking === false && (
                <Alert className="border-orange-200 bg-orange-50 p-2">
                  <Info className="h-3 w-3 text-orange-600" />
                  <AlertDescription className="text-orange-700 text-xs">
                    <strong>Backend não está rodando:</strong> O servidor backend em localhost:5000 não está acessível.
                    Execute: <code>cd backend && npm start</code>
                  </AlertDescription>
                </Alert>
              )}
              
              {diagnostics?.directBackendWorking === true && diagnostics?.reverseProxyWorking === false && (
                <Alert className="border-orange-200 bg-orange-50 p-2">
                  <Info className="h-3 w-3 text-orange-600" />
                  <AlertDescription className="text-orange-700 text-xs">
                    <strong>Problema no Reverse Proxy:</strong> Backend está rodando mas o proxy /api/* não está funcionando.
                    Verifique a configuração do OpenLiteSpeed.
                  </AlertDescription>
                </Alert>
              )}
              
              <ol className="list-decimal list-inside text-xs space-y-1">
                <li>Check backend: <code>curl http://localhost:5000/api/auth/verify</code></li>
                <li>Test direct access: <code>curl {window.location.protocol}//{window.location.hostname}:5000/api/auth/verify</code></li>
                <li>Verify reverse proxy forwards /api/* to localhost:5000/api/</li>
                <li>Check OpenLiteSpeed virtual host configuration</li>
                <li>Ensure firewall allows connections</li>
                <li>Check if port 5000 is open: <code>netstat -tlnp | grep :5000</code></li>
              </ol>
              
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                <strong>OpenLiteSpeed Configuration:</strong>
                <p>Add this to your Virtual Host → Script Handler:</p>
                <code className="block mt-1 p-1 bg-white rounded">
                  Suffixes: api<br/>
                  Type: Proxy<br/>
                  URI: http://localhost:5000/
                </code>
              </div>
            </div>
          )}
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRetry}
            className="mt-2"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry Connection
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
