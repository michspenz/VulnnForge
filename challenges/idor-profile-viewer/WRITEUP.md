# Write-up: IDOR — Profile Viewer

## Step-by-step exploitation

1. Log in with the provided test account and note your own profile URL,
   e.g. `GET /profile/4` — `4` is your user ID.
2. Try changing the ID in the URL to a neighboring number, e.g.
   `GET /profile/5`.
3. The application returns the profile data for user `5` — a completely
   different account — without any error, because the only check it
   performs is "is *someone* logged in," not "is *this* user allowed to
   see *this* profile."
4. The flag is visible in the private notes field of a profile belonging
   to a different user ID than your own.

That's the entire exploit. No special tools required — this is often true
of IDOR in the real world, which is part of why it's so commonly found and
so easy to miss during development.

## Why this happens

The vulnerable route handler looks roughly like this:

```
GET /profile/:id
  1. check: is there a valid session? (yes -> continue)
  2. fetch profile matching :id
  3. return it
```

Step 2 never asks "does `:id` belong to the session's user?" It trusts the
client-supplied identifier completely.

## The fix

```
GET /profile/:id
  1. check: is there a valid session? (yes -> continue)
  2. fetch profile matching :id
  3. check: does profile.ownerId === session.userId? (no -> 403 Forbidden)
  4. return it
```

The one added line — an object-level ownership check — closes the gap
entirely. This is the single most important habit for preventing IDOR:
**every** handler that fetches an object by client-supplied ID must verify
the current user is allowed to access that specific object, not just that
they're logged in at all.

## Defense in depth: indirect references

A complementary (not required, but valuable) mitigation is to never expose
raw database IDs to the client at all. Instead of `/profile/4`, use an
opaque, per-user, non-guessable reference (a UUID, or a signed/hashed
token) that only resolves to the correct object server-side. This doesn't
replace the authorization check above — it just makes IDs harder to guess
or enumerate as an extra layer.

## Common variations to watch for

- IDOR isn't limited to URL path parameters — the same flaw shows up in
  query strings, request bodies (`PATCH /orders {"orderId": 123}`), and
  even hidden form fields.
- "Sequential ID" IDOR (like this challenge) is the easiest to spot and
  automate against; IDOR using UUIDs is harder to enumerate but still
  vulnerable if the ownership check is missing — never assume an
  unguessable ID is a substitute for an actual authorization check.
