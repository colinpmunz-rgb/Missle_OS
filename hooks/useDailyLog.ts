import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { format } from 'date-fns';
import { api } from '../lib/api';
import type { DailyLog } from '../constants/types';

type ChecklistField = keyof Pick<DailyLog,
  'bedtime_checklist' | 'exercise' | 'no_porn' | 'little_things' | 'hydration' | 'no_doom_scroll'
>;

const today = () => format(new Date(), 'yyyy-MM-dd');

export function useDailyLog() {
  const { getToken } = useAuth();
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await api(token).get<DailyLog>(`/api/daily-log?date=${today()}`);
    setLog(data);
    setLoading(false);
  }, [getToken]);

  useEffect(() => { fetch(); }, [fetch]);

  const toggle = useCallback(async (field: ChecklistField) => {
    const token = await getToken();
    if (!token) return;
    const current = log?.[field] ?? false;
    const updated = await api(token).post<DailyLog>('/api/daily-log', {
      date: today(),
      [field]: !current,
    });
    setLog(updated);
  }, [log, getToken]);

  const updateTimes = useCallback(async (wake_time?: string, sleep_time?: string) => {
    const token = await getToken();
    if (!token) return;
    const updated = await api(token).post<DailyLog>('/api/daily-log', { date: today(), wake_time, sleep_time });
    setLog(updated);
  }, [getToken]);

  return { log, loading, toggle, updateTimes, refetch: fetch };
}
