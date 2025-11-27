# 📚 Guia de Boas Práticas - Sistema Avalia

## 🎯 Objetivo
Este documento descreve as boas práticas implementadas no sistema e como mantê-las.

---

## 🏗️ Arquitetura

### Backend (Spring Boot)
```
backend/
├── config/          # Configurações do sistema
├── controller/      # Endpoints REST
├── dto/            # Data Transfer Objects
├── model/          # Entidades JPA
├── repository/     # Repositórios JPA
├── security/       # Configurações de segurança
└── service/        # Lógica de negócio
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/  # Componentes reutilizáveis
│   ├── context/     # Context API
│   ├── pages/       # Páginas da aplicação
│   ├── services/    # Serviços (API)
│   ├── styles/      # Estilos globais
│   └── utils/       # Utilitários centralizados
```

---

## ✅ Boas Práticas Implementadas

### 1. **Segurança**

#### Backend
- ✅ Senhas criptografadas com BCrypt
- ✅ JWT para autenticação
- ✅ CORS configurado adequadamente
- ✅ Validação de dados com `@Valid`
- ✅ Tratamento de exceções

#### Frontend
- ✅ Token armazenado de forma segura
- ✅ Rotas protegidas por perfil
- ✅ Validação de formulários
- ✅ Sanitização de inputs

**⚠️ IMPORTANTE:**
- Altere a senha padrão do admin em produção
- Use HTTPS em produção
- Configure variáveis de ambiente para dados sensíveis

---

### 2. **Código Limpo**

#### Constantes Centralizadas
```javascript
// ✅ BOM - Usar constantes
import { USER_ROLES, ROUTES } from '@/utils';

if (user.perfil === USER_ROLES.ADMIN) {
  navigate(ROUTES.ADMIN.AVALIACOES);
}

// ❌ RUIM - Valores hardcoded
if (user.perfil === 'ADMIN') {
  navigate('/admin/avaliacoes');
}
```

#### Funções Reutilizáveis
```javascript
// ✅ BOM - Usar utilitários
import { mostrarSucesso, formatarData } from '@/utils';

mostrarSucesso('Salvo com sucesso!');
const dataFormatada = formatarData(avaliacao.criadaEm);

// ❌ RUIM - Código duplicado
alert('Salvo com sucesso!');
const dataFormatada = new Date(avaliacao.criadaEm).toLocaleDateString('pt-BR');
```

---

### 3. **Logging**

#### Backend
```java
// ✅ BOM - Usar logger
private static final Logger logger = LoggerFactory.getLogger(MinhaClasse.class);
logger.info("Operação realizada com sucesso");
logger.error("Erro ao processar", exception);

// ❌ RUIM - System.out.println
System.out.println("Operação realizada");
```

#### Frontend
```javascript
// ✅ BOM - Console estruturado
console.info('Dados carregados:', dados);
console.error('Erro ao carregar:', error);

// ❌ RUIM - Console genérico
console.log('erro', error);
```

---

### 4. **Tratamento de Erros**

#### Backend
```java
// ✅ BOM - Tratamento específico
@GetMapping("/{id}")
public ResponseEntity<Avaliacao> buscar(@PathVariable Long id) {
    try {
        Avaliacao avaliacao = service.buscarPorId(id);
        return ResponseEntity.ok(avaliacao);
    } catch (EntityNotFoundException e) {
        logger.warn("Avaliação não encontrada: {}", id);
        return ResponseEntity.notFound().build();
    } catch (Exception e) {
        logger.error("Erro ao buscar avaliação", e);
        return ResponseEntity.internalServerError().build();
    }
}
```

#### Frontend
```javascript
// ✅ BOM - Tratamento com feedback
try {
  await api.delete(`/avaliacoes/${id}`);
  mostrarSucesso('Deletado com sucesso!');
  recarregar();
} catch (error) {
  console.error('Erro ao deletar:', error);
  const mensagem = error.response?.data?.message || ERROR_MESSAGES.GENERIC;
  mostrarErro(mensagem);
}
```

