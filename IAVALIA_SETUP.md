# 🤖 IAvalia - Configuração Simplificada

## Visão Geral
O IAvalia é um assistente de IA integrado ao sistema Flavalia que ajuda professores a criar questões de múltipla escolha usando o modelo Gemini 2.0 Flash Exp do Google.

## ⚡ Configuração Rápida (3 Passos)

### 1. Obter API Key do Google AI Studio

1. Acesse: **https://aistudio.google.com/app/apikey**
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### 2. Colar a API Key no projeto

Edite o arquivo `backend/src/main/resources/application.properties`:

```properties
# Google Gemini API Configuration
# Obtenha sua chave em: https://aistudio.google.com/app/apikey
gemini.api.key=COLE_SUA_CHAVE_AQUI
gemini.api.model=gemini-2.0-flash-exp
```

**Cole sua API Key no lugar de `COLE_SUA_CHAVE_AQUI`**

### 3. Pronto!

Não precisa de mais nada! Sem Google Cloud Platform, sem credenciais complexas, sem configurações adicionais.

## Instalação

### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Compile o projeto (as dependências serão baixadas automaticamente):
   ```bash
   ./mvnw clean install -DskipTests
   ```

3. Inicie o servidor:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend

O frontend já está configurado e não requer instalação adicional.

## Testando a Integração

1. Faça login como professor
2. Clique no menu "IAvalia" (ícone de robô)
3. Digite uma mensagem como: "Crie uma questão de nível médio sobre algoritmos"
4. Aguarde a resposta em tempo real via SSE (Server-Sent Events)

## Troubleshooting

### Erro: "Failed to load resource: net::ERR_CONNECTION_REFUSED"
- Verifique se o backend está rodando na porta 8080
- Reinicie o backend após colar a API key

### Erro: "Erro ao comunicar com a API do Gemini"
- Verifique se você colou a API key corretamente
- Verifique se a API key está válida em: https://aistudio.google.com/app/apikey
- Certifique-se de que não há espaços extras na chave

### Erro: "API key not valid"
- Sua API key pode ter expirado ou sido revogada
- Gere uma nova chave em: https://aistudio.google.com/app/apikey

### Modelo não disponível
- Se `gemini-2.0-flash-exp` não estiver disponível, use:
  - `gemini-1.5-flash` (mais rápido)
  - `gemini-1.5-pro` (mais poderoso)

## Custos

✅ **GRÁTIS!** O Google AI Studio oferece cota gratuita generosa para uso pessoal e desenvolvimento.

Limites da versão gratuita:
- 15 requisições por minuto
- 1 milhão de tokens por minuto
- 1.500 requisições por dia

Para uso em produção com limites maiores, consulte:
https://ai.google.dev/pricing

## Recursos Implementados

✅ Chat em tempo real com streaming (SSE)
✅ Interface responsiva com identidade visual do Flavalia
✅ Sugestões de perguntas para começar
✅ Indicador de digitação
✅ Botão para parar geração
✅ Limpar conversa
✅ Acesso restrito apenas para professores
✅ Formatação de mensagens com quebras de linha

## Próximos Passos (Opcional)

- Adicionar histórico de conversas no banco de dados
- Implementar export de questões geradas direto para o banco
- Adicionar templates de questões
- Implementar feedback sobre qualidade das questões geradas
