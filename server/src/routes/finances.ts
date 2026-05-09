import { Hono } from 'hono';
import { eq, and, desc } from 'drizzle-orm';
import { format } from 'date-fns';
import { db } from '../db/index.js';
import { finances } from '../db/schema.js';

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const rows = await db.select().from(finances)
    .where(eq(finances.userId, userId))
    .orderBy(desc(finances.date));
  return c.json(rows);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const [row] = await db.insert(finances)
    .values({ userId, date: body.date ?? format(new Date(), 'yyyy-MM-dd'), ...body })
    .returning();
  return c.json(row);
});

app.delete('/:id', async (c) => {
  const userId = c.get('userId');
  await db.delete(finances)
    .where(and(eq(finances.id, c.req.param('id')), eq(finances.userId, userId)));
  return c.json({ ok: true });
});

export default app;
