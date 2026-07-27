# CORS Misconfiguration: Reflected Origin

**Category:** cors
**Difficulty:** Medium
**OWASP mapping:** A05:2021-Security Misconfiguration
**Estimated time:** 25 minutes

## Overview

An internal API reflects whatever Origin header a request sends back as the Access-Control-Allow-Origin value, and sets Access-Control-Allow-Credentials: true. Build a proof-of-concept page hosted on a different origin that reads a logged-in victim's private data.

## Learning objectives

- Understand how a CORS policy that reflects any request's Origin header back with credentials allowed lets any website read another user's authenticated data
- Practice building a malicious page that uses fetch() with credentials to steal data cross-origin
- Understand the fix: an explicit allowlist of trusted origins, never a blanket reflection of the request's own Origin header

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
