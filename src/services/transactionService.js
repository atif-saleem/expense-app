import { PAGE_SIZE, TIMEZONE } from '../constants/app';
import { toTransactionDateParts } from '../utils/date';
import { supabase } from './supabaseClient';

export const buildTransactionPayload = (userId, values, transactionId) => ({
  ...(transactionId ? { id: transactionId } : {}),
  type: values.type,
  title: values.title.trim(),
  amount: Number(values.amount),
  note: values.note?.trim() ?? '',
  ...toTransactionDateParts(values.date),
  timezone: TIMEZONE,
  user_id: userId
});

const toTransaction = (row) => ({
  id: row.id,
  userId: row.user_id,
  type: row.type,
  title: row.title,
  amount: Number(row.amount),
  note: row.note,
  date: row.entry_date,
  month: row.entry_month,
  year: row.entry_year,
  timezone: row.timezone,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

const applyFilters = (query, filters = {}) => {
  let nextQuery = query;
  if (filters.type && filters.type !== 'all') nextQuery = nextQuery.eq('type', filters.type);
  if (filters.date) nextQuery = nextQuery.eq('entry_date', filters.date);
  if (filters.month) nextQuery = nextQuery.eq('entry_month', filters.month);
  return nextQuery;
};

export const addTransaction = async (userId, values) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(buildTransactionPayload(userId, values))
    .select()
    .single();

  if (error) throw error;
  return toTransaction(data);
};

export const updateTransaction = async (userId, transactionId, values) => {
  const { error } = await supabase
    .from('transactions')
    .update(buildTransactionPayload(userId, values, transactionId))
    .eq('id', transactionId)
    .eq('user_id', userId);

  if (error) throw error;
  return { ok: true };
};

export const deleteTransaction = async (userId, transactionId) => {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', transactionId)
    .eq('user_id', userId);

  if (error) throw error;
  return { ok: true };
};

export const addTransactionsBatch = async (userId, items) => {
  const { error } = await supabase
    .from('transactions')
    .insert(items.map((item) => buildTransactionPayload(userId, item)));

  if (error) throw error;
  return { ok: true };
};

export const listenRecentTransactions = (userId, callback, size = PAGE_SIZE) => {
  let stopped = false;

  const load = () => {
    fetchTransactions(userId, {}, 0, size)
      .then(({ rows }) => {
        if (!stopped) callback(rows);
      })
      .catch(() => {});
  };

  load();
  const timer = window.setInterval(load, 30000);

  return () => {
    stopped = true;
    window.clearInterval(timer);
  };
};

export const fetchTransactions = async (userId, filters = {}, cursor = 0, size = PAGE_SIZE) => {
  const offset = cursor ?? 0;
  const limit = size;
  const query = applyFilters(
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false })
      .range(offset, offset + limit),
    filters
  );

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []).slice(0, limit).map(toTransaction);

  return {
    rows,
    cursor: offset + rows.length,
    hasMore: (data ?? []).length > limit
  };
};

export const fetchRangeTransactions = async (userId, { startDate, endDate }) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .gte('entry_date', startDate)
    .lte('entry_date', endDate)
    .order('entry_date', { ascending: false })
    .order('id', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(toTransaction);
};
