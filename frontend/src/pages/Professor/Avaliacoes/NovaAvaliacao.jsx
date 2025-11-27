import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './NovaAvaliacao.css';

const NovaAvaliacao = () => {
  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState([]);
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]);
  const [avaliacao, setAvaliacao] = useState({
    titulo: '',
    turma: '',
    nomeFaculdade: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarQuestoes();
  }, []);

  const carregarQuestoes = async () => {
    try {
      const response = await api.get('/professor/questoes');
      setQuestoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
    }
  };

  const handleChange = (e) => {
    setAvaliacao({
      ...avaliacao,
      [e.target.name]: e.target.value,
    });
  };


  const toggleQuestao = (id) => {
    if (questoesSelecionadas.includes(id)) {
      setQuestoesSelecionadas(questoesSelecionadas.filter((qId) => qId !== id));
    } else {
      setQuestoesSelecionadas([...questoesSelecionadas, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (questoesSelecionadas.length === 0) {
      setError('Selecione ao menos uma questão');
      return;
    }

    setLoading(true);

    try {
      await api.post('/professor/avaliacoes', {
        ...avaliacao,
        questoesIds: questoesSelecionadas,
      });
      navigate('/professor/avaliacoes');
    } catch (err) {
      setError('Erro ao criar avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container nova-avaliacao-container">
        <div className="nova-avaliacao-header">
          <h1>Criar Nova Avaliação</h1>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/professor/avaliacoes')}
            aria-label="Voltar para lista de avaliações"
          >
            <i className="fas fa-arrow-left" aria-hidden="true"></i> Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="avaliacao-form">
          <div className="avaliacao-info-card card">
            <h2>Informações da Avaliação</h2>
            
            {error && (
              <div className="form-error" role="alert" aria-live="polite">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="titulo">Título *</label>
              <input
                type="text"
                id="titulo"
                name="titulo"
                className="input"
                value={avaliacao.titulo}
                onChange={handleChange}
                placeholder="Ex: Cálculo I - Prova Final"
                required
                aria-required="true"
              />
            </div>

            <div className="form-group">
              <label htmlFor="turma">Turma</label>
              <input
                type="text"
                id="turma"
                name="turma"
                className="input"
                value={avaliacao.turma}
                onChange={handleChange}
                placeholder="Ex: Engenharia Civil - 2025.1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="nomeFaculdade">Nome da Faculdade</label>
              <input
                type="text"
                id="nomeFaculdade"
                name="nomeFaculdade"
                className="input"
                value={avaliacao.nomeFaculdade}
                onChange={handleChange}
                placeholder="Ex: FATEC São Paulo"
              />
            </div>
          </div>

          <div className="questoes-selecao-card card">
            <div className="questoes-selecao-header">
              <h2>Selecionar Questões</h2>
              <span className="questoes-count" aria-live="polite">
                {questoesSelecionadas.length} {questoesSelecionadas.length === 1 ? 'questão selecionada' : 'questões selecionadas'}
              </span>
            </div>

            {questoes.length === 0 ? (
              <div className="questoes-empty-state">
                <p>Você ainda não tem questões cadastradas.</p>
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/professor/questoes/nova')}
                >
                  Cadastrar Questão
                </button>
              </div>
            ) : (
              <div className="questoes-selecao-list">
                {questoes.map((questao) => (
                  <div 
                    key={questao.id} 
                    className={`questao-selecao-item ${questoesSelecionadas.includes(questao.id) ? 'selecionada' : ''}`}
                    onClick={() => toggleQuestao(questao.id)}
                    role="checkbox"
                    aria-checked={questoesSelecionadas.includes(questao.id)}
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleQuestao(questao.id);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={questoesSelecionadas.includes(questao.id)}
                      onChange={() => {}}
                      className="questao-checkbox"
                      aria-label={`Selecionar questão: ${questao.enunciado}`}
                      tabIndex={-1}
                    />
                    <div className="questao-selecao-content">
                      <div className="questao-selecao-badges">
                        <span className="badge badge-materia">{questao.materia}</span>
                        {questao.topico && (
                          <span className="badge badge-topico">{questao.topico}</span>
                        )}
                      </div>
                      <p className="questao-selecao-enunciado">{questao.enunciado}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/professor/avaliacoes')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || questoesSelecionadas.length === 0}
              aria-busy={loading}
            >
              {loading ? 'Criando...' : 'Criar Avaliação'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default NovaAvaliacao;
