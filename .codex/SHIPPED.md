# Shipped (append-only)

> Lightweight shipped log. Use `.codex/TASKS.md` for active work only.

## 2026-02-02

- [x] UIUX Phase 1: Onboarding Flow (Tasks 1.1–1.7)
  - Account type selection screen (Personal/Business cards)
  - Removed account type from signup form (now in onboarding)
  - Personal profile setup (username, display name, avatar)
  - Business profile setup (business name, category, logo)
  - Interests selection (multi-select chips with min-3 gate)
  - Onboarding complete screen + API route
  - OnboardingProvider redirect (gates on `onboarding_completed` flag)

- [x] Docs + audit consolidation (SSOT cleanup)
  - Audits consolidated under `.codex/audit/*` (including Playwright audit under `.codex/audit/playwright/`)
  - Legacy planning folders archived under `docs/archive/` (production/refactor/uirefactor snapshots)
  - Added `docs/13-PRODUCTION-PUSH.md` as the single ship plan entry point
  - Deprecated `.codex/project/*` to thin pointers → `/docs` SSOT
  - Deleted orphaned `temp-tradesphere-audit/` prototype folder

## 2026-02-01

- [x] ORCH-CLN-011 — Remove unused exports (knip-confirmed)
- [x] ORCH-AUD-014 — TW4 rails: remove opacity modifiers from error/admin badges

## 2026-01-31

- [x] Stripe webhook idempotency + unique indexes
- [x] Search history SECURITY DEFINER hardening
- [x] Validate orders ship/track payloads
- [x] Client-safe product types for mobile home
- [x] Client-safe category types for filter modal
- [x] TW4 shadcn CSS token fixes
- [x] Replace text opacity tokens
- [x] Replace background opacity tokens

## 2026-01-30

- [x] Frontend lane: global error + global not-found next-intl + safe logging
- [x] Checkout webhook hardening: zod-validated metadata + structured logging
- [x] Validate `/api/products/count` body + structured error logging
- [x] Validate boost checkout body + locale-safe Stripe return URLs
- [x] Validate payment method routes bodies + structured error logging
- [x] RLS hardening: restrict orders/order_items policies + revoke anon helpful-count RPC
- [x] TS safety: remove `any` in revalidate webhook payload access
- [x] TS safety: remove `as any` from zod resolvers (typed Resolver cast)
- [x] shadcn boundary: move SocialInput out of `components/ui`
- [x] TW4 rail: remove `text-white` and enforce scan
- [x] Route boundary fix: move BoostDialog to shared
- [x] Route boundary fix: move SellersGrid to shared (storybook-safe)
- [x] Route boundary fix: move DesignSystemClient to shared (storybook-safe)
- [x] Replace wildcard selects on account orders page
- [x] Remove `order_items.*` selects + cap list queries
- [x] Fetch conversations via RPC (no `*`, no unbounded last-message scan)
- [x] Secure SECURITY DEFINER RPCs + revoke PUBLIC/anon execute
- [x] Guard password update for non-email accounts (remove `user.email!`)

## 2026-01-29

- [x] Verify checkout session action typing (no unsafe casts)
- [x] Remove `as any` from payments webhook route

## 2026-01-24

- [x] Share payout setup UI (`SellerPayoutSetup`)
- [x] Use `ProgressHeader` for /sell gating states
- [x] Remove nested `PageShell` in (sell) routes
- [x] Move seller onboarding copy to next-intl
- [x] Delete demo routes (`app/[locale]/demo/`)
- [x] Set `/assistant` header variant to contextual
- [x] Remove unused deps (ai-sdk, radix-toggle)
- [x] Delete legacy middleware.ts (proxy.ts is request hook)
- [x] Knip cleanup (all exports)
- [x] Supabase Phase 1 security

## (Older) Backlog items completed

- [x] BACKLOG-001: Replace `components/ui/chart.tsx` arbitrary utilities + `any` types
- [x] BACKLOG-002: Remove opacity modifiers + arbitrary transitions/rings in `components/ui` primitives
- [x] BACKLOG-003: Remove `// @ts-nocheck` from `supabase/functions/ai-shopping-assistant/index.ts`
- [x] BACKLOG-004: Reduce admin revenue calc scan-all-orders to SQL aggregate
