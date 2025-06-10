
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap } from 'lucide-react';
import { ToolConfig } from '@/config/toolsConfig';

interface ToolCardHeaderProps {
  tool: ToolConfig;
}

const ToolCardHeader: React.FC<ToolCardHeaderProps> = ({ tool }) => {
  return (
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
  );
};

export default ToolCardHeader;
