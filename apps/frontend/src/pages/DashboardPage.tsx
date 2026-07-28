import { useEffect, useMemo, useState } from 'react';
import { api, type Challenge } from '../lib/api';
import { ChallengeCard } from '../components/ChallengeCard';
import { OwaspCoverageChart } from '../components/OwaspCoverageChart';
import { TerminalPreview } from '../components/TerminalPreview';

const DEMO_TERMINAL_LINES = [
  { prompt: true, text: "curl http://target/profile/4 -H 'Cookie: session=alice'" },
  { text: '{"id":4,"username":"alice","notes":"remember to renew gym membership"}', delay: 700 },
  { prompt: true, text: "curl http://target/profile/5 -H 'Cookie: session=alice'", delay: 900 },
  {
    text: '{"id":5,"username":"bob","notes":"flag: VULNFORGE{idor_1s_ju5t_...}"}',
    delay: 700,
  },
  { prompt: true, text: 'echo "no ownership check on :id — IDOR confirmed"', delay: 900 },
];

export function DashboardPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  useEffect(() => {
    api.challenges
      .list()
      .then(setChallenges)
      .catch(() => setError('Could not load challenges. Is the API running?'))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(challenges.map((c) => c.category))),
    [challenges],
  );
  const difficulties = useMemo(
    () => Array.from(new Set(challenges.map((c) => c.difficulty))),
    [challenges],
  );
  const owaspCategoryCount = useMemo(() => {
    const codes = new Set<string>();
    challenges.forEach((c) => c.owaspMapping.forEach((m) => codes.add(m.split(':')[0] ?? m)));
    return codes.size;
  }, [challenges]);

  const filtered = challenges.filter(
    (c) =>
      (categoryFilter === 'all' || c.category === categoryFilter) &&
      (difficultyFilter === 'all' || c.difficulty === difficultyFilter),
  );

  const solvedCount = challenges.filter((c) => c.solved).length;

  return (
    <div>
      {/* Hero */}
      <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-xl border border-void-border bg-gradient-to-br from-void-surface to-void p-8 lg:col-span-3">
          <h1 className="font-mono text-3xl font-bold tracking-tight text-ink">
            Learn security by <span className="text-signal">breaking things.</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-muted">
            Hands-on, self-hosted vulnerability training. Every challenge maps to a real OWASP
            category, walks you through exploiting it, then patching it yourself.
          </p>

          {challenges.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat label="challenges" value={challenges.length} />
              <Stat label="OWASP categories" value={`${owaspCategoryCount}/10`} />
              <Stat label="you've solved" value={solvedCount} accent />
              <Stat label="modes per challenge" value={3} />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <TerminalPreview lines={DEMO_TERMINAL_LINES} />
        </div>
      </div>

      {challenges.length > 0 && (
        <div className="mb-8">
          <OwaspCoverageChart challenges={challenges} />
        </div>
      )}

      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="font-mono text-xl text-ink">Challenges</h2>
          <p className="mt-1 text-sm text-ink-muted">
            {challenges.length > 0
              ? `${solvedCount} / ${challenges.length} solved`
              : 'Building your training path.'}
          </p>
        </div>
      </div>

      {challenges.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-3 font-mono text-xs">
          <FilterSelect
            label="category"
            value={categoryFilter}
            options={categories}
            onChange={setCategoryFilter}
          />
          <FilterSelect
            label="difficulty"
            value={difficultyFilter}
            options={difficulties}
            onChange={setDifficultyFilter}
          />
        </div>
      )}

      {loading && <p className="font-mono text-sm text-ink-muted">Loading challenges…</p>}

      {error && (
        <p role="alert" className="font-mono text-sm text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-lg border border-void-border bg-void-surface p-8 text-center">
          <p className="font-mono text-ink-muted">
            {challenges.length === 0
              ? 'No challenges loaded yet. Add one to challenges/ and restart the API.'
              : 'No challenges match these filters.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((challenge) => (
          <ChallengeCard key={challenge.slug} challenge={challenge} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div>
      <div className={`font-mono text-2xl font-bold ${accent ? 'text-signal' : 'text-ink'}`}>
        {value}
      </div>
      <div className="font-mono text-xs uppercase tracking-wide text-ink-muted">{label}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2">
      <span className="uppercase tracking-wide text-ink-muted">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded border border-void-border bg-void-surface px-2 py-1 text-ink outline-none focus:border-signal"
      >
        <option value="all">all</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
