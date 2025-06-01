import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Network, Check, Star, Zap, Crown, ArrowLeft, CreditCard, Mail, Database, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const { user, session, checkSubscription } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Star,
      price: { monthly: 0, annual: 0 },
      priceId: { monthly: null, annual: null },
      description: 'Perfect for getting started',
      features: [
        '10 emails verification per day',
        'Basic IP & DNS tools (with CAPTCHA)',
        '10 GB email migration per account',
        'Community support',
        'Rate limited access'
      ],
      limitations: [
        'CAPTCHA required for all tools',
        'No priority support',
        'Limited daily usage'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      icon: Zap,
      price: { monthly: 9, annual: 90 },
      priceId: { 
        monthly: 'price_1RV28rRvd8wXgl1xGe5tGa6u',
        annual: 'price_1RV2B0Rvd8wXgl1xBjHIT3RL'
      },
      description: 'For professionals and teams',
      popular: true,
      features: [
        '100,000 email verifications per month',
        '20 email migrations per day (any size)',
        'All IP & DNS tools (no CAPTCHA)',
        'Email deliverability tests',
        'SPF/DKIM generators',
        'Priority support',
        'Advanced diagnostics',
        'Export reports'
      ],
      limitations: [
        'Limited to Pro features',
        'Email support only'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Crown,
      price: { monthly: 19, annual: 190 },
      priceId: { 
        monthly: 'price_1RV29bRvd8wXgl1x8nO3IvV7',
        annual: 'price_1RV2CBRvd8wXgl1x9OvEK4ZV'
      },
      description: 'For large organizations',
      features: [
        '1,000,000 email verifications per month',
        '100 email migrations per day (unlimited size)',
        'All tools included (no limits)',
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

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    const plan = plans.find(p => p.id === planId);
    if (!plan?.priceId) {
      toast({
        title: "Error",
        description: "Invalid plan selected.",
        variant: "destructive",
      });
      return;
    }

    const priceId = isAnnual ? plan.priceId.annual : plan.priceId.monthly;
    if (!priceId) {
      toast({
        title: "Error",
        description: "Price ID not configured for this plan.",
        variant: "destructive",
      });
      return;
    }

    setLoading(planId);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          priceId,
          planName: plan.name
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        toast({
          title: "Redirecting to checkout",
          description: "Opening Stripe checkout in a new tab...",
        });
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create checkout session",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const getCurrentPlan = () => {
    return user?.subscription_tier || user?.plan || 'free';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">ToolWeb.io</h1>
          </div>
          <Link to="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Unlock powerful network and email diagnostic tools
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-gray-900' : 'text-gray-600'}`}>Monthly</span>
            <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
            <span className={`text-sm ${isAnnual ? 'text-gray-900' : 'text-gray-600'}`}>Annual</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">Save 17%</Badge>
          </div>
        </div>

        {/* Usage Limits Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="text-center">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-blue-800">Email Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-blue-700">
                <div>Free: 10 emails/day</div>
                <div>Pro: 100,000/month</div>
                <div>Enterprise: 1M/month</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-green-800">Email Migration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-green-700">
                <div>Free: 10 GB/account</div>
                <div>Pro: 20 migrations/day</div>
                <div>Enterprise: 100/day</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader className="text-center">
              <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-purple-800">Tool Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-purple-700">
                <div>Free: CAPTCHA required</div>
                <div>Pro: No CAPTCHA</div>
                <div>Enterprise: Full access</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const currentPlan = getCurrentPlan();
            const isCurrentPlan = currentPlan === plan.id;
            const price = isAnnual ? plan.price.annual : plan.price.monthly;
            const PlanIcon = plan.icon;
            const isLoading = loading === plan.id;

            return (
              <Card 
                key={plan.id} 
                className={`relative bg-white border-gray-200 ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      plan.id === 'free' ? 'bg-gray-100' :
                      plan.id === 'pro' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      <PlanIcon className={`w-6 h-6 ${plan.id === 'free' ? 'text-gray-600' : 'text-white'}`} />
                    </div>
                  </div>
                  <CardTitle className="text-gray-900 text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                  
                  <div className="py-4">
                    <div className="text-4xl font-bold text-gray-900">
                      ${price}
                      {plan.id !== 'free' && (
                        <span className="text-lg text-gray-600">
                          /{isAnnual ? 'year' : 'month'}
                        </span>
                      )}
                    </div>
                    {isAnnual && plan.id !== 'free' && (
                      <p className="text-sm text-gray-500 mt-1">
                        ${plan.price.monthly}/month billed annually
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrentPlan ? (
                    <Button disabled className="w-full bg-gray-100 text-gray-500">
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleSubscribe(plan.id, price)}
                      disabled={isLoading}
                      className={`w-full ${
                        plan.id === 'free' 
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isLoading ? (
                        'Loading...'
                      ) : plan.id === 'free' ? (
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
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
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
              <Card key={index} className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
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
