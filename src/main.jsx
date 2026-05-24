import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { registerSW } from 'virtual:pwa-register';
import { router } from './routes/AppRouter.jsx';
import { AppErrorFallback } from './components/feedback/AppErrorFallback.jsx';
import './styles/index.css';

registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={AppErrorFallback}>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2600,
          className: 'dark:bg-slate-900 dark:text-white'
        }}
      />
    </ErrorBoundary>
  </React.StrictMode>
);
