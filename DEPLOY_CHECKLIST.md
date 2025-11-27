# ✅ CHECKLIST DE DEPLOY - Sistema Avalia

## 📦 ARQUIVOS JÁ PREPARADOS

✅ `backend/railway.json` - Configuração do Railway  
✅ `backend/application.properties` - Variáveis de ambiente configuradas  
✅ `frontend/vercel.json` - Configuração do Vercel  
✅ `frontend/.env.production.example` - Template de variáveis  
✅ `frontend/src/services/api.js` - API configurada para produção  

---

## 🚀 PASSO A PASSO DO DEPLOY

### **PARTE 1: RAILWAY (Backend + Banco de Dados)**

#### **1.1 Criar Conta e Projeto**
```
□ Acessar: https://railway.app
□ Fazer login com GitHub
□ Clicar em "Start a New Project"
□ Você terá $5 de crédito grátis/mês
```

#### **1.2 Criar Banco de Dados MySQL**
```
□ Clicar em "+ New"
□ Selecionar "Database" → "MySQL"
□ Aguardar criação (1-2 minutos)
□ Clicar no serviço MySQL
□ Ir em "Variables"
□ Copiar e salvar:
  - MYSQL_HOST
  - MYSQL_PORT  
  - MYSQL_DATABASE
  - MYSQL_USER
  - MYSQL_PASSWORD
  - MYSQL_URL (formato completo)
```

#### **1.3 Deploy do Backend**
```
□ Clicar em "+ New" → "GitHub Repo"
□ Conectar repositório do GitHub
□ Selecionar o repositório do projeto
□ Railway detecta automaticamente (Java/Maven)
□ Aguardar build inicial (5-10 minutos)
```

#### **1.4 Configurar Variáveis de Ambiente**
```
□ Clicar no serviço do backend
□ Ir em "Variables"
□ Adicionar variáveis:

MYSQL_URL=<copiar do MySQL>
MYSQL_USER=<copiar do MySQL>
MYSQL_PASSWORD=<copiar do MySQL>
PORT=8080
GEMINI_API_KEY=AIzaSyAkl7RBi-6YcN8r1h7iSGNb8epl36WJ_aI
JWT_SECRET=seu-secret-super-seguro-aqui-2024
FRONTEND_URL=https://seu-app.vercel.app (adicionar depois)
```

#### **1.5 Gerar URL Pública**
```
□ Ir em "Settings"
□ Clicar em "Generate Domain"
□ Copiar URL (ex: https://seu-backend.up.railway.app)
□ Salvar essa URL para usar no frontend
```

✅ **BACKEND NO AR!**

---

### **PARTE 2: VERCEL (Frontend)**

#### **2.1 Preparar Variável de Ambiente Local**

Criar arquivo `.env.production` na pasta `frontend/`:
```env
VITE_API_URL=https://seu-backend.up.railway.app/api
```
**IMPORTANTE:** Substitua pela URL real do Railway!

#### **2.2 Testar Build Local (Opcional)**
```bash
cd frontend
npm install
npm run build
```
Se der erro, corrija antes de fazer deploy.

#### **2.3 Deploy no Vercel**

**Opção A: Via Interface Web (Recomendado)**
```
□ Acessar: https://vercel.com
□ Fazer login com GitHub
□ Clicar em "Add New Project"
□ Selecionar seu repositório
□ Configurar:
  
  Framework Preset: Vite
  Root Directory: frontend
  Build Command: npm run build
  Output Directory: dist
  Install Command: npm install

□ Adicionar variável de ambiente:
  Name: VITE_API_URL
  Value: https://seu-backend.up.railway.app/api

□ Clicar em "Deploy"
□ Aguardar 2-3 minutos
```

**Opção B: Via CLI**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Na pasta do frontend
cd frontend

# Login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

#### **2.4 Copiar URL do Vercel**
```
□ Copiar URL (ex: https://avalia-frontend.vercel.app)
□ Salvar para configurar no backend
```

✅ **FRONTEND NO AR!**

---

### **PARTE 3: INTEGRAÇÃO**

#### **3.1 Configurar CORS no Backend**
```
□ Voltar no Railway
□ Clicar no serviço do backend
□ Ir em "Variables"
□ Adicionar/Atualizar:

FRONTEND_URL=https://avalia-frontend.vercel.app

□ Backend vai reiniciar automaticamente (1-2 min)
```

