import { Navigate } from 'react-router-dom';
import React from 'react';

interface ProtectedRouteProps {
    element: React.ComponentType<any>;  // Type for the component to be rendered
  }

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('authToken'); // Assuming the token is stored in localStorage
  
    if (!token) {
      // If no token, redirect to login
      return <Navigate to="/login" />;
    }
  
    // If token exists, render the provided component
    return <Component {...rest} />;
  };
  
  export default ProtectedRoute;