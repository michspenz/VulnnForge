import { PrismaClient } from '@prisma/client';

/**
 * A single shared PrismaClient instance for the whole process.
 * In dev, tsx watch restarts the module on every file change — without
 * this guard, each restart would open a fresh connection pool against
 * Postgres and eventually exhaust it.
 */
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
