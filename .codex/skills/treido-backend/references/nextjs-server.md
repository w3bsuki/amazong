# Next.js Server (Backend Lane)

This doc covers server actions + route handlers as they exist in Treido (Next.js 16 App Router).

## 1) Contracts first (inputs/outputs/errors)

For every server entrypoint, define:

- input shape (parse + validate)
- auth requirements (anon vs authenticated)
- side effects (DB writes, Stripe calls)
- error behavior (status codes, user-facing messaging)

Rule: **never trust request input**.

## 2) Route handlers

Patterns:

- parse JSON once, validate it (Zod)
- return explicit status codes
- don’t leak secrets/PII in errors or logs

Smells:

- `req.json()` without validation
- logging request headers/cookies
- returning raw Supabase errors directly to clients

## 3) Server actions

Patterns:

- validate inputs at the boundary
- return a typed result (`{ ok: true, data } | { ok: false, error }`)
- keep actions thin; push pure logic into `lib/*` for testability

## 4) Cached server code rails

If you use cached server functions (`'use cache'`):

- always include `cacheLife()` + `cacheTag()`
- never call `cookies()` / `headers()` inside the cached function
- read request data outside the cached boundary and pass it in

This prevents personalized data being cached globally.

## 5) Logging policy (backend)

- no secrets/PII in logs (tokens, cookies, full headers, emails, addresses)
- use structured logs when possible
- redact aggressively

## 6) Verification

Always after backend changes:

```bash
pnpm -s typecheck
pnpm -s lint
```

If auth/checkout/payments/webhooks are involved:

```bash
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

