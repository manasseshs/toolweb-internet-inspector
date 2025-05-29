
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, User, Settings, Clock, TrendingUp, Shield, LogOut, CreditCard, Star, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, tool: 'Blacklist Check', target: '192.168.1.1', result: 'Clean', time: '2 minutes ago' },
    { id: 2, tool: 'MX Lookup', target: 'example.com', result: 'Found 2 records', time: '5 minutes ago' },
    { id: 3, tool: 'Ping Test', target: '8.8.8.8', result: '15ms', time: '10 minutes ago' },
    { id: 4, tool: 'WHOIS', target: 'google.com', result: 'Complete', time: '1 hour ago' }
  ]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-500';
      case 'enterprise': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'pro':
        return ['200 queries/month', 'Advanced DNS tools', 'Email deliverability', 'Priority support'];
      case 'enterprise':
        return ['Unlimited queries', 'All tools included', 'Email migration', '24/7 support', 'Custom integrations'];
      default:
        return ['50 queries/month', 'Basic tools only', 'Community support'];
    }
  };

  const userPlan = user.plan || 'free';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ToolWeb.io</h1>
              <p className="text-sm text-gray-400">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/')} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Back to Tools
            </Button>
            <Button variant="outline" onClick={handleLogout} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Welcome back, {user.email}
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
                        <p className="text-2xl font-bold text-white">47</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Tools Used</p>
                        <p className="text-2xl font-bold text-white">12</p>
                      </div>
                      <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Success Rate</p>
                        <p className="text-2xl font-bold text-white">98%</p>
                      </div>
                      <Clock className="w-8 h-8 text-purple-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
                <CardDescription className="text-gray-400">
                  Your latest tool usage and results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div>
                          <p className="text-white font-medium">{activity.tool}</p>
                          <p className="text-sm text-gray-400">{activity.target}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm">{activity.result}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-800">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Plan */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getPlanColor(userPlan)}`}>
                    {userPlan === 'free' && 'Free'}
                    {userPlan === 'pro' && 'Pro'}
                    {userPlan === 'enterprise' && 'Enterprise'}
                  </div>
                  {userPlan === 'free' && (
                    <p className="text-gray-400 text-sm mt-2">Upgrade for more features</p>
                  )}
                  {user.planExpiry && (
                    <p className="text-gray-400 text-sm mt-2">
                      Renews {new Date(user.planExpiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 mb-4">
                  {getPlanFeatures(userPlan).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {userPlan === 'free' ? (
                    <Button 
                      onClick={() => navigate('/pricing')} 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  ) : (
                    <>
                      <Button 
                        onClick={() => navigate('/pricing')} 
                        variant="outline" 
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <ArrowUpRight className="w-4 h-4 mr-2" />
                        Manage Plan
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
                      >
                        Cancel Subscription
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Tools */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Tools</CardTitle>
                <CardDescription className="text-gray-400">
                  Access your favorite tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { name: 'Blacklist Check', path: '/tools/blacklist' },
                    { name: 'MX Lookup', path: '/tools/mx' },
                    { name: 'Ping Test', path: '/tools/ping' },
                    { name: 'WHOIS', path: '/tools/whois' }
                  ].map((tool) => (
                    <Button
                      key={tool.name}
                      variant="ghost"
                      onClick={() => navigate(tool.path)}
                      className="w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      {tool.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
