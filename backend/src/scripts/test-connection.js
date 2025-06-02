
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('🔄 Testando conexão com o banco de dados...');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Porta: ${process.env.DB_PORT}`);
  console.log(`Usuário: ${process.env.DB_USER}`);
  console.log(`Banco: ${process.env.DB_NAME}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      timeout: 10000
    });

    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testar uma query simples
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Query de teste executada:', rows);
    
    // Verificar se as tabelas existem
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Tabelas encontradas:', tables.length);
    
    if (tables.length === 0) {
      console.log('⚠️  Nenhuma tabela encontrada. Execute o script de setup: npm run setup-db');
    } else {
      console.log('📋 Lista de tabelas:');
      tables.forEach(table => {
        console.log(`  - ${Object.values(table)[0]}`);
      });
    }
    
    await connection.end();
    console.log('🔌 Conexão fechada');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    console.error('Detalhes:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };
