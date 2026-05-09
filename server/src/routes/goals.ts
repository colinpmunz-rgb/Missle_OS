import { Hono } from 'hono';
import { eq, and } from 'drizzle-orm';
import { db } from '../db/index.js';
import { goals } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const pillar = c.req.query('pillar');
  let query = db.select().from(goals).where(eq(goals.userId, userId)).$dynamic();
  if (pillar) query = query.where(and(eq(goals.userId, userId), eq(goals.pillar, pillar)));
  return c.json(await query);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.insert(goals).values({ userId, ...body, milestones: body.milestones ?? [] }).returning();
  return c.json(row);
});

app.put('/:id', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.update(goals).set({ ...body, updatedAt: new Date() })
    .where(and(eq(goals.id, c.req.param('id')), eq(goals.userId, userId))).returning();
  return c.json(row);
});

app.delete('/:id', async (c) => {
  const userId = c.get('userId');
  await db.delete(goals).where(and(eq(goals.id, c.req.param('id')), eq(goals.userId, userId)));
  return c.json({ ok: true });
});

export default app;
