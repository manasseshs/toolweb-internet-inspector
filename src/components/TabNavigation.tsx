
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
    <div className="w-full bg-white/60 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex space-x-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                disabled={tab.id === 'web'} // Desabilitar Web Tools (futuro)
                className={`
                  flex items-center space-x-2 px-6 py-4 text-sm font-medium 
                  whitespace-nowrap border-b-2 transition-all duration-200
                  ${isActive 
                    ? 'text-[#0d6efd] border-[#0d6efd] font-bold' 
                    : tab.id === 'web'
                      ? 'text-gray-400 border-transparent cursor-not-allowed'
                      : 'text-[#6c757d] border-transparent hover:text-[#66b0ff] hover:border-[#66b0ff]'
                  }
                `}
              >
                <TabIcon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.id === 'web' && (
                  <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">
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
