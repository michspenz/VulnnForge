# Write-up: Broken Auth: JWT alg=none

## Overview of the fix

This app authenticates using JWTs, and issues you a token with the role 'user'. The server-side verification logic has a flaw: it trusts the algorithm declared in the token's own header rather than enforcing one itself. Forge a token that grants you the 'admin' role.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
