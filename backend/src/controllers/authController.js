
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validationResult } = require('express-validator');

// Gerar JWT token
const generateToken = (userId) => {
  console.log('🔑 Generating JWT token for user ID:', userId);
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
  console.log('JWT_EXPIRES_IN:', process.env.JWT_EXPIRES_IN);
  
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  
  console.log('✅ JWT token generated successfully');
  return token;
};

// Registro de usuário
const register = async (req, res) => {
  try {
    console.log('=== REGISTRATION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Environment check:');
    console.log('- NODE_ENV:', process.env.NODE_ENV);
    console.log('- DB_HOST:', process.env.DB_HOST);
    console.log('- DB_NAME:', process.env.DB_NAME);
    console.log('- DB_USER:', process.env.DB_USER);
    console.log('- JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        error: 'Dados inválidos',
        errors: errors.array() 
      });
    }

    const { email, password, plan = 'free' } = req.body;
    console.log('📝 Registration data validated');
    console.log('- Email:', email);
    console.log('- Plan:', plan);
    console.log('- Password length:', password ? password.length : 0);

    // Verificar se usuário já existe
    console.log('🔍 Checking if user already exists...');
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    console.log('Database check result:', existingUsers.length, 'existing users found');

    if (existingUsers.length > 0) {
      console.log('❌ User already exists with email:', email);
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    console.log('✅ User does not exist, proceeding with registration');
    
    // Hash da senha
    console.log('🔒 Creating password hash...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('✅ Password hashed successfully');

    // Inserir usuário
    console.log('💾 Inserting user into database...');
    const insertQuery = 'INSERT INTO users (email, password_hash, plan, status, created_at) VALUES (?, ?, ?, "active", NOW())';
    console.log('Insert query:', insertQuery);
    console.log('Insert values:', [email, '[HIDDEN]', plan]);
    
    const [result] = await pool.execute(insertQuery, [email, hashedPassword, plan]);

    const userId = result.insertId;
    console.log('✅ User created successfully with ID:', userId);
    console.log('Insert result:', { 
      insertId: result.insertId, 
      affectedRows: result.affectedRows 
    });
    
    console.log('🔑 Generating authentication token...');
    const token = generateToken(userId);

    const responseData = {
      message: 'Usuário criado com sucesso',
      user: { id: userId, email, plan },
      token
    };
    
    console.log('📤 Sending success response');
    console.log('Response data:', JSON.stringify(responseData, null, 2));
    console.log('=== REGISTRATION END ===');
    
    res.status(201).json(responseData);
  } catch (error) {
    console.error('💥 DETAILED REGISTRATION ERROR:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    console.error('SQL Message:', error.sqlMessage);
    console.error('SQL State:', error.sqlState);
    console.error('SQL:', error.sql);
    console.error('Stack trace:', error.stack);
    
    // Check for specific MySQL errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('❌ Database table error - users table does not exist');
      return res.status(500).json({ 
        error: 'Tabela de usuários não encontrada. Execute o script de configuração do banco.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('❌ Duplicate entry error');
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Database connection refused');
      return res.status(500).json({ 
        error: 'Erro de conexão com o banco de dados',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('❌ Database access denied');
      return res.status(500).json({ 
        error: 'Erro de acesso ao banco de dados. Verifique as credenciais.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    console.log('❌ Unknown registration error');
    res.status(500).json({ 
      error: 'Erro interno do servidor durante o registro',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    console.log('=== LOGIN START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Login validation errors:', errors.array());
      return res.status(400).json({ 
        error: 'Dados inválidos',
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;
    console.log('📝 Login data validated for email:', email);

    // Buscar usuário
    console.log('🔍 Searching for user in database...');
    const [users] = await pool.execute(
      'SELECT id, email, password_hash, plan, status, is_admin FROM users WHERE email = ?',
      [email]
    );

    console.log('Database search result:', users.length, 'users found');

    if (users.length === 0) {
      console.log('❌ User not found with email:', email);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const user = users[0];
    console.log('✅ User found:', { 
      id: user.id, 
      email: user.email, 
      status: user.status,
      is_admin: user.is_admin 
    });

    if (user.status !== 'active') {
      console.log('❌ User account is not active:', user.status);
      return res.status(401).json({ error: 'Conta desativada' });
    }

    // Verificar senha
    console.log('🔒 Comparing password with hash...');
    const validPassword = await bcrypt.compare(password, user.password_hash);
    console.log('Password validation result:', validPassword);
    
    if (!validPassword) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    console.log('✅ Password valid, generating token...');
    const token = generateToken(user.id);

    const responseData = {
      message: 'Login realizado com sucesso',
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        is_admin: user.is_admin
      },
      token
    };
    
    console.log('📤 Sending login success response');
    console.log('Response data:', JSON.stringify(responseData, null, 2));
    console.log('=== LOGIN END ===');

    res.json(responseData);
  } catch (error) {
    console.error('💥 DETAILED LOGIN ERROR:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    console.error('SQL Message:', error.sqlMessage);
    console.error('SQL State:', error.sqlState);
    console.error('SQL:', error.sql);
    console.error('Stack trace:', error.stack);
    
    // Check for specific MySQL errors
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.log('❌ Database table error during login');
      return res.status(500).json({ 
        error: 'Tabela de usuários não encontrada. Execute o script de configuração do banco.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Database connection refused during login');
      return res.status(500).json({ 
        error: 'Erro de conexão com o banco de dados',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('❌ Database access denied during login');
      return res.status(500).json({ 
        error: 'Erro de acesso ao banco de dados. Verifique as credenciais.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    console.log('❌ Unknown login error');
    res.status(500).json({ 
      error: 'Erro interno do servidor durante o login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verificar token
const verifyToken = async (req, res) => {
  try {
    console.log('=== TOKEN VERIFICATION START ===');
    console.log('User from middleware:', req.user ? { 
      id: req.user.id, 
      email: req.user.email, 
      is_admin: req.user.is_admin 
    } : 'No user');
    
    const responseData = {
      user: {
        id: req.user.id,
        email: req.user.email,
        is_admin: req.user.is_admin
      }
    };
    
    console.log('📤 Sending token verification response');
    console.log('Response data:', JSON.stringify(responseData, null, 2));
    console.log('=== TOKEN VERIFICATION END ===');
    
    res.json(responseData);
  } catch (error) {
    console.error('💥 DETAILED TOKEN VERIFICATION ERROR:');
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({ 
      error: 'Erro na verificação do token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { register, login, verifyToken };
