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
      console.log('Fetching all profiles...');
      setLoading(true);
      
      // Wait a bit to ensure any recent user creation has propagated
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} profiles:`, data);
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

  const syncMissingProfiles = async () => {
    try {
      console.log('Checking for users without profiles...');
      toast({
        title: "Syncing",
        description: "Checking for missing user profiles...",
      });

      // This will trigger the edge function to check and create missing profiles
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call a sync function to fix missing profiles
      const response = await fetch(
        `https://dfongkhekhdfkfhgsqke.supabase.co/functions/v1/admin-create-user`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'sync_missing_profiles'
          }),
        }
      );

      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Sync Complete",
          description: "User profiles have been synchronized",
        });
        fetchProfiles(); // Refresh the list
      }
    } catch (error: any) {
      console.error('Error syncing profiles:', error);
      toast({
        title: "Sync Error", 
        description: "Failed to sync user profiles",
        variant: "destructive",
      });
    }
  };

  const handleUserAdded = async () => {
    console.log('New user added, refreshing profiles list...');
    toast({
      title: "User Created",
      description: "Refreshing user list...",
    });
    
    // Refresh the profiles list with a longer delay to ensure the profile is created
    setTimeout(() => {
      fetchProfiles();
    }, 2000);
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
        <div className="flex gap-2">
          <button
            onClick={syncMissingProfiles}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md text-sm"
          >
            Sync Missing Profiles
          </button>
          <AddUserDialog onUserAdded={handleUserAdded} />
        </div>
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
