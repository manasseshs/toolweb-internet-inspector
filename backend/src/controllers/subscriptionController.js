
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { pool } = require('../config/database');

// Criar checkout session
const createCheckoutSession = async (req, res) => {
  try {
    const { priceId, planName } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Verificar se o preço é válido
    const validPrices = {
      'pro_monthly': 'price_1RV25WRvd8wXgl1xWVTglsKq',
      'enterprise_monthly': 'price_1RV26RRvd8wXgl1x7DtR8tCU'
    };

    if (!Object.values(validPrices).includes(priceId)) {
      return res.status(400).json({ error: 'Preço inválido' });
    }

    // Verificar se já existe customer no Stripe
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${req.headers.origin}/dashboard?checkout=success`,
      cancel_url: `${req.headers.origin}/pricing?checkout=cancelled`,
      metadata: {
        plan_name: planName,
        user_id: userId.toString(),
      },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Erro ao criar checkout:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Verificar status da assinatura
const checkSubscription = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const userId = req.user.id;

    // Buscar customer no Stripe
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      // Atualizar status no banco
      await pool.execute(
        `INSERT INTO subscribers (email, user_id, subscribed, updated_at) 
         VALUES (?, ?, false, NOW()) 
         ON DUPLICATE KEY UPDATE subscribed = false, updated_at = NOW()`,
        [userEmail, userId]
      );

      return res.json({ subscribed: false });
    }

    const customerId = customers.data[0].id;

    // Buscar assinaturas ativas
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });

    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = null;
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000);
      
      // Determinar tier baseado no preço
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      subscriptionTier = amount <= 999 ? "pro" : "enterprise";

      // Atualizar plano do usuário
      await pool.execute(
        'UPDATE users SET plan = ? WHERE id = ?',
        [subscriptionTier, userId]
      );
    }

    // Atualizar status no banco
    await pool.execute(
      `INSERT INTO subscribers (email, user_id, stripe_customer_id, subscribed, subscription_tier, subscription_end, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW()) 
       ON DUPLICATE KEY UPDATE 
       stripe_customer_id = VALUES(stripe_customer_id),
       subscribed = VALUES(subscribed),
       subscription_tier = VALUES(subscription_tier),
       subscription_end = VALUES(subscription_end),
       updated_at = NOW()`,
      [userEmail, userId, customerId, hasActiveSub, subscriptionTier, subscriptionEnd]
    );

    res.json({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd
    });
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Portal do cliente
const createCustomerPortal = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ error: 'Customer não encontrado no Stripe' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${req.headers.origin}/dashboard`,
    });

    res.json({ url: portalSession.url });
  } catch (error) {
    console.error('Erro ao criar portal:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { createCheckoutSession, checkSubscription, createCustomerPortal };
