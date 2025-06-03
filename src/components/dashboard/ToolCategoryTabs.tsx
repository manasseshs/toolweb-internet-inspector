
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Play, RefreshCw, CheckCircle, XCircle, Clock, Crown } from 'lucide-react';
import { ToolConfig, getUserToolAccess } from '@/config/toolsConfig';
import { toolEngine } from '@/services/toolEngine';
import { useToast } from '@/hooks/use-toast';

interface ToolCategoryTabsProps {
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

const ToolCategoryTabs: React.FC<ToolCategoryTabsProps> = ({
  category,
  title,
  description,
  tools,
  user
}) => {
  const [activeTab, setActiveTab] = useState(tools[0]?.id || '');
  const [executionState, setExecutionState] = useState<ToolExecutionState>({
    isLoading: false,
    progress: 0,
    result: null,
    error: null,
    executionTime: null
  });
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const updateExecutionState = (updates: Partial<ToolExecutionState>) => {
    setExecutionState(prev => ({ ...prev, ...updates }));
  };

  const executeToolAnalysis = async (tool: ToolConfig) => {
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

    updateExecutionState({ 
      isLoading: true, 
      progress: 0, 
      result: null, 
      error: null,
      executionTime: null 
    });

    try {
      // Simulate progress updates
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

  const handleTabChange = (toolId: string) => {
    setActiveTab(toolId);
    setInput('');
    setExecutionState({
      isLoading: false,
      progress: 0,
      result: null,
      error: null,
      executionTime: null
    });
  };

  if (tools.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-[#dee2e6] rounded-lg">
        <AlertCircle className="w-12 h-12 text-[#6c757d] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#212529] mb-2">No tools available</h3>
        <p className="text-[#6c757d]">Tools for this category are coming soon.</p>
      </div>
    );
  }

  const activeTool = tools.find(tool => tool.id === activeTab) || tools[0];
  const access = getUserToolAccess(activeTool, user?.plan || 'free');

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

      {/* Tool Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full bg-[#f8f9fa] p-1 h-auto" style={{ gridTemplateColumns: `repeat(${tools.length}, minmax(0, 1fr))` }}>
          {tools.map((tool) => (
            <TabsTrigger 
              key={tool.id} 
              value={tool.id}
              className="text-sm font-medium text-[#6c757d] data-[state=active]:bg-white data-[state=active]:text-[#0d6efd] data-[state=active]:border data-[state=active]:border-[#b3d7ff] p-3"
            >
              <div className="text-center">
                <div className="font-medium">{tool.name}</div>
                <div className="text-xs text-[#6c757d] mt-1">
                  {tool.inputType}
                </div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <Card className="border-[#dee2e6] bg-white">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-[#212529]">{activeTool.name}</CardTitle>
                    <div className="flex gap-1">
                      {!activeTool.free && (
                        <Badge variant="secondary" className="bg-[#f8f9fa] text-[#6c757d] border border-[#dee2e6]">
                          <Crown className="w-3 h-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-[#6c757d] mb-3">{activeTool.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {activeTool.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-[#dee2e6] text-[#6c757d]">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Input Section */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder={activeTool.inputPlaceholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 border-[#dee2e6] bg-white text-[#212529] placeholder:text-[#6c757d] focus:border-[#0d6efd] focus:ring-[#0d6efd]"
                    disabled={executionState.isLoading || !access.canUse}
                    onKeyPress={(e) => e.key === 'Enter' && executeToolAnalysis(activeTool)}
                  />
                  
                  <Button
                    onClick={() => executeToolAnalysis(activeTool)}
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
                        {executionState.usage.dailyUsed}/{executionState.usage.dailyLimit === -1 ? '∞' : executionState.usage.dailyLimit} today
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

              {/* Results */}
              {executionState.result && (
                <div className="p-4 bg-[#d4edda] border border-[#c3e6cb] rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#155724] mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-[#155724] mb-3">Analysis completed successfully</p>
                      <pre className="text-sm bg-white/80 p-3 rounded border overflow-auto max-h-96 whitespace-pre-wrap">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ToolCategoryTabs;
