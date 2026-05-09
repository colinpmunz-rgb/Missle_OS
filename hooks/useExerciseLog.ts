import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { format } from 'date-fns';
import { api } from '../lib/api';
import type { ExerciseLog } from '../constants/types';

export function useExerciseLog(date?: string) {
  const { getToken } = useAuth();
  const [logs, setLogs] = useState<ExerciseLog[]>([]);
  const [todayLog, setTodayLog] = useState<ExerciseLog | null>(null);
  const [loading, setLoading] = useState(true);
  const targetDate = date ?? format(new Date(), 'yyyy-MM-dd');

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await api(token).get<ExerciseLog[]>('/api/exercise');
    setLogs(data ?? []);
    setTodayLog(data?.find(l => l.date === targetDate) ?? null);
    setLoading(false);
  }, [getToken, targetDate]);

  useEffect(() => { fetch(); }, [fetch]);

  const save = useCallback(async (entry: Partial<ExerciseLog>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<ExerciseLog>('/api/exercise', { date: targetDate, ...entry });
    setTodayLog(row);
    setLogs(prev => [row, ...prev.filter(l => l.date !== targetDate)]);
  }, [getToken, targetDate]);

  return { logs, todayLog, loading, save, refetch: fetch };
}
