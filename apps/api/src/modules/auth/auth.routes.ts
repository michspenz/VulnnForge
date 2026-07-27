import { Router, type Request, type Response } from 'express';
import { registerRequestSchema, loginRequestSchema } from '@vulnforge/shared';
import {
  registerUser,
  authenticateUser,
  signAuthToken,
  AuthError,
} from './auth.service.js';
import { setAuthCookie, clearAuthCookie, requireAuth } from './auth.middleware.js';
import { prisma } from '../../lib/prisma.js';

export const authRouter = Router();

authRouter.post('/register', async (req: Request, res: Response) => {
  const parsed = registerRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
    return;
  }

  try {
    const user = await registerUser(parsed.data);
    const token = signAuthToken({ sub: user.id, role: user.role });
    setAuthCookie(res, token);
    res.status(201).json({ id: user.id, email: user.email, username: user.username });
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    throw err;
  }
});

authRouter.post('/login', async (req: Request, res: Response) => {
  const parsed = loginRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
    return;
  }

  try {
    const user = await authenticateUser(parsed.data);
    const token = signAuthToken({ sub: user.id, role: user.role });
    setAuthCookie(res, token);
    res.json({ id: user.id, email: user.email, username: user.username });
  } catch (err) {
    if (err instanceof AuthError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }
    throw err;
  }
});

authRouter.post('/logout', (_req: Request, res: Response) => {
  clearAuthCookie(res);
  res.status(204).send();
});

authRouter.get('/me', requireAuth, async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ id: user.id, email: user.email, username: user.username, role: user.role });
});
