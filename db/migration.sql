-- Missile OS — Railway PostgreSQL Migration

CREATE TABLE IF NOT EXISTS daily_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
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
  user_id text NOT NULL,
  title text,
  status text,
  pipeline_stage text,
  notes text,
  scheduled_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
