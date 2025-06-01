
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Eye } from 'lucide-react';

interface UserActionsProps {
  userId: string;
  userEmail: string;
  status: 'active' | 'disabled';
  isAdmin: boolean;
  onStatusChange: (userId: string, status: 'active' | 'disabled') => void;
  onAdminToggle: (userId: string, isAdmin: boolean) => void;
  onImpersonate: (userEmail: string) => void;
}

const UserActions = ({
  userId,
  userEmail,
  status,
  isAdmin,
  onStatusChange,
  onAdminToggle,
  onImpersonate
}: UserActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <Switch
          checked={status === 'active'}
          onCheckedChange={(checked) => 
            onStatusChange(userId, checked ? 'active' : 'disabled')
          }
        />
        <span className="text-sm text-gray-400">Active</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAdminToggle(userId, isAdmin)}
        className="border-gray-600 text-gray-300 hover:bg-gray-700"
      >
        {isAdmin ? 'Remove Admin' : 'Make Admin'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onImpersonate(userEmail)}
        className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
      >
        <Eye className="w-3 h-3 mr-1" />
        View As
      </Button>
    </div>
  );
};

export default UserActions;
