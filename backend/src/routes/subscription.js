
const express = require('express');
const { body } = require('express-validator');
const { 
  createCheckoutSession, 
  checkSubscription, 
  createCustomerPortal 
} = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validações
const checkoutValidation = [
  body('priceId').notEmpty().withMessage('Price ID é obrigatório'),
  body('planName').notEmpty().withMessage('Nome do plano é obrigatório')
];

// Rotas protegidas
router.use(authenticateToken);

router.post('/create-checkout', checkoutValidation, createCheckoutSession);
router.get('/status', checkSubscription);
router.post('/customer-portal', createCustomerPortal);

module.exports = router;
