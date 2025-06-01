
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, User, LogIn, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-[#dee2e6] shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] rounded-xl flex items-center justify-center shadow-sm">
            <Network className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#212529]">ToolWeb.io</h1>
            <p className="text-sm text-[#6c757d]">Advanced Web Diagnostics & Infrastructure Tools</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {user ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')} 
                className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-[#0d6efd] hover:border-[#0b5ed7] shadow-sm transition-colors duration-200"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button 
                onClick={() => navigate('/pricing')} 
                className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white shadow-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')} 
                className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-[#0d6efd] hover:border-[#0b5ed7] shadow-sm transition-colors duration-200"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
              <Button 
                onClick={() => navigate('/pricing')} 
                className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white shadow-sm"
              >
                Upgrade
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
