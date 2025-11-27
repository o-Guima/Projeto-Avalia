import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ login: '', senha: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userData = await login(credentials);
      
      // Redirecionar baseado no perfil
      if (userData.perfil === 'ADMIN') {
        navigate('/admin/professores');
      } else {
        navigate('/professor/avaliacoes');
      }
    } catch (err) {
      setError('Credenciais inválidas. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-logo">FLAVALIA</h1>
          <p className="login-subtitle">Sistema de Avaliações</p>
        </div>

        {error && (
          <div className="login-error" role="alert" aria-live="assertive" id="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" aria-label="Formulário de login">

          <div className="form-group">
            <label htmlFor="login">Usuário</label>
            <input
              type="text"
              id="login"
              name="login"
              className="input"
              value={credentials.login}
              onChange={handleChange}
              required
              aria-required="true"
              autoComplete="username"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              className="input"
              value={credentials.senha}
              onChange={handleChange}
              required
              aria-required="true"
              autoComplete="current-password"
              aria-describedby={error ? 'login-error' : undefined}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <p>Desenvolvido por: Grupo Flamengo</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
