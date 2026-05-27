import { memo } from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { TRANSACTION_TYPES } from '../../constants/app';
import { formatCurrency } from '../../utils/currency';
import { formatDate } from '../../utils/date';
import { cn } from '../../utils/classNames';

export const TransactionCard = memo(({ transaction, onEdit, onDelete }) => {
  const type = TRANSACTION_TYPES[transaction.type];
  const signedAmount = `${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}`;

  return (
    <Card asMotion className="p-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-950 dark:text-white">{transaction.title}</h3>
            <span className={cn('rounded-full px-2 py-1 text-[11px] font-bold', type.tone)}>{type.label}</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(transaction.date)}</p>
          {transaction.note ? <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{transaction.note}</p> : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <p className={cn('text-sm font-black', transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600')}>{signedAmount}</p>
          <div className="flex flex-wrap justify-end gap-2">
            <Button aria-label="Edit transaction" variant="secondary" className="min-h-9 px-3 text-xs" icon={Edit3} onClick={() => onEdit(transaction)}>
              Edit
            </Button>
            <Button aria-label="Delete transaction" variant="danger" className="min-h-9 px-3 text-xs" icon={Trash2} onClick={() => onDelete(transaction)}>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
});

TransactionCard.displayName = 'TransactionCard';
