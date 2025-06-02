
import { BackendDiagnostics } from '@/types/backendStatus';

export const createDiagnosticsData = (testUrl: string): BackendDiagnostics => {
  return {
    url: testUrl,
    environment: import.meta.env.DEV ? 'development' : 'production',
    timestamp: new Date().toISOString(),
    reverseProxyWorking: false,
    directBackendWorking: false
  };
};

export const getApiBaseUrl = (): string => {
  return import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';
};

export const getDirectBackendUrl = (): string => {
  return `${window.location.protocol}//${window.location.hostname}:5000/api/auth/verify`;
};
