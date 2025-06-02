
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Network, Globe, Mail, Shield, Activity, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: BarChart3,
      path: '/dashboard',
      description: 'Dashboard overview'
    },
    {
      id: 'network',
      label: 'Network Tools',
      icon: Network,
      path: '/dashboard/network',
      description: 'IP, ping, traceroute'
    },
    {
      id: 'dns',
      label: 'DNS Tools',
      icon: Globe,
      path: '/dashboard/dns',
      description: 'DNS records and analysis'
    },
    {
      id: 'email',
      label: 'Email Tools',
      icon: Mail,
      path: '/dashboard/email',
      description: 'Validation and deliverability'
    },
    {
      id: 'security',
      label: 'Security Tools',
      icon: Shield,
      path: '/dashboard/security',
      description: 'SSL, headers, malware'
    },
    {
      id: 'monitoring',
      label: 'Monitoring',
      icon: Activity,
      path: '/dashboard/monitoring',
      description: 'Uptime and alerts'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-[#dee2e6] min-h-[calc(100vh-80px)]">
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  active
                    ? "bg-[#e7f3ff] text-[#0d6efd] border border-[#b3d7ff]"
                    : "text-[#6c757d] hover:bg-[#f8f9fa] hover:text-[#212529]"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 mr-3 flex-shrink-0",
                  active ? "text-[#0d6efd]" : "text-[#6c757d]"
                )} />
                <div className="flex-1 text-left">
                  <div className={cn(
                    "font-medium",
                    active ? "text-[#0d6efd]" : "text-[#212529]"
                  )}>
                    {item.label}
                  </div>
                  <div className="text-xs text-[#6c757d] mt-0.5">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
