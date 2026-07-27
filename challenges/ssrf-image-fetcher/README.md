# SSRF: Internal Image Fetcher

**Category:** ssrf
**Difficulty:** Medium
**OWASP mapping:** A10:2021-Server-Side Request Forgery
**Estimated time:** 30 minutes

## Overview

An 'import profile picture from URL' feature fetches whatever URL you provide, server-side, and displays the result. Find a URL that makes the server reach an internal service it was never meant to expose to you.

## Learning objectives

- Understand how a server-side 'fetch this URL for me' feature can be abused to reach internal-only services
- Practice pivoting an SSRF into reaching a metadata/internal endpoint not meant to be reachable from outside
- Understand the fix: allowlisting destination hosts, blocking internal IP ranges, and disabling redirects on the fetch

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
