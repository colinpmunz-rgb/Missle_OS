import 'dotenv/config';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { requireAuth } from './middleware/auth.js';
import dailyLogRouter from './routes/daily-log.js';
import pillarScoresRouter from './routes/pillar-scores.js';
import garminRouter from './routes/garmin.js';
import nutritionRouter from './routes/nutrition.js';
import exerciseRouter from './routes/exercise.js';
import financesRouter from './routes/finances.js';
import schoolRouter from './routes/school.js';
import goalsRouter from './routes/goals.js';
import calendarRouter from './routes/calendar.js';
import wordOfDayRouter from './routes/word-of-day.js';
import brandOpsRouter from './routes/brand-ops.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({ origin: '*', allowHeaders: ['Authorization', 'Content-Type'] }));

app.get('/health', (c) => c.json({ status: 'ok' }));

app.use('/api/*', requireAuth);

app.route('/api/daily-log', dailyLogRouter);
app.route('/api/pillar-scores', pillarScoresRouter);
app.route('/api/garmin', garminRouter);
app.route('/api/nutrition', nutritionRouter);
app.route('/api/exercise', exerciseRouter);
app.route('/api/finances', financesRouter);
app.route('/api/school', schoolRouter);
app.route('/api/goals', goalsRouter);
app.route('/api/calendar', calendarRouter);
app.route('/api/word-of-day', wordOfDayRouter);
app.route('/api/brand-ops', brandOpsRouter);

// Serve static web app
app.use('/*', serveStatic({ root: './public' }));

// SPA fallback — serve index.html for all non-API routes
app.get('*', async (c) => {
  try {
    const html = await readFile(join(process.cwd(), 'public', 'index.html'), 'utf-8');
    return c.html(html);
  } catch {
    return c.text('Not found', 404);
  }
});

const port = parseInt(process.env.PORT ?? '3000');
console.log(`Missile OS API running on port ${port}`);

serve({ fetch: app.fetch, port });
