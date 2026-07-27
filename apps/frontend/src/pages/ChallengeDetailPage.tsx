import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { api, ApiError, type Challenge } from '../lib/api';
import { DifficultyBadge, CategoryBadge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';

export function ChallengeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [revealedHints, setRevealedHints] = useState(0);

  const [flagInput, setFlagInput] = useState('');
  const [submitResult, setSubmitResult] = useState<{ correct: boolean; message: string } | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  const [writeUp, setWriteUp] = useState<string | null>(null);
  const [writeUpLocked, setWriteUpLocked] = useState(false);
  const [loadingWriteUp, setLoadingWriteUp] = useState(false);

  useEffect(() => {
    if (!slug) return;
    api.challenges
      .get(slug)
      .then(setChallenge)
      .catch(() => setNotFound(true));
  }, [slug]);

  async function handleSubmitFlag(e: FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const result = await api.submissions.submit({
        challengeSlug: slug,
        submittedFlag: flagInput,
      });
      if (result.correct) {
        setSubmitResult({
          correct: true,
          message: result.alreadySolved
            ? 'Correct — already solved earlier, no new points awarded.'
            : `Correct! +${result.pointsAwarded} points.`,
        });
        setChallenge((prev) => (prev ? { ...prev, solved: true } : prev));
        if (!result.alreadySolved) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00E28A', '#FF9F1C', '#E4EDEB'],
          });
        }
      } else {
        setSubmitResult({ correct: false, message: 'Not quite — that flag is incorrect.' });
      }
    } catch (err) {
      setSubmitResult({
        correct: false,
        message: err instanceof ApiError ? err.message : 'Something went wrong.',
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function loadWriteUp(reveal: boolean) {
    if (!slug) return;
    setLoadingWriteUp(true);
    setWriteUpLocked(false);
    try {
      const res = await api.challenges.getWriteUp(slug, reveal);
      if (res.status === 403) {
        setWriteUpLocked(true);
      } else if (res.ok) {
        setWriteUp(await res.text());
      }
    } finally {
      setLoadingWriteUp(false);
    }
  }

  if (notFound) {
    return (
      <div className="rounded-lg border border-void-border bg-void-surface p-8 text-center">
        <p className="font-mono text-ink-muted">Challenge not found.</p>
        <Link to="/" className="mt-3 inline-block text-signal hover:underline">
          Back to challenges
        </Link>
      </div>
    );
  }

  if (!challenge) {
    return <p className="font-mono text-sm text-ink-muted">Loading…</p>;
  }

  const hints = challenge.hints ?? [];

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/" className="font-mono text-sm text-ink-muted hover:text-ink">
        ← back to challenges
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h1 className="font-mono text-2xl text-ink">{challenge.name}</h1>
        {challenge.solved && (
          <span className="font-mono text-xs uppercase tracking-wide text-signal">✓ solved</span>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <DifficultyBadge difficulty={challenge.difficulty} />
        <CategoryBadge category={challenge.category} />
        <span className="font-mono text-xs text-ink-muted">
          {challenge.estimatedMinutes}m · {challenge.points}pts
        </span>
      </div>

      <Section title="Overview">
        <p className="text-ink">{challenge.description}</p>
        <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-ink-muted">
          {challenge.learningObjectives.map((obj, i) => (
            <li key={i}>{obj}</li>
          ))}
        </ul>
      </Section>

      <Section title="Practical Lab">
        <div className="rounded-lg border border-dashed border-void-border bg-void p-6 text-center">
          <p className="font-mono text-sm text-ink-muted">
            The live sandboxed environment for this challenge isn't wired up yet — it arrives
            once the isolated per-user terminal service (Milestone 4.5) is in place.
          </p>
        </div>

        {user ? (
          <form onSubmit={handleSubmitFlag} className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="VULNFORGE{...}"
              value={flagInput}
              onChange={(e) => setFlagInput(e.target.value)}
              className="flex-1 rounded border border-void-border bg-void px-3 py-2 font-mono text-sm text-ink outline-none focus:border-signal"
            />
            <button
              type="submit"
              disabled={submitting || !flagInput}
              className="rounded border border-signal/40 bg-signal/10 px-4 py-2 font-mono text-sm text-signal transition hover:bg-signal/20 disabled:opacity-50"
            >
              submit
            </button>
          </form>
        ) : (
          <p className="mt-4 font-mono text-sm text-ink-muted">
            <Link to="/login" className="text-signal hover:underline">
              Log in
            </Link>{' '}
            to submit a flag.
          </p>
        )}
        {submitResult && (
          <p
            role="alert"
            className={`mt-3 font-mono text-sm ${submitResult.correct ? 'text-signal' : 'text-breach'}`}
          >
            {submitResult.message}
          </p>
        )}
      </Section>

      <Section title="Hints">
        {hints.length === 0 ? (
          <p className="text-sm text-ink-muted">No hints for this one — you've got this.</p>
        ) : (
          <div className="space-y-2">
            {hints.slice(0, revealedHints).map((hint, i) => (
              <div
                key={i}
                className="rounded-lg border border-void-border bg-void-surface p-3 text-sm text-ink"
              >
                <span className="mr-2 font-mono text-xs text-breach">HINT {i + 1}</span>
                {hint}
              </div>
            ))}
            {revealedHints < hints.length && (
              <button
                onClick={() => setRevealedHints(revealedHints + 1)}
                className="font-mono text-sm text-breach hover:underline"
              >
                Reveal hint {revealedHints + 1} of {hints.length} →
              </button>
            )}
          </div>
        )}
      </Section>

      <Section title="Write-up">
        {!writeUp && !writeUpLocked && (
          <button
            onClick={() => loadWriteUp(false)}
            disabled={loadingWriteUp}
            className="rounded border border-void-border bg-void-surface px-4 py-2 font-mono text-sm text-ink-muted transition hover:text-ink disabled:opacity-50"
          >
            {loadingWriteUp ? 'loading…' : 'view write-up'}
          </button>
        )}

        {writeUpLocked && (
          <div className="rounded-lg border border-void-border bg-void-surface p-4">
            <p className="text-sm text-ink-muted">
              The full write-up unlocks automatically once you solve this challenge.
            </p>
            <button
              onClick={() => loadWriteUp(true)}
              className="mt-2 font-mono text-sm text-breach hover:underline"
            >
              Or give up and reveal it now →
            </button>
          </div>
        )}

        {writeUp && (
          <pre className="whitespace-pre-wrap rounded-lg border border-void-border bg-void-surface p-4 font-sans text-sm leading-relaxed text-ink">
            {writeUp}
          </pre>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-mono text-sm uppercase tracking-wide text-ink-muted">{title}</h2>
      {children}
    </section>
  );
}
