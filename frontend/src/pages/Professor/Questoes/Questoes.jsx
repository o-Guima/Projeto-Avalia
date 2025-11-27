import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './Questoes.css';

const Questoes = () => {
  const [questoes, setQuestoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarQuestoes();
  }, []);

  const carregarQuestoes = async () => {
    try {
      const response = await api.get('/professor/questoes');
      setQuestoes(response.data);
    } catch (error) {
      console.error('Erro ao carregar questões:', error);
    } finally {
      setLoading(false);
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
      <div className="container questoes-container">
        <div className="questoes-header">
          <h1>Banco de Questões</h1>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/professor/questoes/nova')}
          >
            <i className="fas fa-plus"></i> Nova Questão
          </button>
        </div>

        {questoes.length === 0 ? (
          <div className="questoes-empty">
            <i className="fas fa-question-circle"></i>
            <p>Você ainda não cadastrou nenhuma questão</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/professor/questoes/nova')}
            >
              Cadastrar Primeira Questão
            </button>
          </div>
        ) : (
          <div className="questoes-list">
            {questoes.map((questao) => (
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
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Questoes;
