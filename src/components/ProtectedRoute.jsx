import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children || <Outlet />;
}