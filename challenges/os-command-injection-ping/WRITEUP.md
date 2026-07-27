# Write-up: OS Command Injection: Network Diagnostic Tool

## Overview of the fix

A network diagnostics page runs a ping command against whatever hostname you provide, server-side, by shelling out directly. Find an input that injects and executes an additional OS command of your choosing.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
