import { z } from 'zod';

/**
 * OWASP Top 10 (2021) categories a challenge can map to.
 * Extend this list as new categories are needed — keep it a closed enum
 * so authoring mistakes are caught at parse time, not at render time.
 */
export const owaspCategorySchema = z.enum([
  'A01:2021-Broken Access Control',
  'A02:2021-Cryptographic Failures',
  'A03:2021-Injection',
  'A04:2021-Insecure Design',
  'A05:2021-Security Misconfiguration',
  'A06:2021-Vulnerable and Outdated Components',
  'A07:2021-Identification and Authentication Failures',
  'A08:2021-Software and Data Integrity Failures',
  'A09:2021-Security Logging and Monitoring Failures',
  'A10:2021-Server-Side Request Forgery',
]);

export const difficultySchema = z.enum(['beginner', 'easy', 'medium', 'hard', 'insane']);

/**
 * The contract every challenges/<name>/challenge.json file must satisfy.
 * Both the API (loading challenges at boot) and any future authoring CLI
 * validate against this same schema — one source of truth.
 */
export const challengeMetadataSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase, alphanumeric, and hyphen-separated'),
  name: z.string().min(1),
  category: z.string().min(1), // e.g. "idor", "xss" — maps to challenges/<category>/
  difficulty: difficultySchema,
  owaspMapping: z.array(owaspCategorySchema).min(1),
  mitreAttackMapping: z.array(z.string()).default([]),
  // The flag is stored here for authoring convenience but MUST be excluded
  // from any API response reachable by the frontend before solve-time —
  // see apps/api challenge-loader for the redaction step.
  flag: z.string().min(1),
  estimatedMinutes: z.number().int().positive(),
  learningObjectives: z.array(z.string()).min(1),
  description: z.string().min(1),
  // Progressive hints, revealed one at a time in the UI — never all at
  // once, so the challenge stays educational rather than a walkthrough.
  hints: z.array(z.string()).default([]),
  // Path (relative to the challenge folder) to the markdown write-up —
  // the full walkthrough + fix, distinct from solution/ which holds the
  // raw exploit script. Rendered as prose in the UI, not shown as code.
  writeUpPath: z.string().default('WRITEUP.md'),
});

export type ChallengeMetadata = z.infer<typeof challengeMetadataSchema>;

// A version of the metadata that is safe to send to the client — flag stripped.
export type PublicChallengeMetadata = Omit<ChallengeMetadata, 'flag'>;

export function toPublicChallengeMetadata(meta: ChallengeMetadata): PublicChallengeMetadata {
  const { flag: _flag, ...rest } = meta;
  return rest;
}
