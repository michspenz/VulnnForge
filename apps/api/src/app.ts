import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import cookieParser from 'cookie-parser';
import { authRouter } from './modules/auth/auth.routes.js';
import { challengesRouter } from './modules/challenges/challenges.routes.js';
import { submissionsRouter } from './modules/submissions/submissions.routes.js';
import { leaderboardRouter } from './modules/leaderboard/leaderboard.routes.js';
import { leaderboardRouter } from './modules/leaderboard/leaderboard.routes.js';

/**
 * Builds the Express app without binding to a port.
 * Kept separate from server.ts so integration tests (M6) can import
 * this directly with supertest instead of spinning up a real listener.
 */
export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(pinoHttp());

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/challenges', challengesRouter);
  app.use('/api/submissions', submissionsRouter);
  app.use('/api/leaderboard', leaderboardRouter);
  app.use('/api/leaderboard', leaderboardRouter);

  return app;
}
