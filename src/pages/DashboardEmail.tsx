
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ToolCategoryPage from '@/components/dashboard/ToolCategoryPage';
import { getToolsByCategory } from '@/config/toolsConfig';

const DashboardEmail = () => {
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

  const emailTools = getToolsByCategory('email');

  return (
    <DashboardLayout>
      <ToolCategoryPage
        category="email"
        title="Email Tools"
        description="Email validation, deliverability testing, and configuration"
        tools={emailTools}
        user={user}
      />
    </DashboardLayout>
  );
};

export default DashboardEmail;
