import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db/index.js';
import { brandOperations } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const rows = await db.select().from(brandOperations)
    .where(eq(brandOperations.userId, userId)).orderBy(desc(brandOperations.createdAt));
  return c.json(rows);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.insert(brandOperations).values({ userId, ...body }).returning();
  return c.json(row);
});

app.put('/:id', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.update(brandOperations).set({ ...body, updatedAt: new Date() })
    .where(and(eq(brandOperations.id, c.req.param('id')), eq(brandOperations.userId, userId))).returning();
  return c.json(row);
});

app.delete('/:id', async (c) => {
  const userId = c.get('userId');
  await db.delete(brandOperations).where(and(eq(brandOperations.id, c.req.param('id')), eq(brandOperations.userId, userId)));
  return c.json({ ok: true });
});

export default app;
