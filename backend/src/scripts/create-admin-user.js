
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

async function createAdminUser() {
  try {
    console.log('🔄 Creating admin user in MySQL database...');
    
    // First, let's make sure the users table exists
    console.log('📊 Checking if users table exists...');
    const [tables] = await pool.execute("SHOW TABLES LIKE 'users'");
    
    if (tables.length === 0) {
      console.log('❌ Users table does not exist. Creating it...');
      
      // Create the users table
      await pool.execute(`
        CREATE TABLE users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          plan ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
          status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
          is_admin BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_status (status)
        ) ENGINE=InnoDB
      `);
      
      console.log('✅ Users table created successfully');
    } else {
      console.log('✅ Users table already exists');
    }
    
    // Admin user details
    const adminEmail = 'admin@toolweb.io';
    const adminPassword = '12345678';
    const plan = 'pro';
    
    console.log('🔍 Checking if admin user already exists...');
    const [existingUsers] = await pool.execute(
      'SELECT id, email FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (existingUsers.length > 0) {
      console.log('⚠️  Admin user already exists with ID:', existingUsers[0].id);
      console.log('📝 Updating existing admin user...');
      
      // Update existing admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      await pool.execute(
        'UPDATE users SET password_hash = ?, plan = ?, status = "active", is_admin = TRUE WHERE email = ?',
        [hashedPassword, plan, adminEmail]
      );
      
      console.log('✅ Admin user updated successfully');
    } else {
      console.log('👤 Creating new admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      console.log('🔒 Password hashed successfully');
      
      // Insert admin user
      const [result] = await pool.execute(`
        INSERT INTO users (email, password_hash, plan, status, is_admin, created_at) 
        VALUES (?, ?, ?, 'active', TRUE, NOW())
      `, [adminEmail, hashedPassword, plan]);
      
      console.log('✅ Admin user created successfully with ID:', result.insertId);
    }
    
    // Verify the admin user was created/updated
    console.log('🔍 Verifying admin user...');
    const [adminUser] = await pool.execute(
      'SELECT id, email, plan, status, is_admin, created_at FROM users WHERE email = ?',
      [adminEmail]
    );
    
    if (adminUser.length > 0) {
      console.log('✅ Admin user verification successful:');
      console.log('   - ID:', adminUser[0].id);
      console.log('   - Email:', adminUser[0].email);
      console.log('   - Plan:', adminUser[0].plan);
      console.log('   - Status:', adminUser[0].status);
      console.log('   - Is Admin:', adminUser[0].is_admin);
      console.log('   - Created:', adminUser[0].created_at);
      console.log('');
      console.log('🎉 You can now login with:');
      console.log('   Email: admin@toolweb.io');
      console.log('   Password: 12345678');
    } else {
      console.log('❌ Failed to verify admin user creation');
    }
    
  } catch (error) {
    console.error('💥 Error creating admin user:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      stack: error.stack
    });
    throw error;
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser()
    .then(() => {
      console.log('🎉 Admin user setup completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Admin user setup failed:', error);
      process.exit(1);
    });
}

module.exports = { createAdminUser };
