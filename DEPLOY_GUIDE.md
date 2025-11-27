# 🚀 Guia de Deploy 100% GRATUITO - Sistema Avalia

## 📋 Arquitetura do Deploy

```
┌─────────────────┐
│   VERCEL        │  ← Frontend (React)
│   (Gratuito)    │
└────────┬────────┘
         │ API Calls
         ↓
┌─────────────────┐
│   RAILWAY       │  ← Backend (Spring Boot)
│   (Gratuito)    │
└────────┬────────┘
         │ JDBC
         ↓
┌─────────────────┐
│   RAILWAY       │  ← Banco de Dados (MySQL)
│   (Gratuito)    │
└─────────────────┘
```

**💰 Custo Total: R$ 0,00/mês**

---

## ⚡ Deploy Rápido (Passo a Passo)

### **PARTE 1: Railway (Backend + Banco de Dados)**

#### **Passo 1: Criar Conta no Railway**
1. Acesse: https://railway.app
2. Clique em **"Start a New Project"**
3. Faça login com GitHub
4. ✅ Você tem **$5 de crédito grátis/mês** (suficiente para o projeto)

---

#### **Passo 2: Criar Banco de Dados MySQL**

1. No Railway, clique em **"+ New"**
2. Selecione **"Database"** → **"MySQL"**
3. Aguarde a criação (1-2 minutos)
4. Clique no serviço MySQL criado
5. Vá na aba **"Variables"**
6. **Copie e salve** estas variáveis:
   ```
   MYSQL_HOST
   MYSQL_PORT
   MYSQL_DATABASE
   MYSQL_USER
   MYSQL_PASSWORD
   MYSQL_URL (formato: mysql://user:pass@host:port/database)
   ```

---

#### **Passo 3: Preparar Backend para Deploy**

**a) Criar arquivo `railway.json` na raiz do backend:**

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "mvn clean package -DskipTests"
  },
  "deploy": {
    "startCommand": "java -jar target/*.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**b) Atualizar `application.properties`:**

```properties
# Usar variáveis de ambiente do Railway
spring.datasource.url=${MYSQL_URL}
spring.datasource.username=${MYSQL_USER}
spring.datasource.password=${MYSQL_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Server
server.port=${PORT:8080}

# CORS - Adicionar URL do Vercel
spring.web.cors.allowed-origins=${FRONTEND_URL:http://localhost:5173}
```

**c) Atualizar `SecurityConfig.java` (CORS):**

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    
    // Adicionar URL do Vercel
    String frontendUrl = System.getenv("FRONTEND_URL");
    if (frontendUrl != null) {
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:5174",
            frontendUrl
        ));
    } else {
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:5174"
        ));
    }
    
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

#### **Passo 4: Deploy do Backend no Railway**

1. No Railway, clique em **"+ New"** → **"GitHub Repo"**
2. Conecte seu repositório do GitHub
3. Selecione o repositório do projeto
4. Railway detectará automaticamente que é um projeto Java
5. Clique em **"Deploy"**

**Configurar Variáveis de Ambiente:**
1. Clique no serviço do backend
2. Vá em **"Variables"**
3. Adicione:
   ```
   MYSQL_URL=<copiar do serviço MySQL>
   MYSQL_USER=<copiar do serviço MySQL>
   MYSQL_PASSWORD=<copiar do serviço MySQL>
   PORT=8080
   FRONTEND_URL=https://seu-app.vercel.app (adicionar depois)
   ```

**Gerar URL Pública:**
1. Vá em **"Settings"**
2. Clique em **"Generate Domain"**
3. **Copie a URL** (ex: `https://seu-backend.up.railway.app`)
4. ✅ Seu backend está no ar!

---

### **PARTE 2: Vercel (Frontend)**

#### **Passo 1: Preparar Frontend**

**a) Criar arquivo `.env.production` na raiz do frontend:**

```env
VITE_API_URL=https://seu-backend.up.railway.app/api
```

