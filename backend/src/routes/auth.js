
const express = require('express');
const { body } = require('express-validator');
const { register, login, verifyToken } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validações
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória')
];

// Rotas
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;
