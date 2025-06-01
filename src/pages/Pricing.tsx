
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
      description: 'Perfect for getting started with network diagnostics',
      targetAudience: 'For individuals and small projects',
      features: [
        '**10 email verifications per day** – Test email validity for small lists',
        '**Basic IP & DNS tools** (with CAPTCHA) – Essential network diagnostics',
        '**10 GB email migration** per account – Move your email data safely',
        '**Community support** – Get help from our user community',
        '**Rate limited access** – All core tools available with usage limits'
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
      description: 'Professional-grade tools for growing teams and businesses',
      targetAudience: 'For growing teams and email marketers',
      popular: true,
      features: [
        '**Verify up to 100,000 emails per month** – Perfect for marketing campaigns and list management',
        '**20 email migrations per day** (unlimited size) – Seamless email transfers',
        '**All IP & DNS tools without CAPTCHA** – Uninterrupted workflow and productivity',
        '**Email deliverability testing** – Ensure your emails reach the inbox',
        '**Advanced SPF/DKIM generators** – Secure your email authentication',
        '**Priority email support** – Get expert help when you need it',
        '**Advanced diagnostic reports** – Deep insights into your network infrastructure',
        '**Export detailed reports** – Share findings with your team'
      ],
      limitations: [
        'Email support only (no phone)',
        'Standard SLA response times'
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
      description: 'Enterprise-scale infrastructure monitoring and management',
      targetAudience: 'For large organizations and enterprise infrastructure',
      features: [
        '**Process 1M+ email verifications monthly** – Handle massive email databases with ease',
        '**100 email migrations daily** (unlimited size) – Enterprise-grade email transitions',
        '**Complete tool suite access** – No limits, no restrictions, full power',
        '**Advanced IMAP email migration** – Sophisticated email server transfers',
        '**24/7 priority support with SLA** – Guaranteed response times and dedicated assistance',
        '**Custom API integrations** – Build ToolWeb.io into your existing workflows',
        '**Full API access** – Automate all network diagnostics and email tools',
        '**Dedicated account manager** – Personal point of contact for your organization',
        '**99.9% SLA guarantee** – Enterprise-level reliability and uptime'
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
          
          {/* Improved Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`text-sm font-medium transition-colors ${!isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>Monthly</span>
            <div className="relative">
              <Switch 
                checked={isAnnual} 
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300"
              />
            </div>
            <span className={`text-sm font-medium transition-colors ${isAnnual ? 'text-blue-600' : 'text-gray-500'}`}>Annual</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Save 17%</Badge>
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
                  <CardDescription className="text-gray-600 mb-2">{plan.description}</CardDescription>
                  <p className="text-sm font-medium text-blue-600">{plan.targetAudience}</p>
                  
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
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span 
                          className="text-gray-700 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: feature }}
                        />
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

      {/* Global Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">ToolWeb.io</h3>
              </div>
              <p className="text-gray-600 text-sm">The essential toolkit for domains, IP addresses, and network diagnostics.</p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">Popular Tools</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/blacklist-check" className="hover:text-blue-500 transition-colors">Blacklist Check</a></li>
                <li><a href="/mx-record" className="hover:text-blue-500 transition-colors">MX Lookup</a></li>
                <li><a href="/ping-test" className="hover:text-blue-500 transition-colors">Ping Test</a></li>
                <li><a href="/whois-lookup" className="hover:text-blue-500 transition-colors">WHOIS</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">Account</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/login" className="hover:text-blue-500 transition-colors">Login</a></li>
                <li><a href="/register" className="hover:text-blue-500 transition-colors">Register</a></li>
                <li><a href="/pricing" className="hover:text-blue-500 transition-colors">Pricing</a></li>
                <li><a href="/dashboard" className="hover:text-blue-500 transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/contact" className="hover:text-blue-500 transition-colors">Contact Us</a></li>
                <li><a href="/help" className="hover:text-blue-500 transition-colors">Help Center</a></li>
                <li><a href="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-blue-500 transition-colors">Terms of Use</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-6 text-center text-gray-600 text-sm">
            <p>&copy; 2024 ToolWeb.io. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
