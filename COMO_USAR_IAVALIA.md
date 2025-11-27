# 🚀 Como Usar o IAvalia - Guia Rápido

## Passo 1: Obter API Key (2 minutos)

1. **Acesse:** https://aistudio.google.com/app/apikey
2. **Faça login** com sua conta Google
3. **Clique em** "Create API Key"
4. **Copie** a chave (algo como: `AIzaSyD...`)

## Passo 2: Colar a Chave (30 segundos)

1. Abra o arquivo:
   ```
   backend/src/main/resources/application.properties
   ```

2. Encontre a linha:
   ```properties
   gemini.api.key=COLE_SUA_CHAVE_AQUI
   ```

3. **Cole sua chave:**
   ```properties
   gemini.api.key=AIzaSyD_sua_chave_real_aqui
   ```

4. **Salve o arquivo** (Ctrl+S)

## Passo 3: Reiniciar o Backend (1 minuto)

1. **Pare** o backend se estiver rodando (Ctrl+C no terminal)

2. **Inicie novamente:**
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

3. **Aguarde** a mensagem: `Started AvaliaApplication`

## Passo 4: Usar o IAvalia! 🎉

1. **Faça login** como professor
2. **Clique** no menu "🤖 IAvalia"
3. **Digite** algo como:
   - "Crie uma questão de nível médio sobre Java"
   - "Faça uma questão difícil sobre Segunda Guerra Mundial"
   - "Crie uma questão fácil sobre equações do segundo grau"

4. **Veja a mágica acontecer!** ✨

---

## ⚠️ Importante

- ✅ A API key é **GRATUITA** para uso pessoal
- ✅ Você tem **1.500 requisições por dia** grátis
- ✅ Não precisa cartão de crédito
- ✅ Não precisa Google Cloud Platform

## 🆘 Problemas?

### "Erro ao comunicar com a API"
→ Verifique se colou a chave corretamente (sem espaços)

### "API key not valid"
→ Gere uma nova chave em: https://aistudio.google.com/app/apikey

### Backend não inicia
→ Certifique-se de ter Java 17+ instalado

---

**Pronto! Agora você tem um assistente de IA para criar questões! 🚀**
