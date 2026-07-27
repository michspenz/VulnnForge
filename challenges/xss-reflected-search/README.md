# Reflected XSS: Search Page

**Category:** xss
**Difficulty:** Beginner
**OWASP mapping:** A03:2021-Injection
**Estimated time:** 20 minutes

## Overview

A search page reflects your query term back onto the results page without escaping it. Craft an input that causes arbitrary JavaScript to execute in your own browser when the page reflects it back.

## Learning objectives

- Understand how unescaped user input reflected back into HTML lets an attacker inject arbitrary script
- Practice crafting a payload that executes JavaScript in the victim's browser via a search query parameter
- Understand the fix: context-aware output encoding and a strict Content-Security-Policy

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
