
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, Bell, Settings } from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import NotificationCenter from '@/components/admin/NotificationCenter';
import ServiceControls from '@/components/admin/ServiceControls';

const Admin = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Check if user is admin (for now, we'll check if user exists - this will be enhanced with proper admin check)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                <p className="text-gray-400">Manage users, services, and notifications</p>
              </div>
            </div>
          </div>

          {/* Admin Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border-gray-700">
              <TabsTrigger value="users" className="data-[state=active]:bg-gray-700 text-gray-300">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700 text-gray-300">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="services" className="data-[state=active]:bg-gray-700 text-gray-300">
                <Settings className="w-4 h-4 mr-2" />
                Services
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">User Management</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UserManagement />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Notification Center</CardTitle>
                  <CardDescription className="text-gray-400">
                    Send notifications to users and manage announcements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationCenter />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services" className="mt-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Service Controls</CardTitle>
                  <CardDescription className="text-gray-400">
                    Enable or disable platform services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ServiceControls />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Admin;