**b) Atualizar `src/services/api.js`:**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
```

**c) Criar arquivo `vercel.json` na raiz do frontend:**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

---

#### **Passo 2: Deploy no Vercel**

**Opção A: Via GitHub (Recomendado)**

1. Acesse: https://vercel.com
2. Faça login com GitHub
3. Clique em **"Add New Project"**
4. Selecione seu repositório
5. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```
6. Adicione variável de ambiente:
   ```
   VITE_API_URL=https://seu-backend.up.railway.app/api
   ```
7. Clique em **"Deploy"**
8. ✅ Aguarde 2-3 minutos

**Opção B: Via CLI**

```bash
# Instalar Vercel CLI
npm install -g vercel

# Na pasta do frontend
cd frontend

# Deploy
vercel

# Seguir prompts:
# - Link to existing project? No
# - Project name: avalia-frontend
# - Directory: ./
# - Override settings? No

# Deploy em produção
vercel --prod
```

---

#### **Passo 3: Configurar URL do Frontend no Backend**

1. Copie a URL do Vercel (ex: `https://avalia-frontend.vercel.app`)
2. Volte no Railway
3. Adicione/atualize a variável:
   ```
   FRONTEND_URL=https://avalia-frontend.vercel.app
   ```
4. O backend vai reiniciar automaticamente

---

## ✅ Verificação do Deploy

### **Testar Backend:**
```bash
curl https://seu-backend.up.railway.app/api/health
```

### **Testar Frontend:**
1. Acesse: `https://seu-app.vercel.app`
2. Tente fazer login com: `admin` / `admin123`
3. Verifique se consegue criar questões, avaliações, etc.

---

## 🔧 Troubleshooting

### **Problema: CORS Error**
**Solução:**
1. Verifique se `FRONTEND_URL` está configurada no Railway
2. Verifique se a URL está correta (sem `/` no final)
3. Limpe cache do navegador (Ctrl+Shift+Delete)

### **Problema: Backend não conecta no banco**
**Solução:**
1. Verifique as variáveis `MYSQL_*` no Railway
2. Certifique-se que o MySQL está rodando
3. Veja os logs: Railway → Backend → "View Logs"

### **Problema: Frontend não carrega**
**Solução:**
1. Verifique se `VITE_API_URL` está correta
2. Rebuild no Vercel: Settings → Deployments → Redeploy
3. Verifique os logs no Vercel

### **Problema: 502 Bad Gateway**
**Solução:**
1. Backend pode estar iniciando (aguarde 2-3 minutos)
2. Verifique logs no Railway
3. Verifique se o `PORT` está configurado corretamente

---

## 💰 Limites Gratuitos

### **Railway (Plano Gratuito)**
- ✅ $5 de crédito/mês
- ✅ ~500 horas de execução
- ✅ Suficiente para projetos pequenos/médios
- ⚠️ Após $5, serviço para (não cobra automaticamente)

### **Vercel (Plano Hobby)**
- ✅ 100 GB de banda/mês
- ✅ Builds ilimitados
- ✅ Domínio gratuito (.vercel.app)
- ✅ SSL automático
- ✅ CDN global

---

## 🚀 Melhorias Futuras

### **Domínio Personalizado**
1. **Vercel:** Settings → Domains → Add Domain
2. **Railway:** Settings → Domains → Custom Domain

### **Monitoramento**
- Railway tem logs integrados
- Vercel tem analytics integrado
- Considere: Sentry, LogRocket

### **CI/CD Automático**
- ✅ Já configurado! Push no GitHub = Deploy automático

---

## 📝 Checklist de Deploy

**Backend (Railway):**
- [ ] MySQL criado
- [ ] Variáveis de ambiente configuradas
- [ ] Backend deployado
- [ ] URL pública gerada
- [ ] Logs sem erros

**Frontend (Vercel):**
- [ ] `.env.production` criado
- [ ] `VITE_API_URL` configurada
- [ ] Deploy realizado
- [ ] URL pública funcionando
- [ ] Login funcionando

