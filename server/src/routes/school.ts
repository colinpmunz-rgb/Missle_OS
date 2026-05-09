import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { school } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const rows = await db.select().from(school).where(eq(school.userId, userId));
  return c.json(rows);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.insert(school).values({ userId, ...body, assignments: body.assignments ?? [] }).returning();
  return c.json(row);
});

app.put('/:id', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.update(school).set({ ...body, updatedAt: new Date() })
    .where(and(eq(school.id, c.req.param('id')), eq(school.userId, userId))).returning();
  return c.json(row);
});

app.delete('/:id', async (c) => {
  const userId = c.get('userId');
  await db.delete(school).where(and(eq(school.id, c.req.param('id')), eq(school.userId, userId)));
  return c.json({ ok: true });
});

export default app;
