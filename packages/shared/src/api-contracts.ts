import { z } from 'zod';

export const registerRequestSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32),
  password: z.string().min(10),
});
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const flagSubmissionRequestSchema = z.object({
  challengeSlug: z.string().min(1),
  submittedFlag: z.string().min(1),
});
export type FlagSubmissionRequest = z.infer<typeof flagSubmissionRequestSchema>;

export const flagSubmissionResponseSchema = z.object({
  correct: z.boolean(),
  pointsAwarded: z.number().int().nonnegative(),
  alreadySolved: z.boolean(),
});
export type FlagSubmissionResponse = z.infer<typeof flagSubmissionResponseSchema>;
