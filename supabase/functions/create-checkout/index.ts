
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Helper logging function for enhanced debugging
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

// Valid price IDs mapping
const VALID_PRICE_IDS = {
  // Monthly plans
  'pro_monthly': 'price_1RV25WRvd8wXgl1xWVTglsKq',
  'enterprise_monthly': 'price_1RV26RRvd8wXgl1x7DtR8tCU',
  // Add yearly plans here when available
  // 'pro_yearly': 'price_xxxxx',
  // 'enterprise_yearly': 'price_xxxxx'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    logStep("Function started");

    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')

    // Verify the requesting user is authenticated
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      logStep("Authentication failed", { error: authError?.message });
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    logStep("User authenticated", { userId: user.id, email: user.email });

    // Parse the request body
    const { priceId, planName } = await req.json()
    logStep("Request parameters received", { priceId, planName });

    if (!priceId || !planName) {
      return new Response(
        JSON.stringify({ error: 'Price ID and plan name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate price ID against our known valid prices
    const validPriceIds = Object.values(VALID_PRICE_IDS);
    if (!validPriceIds.includes(priceId)) {
      logStep("ERROR: Price ID not in valid list", { 
        priceId, 
        validPriceIds,
        knownPlans: Object.keys(VALID_PRICE_IDS)
      });
      return new Response(
        JSON.stringify({ 
          error: `Invalid price ID: ${priceId}. Valid price IDs are: ${validPriceIds.join(', ')}`,
          validPlans: Object.keys(VALID_PRICE_IDS)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      logStep("ERROR: Stripe secret key not found");
      return new Response(
        JSON.stringify({ error: 'Stripe configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const Stripe = (await import('https://esm.sh/stripe@14.21.0')).default;
    const stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });

    // Validate the price exists in Stripe before proceeding
    try {
      const price = await stripe.prices.retrieve(priceId);
      logStep("Price validated", { priceId, amount: price.unit_amount, currency: price.currency, interval: price.recurring?.interval });
      
      if (!price.active) {
        logStep("ERROR: Price is not active", { priceId });
        return new Response(
          JSON.stringify({ error: `Price ${priceId} is not active. Please check your Stripe dashboard.` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } catch (priceError: any) {
      logStep("ERROR: Invalid price ID", { priceId, error: priceError.message });
      return new Response(
        JSON.stringify({ 
          error: `Invalid price ID: ${priceId}. Please verify this price exists in your Stripe dashboard.`,
          details: priceError.message
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check for existing customer
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      logStep("No existing customer found");
    }

    // Create checkout session
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const sessionParams = {
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription' as const,
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=cancelled`,
      metadata: {
        plan_name: planName,
        user_id: user.id,
      },
    };

    logStep("Creating checkout session", sessionParams);

    const session = await stripe.checkout.sessions.create(sessionParams);

    logStep("Checkout session created successfully", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    logStep("ERROR in create-checkout", { message: error.message, stack: error.stack });
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more details'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
