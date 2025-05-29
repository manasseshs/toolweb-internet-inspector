
import React from 'react';
import { Network, Globe, Mail } from 'lucide-react';
import { Card } from '@/components/ui/card';

export type ToolCategory = 'network' | 'dns' | 'email';

interface TabNavigationProps {
  activeTab: ToolCategory;
  onTabChange: (tab: ToolCategory) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'network' as ToolCategory,
      name: 'Network & IP Tools',
      icon: Network,
      description: 'IP analysis, blacklist checks, ping tests'
    },
    {
      id: 'dns' as ToolCategory,
      name: 'DNS & Domain Tools',
      icon: Globe,
      description: 'DNS records, domain analysis, SSL checks'
    },
    {
      id: 'email' as ToolCategory,
      name: 'Email Tools',
      icon: Mail,
      description: 'Email validation, SMTP tests, migration'
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      {tabs.map((tab) => {
        const TabIcon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Card 
            key={tab.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              isActive 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center ${
                isActive ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
                <TabIcon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              </div>
              <h3 className={`font-semibold mb-2 ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                {tab.name}
              </h3>
              <p className="text-sm text-gray-600">{tab.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TabNavigation;
