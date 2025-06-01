
import React from 'react';
import { Network } from 'lucide-react';
import { toolSEOConfig } from '@/utils/seoConfig';

interface HeroSectionProps {
  selectedTool: string;
  userIP: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ selectedTool, userIP }) => {
  return (
    <div className="text-center mb-4">
      <div className="mb-4">
        {/* Robot Mascot */}
        <div className="w-16 h-16 bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Network className="w-8 h-8 text-white" />
        </div>
        
        {selectedTool && toolSEOConfig[selectedTool] ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-[#212529] mb-3 leading-tight">
              {toolSEOConfig[selectedTool].h1}
            </h1>
            <h2 className="text-xl text-[#6c757d] mb-4 max-w-2xl mx-auto">
              {toolSEOConfig[selectedTool].h2}
            </h2>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-[#212529] mb-3 leading-tight">
              Professional Network
              <span className="block bg-gradient-to-r from-[#0d6efd] to-[#6f42c1] bg-clip-text text-transparent">
                Diagnostic Tools
              </span>
            </h1>
            <h2 className="text-lg text-[#6c757d] mb-4 max-w-2xl mx-auto">
              Analyze IP addresses, domains, and email systems with precision and ease
            </h2>
          </>
        )}
        
        <div className="inline-flex items-center bg-white rounded-full px-5 py-2 border border-[#dee2e6] shadow-sm">
          <span className="text-[#6c757d] mr-2">Hello</span>
          <span className="text-[#0d6efd] font-mono font-semibold bg-[#f8f9fa] px-3 py-1 rounded-full text-sm border border-[#dee2e6]">
            {userIP}
          </span>
          <span className="text-[#6c757d] ml-2">, what can I help you with today?</span>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
