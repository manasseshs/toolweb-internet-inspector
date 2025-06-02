
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
    console.log('Registration attempt started for:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, plan = 'free' } = req.body;
    console.log('Registration data validated, checking if user exists...');

    // Verificar se usuário já existe
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    console.log('User does not exist, creating password hash...');
    
    // Hash da senha
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Inserir usuário
    console.log('Inserting user into database...');
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, plan, status, created_at) VALUES (?, ?, ?, "active", NOW())',
      [email, hashedPassword, plan]
    );

    const userId = result.insertId;
    console.log('User created successfully with ID:', userId);
    
    const token = generateToken(userId);
    console.log('JWT token generated for user');

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: { id: userId, email, plan },
      token
    });
  } catch (error) {
    console.error('DETAILED REGISTRATION ERROR:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      sql: error.sql
    });
    
    // Check for specific MySQL errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        error: 'Tabela de usuários não encontrada. Execute o script de configuração do banco.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        error: 'Erro de conexão com o banco de dados',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    console.log('Login attempt started for:', req.body.email);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Login validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Login data validated, searching for user...');

    // Buscar usuário
    const [users] = await pool.execute(
      'SELECT id, email, password_hash, plan, status, is_admin FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('User not found with email:', email);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = users[0];
    console.log('User found, checking status and password...');

    if (user.status !== 'active') {
      console.log('User account is not active:', user.status);
      return res.status(401).json({ error: 'Conta desativada' });
    }

    // Verificar senha
    console.log('Comparing password with hash...');
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    console.log('Password valid, generating token...');
    const token = generateToken(user.id);
    console.log('Login successful for user:', email);

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
    console.error('DETAILED LOGIN ERROR:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      sql: error.sql
    });
    
    // Check for specific MySQL errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        error: 'Tabela de usuários não encontrada. Execute o script de configuração do banco.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ 
        error: 'Erro de conexão com o banco de dados',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    console.log('Token verification for user ID:', req.user.id);
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        is_admin: req.user.is_admin
      }
    });
  } catch (error) {
    console.error('DETAILED TOKEN VERIFICATION ERROR:', {
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Erro na verificação do token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { register, login, verifyToken };
