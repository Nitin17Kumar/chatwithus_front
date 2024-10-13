import React, { createContext, useState, useEffect } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    api.get('/auth/me').then(response => {
      setUser(response.data.user);
    });
  }, []);

  const login = (data) => {
    return api.post('/auth/login', data).then(response => {
      setUser(response.data.user);
    });
  };

  const logout = () => {
    return api.post('/auth/logout').then(() => {
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
