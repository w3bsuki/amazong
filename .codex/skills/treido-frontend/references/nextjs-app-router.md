# Next.js 16 App Router (Frontend Lane)

This is the practical “how not to regress the app” guide for Treido’s frontend lane.

SSOT for product/system boundaries lives in `.codex/AGENTS.md` and `.codex/project/ARCHITECTURE.md`.

## 1) Server-first, tiny client islands

Default to Server Components. Make a component client only when you need:

- event handlers (`onClick`, `onChange`)
- React state/effects
- browser-only APIs (`window`, `localStorage`, `navigator`)

Preferred pattern:

- `page.tsx` stays server
- create a small `*.client.tsx` component for interactivity
- pass only serializable props (no functions, no class instances)

## 2) Route-private boundaries (Treido rule)

Inside a route group:

- `app/[locale]/(group)/**/_components/*`
- `app/[locale]/(group)/**/_actions/*`
- `app/[locale]/(group)/**/_lib/*`

…is **route-private**. Do not import it across groups.

If you need reuse:

- UI composite → `components/shared/*`
- pure helper → `lib/*`

## 3) Error / loading / not-found pages

App Router special files have sharp edges:

- `error.tsx` / `global-error.tsx` are **client** boundaries (they receive `error`, need `reset`)
- `not-found.tsx` is a server component (by default) and should be locale-aware
- loading UI should not mount expensive client trees twice (watch Suspense fallbacks)

Rules of thumb:

- keep error UIs minimal; don’t log secrets/PII
- all user text via `next-intl` (`messages/en.json`, `messages/bg.json`)

## 4) Caching rails (frontend-relevant)

If you use cached server code (`'use cache'`):

- always include `cacheLife()` + `cacheTag()`
- never call `cookies()` / `headers()` inside the cached function
- read request data outside the cached boundary and pass values in

This is the #1 silent correctness regression source (personalized pages + caching).

## 5) Imports that break RSC boundaries

Client components must not import server-only modules.

Smells:

- client file imports from `app/**/_actions/*`
- client file imports a module that uses `server-only`, `cookies()`, `headers()`, or Node APIs

Fix patterns:

- move server work into a server action or route handler
- call it from the client using `fetch` or an action prop (depending on structure)

## 6) next-intl navigation + links

Prefer locale-aware helpers (Treido uses `next-intl`):

- use the app’s locale-aware `Link`/navigation helpers
- never hardcode `/en/...` or `/bg/...`

When you add strings:

- update both `messages/en.json` and `messages/bg.json`
- keep keys stable and descriptive (`errors.global.title`, not `t1`)

