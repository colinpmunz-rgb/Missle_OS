import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { calendarEvents } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const rows = await db.select().from(calendarEvents)
    .where(eq(calendarEvents.userId, userId))
    .orderBy(calendarEvents.date);
  return c.json(rows);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.insert(calendarEvents).values({ userId, ...body }).returning();
  return c.json(row);
});

app.put('/:id', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.update(calendarEvents).set(body)
    .where(and(eq(calendarEvents.id, c.req.param('id')), eq(calendarEvents.userId, userId))).returning();
  return c.json(row);
});

app.delete('/:id', async (c) => {
  const userId = c.get('userId');
  await db.delete(calendarEvents).where(and(eq(calendarEvents.id, c.req.param('id')), eq(calendarEvents.userId, userId)));
  return c.json({ ok: true });
});

export default app;
