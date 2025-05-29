
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Network, Check, Star, Zap, Crown, ArrowLeft, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const { user, updatePlan } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: [
        '50 queries per month',
        'Basic IP & DNS tools',
        'Community support',
        'Rate limited access'
      ],
      limitations: [
        'No email tools',
        'No advanced features',
        'No priority support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      price: { monthly: 9, annual: 90 },
      description: 'For professionals and teams',
      popular: true,
      features: [
        '200 queries per month',
        'All IP & DNS tools',
        'Email deliverability tests',
        'SPF/DKIM generators',
        'Priority support',
        'Advanced diagnostics',
        'Export reports'
      ],
      limitations: [
        'No email migration',
        'Limited to 200 queries'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 19, annual: 190 },
      description: 'For large organizations',
      features: [
        'Unlimited queries',
        'All tools included',
        'Email migration (IMAP)',
        '24/7 priority support',
        'Custom integrations',
        'API access',
        'Dedicated account manager',
        'SLA guarantee'
      ],
      limitations: []
    }
  ];

  const handleSubscribe = async (planId: string, price: number) => {
    if (!user && planId !== 'free') {
      navigate('/login');
      return;
    }

    if (planId === 'free') {
      toast({
        title: "Already on free plan",
        description: "You're currently using the free plan.",
      });
      return;
    }

    // Simulate Stripe integration
    toast({
      title: "Redirecting to payment...",
      description: "You'll be redirected to Stripe checkout.",
    });

    // Simulate payment success
    setTimeout(() => {
      if (user) {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + (isAnnual ? 12 : 1));
        updatePlan(planId as 'pro' | 'enterprise', expiry.toISOString());
        
        toast({
          title: "Subscription activated!",
          description: `Welcome to ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan!`,
        });
        
        navigate('/dashboard');
      }
    }, 2000);
  };

  const getCurrentPlan = () => {
    return user?.plan || 'free';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">ToolWeb.io</h1>
          </div>
          <Link to="/" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Unlock powerful network and email diagnostic tools
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>Annual</span>
            <Badge variant="secondary" className="bg-green-600 text-white">Save 17%</Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const currentPlan = getCurrentPlan();
            const isCurrentPlan = currentPlan === plan.id;
            const price = isAnnual ? plan.price.annual : plan.price.monthly;
            const PlanIcon = plan.icon;

            return (
              <Card 
                key={plan.id} 
                className={`relative bg-gray-800/50 border-gray-700 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.id === 'free' ? 'bg-gray-600' :
                      plan.id === 'pro' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      <PlanIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-white text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400">{plan.description}</CardDescription>
                  
                  <div className="py-4">
                    <div className="text-4xl font-bold text-white">
                      ${price}
                      {plan.id !== 'free' && (
                        <span className="text-lg text-gray-400">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.id !== 'free' && (
                      <p className="text-sm text-gray-400 mt-1">
                        ${plan.price.monthly}/month billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrentPlan ? (
                    <Button disabled className="w-full bg-gray-600 text-gray-400">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.id, price)}
                      className={`w-full ${
                        plan.id === 'free' 
                          ? 'bg-gray-600 hover:bg-gray-700' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                      }`}
                    >
                      {plan.id === 'free' ? (
                        'Get Started'
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Subscribe Now
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time from your dashboard. You'll continue to have access until the end of your billing period."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards through Stripe and PayPal for convenient payment processing."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance."
              },
              {
                question: "Can I upgrade or downgrade my plan?",
                answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, and downgrades at the next billing cycle."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-gray-800/30 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
