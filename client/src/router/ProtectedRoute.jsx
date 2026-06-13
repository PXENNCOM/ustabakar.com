import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/giris" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/giris" replace />;

  return <Outlet />;
}