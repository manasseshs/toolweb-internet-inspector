
export interface BackendDiagnostics {
  url: string;
  directUrl?: string;
  environment: string;
  timestamp: string;
  reverseProxyWorking?: boolean;
  directBackendWorking?: boolean;
}

export type BackendStatusType = 'checking' | 'connected' | 'disconnected';
