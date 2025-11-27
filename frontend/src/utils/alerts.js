import { ALERT_TYPES, ALERT_ICONS, TIMING } from './constants';

/**
 * Utilitário para exibir alertas personalizados
 * Centraliza a lógica de alertas para reutilização em todo o projeto
 */

/**
 * Mostra um alerta personalizado na tela
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo do alerta (success, error, info, warning)
 * @param {number} duracao - Duração em ms (padrão: 3000)
 */
export const mostrarAlerta = (mensagem, tipo = ALERT_TYPES.SUCCESS, duracao = TIMING.ALERT_DURATION) => {
  const alertDiv = document.createElement('div');
  alertDiv.className = `custom-alert alert-${tipo}`;
  
  const icon = ALERT_ICONS[tipo] || ALERT_ICONS.info;
  alertDiv.innerHTML = `
    <i class="fas fa-${icon}"></i>
    <span>${mensagem}</span>
  `;
  
  document.body.appendChild(alertDiv);
  
  // Animar entrada
  setTimeout(() => alertDiv.classList.add('show'), 10);
  
  // Animar saída e remover
  setTimeout(() => {
    alertDiv.classList.remove('show');
    setTimeout(() => alertDiv.remove(), TIMING.ANIMATION_DURATION);
  }, duracao);
};

/**
 * Mostra um alerta de sucesso
 * @param {string} mensagem - Mensagem a ser exibida
 */
export const mostrarSucesso = (mensagem) => {
  mostrarAlerta(mensagem, ALERT_TYPES.SUCCESS);
};

/**
 * Mostra um alerta de erro
 * @param {string} mensagem - Mensagem a ser exibida
 */
export const mostrarErro = (mensagem) => {
  mostrarAlerta(mensagem, ALERT_TYPES.ERROR);
};

/**
 * Mostra um alerta de informação
 * @param {string} mensagem - Mensagem a ser exibida
 */
export const mostrarInfo = (mensagem) => {
  mostrarAlerta(mensagem, ALERT_TYPES.INFO);
};

/**
 * Mostra um alerta de aviso
 * @param {string} mensagem - Mensagem a ser exibida
 */
export const mostrarAviso = (mensagem) => {
  mostrarAlerta(mensagem, ALERT_TYPES.WARNING);
};

/**
 * Mostra confirmação nativa do navegador
 * @param {string} mensagem - Mensagem de confirmação
 * @param {string} titulo - Título opcional
 * @returns {boolean} - true se confirmado, false caso contrário
 */
export const confirmar = (mensagem, titulo = '') => {
  const textoCompleto = titulo ? `${titulo}\n\n${mensagem}` : mensagem;
  return window.confirm(textoCompleto);
};

/**
 * Mostra confirmação para deletar com detalhes do item
 * @param {string} nomeItem - Nome do item a ser deletado
 * @param {string} tipo - Tipo do item (questão, avaliação, etc)
 * @param {object} detalhes - Detalhes adicionais do item
 * @returns {boolean} - true se confirmado, false caso contrário
 */
export const confirmarDelecao = (nomeItem, tipo = 'item', detalhes = {}) => {
  let mensagem = `Tem certeza que deseja deletar ${tipo === 'item' ? 'este' : 'esta'} ${tipo}?\n\n`;
  
  if (nomeItem) {
    mensagem += `Nome: ${nomeItem}\n`;
  }
  
  Object.entries(detalhes).forEach(([chave, valor]) => {
    if (valor) {
      mensagem += `${chave}: ${valor}\n`;
    }
  });
  
  mensagem += '\nEsta ação não pode ser desfeita.';
  
  return window.confirm(mensagem);
};

export default {
  mostrarAlerta,
  mostrarSucesso,
  mostrarErro,
  mostrarInfo,
  mostrarAviso,
  confirmar,
  confirmarDelecao
};
