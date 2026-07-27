# VulnForge

A modern, modular, open-source platform for learning, practicing, exploiting,
fixing, and understanding real-world web application vulnerabilities.


## Vision

VulnForge combines the training format of PortSwigger Web Security Academy and
HTB Academy with the self-hosted, open-source spirit of OWASP Juice Shop and
DVWA — but built as a reusable **platform**, not a fixed set of vulnerable
apps. Every vulnerability is a plugin that snaps into the same challenge
engine, and every challenge supports three modes: **Exploit**, **Patch**, and
**Verify**.


## Local development (VS Code + Docker)

This project is built and run entirely locally, no cloud services required.

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


