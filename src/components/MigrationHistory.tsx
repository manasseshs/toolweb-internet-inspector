
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface Migration {
  id: string;
  source_email: string;
  destination_email: string;
  status: string;
  progress_percentage?: number;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

interface MigrationHistoryProps {
  migrations: Migration[];
}

const MigrationHistory: React.FC<MigrationHistoryProps> = ({ migrations }) => {
  if (migrations.length === 0) return null;

  return (
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
  );
};

export default MigrationHistory;
