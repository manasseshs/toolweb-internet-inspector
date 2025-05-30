
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { User, UserCheck, UserX, Shield } from 'lucide-react';

interface Profile {
  id: string;
  email: string;
  status: 'active' | 'disabled';
  is_admin: boolean;
  created_at: string;
}

const UserManagement = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'disabled') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', userId);

      if (error) throw error;

      setProfiles(profiles.map(profile => 
        profile.id === userId ? { ...profile, status } : profile
      ));

      toast({
        title: "Success",
        description: `User ${status === 'active' ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  const toggleAdminRole = async (userId: string, isAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !isAdmin })
        .eq('id', userId);

      if (error) throw error;

      setProfiles(profiles.map(profile => 
        profile.id === userId ? { ...profile, is_admin: !isAdmin } : profile
      ));

      toast({
        title: "Success",
        description: `Admin role ${!isAdmin ? 'granted' : 'removed'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating admin role:', error);
      toast({
        title: "Error",
        description: "Failed to update admin role",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-400" />
          <span className="text-gray-300">Total Users: {profiles.length}</span>
        </div>
      </div>

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
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={profile.status === 'active'}
                        onCheckedChange={(checked) => 
                          updateUserStatus(profile.id, checked ? 'active' : 'disabled')
                        }
                      />
                      <span className="text-sm text-gray-400">Active</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdminRole(profile.id, profile.is_admin)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      {profile.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserManagement;
