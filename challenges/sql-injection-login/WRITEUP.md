# Write-up: SQL Injection: Login Bypass

## Overview of the fix

A login form takes a username and password and builds a SQL query by directly concatenating your input into the query string. Find an input that makes the query always evaluate to true, letting you log in without knowing a valid password.

Full step-by-step exploitation walkthrough and remediation guidance for this
challenge lands alongside its live sandboxed app in Milestone 5 — this
placeholder keeps the structure consistent across every challenge in the
meantime, matching the real write-up already written in full for the
idor-profile-viewer challenge.
