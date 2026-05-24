import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../constants/app';
import { useTheme } from '../hooks/useTheme';

export const AuthLayout = () => {
  useTheme();
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand-600 dark:text-brand-100">Daily accounts</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">{APP_NAME}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">Fast mobile khata for income, expenses, and profit clarity.</p>
        </div>
        <Outlet />
      </section>
    </main>
  );
};
