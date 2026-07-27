import { Router, type Request, type Response } from 'express';
import { timingSafeEqual } from 'node:crypto';
import { flagSubmissionRequestSchema } from '@vulnforge/shared';
import { prisma } from '../../lib/prisma.js';
import { requireAuth } from '../auth/auth.middleware.js';
import { getChallengeFromCache } from '../challenges/challenge-loader.js';

export const submissionsRouter = Router();

/**
 * Constant-time string comparison — prevents a timing side-channel that
 * could let an attacker infer the flag one character at a time by
 * measuring response latency. Small detail, but this platform is meant
 * to teach security practices, so its own code should model them.
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal-length buffers so the function
    // takes roughly constant time regardless of the early-exit case.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

submissionsRouter.post('/', requireAuth, async (req: Request, res: Response) => {
  const parsed = flagSubmissionRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid input', issues: parsed.error.issues });
    return;
  }

  const { challengeSlug, submittedFlag } = parsed.data;
  const userId = req.user!.sub;

  const cached = getChallengeFromCache(challengeSlug);
  if (!cached) {
    res.status(404).json({ error: 'Challenge not found' });
    return;
  }

  const alreadySolvedBefore = await prisma.submission.findFirst({
    where: { userId, challengeSlug, correct: true },
  });

  const correct = safeCompare(submittedFlag, cached.flag);

  await prisma.submission.create({
    data: { userId, challengeSlug, submittedFlag, correct },
  });

  const dbChallenge = await prisma.challenge.findUnique({ where: { slug: challengeSlug } });
  const pointsAwarded = correct && !alreadySolvedBefore ? (dbChallenge?.points ?? 100) : 0;

  res.json({
    correct,
    pointsAwarded,
    alreadySolved: alreadySolvedBefore !== null,
  });
});