**Integração:**
- [ ] CORS configurado
- [ ] Frontend conecta no backend
- [ ] Banco de dados acessível
- [ ] Todas as funcionalidades testadas

---

## 🎉 Pronto!

Seu sistema está no ar 100% gratuito!

**URLs:**
- Frontend: `https://seu-app.vercel.app`
- Backend: `https://seu-backend.up.railway.app`
- Admin: `admin` / `admin123`

---

**Última atualização:** Novembro 2025

## 🔧 Preparação para Deploy

### **1. Backend - Ajustes Necessários**

#### **a) Criar `application-prod.properties`**

```properties
# Perfil de Produção
spring.application.name=avalia

# Banco de Dados - Usar variáveis de ambiente
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT - Usar variável de ambiente
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# CORS - Adicionar domínio de produção
spring.web.cors.allowed-origins=${FRONTEND_URL}
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.web.cors.allowed-headers=*
spring.web.cors.allow-credentials=true

# Server
server.port=${PORT:8080}

# Gemini API
gemini.api.key=${GEMINI_API_KEY}
gemini.api.model=gemini-2.0-flash
```

#### **b) Adicionar no `pom.xml`**

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <executable>true</executable>
            </configuration>
        </plugin>
    </plugins>
    <finalName>avalia</finalName>
</build>
```

#### **c) Criar `.env.example`**

```bash
# Banco de Dados
DATABASE_URL=jdbc:mysql://localhost:3306/avalia_db
DATABASE_USERNAME=root
DATABASE_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua-chave-secreta-super-segura-minimo-32-caracteres

# Frontend URL
FRONTEND_URL=https://seu-dominio.vercel.app

# Gemini API
GEMINI_API_KEY=sua_chave_aqui
```

---

### **2. Frontend - Ajustes Necessários**

#### **a) Criar arquivo `.env.production`**

```bash
VITE_API_URL=https://seu-backend.railway.app
```

#### **b) Atualizar `src/services/api.js`**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

#### **c) Build de produção**

```bash
npm run build
```

---

## 🚀 Deploy Passo a Passo (Railway + Vercel)

### **Passo 1: Deploy do Banco de Dados + Backend (Railway)**

1. **Criar conta no Railway:**
   - Acesse: https://railway.app
   - Faça login com GitHub

2. **Criar novo projeto:**
   - Clique em "New Project"
   - Selecione "Provision MySQL"
   - Anote as credenciais do banco

3. **Adicionar Backend:**
   - No mesmo projeto, clique em "+ New"
   - Selecione "GitHub Repo"
   - Conecte seu repositório
   - Railway detectará automaticamente o Spring Boot

4. **Configurar Variáveis de Ambiente:**
   ```
   DATABASE_URL=jdbc:mysql://containers-us-west-xxx.railway.app:7894/railway
   DATABASE_USERNAME=root
   DATABASE_PASSWORD=xxx (Railway fornece)
   JWT_SECRET=sua-chave-secreta-super-segura-minimo-32-caracteres
   FRONTEND_URL=https://seu-app.vercel.app
   GEMINI_API_KEY=sua_chave_gemini
   SPRING_PROFILES_ACTIVE=prod
   ```

5. **Deploy automático:**
   - Railway fará deploy automaticamente
   - Anote a URL do backend: `https://seu-app.up.railway.app`

---

### **Passo 2: Deploy do Frontend (Vercel)**

1. **Criar conta no Vercel:**
   - Acesse: https://vercel.com
   - Faça login com GitHub

2. **Importar projeto:**
   - Clique em "Add New" → "Project"
   - Selecione seu repositório
   - Configure:
     - Framework: Vite
     - Root Directory: `frontend`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **Adicionar Variável de Ambiente:**
   ```
   VITE_API_URL=https://seu-backend.railway.app
   ```

