
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EmailMigrationForm from './EmailMigrationForm';
import MigrationHistory from './MigrationHistory';

const EmailMigration: React.FC = () => {
  const [migrations, setMigrations] = useState<any[]>([]);
  const { user } = useAuth();

  const validateMigration = (): { valid: boolean; message: string; type: 'error' | 'warning' | 'success' | 'info' } => {
    if (!user) return { valid: false, message: 'Please log in to use migration.', type: 'error' as const };

    return { valid: true, message: 'Migration functionality is currently being migrated to the new backend.', type: 'info' as const };
  };

  const fetchMigrations = async () => {
    if (!user) return;

    try {
      // TODO: Implement migration history fetching from new backend
      console.log('Fetching migrations from new backend...');
      setMigrations([]);
    } catch (error) {
      console.error('Error fetching migrations:', error);
    }
  };

  React.useEffect(() => {
    fetchMigrations();
  }, [user]);

  const handleMigrationCreated = () => {
    fetchMigrations();
  };

  return (
    <div className="space-y-6">
      <EmailMigrationForm
        user={user}
        onMigrationCreated={handleMigrationCreated}
        validateMigration={validateMigration}
      />
      
      <MigrationHistory migrations={migrations} />
    </div>
  );
};

export default EmailMigration;
