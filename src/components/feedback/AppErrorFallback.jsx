import { Button } from '../ui/Button';

export const AppErrorFallback = ({ error, resetErrorBoundary }) => (
  <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-950 dark:bg-slate-950 dark:text-white">
    <section className="max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h1 className="text-xl font-bold">Something needs attention</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{error?.message ?? 'Unexpected app error.'}</p>
      <Button className="mt-5 w-full" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </section>
  </main>
);
