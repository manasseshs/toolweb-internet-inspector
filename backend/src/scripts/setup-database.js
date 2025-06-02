
const { pool } = require('../config/database');

const createTables = async () => {
  try {
    console.log('🔄 Criando tabelas do banco de dados...');

    // Tabela de usuários
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
        status ENUM('active', 'disabled') DEFAULT 'active',
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_status (status)
      ) ENGINE=InnoDB
    `);

    // Tabela de verificações de email
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS email_verifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        email_address VARCHAR(255) NOT NULL,
        status ENUM('valid', 'invalid', 'unknown') NOT NULL,
        smtp_server VARCHAR(255),
        smtp_response_code VARCHAR(10),
        smtp_response_message TEXT,
        verification_details JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_email (user_id, email_address),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB
    `);

    // Tabela de assinantes
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS subscribers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        user_id INT,
        stripe_customer_id VARCHAR(255),
        subscribed BOOLEAN DEFAULT FALSE,
        subscription_tier VARCHAR(50),
        subscription_end TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_email (email),
        INDEX idx_user_id (user_id),
        INDEX idx_stripe_customer (stripe_customer_id)
      ) ENGINE=InnoDB
    `);

    // Tabela de migrações de email
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS email_migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        source_host VARCHAR(255) NOT NULL,
        source_email VARCHAR(255) NOT NULL,
        source_password_encrypted TEXT NOT NULL,
        destination_host VARCHAR(255) NOT NULL,
        destination_email VARCHAR(255) NOT NULL,
        destination_password_encrypted TEXT NOT NULL,
        status ENUM('pending', 'in_progress', 'completed', 'failed') DEFAULT 'pending',
        progress_percentage INT DEFAULT 0,
        migration_log JSON,
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_status (user_id, status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB
    `);

    // Tabela de tickets de suporte
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        subject VARCHAR(500) NOT NULL,
        category VARCHAR(100) NOT NULL,
        priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
        status ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_status (user_id, status),
        INDEX idx_status_priority (status, priority)
      ) ENGINE=InnoDB
    `);

    // Tabela de mensagens de tickets
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS support_ticket_messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        ticket_id INT NOT NULL,
        user_id INT,
        message TEXT NOT NULL,
        is_admin_reply BOOLEAN DEFAULT FALSE,
        attachments JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_ticket_created (ticket_id, created_at)
      ) ENGINE=InnoDB
    `);

    // Tabela de notificações
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('general', 'maintenance', 'feature', 'warning') DEFAULT 'general',
        target_user_id INT,
        is_global BOOLEAN DEFAULT FALSE,
        is_read BOOLEAN DEFAULT FALSE,
        expires_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (target_user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_target_user (target_user_id, is_read),
        INDEX idx_global_active (is_global, expires_at)
      ) ENGINE=InnoDB
    `);

    // Tabela de histórico de ferramentas
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tool_history (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        tool_id VARCHAR(100) NOT NULL,
        input_data TEXT NOT NULL,
        result_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_tool (user_id, tool_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB
    `);

    console.log('✅ Todas as tabelas foram criadas com sucesso!');
    
    // Criar usuário admin padrão
    await createDefaultAdmin();
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
};

const createDefaultAdmin = async () => {
  try {
    const bcrypt = require('bcryptjs');
    const adminEmail = 'admin@emailtools.com';
    const adminPassword = 'admin123'; // Mude isso em produção!
    
    // Verificar se já existe
    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await pool.execute(
        'INSERT INTO users (email, password_hash, plan, is_admin) VALUES (?, ?, "enterprise", TRUE)',
        [adminEmail, hashedPassword]
      );
      console.log('✅ Usuário admin criado:', adminEmail, '/ Senha:', adminPassword);
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }
  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
  }
};

// Executar se chamado diretamente
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 Setup do banco finalizado!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Falha no setup:', error);
      process.exit(1);
    });
}

module.exports = { createTables };
