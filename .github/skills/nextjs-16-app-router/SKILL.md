---
name: nextjs-16-app-router
description: Implement or refactor Next.js 16 App Router behavior in this repo (routes/layouts, server actions, route handlers, metadata, caching boundaries). Use when working under `app/` (especially `app/[locale]/...`), adding pages/routes, or debugging App Router routing/rendering.
---

# Next.js 16 App Router (Repo Playbook)

## Non-negotiables for this repo

- App Router code lives under `app/`.
- Localized routing uses `app/[locale]/...` (next-intl).
- Default to Server Components; add `'use client'` only when required.
- Follow `STRUCTURE.md` ownership: route-owned UI in `app/[locale]/.../_components/`, shared UI in `components/*`.
- Keep secrets server-only (server components, route handlers, server actions).

## Workflow

1. Decide the entrypoint type
   - Page: `app/[locale]/.../page.tsx`
   - Layout: `app/[locale]/.../layout.tsx`
   - Route handler: `app/[locale]/.../route.ts`
   - Server actions: `app/[locale]/actions/` (shared) or route-local `_actions/` (route-owned)

2. Decide Server vs Client component boundaries
   - Server by default.
   - Client only for: state/effects, DOM APIs, event handlers, certain libraries that require the browser.

3. Data + side effects
   - Fetch on the server (Server Components) unless there’s a clear reason to fetch on the client.
   - Mutations: prefer Server Actions for UI-coupled writes; prefer route handlers for public endpoints (webhooks, external clients).

4. Error and not-found UX
   - Default to global boundaries: `app/global-error.tsx`, `app/global-not-found.tsx`.
   - Add route-level `error.tsx` / `not-found.tsx` only when the route needs custom UX.

5. Caching expectations (high level)
   - Be explicit about dynamic behavior when needed (auth/session dependent pages often must be dynamic).
   - Avoid accidental “works in dev, stale in prod” by clarifying whether data is cacheable.

## Verification

- Typecheck (when requested or before you call the task done): `pnpm -s exec tsc -p tsconfig.json --noEmit --pretty false`
- Build (when you changed routing/data fetching or Next config): `pnpm build`
- E2E (when flows change): `pnpm test:e2e`

## Examples

- “Add a new page under the sell flow and wire up server actions.”
- “Fix a Next.js route handler in `app/**/route.ts`.”
- “Refactor a client component to a server component where possible.”
