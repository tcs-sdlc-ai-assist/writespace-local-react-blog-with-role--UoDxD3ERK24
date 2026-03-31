import { Navigate, Outlet } from 'react-router-dom';
import { useSession } from '../context/SessionContext.jsx';

export function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useSession();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/blogs" replace />;
  }

  return children || <Outlet />;
}