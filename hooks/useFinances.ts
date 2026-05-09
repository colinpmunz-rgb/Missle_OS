import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { api } from '../lib/api';
import type { Finance } from '../constants/types';

export function useFinances() {
  const { getToken } = useAuth();
  const [entries, setEntries] = useState<Finance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await api(token).get<Finance[]>('/api/finances');
    setEntries(data ?? []);
    setLoading(false);
  }, [getToken]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (entry: Omit<Finance, 'id' | 'user_id'>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<Finance>('/api/finances', entry);
    setEntries(prev => [row, ...prev]);
  }, [getToken]);

  const remove = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return;
    await api(token).delete(`/api/finances/${id}`);
    setEntries(prev => prev.filter(e => e.id !== id));
  }, [getToken]);

  const monthlyTotals = useCallback((month?: Date) => {
    const ref = month ?? new Date();
    const start = format(startOfMonth(ref), 'yyyy-MM-dd');
    const end = format(endOfMonth(ref), 'yyyy-MM-dd');
    const filtered = entries.filter(e => e.date >= start && e.date <= end);
    const income = filtered.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount ?? 0), 0);
    const expenses = filtered.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount ?? 0), 0);
    return { income, expenses, net: income - expenses };
  }, [entries]);

  return { entries, loading, create, remove, monthlyTotals, refetch: fetch };
}
