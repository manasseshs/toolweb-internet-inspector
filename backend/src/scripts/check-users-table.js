
const { pool } = require('../config/database');

async function checkUsersTable() {
  try {
    console.log('🔍 Checking if users table exists...');
    
    // Check if table exists
    const [tables] = await pool.execute(
      "SHOW TABLES LIKE 'users'"
    );
    
    if (tables.length === 0) {
      console.log('❌ Users table does not exist!');
      console.log('💡 You need to create the users table. Here\'s the SQL:');
      console.log(`
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
      `);
      return false;
    }
    
    console.log('✅ Users table exists!');
    
    // Check table structure
    const [columns] = await pool.execute('DESCRIBE users');
    console.log('📋 Table structure:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'} ${col.Key ? `(${col.Key})` : ''}`);
    });
    
    // Count users
    const [count] = await pool.execute('SELECT COUNT(*) as total FROM users');
    console.log(`👥 Total users in database: ${count[0].total}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error checking users table:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    return false;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  checkUsersTable().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { checkUsersTable };
