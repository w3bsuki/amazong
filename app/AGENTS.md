# app/ — Next.js App Router Rules

These rules apply to everything under `app/`.

## Non‑negotiables

- Default to **Server Components**; add `"use client"` only when required (hooks, event handlers, browser APIs).
- All user-facing strings must use `next-intl` message keys (no hardcoded copy).
- Tailwind v4 rails only: **no gradients, no arbitrary values, no palette classes, no hardcoded colors**.

## App Router boundaries

- Route-private UI belongs in `app/**/_components/*`.
- Route-private server actions belong in `app/**/_actions/*` (or shared in `app/actions/*`).
- Do not import route-private code across route groups.

## Cached server code (security rules)

- If a function uses `'use cache'`: it must also use `cacheLife()` + `cacheTag()`, and must **not** call `cookies()` or `headers()`.
- Cached functions must not do user-specific reads. Prefer dynamic (uncached) code for user data.

## See SSOT

- `docs/AGENTS.md`
- `docs/03-ARCHITECTURE.md`
- `docs/05-ROUTES.md`
- `docs/10-I18N.md`

