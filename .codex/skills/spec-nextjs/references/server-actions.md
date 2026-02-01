# Server Actions vs Route Handlers

Treido prefers Server Actions for app mutations, and route handlers for:
- webhooks (Stripe)
- public API endpoints
- cases needing streaming or non-form HTTP semantics

## Server Actions (App Router)

Audit for:
- missing input validation
- missing auth/session checks
- returning untyped/ambiguous payloads (hard to handle on client)
- accidentally calling request-context APIs inside cached work

Recommended patterns:
- Validate inputs at the boundary (schema)
- Authorize on the server (never rely on the client)
- Return a small discriminated union:
  - `{ ok: true, data }` / `{ ok: false, error }`
- Invalidate cache tags at the end of successful mutations (consistent tag format)

Common pitfalls:
- A server action uses `createClient()` and is later called from cached code paths (should not happen).
- Action performs multiple DB writes without a transaction-like strategy (partial failures).
- Action returns raw Supabase errors to UI (leaks implementation detail).

## Route Handlers (`app/**/route.ts`)

Audit for:
- missing method guards (`GET` accidentally accepts `POST` work, etc.)
- missing signature verification (webhooks)
- unbounded request body logging
- incorrect caching behavior for APIs that should be dynamic

Recommended patterns:
- Validate method + content-type early
- Parse body once; handle errors deterministically
- Redact logs; never log full request bodies for auth/payment endpoints
- For webhooks: idempotency keys and safe retries

## Auth/session interactions

Audit for:
- user-specific reads being cached
- using the wrong Supabase client for the context (server vs route handler vs browser)

SSOT:
- `.codex/project/ARCHITECTURE.md` client selection matrix

