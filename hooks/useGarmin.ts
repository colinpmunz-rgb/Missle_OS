import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { format } from 'date-fns';
import { api } from '../lib/api';
import type { GarminData } from '../constants/types';

export function useGarmin(date?: string) {
  const { getToken } = useAuth();
  const [data, setData] = useState<GarminData | null>(null);
  const [loading, setLoading] = useState(true);
  const targetDate = date ?? format(new Date(), 'yyyy-MM-dd');

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).get<GarminData>(`/api/garmin?date=${targetDate}`);
    setData(row);
    setLoading(false);
  }, [getToken, targetDate]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = useCallback(async (updates: Partial<GarminData>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<GarminData>('/api/garmin', { date: targetDate, ...updates });
    setData(row);
  }, [getToken, targetDate]);

  return { data, loading, save, refetch: fetch };
}
