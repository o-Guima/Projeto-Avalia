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
      const response = await api.get('/professor/avaliacoes');
      setAvaliacoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGerarPdf = async (id) => {
    try {
      const response = await api.get(`/professor/avaliacoes/${id}/pdf`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `avaliacao_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF');
    }
  };

  const handleEditar = (id) => {
    navigate(`/professor/avaliacoes/editar/${id}`);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
      try {
        await api.delete(`/professor/avaliacoes/${id}`);
        carregarAvaliacoes();
      } catch (error) {
        console.error('Erro ao deletar avaliação:', error);
        alert('Erro ao deletar avaliação');
      }
    }
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container" role="main">
          <p aria-live="polite">Carregando avaliações...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container avaliacoes-container">
        <div className="avaliacoes-header">
          <h1>Suas Avaliações</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/professor/avaliacoes/nova')}
            aria-label="Criar nova avaliação"
          >
            <i className="fas fa-plus" aria-hidden="true"></i> Criar Nova Avaliação
          </button>
        </div>

        {avaliacoes.length === 0 ? (
          <div className="avaliacoes-empty" role="status">
            <i className="fas fa-file-alt" aria-hidden="true"></i>
            <p>Você ainda não criou nenhuma avaliação</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/professor/avaliacoes/nova')}
              aria-label="Criar sua primeira avaliação"
            >
              Criar Primeira Avaliação
            </button>
          </div>
        ) : (
          <div className="avaliacoes-grid" role="list">
            {avaliacoes.map((avaliacao) => (
              <article key={avaliacao.id} className="avaliacao-card card" role="listitem">
                <div className="avaliacao-card-header">
                  <h3>{avaliacao.titulo}</h3>
                </div>
                
                <div className="avaliacao-card-body">
                  {avaliacao.turma && (
                    <p className="avaliacao-info">
                      <strong>Turma:</strong> {avaliacao.turma}
                    </p>
                  )}
                  <p className="avaliacao-info">
                    <strong>Criada em:</strong> {formatarData(avaliacao.criadaEm)}
                  </p>
                  <p className="avaliacao-info">
                    <strong>Questões:</strong> {avaliacao.questoes?.length || 0}
                  </p>
                </div>

                <div className="avaliacao-card-actions">
                  <button 
                    className="btn-icon"
                    onClick={() => handleEditar(avaliacao.id)}
                    aria-label={`Editar avaliação ${avaliacao.titulo}`}
                  >
                    <i className="fas fa-edit" aria-hidden="true"></i> Editar
                  </button>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleGerarPdf(avaliacao.id)}
                    aria-label={`Gerar PDF da avaliação ${avaliacao.titulo}`}
                  >
                    <i className="fas fa-file-pdf" aria-hidden="true"></i> Gerar Prova
                  </button>
                  <button 
                    className="btn-icon btn-danger"
                    onClick={() => handleDeletar(avaliacao.id)}
                    aria-label={`Deletar avaliação ${avaliacao.titulo}`}
                  >
                    <i className="fas fa-trash" aria-hidden="true"></i>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default Avaliacoes;
