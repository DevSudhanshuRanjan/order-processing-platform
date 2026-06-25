import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RoleRoute = ({ children, allowedRoles }) => {
  const { role, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
