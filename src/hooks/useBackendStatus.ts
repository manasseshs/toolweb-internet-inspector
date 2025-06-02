
import { useState, useEffect } from 'react';
import { BackendStatusType, BackendDiagnostics } from '@/types/backendStatus';
import { createDiagnosticsData, getApiBaseUrl, getDirectBackendUrl } from '@/utils/backendDiagnostics';

export const useBackendStatus = () => {
  const [status, setStatus] = useState<BackendStatusType>('checking');
  const [error, setError] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState<BackendDiagnostics | null>(null);

  const checkBackendStatus = async () => {
    setStatus('checking');
    setError('');

    try {
      const API_BASE_URL = getApiBaseUrl();
      const testUrl = `${API_BASE_URL}/auth/verify`;
      
      console.log('Checking backend status at:', testUrl);
      console.log('Environment:', import.meta.env.DEV ? 'development' : 'production');
      console.log('Current location:', window.location.href);
      
      const diagnosticsData = createDiagnosticsData(testUrl);

      // In production, also test direct backend connection for debugging
      if (!import.meta.env.DEV) {
        const directUrl = getDirectBackendUrl();
        diagnosticsData.directUrl = directUrl;
        
        try {
          console.log('Testing direct backend connection:', directUrl);
          const directResponse = await fetch(directUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          console.log('Direct backend response:', directResponse.status);
          if (directResponse.status === 401 || directResponse.ok) {
            diagnosticsData.directBackendWorking = true;
          }
        } catch (directError) {
          console.log('Direct backend test failed:', directError);
          diagnosticsData.directBackendWorking = false;
        }
      }
      
      setDiagnostics(diagnosticsData);
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Status check response:', response.status, response.statusText);
      console.log('Response URL:', response.url);

      if (response.status === 401) {
        setStatus('connected');
        diagnosticsData.reverseProxyWorking = true;
        setDiagnostics(diagnosticsData);
        console.log('Backend is accessible (401 response is expected)');
      } else if (response.ok) {
        setStatus('connected');
        diagnosticsData.reverseProxyWorking = true;
        setDiagnostics(diagnosticsData);
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

  return {
    status,
    error,
    diagnostics,
    checkBackendStatus
  };
};
