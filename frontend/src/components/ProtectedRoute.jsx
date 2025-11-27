import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAuthenticated } from '../services/authService';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        <p>Verificando autenticação...</p>
      </div>
    );
  }

  // Verifica se há token válido
  if (!isAuthenticated()) {
    // Limpa qualquer dado de usuário inválido
    logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se o usuário existe no contexto
  if (!user) {
    logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se o perfil do usuário corresponde ao necessário
  if (requiredRole && user.perfil !== requiredRole) {
    // Redireciona para a página apropriada baseada no perfil
    const redirectPath = user.perfil === 'ADMIN' ? '/admin/professores' : '/professor/avaliacoes';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
