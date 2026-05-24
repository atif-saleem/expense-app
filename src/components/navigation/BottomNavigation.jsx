import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Home, PlusCircle, ReceiptText } from 'lucide-react';
import { cn } from '../../utils/classNames';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/transactions', label: 'Entries', icon: ReceiptText },
  { to: '/add', label: 'Add', icon: PlusCircle },
  { to: '/analytics', label: 'Charts', icon: BarChart3 }
];

export const BottomNavigation = () => {
  const { pathname } = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/95 lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'focus-ring flex min-h-14 flex-col items-center justify-center rounded-lg text-xs font-semibold transition',
                active ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'
              )}
            >
              <Icon className="mb-1 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
