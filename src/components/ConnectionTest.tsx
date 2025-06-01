
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, CheckCircle, WifiOff, Wifi } from 'lucide-react';

interface ConnectionTest {
  host: string;
  port: number;
  status: 'testing' | 'success' | 'failed' | 'pending';
  error?: string;
}

interface ConnectionTestProps {
  host: string;
  email: string;
  password: string;
  port: number;
  onTest: (host: string, port: number, email: string, password: string, type: 'source' | 'destination') => void;
  connectionTest?: ConnectionTest;
  type: 'source' | 'destination';
}

const ConnectionTest: React.FC<ConnectionTestProps> = ({
  host,
  email,
  password,
  port,
  onTest,
  connectionTest,
  type
}) => {
  const renderConnectionStatus = () => {
    if (!connectionTest) return null;

    const getStatusIcon = () => {
      switch (connectionTest.status) {
        case 'testing':
          return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
        case 'success':
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'failed':
          return <WifiOff className="w-4 h-4 text-red-500" />;
        default:
          return <Wifi className="w-4 h-4 text-gray-500" />;
      }
    };

    const getStatusText = () => {
      switch (connectionTest.status) {
        case 'testing':
          return `Testing connection to ${connectionTest.host}:${connectionTest.port}...`;
        case 'success':
          return `Connected to ${connectionTest.host}:${connectionTest.port}`;
        case 'failed':
          return connectionTest.error || 'Connection failed';
        default:
          return '';
      }
    };

    return (
      <div className={`flex items-center gap-2 text-sm p-2 rounded ${
        connectionTest.status === 'success' ? 'bg-green-50 text-green-700' :
        connectionTest.status === 'failed' ? 'bg-red-50 text-red-700' :
        'bg-blue-50 text-blue-700'
      }`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    );
  };

  if (!host || !email || !password) return null;

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => onTest(host, port, email, password, type)}
        disabled={connectionTest?.status === 'testing'}
      >
        <Wifi className="w-4 h-4 mr-2" />
        Test Connection
      </Button>
      {renderConnectionStatus()}
    </div>
  );
};

export default ConnectionTest;
