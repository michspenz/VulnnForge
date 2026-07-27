# VulnForge

A modern, modular, open-source platform for learning, practicing, exploiting,
fixing, and understanding real-world web application vulnerabilities.

> **Status:** Milestone 0 — platform scaffolding. Not yet functional.

## Vision

VulnForge combines the training format of PortSwigger Web Security Academy and
HTB Academy with the self-hosted, open-source spirit of OWASP Juice Shop and
DVWA — but built as a reusable **platform**, not a fixed set of vulnerable
apps. Every vulnerability is a plugin that snaps into the same challenge
engine, and every challenge supports three modes: **Exploit**, **Patch**, and
**Verify**.

## Stack

| Layer      | Choice                                   |
| ---------- | ----------------------------------------- |
| Frontend   | React + TypeScript + Vite + TailwindCSS   |
| Backend    | Node.js + Express                         |
| Database   | PostgreSQL + Prisma                       |
| Infra      | Docker + Docker Compose                   |
| Testing    | Vitest + Playwright                       |

## Repository layout

```
apps/
  frontend/     React SPA
  api/          Express API
packages/
  shared/       Zod schemas & types shared between frontend and api
challenges/     One directory per vulnerability module (empty until M5)
docs/           Architecture docs, challenge authoring guide
docker/         Dockerfiles
.github/        CI workflows
```

## Local development (VS Code + Docker)

This project is built and run entirely locally — no cloud services required.

1. Install the recommended VS Code extensions when prompted (or via
   `.vscode/extensions.json`).
2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
3. Start everything:
   ```bash
   docker compose up --build
   ```
4. Frontend: http://localhost:5173 — API health check: http://localhost:4000/health

## Roadmap

- **v0.1** — Platform foundation: auth, dashboard, challenge browser, progress
  tracking, flag submission, scoring. One challenge (IDOR) to prove the
  architecture.
- **v0.5** — 10 vulnerability modules (IDOR, SQLi, XSS, CSRF, SSRF, JWT, XXE,
  CORS, file upload, command injection).
- **v1.0** — 25+ modules, community challenge support, plugin architecture,
  documentation site, CI/CD, contribution guide.

## Contributing

Contribution guide arrives alongside the v1.0 plugin architecture. Until
then, this is being built milestone-by-milestone — see `docs/` for
architecture notes as they land.
