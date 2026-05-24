import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { getFriendlyApiError } from '../utils/apiErrors';

const schema = z.object({ email: z.string().email('Enter a valid email') });

export default function ForgotPassword() {
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    try {
      setAuthError('');
      setLoading(true);
      await forgotPassword(email);
      toast.success('Password reset email sent');
    } catch (error) {
      const message = getFriendlyApiError(error);
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        {authError ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">{authError}</p> : null}
        <Button className="w-full" type="submit" loading={loading}>
          Send reset link
        </Button>
      </form>
      <Link className="mt-5 block text-center text-sm font-semibold text-brand-700 dark:text-brand-100" to="/login">
        Back to login
      </Link>
    </Card>
  );
}
