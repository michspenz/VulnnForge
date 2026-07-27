# IDOR: Profile Viewer

**Category:** IDOR (Insecure Direct Object Reference)
**Difficulty:** Beginner
**OWASP mapping:** A01:2021 — Broken Access Control
**Estimated time:** 20 minutes

## Overview

Insecure Direct Object Reference (IDOR) happens when an application exposes
a reference to an internal object — a database ID, a filename, a user
number — and lets a client control that reference without checking whether
the current user is actually *authorized* to access the object it points to.

Authentication answers "who are you?" Authorization answers "are you allowed
to do this?" IDOR is what happens when an app only ever asks the first
question.

## The scenario

This challenge is a small profile-viewing application. After logging in,
you can view your own profile at a URL like:

```
GET /profile/4
```

The number at the end identifies *which* profile to show. The app correctly
checks that you're logged in before showing anything — but it never checks
whether the profile you're asking for actually belongs to you.

## Your goal

Log in as the provided test account, then find a way to view another
user's private profile data — without their password. The flag will be
visible on that other user's profile page once you can reach it.

## A note on the MITRE ATT&CK mapping

You'll notice this challenge has no MITRE ATT&CK mapping listed. That's
deliberate, not an oversight: ATT&CK models adversary tactics/techniques
against enterprise infrastructure and doesn't map cleanly onto application-
layer logic flaws like IDOR. Rather than force a stretched mapping just to
fill the field, we're leaving it empty here and only populating it on
challenges where a genuine, defensible mapping exists.

## Modes

- **Exploit** — find and demonstrate the IDOR against the running app
- **Patch** — fix the vulnerable authorization check yourself
- **Verify** — the automated test suite confirms your patch actually closes
  the gap without breaking the legitimate case (a user viewing their *own*
  profile should still work)

---
*The vulnerable app, patch scaffold, and automated tests for this challenge
arrive in Milestone 5, once the sandbox terminal service (M4.5) is in place
to run it in isolation per-user.*
