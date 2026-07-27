import { Link } from 'react-router-dom';
import type { Challenge } from '../lib/api';
import { DifficultyBadge, CategoryBadge } from './Badge';

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const railColor = challenge.solved ? 'bg-signal' : 'bg-void-border';

  return (
    <Link
      to={`/challenges/${challenge.slug}`}
      className="group relative flex overflow-hidden rounded-lg border border-void-border bg-void-surface transition hover:border-signal/40"
    >
      <div className={`w-1 shrink-0 ${railColor}`} aria-hidden="true" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-mono text-base font-medium text-ink group-hover:text-signal">
            {challenge.name}
          </h3>
          {challenge.solved && (
            <span className="shrink-0 font-mono text-xs uppercase tracking-wide text-signal">
              ✓ solved
            </span>
          )}
        </div>

        <p className="line-clamp-2 text-sm text-ink-muted">{challenge.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <CategoryBadge category={challenge.category} />
          <span className="ml-auto font-mono text-xs text-ink-muted">
            {challenge.estimatedMinutes}m · {challenge.points}pts
          </span>
        </div>
      </div>
    </Link>
  );
}
