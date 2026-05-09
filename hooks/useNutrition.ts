import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { format } from 'date-fns';
import { api } from '../lib/api';
import type { Nutrition } from '../constants/types';

export function useNutrition(date?: string) {
  const { getToken } = useAuth();
  const [data, setData] = useState<Nutrition | null>(null);
  const [loading, setLoading] = useState(true);
  const targetDate = date ?? format(new Date(), 'yyyy-MM-dd');

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).get<Nutrition>(`/api/nutrition?date=${targetDate}`);
    setData(row);
    setLoading(false);
  }, [getToken, targetDate]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = useCallback(async (updates: Partial<Nutrition>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<Nutrition>('/api/nutrition', { date: targetDate, ...updates });
    setData(row);
  }, [getToken, targetDate]);

  const addHydration = useCallback(async (oz: number) => {
    const current = data?.hydration_oz ?? 0;
    await save({ hydration_oz: (Number(current) + oz) as any });
  }, [data, save]);

  return { data, loading, save, addHydration, refetch: fetch };
}
