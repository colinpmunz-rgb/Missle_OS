import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { api } from '../lib/api';
import type { BrandOperation } from '../constants/types';

export function useBrandOperations() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<BrandOperation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await api(token).get<BrandOperation[]>('/api/brand-ops');
    setItems(data ?? []);
    setLoading(false);
  }, [getToken]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (item: Omit<BrandOperation, 'id' | 'user_id'>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<BrandOperation>('/api/brand-ops', item);
    setItems(prev => [row, ...prev]);
  }, [getToken]);

  const update = useCallback(async (id: string, updates: Partial<BrandOperation>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).put<BrandOperation>(`/api/brand-ops/${id}`, updates);
    setItems(prev => prev.map(i => i.id === id ? row : i));
  }, [getToken]);

  const remove = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return;
    await api(token).delete(`/api/brand-ops/${id}`);
    setItems(prev => prev.filter(i => i.id !== id));
  }, [getToken]);

  const byStage = useCallback((stage: BrandOperation['pipeline_stage']) =>
    items.filter(i => i.pipeline_stage === stage), [items]);

  return { items, loading, create, update, remove, byStage, refetch: fetch };
}
