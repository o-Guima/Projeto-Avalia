import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './Questoes.css';

const Questoes = () => {
  const [questoes, setQuestoes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroMateria, setFiltroMateria] = useState('');
  const [filtroProfessor, setFiltroProfessor] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [questoesRes, materiasRes, professoresRes] = await Promise.all([
        api.get('/admin/questoes'),
        api.get('/admin/materias'),
        api.get('/admin/professores')
      ]);
      setQuestoes(questoesRes.data);
      setMaterias(materiasRes.data);
      setProfessores(professoresRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const carregarQuestoes = async () => {
    try {
      const response = await api.get('/admin/questoes');
      setQuestoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
    }
  };

  const handleDeletar = async (id) => {
    const questao = questoes.find(q => q.id === id);
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar esta questão?\n\n` +
      `Matéria: ${questao?.materia}\n` +
      `Enunciado: ${questao?.enunciado?.substring(0, 60)}...\n\n` +
      `Esta ação não pode ser desfeita.`
    );
    
    if (confirmacao) {
      try {
        await api.delete(`/admin/questoes/${id}`);
        alert('Questão deletada com sucesso!');
        carregarQuestoes();
      } catch (error) {
        console.error('Erro ao deletar questão:', error);
        const mensagem = error.response?.data?.message || 
          error.response?.status === 409 || error.response?.status === 400 ? 
          'Não é possível deletar esta questão pois ela está sendo usada em avaliações ativas.' :
          `Erro ao deletar questão: ${error.response?.data || error.message}`;
        alert(mensagem);
      }
    }
  };

  const questoesFiltradas = questoes.filter((questao) => {
    // Filtro de matéria
    const matchMateria = !filtroMateria || questao.materia === filtroMateria;
    
    // Filtro de professor
    const matchProfessor = !filtroProfessor || 
      (questao.professor && questao.professor.nome === filtroProfessor);
    
    return matchMateria && matchProfessor;
  });

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
      <div className="container questoes-container">
        <div className="questoes-header">
          <h1>Todas as Questões Cadastradas</h1>
          <div className="questoes-stats">
            <span className="stat-badge">
              <i className="fas fa-question-circle"></i> 
              {questoesFiltradas.length === questoes.length 
                ? `${questoes.length} questões` 
                : `${questoesFiltradas.length} de ${questoes.length} questões`}
            </span>
          </div>
        </div>

        <div className="questoes-filters card">
          <div className="filter-group">
            <label htmlFor="filtroMateria">
              <i className="fas fa-book"></i> Filtrar por Matéria
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
          <div className="filter-group">
            <label htmlFor="filtroProfessor">
              <i className="fas fa-user"></i> Filtrar por Professor
            </label>
            <select
              id="filtroProfessor"
              className="input"
              value={filtroProfessor}
              onChange={(e) => setFiltroProfessor(e.target.value)}
            >
              <option value="">Todos os professores</option>
              {professores.map((prof) => (
                <option key={prof.id} value={prof.nome}>
                  {prof.nome}
                </option>
              ))}
            </select>
          </div>
          {(filtroMateria || filtroProfessor) && (
            <div className="filter-group filter-actions">
              <button 
                className="btn-clear-filters"
                onClick={() => {
                  setFiltroMateria('');
                  setFiltroProfessor('');
                }}
              >
                <i className="fas fa-times-circle"></i> Limpar Filtros
              </button>
            </div>
          )}
        </div>

        {questoesFiltradas.length === 0 ? (
          <div className="questoes-empty">
            <i className="fas fa-search"></i>
            <p>
              {questoes.length === 0 
                ? 'Nenhuma questão cadastrada no sistema' 
                : 'Nenhuma questão encontrada com os filtros aplicados'}
            </p>
          </div>
        ) : (
          <div className="questoes-list">
            {questoesFiltradas.map((questao) => (
              <div key={questao.id} className="questao-card card">
                <div className="questao-card-header">
                  <div className="questao-badges">
                    <span className="badge badge-materia">{questao.materia}</span>
                    {questao.topico && (
                      <span className="badge badge-topico">{questao.topico}</span>
                    )}
                    <span className={`badge badge-${questao.nivelDificuldade?.toLowerCase()}`}>
                      {questao.nivelDificuldade}
                    </span>
                  </div>
                  <div className="questao-pontuacao">
                    {questao.pontuacao} {questao.pontuacao === 1 ? 'ponto' : 'pontos'}
                  </div>
                </div>

                <div className="questao-card-body">
                  <p className="questao-enunciado">{questao.enunciado}</p>
                  
                  {questao.alternativas && questao.alternativas.length > 0 && (
                    <div className="questao-alternativas">
                      {questao.alternativas.map((alt) => (
                        <div 
                          key={alt.id} 
                          className={`alternativa-preview ${alt.correta ? 'correta' : ''}`}
                        >
                          <strong>{alt.letra})</strong> {alt.textoAlternativa}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="questao-card-footer">
                  <div className="questao-professor">
                    <i className="fas fa-user"></i>
                    <span>Professor: <strong>{questao.professor?.nome || 'Não informado'}</strong></span>
                  </div>
                  <button 
                    className="btn-icon btn-danger"
                    onClick={() => handleDeletar(questao.id)}
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

export default Questoes;
