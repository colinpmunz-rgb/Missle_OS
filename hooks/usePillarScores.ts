import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { api } from '../lib/api';
import type { PillarScores } from '../constants/types';

export function usePillarScores(days = 30) {
  const { getToken } = useAuth();
  const [scores, setScores] = useState<PillarScores[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await api(token).get<PillarScores[]>(`/api/pillar-scores?limit=${days}`);
    setScores(data ?? []);
    setLoading(false);
  }, [getToken, days]);

  useEffect(() => { fetch(); }, [fetch]);

  const latest = scores[scores.length - 1] ?? null;
  return { scores, latest, loading, refetch: fetch };
}
