# CSRF: Unauthorized Email Change

**Category:** csrf
**Difficulty:** Medium
**OWASP mapping:** A01:2021-Broken Access Control
**Estimated time:** 25 minutes

## Overview

The account settings page lets a logged-in user change their email address. The endpoint trusts the session cookie alone with no CSRF token check. Build a proof-of-concept page that changes another logged-in user's email without their knowledge.

## Learning objectives

- Understand how a state-changing endpoint with no CSRF token lets an attacker forge a request on a logged-in victim's behalf
- Practice building an auto-submitting HTML form that performs the forged request
- Understand the fix: CSRF tokens, SameSite cookies, and origin/referer validation on state-changing requests

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
