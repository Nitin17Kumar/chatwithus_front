import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check if token exists

  return isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default PrivateRoute;
