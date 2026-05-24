import { Inbox } from 'lucide-react';
import { Card } from './Card';

export const EmptyState = ({ title = 'Nothing here yet', message = 'Add your first transaction to see it here.' }) => (
  <Card className="flex flex-col items-center justify-center py-10 text-center">
    <Inbox className="mb-3 h-10 w-10 text-slate-400" />
    <h3 className="text-base font-bold text-slate-950 dark:text-white">{title}</h3>
    <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">{message}</p>
  </Card>
);
