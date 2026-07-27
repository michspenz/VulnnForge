import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register(email, username, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="mb-1 font-mono text-2xl text-ink">Create an account</h1>
      <p className="mb-6 text-sm text-ink-muted">Track progress across every challenge.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
            Username
          </span>
          <input
            type="text"
            required
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="rounded border border-void-border bg-void px-3 py-2 text-ink outline-none focus:border-signal"
          />
        </label>

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
            minLength={10}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-void-border bg-void px-3 py-2 text-ink outline-none focus:border-signal"
          />
          <span className="text-xs text-ink-muted">At least 10 characters.</span>
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
          {submitting ? 'creating account…' : 'create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink-muted">
        Already registered?{' '}
        <Link to="/login" className="text-signal hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
