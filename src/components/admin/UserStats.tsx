
import React from 'react';
import { Users } from 'lucide-react';

interface UserStatsProps {
  userCount: number;
}

const UserStats = ({ userCount }: UserStatsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Users className="w-5 h-5 text-gray-400" />
      <span className="text-gray-300">Total Users: {userCount}</span>
    </div>
  );
};

export default UserStats;
