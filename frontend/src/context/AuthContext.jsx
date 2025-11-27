import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para validar e carregar usuário
  const loadUser = useCallback(() => {
    // Verifica se há token válido
    if (!authService.isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }

    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadUser();

    // Verifica periodicamente se o token ainda é válido
    const interval = setInterval(() => {
      if (!authService.isAuthenticated() && user) {
        logout();
      }
    }, 60000); // Verifica a cada 1 minuto

    return () => clearInterval(interval);
  }, [loadUser, user]);

  const login = async (credentials) => {
    const userData = await authService.login(credentials);
    setUser(userData);
    return userData;
  };

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    login,
    logout,
    isAuthenticated: authService.isAuthenticated(),
    isProfessor: authService.isProfessor(),
    isAdmin: authService.isAdmin(),
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
