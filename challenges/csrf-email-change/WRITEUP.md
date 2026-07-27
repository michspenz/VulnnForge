# Write-up: CSRF: Unauthorized Email Change

## Overview of the fix

The account settings page lets a logged-in user change their email address. The endpoint trusts the session cookie alone with no CSRF token check. Build a proof-of-concept page that changes another logged-in user's email without their knowledge.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
