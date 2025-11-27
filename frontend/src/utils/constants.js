/**
 * Constantes centralizadas do sistema
 * Facilita manutenção e evita valores hardcoded espalhados pelo código
 */

// Perfis de usuário
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  PROFESSOR: 'PROFESSOR'
};

// Níveis de dificuldade
export const DIFFICULTY_LEVELS = {
  FACIL: 'FACIL',
  MEDIO: 'MEDIO',
  DIFICIL: 'DIFICIL'
};

// Labels de dificuldade
export const DIFFICULTY_LABELS = {
  FACIL: 'Fácil',
  MEDIO: 'Médio',
  DIFICIL: 'Difícil'
};

// Tipos de alerta
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

// Ícones de alerta
export const ALERT_ICONS = {
  success: 'check-circle',
  error: 'exclamation-circle',
  info: 'info-circle',
  warning: 'exclamation-triangle'
};

// Limites de caracteres
export const CHARACTER_LIMITS = {
  MATERIA_DESCRICAO: 50,
  QUESTAO_ENUNCIADO: 1000,
  AVALIACAO_TITULO: 100
};

// Mensagens de erro padrão
export const ERROR_MESSAGES = {
  GENERIC: 'Ocorreu um erro. Tente novamente.',
  NETWORK: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você não tem permissão para esta ação.',
  NOT_FOUND: 'Recurso não encontrado.',
  VALIDATION: 'Verifique os dados informados.'
};

// Mensagens de sucesso padrão
export const SUCCESS_MESSAGES = {
  CREATED: 'Criado com sucesso!',
  UPDATED: 'Atualizado com sucesso!',
  DELETED: 'Deletado com sucesso!',
  SAVED: 'Salvo com sucesso!'
};

// Configurações de paginação
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100
};

// Configurações de arquivo
export const FILE_CONFIG = {
  MAX_SIZE_MB: 2,
  MAX_SIZE_BYTES: 2 * 1024 * 1024,
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// Rotas da aplicação
export const ROUTES = {
  LOGIN: '/login',
  ADMIN: {
    BASE: '/admin',
    PROFESSORES: '/admin/professores',
    MATERIAS: '/admin/materias',
    QUESTOES: '/admin/questoes',
    AVALIACOES: '/admin/avaliacoes',
    AVALIACOES_NOVA: '/admin/avaliacoes/nova',
    AVALIACOES_VIEW: (id) => `/admin/avaliacoes/${id}`
  },
  PROFESSOR: {
    BASE: '/professor',
    AVALIACOES: '/professor/avaliacoes',
    AVALIACOES_NOVA: '/professor/avaliacoes/nova',
    AVALIACOES_EDITAR: (id) => `/professor/avaliacoes/editar/${id}`,
    QUESTOES: '/professor/questoes',
    QUESTOES_NOVA: '/professor/questoes/nova',
    IAVALIA: '/professor/iavalia'
  }
};

// Configurações de tempo
export const TIMING = {
  ALERT_DURATION: 3000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300
};

export default {
  USER_ROLES,
  DIFFICULTY_LEVELS,
  DIFFICULTY_LABELS,
  ALERT_TYPES,
  ALERT_ICONS,
  CHARACTER_LIMITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  FILE_CONFIG,
  ROUTES,
  TIMING
};
