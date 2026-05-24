import { forwardRef } from 'react';
import { cn } from '../../utils/classNames';

export const Input = forwardRef(({ label, error, className, ...props }, ref) => (
  <label className="block space-y-2">
    {label ? <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span> : null}
    <input
      ref={ref}
      className={cn(
        'focus-ring min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 shadow-sm transition placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white',
        error && 'border-rose-400 focus-visible:ring-rose-400',
        className
      )}
      {...props}
    />
    {error ? <span className="text-xs font-medium text-rose-500">{error}</span> : null}
  </label>
));

Input.displayName = 'Input';
