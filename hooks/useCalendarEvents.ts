import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { api } from '../lib/api';
import type { CalendarEvent } from '../constants/types';

export function useCalendarEvents() {
  const { getToken } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await api(token).get<CalendarEvent[]>('/api/calendar');
    setEvents(data ?? []);
    setLoading(false);
  }, [getToken]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (event: Omit<CalendarEvent, 'id' | 'user_id'>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<CalendarEvent>('/api/calendar', event);
    setEvents(prev => [...prev, row]);
  }, [getToken]);

  const update = useCallback(async (id: string, updates: Partial<CalendarEvent>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).put<CalendarEvent>(`/api/calendar/${id}`, updates);
    setEvents(prev => prev.map(e => e.id === id ? row : e));
  }, [getToken]);

  const remove = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return;
    await api(token).delete(`/api/calendar/${id}`);
    setEvents(prev => prev.filter(e => e.id !== id));
  }, [getToken]);

  const eventsForDate = useCallback((date: string) =>
    events.filter(e => e.date === date), [events]);

  return { events, loading, create, update, remove, eventsForDate, refetch: fetch };
}
