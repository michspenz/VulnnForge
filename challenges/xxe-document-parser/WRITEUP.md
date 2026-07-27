# Write-up: XXE: Document Parser

## Overview of the fix

A document-upload feature parses XML files you submit and echoes back a summary field. The parser has external entity resolution enabled. Craft an XML payload that makes the server read a local file on disk and leak its contents back to you.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
