import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { getFriendlyApiError } from '../utils/apiErrors';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      setAuthError('');
      setLoading(true);
      await login(values);
      navigate(location.state?.from?.pathname ?? '/', { replace: true });
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
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        {authError ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">{authError}</p> : null}
        <Button className="w-full" type="submit" loading={loading}>
          Login
        </Button>
      </form>
      <div className="mt-5 flex items-center justify-between text-sm font-semibold">
        <Link className="text-brand-700 dark:text-brand-100" to="/forgot-password">
          Forgot password?
        </Link>
        <Link className="text-slate-600 dark:text-slate-300" to="/signup">
          Create account
        </Link>
      </div>
    </Card>
  );
}
