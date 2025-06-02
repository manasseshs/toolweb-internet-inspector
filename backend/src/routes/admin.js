
const express = require('express');
const { pool } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Middleware para todas as rotas admin
router.use(authenticateToken);
router.use(requireAdmin);

// Listar usuários
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, plan, status, is_admin, created_at FROM users ORDER BY created_at DESC'
    );
    res.json({ users });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar usuário
router.post('/users', async (req, res) => {
  try {
    const { email, password, plan = 'free' } = req.body;

    // Verificar se já existe
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, plan, status) VALUES (?, ?, ?, "active")',
      [email, hashedPassword, plan]
    );

    res.status(201).json({ 
      message: 'Usuário criado com sucesso',
      user: { id: result.insertId, email, plan }
    });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar status do usuário
router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    await pool.execute('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Toggle admin
router.patch('/users/:id/admin', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_admin } = req.body;

    await pool.execute('UPDATE users SET is_admin = ? WHERE id = ?', [is_admin, id]);
    res.json({ message: 'Privilégio admin atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar admin:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
