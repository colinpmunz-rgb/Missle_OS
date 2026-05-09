import { Hono } from 'hono';
import { eq, and, lt } from 'drizzle-orm';
import { format } from 'date-fns';
import { db } from '../db/index.js';
import { dailyLog, pillarScores } from '../db/schema.js';

const PILLAR_GAINS: Record<string, Partial<Record<string, number>>> = {
  bedtimeChecklist: { presence: 0.5, mind: 0.5, body: 0.5, craft: 0.5 },
  exercise: { body: 2 },
  noPorn: { mind: 2 },
  littleThings: { craft: 2 },
  hydration: { body: 2 },
  noDoomScroll: { presence: 2 },
};

async function recalcScores(userId: string, date: string) {
  const [log] = await db.select().from(dailyLog)
    .where(and(eq(dailyLog.userId, userId), eq(dailyLog.date, date)));

  const [prev] = await db.select().from(pillarScores)
    .where(and(eq(pillarScores.userId, userId), lt(pillarScores.date, date)))
    .orderBy(pillarScores.date)
    .limit(1);

  const prevScores = {
    presence: parseFloat(prev?.presenceScore ?? '0'),
    mind: parseFloat(prev?.mindScore ?? '0'),
    body: parseFloat(prev?.bodyScore ?? '0'),
    craft: parseFloat(prev?.craftScore ?? '0'),
  };

  const gains: Record<string, number> = { presence: 0, mind: 0, body: 0, craft: 0 };
  if (log) {
    const fields: (keyof typeof log)[] = ['bedtimeChecklist', 'exercise', 'noPorn', 'littleThings', 'hydration', 'noDoomScroll'];
    for (const f of fields) {
      if (log[f]) {
        const mapping = PILLAR_GAINS[f as string] ?? {};
        for (const [pillar, val] of Object.entries(mapping)) {
          gains[pillar] += val ?? 0;
        }
      }
    }
  }

  const newScores = {
    presence: gains.presence > 0 ? prevScores.presence + gains.presence : Math.max(0, prevScores.presence - 1.5),
    mind: gains.mind > 0 ? prevScores.mind + gains.mind : Math.max(0, prevScores.mind - 1.5),
    body: gains.body > 0 ? prevScores.body + gains.body : Math.max(0, prevScores.body - 1.5),
    craft: gains.craft > 0 ? prevScores.craft + gains.craft : Math.max(0, prevScores.craft - 1.5),
  };
  const overall = (newScores.presence + newScores.mind + newScores.body + newScores.craft) / 4;

  await db.insert(pillarScores).values({
    userId, date,
    presenceScore: newScores.presence.toString(),
    mindScore: newScores.mind.toString(),
    bodyScore: newScores.body.toString(),
    craftScore: newScores.craft.toString(),
    overallScore: overall.toString(),
    updatedAt: new Date(),
  }).onConflictDoUpdate({
    target: [pillarScores.userId, pillarScores.date],
    set: {
      presenceScore: newScores.presence.toString(),
      mindScore: newScores.mind.toString(),
      bodyScore: newScores.body.toString(),
      craftScore: newScores.craft.toString(),
      overallScore: overall.toString(),
      updatedAt: new Date(),
    },
  });
}

const app = new Hono<{ Variables: { userId: string } }>();

app.get('/', async (c) => {
  const userId = c.get('userId');
  const date = c.req.query('date') ?? format(new Date(), 'yyyy-MM-dd');
  const [row] = await db.select().from(dailyLog)
    .where(and(eq(dailyLog.userId, userId), eq(dailyLog.date, date)));
  return c.json(row ?? null);
});

app.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const date = body.date ?? format(new Date(), 'yyyy-MM-dd');

  const [row] = await db.insert(dailyLog).values({ userId, date, ...body, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [dailyLog.userId, dailyLog.date],
      set: { ...body, updatedAt: new Date() },
    }).returning();

  await recalcScores(userId, date);
  return c.json(row);
});

export default app;
