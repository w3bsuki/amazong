# Project Audit Report (Treido / Amazong)

Generated: 2026-01-05

## Executive Summary

This repo is already close to production-ready on **architecture/caching** (Next.js 16 Cache Components + `cacheLife`, Supabase SSR client split, optimized middleware matcher). The biggest remaining “feels off” issues are **UI drift** in specific route groups/components (mainly Tailwind palette usage + arbitrary sizing), plus **one Supabase dashboard security toggle**.

If you want the fastest path to “everything looks like Treido”, focus on the scan-driven offenders in **high-traffic surfaces** first (Home hero, Search/Categories headers, Product detail, Checkout, Account).

## Current Signals (from repo tooling)

- Tailwind palette/gradient scan report: `cleanup/palette-scan-report.txt`
  - Totals: `files=45`, `palette=163`, `gradient=13`, `fill=4`
- Arbitrary values scan report: `cleanup/arbitrary-scan-report.txt`
  - Totals: `files=105`, `arbitrary=229`, `hex=3`

## UI/UX Findings (Priority)

### P0 — Visible UI drift (token + pattern violations)

- **Palette colors used in real UI** (should be semantic tokens):
  - `components/desktop/marketplace-hero.tsx` (home hero)
  - Admin pages: `app/[locale]/(admin)/admin/users/page.tsx`, `app/[locale]/(admin)/admin/products/page.tsx`
  - Chat pages: `app/[locale]/(chat)/_components/chat-interface.tsx`, `app/[locale]/(chat)/_components/conversation-list.tsx`
- **Radius drift**:
  - `components/category/subcategory-tabs.tsx` uses `rounded-xl` on a banner container (STYLE_GUIDE recommends `rounded-md` max for cards/surfaces).
- **Hardcoded sizing/arbitrary values**:
  - `components/layout/sidebar/sidebar.tsx`, `components/pricing/plan-card.tsx`, `app/[locale]/(main)/_components/promo-cards.tsx` (from `cleanup/arbitrary-scan-report.txt`)
  - Some arbitrary values are valid exceptions (safe-area, calc(), sticky max-h); others are “design drift” (fixed widths/heights on shared UI).

### P1 — UX consistency + maintainability

- **Admin UI** mixes palette badges with semantic token badges; recommend standardizing on `components/ui/badge.tsx` variants (e.g. `stock-available`, `stock-out`, `verified`, `info`) and semantic tokens (`text-success`, `bg-success/10`, etc).
- **Onboarding modal** (`components/auth/post-signup-onboarding-modal.tsx`) uses `framer-motion` + several one-off sizes/radii. It’s not necessarily wrong, but it’s a frequent source of “this page feels like a different app”.

### P2 — “Nice to have” polish

- Remove/deprioritize styling cleanup in `app/[locale]/(main)/demo/**` unless these routes are customer-facing.
- Continue the token worklist approach already captured in `styling/REFACTOR_PLAN.md`.

## Backend / Supabase Alignment

### What’s already solid

- Supabase client split is correct: `lib/supabase/server.ts` (`createClient`, `createStaticClient`, `createRouteHandlerClient`, `createAdminClient`).
- Cached data functions correctly use `'use cache'` + `cacheLife('<profile>')` + `cacheTag(...)` and avoid `cookies()`/`headers()` inside cached functions.
- `revalidateTag(tag, "max")` is consistently used with the required second arg.

### Watch-outs

- Admin pages use `createAdminClient()` directly (service role). This is OK **only** because the route group is server-gated via `app/[locale]/(admin)/admin/layout.tsx` calling `requireAdmin()`. Keep that invariant.
- Server-side `console.error(...)` exists in a few data paths/admin pages. It’s usually fine, but noisy logs can become a cost/ops issue on Vercel.

## Routing / i18n / Middleware

- Locale routing is well configured (`i18n/routing.ts`, `proxy.ts`, `app/[locale]/layout.tsx`).
- `generateStaticParams()` exists for locales and most key routes (good for ISR write reduction).
- Middleware matcher correctly excludes `_next/*`, `api/*`, and common static assets.

## Production Blockers (Actionable)

### P0 — Supabase security toggle (dashboard)

- Enable **Leaked Password Protection** in Supabase Auth settings (called out in `docs/production/02-supabase.md`).
  - Tracked as a task in `supabase_tasks.md`.

### P0 — UI token drift on high-traffic pages

- Fix palette usage + arbitrary sizing in:
  - `components/desktop/marketplace-hero.tsx`
  - Categories/search header components (start with what’s in `cleanup/*-scan-report.txt`)

### P1 — Test gate stability

- Master plan notes 1 failing Playwright spec (“Performance API issue”). Identify and fix/adjust it so `pnpm test:e2e` is fully green before treating the app as launch-ready.

## Recommended Execution Plan (Small, Verifiable Batches)

1) **UI batch A (home + categories)**: remove palette classes + radius drift; verify in browser + run `pnpm -s exec tsc -p tsconfig.json --noEmit` and `pnpm test:e2e:smoke`.
2) **UI batch B (account + business)**: continue scan-driven cleanup (you already have uncommitted work here).
3) **E2E stability**: make `pnpm test:e2e` green; no skipped launch-critical specs.
4) **Supabase dashboard gates**: leaked password protection, re-run advisors, confirm no new security warnings.

