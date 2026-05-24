import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader } from '../components/ui/Loader';
import { useAuthObserver } from '../hooks/useAuthObserver';
import { useAuthStore } from '../store/authStore';

export const ProtectedRoute = () => {
  useAuthObserver();
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const authReady = useAuthStore((state) => state.authReady);

  if (!authReady) return <Loader label="Securing your khata" />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
};
