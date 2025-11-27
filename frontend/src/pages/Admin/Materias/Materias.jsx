import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './Materias.css';

const MAX_DESCRICAO = 50;

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAssocModal, setShowAssocModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [materiaAtual, setMateriaAtual] = useState(null);
  const [materia, setMateria] = useState({
    nome: '',
    descricao: '',
    ativa: true,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [materiasRes, professoresRes] = await Promise.all([
        api.get('/admin/materias'),
        api.get('/admin/professores')
      ]);
      setMaterias(materiasRes.data);
      setProfessores(professoresRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      mostrarAlerta('Erro ao carregar dados. Tente novamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarAlerta = (mensagem, tipo = 'success') => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert alert-${tipo}`;
    alertDiv.innerHTML = `
      <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${mensagem}</span>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.classList.add('show'), 10);
    setTimeout(() => {
      alertDiv.classList.remove('show');
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    let newValue = type === 'checkbox' ? checked : value;
    
    // Limitar descrição
    if (name === 'descricao' && newValue.length > MAX_DESCRICAO) {
      return;
    }
    
    setMateria({
      ...materia,
      [name]: newValue,
    });
  };

  const abrirModal = (mat = null) => {
    if (mat) {
      setEditando(mat.id);
      setMateria({
        nome: mat.nome,
        descricao: mat.descricao || '',
        ativa: mat.ativa,
      });
    } else {
      setEditando(null);
      setMateria({
        nome: '',
        descricao: '',
        ativa: true,
      });
    }
    setShowModal(true);
  };

  const fecharModal = () => {
    setShowModal(false);
    setEditando(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!materia.nome.trim()) {
      mostrarAlerta('O nome da matéria é obrigatório!', 'error');
      return;
    }

    try {
      if (editando) {
        await api.put(`/admin/materias/${editando}`, materia);
        mostrarAlerta('Matéria atualizada com sucesso!', 'success');
      } else {
        await api.post('/admin/materias', materia);
        mostrarAlerta('Matéria criada com sucesso!', 'success');
      }
      carregarDados();
      fecharModal();
    } catch (error) {
      console.error('Erro ao salvar matéria:', error);
      const mensagem = error.response?.data?.message || 'Erro ao salvar matéria. Tente novamente.';
      mostrarAlerta(mensagem, 'error');
    }
  };

  const handleDeletar = async (id) => {
    const materia = materias.find(m => m.id === id);
    const professoresAssociados = getProfessoresAssociados(materia);
    
    // Verificar se há professores associados
    if (professoresAssociados.length > 0) {
      const nomesProfessores = professoresAssociados.map(p => p.nome).join(', ');
      mostrarAlerta(
        `Não é possível deletar a matéria "${materia?.nome}" pois ela possui ${professoresAssociados.length} professor(es) associado(s): ${nomesProfessores}. Remova as associações primeiro.`,
        'error'
      );
      return;
    }
    
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar a matéria "${materia?.nome}"?\n\n` +
      `Esta ação não pode ser desfeita.`
    );
    
    if (confirmacao) {
      try {
        await api.delete(`/admin/materias/${id}`);
        mostrarAlerta('Matéria deletada com sucesso!', 'success');
        carregarDados();
      } catch (error) {
        console.error('Erro ao deletar matéria:', error);
        const mensagem = error.response?.data?.message || 
          error.response?.status === 409 ? 
          'Não é possível deletar esta matéria. Ela pode estar sendo usada em questões ou avaliações.' :
          'Erro ao deletar matéria. Tente novamente.';
        mostrarAlerta(mensagem, 'error');
      }
    }
  };

  const abrirModalAssociacao = (mat) => {
    setMateriaAtual(mat);
    setShowAssocModal(true);
  };

  const fecharModalAssociacao = () => {
    setShowAssocModal(false);
    setMateriaAtual(null);
  };

  const handleAssociar = async (professorId) => {
    try {
      await api.post(`/admin/materias/${materiaAtual.id}/professores/${professorId}`);
      mostrarAlerta('Professor associado com sucesso!', 'success');
      carregarDados();
    } catch (error) {
      console.error('Erro ao associar professor:', error);
      const mensagem = error.response?.data?.message || 'Erro ao associar professor. Tente novamente.';
      mostrarAlerta(mensagem, 'error');
    }
  };

  const handleDesassociar = async (professorId) => {
    try {
      await api.delete(`/admin/materias/${materiaAtual.id}/professores/${professorId}`);
      mostrarAlerta('Professor desassociado com sucesso!', 'success');
      carregarDados();
    } catch (error) {
      console.error('Erro ao desassociar professor:', error);
      const mensagem = error.response?.data?.message || 'Erro ao desassociar professor. Tente novamente.';
      mostrarAlerta(mensagem, 'error');
    }
  };

  const getProfessoresAssociados = (materia) => {
    return materia?.professores || [];
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
      <div className="container materias-container">
        <div className="materias-header">
          <h1>Gerenciar Matérias</h1>
          <button 
            className="btn btn-primary"
            onClick={() => abrirModal()}
          >
            <i className="fas fa-plus"></i> Nova Matéria
          </button>
        </div>

        <div className="materias-table-container card">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Professores</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((mat) => (
                <tr key={mat.id}>
                  <td><strong>{mat.nome}</strong></td>
                  <td>{mat.descricao || '-'}</td>
                  <td>
                    <span className="badge badge-info">
                      {getProfessoresAssociados(mat).length} professor(es)
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${mat.ativa ? 'ativo' : 'inativo'}`}>
                      {mat.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn-icon btn-secondary"
                        onClick={() => abrirModalAssociacao(mat)}
                        title="Gerenciar Professores"
                      >
                        <i className="fas fa-users"></i>
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => abrirModal(mat)}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-icon btn-danger"
                        onClick={() => handleDeletar(mat.id)}
                        title="Deletar"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal de Criar/Editar Matéria */}
        {showModal && (
          <div className="modal-overlay" onClick={fecharModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editando ? 'Editar Matéria' : 'Nova Matéria'}</h2>
                <button className="modal-close" onClick={fecharModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="nome">Nome da Matéria *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    className="input"
                    value={materia.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="descricao">
                    Descrição
                    <span className="char-counter">
                      {materia.descricao.length}/{MAX_DESCRICAO}
                    </span>
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    className="input"
                    rows="3"
                    value={materia.descricao}
                    onChange={handleChange}
                    maxLength={MAX_DESCRICAO}
                    placeholder="Descreva a matéria (opcional)"
                  />
                  {materia.descricao.length >= MAX_DESCRICAO - 20 && (
                    <small className="char-warning">
                      <i className="fas fa-exclamation-triangle"></i>
                      {materia.descricao.length >= MAX_DESCRICAO 
                        ? ' Limite máximo atingido!' 
                        : ` Restam ${MAX_DESCRICAO - materia.descricao.length} caracteres`}
                    </small>
                  )}
                </div>

                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="ativa"
                    name="ativa"
                    checked={materia.ativa}
                    onChange={handleChange}
                  />
                  <label htmlFor="ativa">Matéria ativa</label>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={fecharModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editando ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Associação de Professores */}
        {showAssocModal && materiaAtual && (
          <div className="modal-overlay" onClick={fecharModalAssociacao}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Professores - {materiaAtual.nome}</h2>
                <button className="modal-close" onClick={fecharModalAssociacao}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="professores-list">
                {professores.map((prof) => {
                  const isAssociado = prof.materias?.some(m => m.id === materiaAtual.id);
                  return (
                    <div key={prof.id} className="professor-item">
                      <div className="professor-info">
                        <i className="fas fa-user-circle"></i>
                        <div>
                          <strong>{prof.nome}</strong>
                          <span className="professor-login">{prof.login}</span>
                        </div>
                      </div>
                      <button
                        className={`btn ${isAssociado ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => isAssociado ? handleDesassociar(prof.id) : handleAssociar(prof.id)}
                      >
                        {isAssociado ? (
                          <><i className="fas fa-minus-circle"></i> Remover</>
                        ) : (
                          <><i className="fas fa-plus-circle"></i> Adicionar</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Materias;
