import { Loader2 } from 'lucide-react';

export const Loader = ({ label = 'Loading' }) => (
  <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-slate-500 dark:text-slate-400">
    <Loader2 className="h-6 w-6 animate-spin" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);
