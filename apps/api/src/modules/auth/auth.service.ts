import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config.js';
import { prisma } from '../../lib/prisma.js';
import type { LoginRequest, RegisterRequest } from '@vulnforge/shared';

const BCRYPT_ROUNDS = 12;

export interface AuthTokenPayload {
  sub: string; // user id
  role: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401,
  ) {
    super(message);
  }
}

export async function registerUser(input: RegisterRequest) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { username: input.username }] },
  });
  if (existing) {
    throw new AuthError('Email or username already in use', 409);
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: input.email, username: input.username, passwordHash },
  });

  return user;
}

export async function authenticateUser(input: LoginRequest) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    // Deliberately identical error/timing shape to "wrong password" —
    // never reveal whether the email exists.
    throw new AuthError('Invalid email or password', 401);
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new AuthError('Invalid email or password', 401);
  }

  return user;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES_IN });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, config.JWT_SECRET) as AuthTokenPayload;
}
