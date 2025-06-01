import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardTabs from '@/components/DashboardTabs';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, tool: 'Blacklist Check', target: '192.168.1.1', result: 'Clean', time: '2 minutes ago' },
    { id: 2, tool: 'MX Lookup', target: 'example.com', result: 'Found 2 records', time: '5 minutes ago' },
    { id: 3, tool: 'Ping Test', target: '8.8.8.8', result: '15ms', time: '10 minutes ago' },
    { id: 4, tool: 'WHOIS', target: 'google.com', result: 'Complete', time: '1 hour ago' }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <DashboardHeader onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.email}</p>
          </div>
          
          <DashboardTabs />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
