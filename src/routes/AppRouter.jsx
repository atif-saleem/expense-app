import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loader } from '../components/ui/Loader';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';

const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const Transactions = lazy(() => import('../pages/Transactions.jsx'));
const AddTransaction = lazy(() => import('../pages/AddTransaction.jsx'));
const Analytics = lazy(() => import('../pages/Analytics.jsx'));
const Login = lazy(() => import('../pages/Login.jsx'));
const Signup = lazy(() => import('../pages/Signup.jsx'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword.jsx'));

const suspense = (element) => <Suspense fallback={<Loader />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: '/login', element: suspense(<Login />) },
          { path: '/signup', element: suspense(<Signup />) },
          { path: '/forgot-password', element: suspense(<ForgotPassword />) }
        ]
      }
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: suspense(<Dashboard />) },
          { path: '/transactions', element: suspense(<Transactions />) },
          { path: '/add', element: suspense(<AddTransaction />) },
          { path: '/analytics', element: suspense(<Analytics />) }
        ]
      }
    ]
  },
  { path: '*', element: suspense(<Login />) }
]);
