
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  onLogout: () => Promise<void>;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ToolWeb.io</h1>
            <p className="text-sm text-gray-400">Dashboard</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-gray-300 hover:bg-gray-800">
            Back to Tools
          </Button>
          <Button variant="outline" onClick={onLogout} className="border-gray-600 text-gray-300 hover:bg-gray-800">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
