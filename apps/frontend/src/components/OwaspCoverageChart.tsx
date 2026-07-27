import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Challenge } from '../lib/api';

const OWASP_ORDER = [
  'A01', 'A02', 'A03', 'A04', 'A05', 'A06', 'A07', 'A08', 'A09', 'A10',
];

export function OwaspCoverageChart({ challenges }: { challenges: Challenge[] }) {
  const counts = new Map<string, number>();
  for (const c of challenges) {
    for (const mapping of c.owaspMapping) {
      const code = mapping.split(':')[0];
      counts.set(code, (counts.get(code) ?? 0) + 1);
    }
  }

  const data = OWASP_ORDER.map((code) => ({
    code,
    count: counts.get(code) ?? 0,
  }));

  return (
    <div className="rounded-lg border border-void-border bg-void-surface p-4">
      <h3 className="mb-3 font-mono text-xs uppercase tracking-wide text-ink-muted">
        OWASP Top 10 coverage
      </h3>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="code"
            tick={{ fill: '#6B8078', fontFamily: 'JetBrains Mono', fontSize: 11 }}
            axisLine={{ stroke: '#1E2A2D' }}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#6B8078', fontFamily: 'JetBrains Mono', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={20}
          />
          <Tooltip
            cursor={{ fill: '#1E2A2D', opacity: 0.5 }}
            contentStyle={{
              background: '#0A0E0F',
              border: '1px solid #1E2A2D',
              borderRadius: 6,
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
            }}
            labelStyle={{ color: '#E4EDEB' }}
            itemStyle={{ color: '#00E28A' }}
          />
          <Bar dataKey="count" radius={[3, 3, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.code} fill={d.count > 0 ? '#00E28A' : '#1E2A2D'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
