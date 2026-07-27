import { Router, type Request, type Response } from 'express';
import { prisma } from '../../lib/prisma.js';

export const leaderboardRouter = Router();

/**
 * GET /api/leaderboard
 * Public. Aggregates points per user from correct submissions —
 * deliberately counts each solved challenge only once per user even if
 * they submitted the correct flag multiple times (Submission logs every
 * attempt, so naive summing would double-count repeat submissions).
 */
leaderboardRouter.get('/', async (_req: Request, res: Response) => {
  const correctSubmissions = await prisma.submission.findMany({
    where: { correct: true },
    include: { user: { select: { username: true } }, challenge: { select: { points: true } } },
  });

  const byUser = new Map<string, { username: string; points: number; solvedSlugs: Set<string> }>();

  for (const sub of correctSubmissions) {
    const entry = byUser.get(sub.userId) ?? {
      username: sub.user.username,
      points: 0,
      solvedSlugs: new Set<string>(),
    };
    if (!entry.solvedSlugs.has(sub.challengeSlug)) {
      entry.solvedSlugs.add(sub.challengeSlug);
      entry.points += sub.challenge.points;
    }
    byUser.set(sub.userId, entry);
  }

  const leaderboard = Array.from(byUser.values())
    .map((e) => ({ username: e.username, points: e.points, solvedCount: e.solvedSlugs.size }))
    .sort((a, b) => b.points - a.points);

  res.json(leaderboard);
});
