import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { api } from '../lib/api';
import type { Goal, Pillar } from '../constants/types';

export function useGoals(pillarFilter?: Pillar) {
  const { getToken } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const path = pillarFilter ? `/api/goals?pillar=${pillarFilter}` : '/api/goals';
    const data = await api(token).get<Goal[]>(path);
    setGoals((data ?? []).filter(g => !g.completed));
    setLoading(false);
  }, [getToken, pillarFilter]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (goal: Omit<Goal, 'id' | 'user_id'>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<Goal>('/api/goals', goal);
    setGoals(prev => [...prev, row]);
  }, [getToken]);

  const update = useCallback(async (id: string, updates: Partial<Goal>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).put<Goal>(`/api/goals/${id}`, updates);
    setGoals(prev => prev.map(g => g.id === id ? row : g).filter(g => !g.completed));
  }, [getToken]);

  const remove = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return;
    await api(token).delete(`/api/goals/${id}`);
    setGoals(prev => prev.filter(g => g.id !== id));
  }, [getToken]);

  return { goals, loading, create, update, remove, refetch: fetch };
}
