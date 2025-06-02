
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Play, RefreshCw, CheckCircle, XCircle, Clock, Zap, Crown } from 'lucide-react';
import { ToolConfig, getUserToolAccess } from '@/config/toolsConfig';
import { toolEngine } from '@/services/toolEngine';
import { useToast } from '@/hooks/use-toast';

interface ToolCategoryPageProps {
  category: string;
  title: string;
  description: string;
  tools: ToolConfig[];
  user: any;
}

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

const ToolCategoryPage: React.FC<ToolCategoryPageProps> = ({
  category,
  title,
  description,
  tools,
  user
}) => {
  const [executionStates, setExecutionStates] = useState<Record<string, ToolExecutionState>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const getExecutionState = (toolId: string): ToolExecutionState => {
    return executionStates[toolId] || {
      isLoading: false,
      progress: 0,
      result: null,
      error: null,
      executionTime: null
    };
  };

  const updateExecutionState = (toolId: string, updates: Partial<ToolExecutionState>) => {
    setExecutionStates(prev => ({
      ...prev,
      [toolId]: { ...getExecutionState(toolId), ...updates }
    }));
  };

  const executeToolAnalysis = async (tool: ToolConfig) => {
    const input = inputs[tool.id];
    if (!input?.trim()) {
      toast({
        title: "Input required",
        description: `Please enter a valid ${tool.inputType.toLowerCase()}.`,
        variant: "destructive",
      });
      return;
    }

    const access = getUserToolAccess(tool, user?.plan || 'free');
    if (!access.canUse) {
      toast({
        title: "Access restricted",
        description: access.reason,
        variant: "destructive",
      });
      return;
    }

    updateExecutionState(tool.id, { 
      isLoading: true, 
      progress: 0, 
      result: null, 
      error: null,
      executionTime: null 
    });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        updateExecutionState(tool.id, { 
          progress: Math.min(getExecutionState(tool.id).progress + 10, 90) 
        });
      }, 200);

      const result = await toolEngine.executeJavaScriptTool(tool, {
        input,
        userPlan: user?.plan || 'free',
        userId: user?.id
      });

      clearInterval(progressInterval);

      if (result.success) {
        updateExecutionState(tool.id, {
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
        updateExecutionState(tool.id, {
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
      updateExecutionState(tool.id, {
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

  const renderToolCard = (tool: ToolConfig) => {
    const access = getUserToolAccess(tool, user?.plan || 'free');
    const state = getExecutionState(tool.id);
    const input = inputs[tool.id] || '';

    return (
      <Card key={tool.id} className="border-[#dee2e6] bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-[#212529]">{tool.name}</h3>
                <div className="flex gap-1">
                  {!tool.free && (
                    <Badge variant="secondary" className="bg-[#f8f9fa] text-[#6c757d] border border-[#dee2e6]">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                  {tool.monitor && (
                    <Badge variant="outline" className="bg-[#e7f3ff] text-[#0d6efd] border border-[#b3d7ff]">
                      <Zap className="w-3 h-3 mr-1" />
                      Monitoring
                    </Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-[#6c757d] mb-3">{tool.description}</p>
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs border-[#dee2e6] text-[#6c757d]">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Input Section */}
            <div className="space-y-2">
              <Input
                placeholder={tool.inputPlaceholder}
                value={input}
                onChange={(e) => setInputs(prev => ({ ...prev, [tool.id]: e.target.value }))}
                className="border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
                disabled={state.isLoading || !access.canUse}
                onKeyPress={(e) => e.key === 'Enter' && executeToolAnalysis(tool)}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#6c757d]">
                  {state.usage && (
                    <span>
                      {state.usage.dailyUsed}/{state.usage.dailyLimit === -1 ? '∞' : state.usage.dailyLimit} today
                    </span>
                  )}
                  {state.executionTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {state.executionTime}ms
                    </span>
                  )}
                </div>
                
                <Button
                  onClick={() => executeToolAnalysis(tool)}
                  disabled={state.isLoading || !access.canUse || !input.trim()}
                  size="sm"
                  className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white border-none"
                >
                  {state.isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {state.isLoading ? 'Running' : 'Analyze'}
                </Button>
              </div>
            </div>

            {/* Progress Bar */}
            {state.isLoading && (
              <div className="space-y-2">
                <Progress value={state.progress} className="h-2" />
                <p className="text-xs text-[#6c757d] text-center">
                  Processing... {state.progress}%
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

            {/* Results */}
            {state.result && (
              <div className="p-3 bg-[#d4edda] border border-[#c3e6cb] rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#155724] mt-0.5" />
                  <div className="text-sm text-[#155724]">
                    <p className="font-medium mb-2">Analysis completed successfully</p>
                    <pre className="text-xs bg-white/50 p-2 rounded border overflow-auto max-h-32">
                      {JSON.stringify(state.result, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {state.error && (
              <div className="p-3 bg-[#f8d7da] border border-[#f5c6cb] rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-[#721c24] mt-0.5" />
                  <div className="text-sm text-[#721c24]">
                    <p className="font-medium">Execution failed</p>
                    <p>{state.error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#dee2e6] pb-4">
        <h1 className="text-2xl font-bold text-[#212529] mb-2">{title}</h1>
        <p className="text-[#6c757d]">{description}</p>
        <div className="flex items-center gap-4 mt-4 text-sm text-[#6c757d]">
          <span>{tools.length} tools available</span>
          <span>•</span>
          <span>Plan: <span className="font-medium text-[#0d6efd]">{(user?.plan || 'free').toUpperCase()}</span></span>
        </div>
      </div>

      {/* Tools Grid */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tools.map(renderToolCard)}
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-[#dee2e6] rounded-lg">
          <AlertCircle className="w-12 h-12 text-[#6c757d] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#212529] mb-2">No tools available</h3>
          <p className="text-[#6c757d]">Tools for this category are coming soon.</p>
        </div>
      )}
    </div>
  );
};

export default ToolCategoryPage;
