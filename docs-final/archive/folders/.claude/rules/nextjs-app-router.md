---
paths: app/**/*.{ts,tsx}, next.config.ts
---

# Next.js 16 App Router

## Non-negotiables

- App Router code lives under `app/`
- Localized routing: `app/[locale]/...` (next-intl)
- Default to **Server Components**; `'use client'` only when required
- Route-owned UI: `app/[locale]/.../_components/`; shared UI: `components/*`
- Keep secrets **server-only**

## Entrypoint Types

- **Page**: `app/[locale]/.../page.tsx`
- **Layout**: `app/[locale]/.../layout.tsx`
- **Route handler**: `app/[locale]/.../route.ts`
- **Server actions**: `app/[locale]/actions/` (shared) or route-local `_actions/`

## Server vs Client Boundaries

Server by default. Client only for:
- State/effects
- DOM APIs
- Event handlers
- Browser-only libraries

## Data + Side Effects

- Fetch on the server (Server Components) unless there's a clear client reason
- Mutations: **Server Actions** for UI-coupled writes; **Route Handlers** for webhooks/external

## Error/Not-Found UX

- Global: `app/global-error.tsx`, `app/global-not-found.tsx`
- Route-level `error.tsx`/`not-found.tsx` only for custom UX

## Caching

- Be explicit about dynamic behavior (auth/session pages are often dynamic)
- Avoid "works in dev, stale in prod" surprises
- Cache Components enabled; use `'use cache'` + `cacheLife()` + `cacheTag()`

## Verification

- Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- Build: `pnpm build` (after routing/data/config changes)
- E2E: `pnpm test:e2e` (after flow changes)

## Trigger Prompts

- "Add a new page under the sell flow"
- "Fix a route handler in app/**/route.ts"
- "Refactor client component to server component"
