# Write-up: SSRF: Internal Image Fetcher

## Overview of the fix

An 'import profile picture from URL' feature fetches whatever URL you provide, server-side, and displays the result. Find a URL that makes the server reach an internal service it was never meant to expose to you.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
