
const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('=== DATABASE CONFIG START ===');
console.log('Database configuration:');
console.log('- DB_HOST:', process.env.DB_HOST);
console.log('- DB_PORT:', process.env.DB_PORT);
console.log('- DB_USER:', process.env.DB_USER);
console.log('- DB_NAME:', process.env.DB_NAME);
console.log('- DB_PASSWORD exists:', !!process.env.DB_PASSWORD);
console.log('- DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);

// Configuração do pool de conexões para melhor performance
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
});

console.log('✅ Database pool created');
console.log('=== DATABASE CONFIG END ===');

// Função para testar conexão
async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    const connection = await pool.getConnection();
    console.log('✅ Database connection established successfully');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Test query executed successfully:', rows);
    
    connection.release();
    console.log('✅ Connection released back to pool');
    return true;
  } catch (error) {
    console.error('💥 Database connection error:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error errno:', error.errno);
    console.error('Error sqlMessage:', error.sqlMessage);
    console.error('Error stack:', error.stack);
    return false;
  }
}

module.exports = { pool, testConnection };
