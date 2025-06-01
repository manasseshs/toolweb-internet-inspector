
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ActivityItem {
  id: number;
  tool: string;
  target: string;
  result: string;
  time: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
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
          {activities.map((activity) => (
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
  );
};

export default RecentActivity;
