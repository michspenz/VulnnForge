import { type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-void">
      <nav className="border-b border-void-border bg-void-surface/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="font-mono text-lg font-bold tracking-tight text-ink">
              <span className="text-signal">Vuln</span>Forge
            </span>
            {user && (
              <span className="hidden font-mono text-xs text-ink-muted sm:inline">
                {user.username}@vulnforge:~$<span className="ml-1 animate-pulse text-signal">_</span>
              </span>
            )}
          </Link>

          <div className="flex items-center gap-4 font-mono text-sm">
            <Link to="/" className="text-ink-muted transition hover:text-ink">
              challenges
            </Link>
            <Link to="/leaderboard" className="text-ink-muted transition hover:text-ink">
              leaderboard
            </Link>
            {user ? (
              <button
                onClick={handleLogout}
                className="text-ink-muted transition hover:text-breach"
              >
                logout
              </button>
            ) : (
              <>
                <Link to="/login" className="text-ink-muted transition hover:text-ink">
                  login
                </Link>
                <Link
                  to="/register"
                  className="rounded border border-signal/40 bg-signal/10 px-3 py-1 text-signal transition hover:bg-signal/20"
                >
                  register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
