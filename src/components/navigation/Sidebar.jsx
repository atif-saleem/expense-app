import { NavLink } from 'react-router-dom';
import { BarChart3, Home, PlusCircle, ReceiptText } from 'lucide-react';
import { cn } from '../../utils/classNames';

const items = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/transactions', label: 'Transactions', icon: ReceiptText },
  { to: '/add', label: 'Add Entry', icon: PlusCircle },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 }
];

export const Sidebar = () => (
  <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-950/60 lg:block">
    <div className="sticky top-20 space-y-2">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'focus-ring flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-semibold transition',
                isActive ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </NavLink>
        );
      })}
    </div>
  </aside>
);
