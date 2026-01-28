# AGENTS.md — Treido Marketplace (SSOT)

Read this first. This file is the **single entry point** for humans + AI agents working in this repo.

## Project

- Product: **Treido** — Bulgarian-first marketplace (C2C + B2B/B2C), eBay/Vinted meets StockX
- Goal: ship production ASAP with clean boundaries and minimal bloat
- Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase (RLS/Auth/Storage) + Stripe (Checkout + Connect) + next-intl

## Canonical Docs (SSOT)

Only these docs define “how the project works”. If something conflicts with them, it’s wrong/outdated.

- `docs/PRD.md` — what Treido is + launch scope
- `docs/FEATURES.md` — feature checklist (✅/🚧/⬜) + route map
- `docs/ARCHITECTURE.md` — module boundaries, caching, Supabase, Stripe, i18n
- `docs/DESIGN.md` — Tailwind v4 + shadcn tokens, UI rules, forbidden patterns

## Rails (Non‑Negotiable)

- [ ] No secrets/PII in logs (server or client)
- [ ] All user-facing strings via `next-intl` (`messages/en.json`, `messages/bg.json`)
- [ ] Tailwind v4 only: no gradients, no arbitrary values, no hardcoded colors (run `pnpm -s styles:gate`)
- [ ] Default to Server Components; add `"use client"` only when required
- [ ] Cached server code: always `cacheLife()` + `cacheTag()`; never use `cookies()`/`headers()` inside cached functions
- [ ] Supabase: no `select('*')` in hot paths; project fields
- [ ] Stripe webhooks are idempotent + signature-verified
- [ ] Small batches (1–3 files), shippable, with verification
- [ ] No new animations (keep UX stable and fast)

## Where Things Go (Boundaries)

- `app/[locale]/(group)/**/_components/*` route-private UI
- `app/[locale]/(group)/**/_actions/*` route-private server actions
- `app/actions/*` shared server actions
- `components/ui/*` shadcn primitives only (no app logic/hooks)
- `components/shared/*` shared composites (cards, blocks, forms)
- `components/layout/*` shells (header, footer, sidebars)
- `components/providers/*` thin providers/contexts
- `hooks/*` reusable hooks
- `lib/*` pure utilities/clients/domain helpers (no React)

## Verification Gates (Run Often)

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
pnpm -s styles:gate
pnpm -s knip
pnpm -s dupes
```

## Docs Hygiene

- SSOT docs live in `docs/` (linked above).
- Working audits belong in `audit/` (dated files, lane format).
- Refactor workplans belong in `refactor/` (indexes + file maps).
- Business/legal/public docs belong in `docs-site/` (do not mix with engineering docs).
- Keep docs modular (≤500 lines each). If a doc grows, split it and update this file.
