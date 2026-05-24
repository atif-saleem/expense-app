import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { today } from '../../utils/date';
import { cn } from '../../utils/classNames';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  title: z.string().trim().min(1, 'Title is required').max(80, 'Keep title under 80 characters'),
  amount: z.coerce.number({ invalid_type_error: 'Amount is required' }).positive('Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  note: z.string().max(240, 'Keep note under 240 characters').optional()
});

export const TransactionForm = ({ initialValues, onSubmit, submitLabel = 'Save transaction' }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialValues ?? {
      type: 'expense',
      title: '',
      amount: '',
      date: today(),
      note: ''
    }
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="type"
        control={control}
        render={({ field }) => (
          <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
            {['expense', 'income'].map((type) => (
              <button
                key={type}
                type="button"
                className={cn(
                  'focus-ring min-h-11 rounded-md text-sm font-bold capitalize transition',
                  field.value === type ? 'bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white' : 'text-slate-500'
                )}
                onClick={() => field.onChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      />
      <Input label="Title" placeholder="Tomato, Shop Earning, Electricity" error={errors.title?.message} {...register('title')} />
      <Input label="Amount" inputMode="decimal" type="number" min="1" step="1" placeholder="0" error={errors.amount?.message} {...register('amount')} />
      <Input label="Date" type="date" error={errors.date?.message} {...register('date')} />
      <Textarea label="Note" placeholder="Optional detail" error={errors.note?.message} {...register('note')} />
      <Button className="w-full" type="submit" loading={isSubmitting}>
        {submitLabel}
      </Button>
    </form>
  );
};
