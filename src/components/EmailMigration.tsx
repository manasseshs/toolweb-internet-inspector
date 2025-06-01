
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import EmailMigrationForm from './EmailMigrationForm';
import MigrationHistory from './MigrationHistory';

const EmailMigration: React.FC = () => {
  const [migrations, setMigrations] = useState<any[]>([]);
  const { user } = useAuth();

  const validateMigration = () => {
    if (!user) return { valid: false, message: 'Please log in to use migration.', type: 'error' };

    // For validation we need both emails to be set, but since this is called from the form
    // we'll need to pass the emails as parameters. For now, return a basic validation.
    return { valid: true, message: 'Validation will be checked on form submission', type: 'info' };
  };

  const fetchMigrations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('email_migrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMigrations(data || []);
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
