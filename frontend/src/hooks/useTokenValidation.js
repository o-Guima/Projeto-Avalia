import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAuthenticated } from '../services/authService';

/**
 * Hook para validar o token periodicamente e fazer logout se expirado
 */
export const useTokenValidation = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verifica imediatamente ao montar
    if (user && !isAuthenticated()) {
      logout();
      navigate('/login', { replace: true });
    }

    // Verifica a cada 30 segundos
    const interval = setInterval(() => {
      if (user && !isAuthenticated()) {
        logout();
        navigate('/login', { replace: true });
      }
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [user, logout, navigate]);
};
