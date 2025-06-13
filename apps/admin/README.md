# CMMV Blog Admin Server

Este é o servidor de produção para a interface administrativa do CMMV Blog. Ele replica toda a funcionalidade de proxy do Vite em ambiente de produção, incluindo suporte a whitelabels dinâmicos.

## 🚀 Características

- **Proxy Dinâmico**: Configura automaticamente proxies para whitelabels baseado em dados da API
- **Retry Logic**: Sistema robusto de retry com exponential backoff para buscar configurações de whitelabel
- **Health Checks**: Endpoints para monitoramento da saúde do servidor
- **Logs Detalhados**: Sistema de logging com emojis para fácil identificação
- **Configuração Centralizada**: Toda configuração em arquivo separado

## 📁 Estrutura de Arquivos

```
apps/admin/
├── server.js          # Servidor principal
├── server.config.js   # Configuração centralizada  
├── package.json       # Dependências
└── dist/             # Arquivos estáticos buildados
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:5000
VITE_PORT=5002
VITE_ALLOWED_HOSTS=blog.cmmv.io,localhost
```

### Configurações do Servidor (server.config.js)

```javascript
export const serverConfig = {
    mode: 'production',
    port: '5002',
    host: '0.0.0.0',
    apiUrl: 'http://localhost:5000',
    
    // Configuração de retry para whitelabels
    whitelabel: {
        maxRetries: 10,
        timeout: 5000,
        baseDelay: 2000,
        maxDelay: 10000,
        backoffMultiplier: 1.5
    }
};
```

## 🌐 Rotas de Proxy

### Proxies Principais

- `/api/*` → `${API_URL}/*` (API principal)
- `/api/admin/*` → `${API_URL}/*` (API administrativa)
- `/images/*` → `${API_URL}/images/*` (Imagens)

### Proxies Dinâmicos (Whitelabels)

Para cada whitelabel configurado:
- `/${WHITELABEL_ID}/*` → `${WHITELABEL_API_URL}/*`

Exemplo:
- `/client1/*` → `https://client1-api.example.com/*`
- `/client2/*` → `https://client2-api.example.com/*`

## 📊 Endpoints de Monitoramento

### Health Check
```
GET /health
```

Retorna:
```json
{
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production",
    "whitelabels": {
        "count": 2,
        "configured": ["client1", "client2"]
    },
    "apiUrl": "http://localhost:5000",
    "version": "1.0.0"
}
```

### Informações de Whitelabels
```
GET /whitelabels
```

Retorna:
```json
{
    "count": 2,
    "whitelabels": {
        "client1": "https://client1-api.example.com",
        "client2": "https://client2-api.example.com"
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Como Executar

### Desenvolvimento
```bash
cd apps/admin
pnpm dev
```

### Produção
```bash
# 1. Build da aplicação
cd apps/admin
pnpm build

# 2. Instalar dependências de produção
pnpm install --prod

# 3. Iniciar servidor
pnpm start
```

### Docker
```dockerfile
FROM node:20-alpine

WORKDIR /app
COPY apps/admin/package.json ./
RUN npm install --only=production

COPY apps/admin/dist ./dist
COPY apps/admin/server.js ./
COPY apps/admin/server.config.js ./

EXPOSE 5002
CMD ["node", "server.js"]
```

## 🔄 Funcionamento do Sistema de Whitelabels

1. **Inicialização**: Servidor tenta buscar configurações de whitelabel da API principal
2. **Retry Logic**: Se falhar, faz retry com exponential backoff (até 10 tentativas)
3. **Configuração Dinâmica**: Para cada whitelabel encontrado, cria um proxy específico
4. **Fallback**: Se não conseguir buscar whitelabels, continua funcionando apenas com proxies principais

### Exemplo de Flow

```
1. Server Start → GET /whitelabel/admin
2. Response: [
     { id: "client1", apiUrl: "https://api.client1.com" },
     { id: "client2", apiUrl: "https://api.client2.com" }
   ]
3. Proxy Setup:
   - /client1/* → https://api.client1.com/*
   - /client2/* → https://api.client2.com/*
```

## 🛠️ Headers Forwarded

O servidor automaticamente forwards os seguintes headers:

- `refresh-token`: Token de refresh para autenticação
- `x-whitelabel-id`: ID do whitelabel para identificação
- `authorization`: Token de autorização

## 🐛 Logs e Debugging

O servidor produz logs detalhados:

```
🚀 Starting CMMV Admin Server...
🌍 Environment: production
🔗 API URL: http://localhost:5000
🔍 Fetching whitelabel configurations...
✅ Added whitelabel: client1 -> https://api.client1.com
🎉 Successfully loaded 1 whitelabel configurations
🔧 Setting up whitelabel proxies...
✅ Server started successfully!
📡 Listening on: http://0.0.0.0:5002
🔗 API Proxy: http://localhost:5000
🏷️  Whitelabels: 1 configured

📋 Whitelabel Routes:
   /client1 -> https://api.client1.com

🔍 Health check: http://0.0.0.0:5002/health
📊 Whitelabels info: http://0.0.0.0:5002/whitelabels
```

## 📝 Scripts Disponíveis

```json
{
    "dev": "vite --clearScreen false",
    "build": "vite build", 
    "start": "node server.js",
    "lint": "eslint \"src/**/*.ts\""
}
```

## 🔒 Graceful Shutdown

O servidor suporta graceful shutdown através dos sinais:
- `SIGINT` (Ctrl+C)
- `SIGTERM`

## 📦 Dependências

### Principais
- `@cmmv/server`: Servidor HTTP do framework CMMV
- `http-proxy-middleware`: Middleware para proxies HTTP
- `vite`: Para carregar variáveis de ambiente

### Estrutura
```json
{
    "dependencies": {
        "http-proxy-middleware": "^3.0.3"
    }
}
``` 
