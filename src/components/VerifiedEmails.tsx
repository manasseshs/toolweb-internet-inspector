import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, CheckCircle, XCircle, AlertCircle, RefreshCw, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import EmailVerificationDownload from './email/EmailVerificationDownload';

interface VerificationRecord {
  id: string;
  email_address: string;
  status: string;
  smtp_server?: string;
  smtp_response_code?: string;
  smtp_response_message?: string;
  verification_details?: any;
  verification_attempts?: number;
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
      const response = await apiService.getVerificationHistory();

      if (response.error) {
        throw new Error(response.error);
      }

      setVerifications(response.data?.verifications || []);
      setFilteredVerifications(response.data?.verifications || []);
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

  const getStatusIcon = (status: string, confidence?: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'unconfirmed': return <HelpCircle className="w-4 h-4 text-orange-500" />;
      case 'suspicious': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'catch-all': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'unreachable': return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string, confidence?: string) => {
    switch (status) {
      case 'valid': 
        return confidence === 'high' ? 'bg-green-100 text-green-800' : 'bg-green-50 text-green-600';
      case 'invalid': return 'bg-red-100 text-red-800';
      case 'unconfirmed': return 'bg-orange-100 text-orange-800';
      case 'suspicious': return 'bg-yellow-100 text-yellow-800';
      case 'catch-all': return 'bg-yellow-100 text-yellow-800';
      case 'unreachable': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
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
      unconfirmed: counts.unconfirmed || 0,
      suspicious: counts.suspicious || 0,
      'catch-all': counts['catch-all'] || 0,
      unreachable: counts.unreachable || 0
    };
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400">Loading verification results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-white">{statusCounts.total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{statusCounts.valid}</div>
            <div className="text-sm text-gray-400">Valid</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{statusCounts.invalid}</div>
            <div className="text-sm text-gray-400">Invalid</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{statusCounts.unconfirmed}</div>
            <div className="text-sm text-gray-400">Unconfirmed</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{statusCounts['catch-all']}</div>
            <div className="text-sm text-gray-400">Catch-all</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{statusCounts.unreachable}</div>
            <div className="text-sm text-gray-400">Unreachable</div>
          </CardContent>
        </Card>
      </div>

      {/* Download Component */}
      <EmailVerificationDownload verifications={verifications} />

      {/* Verification History Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Email Verification History</CardTitle>
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
                  className="pl-10 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid</option>
              <option value="invalid">Invalid</option>
              <option value="unconfirmed">Unconfirmed</option>
              <option value="suspicious">Suspicious</option>
              <option value="catch-all">Catch-all</option>
              <option value="unreachable">Unreachable</option>
            </select>
          </div>

          {filteredVerifications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                {verifications.length === 0 
                  ? "No email verifications found. Start verifying emails to see results here."
                  : "No results match your search criteria."
                }
              </p>
            </div>
          ) : (
            <div className="border border-gray-700 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Email Address</TableHead>
                    <TableHead className="text-gray-300">Verification Result</TableHead>
                    <TableHead className="text-gray-300">Confidence</TableHead>
                    <TableHead className="text-gray-300">Provider Info</TableHead>
                    <TableHead className="text-gray-300">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVerifications.map((verification) => (
                    <TableRow key={verification.id} className="border-gray-700">
                      <TableCell className="font-mono text-sm text-gray-300">
                        {verification.email_address}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(verification.status, verification.verification_details?.confidence)}
                          <Badge className={getStatusColor(verification.status, verification.verification_details?.confidence)}>
                            {verification.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {verification.verification_details?.confidence && (
                          <Badge variant="outline" className="text-gray-400 border-gray-600">
                            {verification.verification_details.confidence}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {verification.verification_details?.provider && (
                          <div>
                            <div className="font-medium">{verification.verification_details.provider}</div>
                            {verification.verification_attempts && (
                              <div className="text-xs">Attempts: {verification.verification_attempts}</div>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-400">
                        {new Date(verification.created_at).toLocaleDateString()} {new Date(verification.created_at).toLocaleTimeString()}
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
