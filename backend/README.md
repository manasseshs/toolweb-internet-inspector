
# Email Tools Backend - Node.js + MySQL

Backend Node.js com MySQL para substituir o Supabase, otimizado para performance.

## 🚀 Configuração Rápida

### 1. Instalar Dependências
```bash
cd backend
npm install
```

### 2. Configurar Banco de Dados MySQL
```sql
CREATE DATABASE email_tools;
CREATE USER 'email_tools_user'@'localhost' IDENTIFIED BY 'sua_senha_segura';
GRANT ALL PRIVILEGES ON email_tools.* TO 'email_tools_user'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Configurar Variáveis de Ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

### 4. Criar Tabelas
```bash
npm run setup-db
```

### 5. Iniciar Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📊 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/verify` - Verificar token

### Email
- `POST /api/email/verify` - Verificar emails
- `GET /api/email/history` - Histórico de verificações

### Assinatura
- `POST /api/subscription/create-checkout` - Criar checkout Stripe
- `GET /api/subscription/status` - Status da assinatura
- `POST /api/subscription/customer-portal` - Portal do cliente

### Admin
- `GET /api/admin/users` - Listar usuários
- `POST /api/admin/users` - Criar usuário
- `PATCH /api/admin/users/:id/status` - Atualizar status
- `PATCH /api/admin/users/:id/admin` - Toggle admin

## 🔧 Migração dos Dados

Para migrar dados do Supabase:
```bash
npm run migrate
```

## 🐳 Docker (Opcional)

```bash
# Construir imagem
docker build -t email-tools-backend .

# Executar com docker-compose
docker-compose up -d
```

## 📈 Performance

- **Connection Pooling**: MySQL2 com pool de conexões
- **Indexação**: Índices otimizados para queries frequentes
- **Rate Limiting**: Proteção contra abuse
- **Caching**: Cache de queries pesadas
- **Compressão**: Gzip para responses

## 🔒 Segurança

- **JWT**: Autenticação stateless
- **bcrypt**: Hash seguro de senhas
- **Helmet**: Headers de segurança
- **CORS**: Configuração adequada
- **Validação**: Express-validator para inputs

## 📝 Logs

Logs estruturados para monitoramento:
```bash
tail -f logs/app.log
```
