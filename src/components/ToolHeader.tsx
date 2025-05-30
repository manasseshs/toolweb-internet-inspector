
import React from 'react';
import { Link } from 'react-router-dom';
import { Network, ArrowLeft } from 'lucide-react';

interface ToolHeaderProps {
  toolName: string;
}

const ToolHeader: React.FC<ToolHeaderProps> = ({ toolName }) => {
  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ToolWeb.io</h1>
            <p className="text-sm text-gray-400">{toolName}</p>
          </div>
        </div>
        <Link to="/" className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
};

export default ToolHeader;
