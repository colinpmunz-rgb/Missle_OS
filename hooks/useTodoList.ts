import { useCallback, useEffect, useState } from 'react';
import { format, subDays, parseISO } from 'date-fns';

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

interface StreakData {
  count: number;
  lastProcessedDate: string;
}

// Active date: before 6 AM still counts as yesterday
function getActiveDate(): string {
  const now = new Date();
  if (now.getHours() < 6) {
    return format(subDays(now, 1), 'yyyy-MM-dd');
  }
  return format(now, 'yyyy-MM-dd');
}

function getTomorrow(dateStr: string): string {
  const d = parseISO(dateStr);
  d.setDate(d.getDate() + 1);
  return format(d, 'yyyy-MM-dd');
}

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const ls = {
  get(key: string): string | null {
    return isBrowser ? window.localStorage.getItem(key) : null;
  },
  set(key: string, val: string) {
    if (isBrowser) window.localStorage.setItem(key, val);
  },
  remove(key: string) {
    if (isBrowser) window.localStorage.removeItem(key);
  },
  keys(): string[] {
    if (!isBrowser) return [];
    return Object.keys(window.localStorage);
  },
};

function loadGoals(date: string): Goal[] {
  const raw = ls.get(`goals:${date}`);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveGoals(date: string, goals: Goal[]) {
  if (goals.length === 0) ls.remove(`goals:${date}`);
  else ls.set(`goals:${date}`, JSON.stringify(goals));
}

function loadStreak(): StreakData {
  const raw = ls.get('goal_streak_v1');
  if (!raw) return { count: 0, lastProcessedDate: '' };
  try { return JSON.parse(raw); } catch { return { count: 0, lastProcessedDate: '' }; }
}

function saveStreak(data: StreakData) {
  ls.set('goal_streak_v1', JSON.stringify(data));
}

// Pull undone goals from all past dates into today, deduped by text
function rolloverUndone(todayDate: string): Goal[] {
  const current = loadGoals(todayDate);
  const seen = new Set(current.map(g => g.text.trim().toLowerCase()));
  const merged = [...current];

  const pastKeys = ls.keys().filter(k =>
    k.startsWith('goals:') && k !== `goals:${todayDate}`
  );

  for (const key of pastKeys) {
    const date = key.replace('goals:', '');
    const past = loadGoals(date);
    for (const g of past.filter(g => !g.completed)) {
      const norm = g.text.trim().toLowerCase();
      if (!seen.has(norm)) {
        merged.push({ id: `${Date.now()}-${Math.random()}`, text: g.text, completed: false });
        seen.add(norm);
      }
    }
    ls.remove(key);
  }

  return merged;
}

// Count consecutive days with all goals completed (skip days with 0 goals)
function calcStreak(todayDate: string): number {
  const cached = loadStreak();
  if (cached.lastProcessedDate === todayDate) return cached.count;

  let count = 0;
  let check = format(subDays(parseISO(todayDate), 1), 'yyyy-MM-dd');
  const limit = 90;

  for (let i = 0; i < limit; i++) {
    const goals = loadGoals(check);
    if (goals.length === 0) {
      check = format(subDays(parseISO(check), 1), 'yyyy-MM-dd');
      continue;
    }
    if (goals.every(g => g.completed)) {
      count++;
      check = format(subDays(parseISO(check), 1), 'yyyy-MM-dd');
    } else {
      break;
    }
  }

  saveStreak({ count, lastProcessedDate: todayDate });
  return count;
}

export function useTodoList() {
  const [activeDate] = useState(getActiveDate);
  const [tomorrowDate] = useState(() => getTomorrow(getActiveDate()));
  const [todayGoals, setTodayGoals] = useState<Goal[]>([]);
  const [tomorrowGoals, setTomorrowGoals] = useState<Goal[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const goals = rolloverUndone(activeDate);
    saveGoals(activeDate, goals);
    setTodayGoals(goals);
    setTomorrowGoals(loadGoals(tomorrowDate));
    setStreak(calcStreak(activeDate));
  }, [activeDate, tomorrowDate]);

  const addTodayGoal = useCallback((text: string) => {
    const g: Goal = { id: `${Date.now()}`, text: text.trim(), completed: false };
    setTodayGoals(prev => { const next = [...prev, g]; saveGoals(activeDate, next); return next; });
  }, [activeDate]);

  const toggleGoal = useCallback((id: string) => {
    setTodayGoals(prev => {
      const next = prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g);
      saveGoals(activeDate, next);
      return next;
    });
  }, [activeDate]);

  const editGoal = useCallback((id: string, text: string, isToday: boolean) => {
    if (isToday) {
      setTodayGoals(prev => { const next = prev.map(g => g.id === id ? { ...g, text } : g); saveGoals(activeDate, next); return next; });
    } else {
      setTomorrowGoals(prev => { const next = prev.map(g => g.id === id ? { ...g, text } : g); saveGoals(tomorrowDate, next); return next; });
    }
  }, [activeDate, tomorrowDate]);

  const deleteGoal = useCallback((id: string, isToday: boolean) => {
    if (isToday) {
      setTodayGoals(prev => { const next = prev.filter(g => g.id !== id); saveGoals(activeDate, next); return next; });
    } else {
      setTomorrowGoals(prev => { const next = prev.filter(g => g.id !== id); saveGoals(tomorrowDate, next); return next; });
    }
  }, [activeDate, tomorrowDate]);

  const moveGoal = useCallback((id: string, dir: -1 | 1, isToday: boolean) => {
    const move = (arr: Goal[]) => {
      const idx = arr.findIndex(g => g.id === id);
      if (idx < 0) return arr;
      const next = [...arr];
      const swapIdx = idx + dir;
      if (swapIdx < 0 || swapIdx >= next.length) return arr;
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    };
    if (isToday) {
      setTodayGoals(prev => { const next = move(prev); saveGoals(activeDate, next); return next; });
    } else {
      setTomorrowGoals(prev => { const next = move(prev); saveGoals(tomorrowDate, next); return next; });
    }
  }, [activeDate, tomorrowDate]);

  const pushRemaining = useCallback(() => {
    setTodayGoals(todayG => {
      setTomorrowGoals(tomorrowG => {
        const existing = new Set(tomorrowG.map(g => g.text.trim().toLowerCase()));
        const toAdd = todayG
          .filter(g => !g.completed && !existing.has(g.text.trim().toLowerCase()))
          .map(g => ({ id: `${Date.now()}-${Math.random()}`, text: g.text, completed: false }));
        const next = [...tomorrowG, ...toAdd];
        saveGoals(tomorrowDate, next);
        return next;
      });
      return todayG;
    });
  }, [tomorrowDate]);

  const addTomorrowGoal = useCallback((text: string) => {
    const g: Goal = { id: `${Date.now()}`, text: text.trim(), completed: false };
    setTomorrowGoals(prev => { const next = [...prev, g]; saveGoals(tomorrowDate, next); return next; });
  }, [tomorrowDate]);

  const completed = todayGoals.filter(g => g.completed).length;
  const total = todayGoals.length;
  const allDone = total > 0 && completed === total;

  return {
    activeDate, tomorrowDate,
    todayGoals, tomorrowGoals,
    streak, completed, total, allDone,
    addTodayGoal, toggleGoal, editGoal, deleteGoal, moveGoal,
    pushRemaining, addTomorrowGoal,
  };
}
