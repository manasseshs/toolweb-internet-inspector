
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Zap, 
  ArrowUpRight,
  Mail,
  Network,
  Globe,
  Shield
} from 'lucide-react';

interface DashboardOverviewProps {
  user: any;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ user }) => {
  const navigate = useNavigate();

  const currentPlan = user?.plan || 'free';
  const isSubscribed = user?.subscribed || false;

  const getPlanLimits = (plan: string) => {
    switch (plan) {
      case 'pro':
        return { emails: '100K', migrations: '20/day', tools: 'All tools' };
      case 'enterprise':
        return { emails: '1M+', migrations: '100/day', tools: 'Full suite' };
      default:
        return { emails: '10/day', migrations: '1/day', tools: 'Basic' };
    }
  };

  const limits = getPlanLimits(currentPlan);

  // Mock data for demonstration
  const usageStats = {
    emailsVerified: Math.floor(Math.random() * 1000),
    migrationsCompleted: Math.floor(Math.random() * 5),
    toolsUsed: Math.floor(Math.random() * 20),
    uptime: 99.9
  };

  const recentActivity = [
    { tool: 'Email Validation', target: '500 emails', result: 'Completed', time: '2 minutes ago', status: 'success' },
    { tool: 'Blacklist Check', target: '192.168.1.1', result: 'Clean', time: '5 minutes ago', status: 'success' },
    { tool: 'MX Lookup', target: 'example.com', result: '2 records', time: '10 minutes ago', status: 'success' },
    { tool: 'SSL Test', target: 'mysite.com', result: 'Grade A', time: '1 hour ago', status: 'warning' }
  ];

  const quickActions = [
    { id: 'network', label: 'Network Tools', icon: Network, description: 'IP analysis, ping, traceroute' },
    { id: 'dns', label: 'DNS Tools', icon: Globe, description: 'DNS records and diagnostics' },
    { id: 'email', label: 'Email Tools', icon: Mail, description: 'Validation and deliverability' },
    { id: 'security', label: 'Security Tools', icon: Shield, description: 'SSL, headers, scanning' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#212529]">Welcome back!</h1>
          <p className="text-[#6c757d] mt-1">
            {user?.email} • {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)} Plan
          </p>
        </div>
        <Button 
          onClick={() => navigate('/pricing')}
          className="bg-[#0d6efd] hover:bg-[#0b5ed7] text-white"
        >
          <ArrowUpRight className="w-4 h-4 mr-2" />
          Upgrade Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-[#dee2e6]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6c757d]">Emails Verified</CardTitle>
            <Mail className="h-4 w-4 text-[#0d6efd]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212529]">{usageStats.emailsVerified.toLocaleString()}</div>
            <p className="text-xs text-[#6c757d] mt-1">
              Limit: {limits.emails}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#dee2e6]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6c757d]">Migrations</CardTitle>
            <Activity className="h-4 w-4 text-[#198754]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212529]">{usageStats.migrationsCompleted}</div>
            <p className="text-xs text-[#6c757d] mt-1">
              Limit: {limits.migrations}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#dee2e6]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6c757d]">Tools Used</CardTitle>
            <Zap className="h-4 w-4 text-[#fd7e14]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212529]">{usageStats.toolsUsed}</div>
            <p className="text-xs text-[#6c757d] mt-1">
              Access: {limits.tools}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#dee2e6]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#6c757d]">Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#20c997]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#212529]">{usageStats.uptime}%</div>
            <p className="text-xs text-[#198754] mt-1">
              +0.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white border-[#dee2e6]">
        <CardHeader>
          <CardTitle className="text-[#212529]">Quick Actions</CardTitle>
          <CardDescription className="text-[#6c757d]">
            Jump to your most used tool categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  onClick={() => navigate(`/dashboard/${action.id}`)}
                  className="h-auto p-4 border-[#dee2e6] hover:border-[#0d6efd] hover:bg-[#f8f9fa] flex flex-col items-center space-y-2"
                >
                  <Icon className="w-6 h-6 text-[#0d6efd]" />
                  <div className="text-center">
                    <div className="font-medium text-[#212529]">{action.label}</div>
                    <div className="text-xs text-[#6c757d] mt-1">{action.description}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-white border-[#dee2e6]">
        <CardHeader>
          <CardTitle className="text-[#212529]">Recent Activity</CardTitle>
          <CardDescription className="text-[#6c757d]">
            Your latest tool executions and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-[#dee2e6] last:border-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-[#198754]' : 'bg-[#ffc107]'
                  }`} />
                  <div>
                    <div className="font-medium text-[#212529]">{activity.tool}</div>
                    <div className="text-sm text-[#6c757d]">{activity.target}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-[#212529]">{activity.result}</div>
                  <div className="text-xs text-[#6c757d]">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;
