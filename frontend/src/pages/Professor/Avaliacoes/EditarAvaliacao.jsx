import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './NovaAvaliacao.css';

const EditarAvaliacao = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [questoes, setQuestoes] = useState([]);
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]);
  const [avaliacao, setAvaliacao] = useState({
    titulo: '',
    turma: '',
    nomeFaculdade: '',
    logoFaculdade: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [id]);

  const carregarDados = async () => {
    try {
      const [avaliacaoRes, questoesRes] = await Promise.all([
        api.get(`/professor/avaliacoes/${id}`),
        api.get('/professor/questoes')
      ]);
      
      setAvaliacao({
        titulo: avaliacaoRes.data.titulo,
        turma: avaliacaoRes.data.turma || '',
        nomeFaculdade: avaliacaoRes.data.nomeFaculdade || '',
        logoFaculdade: avaliacaoRes.data.logoFaculdade || '',
      });
      
      setQuestoesSelecionadas(avaliacaoRes.data.questoes.map(q => q.id));
      setQuestoes(questoesRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar avaliação');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    setAvaliacao({
      ...avaliacao,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('A logo deve ter no máximo 2MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione uma imagem válida');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvaliacao({
          ...avaliacao,
          logoFaculdade: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoverLogo = () => {
    setAvaliacao({
      ...avaliacao,
      logoFaculdade: '',
    });
  };

  const toggleQuestao = (questaoId) => {
    if (questoesSelecionadas.includes(questaoId)) {
      setQuestoesSelecionadas(questoesSelecionadas.filter((qId) => qId !== questaoId));
    } else {
      setQuestoesSelecionadas([...questoesSelecionadas, questaoId]);
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
      await api.put(`/professor/avaliacoes/${id}`, {
        ...avaliacao,
        questoesIds: questoesSelecionadas,
      });
      navigate('/professor/avaliacoes');
    } catch (err) {
      setError('Erro ao atualizar avaliação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
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
      <div className="container nova-avaliacao-container">
        <div className="nova-avaliacao-header">
          <h1>Editar Avaliação</h1>
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

            <div className="form-group">
              <label htmlFor="logoFaculdade">Logo da Faculdade (opcional)</label>
              {avaliacao.logoFaculdade ? (
                <div className="logo-preview">
                  <img 
                    src={avaliacao.logoFaculdade} 
                    alt="Logo da faculdade" 
                    className="logo-preview-img"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleRemoverLogo}
                  >
                    <i className="fas fa-trash" aria-hidden="true"></i> Remover Logo
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  id="logoFaculdade"
                  name="logoFaculdade"
                  className="input"
                  accept="image/*"
                  onChange={handleLogoChange}
                  aria-describedby="logo-help"
                />
              )}
              <small id="logo-help" className="form-help">
                Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 2MB
              </small>
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
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditarAvaliacao;
