
import React, { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdManager } from '@/hooks/useAdManager';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { getToolById } from '@/config/toolsConfig';
import { useToolExecution } from '@/hooks/useToolExecution';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ToolPageHeader from '@/components/tool/ToolPageHeader';
import ToolInterface from '@/components/tool/ToolInterface';
import AdContainer from '@/components/ads/AdContainer';
import { Button } from '@/components/ui/button';

const ToolPage = () => {
  const { toolId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { executionCount } = useAdManager();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const tool = toolId ? getToolById(toolId) : null;
  const { executionState, executeToolAnalysis, access } = useToolExecution(tool!, user);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-[#6c757d]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!tool) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-[#6c757d] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#212529] mb-2">Tool not found</h3>
          <p className="text-[#6c757d] mb-4">The requested tool does not exist.</p>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <ToolPageHeader tool={tool} />
        
        <ToolInterface
          tool={tool}
          executionState={executionState}
          access={access}
          onExecute={executeToolAnalysis}
        />

        {/* Sidebar Ad */}
        <div className="lg:hidden">
          <AdContainer 
            placement="sidebar" 
            className="mt-6"
            refreshTrigger={executionCount}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ToolPage;
