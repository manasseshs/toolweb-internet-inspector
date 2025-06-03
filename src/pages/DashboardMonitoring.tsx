
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ToolCategoryTabs from '@/components/dashboard/ToolCategoryTabs';
import { getToolsByCategory } from '@/config/toolsConfig';

const DashboardMonitoring = () => {
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

  const monitoringTools = getToolsByCategory('monitoring');

  return (
    <DashboardLayout>
      <ToolCategoryTabs
        category="monitoring"
        title="Monitoring"
        description="Uptime monitoring, alerts, and performance tracking"
        tools={monitoringTools}
        user={user}
      />
    </DashboardLayout>
  );
};

export default DashboardMonitoring;
