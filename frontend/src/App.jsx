import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login/Login';
import Avaliacoes from './pages/Professor/Avaliacoes/Avaliacoes';
import NovaAvaliacao from './pages/Professor/Avaliacoes/NovaAvaliacao';
import EditarAvaliacao from './pages/Professor/Avaliacoes/EditarAvaliacao';
import Questoes from './pages/Professor/Questoes/Questoes';
import CadastroQuestao from './pages/Professor/Questoes/CadastroQuestao';
import IAvalia from './pages/Professor/IAvalia/IAvalia';
import Professores from './pages/Admin/Professores/Professores';
import QuestoesAdmin from './pages/Admin/Questoes/Questoes';
import Materias from './pages/Admin/Materias/Materias';
import AvaliacoesAdmin from './pages/Admin/Avaliacoes/Avaliacoes';
import NovaAvaliacaoAdmin from './pages/Admin/Avaliacoes/NovaAvaliacao';
import VisualizarAvaliacaoAdmin from './pages/Admin/Avaliacoes/VisualizarAvaliacao';

// Componente para redirecionar usuários autenticados da página de login
const LoginRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Carregando...</p>
    </div>;
  }

  if (user) {
    // Redireciona para a página apropriada baseada no perfil
    const redirectPath = user.perfil === 'ADMIN' ? '/admin/professores' : '/professor/avaliacoes';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginRoute><Login /></LoginRoute>} />
          
          {/* Rotas do Professor */}
          <Route 
            path="/professor/avaliacoes" 
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <Avaliacoes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/avaliacoes/nova" 
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <NovaAvaliacao />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/avaliacoes/editar/:id" 
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <EditarAvaliacao />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/questoes" 
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <Questoes />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/questoes/nova" 
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <CadastroQuestao />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/professor/iavalia" 
            element={
              <ProtectedRoute requiredRole="PROFESSOR">
                <IAvalia />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas do Admin */}
          <Route 
            path="/admin/professores" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Professores />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/questoes" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <QuestoesAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/materias" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Materias />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/avaliacoes" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AvaliacoesAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/avaliacoes/nova" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <NovaAvaliacaoAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/avaliacoes/:id" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <VisualizarAvaliacaoAdmin />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota padrão */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
