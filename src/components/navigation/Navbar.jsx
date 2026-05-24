import { LogOut, Moon, Sun } from 'lucide-react';
import { Button } from '../ui/Button';
import { APP_NAME } from '../../constants/app';
import { useAuthStore } from '../../store/authStore';
import { useUiStore } from '../../store/uiStore';

export const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-slate-50/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600 dark:text-brand-100">Khata</p>
          <h1 className="text-base font-black text-slate-950 dark:text-white">{APP_NAME}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            aria-label="Toggle theme"
            variant="secondary"
            className="h-10 w-10 px-0"
            onClick={toggleTheme}
            icon={theme === 'dark' ? Sun : Moon}
          />
          {user ? <Button aria-label="Logout" variant="ghost" className="h-10 w-10 px-0" onClick={logout} icon={LogOut} /> : null}
        </div>
      </div>
    </header>
  );
};
