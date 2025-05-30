
import React from 'react';
import { Network, Globe, Mail, Globe2 } from 'lucide-react';

export type ToolCategory = 'network' | 'dns' | 'email' | 'web';

interface TabNavigationProps {
  activeTab: ToolCategory;
  onTabChange: (tab: ToolCategory) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'network' as ToolCategory,
      name: 'Network Tools',
      icon: Network,
    },
    {
      id: 'dns' as ToolCategory,
      name: 'DNS Tools',
      icon: Globe,
    },
    {
      id: 'email' as ToolCategory,
      name: 'Email Tools',
      icon: Mail,
    },
    {
      id: 'web' as ToolCategory,
      name: 'Web Tools',
      icon: Globe2,
    }
  ];

  return (
    <div className="w-full bg-white border-b border-[#dee2e6]">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                disabled={tab.id === 'web'}
                className={`
                  flex items-center space-x-2 px-4 py-3 text-sm font-medium 
                  whitespace-nowrap border-b-2 transition-all duration-200
                  ${isActive 
                    ? 'text-[#0d6efd] border-[#0d6efd] bg-white' 
                    : tab.id === 'web'
                      ? 'text-[#6c757d] border-transparent cursor-not-allowed bg-white'
                      : 'text-[#6c757d] border-transparent hover:text-[#0d6efd] hover:border-[#0d6efd] bg-white'
                  }
                `}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.id === 'web' && (
                  <span className="text-xs bg-[#f8f9fa] text-[#6c757d] px-2 py-1 rounded border border-[#dee2e6]">
                    Em breve
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
