import { useState, useRef, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './IAvalia.css';

const STORAGE_KEY = 'iavalia_messages';

const IAvalia = () => {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Erro ao carregar mensagens salvas:', error);
      return [];
    }
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Salvar mensagens no sessionStorage sempre que mudarem
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Erro ao salvar mensagens:', error);
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.post('/professor/iavalia/chat', {
        message: userMessage
      });

      // Adicionar resposta da IA
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response 
      }]);
    } catch (error) {
      console.error('Erro:', error);
      const errorMsg = error.response?.data?.error || 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMsg
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Deseja limpar toda a conversa?')) {
      setMessages([]);
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };
  
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };


  return (
    <>
      <Navbar />
      <div className="container iavalia-container">
        <div className="iavalia-header">
          <div className="iavalia-title">
            <i className="fas fa-robot"></i>
            <h1>IAvalia</h1>
          </div>
          <p className="iavalia-subtitle">
            Assistente de IA para criação de questões de avaliação
          </p>
          {messages.length > 0 && (
            <button className="btn btn-secondary" onClick={handleClearChat}>
              <i className="fas fa-trash"></i> Limpar Conversa
            </button>
          )}
        </div>

        <div className="chat-container card">
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <i className="fas fa-robot chat-welcome-icon"></i>
                <h2>Olá! Sou o IAvalia 🤖</h2>
                <p>Estou aqui para ajudá-lo a criar questões de múltipla escolha para suas avaliações.</p>
                <div className="chat-suggestions">
                  <h3>Exemplos do que você pode pedir:</h3>
                  <div className="suggestions-grid">
                    <button 
                      className="suggestion-card"
                      onClick={() => handleSuggestionClick('Crie uma questão de nível médio sobre estruturas de dados em Java')}
                    >
                      <i className="fas fa-code"></i>
                      <span>Questão sobre programação</span>
                    </button>
                    <button 
                      className="suggestion-card"
                      onClick={() => handleSuggestionClick('Crie uma questão difícil sobre a Segunda Guerra Mundial')}
                    >
                      <i className="fas fa-book"></i>
                      <span>Questão de história</span>
                    </button>
                    <button 
                      className="suggestion-card"
                      onClick={() => handleSuggestionClick('Crie uma questão fácil sobre equações do segundo grau')}
                    >
                      <i className="fas fa-calculator"></i>
                      <span>Questão de matemática</span>
                    </button>
                    <button 
                      className="suggestion-card"
                      onClick={() => handleSuggestionClick('Crie uma questão média sobre fotossíntese')}
                    >
                      <i className="fas fa-leaf"></i>
                      <span>Questão de biologia</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-avatar">
                    {message.role === 'user' ? (
                      <i className="fas fa-user"></i>
                    ) : (
                      <i className="fas fa-robot"></i>
                    )}
                  </div>
                  <div className="message-content">
                    <div className="message-text">
                      {message.content.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="message assistant">
                <div className="message-avatar">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <div className="chat-input-wrapper">
              <textarea
                className="chat-input"
                placeholder="Digite sua mensagem... (Ex: Crie uma questão de nível médio sobre algoritmos)"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                rows="3"
              />
              <button 
                className="btn-send" 
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IAvalia;
