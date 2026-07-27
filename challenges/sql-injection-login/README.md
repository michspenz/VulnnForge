# SQL Injection: Login Bypass

**Category:** sqli
**Difficulty:** Beginner
**OWASP mapping:** A03:2021-Injection
**Estimated time:** 25 minutes

## Overview

A login form takes a username and password and builds a SQL query by directly concatenating your input into the query string. Find an input that makes the query always evaluate to true, letting you log in without knowing a valid password.

## Learning objectives

- Understand how unsanitized user input concatenated into a SQL query lets an attacker alter the query's logic
- Practice bypassing a login form using a classic SQL injection payload
- Understand the fix: parameterized queries / prepared statements, never string-concatenated SQL

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
