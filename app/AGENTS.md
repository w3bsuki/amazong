# app/ — Next.js App Router Rules

These rules apply to everything under `app/`.

## Root policy first

- Root `AGENTS.md` is the canonical source for non-negotiables.
- This file adds only `app/`-specific boundaries.

## App Router boundaries

- Route-private UI belongs in `app/**/_components/*`.
- Route-private server actions belong in `app/**/_actions/*` (or shared in `app/actions/*`).
- Do not import route-private code across route groups.

## Cached server code (security rules)

- If a function uses `'use cache'`: it must also use `cacheLife()` + `cacheTag()`, and must **not** call `cookies()` or `headers()`.
- Cached functions must not do user-specific reads. Prefer dynamic (uncached) code for user data.

## See SSOT

- `AGENTS.md` (root)
- `docs/AGENTS.md`
- `docs/03-ARCHITECTURE.md`
- `docs/05-ROUTES.md`
