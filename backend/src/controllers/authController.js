
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validationResult } = require('express-validator');

// Gerar JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Registro de usuário
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, plan = 'free' } = req.body;

    // Verificar se usuário já existe
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inserir usuário
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, plan, status, created_at) VALUES (?, ?, ?, "active", NOW())',
      [email, hashedPassword, plan]
    );

    const userId = result.insertId;
    const token = generateToken(userId);

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { id: userId, email, plan },
      token
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Buscar usuário
    const [users] = await pool.execute(
      'SELECT id, email, password_hash, plan, status, is_admin FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = users[0];

    if (user.status !== 'active') {
      return res.status(401).json({ error: 'Conta desativada' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        is_admin: user.is_admin
      },
      token
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      is_admin: req.user.is_admin
    }
  });
};

module.exports = { register, login, verifyToken };
