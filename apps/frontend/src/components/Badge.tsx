const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'text-signal border-signal/40 bg-signal/10',
  easy: 'text-signal border-signal/40 bg-signal/10',
  medium: 'text-breach border-breach/40 bg-breach/10',
  hard: 'text-breach border-breach/40 bg-breach/10',
  insane: 'text-red-400 border-red-400/40 bg-red-400/10',
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const style = DIFFICULTY_STYLES[difficulty] ?? 'text-ink-muted border-void-border bg-void-surface';
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 font-mono text-xs uppercase tracking-wide ${style}`}
    >
      {difficulty}
    </span>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center rounded border border-void-border bg-void-surface px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-ink-muted">
      {category}
    </span>
  );
}
