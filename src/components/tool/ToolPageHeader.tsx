
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Crown } from 'lucide-react';
import { ToolConfig } from '@/config/toolsConfig';

interface ToolPageHeaderProps {
  tool: ToolConfig;
}

const ToolPageHeader: React.FC<ToolPageHeaderProps> = ({ tool }) => {
  const navigate = useNavigate();

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
    <div className="space-y-6">
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
    </div>
  );
};

export default ToolPageHeader;
