import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Search } from 'lucide-react';
import { TransactionCard } from '../components/transactions/TransactionCard';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { usePullToRefresh } from '../hooks/usePullToRefresh';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { summarizeTransactions } from '../utils/transactions';
import { formatCurrency } from '../utils/currency';
import { getFriendlyApiError } from '../utils/apiErrors';

export default function Transactions() {
  const user = useAuthStore((state) => state.user);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const {
    transactions,
    filters,
    hasMore,
    loading,
    setFilters,
    clearFilters,
    fetchPage,
    refresh,
    updateTransaction,
    deleteTransaction
  } = useTransactionStore((state) => state);

  useEffect(() => {
    if (user?.uid) fetchPage(user.uid, true).catch((error) => toast.error(getFriendlyApiError(error)));
  }, [fetchPage, filters, user?.uid]);

  const onRefresh = useCallback(() => refresh(user.uid), [refresh, user?.uid]);
  usePullToRefresh(onRefresh, Boolean(user?.uid));

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return transactions;
    return transactions.filter((item) => [item.title, item.note].some((value) => value?.toLowerCase().includes(term)));
  }, [search, transactions]);

  const summary = useMemo(() => summarizeTransactions(filtered), [filtered]);

  const submitEdit = async (values) => {
    try {
      await updateTransaction(user.uid, editing.id, values);
      setEditing(null);
      fetchPage(user.uid, true);
    } catch (error) {
      toast.error(getFriendlyApiError(error));
    }
  };

  const submitDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    try {
      await deleteTransaction(user.uid, item.id);
      fetchPage(user.uid, true);
    } catch (error) {
      toast.error(getFriendlyApiError(error));
    }
  };

  return (
    <section className="page-shell space-y-4">
      <div>
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Search, filter, edit, and review daily khata entries.</p>
      </div>

      <Card className="space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <Input className="pl-10" placeholder="Search title or note" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <select
            className="focus-ring min-h-12 rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            value={filters.type}
            onChange={(event) => setFilters({ type: event.target.value })}
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <Input type="date" value={filters.date} onChange={(event) => setFilters({ date: event.target.value, month: '' })} />
          <Input type="month" value={filters.month} onChange={(event) => setFilters({ month: event.target.value, date: '' })} />
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 p-2 text-center text-xs font-bold dark:bg-slate-900">
          <span>In {formatCurrency(summary.income)}</span>
          <span>Out {formatCurrency(summary.expense)}</span>
          <span>Net {formatCurrency(summary.profit)}</span>
        </div>
        <Button variant="ghost" className="w-full" onClick={clearFilters}>
          Clear filters
        </Button>
      </Card>

      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onEdit={setEditing}
              onDelete={submitDelete}
            />
          ))
        ) : (
          <EmptyState title="No transactions found" message="Try another filter or add a new entry." />
        )}
      </div>

      {hasMore ? (
        <Button variant="secondary" className="w-full" loading={loading} onClick={() => fetchPage(user.uid)}>
          Load more
        </Button>
      ) : null}

      <Modal open={Boolean(editing)} title="Edit transaction" onClose={() => setEditing(null)}>
        {editing ? (
          <TransactionForm
            initialValues={{
              type: editing.type,
              title: editing.title,
              amount: editing.amount,
              date: editing.date,
              note: editing.note
            }}
            onSubmit={submitEdit}
            submitLabel="Save changes"
          />
        ) : null}
      </Modal>
    </section>
  );
}
