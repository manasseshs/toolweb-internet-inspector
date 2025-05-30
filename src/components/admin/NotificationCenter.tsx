
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, Globe, User, Megaphone, Settings } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'new_tool' | 'service_update';
  is_global: boolean;
  created_at: string;
  expires_at?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general' as 'general' | 'new_tool' | 'service_update',
    is_global: true,
    expires_at: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendNotification = async () => {
    if (!formData.title || !formData.message) {
      toast({
        title: "Validation Error",
        description: "Title and message are required",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        is_global: formData.is_global,
        target_user_id: formData.is_global ? null : undefined,
        expires_at: formData.expires_at || null
      };

      const { error } = await supabase
        .from('notifications')
        .insert([notificationData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Notification sent successfully",
      });

      // Reset form
      setFormData({
        title: '',
        message: '',
        type: 'general',
        is_global: true,
        expires_at: ''
      });

      // Refresh notifications
      fetchNotifications();
    } catch (error: any) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'new_tool':
        return <Settings className="w-4 h-4" />;
      case 'service_update':
        return <Megaphone className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_tool':
        return 'bg-blue-500';
      case 'service_update':
        return 'bg-orange-500';
      default:
        return 'bg-green-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Send Notification Form */}
      <Card className="bg-gray-900/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send New Notification
          </CardTitle>
          <CardDescription className="text-gray-400">
            Create and send notifications to users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Notification title"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-medium">Type</label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({...formData, type: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="new_tool">New Tool</SelectItem>
                  <SelectItem value="service_update">Service Update</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm font-medium">Message</label>
            <Textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Notification message"
              rows={3}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-300 text-sm font-medium">Expiration (optional)</label>
              <Input
                type="datetime-local"
                value={formData.expires_at}
                onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <Button 
            onClick={sendNotification} 
            disabled={sending}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {sending ? 'Sending...' : 'Send Notification'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card className="bg-gray-900/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Recent Notifications</CardTitle>
          <CardDescription className="text-gray-400">
            Latest notifications sent to users
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`p-1 rounded ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <h4 className="text-white font-medium">{notification.title}</h4>
                        <Badge variant={notification.is_global ? 'default' : 'outline'}>
                          {notification.is_global ? (
                            <>
                              <Globe className="w-3 h-3 mr-1" />
                              Global
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3 mr-1" />
                              Individual
                            </>
                          )}
                        </Badge>
                        <Badge variant="outline" className="text-gray-400 border-gray-600">
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Sent: {new Date(notification.created_at).toLocaleString()}</span>
                        {notification.expires_at && (
                          <span>Expires: {new Date(notification.expires_at).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  No notifications sent yet
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
