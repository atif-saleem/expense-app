import { useCallback, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';
import { SummaryCard } from '../components/dashboard/SummaryCard';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Card } from '../components/ui/Card';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { currentMonth, today } from '../utils/date';
import { summarizeTransactions } from '../utils/transactions';
import { formatCurrency } from '../utils/currency';
import { getFriendlyApiError } from '../utils/apiErrors';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const transactions = useTransactionStore((state) => state.transactions);
  const listenRecent = useTransactionStore((state) => state.listenRecent);
  const stopListening = useTransactionStore((state) => state.stopListening);
  const refresh = useTransactionStore((state) => state.refresh);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const refreshing = useTransactionStore((state) => state.refreshing);

  useEffect(() => {
    if (!user?.uid) return undefined;
    listenRecent(user.uid);
    return () => stopListening();
  }, [listenRecent, stopListening, user?.uid]);

  const onRefresh = useCallback(() => refresh(user.uid), [refresh, user?.uid]);
  usePullToRefresh(onRefresh, Boolean(user?.uid));

  const todaySummary = useMemo(() => summarizeTransactions(transactions.filter((item) => item.date === today())), [transactions]);
  const monthSummary = useMemo(() => summarizeTransactions(transactions.filter((item) => item.month === currentMonth())), [transactions]);
  const recent = transactions.slice(0, 5);

  const submitDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    try {
      await deleteTransaction(user.uid, item.id);
      refresh(user.uid);
    } catch (error) {
      toast.error(getFriendlyApiError(error));
    }
  };

  return (
    <section className="page-shell space-y-5">
      <div className="rounded-lg bg-slate-950 p-5 text-white shadow-soft dark:bg-white dark:text-slate-950">
        <p className="text-sm font-medium opacity-80">Today profit</p>
        <h2 className="mt-2 text-4xl font-black">{formatCurrency(todaySummary.profit)}</h2>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <span className="rounded-lg bg-white/10 p-3 dark:bg-slate-950/10">Income {formatCurrency(todaySummary.income)}</span>
          <span className="rounded-lg bg-white/10 p-3 dark:bg-slate-950/10">Expense {formatCurrency(todaySummary.expense)}</span>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Today's Income" value={todaySummary.income} type="income" />
        <SummaryCard label="Today's Expense" value={todaySummary.expense} type="expense" />
        <SummaryCard label="Current Month" value={monthSummary.profit} type="profit" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button className="w-full" icon={Plus} onClick={() => navigate('/add')} type="button">
          Quick Add
        </Button>
        <Button variant="secondary" icon={RefreshCw} loading={refreshing} onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-950 dark:text-white">Recent Transactions</h2>
          <Link className="text-sm font-bold text-brand-700 dark:text-brand-100" to="/transactions">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {recent.length ? (
            recent.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onEdit={() => {}}
                onDelete={submitDelete}
              />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </Card>
    </section>
  );
}
