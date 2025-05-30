
import React from 'react';
import { Play, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

interface ToolInputProps {
  toolName: string;
  inputType: string;
  isFree: boolean;
  input: string;
  onInputChange: (value: string) => void;
  onExecute: () => void;
  isLoading: boolean;
  canUseTool: boolean;
}

const ToolInput: React.FC<ToolInputProps> = ({
  toolName,
  inputType,
  isFree,
  input,
  onInputChange,
  onExecute,
  isLoading,
  canUseTool
}) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 mb-6">
      <CardHeader>
        <div className="flex items-center gap-3 mb-4">
          <CardTitle className="text-white">{toolName}</CardTitle>
          {!isFree && <Badge variant="secondary">Pro</Badge>}
        </div>
        <CardDescription className="text-gray-400">
          Enter the {inputType} you want to analyze
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Input
            placeholder={`Enter ${inputType}...`}
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            className="bg-gray-900 border-gray-600 text-white placeholder-gray-400"
            onKeyPress={(e) => e.key === 'Enter' && onExecute()}
          />
          <Button 
            onClick={onExecute}
            disabled={isLoading || !canUseTool}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 min-w-[120px]"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Running...' : 'Execute'}
          </Button>
        </div>
        
        {!canUseTool && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-600 rounded-lg">
            <p className="text-yellow-400 text-sm">
              This tool requires a Pro or Enterprise plan. 
              <Link to="/pricing" className="text-yellow-300 hover:text-yellow-200 underline ml-1">
                Upgrade now
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ToolInput;
