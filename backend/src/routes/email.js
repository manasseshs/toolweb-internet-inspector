
const express = require('express');
const { body } = require('express-validator');
const { verifyEmails, getVerificationHistory } = require('../controllers/emailController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validações
const verifyEmailsValidation = [
  body('emails').isArray({ min: 1 }).withMessage('Lista de emails é obrigatória'),
  body('emails.*').isEmail().withMessage('Formato de email inválido')
];

// Rotas protegidas
router.use(authenticateToken);

router.post('/verify', verifyEmailsValidation, verifyEmails);
router.get('/history', getVerificationHistory);

module.exports = router;
