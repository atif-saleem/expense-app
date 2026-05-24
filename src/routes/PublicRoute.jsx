import { Navigate, Outlet } from 'react-router-dom';
import { Loader } from '../components/ui/Loader';
import { useAuthObserver } from '../hooks/useAuthObserver';
import { useAuthStore } from '../store/authStore';

export const PublicRoute = () => {
  useAuthObserver();
  const user = useAuthStore((state) => state.user);
  const authReady = useAuthStore((state) => state.authReady);

  if (!authReady) return <Loader label="Loading" />;
  if (user) return <Navigate to="/" replace />;
  return <Outlet />;
};
