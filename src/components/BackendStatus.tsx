
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [error, setError] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState<{
    url: string;
    environment: string;
    timestamp: string;
  } | null>(null);

  const checkBackendStatus = async () => {
    setStatus('checking');
    setError('');

    try {
      // Use simple relative path logic
      const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
      const testUrl = `${API_BASE_URL}/auth/verify`;
      
      console.log('Checking backend status at:', testUrl);
      console.log('Environment:', import.meta.env.DEV ? 'development' : 'production');
      console.log('Current location:', window.location.href);
      
      setDiagnostics({
        url: testUrl,
        environment: import.meta.env.DEV ? 'development' : 'production',
        timestamp: new Date().toISOString()
      });
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Status check response:', response.status, response.statusText);
      console.log('Response URL:', response.url);

      if (response.status === 401) {
        // 401 means the endpoint exists but we're not authenticated, which is expected
        setStatus('connected');
        console.log('Backend is accessible (401 response is expected)');
      } else if (response.ok) {
        setStatus('connected');
        console.log('Backend is accessible (200 response)');
      } else {
        setStatus('disconnected');
        const errorMsg = `HTTP ${response.status}: ${response.statusText}`;
        setError(errorMsg);
        console.error('Backend check failed with status:', response.status);
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      setStatus('disconnected');
      
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          if (import.meta.env.DEV) {
            setError('Cannot connect to backend server. Please ensure it\'s running on localhost:5000');
          } else {
            setError('Cannot connect to backend server. Check reverse proxy configuration.');
          }
        } else {
          setError(error.message);
        }
      } else {
        setError('Unknown connection error');
      }
    }
  };

  useEffect(() => {
    checkBackendStatus();
  }, []);

  if (status === 'connected') {
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
  }

  if (status === 'disconnected') {
    return (
      <Alert className="border-red-200 bg-red-50 mb-4">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-700">
          <div className="space-y-2">
            <p>Backend server is not accessible: {error}</p>
            
            {diagnostics && (
              <div className="text-xs bg-red-100 p-2 rounded">
                <p><strong>Diagnostics:</strong></p>
                <p>URL: {diagnostics.url}</p>
                <p>Environment: {diagnostics.environment}</p>
                <p>Time: {new Date(diagnostics.timestamp).toLocaleString()}</p>
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
              <div className="text-sm">
                <p>Production troubleshooting:</p>
                <ol className="list-decimal list-inside text-xs space-y-1">
                  <li>Check backend: <code>curl http://localhost:5000/api/auth/verify</code></li>
                  <li>Verify reverse proxy forwards /api/* to localhost:5000/api/</li>
                  <li>Check OpenLiteSpeed virtual host configuration</li>
                  <li>Ensure firewall allows connections</li>
                </ol>
              </div>
            )}
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={checkBackendStatus}
              className="mt-2"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry Connection
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

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

export default BackendStatus;
