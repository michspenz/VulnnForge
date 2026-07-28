import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { challengeMetadataSchema, type ChallengeMetadata } from '@vulnforge/shared';
import { prisma } from '../../lib/prisma.js';

/**
 * Absolute path to the challenges/ directory. In Docker this is mounted
 * as a volume (see docker-compose.yml) so new challenges can be added
 * without rebuilding the api image — only a restart is needed to re-sync.
 */
const CHALLENGES_ROOT = path.resolve(process.cwd(), '../../challenges');

/**
 * In-memory cache of full challenge metadata, INCLUDING the flag.
 * This is deliberately never written to Postgres — see the comment on
 * the Challenge Prisma model. Rebuilt fresh from disk on every boot.
 */
const challengeCache = new Map<string, ChallengeMetadata>();

export function getChallengeFromCache(slug: string): ChallengeMetadata | undefined {
  return challengeCache.get(slug);
}

export function getAllCachedSlugs(): string[] {
  return Array.from(challengeCache.keys());
}

interface SyncResult {
  loaded: string[];
  failed: { dir: string; error: string }[];
}

/**
 * Scans every subdirectory of challenges/, validates its challenge.json,
 * and upserts the public-safe fields into Postgres. A single malformed
 * challenge logs a warning and is skipped — it must never take down API
 * boot, since that would mean one bad contributor PR breaks the whole
 * platform for everyone.
 */
export async function syncChallengesFromDisk(): Promise<SyncResult> {
  const result: SyncResult = { loaded: [], failed: [] };

  let entries: string[];
  try {
    entries = await readdir(CHALLENGES_ROOT, { withFileTypes: false });
  } catch (err) {
    console.warn(`⚠️  Could not read challenges directory at ${CHALLENGES_ROOT}:`, err);
    return result;
  }

  for (const dirName of entries) {
    const challengeJsonPath = path.join(CHALLENGES_ROOT, dirName, 'challenge.json');

    let raw: string;
    try {
      raw = await readFile(challengeJsonPath, 'utf-8');
    } catch {
      // Not every entry in challenges/ is necessarily a challenge folder
      // (e.g. .gitkeep) — silently skip anything without a challenge.json.
      continue;
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch (err) {
      result.failed.push({ dir: dirName, error: `Invalid JSON: ${(err as Error).message}` });
      continue;
    }

    const validation = challengeMetadataSchema.safeParse(parsedJson);
    if (!validation.success) {
      const issues = validation.error.issues.map(
        (i: { path: (string | number)[]; message: string }) => `${i.path.join('.')}: ${i.message}`,
      );
      result.failed.push({ dir: dirName, error: issues.join('; ') });
      continue;
    }

    const metadata = validation.data;

    if (metadata.slug !== dirName) {
      result.failed.push({
        dir: dirName,
        error: `slug "${metadata.slug}" does not match folder name "${dirName}"`,
      });
      continue;
    }

    challengeCache.set(metadata.slug, metadata);

    await prisma.challenge.upsert({
      where: { slug: metadata.slug },
      create: {
        slug: metadata.slug,
        name: metadata.name,
        category: metadata.category,
        difficulty: metadata.difficulty,
        owaspMapping: metadata.owaspMapping,
        mitreAttackMapping: metadata.mitreAttackMapping,
        estimatedMinutes: metadata.estimatedMinutes,
        description: metadata.description,
        learningObjectives: metadata.learningObjectives,
        hints: metadata.hints,
        writeUpPath: metadata.writeUpPath,
      },
      update: {
        name: metadata.name,
        category: metadata.category,
        difficulty: metadata.difficulty,
        owaspMapping: metadata.owaspMapping,
        mitreAttackMapping: metadata.mitreAttackMapping,
        estimatedMinutes: metadata.estimatedMinutes,
        description: metadata.description,
        learningObjectives: metadata.learningObjectives,
        hints: metadata.hints,
        writeUpPath: metadata.writeUpPath,
      },
    });

    result.loaded.push(metadata.slug);
  }

  if (result.failed.length > 0) {
    console.warn('⚠️  Some challenges failed to load:');
    for (const f of result.failed) {
      console.warn(`   - ${f.dir}: ${f.error}`);
    }
  }
  console.log(`✅ Loaded ${result.loaded.length} challenge(s): ${result.loaded.join(', ')}`);

  return result;
}
