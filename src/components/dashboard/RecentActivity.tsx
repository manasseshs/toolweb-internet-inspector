
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getToolsByCategory } from '@/config/toolsConfig';

interface ActivityItem {
  id: string;
  tool: string;
  target: string;
  result: string;
  time: string;
  success: boolean;
}

const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentActivity = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data: historyData } = await supabase
          .from('tool_history')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (historyData) {
          // Get all tools to map IDs to names
          const allTools = [
            ...getToolsByCategory('network'),
            ...getToolsByCategory('dns'),
            ...getToolsByCategory('email'),
            ...getToolsByCategory('security')
          ];

          const activities = historyData.map((usage) => {
            const tool = allTools.find(t => t.id === usage.tool_id);
            const toolName = tool?.name || usage.tool_id;
            
            return {
              id: usage.id,
              tool: toolName,
              target: usage.input_data,
              result: 'Success',
              time: new Date(usage.created_at).toLocaleTimeString(),
              success: true
            };
          });

          setActivities(activities);
        }
      } catch (error) {
        console.error('Error fetching recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, [user]);

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
          <CardDescription className="text-gray-400">
            Loading your latest tool usage...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-900/50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-gray-400">
          Your latest tool usage and results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${activity.success ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div>
                    <p className="text-white font-medium">{activity.tool}</p>
                    <p className="text-sm text-gray-400 truncate max-w-[200px]">{activity.target}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm ${activity.success ? 'text-green-400' : 'text-red-400'}`}>
                    {activity.result}
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No recent activity</p>
              <p className="text-sm text-gray-500 mt-1">Start using tools to see your activity here</p>
            </div>
          )}
        </div>
        {activities.length > 0 && (
          <Button variant="outline" className="w-full mt-4 border-gray-600 text-gray-300 hover:bg-gray-800">
            View All Activity
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
