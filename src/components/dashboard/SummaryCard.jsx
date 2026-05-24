import { TrendingDown, TrendingUp, WalletCards } from 'lucide-react';
import { Card } from '../ui/Card';
import { formatCurrency } from '../../utils/currency';
import { cn } from '../../utils/classNames';

const icons = {
  income: TrendingUp,
  expense: TrendingDown,
  profit: WalletCards
};

export const SummaryCard = ({ label, value, type = 'profit' }) => {
  const Icon = icons[type];
  const positive = type === 'income' || (type === 'profit' && value >= 0);
  return (
    <Card asMotion className="min-h-32" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-black text-slate-950 dark:text-white">{formatCurrency(value)}</p>
        </div>
        <span
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-lg',
            positive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300'
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
};
