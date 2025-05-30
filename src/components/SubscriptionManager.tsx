
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Crown, Zap, Star, Settings, RefreshCw, ExternalLink } from 'lucide-react';

const SubscriptionManager = () => {
  const { user, session, checkSubscription } = useAuth();
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const { toast } = useToast();

  const refreshSubscription = async () => {
    setLoading(true);
    try {
      await checkSubscription();
      toast({
        title: "Subscription status updated",
        description: "Your subscription information has been refreshed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh subscription status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage your subscription.",
        variant: "destructive",
      });
      return;
    }

    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Opening customer portal",
          description: "Redirecting to Stripe customer portal...",
        });
      }
    } catch (error: any) {
      console.error('Customer portal error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to open customer portal",
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro':
        return <Zap className="w-5 h-5 text-blue-500" />;
      case 'enterprise':
        return <Crown className="w-5 h-5 text-purple-500" />;
      default:
        return <Star className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'pro':
        return 'Pro';
      case 'enterprise':
        return 'Enterprise';
      default:
        return 'Free';
    }
  };

  const currentPlan = user?.subscription_tier || user?.plan || 'free';
  const isSubscribed = user?.subscribed || false;
  const subscriptionEnd = user?.subscription_end;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getPlanIcon(currentPlan)}
            <CardTitle>Subscription Status</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshSubscription}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <CardDescription>
          Manage your subscription and billing information
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Current Plan:</span>
              <Badge variant={isSubscribed ? "default" : "secondary"}>
                {getPlanName(currentPlan)}
              </Badge>
            </div>
            
            {isSubscribed && subscriptionEnd && (
              <p className="text-sm text-gray-600">
                Renews on: {new Date(subscriptionEnd).toLocaleDateString()}
              </p>
            )}
            
            {!isSubscribed && (
              <p className="text-sm text-gray-600">
                Upgrade to unlock premium features
              </p>
            )}
          </div>
          
          <div className="flex space-x-2">
            {isSubscribed && (
              <Button
                variant="outline"
                onClick={openCustomerPortal}
                disabled={portalLoading}
              >
                <Settings className="w-4 h-4 mr-2" />
                {portalLoading ? 'Loading...' : 'Manage'}
              </Button>
            )}
            
            <Button asChild>
              <a href="/pricing">
                <ExternalLink className="w-4 h-4 mr-2" />
                {isSubscribed ? 'Change Plan' : 'Upgrade'}
              </a>
            </Button>
          </div>
        </div>

        {currentPlan === 'free' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Upgrade to Pro or Enterprise</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Remove CAPTCHA requirements</li>
              <li>• Unlimited email verifications</li>
              <li>• Priority support</li>
              <li>• Advanced diagnostic tools</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionManager;
