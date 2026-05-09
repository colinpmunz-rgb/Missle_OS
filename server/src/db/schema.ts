import {
  pgTable, uuid, text, boolean, integer, timestamp, date, time, jsonb, unique, numeric
} from 'drizzle-orm/pg-core';

export const dailyLog = pgTable('daily_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  date: date('date').notNull(),
  bedtimeChecklist: boolean('bedtime_checklist').default(false),
  exercise: boolean('exercise').default(false),
  noPorn: boolean('no_porn').default(false),
  littleThings: boolean('little_things').default(false),
  hydration: boolean('hydration').default(false),
  noDoomScroll: boolean('no_doom_scroll').default(false),
  wakeTime: time('wake_time'),
  sleepTime: time('sleep_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, t => ({ uniq: unique().on(t.userId, t.date) }));

export const pillarScores = pgTable('pillar_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  date: date('date').notNull(),
  presenceScore: numeric('presence_score').default('0'),
  mindScore: numeric('mind_score').default('0'),
  bodyScore: numeric('body_score').default('0'),
  craftScore: numeric('craft_score').default('0'),
  overallScore: numeric('overall_score').default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, t => ({ uniq: unique().on(t.userId, t.date) }));

export const garminData = pgTable('garmin_data', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  date: date('date').notNull(),
  sleepScore: integer('sleep_score'),
  sleepPercent: numeric('sleep_percent'),
  sleepDebt: numeric('sleep_debt'),
  bodyBattery: integer('body_battery'),
  hrv: integer('hrv'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, t => ({ uniq: unique().on(t.userId, t.date) }));

export const nutrition = pgTable('nutrition', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  date: date('date').notNull(),
  calories: integer('calories'),
  proteinG: numeric('protein_g'),
  carbsG: numeric('carbs_g'),
  fatG: numeric('fat_g'),
  supplements: text('supplements').array(),
  hydrationOz: numeric('hydration_oz'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, t => ({ uniq: unique().on(t.userId, t.date) }));

export const exerciseLog = pgTable('exercise_log', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  date: date('date').notNull(),
  plannedSession: text('planned_session'),
  actualSession: text('actual_session'),
  recoveryScore: numeric('recovery_score'),
  sleepAdjustedRecommendation: text('sleep_adjusted_recommendation'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const finances = pgTable('finances', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  date: date('date').notNull(),
  category: text('category'),
  amount: numeric('amount'),
  type: text('type'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const school = pgTable('school', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  courseName: text('course_name').notNull(),
  creditHours: integer('credit_hours'),
  currentGrade: numeric('current_grade'),
  targetGrade: numeric('target_grade'),
  semester: text('semester'),
  assignments: jsonb('assignments').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const goals = pgTable('goals', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  pillar: text('pillar'),
  deadline: date('deadline'),
  milestones: jsonb('milestones').default([]),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title').notNull(),
  date: date('date').notNull(),
  startTime: time('start_time'),
  endTime: time('end_time'),
  tag: text('tag'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const wordOfDay = pgTable('word_of_day', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  date: date('date').notNull(),
  word: text('word'),
  definition: text('definition'),
  etymology: text('etymology'),
  partOfSpeech: text('part_of_speech'),
  exampleSentence: text('example_sentence'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, t => ({ uniq: unique().on(t.userId, t.date) }));

export const brandOperations = pgTable('brand_operations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  title: text('title'),
  status: text('status'),
  pipelineStage: text('pipeline_stage'),
  notes: text('notes'),
  scheduledDate: date('scheduled_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
