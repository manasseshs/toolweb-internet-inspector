
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Crown } from 'lucide-react';

interface ValidationResult {
  valid: boolean;
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
}

interface PlanValidationProps {
  sourceEmail: string;
  destinationEmail: string;
  validation: ValidationResult;
}

const PlanValidation: React.FC<PlanValidationProps> = ({
  sourceEmail,
  destinationEmail,
  validation
}) => {
  if (!sourceEmail || !destinationEmail) return null;

  return (
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
  );
};

export default PlanValidation;
