# OS Command Injection: Network Diagnostic Tool

**Category:** command-injection
**Difficulty:** Medium
**OWASP mapping:** A03:2021-Injection
**Estimated time:** 30 minutes

## Overview

A network diagnostics page runs a ping command against whatever hostname you provide, server-side, by shelling out directly. Find an input that injects and executes an additional OS command of your choosing.

## Learning objectives

- Understand how a feature that shells out to a system command (like ping) with unsanitized user input lets an attacker inject arbitrary OS commands
- Practice using shell metacharacters to append your own command onto the intended one
- Understand the fix: avoid shelling out entirely where possible, and if unavoidable, use an allowlist of arguments plus a non-shell exec call rather than string concatenation

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