4. **Deploy:**
   - Clique em "Deploy"
   - Vercel fará deploy automaticamente
   - Sua URL: `https://seu-app.vercel.app`

5. **Atualizar CORS no Backend:**
   - Volte no Railway
   - Atualize `FRONTEND_URL` com a URL do Vercel

---

## 🔒 Segurança - IMPORTANTE!

### **1. Nunca commitar:**
- ❌ `application.properties` com senhas
- ❌ `.env` com credenciais
- ❌ API Keys

### **2. Adicionar ao `.gitignore`:**

```gitignore
# Backend
application-prod.properties
.env

# Frontend
.env.production
.env.local
```

### **3. Gerar JWT Secret seguro:**

```bash
# No terminal (Linux/Mac)
openssl rand -base64 32

# Ou use um gerador online
https://generate-secret.vercel.app/32
```

---

## 📊 Custos Estimados

### **Opção Gratuita (Railway + Vercel):**
- ✅ **Backend:** $0/mês (com limites)
- ✅ **Frontend:** $0/mês (ilimitado)
- ✅ **Banco:** $0/mês (500MB)
- ✅ **Total:** **GRÁTIS** 🎉

**Limites:**
- Railway: 500 horas/mês, 500MB storage
- Vercel: Ilimitado para hobby

### **Opção Paga (Quando crescer):**
- Railway Pro: $5/mês
- PlanetScale: $29/mês
- Vercel Pro: $20/mês
- **Total:** ~$50/mês

---

## 🎯 Checklist de Deploy

### **Antes do Deploy:**
- [ ] Testar aplicação localmente
- [ ] Criar `application-prod.properties`
- [ ] Criar `.env.production` no frontend
- [ ] Adicionar `.gitignore` correto
- [ ] Gerar JWT secret seguro
- [ ] Obter API Key do Gemini

### **Durante o Deploy:**
- [ ] Deploy do banco de dados
- [ ] Deploy do backend
- [ ] Configurar variáveis de ambiente
- [ ] Deploy do frontend
- [ ] Atualizar CORS

### **Após o Deploy:**
- [ ] Testar login
- [ ] Testar criação de questões
- [ ] Testar IAvalia
- [ ] Verificar logs
- [ ] Configurar domínio customizado (opcional)

---

## 🆘 Troubleshooting

### **Backend não inicia:**
- Verificar logs no Railway
- Verificar variáveis de ambiente
- Verificar conexão com banco

### **Frontend não conecta ao backend:**
- Verificar `VITE_API_URL`
- Verificar CORS no backend
- Verificar console do navegador

### **Banco de dados não conecta:**
- Verificar `DATABASE_URL`
- Verificar firewall/whitelist
- Verificar credenciais

---

## 📚 Recursos Úteis

- **Railway Docs:** https://docs.railway.app
- **Vercel Docs:** https://vercel.com/docs
- **Spring Boot Deploy:** https://spring.io/guides/gs/spring-boot-docker/
- **Vite Deploy:** https://vitejs.dev/guide/static-deploy.html

---

## 🎓 Próximos Passos Após Deploy

1. **Domínio customizado** (opcional)
   - Comprar domínio (Namecheap, GoDaddy)
   - Configurar no Vercel/Railway

2. **Monitoramento**
   - Railway fornece logs automáticos
   - Configurar alertas

3. **Backup do Banco**
   - Railway faz backup automático
   - Ou configurar backup manual

4. **CI/CD**
   - Já está configurado automaticamente!
   - Push no GitHub = Deploy automático

5. **SSL/HTTPS**
   - Já vem configurado no Railway e Vercel! ✅

---

## 💡 Dica Final

**Comece com Railway + Vercel (gratuito)** e migre para infraestrutura paga apenas quando necessário. O plano gratuito é suficiente para:
- ✅ Desenvolvimento
- ✅ Testes
- ✅ Portfolio
- ✅ Uso acadêmico
- ✅ Até ~100 usuários ativos

**Boa sorte com o deploy! 🚀**
