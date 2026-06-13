import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

export default function GuestRoute() {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin/talepler" replace />;
    if (user?.role === 'master') return <Navigate to="/usta" replace />;
    if (user?.role === 'customer') return <Navigate to="/musteri" replace />;
  }

  return <Outlet />;
}