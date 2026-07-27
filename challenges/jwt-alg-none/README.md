# Broken Auth: JWT alg=none

**Category:** jwt
**Difficulty:** Hard
**OWASP mapping:** A07:2021-Identification and Authentication Failures
**Estimated time:** 35 minutes

## Overview

This app authenticates using JWTs, and issues you a token with the role 'user'. The server-side verification logic has a flaw: it trusts the algorithm declared in the token's own header rather than enforcing one itself. Forge a token that grants you the 'admin' role.

## Learning objectives

- Understand how a JWT verification library that trusts the token's own 'alg' header can be tricked into skipping signature verification entirely
- Practice decoding, modifying, and re-encoding a JWT to escalate privileges without knowing the signing secret
- Understand the fix: the server must whitelist accepted algorithms itself, never trust the algorithm named in the token

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
