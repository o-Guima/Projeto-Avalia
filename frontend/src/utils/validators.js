import { CHARACTER_LIMITS, FILE_CONFIG } from './constants';

/**
 * Utilitários de validação
 * Centraliza regras de validação para reutilização
 */

/**
 * Valida se um campo está vazio
 * @param {string} valor - Valor a ser validado
 * @returns {boolean} - true se válido, false se inválido
 */
export const validarCampoObrigatorio = (valor) => {
  return valor && valor.trim().length > 0;
};

/**
 * Valida email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - true se válido, false se inválido
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida limite de caracteres
 * @param {string} texto - Texto a ser validado
 * @param {number} limite - Limite de caracteres
 * @returns {boolean} - true se válido, false se inválido
 */
export const validarLimiteCaracteres = (texto, limite) => {
  return texto.length <= limite;
};

/**
 * Valida tamanho de arquivo
 * @param {File} arquivo - Arquivo a ser validado
 * @param {number} tamanhoMaxMB - Tamanho máximo em MB (padrão: 2MB)
 * @returns {object} - { valido: boolean, mensagem: string }
 */
export const validarTamanhoArquivo = (arquivo, tamanhoMaxMB = FILE_CONFIG.MAX_SIZE_MB) => {
  const tamanhoMaxBytes = tamanhoMaxMB * 1024 * 1024;
  
  if (arquivo.size > tamanhoMaxBytes) {
    return {
      valido: false,
      mensagem: `O arquivo deve ter no máximo ${tamanhoMaxMB}MB`
    };
  }
  
  return { valido: true, mensagem: '' };
};

/**
 * Valida tipo de arquivo de imagem
 * @param {File} arquivo - Arquivo a ser validado
 * @returns {object} - { valido: boolean, mensagem: string }
 */
export const validarTipoImagem = (arquivo) => {
  if (!arquivo.type.startsWith('image/')) {
    return {
      valido: false,
      mensagem: 'Por favor, selecione uma imagem válida'
    };
  }
  
  if (!FILE_CONFIG.ACCEPTED_IMAGE_TYPES.includes(arquivo.type)) {
    return {
      valido: false,
      mensagem: 'Formato de imagem não suportado. Use JPG, PNG, GIF ou WebP'
    };
  }
  
  return { valido: true, mensagem: '' };
};

/**
 * Valida arquivo de imagem (tipo e tamanho)
 * @param {File} arquivo - Arquivo a ser validado
 * @returns {object} - { valido: boolean, mensagem: string }
 */
export const validarArquivoImagem = (arquivo) => {
  const validacaoTipo = validarTipoImagem(arquivo);
  if (!validacaoTipo.valido) {
    return validacaoTipo;
  }
  
  return validarTamanhoArquivo(arquivo);
};

/**
 * Valida senha
 * @param {string} senha - Senha a ser validada
 * @param {number} tamanhoMinimo - Tamanho mínimo (padrão: 6)
 * @returns {object} - { valido: boolean, mensagem: string }
 */
export const validarSenha = (senha, tamanhoMinimo = 6) => {
  if (!senha || senha.length < tamanhoMinimo) {
    return {
      valido: false,
      mensagem: `A senha deve ter no mínimo ${tamanhoMinimo} caracteres`
    };
  }
  
  return { valido: true, mensagem: '' };
};

/**
 * Valida se há pelo menos um item selecionado
 * @param {Array} itens - Array de itens selecionados
 * @param {string} nomeItem - Nome do item para mensagem
 * @returns {object} - { valido: boolean, mensagem: string }
 */
export const validarSelecaoMinima = (itens, nomeItem = 'item') => {
  if (!itens || itens.length === 0) {
    return {
      valido: false,
      mensagem: `Selecione ao menos um ${nomeItem}`
    };
  }
  
  return { valido: true, mensagem: '' };
};

/**
 * Valida descrição de matéria
 * @param {string} descricao - Descrição a ser validada
 * @returns {object} - { valido: boolean, mensagem: string }
 */
export const validarDescricaoMateria = (descricao) => {
  if (!descricao || descricao.trim().length === 0) {
    return { valido: true, mensagem: '' }; // Descrição é opcional
  }
  
  if (descricao.length > CHARACTER_LIMITS.MATERIA_DESCRICAO) {
    return {
      valido: false,
      mensagem: `A descrição deve ter no máximo ${CHARACTER_LIMITS.MATERIA_DESCRICAO} caracteres`
    };
  }
  
  return { valido: true, mensagem: '' };
};

export default {
  validarCampoObrigatorio,
  validarEmail,
  validarLimiteCaracteres,
  validarTamanhoArquivo,
  validarTipoImagem,
  validarArquivoImagem,
  validarSenha,
  validarSelecaoMinima,
  validarDescricaoMateria
};
