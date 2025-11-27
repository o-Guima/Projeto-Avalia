import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Força navegação e recarrega para limpar qualquer estado residual
    navigate('/login', { replace: true });
    // Opcional: recarregar a página para garantir limpeza completa
    window.location.href = '/login';
  };

  const isProfessor = user?.perfil === 'PROFESSOR';
  const isAdmin = user?.perfil === 'ADMIN';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isProfessor ? '/professor/avaliacoes' : '/admin/professores'} className="navbar-logo">
          FLAVALIA
        </Link>

        <div className="navbar-menu">
          {isProfessor && (
            <>
              <Link to="/professor/avaliacoes" className="navbar-link">
                <i className="fas fa-file-alt"></i> Avaliações
              </Link>
              <Link to="/professor/questoes" className="navbar-link">
                <i className="fas fa-question-circle"></i> Cadastro de Questões
              </Link>
              <Link to="/professor/iavalia" className="navbar-link navbar-link-iavalia">
                <i className="fas fa-robot"></i> IAvalia
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/professores" className="navbar-link">
                <i className="fas fa-user"></i> Professores
              </Link>
              <Link to="/admin/materias" className="navbar-link">
                <i className="fas fa-book"></i> Matérias
              </Link>
              <Link to="/admin/questoes" className="navbar-link">
                <i className="fas fa-question-circle"></i> Questões
              </Link>
              <Link to="/admin/avaliacoes" className="navbar-link">
                <i className="fas fa-clipboard-list"></i> Avaliações
              </Link>
            </>
          )}

          <div className="navbar-user">
            <span className="navbar-username">
              <i className="fas fa-user-circle"></i> {user?.nome}
            </span>
            <button onClick={handleLogout} className="navbar-logout">
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
