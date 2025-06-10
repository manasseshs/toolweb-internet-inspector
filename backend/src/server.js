
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');
const subscriptionRoutes = require('./routes/subscription');
const adminRoutes = require('./routes/admin');
const anonymousRoutes = require('./routes/anonymous'); // Add new routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Substitua pelo seu domínio
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Rate limiting - more permissive for anonymous usage tracking
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200 // increased limit for anonymous usage tracking
});
app.use(limiter);

// Anonymous usage specific rate limiting
const anonymousLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute for anonymous endpoints
  message: { error: 'Too many anonymous requests, please try again later' }
});

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/anonymous', anonymousLimiter, anonymousRoutes); // Add anonymous routes with specific rate limiting

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('Erro não capturado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar servidor
const startServer = async () => {
  try {
    // Testar conexão com banco
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Não foi possível conectar ao banco de dados');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Anonymous usage API: http://localhost:${PORT}/api/anonymous`);
    });
  } catch (error) {
    console.error('💥 Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
