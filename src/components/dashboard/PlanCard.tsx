
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Star, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface User {
  plan?: string;
  planExpiry?: string;
}

interface PlanCardProps {
  user: User;
}

const PlanCard: React.FC<PlanCardProps> = ({ user }) => {
  const navigate = useNavigate();
  const userPlan = user.plan || 'free';

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-blue-500';
      case 'enterprise': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getPlanFeatures = (plan: string) => {
    switch (plan) {
      case 'pro':
        return ['200 queries/month', 'Advanced DNS tools', 'Email deliverability', 'Priority support'];
      case 'enterprise':
        return ['Unlimited queries', 'All tools included', 'Email migration', '24/7 support', 'Custom integrations'];
      default:
        return ['50 queries/month', 'Basic tools only', 'Community support'];
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Current Plan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getPlanColor(userPlan)}`}>
            {userPlan === 'free' && 'Free'}
            {userPlan === 'pro' && 'Pro'}
            {userPlan === 'enterprise' && 'Enterprise'}
          </div>
          {userPlan === 'free' && (
            <p className="text-gray-400 text-sm mt-2">Upgrade for more features</p>
          )}
          {user.planExpiry && (
            <p className="text-gray-400 text-sm mt-2">
              Renews {new Date(user.planExpiry).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          {getPlanFeatures(userPlan).map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {userPlan === 'free' ? (
            <Button 
              onClick={() => navigate('/pricing')} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Star className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/pricing')} 
                variant="outline" 
                className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowUpRight className="w-4 h-4 mr-2" />
                Manage Plan
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-red-600 text-red-400 hover:bg-red-900/20"
              >
                Cancel Subscription
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
