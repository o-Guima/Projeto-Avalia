import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './Avaliacoes.css';

const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarAvaliacoes();
  }, []);

  const carregarAvaliacoes = async () => {
    try {
      const response = await api.get('/admin/avaliacoes');
      setAvaliacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id) => {
    const avaliacao = avaliacoes.find(a => a.id === id);
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar a avaliação "${avaliacao?.titulo}"?\n\n` +
      `Esta ação não pode ser desfeita.`
    );
    
    if (confirmacao) {
      try {
        await api.delete(`/admin/avaliacoes/${id}`);
        alert('Avaliação deletada com sucesso!');
        carregarAvaliacoes();
      } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        alert('Erro ao deletar avaliação. Tente novamente.');
      }
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Carregando...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container avaliacoes-container">
        <div className="avaliacoes-header">
          <h1>Gerenciar Avaliações</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/admin/avaliacoes/nova')}
          >
            <i className="fas fa-plus"></i> Nova Avaliação
          </button>
        </div>

        {avaliacoes.length === 0 ? (
          <div className="avaliacoes-empty card">
            <i className="fas fa-clipboard-list"></i>
            <p>Nenhuma avaliação cadastrada</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/admin/avaliacoes/nova')}
            >
              Criar Primeira Avaliação
            </button>
          </div>
        ) : (
          <div className="avaliacoes-grid">
            {avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="avaliacao-card card">
                <div className="avaliacao-card-header">
                  <h3>{avaliacao.titulo}</h3>
                  <span className="avaliacao-questoes-count">
                    {avaliacao.questoes?.length || 0} questões
                  </span>
                </div>

                <div className="avaliacao-card-body">
                  {avaliacao.turma && (
                    <div className="avaliacao-info">
                      <i className="fas fa-users"></i>
                      <span>Turma: {avaliacao.turma}</span>
                    </div>
                  )}
                  {avaliacao.nomeFaculdade && (
                    <div className="avaliacao-info">
                      <i className="fas fa-university"></i>
                      <span>{avaliacao.nomeFaculdade}</span>
                    </div>
                  )}
                  {avaliacao.professor && (
                    <div className="avaliacao-info">
                      <i className="fas fa-user"></i>
                      <span>Professor: {avaliacao.professor.nome}</span>
                    </div>
                  )}
                  <div className="avaliacao-info">
                    <i className="fas fa-calendar"></i>
                    <span>Criada em: {new Date(avaliacao.criadaEm).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>

                <div className="avaliacao-card-actions">
                  <button 
                    className="btn-icon btn-secondary"
                    onClick={() => navigate(`/admin/avaliacoes/${avaliacao.id}`)}
                    title="Visualizar"
                  >
                    <i className="fas fa-eye"></i> Visualizar
                  </button>
                  <button 
                    className="btn-icon btn-danger"
                    onClick={() => handleDeletar(avaliacao.id)}
                    title="Deletar"
                  >
                    <i className="fas fa-trash"></i> Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Avaliacoes;
