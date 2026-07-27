# Write-up: Reflected XSS: Search Page

## Overview of the fix

A search page reflects your query term back onto the results page without escaping it. Craft an input that causes arbitrary JavaScript to execute in your own browser when the page reflects it back.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
