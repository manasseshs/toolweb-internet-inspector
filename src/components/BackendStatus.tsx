
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [error, setError] = useState<string>('');

  const checkBackendStatus = async () => {
    setStatus('checking');
    setError('');

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      console.log('Checking backend status at:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        // 401 means the endpoint exists but we're not authenticated, which is expected
        setStatus('connected');
      } else if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('disconnected');
        setError(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      setStatus('disconnected');
      
      if (error instanceof Error) {
        if (error.message === 'Failed to fetch') {
          setError('Cannot connect to backend server. Please ensure it\'s running on localhost:5000');
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
          Backend server is connected and running properly.
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
            <p className="text-sm">
              Make sure the backend server is running. You can start it by running:
              <code className="block bg-red-100 p-1 mt-1 rounded text-xs">
                cd backend && npm start
              </code>
            </p>
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
      </AlertDescription>
    </Alert>
  );
};

export default BackendStatus;
