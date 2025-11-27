import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './NovaAvaliacao.css';

const NovaAvaliacao = () => {
  const navigate = useNavigate();
  const [questoes, setQuestoes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState([]);
  const [filtroMateria, setFiltroMateria] = useState('');
  const [avaliacao, setAvaliacao] = useState({
    titulo: '',
    turma: '',
    nomeFaculdade: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [questoesRes, materiasRes] = await Promise.all([
        api.get('/admin/questoes'),
        api.get('/admin/materias')
      ]);
      setQuestoes(questoesRes.data);
      setMaterias(materiasRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
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

  const questoesFiltradas = questoes.filter((questao) => {
    if (!filtroMateria) return true;
    return questao.materia === filtroMateria;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (questoesSelecionadas.length === 0) {
      setError('Selecione ao menos uma questão');
      return;
    }

    setLoading(true);

    try {
      await api.post('/admin/avaliacoes', {
        ...avaliacao,
        questoesIds: questoesSelecionadas,
      });
      alert('Avaliação criada com sucesso!');
      navigate('/admin/avaliacoes');
    } catch (err) {
      console.error('Erro ao criar avaliação:', err);
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
            onClick={() => navigate('/admin/avaliacoes')}
          >
            <i className="fas fa-arrow-left"></i> Voltar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="avaliacao-form">
          <div className="avaliacao-info-card card">
            <h3>Informações da Avaliação</h3>
            
            {error && (
              <div className="form-error">
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
              <h3>Selecionar Questões</h3>
              <span className="questoes-count">
                {questoesSelecionadas.length} {questoesSelecionadas.length === 1 ? 'questão selecionada' : 'questões selecionadas'}
              </span>
            </div>

            <div className="filtro-materia">
              <label htmlFor="filtroMateria">
                <i className="fas fa-filter"></i> Filtrar por Matéria
              </label>
              <select
                id="filtroMateria"
                className="input"
                value={filtroMateria}
                onChange={(e) => setFiltroMateria(e.target.value)}
              >
                <option value="">Todas as matérias</option>
                {materias.map((mat) => (
                  <option key={mat.id} value={mat.nome}>
                    {mat.nome}
                  </option>
                ))}
              </select>
            </div>

            {questoesFiltradas.length === 0 ? (
              <div className="questoes-empty-state">
                <p>Nenhuma questão encontrada.</p>
              </div>
            ) : (
              <div className="questoes-selecao-list">
                {questoesFiltradas.map((questao) => (
                  <div 
                    key={questao.id} 
                    className={`questao-selecao-item ${questoesSelecionadas.includes(questao.id) ? 'selecionada' : ''}`}
                  >
                    <input
                      type="checkbox"
                      className="questao-checkbox"
                      checked={questoesSelecionadas.includes(questao.id)}
                      onChange={() => toggleQuestao(questao.id)}
                    />
                    <div className="questao-selecao-content">
                      <div className="questao-selecao-badges">
                        <span className="badge badge-materia">{questao.materia}</span>
                        {questao.topico && (
                          <span className="badge badge-topico">{questao.topico}</span>
                        )}
                        <span className={`badge badge-${questao.nivelDificuldade?.toLowerCase()}`}>
                          {questao.nivelDificuldade}
                        </span>
                        <span className="badge badge-pontos">{questao.pontuacao} pts</span>
                      </div>
                      <p className="questao-selecao-enunciado">{questao.enunciado}</p>
                      {questao.professor && (
                        <small className="questao-professor-info">
                          <i className="fas fa-user"></i> {questao.professor.nome}
                        </small>
                      )}
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
              onClick={() => navigate('/admin/avaliacoes')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
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
