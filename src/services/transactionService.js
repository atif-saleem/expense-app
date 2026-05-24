import { PAGE_SIZE, TIMEZONE } from '../constants/app';
import { toTransactionDateParts } from '../utils/date';
import { apiFetch } from './apiClient';

export const buildTransactionPayload = (userId, values, transactionId) => ({
  id: transactionId,
  type: values.type,
  title: values.title.trim(),
  amount: Number(values.amount),
  note: values.note?.trim() ?? '',
  ...toTransactionDateParts(values.date),
  timezone: TIMEZONE,
  userId
});

const toQueryString = (params) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') search.set(key, value);
  });
  return search.toString();
};

export const addTransaction = async (userId, values) => {
  const { transaction } = await apiFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(buildTransactionPayload(userId, values))
  });
  return transaction;
};

export const updateTransaction = (userId, transactionId, values) =>
  apiFetch(`/transactions/${transactionId}`, {
    method: 'PUT',
    body: JSON.stringify(buildTransactionPayload(userId, values, transactionId))
  });

export const deleteTransaction = (userId, transactionId) =>
  apiFetch(`/transactions/${transactionId}`, { method: 'DELETE' });

export const addTransactionsBatch = (userId, items) =>
  apiFetch('/transactions/batch', {
    method: 'POST',
    body: JSON.stringify({ items: items.map((item) => buildTransactionPayload(userId, item)) })
  });

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
  const query = toQueryString({
    type: filters.type && filters.type !== 'all' ? filters.type : '',
    date: filters.date,
    month: filters.month,
    offset: cursor ?? 0,
    limit: size
  });
  const result = await apiFetch(`/transactions${query ? `?${query}` : ''}`);
  return {
    rows: result.rows,
    cursor: result.cursor,
    hasMore: result.hasMore
  };
};

export const fetchRangeTransactions = async (userId, { startDate, endDate }) => {
  const query = toQueryString({ startDate, endDate });
  const result = await apiFetch(`/transactions/range?${query}`);
  return result.rows;
};
