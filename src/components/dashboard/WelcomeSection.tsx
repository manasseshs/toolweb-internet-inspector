
import React from 'react';
import { User, TrendingUp, Shield, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUsageStats } from '@/hooks/useUsageStats';

interface WelcomeSectionProps {
  userEmail: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userEmail }) => {
  const { stats, loading } = useUsageStats();

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="w-5 h-5" />
            Welcome back, {userEmail}
          </CardTitle>
          <CardDescription className="text-gray-400">
            Loading your dashboard overview...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900/50 rounded-lg p-4 animate-pulse">
                <div className="h-16 bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="w-5 h-5" />
          Welcome back, {userEmail}
        </CardTitle>
        <CardDescription className="text-gray-400">
          Here's your network tools dashboard overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Queries Today</p>
                <p className="text-2xl font-bold text-white">{stats.queriesToday}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Tools Used</p>
                <p className="text-2xl font-bold text-white">{stats.toolsUsed}</p>
              </div>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-white">{stats.successRate}%</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