---

### 5. **Validações**

#### Backend
```java
// ✅ BOM - Validação com anotações
public class UsuarioDTO {
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @Email(message = "Email inválido")
    private String email;
    
    @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
    private String senha;
}
```

#### Frontend
```javascript
// ✅ BOM - Validação reutilizável
import { validarEmail, validarSenha } from '@/utils';

const validacao = validarEmail(email);
if (!validacao.valido) {
  setErro(validacao.mensagem);
  return;
}
```

---

### 6. **Performance**

#### Backend
- ✅ Use `@Transactional` em operações de escrita
- ✅ Evite N+1 queries (use `JOIN FETCH`)
- ✅ Implemente paginação para listas grandes
- ✅ Use cache quando apropriado

#### Frontend
- ✅ Use `useMemo` e `useCallback` para otimizar re-renders
- ✅ Implemente lazy loading de componentes
- ✅ Otimize imagens antes do upload
- ✅ Use debounce em buscas

```javascript
// ✅ BOM - Debounce em busca
const debouncedSearch = useMemo(
  () => debounce((term) => buscar(term), 300),
  []
);
```

---

### 7. **Documentação**

#### Código
```java
/**
 * Cria uma nova avaliação no sistema.
 * 
 * @param request Dados da avaliação
 * @param professorId ID do professor (null para admin)
 * @return Avaliação criada
 * @throws ValidationException se dados inválidos
 */
public Avaliacao criarAvaliacao(AvaliacaoRequest request, Long professorId) {
    // implementação
}
```

#### Commits
```bash
# ✅ BOM - Commits descritivos
git commit -m "feat: adicionar geração de PDF para admin"
git commit -m "fix: corrigir validação de senha"
git commit -m "refactor: extrair lógica de alertas para utilitário"

# ❌ RUIM - Commits vagos
git commit -m "update"
git commit -m "fix bug"
```

---

## 📝 Checklist de Code Review

### Backend
- [ ] Usa logger em vez de System.out
- [ ] Tratamento adequado de exceções
- [ ] Validações com anotações
- [ ] Métodos com responsabilidade única
- [ ] Transações configuradas corretamente
- [ ] Documentação JavaDoc em métodos públicos

### Frontend
- [ ] Usa constantes em vez de valores hardcoded
- [ ] Usa utilitários para alertas e validações
- [ ] Tratamento de erros com feedback ao usuário
- [ ] Componentes pequenos e reutilizáveis
- [ ] Props tipadas (se usando TypeScript)
- [ ] Acessibilidade (aria-labels, alt em imagens)

---

## 🚀 Próximos Passos

### Melhorias Sugeridas
1. **Testes**
   - Adicionar testes unitários (JUnit, Jest)
   - Adicionar testes de integração
   - Configurar CI/CD

2. **Monitoramento**
   - Implementar logs estruturados
   - Adicionar métricas (Prometheus)
   - Configurar alertas

3. **Performance**
   - Implementar cache (Redis)
   - Otimizar queries N+1
   - Adicionar índices no banco

4. **Segurança**
   - Implementar rate limiting
   - Adicionar auditoria de ações
   - Configurar backup automático

---

## 📚 Recursos

### Documentação
- [Spring Boot Best Practices](https://spring.io/guides)
- [React Best Practices](https://react.dev/learn)
- [Clean Code Principles](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)

### Ferramentas
- **Backend**: IntelliJ IDEA, Postman, DBeaver
- **Frontend**: VS Code, React DevTools, Chrome DevTools
- **Versionamento**: Git, GitHub/GitLab

---

## 🤝 Contribuindo

1. Siga as boas práticas descritas
2. Escreva código limpo e documentado
3. Teste suas alterações
4. Faça commits descritivos
5. Solicite code review

---

**Última atualização:** Novembro 2025
