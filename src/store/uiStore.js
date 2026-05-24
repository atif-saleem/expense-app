import { create } from 'zustand';

const getInitialTheme = () => {
  const saved = localStorage.getItem('khata-theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useUiStore = create((set, get) => ({
  theme: getInitialTheme(),
  modal: null,
  setTheme: (theme) => {
    localStorage.setItem('khata-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
  toggleTheme: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null })
}));