#### **3.2 Testar Integração**
```
□ Acessar: https://seu-app.vercel.app
□ Tentar fazer login:
  Login: admin
  Senha: admin123

□ Verificar se funciona:
  - Login
  - Criar questão
  - Criar avaliação
  - Gerar PDF
```

✅ **SISTEMA COMPLETO NO AR!**

---

## 🔍 VERIFICAÇÃO FINAL

### **Backend (Railway)**
```bash
# Testar se backend está respondendo
curl https://seu-backend.up.railway.app/api/health

# Verificar logs
□ Railway → Backend → "View Logs"
□ Procurar por erros
```

### **Frontend (Vercel)**
```
□ Abrir https://seu-app.vercel.app
□ Abrir DevTools (F12)
□ Verificar Console (não deve ter erros)
□ Verificar Network (requisições para API)
```

### **Banco de Dados (Railway)**
```
□ Railway → MySQL → "Variables"
□ Verificar se está rodando
□ Ver logs se necessário
```

---

## 🐛 TROUBLESHOOTING

### **Erro: CORS**
```
Sintoma: "CORS policy: No 'Access-Control-Allow-Origin'"
Solução:
1. Verificar FRONTEND_URL no Railway
2. Verificar se URL está sem "/" no final
3. Limpar cache do navegador
4. Reiniciar backend no Railway
```

### **Erro: Backend não conecta no banco**
```
Sintoma: "Connection refused" ou "Unknown database"
Solução:
1. Verificar variáveis MYSQL_* no Railway
2. Verificar se MySQL está rodando
3. Ver logs do backend
4. Verificar se MYSQL_URL está correto
```

### **Erro: Frontend não carrega**
```
Sintoma: Página em branco ou erro 404
Solução:
1. Verificar se build foi bem-sucedido
2. Verificar VITE_API_URL no Vercel
3. Rebuild: Vercel → Settings → Redeploy
4. Verificar logs no Vercel
```

### **Erro: 502 Bad Gateway**
```
Sintoma: Erro 502 ao acessar backend
Solução:
1. Backend pode estar iniciando (aguardar 2-3 min)
2. Verificar logs no Railway
3. Verificar se PORT está configurado
4. Verificar se build foi bem-sucedido
```

---

## 📊 MONITORAMENTO

### **Railway**
```
□ Dashboard → Ver uso de créditos
□ Backend → View Logs (tempo real)
□ MySQL → View Logs
□ Metrics → Ver performance
```

### **Vercel**
```
□ Dashboard → Ver deployments
□ Analytics → Ver acessos
□ Logs → Ver erros
□ Settings → Ver configurações
```

---

## 🎯 PÓS-DEPLOY

### **Segurança**
```
□ Alterar senha do admin
□ Alterar JWT_SECRET
□ Configurar HTTPS (já automático)
□ Revisar variáveis de ambiente
```

### **Melhorias**
```
□ Configurar domínio personalizado
□ Adicionar monitoramento (Sentry)
□ Configurar backup do banco
□ Adicionar analytics
```

### **Manutenção**
```
□ Monitorar uso de créditos Railway
□ Verificar logs regularmente
□ Testar funcionalidades
□ Fazer backup do banco
```

---

## 💰 CUSTOS

**Railway (Starter):**
- $5 de crédito/mês
- ~500 horas de execução
- Após $5, serviço para (não cobra)

**Vercel (Hobby):**
- 100% gratuito
- 100 GB banda/mês
- Builds ilimitados

**TOTAL: R$ 0,00/mês** ✅

---

## 📞 SUPORTE

**Documentação:**
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs

**Comunidade:**
- Railway Discord
- Vercel Discord
- Stack Overflow

---

## ✅ CHECKLIST FINAL

**Antes de considerar completo:**
- [ ] Backend no ar e respondendo
- [ ] Frontend no ar e carregando
- [ ] Banco de dados conectado
- [ ] Login funcionando
- [ ] CRUD de questões funcionando
- [ ] CRUD de avaliações funcionando
- [ ] PDF sendo gerado
- [ ] Sem erros no console
- [ ] Sem erros nos logs
- [ ] CORS configurado
- [ ] Variáveis de ambiente corretas
- [ ] URLs públicas salvas
- [ ] Senha do admin alterada

---

## 🎉 PRONTO!

**Seu sistema está no ar 100% gratuito!**

**URLs:**
- Frontend: https://seu-app.vercel.app
- Backend: https://seu-backend.up.railway.app
- Admin: admin / admin123 (ALTERE!)

**Tempo total: ~30 minutos**

---

**Última atualização:** Novembro 2025
