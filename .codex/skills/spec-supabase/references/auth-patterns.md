# Auth Patterns (Next.js 16 + Supabase via @supabase/ssr)

Treido uses `@supabase/ssr` with different clients depending on context.

SSOT:
- `.codex/project/ARCHITECTURE.md`
- `lib/supabase/server.ts`
- `lib/supabase/client.ts`

## Client Selection Matrix (Audit Targets)

### Server Components / Server Actions

Use:
- `lib/supabase/server.ts:createClient()`

Notes:
- uses `cookies()` from `next/headers` to bind session
- not safe inside cached (`"use cache"`) functions (request-specific)

### Cached/public reads (Cache Components)

Use:
- `lib/supabase/server.ts:createStaticClient()`

Notes:
- does not use cookies
- safe to use inside cached functions

### Route Handlers (`app/api/**`)

Use:
- `lib/supabase/server.ts:createRouteHandlerClient(request)`

Why:
- In Cache Components mode, `cookies()` can reject during prerender.
- Route handlers should read cookies from the incoming request and apply set-cookies to the response.

### Browser (Client Components)

Use:
- `lib/supabase/client.ts:createClient()` (singleton)

Audit for:
- creating new browser clients per render (wasteful)
- calling browser client from server modules (boundary violation)

### Admin / Service Role

Use:
- `lib/supabase/server.ts:createAdminClient()`

Audit for:
- any reference to `SUPABASE_SERVICE_ROLE_KEY` outside server-only modules
- `createAdminClient()` used without explicit authorization checks

## Cache Components + Auth (High-risk interaction)

Audit for:
- user-specific reads accidentally placed behind `"use cache"`
- any cached function calling `createClient()` (cookie/session dependent)
- any cached function reading `cookies()` / `headers()`

Fix patterns:
- split into:
  - cached public read (static client)
  - uncached personalized read (cookie-bound client)

## Session Validation

For security-sensitive operations:
- validate session claims on the server, do not trust the client UI state

Audit for:
- server actions/route handlers that assume a user id from input
- missing checks before `createAdminClient()` usage

