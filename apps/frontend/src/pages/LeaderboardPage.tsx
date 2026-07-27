import { useEffect, useState } from 'react';
import { api, type LeaderboardEntry } from '../lib/api';

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.leaderboard
      .list()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 font-mono text-2xl text-ink">Leaderboard</h1>
      <p className="mb-6 text-sm text-ink-muted">Ranked by total points across solved challenges.</p>

      {loading && <p className="font-mono text-sm text-ink-muted">Loading…</p>}

      {!loading && entries.length === 0 && (
        <div className="rounded-lg border border-void-border bg-void-surface p-8 text-center">
          <p className="font-mono text-ink-muted">No solves yet — be the first.</p>
        </div>
      )}

      {entries.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-void-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-void-border bg-void-surface font-mono text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2 text-right">Solved</th>
                <th className="px-4 py-2 text-right">Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr
                  key={entry.username}
                  className="border-b border-void-border bg-void-surface/40 last:border-0"
                >
                  <td className="px-4 py-3 font-mono text-sm text-ink-muted">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-ink">{entry.username}</td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-ink-muted">
                    {entry.solvedCount}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-signal">
                    {entry.points}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
