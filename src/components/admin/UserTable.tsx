
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserCheck, UserX, Shield, User } from 'lucide-react';
import UserActions from './UserActions';

interface Profile {
  id: string;
  email: string;
  status: 'active' | 'disabled';
  is_admin: boolean;
  created_at: string;
}

interface UserTableProps {
  profiles: Profile[];
  onStatusChange: (userId: string, status: 'active' | 'disabled') => void;
  onAdminToggle: (userId: string, isAdmin: boolean) => void;
  onImpersonate: (userEmail: string) => void;
}

const UserTable = ({ profiles, onStatusChange, onAdminToggle, onImpersonate }: UserTableProps) => {
  return (
    <div className="rounded-md border border-gray-700">
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700">
            <TableHead className="text-gray-300">Email</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Role</TableHead>
            <TableHead className="text-gray-300">Created</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow key={profile.id} className="border-gray-700">
              <TableCell className="text-gray-300">{profile.email}</TableCell>
              <TableCell>
                <Badge variant={profile.status === 'active' ? 'default' : 'destructive'}>
                  {profile.status === 'active' ? (
                    <UserCheck className="w-3 h-3 mr-1" />
                  ) : (
                    <UserX className="w-3 h-3 mr-1" />
                  )}
                  {profile.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {profile.is_admin && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                      <Shield className="w-3 h-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                  {!profile.is_admin && (
                    <Badge variant="outline" className="text-gray-400 border-gray-600">
                      <User className="w-3 h-3 mr-1" />
                      User
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-gray-400">
                {new Date(profile.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <UserActions
                  userId={profile.id}
                  userEmail={profile.email}
                  status={profile.status}
                  isAdmin={profile.is_admin}
                  onStatusChange={onStatusChange}
                  onAdminToggle={onAdminToggle}
                  onImpersonate={onImpersonate}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
