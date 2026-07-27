import type { Request, Response, NextFunction } from 'express';
import { config } from '../../config.js';
import { verifyAuthToken, type AuthTokenPayload } from './auth.service.js';

export const AUTH_COOKIE_NAME = 'vulnforge_token';

/**
 * Every cookie option lives here — one place to change if the deployment
 * model changes (e.g. cross-origin frontend/api in a future hosted mode).
 */
export function authCookieOptions() {
  return {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, authCookieOptions());
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

/**
 * Reads the JWT from the httpOnly cookie (never from an Authorization
 * header — the cookie is the single source of truth for session state,
 * which is what keeps this consistent with the XSS-resistant storage
 * model the platform itself is meant to demonstrate).
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

/** Attaches req.user if a valid cookie is present, but doesn't reject if absent. */
export function attachUserIfPresent(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
  if (token) {
    try {
      req.user = verifyAuthToken(token);
    } catch {
      // Invalid/expired token on an optional route — just proceed unauthenticated.
    }
  }
  next();
}
