import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { format } from 'date-fns';
import { db } from '../db/index.js';
import { nutrition } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const date = c.req.query('date') ?? format(new Date(), 'yyyy-MM-dd');
  const [row] = await db.select().from(nutrition)
    .where(and(eq(nutrition.userId, userId), eq(nutrition.date, date)));
  return c.json(row ?? null);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const date = body.date ?? format(new Date(), 'yyyy-MM-dd');
  const [row] = await db.insert(nutrition).values({ userId, date, ...body, updatedAt: new Date() })
    .onConflictDoUpdate({ target: [nutrition.userId, nutrition.date], set: { ...body, updatedAt: new Date() } })
    .returning();
  return c.json(row);
});

export default app;
