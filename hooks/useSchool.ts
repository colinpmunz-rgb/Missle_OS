import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@clerk/expo';
import { api } from '../lib/api';
import type { SchoolCourse } from '../constants/types';

export function useSchool() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<SchoolCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const data = await api(token).get<SchoolCourse[]>('/api/school');
    setCourses(data ?? []);
    setLoading(false);
  }, [getToken]);

  useEffect(() => { fetch(); }, [fetch]);

  const create = useCallback(async (course: Omit<SchoolCourse, 'id' | 'user_id'>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).post<SchoolCourse>('/api/school', course);
    setCourses(prev => [...prev, row]);
  }, [getToken]);

  const update = useCallback(async (id: string, updates: Partial<SchoolCourse>) => {
    const token = await getToken();
    if (!token) return;
    const row = await api(token).put<SchoolCourse>(`/api/school/${id}`, updates);
    setCourses(prev => prev.map(c => c.id === id ? row : c));
  }, [getToken]);

  const remove = useCallback(async (id: string) => {
    const token = await getToken();
    if (!token) return;
    await api(token).delete(`/api/school/${id}`);
    setCourses(prev => prev.filter(c => c.id !== id));
  }, [getToken]);

  const calculateGPA = useCallback(() => {
    if (!courses.length) return 0;
    let totalPoints = 0, totalCredits = 0;
    for (const c of courses) {
      const credits = c.credit_hours ?? 0;
      const grade = Number(c.current_grade ?? 0);
      let pts = 0;
      if (grade >= 93) pts = 4.0;
      else if (grade >= 90) pts = 3.7;
      else if (grade >= 87) pts = 3.3;
      else if (grade >= 83) pts = 3.0;
      else if (grade >= 80) pts = 2.7;
      else if (grade >= 77) pts = 2.3;
      else if (grade >= 73) pts = 2.0;
      else if (grade >= 70) pts = 1.7;
      else if (grade >= 67) pts = 1.3;
      else if (grade >= 63) pts = 1.0;
      else if (grade >= 60) pts = 0.7;
      totalPoints += pts * credits;
      totalCredits += credits;
    }
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  }, [courses]);

  return { courses, loading, create, update, remove, calculateGPA, refetch: fetch };
}
