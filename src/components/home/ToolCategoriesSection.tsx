
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TabNavigation, { ToolCategory } from '@/components/TabNavigation';
import ToolSelector from '@/components/ToolSelector';

interface ToolCategoriesSectionProps {
  activeTab: ToolCategory;
  onTabChange: (tab: ToolCategory) => void;
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const ToolCategoriesSection: React.FC<ToolCategoriesSectionProps> = ({
  activeTab,
  onTabChange,
  selectedTool,
  onToolSelect
}) => {
  const isDarkMode = activeTab === 'web';

  return (
    <>
      {/* Tool Categories Navigation */}
      <TabNavigation 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />

      {/* Tool Selection */}
      <Card className={`mt-4 mb-4 shadow-sm transition-colors duration-200 ${
        isDarkMode 
          ? 'border-[#475569] bg-[#1e293b]' 
          : 'border-[#dee2e6] bg-white'
      }`}>
        <CardHeader className={`rounded-t-lg border-b transition-colors duration-200 ${
          isDarkMode 
            ? 'bg-[#334155] border-[#475569]' 
            : 'bg-[#f8f9fa] border-[#dee2e6]'
        }`}>
          <CardTitle className={`text-xl ${
            isDarkMode ? 'text-[#f1f5f9]' : 'text-[#212529]'
          }`}>
            Select Tool
          </CardTitle>
          <CardDescription className={isDarkMode ? 'text-[#94a3b8]' : 'text-[#6c757d]'}>
            Choose from our comprehensive suite of network and email analysis tools
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <ToolSelector 
            activeCategory={activeTab}
            selectedTool={selectedTool}
            onToolSelect={onToolSelect}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default ToolCategoriesSection;
