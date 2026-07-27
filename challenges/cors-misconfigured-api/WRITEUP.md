# Write-up: CORS Misconfiguration: Reflected Origin

## Overview of the fix

An internal API reflects whatever Origin header a request sends back as the Access-Control-Allow-Origin value, and sets Access-Control-Allow-Credentials: true. Build a proof-of-concept page hosted on a different origin that reads a logged-in victim's private data.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
