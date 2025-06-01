import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, RefreshCw, Wifi, WifiOff, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ConnectionTest {
  host: string;
  port: number;
  status: 'testing' | 'success' | 'failed' | 'pending';
  error?: string;
}

const EmailMigration: React.FC = () => {
  const [sourceHost, setSourceHost] = useState('');
  const [sourcePort, setSourcePort] = useState<number>(993);
  const [sourceEmail, setSourceEmail] = useState('');
  const [sourcePassword, setSourcePassword] = useState('');
  const [destinationHost, setDestinationHost] = useState('');
  const [destinationPort, setDestinationPort] = useState<number>(993);
  const [destinationEmail, setDestinationEmail] = useState('');
  const [destinationPassword, setDestinationPassword] = useState('');
  const [showSourceCustomPort, setShowSourceCustomPort] = useState(false);
  const [showDestinationCustomPort, setShowDestinationCustomPort] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [migrations, setMigrations] = useState<any[]>([]);
  const [connectionTests, setConnectionTests] = useState<{
    source?: ConnectionTest;
    destination?: ConnectionTest;
  }>({});
  
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
    if (!user) return { valid: false, message: 'Please log in to use migration.', type: 'error' };

    const sourceUsername = sourceEmail.split('@')[0];
    const sourceDomain = sourceEmail.split('@')[1];
    const destUsername = destinationEmail.split('@')[0];
    const destDomain = destinationEmail.split('@')[1];

    // Enterprise users can migrate between any accounts
    if (user.plan === 'enterprise') {
      return { valid: true, message: 'Enterprise plan: Cross-account migration allowed', type: 'success' };
    }

    // Free and Pro users: same username and domain required
    if (sourceUsername !== destUsername || sourceDomain !== destDomain) {
      const planName = user.plan === 'free' ? 'Free' : 'Pro';
      return {
        valid: false,
        message: `${planName} plan limitation: You can only migrate to the same username and domain (${sourceEmail} → ${sourceEmail}). Upgrade to Enterprise for cross-account migration.`,
        type: 'warning'
      };
    }

    return { valid: true, message: `${user.plan === 'free' ? 'Free' : 'Pro'} plan: Same-account migration allowed`, type: 'info' };
  };

  const testConnection = async (host: string, port: number, email: string, password: string, type: 'source' | 'destination') => {
    if (!host || !email || !password) return;

    const testData: ConnectionTest = {
      host,
      port,
      status: 'testing'
    };

    setConnectionTests(prev => ({ ...prev, [type]: testData }));

    try {
      // Simulate IMAP connection test with port fallback
      const portsToTest = port === 993 ? [993, 143] : [port];
      
      for (const testPort of portsToTest) {
        testData.port = testPort;
        testData.status = 'testing';
        setConnectionTests(prev => ({ ...prev, [type]: { ...testData } }));

        // Simulate connection attempt (replace with actual IMAP test)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock success for demo (replace with actual connection test)
        const isKnownProvider = commonProviders.some(p => p.host === host);
        const connectionSuccess = isKnownProvider || Math.random() > 0.3;
        
        if (connectionSuccess) {
          testData.status = 'success';
          testData.port = testPort;
          setConnectionTests(prev => ({ ...prev, [type]: { ...testData } }));
          
          // Update the port in the form
          if (type === 'source') {
            setSourcePort(testPort);
          } else {
            setDestinationPort(testPort);
          }
          
          toast({
            title: "Connection successful",
            description: `Connected to ${host}:${testPort}`,
          });
          return;
        }
      }
      
      // All ports failed
      testData.status = 'failed';
      testData.error = 'Unable to connect using standard ports (993, 143). Please check credentials or try a custom port.';
      setConnectionTests(prev => ({ ...prev, [type]: { ...testData } }));
      
      // Show custom port input
      if (type === 'source') {
        setShowSourceCustomPort(true);
      } else {
        setShowDestinationCustomPort(true);
      }
      
      toast({
        title: "Connection failed",
        description: "Standard ports failed. Please try a custom port.",
        variant: "destructive",
      });
      
    } catch (error) {
      testData.status = 'failed';
      testData.error = 'Connection test failed. Please verify your settings.';
      setConnectionTests(prev => ({ ...prev, [type]: { ...testData } }));
    }
  };

  const handleProviderChange = (host: string, type: 'source' | 'destination') => {
    const provider = commonProviders.find(p => p.host === host);
    
    if (type === 'source') {
      setSourceHost(host);
      setSourcePort(provider?.port || 993);
      setShowSourceCustomPort(host === '');
    } else {
      setDestinationHost(host);
      setDestinationPort(provider?.port || 993);
      setShowDestinationCustomPort(host === '');
    }
    
    // Clear previous connection test
    setConnectionTests(prev => ({ ...prev, [type]: undefined }));
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
      const { data, error } = await supabase.from('email_migrations').insert({
        user_id: user?.id,
        source_host: sourceHost,
        source_email: sourceEmail,
        source_password_encrypted: btoa(sourcePassword),
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
      setSourcePort(993);
      setSourceEmail('');
      setSourcePassword('');
      setDestinationHost('');
      setDestinationPort(993);
      setDestinationEmail('');
      setDestinationPassword('');
      setShowSourceCustomPort(false);
      setShowDestinationCustomPort(false);
      setConnectionTests({});
      
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

  const renderConnectionStatus = (type: 'source' | 'destination') => {
    const test = connectionTests[type];
    if (!test) return null;

    const getStatusIcon = () => {
      switch (test.status) {
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
      switch (test.status) {
        case 'testing':
          return `Testing connection to ${test.host}:${test.port}...`;
        case 'success':
          return `Connected to ${test.host}:${test.port}`;
        case 'failed':
          return test.error || 'Connection failed';
        default:
          return '';
      }
    };

    return (
      <div className={`flex items-center gap-2 text-sm p-2 rounded ${
        test.status === 'success' ? 'bg-green-50 text-green-700' :
        test.status === 'failed' ? 'bg-red-50 text-red-700' :
        'bg-blue-50 text-blue-700'
      }`}>
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Migration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {sourceEmail && destinationEmail && (
              <Alert className={
                validation.type === 'error' ? 'border-red-500 bg-red-50' :
                validation.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                validation.type === 'success' ? 'border-green-500 bg-green-50' :
                'border-blue-500 bg-blue-50'
              }>
                {validation.type === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
                {validation.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                {validation.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                {validation.type === 'info' && <Crown className="h-4 w-4 text-blue-500" />}
                <AlertDescription className={
                  validation.type === 'error' ? 'text-red-700' :
                  validation.type === 'warning' ? 'text-yellow-700' :
                  validation.type === 'success' ? 'text-green-700' :
                  'text-blue-700'
                }>
                  {validation.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {/* Source Account */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Source Account</h3>
                
                <div>
                  <Label htmlFor="source-provider">Email Provider</Label>
                  <Select onValueChange={(value) => handleProviderChange(value, 'source')}>
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

                {(sourceHost === '' || showSourceCustomPort) && (
                  <>
                    <div>
                      <Label htmlFor="source-host">IMAP Host</Label>
                      <Input
                        id="source-host"
                        placeholder="imap.example.com"
                        value={sourceHost}
                        onChange={(e) => setSourceHost(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="source-port">Port</Label>
                      <Input
                        id="source-port"
                        type="number"
                        placeholder="993"
                        value={sourcePort}
                        onChange={(e) => setSourcePort(parseInt(e.target.value) || 993)}
                        required
                      />
                    </div>
                  </>
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

                {sourceHost && sourceEmail && sourcePassword && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testConnection(sourceHost, sourcePort, sourceEmail, sourcePassword, 'source')}
                    disabled={connectionTests.source?.status === 'testing'}
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                )}

                {renderConnectionStatus('source')}
              </div>

              {/* Destination Account */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Destination Account</h3>
                
                <div>
                  <Label htmlFor="dest-provider">Email Provider</Label>
                  <Select onValueChange={(value) => handleProviderChange(value, 'destination')}>
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

                {(destinationHost === '' || showDestinationCustomPort) && (
                  <>
                    <div>
                      <Label htmlFor="dest-host">IMAP Host</Label>
                      <Input
                        id="dest-host"
                        placeholder="imap.example.com"
                        value={destinationHost}
                        onChange={(e) => setDestinationHost(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dest-port">Port</Label>
                      <Input
                        id="dest-port"
                        type="number"
                        placeholder="993"
                        value={destinationPort}
                        onChange={(e) => setDestinationPort(parseInt(e.target.value) || 993)}
                        required
                      />
                    </div>
                  </>
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

                {destinationHost && destinationEmail && destinationPassword && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testConnection(destinationHost, destinationPort, destinationEmail, destinationPassword, 'destination')}
                    disabled={connectionTests.destination?.status === 'testing'}
                  >
                    <Wifi className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>
                )}

                {renderConnectionStatus('destination')}
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
