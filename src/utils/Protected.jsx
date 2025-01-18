/** @format */


import { Navigate } from 'react-router-dom';

// Example of checking authentication, replace with your actual logic
const isAuthenticated = () => {
  return localStorage.getItem('authToken'); // Check for a token or authentication flag
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
