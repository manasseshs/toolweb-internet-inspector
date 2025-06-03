
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ToolCategoryTabs from '@/components/dashboard/ToolCategoryTabs';
import { getToolsByCategory } from '@/config/toolsConfig';

const DashboardSecurity = () => {
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

  const securityTools = getToolsByCategory('security');

  return (
    <DashboardLayout>
      <ToolCategoryTabs
        category="security"
        title="Security Tools"
        description="SSL analysis, security headers, and vulnerability scanning"
        tools={securityTools}
        user={user}
      />
    </DashboardLayout>
  );
};

export default DashboardSecurity;
