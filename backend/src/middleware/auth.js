
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE START ===');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);
    
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted token:', token ? 'Token exists' : 'No token');

    if (!token) {
      console.log('❌ No token provided in request');
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    console.log('🔍 Verifying JWT token...');
    console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded successfully, user ID:', decoded.userId);
    
    // Verificar se o usuário ainda existe e está ativo
    console.log('📊 Checking user in database...');
    const [users] = await pool.execute(
      'SELECT id, email, status, is_admin FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    console.log('Database query result:', users.length, 'users found');
    if (users.length > 0) {
      console.log('User found:', { id: users[0].id, email: users[0].email, status: users[0].status });
    }

    if (users.length === 0) {
      console.log('❌ User not found or inactive for ID:', decoded.userId);
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
    }

    req.user = users[0];
    console.log('✅ User authenticated successfully:', req.user.email);
    console.log('=== AUTH MIDDLEWARE END ===');
    next();
  } catch (error) {
    console.error('💥 DETAILED AUTH MIDDLEWARE ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      errno: error.errno
    });
    
    if (error.name === 'JsonWebTokenError') {
      console.log('❌ JWT Error - Invalid token');
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    if (error.name === 'TokenExpiredError') {
      console.log('❌ JWT Error - Token expired');
      return res.status(403).json({ error: 'Token expirado' });
    }
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('❌ Database Error - Users table not found');
      return res.status(500).json({ 
        error: 'Tabela de usuários não encontrada',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    console.log('❌ Generic auth error');
    return res.status(500).json({ 
      error: 'Erro na autenticação',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  console.log('🔒 Checking admin privileges...');
  console.log('User:', req.user ? { id: req.user.id, email: req.user.email, is_admin: req.user.is_admin } : 'No user');
  
  if (!req.user || !req.user.is_admin) {
    console.log('❌ Admin access denied for user:', req.user?.email || 'unknown');
    return res.status(403).json({ error: 'Acesso negado: privilégios de admin necessários' });
  }
  
  console.log('✅ Admin access granted');
  next();
};

module.exports = { authenticateToken, requireAdmin };
