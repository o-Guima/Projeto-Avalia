import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar/Navbar';
import api from '../../../services/api';
import './Professores.css';

const Professores = () => {
  const [professores, setProfessores] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMateriasModal, setShowMateriasModal] = useState(false);
  const [professorAtual, setProfessorAtual] = useState(null);
  const [editando, setEditando] = useState(null);
  const [professor, setProfessor] = useState({
    nome: '',
    login: '',
    email: '',
    senha: '',
    ativo: true,
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [professoresRes, materiasRes] = await Promise.all([
        api.get('/admin/professores'),
        api.get('/admin/materias')
      ]);
      setProfessores(professoresRes.data);
      setMaterias(materiasRes.data);
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

  const carregarProfessores = async () => {
    try {
      const response = await api.get('/admin/professores');
      setProfessores(response.data);
    } catch (error) {
      console.error('Erro ao carregar professores:', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setProfessor({
      ...professor,
      [e.target.name]: value,
    });
  };

  const abrirModal = (prof = null) => {
    if (prof) {
      setEditando(prof.id);
      setProfessor({
        nome: prof.nome,
        login: prof.login,
        email: prof.email || '',
        senha: '',
        ativo: prof.ativo,
      });
    } else {
      setEditando(null);
      setProfessor({
        nome: '',
        login: '',
        email: '',
        senha: '',
        ativo: true,
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

    try {
      // Preparar dados para envio
      const dadosProfessor = {
        nome: professor.nome,
        login: professor.login,
        email: professor.email,
        ativo: professor.ativo,
        perfil: 'PROFESSOR'
      };

      // Adicionar senha apenas se foi preenchida
      if (professor.senha && professor.senha.trim() !== '') {
        dadosProfessor.senha = professor.senha;
      }

      if (editando) {
        await api.put(`/admin/professores/${editando}`, dadosProfessor);
        mostrarAlerta('Professor atualizado com sucesso!', 'success');
      } else {
        await api.post('/admin/professores', dadosProfessor);
        mostrarAlerta('Professor criado com sucesso!', 'success');
      }
      carregarDados();
      fecharModal();
    } catch (error) {
      console.error('Erro ao salvar professor:', error);
      const mensagem = error.response?.data?.message || 'Erro ao salvar professor. Tente novamente.';
      mostrarAlerta(mensagem, 'error');
    }
  };

  const handleDeletar = async (id) => {
    const professor = professores.find(p => p.id === id);
    const confirmacao = window.confirm(
      `Tem certeza que deseja deletar o professor "${professor?.nome}"?\n\n` +
      `Esta ação não pode ser desfeita.`
    );
    
    if (confirmacao) {
      try {
        await api.delete(`/admin/professores/${id}`);
        mostrarAlerta('Professor deletado com sucesso!', 'success');
        carregarDados();
      } catch (error) {
        console.error('Erro ao deletar professor:', error);
        const mensagem = error.response?.data?.message || 
          error.response?.status === 409 ? 
          'Não é possível deletar este professor pois ele possui questões ou avaliações associadas.' :
          'Erro ao deletar professor. Tente novamente.';
        mostrarAlerta(mensagem, 'error');
      }
    }
  };

  const abrirModalMaterias = (prof) => {
    setProfessorAtual(prof);
    setShowMateriasModal(true);
  };

  const fecharModalMaterias = () => {
    setShowMateriasModal(false);
    setProfessorAtual(null);
  };

  const handleAssociarMateria = async (materiaId) => {
    try {
      await api.post(`/admin/materias/${materiaId}/professores/${professorAtual.id}`);
      mostrarAlerta('Matéria associada com sucesso!', 'success');
      // Atualizar apenas o professor atual
      const response = await api.get('/admin/professores');
      setProfessores(response.data);
      const professorAtualizado = response.data.find(p => p.id === professorAtual.id);
      setProfessorAtual(professorAtualizado);
    } catch (error) {
      console.error('Erro ao associar matéria:', error);
      const mensagem = error.response?.data?.message || 'Erro ao associar matéria. Tente novamente.';
      mostrarAlerta(mensagem, 'error');
    }
  };

  const handleDesassociarMateria = async (materiaId) => {
    try {
      await api.delete(`/admin/materias/${materiaId}/professores/${professorAtual.id}`);
      mostrarAlerta('Matéria desassociada com sucesso!', 'success');
      // Atualizar apenas o professor atual
      const response = await api.get('/admin/professores');
      setProfessores(response.data);
      const professorAtualizado = response.data.find(p => p.id === professorAtual.id);
      setProfessorAtual(professorAtualizado);
    } catch (error) {
      console.error('Erro ao desassociar matéria:', error);
      const mensagem = error.response?.data?.message || 'Erro ao desassociar matéria. Tente novamente.';
      mostrarAlerta(mensagem, 'error');
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
      <div className="container professores-container">
        <div className="professores-header">
          <h1>Gerenciar Professores</h1>
          <button 
            className="btn btn-primary"
            onClick={() => abrirModal()}
          >
            <i className="fas fa-plus"></i> Novo Professor
          </button>
        </div>

        <div className="professores-table-container card">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login</th>
                <th>Email</th>
                <th>Matérias</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {professores.map((prof) => (
                <tr key={prof.id}>
                  <td>{prof.nome}</td>
                  <td>{prof.login}</td>
                  <td>{prof.email || '-'}</td>
                  <td>
                    <span className="badge badge-info">
                      {prof.materias?.length || 0} matéria(s)
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${prof.ativo ? 'ativo' : 'inativo'}`}>
                      {prof.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn-icon btn-secondary"
                        onClick={() => abrirModalMaterias(prof)}
                        title="Gerenciar Matérias"
                      >
                        <i className="fas fa-book"></i>
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => abrirModal(prof)}
                        title="Editar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-icon btn-danger"
                        onClick={() => handleDeletar(prof.id)}
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

        {showModal && (
          <div className="modal-overlay" onClick={fecharModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editando ? 'Editar Professor' : 'Novo Professor'}</h2>
                <button className="modal-close" onClick={fecharModal}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="nome">Nome *</label>
                  <input
                    type="text"
                    id="nome"
                    name="nome"
                    className="input"
                    value={professor.nome}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login">Login *</label>
                  <input
                    type="text"
                    id="login"
                    name="login"
                    className="input"
                    value={professor.login}
                    onChange={handleChange}
                    disabled={editando}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input"
                    value={professor.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="senha">
                    Senha {editando ? '(deixe em branco para não alterar)' : '*'}
                  </label>
                  <input
                    type="password"
                    id="senha"
                    name="senha"
                    className="input"
                    value={professor.senha}
                    onChange={handleChange}
                    required={!editando}
                  />
                </div>

                <div className="form-group-checkbox">
                  <input
                    type="checkbox"
                    id="ativo"
                    name="ativo"
                    checked={professor.ativo}
                    onChange={handleChange}
                  />
                  <label htmlFor="ativo">Professor ativo</label>
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

        {/* Modal de Matérias */}
        {showMateriasModal && professorAtual && (
          <div className="modal-overlay" onClick={fecharModalMaterias}>
            <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Matérias - {professorAtual.nome}</h2>
                <button className="modal-close" onClick={fecharModalMaterias}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="materias-list">
                {materias.map((materia) => {
                  const isAssociada = professorAtual.materias?.some(m => m.id === materia.id);
                  return (
                    <div key={materia.id} className="materia-item">
                      <div className="materia-info">
                        <i className="fas fa-book"></i>
                        <div>
                          <strong>{materia.nome}</strong>
                          {materia.descricao && <span className="materia-descricao">{materia.descricao}</span>}
                        </div>
                      </div>
                      <button
                        className={`btn ${isAssociada ? 'btn-danger' : 'btn-primary'}`}
                        onClick={() => isAssociada ? handleDesassociarMateria(materia.id) : handleAssociarMateria(materia.id)}
                      >
                        {isAssociada ? (
                          <><i className="fas fa-minus-circle"></i> Remover</>
                        ) : (
                          <><i className="fas fa-plus-circle"></i> Adicionar</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={fecharModalMaterias}
                >
                  <i className="fas fa-check"></i> Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Professores;
