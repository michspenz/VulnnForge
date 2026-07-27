# XXE: Document Parser

**Category:** xxe
**Difficulty:** Hard
**OWASP mapping:** A05:2021-Security Misconfiguration
**Estimated time:** 35 minutes

## Overview

A document-upload feature parses XML files you submit and echoes back a summary field. The parser has external entity resolution enabled. Craft an XML payload that makes the server read a local file on disk and leak its contents back to you.

## Learning objectives

- Understand how an XML parser configured to resolve external entities lets an attacker read arbitrary local files or reach internal network resources
- Practice crafting a malicious DOCTYPE/ENTITY declaration to exfiltrate a local file through the parsed output
- Understand the fix: disable external entity resolution and DTD processing entirely in the XML parser configuration

## Modes

- **Exploit** — find and demonstrate the vulnerability against the running app
- **Patch** — fix the vulnerable code yourself
- **Verify** — the automated test suite confirms your patch actually closes the gap

---
*The vulnerable app, patch scaffold, and automated tests for this challenge arrive in
Milestone 5, once the sandbox terminal service (M4.5) is in place to run it in isolation
per-user.*
