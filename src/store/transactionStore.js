import { create } from 'zustand';
import toast from 'react-hot-toast';
import * as transactionService from '../services/transactionService';

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  cursor: null,
  hasMore: true,
  loading: false,
  refreshing: false,
  filters: { type: 'all', date: '', month: '' },
  unsubscribeRecent: null,
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: { type: 'all', date: '', month: '' } }),
  listenRecent: (userId) => {
    get().unsubscribeRecent?.();
    const unsubscribe = transactionService.listenRecentTransactions(userId, (transactions) => {
      set({ transactions, loading: false });
    });
    set({ unsubscribeRecent: unsubscribe, loading: true });
    return unsubscribe;
  },
  stopListening: () => {
    get().unsubscribeRecent?.();
    set({ unsubscribeRecent: null });
  },
  fetchPage: async (userId, reset = false) => {
    set({ loading: true });
    const state = get();
    const result = await transactionService.fetchTransactions(userId, state.filters, reset ? null : state.cursor);
    set({
      transactions: reset ? result.rows : [...state.transactions, ...result.rows],
      cursor: result.cursor,
      hasMore: result.hasMore,
      loading: false
    });
  },
  refresh: async (userId) => {
    set({ refreshing: true });
    await get().fetchPage(userId, true);
    set({ refreshing: false });
  },
  addTransaction: async (userId, values) => {
    await transactionService.addTransaction(userId, values);
    toast.success('Transaction added');
  },
  updateTransaction: async (userId, id, values) => {
    await transactionService.updateTransaction(userId, id, values);
    toast.success('Transaction updated');
  },
  deleteTransaction: async (userId, id) => {
    await transactionService.deleteTransaction(userId, id);
    toast.success('Transaction deleted');
  }
}));
