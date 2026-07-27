# Write-up: Unrestricted File Upload: Avatar Handler

## Overview of the fix

An avatar upload feature only validates that the filename ends in .jpg/.png — nothing about the actual file content, and uploads land in a publicly web-servable directory. Find a way to get server-side code to execute via this upload.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
