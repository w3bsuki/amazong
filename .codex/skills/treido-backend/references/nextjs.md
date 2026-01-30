# Next.js / App Router (Treido Deltas)

This is not a full Next.js guide. It captures Treido-specific rules and sharp edges that repeatedly cause regressions.

## Routing + Boundaries

- Route groups live under `app/[locale]/(group)/*`.
- Route-private code must stay private:
  - `app/[locale]/(group)/**/_components/*`
  - `app/[locale]/(group)/**/_actions/*`
  - `app/[locale]/(group)/**/_lib/*`
- If route-private code is needed elsewhere, move it to `components/shared/*` or `lib/*` (whichever matches boundaries).

## Server vs Client Components

- Default to Server Components.
- Add `"use client"` only when required (events, state, browser APIs).
- Keep client boundaries small (prefer a small client wrapper inside a server page rather than making the whole page client).

## Cached Server Code Rails

- If a function/module is cached (`'use cache'`), it must:
  - use `cacheLife()` + `cacheTag()`
  - NOT call `cookies()` or `headers()` inside the cached function
- Read cookies/headers outside the cached boundary and pass values in.

## Middleware / Proxy

- Treido uses `proxy.ts` as the Next.js middleware entrypoint (renamed from `middleware.ts`).
- It handles i18n routing (`next-intl`), geo cookies, and Supabase session updates.
- Be careful adding work here: middleware runs on every matching request.

## i18n (next-intl)

- All user-facing strings must come from translations:
  - `messages/en.json`
  - `messages/bg.json`
- Avoid hardcoded strings in components/pages.

## Practical Verification

Always run:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

If routes/auth/checkout were touched:

```bash
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```
