
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
    <div className="grid md:grid-cols-3 gap-6">
      {tabs.map((tab) => {
        const TabIcon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <Card 
            key={tab.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-white/60 backdrop-blur-sm ${
              isActive 
                ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl ring-2 ring-indigo-200' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className="p-6 text-center">
              <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg' 
                  : 'bg-slate-100 hover:bg-slate-200'
              }`}>
                <TabIcon className={`w-7 h-7 ${isActive ? 'text-white' : 'text-slate-600'}`} />
              </div>
              <h3 className={`font-semibold mb-2 text-lg ${
                isActive ? 'text-indigo-700' : 'text-slate-800'
              }`}>
                {tab.name}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{tab.description}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default TabNavigation;
