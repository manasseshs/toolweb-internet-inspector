
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const EmptyToolState: React.FC = () => {
  return (
    <Card className="border-[#dee2e6] bg-white">
      <CardContent className="p-8 text-center">
        <div className="text-[#6c757d] mb-4">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-[#212529] mb-2">Select a Tool</h3>
        <p className="text-[#6c757d]">Choose a tool from the categories above to get started.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyToolState;
