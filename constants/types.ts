export type Pillar = 'presence' | 'mind' | 'body' | 'craft';

export interface DailyLog {
  id?: string;
  user_id: string;
  date: string;
  bedtime_checklist: boolean;
  exercise: boolean;
  no_porn: boolean;
  little_things: boolean;
  hydration: boolean;
  no_doom_scroll: boolean;
  wake_time?: string | null;
  sleep_time?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface PillarScores {
  id?: string;
  user_id: string;
  date: string;
  presence_score: number;
  mind_score: number;
  body_score: number;
  craft_score: number;
  overall_score: number;
}

export interface GarminData {
  id?: string;
  user_id: string;
  date: string;
  sleep_score?: number | null;
  sleep_percent?: number | null;
  sleep_debt?: number | null;
  body_battery?: number | null;
  hrv?: number | null;
}

export interface Nutrition {
  id?: string;
  user_id: string;
  date: string;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
  supplements?: string[] | null;
  hydration_oz?: number | null;
}

export interface ExerciseLog {
  id?: string;
  user_id: string;
  date: string;
  planned_session?: string | null;
  actual_session?: string | null;
  recovery_score?: number | null;
  sleep_adjusted_recommendation?: string | null;
  notes?: string | null;
}

export interface Finance {
  id?: string;
  user_id: string;
  date: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  notes?: string | null;
}

export interface SchoolCourse {
  id?: string;
  user_id: string;
  course_name: string;
  credit_hours: number;
  current_grade?: number | null;
  target_grade?: number | null;
  semester?: string | null;
  assignments: Assignment[];
}

export interface Assignment {
  id: string;
  name: string;
  due_date?: string | null;
  grade_received?: number | null;
  weight?: number | null;
  completed?: boolean;
}

export interface Goal {
  id?: string;
  user_id: string;
  title: string;
  pillar?: Pillar | null;
  deadline?: string | null;
  milestones: Milestone[];
  completed: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface CalendarEvent {
  id?: string;
  user_id: string;
  title: string;
  date: string;
  start_time?: string | null;
  end_time?: string | null;
  tag?: string | null;
  notes?: string | null;
}

export interface WordOfDay {
  id?: string;
  user_id: string;
  date: string;
  word?: string | null;
  definition?: string | null;
  etymology?: string | null;
  part_of_speech?: string | null;
  example_sentence?: string | null;
}

export interface BrandOperation {
  id?: string;
  user_id: string;
  title?: string | null;
  status?: string | null;
  pipeline_stage?: 'idea' | 'in_progress' | 'scheduled' | 'published' | null;
  notes?: string | null;
  scheduled_date?: string | null;
}

export const SUPPLEMENTS = ['AG1', 'Creatine', 'Vitamin D', 'Magnesium', 'Fish Oil', 'NMN'];

export const CHECKLIST_LABELS: Record<string, string> = {
  bedtime_checklist: 'Bedtime Checklist',
  exercise: 'Exercise Completed',
  no_porn: 'No Porn',
  little_things: 'Little Things Completed',
  hydration: 'Hydration Met',
  no_doom_scroll: 'No Doom Scrolling',
};

export const CALENDAR_TAGS = ['School', 'Test', 'Personal', 'Business', 'Personal Time'] as const;
export type CalendarTag = typeof CALENDAR_TAGS[number];
