
import React from 'react';
import { useBackendStatus } from '@/hooks/useBackendStatus';
import { ConnectedStatus } from '@/components/backend/ConnectedStatus';
import { CheckingStatus } from '@/components/backend/CheckingStatus';
import { DisconnectedStatus } from '@/components/backend/DisconnectedStatus';

const BackendStatus: React.FC = () => {
  const { status, error, diagnostics, checkBackendStatus } = useBackendStatus();

  if (status === 'connected') {
    return <ConnectedStatus diagnostics={diagnostics} />;
  }

  if (status === 'disconnected') {
    return (
      <DisconnectedStatus
        error={error}
        diagnostics={diagnostics}
        onRetry={checkBackendStatus}
      />
    );
  }

  return <CheckingStatus diagnostics={diagnostics} />;
};

export default BackendStatus;
