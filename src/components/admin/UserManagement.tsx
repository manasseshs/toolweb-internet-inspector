
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import UserStats from './UserStats';
import AddUserDialog from './AddUserDialog';
import UserTable from './UserTable';

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
  const navigate = useNavigate();

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
        description: `User ${status === 'active' ? 'activated' : 'suspended'} successfully`,
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

  const impersonateUser = async (userEmail: string) => {
    // In a real implementation, you would need a secure impersonation system
    // For demonstration purposes, we'll show how this would work
    toast({
      title: "Impersonation Started",
      description: `Now viewing as ${userEmail}. Navigate to dashboard to see their view.`,
    });
    
    // Store impersonation state in localStorage for demo
    localStorage.setItem('impersonating', userEmail);
    
    // Navigate to dashboard
    navigate('/dashboard');
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
        <UserStats userCount={profiles.length} />
        <AddUserDialog onUserAdded={fetchProfiles} />
      </div>

      <UserTable
        profiles={profiles}
        onStatusChange={updateUserStatus}
        onAdminToggle={toggleAdminRole}
        onImpersonate={impersonateUser}
      />
    </div>
  );
};

export default UserManagement;
