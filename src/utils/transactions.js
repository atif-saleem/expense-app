export const summarizeTransactions = (transactions = []) =>
  transactions.reduce(
    (summary, item) => {
      const amount = Number(item.amount) || 0;
      if (item.type === 'income') {
        summary.income += amount;
      } else {
        summary.expense += amount;
      }
      summary.profit = summary.income - summary.expense;
      return summary;
    },
    { income: 0, expense: 0, profit: 0 }
  );

export const groupByTitle = (transactions = []) => {
  const map = new Map();
  transactions.forEach((item) => {
    const key = item.title.trim();
    const current = map.get(key) ?? { title: key, income: 0, expense: 0, total: 0 };
    const amount = Number(item.amount) || 0;
    current[item.type] += amount;
    current.total += amount;
    map.set(key, current);
  });
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
};

export const buildMonthlyChart = (transactions = []) => {
  const map = new Map();
  transactions.forEach((item) => {
    const key = item.month;
    const current = map.get(key) ?? { month: key, income: 0, expense: 0, profit: 0 };
    current[item.type] += Number(item.amount) || 0;
    current.profit = current.income - current.expense;
    map.set(key, current);
  });
  return Array.from(map.values()).sort((a, b) => a.month.localeCompare(b.month));
};
