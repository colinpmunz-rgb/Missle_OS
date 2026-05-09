import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { api } from '../lib/api';
import type { WordOfDay } from '../constants/types';

export function useWordOfDay() {
  const { getToken } = useAuth();
  const [today, setToday] = useState<WordOfDay | null>(null);
  const [history, setHistory] = useState<WordOfDay[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const [todayRes, historyRes] = await Promise.all([
      api(token).get<WordOfDay>('/api/word-of-day/today'),
      api(token).get<WordOfDay[]>('/api/word-of-day'),
    ]);
    setToday(todayRes);
    setHistory(historyRes ?? []);
    setLoading(false);
  }, [getToken]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = useCallback(async (entry: Partial<WordOfDay>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<WordOfDay>('/api/word-of-day', entry);
    setToday(row);
    await fetch();
  }, [getToken, fetch]);

  return { today, history, loading, save, refetch: fetch };
}
