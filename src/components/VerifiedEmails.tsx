
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface VerificationRecord {
  id: string;
  email_address: string;
  status: string;
  smtp_server?: string;
  smtp_response_code?: string;
  smtp_response_message?: string;
  verification_details?: any;
  created_at: string;
}

const VerifiedEmails: React.FC = () => {
  const [verifications, setVerifications] = useState<VerificationRecord[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<VerificationRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();

  const fetchVerifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVerifications(data || []);
      setFilteredVerifications(data || []);
    } catch (error) {
      console.error('Error fetching verifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [user]);

  useEffect(() => {
    let filtered = verifications;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.email_address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => v.status === statusFilter);
    }

    setFilteredVerifications(filtered);
  }, [verifications, searchTerm, statusFilter]);

  const exportResults = () => {
    if (!filteredVerifications.length) return;

    const csv = [
      'Email,Status,SMTP Server,Response Code,Response Message,Date',
      ...filteredVerifications.map(v => 
        `${v.email_address},${v.status},${v.smtp_server || ''},${v.smtp_response_code || ''},${v.smtp_response_message || ''},${new Date(v.created_at).toISOString()}`
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verified-emails-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'catch-all': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'unreachable': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'bg-green-100 text-green-800 border-green-200';
      case 'invalid': return 'bg-red-100 text-red-800 border-red-200';
      case 'catch-all': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unreachable': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusCounts = () => {
    const counts = verifications.reduce((acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: verifications.length,
      valid: counts.valid || 0,
      invalid: counts.invalid || 0,
      'catch-all': counts['catch-all'] || 0,
      unreachable: counts.unreachable || 0
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">Loading verification results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{statusCounts.valid}</div>
            <div className="text-sm text-gray-600">Valid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{statusCounts.invalid}</div>
            <div className="text-sm text-gray-600">Invalid</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{statusCounts['catch-all']}</div>
            <div className="text-sm text-gray-600">Catch-all</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{statusCounts.unreachable}</div>
            <div className="text-sm text-gray-600">Unreachable</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Verified Emails</CardTitle>
            <Button onClick={exportResults} disabled={!filteredVerifications.length}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid</option>
              <option value="invalid">Invalid</option>
              <option value="catch-all">Catch-all</option>
              <option value="unreachable">Unreachable</option>
            </select>
          </div>

          {filteredVerifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                {verifications.length === 0 
                  ? "No email verifications found. Start verifying emails to see results here."
                  : "No results match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email Address</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>SMTP Server</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVerifications.map((verification) => (
                    <TableRow key={verification.id}>
                      <TableCell className="font-mono text-sm">
                        {verification.email_address}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(verification.status)}
                          <Badge className={getStatusColor(verification.status)}>
                            {verification.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {verification.smtp_server || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {verification.smtp_response_code && (
                          <div>
                            <span className="font-mono text-xs bg-gray-100 px-1 rounded">
                              {verification.smtp_response_code}
                            </span>
                            {verification.smtp_response_message && (
                              <div className="text-xs text-gray-600 mt-1 max-w-xs truncate">
                                {verification.smtp_response_message}
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(verification.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifiedEmails;
