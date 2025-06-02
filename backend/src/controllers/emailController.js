
const { pool } = require('../config/database');
const { validationResult } = require('express-validator');

// Verificação de email
const verifyEmails = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { emails } = req.body;
    const userId = req.user.id;

    // Verificar limite para usuários gratuitos
    if (req.user.plan === 'free' && emails.length > 10) {
      return res.status(400).json({ 
        error: 'Usuários gratuitos podem verificar até 10 emails por vez' 
      });
    }

    const results = [];

    for (const email of emails) {
      // Simular verificação de email (aqui você implementaria a lógica real)
      const verificationResult = await simulateEmailVerification(email);
      
      // Salvar resultado no banco
      await pool.execute(
        `INSERT INTO email_verifications 
         (user_id, email_address, status, smtp_server, smtp_response_code, smtp_response_message, verification_details, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          userId,
          email,
          verificationResult.status,
          verificationResult.smtp_server,
          verificationResult.smtp_response_code,
          verificationResult.smtp_response_message,
          JSON.stringify(verificationResult.details)
        ]
      );

      results.push(verificationResult);
    }

    res.json({ results });
  } catch (error) {
    console.error('Erro na verificação de emails:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Simulação de verificação de email (substitua pela lógica real)
const simulateEmailVerification = async (email) => {
  // Simular diferentes resultados baseados no domínio
  const domain = email.split('@')[1];
  const isValid = Math.random() > 0.2; // 80% de chance de ser válido
  
  return {
    email,
    status: isValid ? 'valid' : 'invalid',
    confidence: Math.floor(Math.random() * 100),
    provider: domain,
    smtp_server: `smtp.${domain}`,
    smtp_response_code: isValid ? '250' : '550',
    smtp_response_message: isValid ? 'Requested mail action okay, completed' : 'User unknown',
    verification_attempts: 1,
    details: {
      syntax_valid: true,
      domain_exists: isValid,
      mailbox_exists: isValid
    }
  };
};

// Histórico de verificações
const getVerificationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const [verifications] = await pool.execute(
      `SELECT * FROM email_verifications 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [userId, limit, offset]
    );

    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM email_verifications WHERE user_id = ?',
      [userId]
    );

    res.json({
      verifications,
      pagination: {
        page,
        limit,
        total: countResult[0].total,
        pages: Math.ceil(countResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

module.exports = { verifyEmails, getVerificationHistory };
