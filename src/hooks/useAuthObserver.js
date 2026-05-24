import { useEffect } from 'react';
import { observeAuth } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const useAuthObserver = () => {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = observeAuth((user) => setUser(user));
    return unsubscribe;
  }, [setUser]);
};
