# FRONTEND.md — Frontend Implementation Contract

> Implementation defaults and quality bar for Treido frontend delivery.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-13 |
| Refresh cadence | Weekly + whenever frontend standards change |

## Scope

Server/client boundaries, component layering, i18n routing, accessibility baseline, and the non-negotiable quality bar for UI surfaces.

## Runtime Truth Paths

- `app/[locale]/**` (routes + layouts)
- `components/**` (UI layers)
- `hooks/**` (client hooks)
- `lib/**` (clients + domain helpers; no React)

## 1) Source Of Truth

1. `docs/ui/DESIGN.md` defines token contracts, forbidden patterns, and UI quality rails.
2. `ARCHITECTURE.md` defines module boundaries, route groups, Supabase client selection, and cache rules.
3. This file defines frontend implementation defaults and ship criteria.

If docs conflict with runtime code, runtime is truth. Update docs in the same change.

## 2) Component Placement Rules

| Location | Use |
|----------|-----|
| `components/ui/*` | Primitives only (no domain logic, no data fetching) |
| `components/shared/*` | Reusable composites (cards, filters, fields) |
| `components/layout/*` | Shells (header/nav/footer) |
| `components/providers/*` | Thin contexts and app wiring |
| `app/**/_components/*` | Route-private UI only |
| `hooks/*` | Shared client hooks |
| `lib/*` | Pure utilities/clients (no React, no `app/` imports) |

Rule: never import route-private `_components/`, `_actions/`, `_lib/` across route groups.

## 3) Server vs Client Defaults

- Default to Server Components.
- Add `"use client"` only when you need state, effects, or event handlers.
- Keep client components prop-driven; avoid client-side “mini data layers”.
- Do auth checks server-side using `supabase.auth.getUser()` (see `lib/auth/require-auth.ts`).

## 4) Data Fetching + Caching Rules

- Prefer Server Component fetching for initial render.
- Use cached fetchers (`"use cache"`, `cacheLife`, `cacheTag`) only with `createStaticClient()` (no cookies).
- Do not read `cookies()` / `headers()` inside cached functions.
- Avoid `select('*')` in hot paths; project only needed fields (perf + payload).

## 5) i18n Contract

- All user-facing routes live under `app/[locale]/`.
- Use next-intl routing helpers (`@/i18n/routing`) for links/navigation.
- Server translations: `getTranslations()` + `setRequestLocale()`.
- Client translations: `useTranslations()`.

## 6) Design Quality Bar (Ship Criteria)

Before shipping any UI surface:

- Purpose and user state are explicit (see `docs/ui/DESIGN.md` §2.1).
- Clear typographic hierarchy exists (size + weight + tracking).
- Interaction states exist (hover, active, focus-visible, disabled, selected).
- Layout has rhythm (density changes where appropriate), not template repetition.
- Motion is feedback, not decoration; reduced motion is respected.
- Touch targets meet 44px default and 48px for primary controls.
- No horizontal overflow at mobile widths.

## 7) Accessibility Baseline

- Keyboard reachable flows for primary actions.
- Visible focus states on all interactive elements.
- ARIA labels for icon-only controls.
- Respect `prefers-reduced-motion`.

## 8) Verification

Always (any code change):

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Risk-based:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

## See Also

- `docs/ui/DESIGN.md`
- `docs/WORKFLOW.md`
- `docs/QA.md`
- `ARCHITECTURE.md`

*Last updated: 2026-02-13*

