import { Navigate } from "react-router-dom";
import {useSelector} from 'react-redux';

const ProtectedRoute = ({ children, requiredRole }) => {
  const {userEnSesion, token} = useSelector((state) => state.user);

  // Si no hay token → no está logueado
  if (!token) return <Navigate to="/inicio" replace />;

  // Si se requiere rol específico y no lo cumple
  if (requiredRole && userEnSesion?.role !== requiredRole) {
    return <Navigate to="/acceso-denegado" replace />;
  }

  return children;
};

export default ProtectedRoute;