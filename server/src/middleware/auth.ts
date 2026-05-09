import 'dotenv/config';
import { createClerkClient } from '@clerk/backend';
import type { Context, Next } from 'hono';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  const token = authHeader.slice(7);
  try {
    const payload = await clerk.verifyToken(token);
    c.set('userId', payload.sub);
    await next();
  } catch {
    return c.json({ error: 'Unauthorized' }, 401);
  }
}
