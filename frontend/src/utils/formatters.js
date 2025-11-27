/**
 * Utilitários de formatação
 * Centraliza funções de formatação para reutilização
 */

/**
 * Formata data para padrão brasileiro
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} - Data formatada (dd/mm/aaaa)
 */
export const formatarData = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleDateString('pt-BR');
};

/**
 * Formata data e hora para padrão brasileiro
 * @param {string|Date} data - Data a ser formatada
 * @returns {string} - Data e hora formatadas (dd/mm/aaaa hh:mm)
 */
export const formatarDataHora = (data) => {
  if (!data) return '';
  
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  return dataObj.toLocaleString('pt-BR');
};

/**
 * Formata nome de arquivo removendo espaços e caracteres especiais
 * @param {string} nome - Nome a ser formatado
 * @returns {string} - Nome formatado
 */
export const formatarNomeArquivo = (nome) => {
  return nome
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_.-]/g, '')
    .toLowerCase();
};

/**
 * Trunca texto com reticências
 * @param {string} texto - Texto a ser truncado
 * @param {number} limite - Limite de caracteres
 * @returns {string} - Texto truncado
 */
export const truncarTexto = (texto, limite = 50) => {
  if (!texto || texto.length <= limite) return texto;
  return texto.substring(0, limite) + '...';
};

/**
 * Formata número de questões (singular/plural)
 * @param {number} quantidade - Quantidade de questões
 * @returns {string} - Texto formatado
 */
export const formatarQuantidadeQuestoes = (quantidade) => {
  return quantidade === 1 ? '1 questão' : `${quantidade} questões`;
};

/**
 * Formata pontuação (singular/plural)
 * @param {number} pontos - Quantidade de pontos
 * @returns {string} - Texto formatado
 */
export const formatarPontuacao = (pontos) => {
  return pontos === 1 ? '1 ponto' : `${pontos} pontos`;
};

/**
 * Capitaliza primeira letra
 * @param {string} texto - Texto a ser capitalizado
 * @returns {string} - Texto capitalizado
 */
export const capitalizarPrimeiraLetra = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Formata bytes para tamanho legível
 * @param {number} bytes - Tamanho em bytes
 * @returns {string} - Tamanho formatado (KB, MB, etc)
 */
export const formatarTamanhoArquivo = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Remove acentos de uma string
 * @param {string} texto - Texto com acentos
 * @returns {string} - Texto sem acentos
 */
export const removerAcentos = (texto) => {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Formata CPF
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado (xxx.xxx.xxx-xx)
 */
export const formatarCPF = (cpf) => {
  if (!cpf) return '';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Formata telefone
 * @param {string} telefone - Telefone sem formatação
 * @returns {string} - Telefone formatado
 */
export const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  
  const cleaned = telefone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};

export default {
  formatarData,
  formatarDataHora,
  formatarNomeArquivo,
  truncarTexto,
  formatarQuantidadeQuestoes,
  formatarPontuacao,
  capitalizarPrimeiraLetra,
  formatarTamanhoArquivo,
  removerAcentos,
  formatarCPF,
  formatarTelefone
};
