import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '../utils/currency';

export const MonthlyIncomeExpenseChart = ({ data }) => (
  <div className="h-72 w-full">
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 12, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.25)" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: 'rgba(14,165,233,0.08)' }} />
        <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
        <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
