import { create } from 'zustand';
import * as authService from '../services/authService';

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  authReady: false,
  setUser: (user) => set({ user, loading: false, authReady: true }),
  login: async (values) => {
    const { user } = await authService.login(values);
    set({ user, loading: false, authReady: true });
    return user;
  },
  signup: async (values) => {
    const { user } = await authService.signup(values);
    set({ user, loading: false, authReady: true });
    return user;
  },
  forgotPassword: (email) => authService.forgotPassword(email),
  logout: async () => {
    await authService.logout();
    set({ user: null, loading: false, authReady: true });
  }
}));
