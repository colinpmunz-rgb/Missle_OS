import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { pillarScores } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const limit = parseInt(c.req.query('limit') ?? '30');
  const rows = await db.select().from(pillarScores)
    .where(eq(pillarScores.userId, userId))
    .orderBy(pillarScores.date)
    .limit(limit);
  return c.json(rows);
});

app.get('/latest', async (c) => {
  const userId = c.get('userId');
  const [row] = await db.select().from(pillarScores)
    .where(eq(pillarScores.userId, userId))
    .orderBy(desc(pillarScores.date))
    .limit(1);
  return c.json(row ?? null);
});

export default app;
