import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { db } from '../db/index.js';
import { exerciseLog } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const rows = await db.select().from(exerciseLog)
    .where(eq(exerciseLog.userId, userId))
    .orderBy(desc(exerciseLog.date)).limit(30);
  return c.json(rows);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const date = body.date ?? format(new Date(), 'yyyy-MM-dd');
  const [row] = await db.insert(exerciseLog).values({ userId, date, ...body, updatedAt: new Date() }).returning();
  return c.json(row);
});

export default app;
