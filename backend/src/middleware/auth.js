
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware de autenticação
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.log('No token provided in request');
      return res.status(401).json({ error: 'Token de acesso requerido' });
    }

    console.log('Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded, user ID:', decoded.userId);
    
    // Verificar se o usuário ainda existe e está ativo
    const [users] = await pool.execute(
      'SELECT id, email, status, is_admin FROM users WHERE id = ? AND status = "active"',
      [decoded.userId]
    );

    if (users.length === 0) {
      console.log('User not found or inactive for ID:', decoded.userId);
      return res.status(401).json({ error: 'Usuário não encontrado ou inativo' });
    }

    req.user = users[0];
    console.log('User authenticated successfully:', req.user.email);
    next();
  } catch (error) {
    console.error('DETAILED AUTH MIDDLEWARE ERROR:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Token inválido' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expirado' });
    }
    
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ 
        error: 'Tabela de usuários não encontrada',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(500).json({ 
      error: 'Erro na autenticação',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    console.log('Admin access denied for user:', req.user?.email || 'unknown');
    return res.status(403).json({ error: 'Acesso negado: privilégios de admin necessários' });
  }
  next();
};

module.exports = { authenticateToken, requireAdmin };
