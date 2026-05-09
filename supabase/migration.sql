-- Missile OS — Full Database Migration
-- Run this in Supabase SQL Editor before first launch

CREATE TABLE IF NOT EXISTS daily_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  bedtime_checklist bool DEFAULT false,
  exercise bool DEFAULT false,
  no_porn bool DEFAULT false,
  little_things bool DEFAULT false,
  hydration bool DEFAULT false,
  no_doom_scroll bool DEFAULT false,
  wake_time time,
  sleep_time time,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS pillar_scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  presence_score decimal DEFAULT 0,
  mind_score decimal DEFAULT 0,
  body_score decimal DEFAULT 0,
  craft_score decimal DEFAULT 0,
  overall_score decimal DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS garmin_data (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  sleep_score int,
  sleep_percent decimal,
  sleep_debt decimal,
  body_battery int,
  hrv int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS nutrition (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  calories int,
  protein_g decimal,
  carbs_g decimal,
  fat_g decimal,
  supplements text[],
  hydration_oz decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS exercise_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  planned_session text,
  actual_session text,
  recovery_score decimal,
  sleep_adjusted_recommendation text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS finances (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  category text,
  amount decimal,
  type text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS school (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  course_name text NOT NULL,
  credit_hours int,
  current_grade decimal,
  target_grade decimal,
  semester text,
  assignments jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  pillar text,
  deadline date,
  milestones jsonb DEFAULT '[]',
  completed bool DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  date date NOT NULL,
  start_time time,
  end_time time,
  tag text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS word_of_day (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  date date NOT NULL,
  word text,
  definition text,
  etymology text,
  part_of_speech text,
  example_sentence text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

CREATE TABLE IF NOT EXISTS brand_operations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text,
  status text,
  pipeline_stage text,
  notes text,
  scheduled_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE pillar_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE garmin_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE finances ENABLE ROW LEVEL SECURITY;
ALTER TABLE school ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_of_day ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_operations ENABLE ROW LEVEL SECURITY;

-- Policies (drop first if re-running)
DROP POLICY IF EXISTS "Users access own data" ON daily_log;
DROP POLICY IF EXISTS "Users access own data" ON pillar_scores;
DROP POLICY IF EXISTS "Users access own data" ON garmin_data;
DROP POLICY IF EXISTS "Users access own data" ON nutrition;
DROP POLICY IF EXISTS "Users access own data" ON exercise_log;
DROP POLICY IF EXISTS "Users access own data" ON finances;
DROP POLICY IF EXISTS "Users access own data" ON school;
DROP POLICY IF EXISTS "Users access own data" ON goals;
DROP POLICY IF EXISTS "Users access own data" ON calendar_events;
DROP POLICY IF EXISTS "Users access own data" ON word_of_day;
DROP POLICY IF EXISTS "Users access own data" ON brand_operations;

CREATE POLICY "Users access own data" ON daily_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON pillar_scores FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON garmin_data FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON nutrition FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON exercise_log FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON finances FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON school FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON goals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON calendar_events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON word_of_day FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own data" ON brand_operations FOR ALL USING (auth.uid() = user_id);
