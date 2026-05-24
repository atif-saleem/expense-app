import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';
import { useTransactionStore } from '../store/transactionStore';
import { getFriendlyApiError } from '../utils/apiErrors';

export default function AddTransaction() {
  const user = useAuthStore((state) => state.user);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      await addTransaction(user.uid, values);
      navigate('/');
    } catch (error) {
      toast.error(getFriendlyApiError(error));
    }
  };

  return (
    <section className="page-shell">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Add Transaction</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Record shop earnings or daily expenses in Karachi time.</p>
      </div>
      <Card className="mx-auto max-w-xl">
        <TransactionForm onSubmit={onSubmit} submitLabel="Add transaction" />
      </Card>
    </section>
  );
}
