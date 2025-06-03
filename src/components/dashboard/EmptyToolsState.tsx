
import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyToolsState: React.FC = () => {
  return (
    <div className="text-center py-12 bg-white border border-[#dee2e6] rounded-lg">
      <AlertCircle className="w-12 h-12 text-[#6c757d] mx-auto mb-4" />
      <h3 className="text-lg font-medium text-[#212529] mb-2">No tools available</h3>
      <p className="text-[#6c757d]">Tools for this category are coming soon.</p>
    </div>
  );
};

export default EmptyToolsState;
