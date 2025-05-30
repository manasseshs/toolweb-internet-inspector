
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Server, CheckCircle, XCircle, Settings } from 'lucide-react';

interface ServiceControl {
  id: string;
  service_name: string;
  is_enabled: boolean;
  description?: string;
  updated_at: string;
}

const ServiceControls = () => {
  const [services, setServices] = useState<ServiceControl[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('service_controls')
        .select('*')
        .order('service_name');

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleService = async (serviceId: string, currentStatus: boolean) => {
    setUpdating(serviceId);
    try {
      const { error } = await supabase
        .from('service_controls')
        .update({ 
          is_enabled: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceId);

      if (error) throw error;

      setServices(services.map(service => 
        service.id === serviceId 
          ? { ...service, is_enabled: !currentStatus, updated_at: new Date().toISOString() }
          : service
      ));

      toast({
        title: "Success",
        description: `Service ${!currentStatus ? 'enabled' : 'disabled'} successfully`,
      });
    } catch (error: any) {
      console.error('Error updating service:', error);
      toast({
        title: "Error",
        description: "Failed to update service status",
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  const getServiceIcon = (serviceName: string) => {
    return <Server className="w-5 h-5" />;
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
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-400" />
        <span className="text-gray-300">Manage Platform Services</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${service.is_enabled ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {getServiceIcon(service.service_name)}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">
                      {service.service_name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      {service.description || 'No description available'}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant={service.is_enabled ? 'default' : 'destructive'}>
                  {service.is_enabled ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-1" />
                  )}
                  {service.is_enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Last updated: {new Date(service.updated_at).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={service.is_enabled}
                    onCheckedChange={() => toggleService(service.id, service.is_enabled)}
                    disabled={updating === service.id}
                  />
                  <span className="text-sm text-gray-400">
                    {updating === service.id ? 'Updating...' : (service.is_enabled ? 'On' : 'Off')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No services configured
        </div>
      )}
    </div>
  );
};

export default ServiceControls;
