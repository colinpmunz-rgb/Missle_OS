import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { db } from '../db/index.js';
import { wordOfDay } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const rows = await db.select().from(wordOfDay)
    .where(eq(wordOfDay.userId, userId)).orderBy(desc(wordOfDay.date)).limit(100);
  return c.json(rows);
});

app.get('/today', async (c) => {
  const userId = c.get('userId');
  const date = format(new Date(), 'yyyy-MM-dd');
  const [row] = await db.select().from(wordOfDay)
    .where(and(eq(wordOfDay.userId, userId), eq(wordOfDay.date, date)));
  return c.json(row ?? null);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const date = body.date ?? format(new Date(), 'yyyy-MM-dd');
  const [row] = await db.insert(wordOfDay).values({ userId, date, ...body })
    .onConflictDoUpdate({ target: [wordOfDay.userId, wordOfDay.date], set: { ...body } })
    .returning();
  return c.json(row);
});

export default app;
