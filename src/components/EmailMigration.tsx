
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const EmailMigration: React.FC = () => {
  const [sourceHost, setSourceHost] = useState('');
  const [sourceEmail, setSourceEmail] = useState('');
  const [sourcePassword, setSourcePassword] = useState('');
  const [destinationHost, setDestinationHost] = useState('');
  const [destinationEmail, setDestinationEmail] = useState('');
  const [destinationPassword, setDestinationPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [migrations, setMigrations] = useState<any[]>([]);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const commonProviders = [
    { name: 'Gmail', host: 'imap.gmail.com', port: 993 },
    { name: 'Outlook/Hotmail', host: 'outlook.office365.com', port: 993 },
    { name: 'Yahoo', host: 'imap.mail.yahoo.com', port: 993 },
    { name: 'iCloud', host: 'imap.mail.me.com', port: 993 },
    { name: 'Custom', host: '', port: 993 }
  ];

  const validateMigration = () => {
    if (!user) return { valid: false, message: 'Please log in to use migration.' };

    const sourceUsername = sourceEmail.split('@')[0];
    const sourceDomain = sourceEmail.split('@')[1];
    const destUsername = destinationEmail.split('@')[0];
    const destDomain = destinationEmail.split('@')[1];

    // Enterprise users can migrate between any accounts
    if (user.plan === 'enterprise') {
      return { valid: true, message: '' };
    }

    // Free and Pro users: same username and domain required
    if (sourceUsername !== destUsername || sourceDomain !== destDomain) {
      return {
        valid: false,
        message: `${user.plan === 'free' ? 'Free' : 'Pro'} plan users can only migrate to the same username and domain. Upgrade to Enterprise for cross-account migration.`
      };
    }

    return { valid: true, message: '' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateMigration();
    if (!validation.valid) {
      toast({
        title: "Migration not allowed",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real implementation, passwords would be encrypted
      const { data, error } = await supabase.from('email_migrations').insert({
        user_id: user?.id,
        source_host: sourceHost,
        source_email: sourceEmail,
        source_password_encrypted: btoa(sourcePassword), // Basic encoding - use proper encryption in production
        destination_host: destinationHost,
        destination_email: destinationEmail,
        destination_password_encrypted: btoa(destinationPassword),
        status: 'pending'
      }).select();

      if (error) throw error;

      toast({
        title: "Migration started",
        description: "Your email migration has been queued and will begin shortly.",
      });

      // Clear form
      setSourceHost('');
      setSourceEmail('');
      setSourcePassword('');
      setDestinationHost('');
      setDestinationEmail('');
      setDestinationPassword('');
      
      // Refresh migrations list
      fetchMigrations();
    } catch (error: any) {
      console.error('Migration error:', error);
      toast({
        title: "Migration failed",
        description: error.message || "An error occurred while starting the migration.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const validation = validateMigration();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Migration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!validation.valid && sourceEmail && destinationEmail && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{validation.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Source Account */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Source Account</h3>
                
                <div>
                  <Label htmlFor="source-provider">Email Provider</Label>
                  <Select onValueChange={setSourceHost}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonProviders.map((provider) => (
                        <SelectItem key={provider.name} value={provider.host}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sourceHost === '' && (
                  <div>
                    <Label htmlFor="source-host">Custom IMAP Host</Label>
                    <Input
                      id="source-host"
                      placeholder="imap.example.com"
                      value={sourceHost}
                      onChange={(e) => setSourceHost(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="source-email">Email Address</Label>
                  <Input
                    id="source-email"
                    type="email"
                    placeholder="user@example.com"
                    value={sourceEmail}
                    onChange={(e) => setSourceEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="source-password">Password</Label>
                  <Input
                    id="source-password"
                    type="password"
                    placeholder="App password or regular password"
                    value={sourcePassword}
                    onChange={(e) => setSourcePassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Destination Account */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Destination Account</h3>
                
                <div>
                  <Label htmlFor="dest-provider">Email Provider</Label>
                  <Select onValueChange={setDestinationHost}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonProviders.map((provider) => (
                        <SelectItem key={provider.name} value={provider.host}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {destinationHost === '' && (
                  <div>
                    <Label htmlFor="dest-host">Custom IMAP Host</Label>
                    <Input
                      id="dest-host"
                      placeholder="imap.example.com"
                      value={destinationHost}
                      onChange={(e) => setDestinationHost(e.target.value)}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="dest-email">Email Address</Label>
                  <Input
                    id="dest-email"
                    type="email"
                    placeholder="user@example.com"
                    value={destinationEmail}
                    onChange={(e) => setDestinationEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dest-password">Password</Label>
                  <Input
                    id="dest-password"
                    type="password"
                    placeholder="App password or regular password"
                    value={destinationPassword}
                    onChange={(e) => setDestinationPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !validation.valid}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Starting Migration...
                </>
              ) : (
                'Start Migration'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {migrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Migration History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {migrations.map((migration) => (
                <div key={migration.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {migration.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {migration.status === 'failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                      {migration.status === 'in_progress' && <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />}
                      {migration.status === 'pending' && <RefreshCw className="w-4 h-4 text-gray-500" />}
                      <span className="font-medium">
                        {migration.source_email} → {migration.destination_email}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">
                      {migration.status}
                    </span>
                  </div>
                  
                  {migration.status === 'in_progress' && migration.progress_percentage && (
                    <div className="mb-2">
                      <Progress value={migration.progress_percentage} className="w-full" />
                      <p className="text-sm text-gray-600 mt-1">
                        {migration.progress_percentage}% complete
                      </p>
                    </div>
                  )}
                  
                  {migration.error_message && (
                    <p className="text-sm text-red-600">{migration.error_message}</p>
                  )}
                  
                  <p className="text-sm text-gray-500">
                    Started: {new Date(migration.created_at).toLocaleString()}
                    {migration.completed_at && (
                      <span> • Completed: {new Date(migration.completed_at).toLocaleString()}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailMigration;
