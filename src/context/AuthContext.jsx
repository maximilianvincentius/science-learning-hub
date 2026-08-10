import { createContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import AuthService from '../services/authService';

const { getAccessToken, clearAccessToken, getUserFromToken, setAccessToken } = AuthService;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getAccessToken());
  const [user, setUser] = useState(() => getUserFromToken());
  const [openAuthForm, setOpenAuthForm] = useState(false);

  const login = useCallback((isAuth, data) => {
    setAccessToken(data.token, data.expiresIn);
    setIsAuthenticated(isAuth);
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    user,
    setUser,
    login,
    logout,
    openAuthForm,
    setOpenAuthForm
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
