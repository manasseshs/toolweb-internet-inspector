import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdManager } from '@/hooks/useAdManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Play, RefreshCw, CheckCircle, XCircle, Clock, Crown, ArrowLeft } from 'lucide-react';
import { getToolById, getUserToolAccess } from '@/config/toolsConfig';
import { toolEngine } from '@/services/toolEngine';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdContainer from '@/components/ads/AdContainer';

interface ToolExecutionState {
  isLoading: boolean;
  progress: number;
  result: any;
  error: string | null;
  executionTime: number | null;
  usage?: {
    dailyUsed: number;
    dailyLimit: number;
    remaining: number;
  };
}

const ToolPage = () => {
  const { toolId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { refreshAds, executionCount } = useAdManager();

  const [input, setInput] = useState(searchParams.get('input') || '');
  const [executionState, setExecutionState] = useState<ToolExecutionState>({
    isLoading: false,
    progress: 0,
    result: null,
    error: null,
    executionTime: null
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const tool = toolId ? getToolById(toolId) : null;

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

  const access = getUserToolAccess(tool, user?.plan || 'free');

  const updateExecutionState = (updates: Partial<ToolExecutionState>) => {
    setExecutionState(prev => ({ ...prev, ...updates }));
  };

  const executeToolAnalysis = async () => {
    if (!input?.trim()) {
      toast({
        title: "Input required",
        description: `Please enter a valid ${tool.inputType.toLowerCase()}.`,
        variant: "destructive",
      });
      return;
    }

    if (!access.canUse) {
      toast({
        title: "Access restricted",
        description: access.reason,
        variant: "destructive",
      });
      return;
    }

    updateExecutionState({ 
      isLoading: true, 
      progress: 0, 
      result: null, 
      error: null,
      executionTime: null 
    });

    // Refresh ads on execution start
    refreshAds();

    try {
      const progressInterval = setInterval(() => {
        updateExecutionState({ 
          progress: Math.min(executionState.progress + 15, 90) 
        });
      }, 300);

      const result = await toolEngine.executeJavaScriptTool(tool, {
        input,
        userPlan: user?.plan || 'free',
        userId: user?.id
      });

      clearInterval(progressInterval);

      if (result.success) {
        updateExecutionState({
          isLoading: false,
          progress: 100,
          result: result.data,
          executionTime: result.executionTime,
          usage: result.usage
        });

        toast({
          title: "Analysis complete",
          description: `${tool.name} executed successfully.`,
        });
      } else {
        updateExecutionState({
          isLoading: false,
          progress: 0,
          error: result.error || 'Unknown error occurred'
        });

        toast({
          title: "Execution failed",
          description: result.error || 'An error occurred during execution.',
          variant: "destructive",
        });
      }
    } catch (error) {
      updateExecutionState({
        isLoading: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });

      toast({
        title: "Execution failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const getCategoryPath = () => {
    const categoryMap: Record<string, string> = {
      'network': '/dashboard/network',
      'dns': '/dashboard/dns',
      'email': '/dashboard/email',
      'security': '/dashboard/security',
      'monitoring': '/dashboard/monitoring'
    };
    return categoryMap[tool.category] || '/dashboard';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-[#6c757d]">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(getCategoryPath())}
            className="text-[#6c757d] hover:text-[#212529] p-0 h-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)} Tools
          </Button>
        </div>

        {/* Tool Header */}
        <div className="border-b border-[#dee2e6] pb-4">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-[#212529]">{tool.name}</h1>
            {!tool.free && (
              <Badge variant="secondary" className="bg-[#f8f9fa] text-[#6c757d] border border-[#dee2e6]">
                <Crown className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            )}
          </div>
          <p className="text-[#6c757d] mb-3">{tool.description}</p>
          <div className="flex flex-wrap gap-1">
            {tool.features.slice(0, 5).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs border-[#dee2e6] text-[#6c757d]">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tool Interface */}
        <Card className="border-[#dee2e6] bg-white">
          <CardHeader>
            <CardTitle className="text-[#212529] text-lg">Tool Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder={tool.inputPlaceholder}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
                  disabled={executionState.isLoading || !access.canUse}
                  onKeyPress={(e) => e.key === 'Enter' && executeToolAnalysis()}
                />
                
                <Button
                  onClick={executeToolAnalysis}
                  disabled={executionState.isLoading || !access.canUse || !input.trim()}
                  className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-none min-w-[120px]"
                >
                  {executionState.isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {executionState.isLoading ? 'Analyzing...' : 'Analyze'}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#6c757d]">
                <div className="flex items-center gap-2">
                  {executionState.usage && (
                    <span>
                      {executionState.usage.dailyUsed}/{executionState.usage.dailyLimit === -1 ? '∞' : executionState.usage.dailyLimit} uses today
                    </span>
                  )}
                  {executionState.executionTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {executionState.executionTime}ms
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Ad Below Form */}
            <AdContainer 
              placement="below-form" 
              className="my-6"
              refreshTrigger={executionCount}
            />

            {/* Progress Bar */}
            {executionState.isLoading && (
              <div className="space-y-2">
                <Progress value={executionState.progress} className="h-2" />
                <p className="text-xs text-[#6c757d] text-center">
                  Analyzing {input}... {executionState.progress}%
                </p>
              </div>
            )}

            {/* Access Warning */}
            {!access.canUse && (
              <div className="p-3 bg-[#fff3cd] border border-[#ffeaa7] rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-[#856404] mt-0.5" />
                  <div className="text-sm text-[#856404]">
                    <p>{access.reason}</p>
                    {access.upgradeRequired && (
                      <a 
                        href="/pricing" 
                        className="text-[#856404] hover:text-[#533608] underline font-medium"
                      >
                        Upgrade now →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Ad Above Results */}
            {(executionState.result || executionState.error) && (
              <AdContainer 
                placement="above-results" 
                className="my-6"
                refreshTrigger={executionCount}
              />
            )}

            {/* Results */}
            {executionState.result && (
              <div className="p-4 bg-[#d4edda] border border-[#c3e6cb] rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#155724] mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-[#155724] mb-3">Analysis completed successfully</p>
                    <pre className="text-sm bg-white/80 p-3 rounded border overflow-auto max-h-96 whitespace-pre-wrap font-mono">
                      {JSON.stringify(executionState.result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {executionState.error && (
              <div className="p-4 bg-[#f8d7da] border border-[#f5c6cb] rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-[#721c24] mt-0.5" />
                  <div className="text-sm text-[#721c24]">
                    <p className="font-medium">Execution failed</p>
                    <p>{executionState.error}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
