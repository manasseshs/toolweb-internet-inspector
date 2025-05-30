
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ExecutionProgressProps {
  isLoading: boolean;
  progress: number;
  logs: string[];
  input: string;
}

const ExecutionProgress: React.FC<ExecutionProgressProps> = ({
  isLoading,
  progress,
  logs,
  input
}) => {
  if (!isLoading) return null;

  return (
    <Card className="border-[#b3d7ff] bg-[#e7f3ff] mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-[#0d6efd] text-sm">Execution Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="mb-4" />
        <div className="max-h-32 overflow-y-auto space-y-1">
          {logs.map((log, index) => (
            <div key={index} className="text-sm text-[#0d6efd] font-mono">
              {log}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutionProgress;
