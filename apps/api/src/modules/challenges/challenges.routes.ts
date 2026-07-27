import { Router, type Request, type Response } from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '../../lib/prisma.js';
import { attachUserIfPresent, requireAuth } from '../auth/auth.middleware.js';

export const challengesRouter = Router();

const CHALLENGES_ROOT = path.resolve(process.cwd(), '../../challenges');

/**
 * GET /api/challenges?category=idor&difficulty=beginner
 * Public — no auth required to browse. Reads from Postgres (the safe
 * index), never touches the in-memory flag cache.
 */
challengesRouter.get('/', async (req: Request, res: Response) => {
  const { category, difficulty } = req.query;

  const challenges = await prisma.challenge.findMany({
    where: {
      ...(typeof category === 'string' ? { category } : {}),
      ...(typeof difficulty === 'string' ? { difficulty } : {}),
    },
    orderBy: { name: 'asc' },
  });

  res.json(challenges);
});

/**
 * GET /api/challenges/:slug
 * Public, but attaches solved-status if the request has a valid session —
 * attachUserIfPresent doesn't reject unauthenticated requests, it just
 * skips the personalization.
 */
challengesRouter.get('/:slug', attachUserIfPresent, async (req: Request, res: Response) => {
  const { slug } = req.params;

  const challenge = await prisma.challenge.findUnique({ where: { slug } });
  if (!challenge) {
    res.status(404).json({ error: 'Challenge not found' });
    return;
  }

  let solved = false;
  if (req.user) {
    const solvedSubmission = await prisma.submission.findFirst({
      where: { userId: req.user.sub, challengeSlug: slug, correct: true },
    });
    solved = solvedSubmission !== null;
  }

  res.json({ ...challenge, solved });
});

/**
 * GET /api/challenges/:slug/writeup
 * Requires auth. Full walkthrough is only released once the user has
 * solved it, OR via the explicit ?reveal=true escape hatch for someone
 * who wants to give up and learn from the write-up anyway — the point
 * is informed choice, not gatekeeping the education.
 */
challengesRouter.get('/:slug/writeup', requireAuth, async (req: Request, res: Response) => {
  const { slug } = req.params;
  const forceReveal = req.query.reveal === 'true';

  const challenge = await prisma.challenge.findUnique({ where: { slug } });
  if (!challenge) {
    res.status(404).json({ error: 'Challenge not found' });
    return;
  }

  if (!forceReveal) {
    const solvedSubmission = await prisma.submission.findFirst({
      where: { userId: req.user!.sub, challengeSlug: slug, correct: true },
    });
    if (!solvedSubmission) {
      res.status(403).json({
        error: 'Write-up is locked until solved. Retry with ?reveal=true to view it anyway.',
      });
      return;
    }
  }

  try {
    const writeUpContent = await readFile(
      path.join(CHALLENGES_ROOT, slug, challenge.writeUpPath),
      'utf-8',
    );
    res.type('text/markdown').send(writeUpContent);
  } catch {
    res.status(404).json({ error: 'Write-up file not found on disk' });
  }
});
