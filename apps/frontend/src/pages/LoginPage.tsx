import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 font-mono text-2xl text-ink">Log in</h1>
      <p className="mb-6 text-sm text-ink-muted">Pick up where you left off.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-void-border bg-void px-3 py-2 text-ink outline-none focus:border-signal"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
            Password
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-void-border bg-void px-3 py-2 text-ink outline-none focus:border-signal"
          />
        </label>

        {error && (
          <p role="alert" className="font-mono text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded border border-signal/40 bg-signal/10 py-2 font-mono text-signal transition hover:bg-signal/20 disabled:opacity-50"
        >
          {submitting ? 'logging in…' : 'log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-muted">
        No account?{' '}
        <Link to="/register" className="text-signal hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
