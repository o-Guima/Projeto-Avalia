import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './VisualizarAvaliacao.css';

const VisualizarAvaliacao = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avaliacao, setAvaliacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gerando, setGerando] = useState(false);

  useEffect(() => {
    carregarAvaliacao();
  }, [id]);

  const carregarAvaliacao = async () => {
    try {
      const response = await api.get(`/admin/avaliacoes/${id}`);
      setAvaliacao(response.data);
    } catch (error) {
      console.error('Erro ao carregar avaliação:', error);
      alert('Erro ao carregar avaliação');
      navigate('/admin/avaliacoes');
    } finally {
      setLoading(false);
    }
  };

  const handleGerarPDF = async () => {
    setGerando(true);
    try {
      const response = await api.get(`/admin/avaliacoes/${id}/pdf`);
      
      // Converter base64 para blob
      const byteCharacters = atob(response.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${avaliacao.titulo.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      alert('PDF gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setGerando(false);
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

  if (!avaliacao) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Avaliação não encontrada</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container visualizar-avaliacao-container">
        <div className="visualizar-avaliacao-header">
          <h1>{avaliacao.titulo}</h1>
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleGerarPDF}
              disabled={gerando}
            >
              <i className="fas fa-file-pdf"></i> {gerando ? 'Gerando...' : 'Gerar PDF'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/admin/avaliacoes')}
            >
              <i className="fas fa-arrow-left"></i> Voltar
            </button>
          </div>
        </div>

        <div className="avaliacao-info-card card">
          <h3>Informações da Avaliação</h3>
          <div className="info-grid">
            {avaliacao.turma && (
              <div className="info-item">
                <strong>Turma:</strong>
                <span>{avaliacao.turma}</span>
              </div>
            )}
            {avaliacao.nomeFaculdade && (
              <div className="info-item">
                <strong>Faculdade:</strong>
                <span>{avaliacao.nomeFaculdade}</span>
              </div>
            )}
            {avaliacao.professor && (
              <div className="info-item">
                <strong>Professor:</strong>
                <span>{avaliacao.professor.nome}</span>
              </div>
            )}
            <div className="info-item">
              <strong>Questões:</strong>
              <span>{avaliacao.questoes?.length || 0}</span>
            </div>
            <div className="info-item">
              <strong>Criada em:</strong>
              <span>{new Date(avaliacao.criadaEm).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        <div className="questoes-preview-card card">
          <h3>Questões da Avaliação</h3>
          <div className="questoes-preview-list">
            {avaliacao.questoes?.map((questao, index) => (
              <div key={questao.id} className="questao-preview-item">
                <div className="questao-preview-header">
                  <span className="questao-numero">Questão {index + 1}</span>
                  <div className="questao-preview-badges">
                    <span className="badge badge-materia">{questao.materia}</span>
                    {questao.topico && (
                      <span className="badge badge-topico">{questao.topico}</span>
                    )}
                    <span className={`badge badge-${questao.nivelDificuldade?.toLowerCase()}`}>
                      {questao.nivelDificuldade}
                    </span>
                    <span className="badge badge-pontos">{questao.pontuacao} pts</span>
                  </div>
                </div>
                <p className="questao-preview-enunciado">{questao.enunciado}</p>
                {questao.alternativas && questao.alternativas.length > 0 && (
                  <div className="alternativas-preview">
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
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default VisualizarAvaliacao;
