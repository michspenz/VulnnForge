# Unrestricted File Upload: Avatar Handler

**Category:** file-upload
**Difficulty:** Hard
**OWASP mapping:** A05:2021-Security Misconfiguration
**Estimated time:** 40 minutes

## Overview

An avatar upload feature only validates that the filename ends in .jpg/.png — nothing about the actual file content, and uploads land in a publicly web-servable directory. Find a way to get server-side code to execute via this upload.

## Learning objectives

- Understand how an avatar upload feature that only checks the file extension (not real content type) lets an attacker upload executable server-side code
- Practice bypassing weak extension-based validation and getting a malicious file placed in a web-servable directory
- Understand the fix: validate actual file content/magic bytes, store uploads outside the web root, and never execute uploaded files as code

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
