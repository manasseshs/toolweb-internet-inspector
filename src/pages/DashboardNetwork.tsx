
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ToolCategoryPage from '@/components/dashboard/ToolCategoryPage';
import { getToolsByCategory } from '@/config/toolsConfig';

const DashboardNetwork = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-[#6c757d]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const networkTools = getToolsByCategory('network');

  return (
    <DashboardLayout>
      <ToolCategoryPage
        category="network"
        title="Network Tools"
        description="IP analysis, connectivity testing, and network diagnostics"
        tools={networkTools}
        user={user}
      />
    </DashboardLayout>
  );
};

export default DashboardNetwork;
