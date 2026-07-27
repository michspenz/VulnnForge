const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: 'include', // always send the httpOnly auth cookie
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const body = await res.json();
      if (typeof body?.error === 'string') message = body.error;
    } catch {
      // response wasn't JSON — keep the generic message
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role?: string;
}

export interface Challenge {
  slug: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'easy' | 'medium' | 'hard' | 'insane';
  owaspMapping: string[];
  mitreAttackMapping: string[];
  estimatedMinutes: number;
  points: number;
  description: string;
  learningObjectives: string[];
  hints: string[];
  writeUpPath: string;
  solved?: boolean;
}

export interface LeaderboardEntry {
  username: string;
  points: number;
  solvedCount: number;
}

export interface SubmissionResult {
  correct: boolean;
  pointsAwarded: number;
  alreadySolved: boolean;
}

export interface LeaderboardEntry {
  username: string;
  points: number;
  solvedCount: number;
}

export const api = {
  auth: {
    register: (input: { email: string; username: string; password: string }) =>
      request<AuthUser>('/api/auth/register', { method: 'POST', body: JSON.stringify(input) }),
    login: (input: { email: string; password: string }) =>
      request<AuthUser>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) }),
    logout: () => request<void>('/api/auth/logout', { method: 'POST' }),
    me: () => request<AuthUser>('/api/auth/me'),
  },
  challenges: {
    list: (filters?: { category?: string; difficulty?: string }) => {
      const params = new URLSearchParams();
      if (filters?.category) params.set('category', filters.category);
      if (filters?.difficulty) params.set('difficulty', filters.difficulty);
      const qs = params.toString();
      return request<Challenge[]>(`/api/challenges${qs ? `?${qs}` : ''}`);
    },
    get: (slug: string) => request<Challenge>(`/api/challenges/${slug}`),
    getWriteUp: (slug: string, reveal = false) =>
      fetch(`${API_BASE_URL}/api/challenges/${slug}/writeup${reveal ? '?reveal=true' : ''}`, {
        credentials: 'include',
      }),
  },
  submissions: {
    submit: (input: { challengeSlug: string; submittedFlag: string }) =>
      request<SubmissionResult>('/api/submissions', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
  },
  leaderboard: {
    list: () => request<LeaderboardEntry[]>('/api/leaderboard'),
  },
};
