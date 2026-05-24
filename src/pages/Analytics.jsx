import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ExpenseTitleChart } from '../charts/ExpenseTitleChart';
import { MonthlyIncomeExpenseChart } from '../charts/MonthlyIncomeExpenseChart';
import { ProfitTrendChart } from '../charts/ProfitTrendChart';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { buildMonthlyChart, groupByTitle, summarizeTransactions } from '../utils/transactions';
import { getFriendlyApiError } from '../utils/apiErrors';
import { formatCurrency } from '../utils/currency';

export default function Analytics() {
  const user = useAuthStore((state) => state.user);
  const transactions = useTransactionStore((state) => state.transactions);
  const fetchPage = useTransactionStore((state) => state.fetchPage);

  useEffect(() => {
    if (user?.uid) fetchPage(user.uid, true).catch((error) => toast.error(getFriendlyApiError(error)));
  }, [fetchPage, user?.uid]);

  const monthly = useMemo(() => buildMonthlyChart(transactions), [transactions]);
  const expenseTitles = useMemo(() => groupByTitle(transactions.filter((item) => item.type === 'expense')).slice(0, 6), [transactions]);
  const summary = useMemo(() => summarizeTransactions(transactions), [transactions]);

  if (!transactions.length) {
    return (
      <section className="page-shell">
        <EmptyState title="Analytics will appear here" message="Add income and expenses to unlock charts." />
      </section>
    );
  }

  return (
    <section className="page-shell space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Analytics</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Income, expense, and profit visibility across your shop activity.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-950 p-3 text-center text-white dark:bg-white dark:text-slate-950">
        <span className="text-xs font-bold">Income<br />{formatCurrency(summary.income)}</span>
        <span className="text-xs font-bold">Expense<br />{formatCurrency(summary.expense)}</span>
        <span className="text-xs font-bold">Profit<br />{formatCurrency(summary.profit)}</span>
      </div>

      <Card>
        <h2 className="mb-3 text-base font-black text-slate-950 dark:text-white">Monthly Income vs Expense</h2>
        <MonthlyIncomeExpenseChart data={monthly} />
      </Card>
      <Card>
        <h2 className="mb-3 text-base font-black text-slate-950 dark:text-white">Expense Titles</h2>
        <ExpenseTitleChart data={expenseTitles} />
      </Card>
      <Card>
        <h2 className="mb-3 text-base font-black text-slate-950 dark:text-white">Profit Trend</h2>
        <ProfitTrendChart data={monthly} />
      </Card>
    </section>
  );
}
