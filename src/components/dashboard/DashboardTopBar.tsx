
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, LogOut, User, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardTopBarProps {
  user: any;
  onLogout: () => void;
}

const DashboardTopBar: React.FC<DashboardTopBarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-500 text-white';
      case 'enterprise': return 'bg-purple-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <header className="bg-white border-b border-[#dee2e6] sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#212529]">ToolWeb.io</h1>
              <p className="text-sm text-[#6c757d]">Dashboard</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Plan Badge */}
            <Badge className={`${getPlanColor(user?.plan || 'free')} px-3 py-1`}>
              {(user?.plan || 'free').toUpperCase()}
            </Badge>

            {/* Back to Tools */}
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-[#dee2e6] text-[#6c757d] hover:bg-[#f8f9fa] hover:border-[#0d6efd] hover:text-[#0d6efd]"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Tools
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="border-[#dee2e6] text-[#6c757d] hover:bg-[#f8f9fa] hover:border-[#0d6efd] hover:text-[#0d6efd]"
                >
                  <User className="w-4 h-4 mr-2" />
                  {user?.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white border-[#dee2e6]">
                <DropdownMenuItem 
                  onClick={() => navigate('/pricing')}
                  className="text-[#212529] hover:bg-[#f8f9fa] focus:bg-[#f8f9fa]"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Plan
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#dee2e6]" />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="text-[#dc3545] hover:bg-[#f8d7da] focus:bg-[#f8d7da]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;
