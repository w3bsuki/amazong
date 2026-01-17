# Codebase Audit — 2026-01-17 (Deep)

## Scope
30-minute audit in 5 phases with subagents. Focused on the biggest offenders: over-engineering, tech debt, duplication, hardcoding, and best-practice gaps for Next.js 16 App Router + Tailwind v4 + shadcn/ui.

## Executive Summary (Biggest Offenders)
1. **Parallel desktop feed implementations** are intentionally kept alive, creating long-term duplication and drift risk. Evidence: [PLAN-replace-main-with-demo.md](PLAN-replace-main-with-demo.md).
2. **Pricing/formatting logic duplicated** across utilities and inline components, increasing inconsistency risk and maintenance cost. Evidence: [lib/format-price.ts](lib/format-price.ts), [lib/currency.ts](lib/currency.ts), [components/mobile/product/mobile-price-block.tsx](components/mobile/product/mobile-price-block.tsx), [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx).
3. **Mobile vs desktop product page stacks are split**, doubling logic and UI maintenance. Evidence: [components/mobile/product/mobile-product-page.tsx](components/mobile/product/mobile-product-page.tsx), [components/shared/product/product-page-layout.tsx](components/shared/product/product-page-layout.tsx).
4. **Layout-level per-user queries** make the main segment dynamic and add DB load on every request. Evidence: [app/[locale]/(main)/layout.tsx](app/[locale]/(main)/layout.tsx).
5. **Hardcoded environment fallbacks** in payments and app URL helpers risk staging/production drift. Evidence: [app/[locale]/(checkout)/_actions/checkout.ts](app/[locale]/(checkout)/_actions/checkout.ts), [app/actions/subscriptions.ts](app/actions/subscriptions.ts), [lib/stripe-locale.ts](lib/stripe-locale.ts).
6. **Hardcoded domain in metadata** and locale alternates reduces portability across environments. Evidence: [app/[locale]/layout.tsx](app/[locale]/layout.tsx).
7. **Design-system violations in Tailwind** (arbitrary values, scale effects, hardcoded colors) appear in UI primitives and shared screens. Evidence: [components/ui/input.tsx](components/ui/input.tsx), [components/ui/textarea.tsx](components/ui/textarea.tsx), [components/ui/radio-group.tsx](components/ui/radio-group.tsx), [components/ui/toggle.tsx](components/ui/toggle.tsx), [components/ui/accordion.tsx](components/ui/accordion.tsx), [components/desktop/desktop-search.tsx](components/desktop/desktop-search.tsx), [components/shared/product/freshness-indicator.tsx](components/shared/product/freshness-indicator.tsx), [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx), [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx).
8. **I18n bypass** on error/not-found surfaces and select client UI strings. Evidence: [app/global-error.tsx](app/global-error.tsx), [app/global-not-found.tsx](app/global-not-found.tsx), [app/[locale]/error.tsx](app/[locale]/error.tsx), [app/[locale]/not-found.tsx](app/[locale]/not-found.tsx), [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx), [components/mobile/product/mobile-price-block.tsx](components/mobile/product/mobile-price-block.tsx).

---

## Phase 1 — Repo/Process Scan (5–10 min)
- **Large ongoing UI refactor** with multiple active phases; risk of drift until finished. Evidence: [TODO.md](TODO.md), [TREIDO-UI-REFACTOR-PLAN.md](TREIDO-UI-REFACTOR-PLAN.md).
- **Open production blockers** explicitly tracked (chat mobile scroll/avatars, Supabase security advisor). Evidence: [TODO.md](TODO.md), [TASK-fix-chat-mobile-scroll-and-avatars.md](TASK-fix-chat-mobile-scroll-and-avatars.md), [TASK-enable-leaked-password-protection.md](TASK-enable-leaked-password-protection.md).
- **Lint warning count accepted in gates** (526 warnings), which can hide new regressions. Evidence: [TODO.md](TODO.md).
- **Docs/process fragmentation** across multiple overlapping guides (risk of drift). Evidence: [docs/PRODUCTION.md](docs/PRODUCTION.md), [docs/PRODUCTION-WORKFLOW-GUIDE.md](docs/PRODUCTION-WORKFLOW-GUIDE.md), [docs/GPTVSOPUSFINAL.md](docs/GPTVSOPUSFINAL.md).

## Phase 2 — Next.js 16 App Router Audit (5–10 min)
- **Per-user data in layout**: `HeaderWithUser` calls `createClient()` and queries product counts; this makes the layout dynamic and forces DB work on every page. Evidence: [app/[locale]/(main)/layout.tsx](app/[locale]/(main)/layout.tsx).
- **Hardcoded `metadataBase` and language alternates** lock environments to production domain. Evidence: [app/[locale]/layout.tsx](app/[locale]/layout.tsx).
- **Locale-unaware global error/404**: hardcoded English strings and root links that bypass locale routing. Evidence: [app/global-error.tsx](app/global-error.tsx), [app/global-not-found.tsx](app/global-not-found.tsx).
- **Localized error/not-found still hardcoded**: strings and links bypass next-intl. Evidence: [app/[locale]/error.tsx](app/[locale]/error.tsx), [app/[locale]/not-found.tsx](app/[locale]/not-found.tsx).
- **Middleware/proxy coupling**: i18n routing, geo-cookie, and session refresh in one entrypoint increases blast radius. Evidence: [proxy.ts](proxy.ts).
- **Redundant `generateStaticParams`** for locale appears in multiple layout segments; not harmful but indicates inconsistency. Evidence: [app/[locale]/layout.tsx](app/[locale]/layout.tsx), [app/[locale]/(main)/layout.tsx](app/[locale]/(main)/layout.tsx).

## Phase 3 — Tailwind v4 + shadcn/ui Tokens (5–10 min)
- **Arbitrary ring width `ring-[3px]` in primitives** violates design rule to avoid arbitrary values. Evidence: [components/ui/input.tsx](components/ui/input.tsx), [components/ui/textarea.tsx](components/ui/textarea.tsx), [components/ui/radio-group.tsx](components/ui/radio-group.tsx), [components/ui/toggle.tsx](components/ui/toggle.tsx), [components/ui/accordion.tsx](components/ui/accordion.tsx), [components/desktop/desktop-search.tsx](components/desktop/desktop-search.tsx).
- **Arbitrary border width**: `border-[1.5px]` appears in chart UI. Evidence: [components/ui/chart.tsx](components/ui/chart.tsx).
- **Arbitrary text size `text-[10px]`** used in shared product UI. Evidence: [components/shared/product/freshness-indicator.tsx](components/shared/product/freshness-indicator.tsx), [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx).
- **Non-token typography**: `text-3xs` appears in mobile promo badges. Evidence: [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx), [app/[locale]/(demo)/demo/mobile/_components/mobile-demo-landing.tsx](app/[locale]/(demo)/demo/mobile/_components/mobile-demo-landing.tsx).
- **Forbidden scale effects**: `active:scale-95` used in mobile pills/buttons. Evidence: [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx), [components/mobile/mobile-tab-bar.tsx](components/mobile/mobile-tab-bar.tsx).
- **Hardcoded colors**: `bg-orange-500 text-white` in promo badges bypass semantic tokens. Evidence: [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx).

## Phase 4 — Tech Debt + Over‑Engineering (5–10 min)
- **Duplicate price formatting utilities** with overlapping logic (two `formatPrice` implementations). Evidence: [lib/format-price.ts](lib/format-price.ts), [lib/currency.ts](lib/currency.ts).
- **Inline formatter duplication** in client components. Evidence: [components/mobile/product/mobile-price-block.tsx](components/mobile/product/mobile-price-block.tsx), [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx).
- **Two mobile home shells** (`MobileHomeTabs` and `MobileHomeUnified`) create split behavior and maintenance drift. Evidence: [components/mobile/mobile-home-tabs.tsx](components/mobile/mobile-home-tabs.tsx), [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx), [app/[locale]/(main)/page.tsx](app/[locale]/(main)/page.tsx).
- **Mobile/desktop product layout split** creates parallel UI flows and duplicated data wiring. Evidence: [components/mobile/product/mobile-product-page.tsx](components/mobile/product/mobile-product-page.tsx), [components/shared/product/product-page-layout.tsx](components/shared/product/product-page-layout.tsx).
- **Desktop feed replacement plan keeps parallel components alive** until cleanup, increasing long-lived duplication risk. Evidence: [PLAN-replace-main-with-demo.md](PLAN-replace-main-with-demo.md).
- **Legacy/backup files** add noise and can cause accidental drift. Evidence: [app/globals.css.backup](app/globals.css.backup), [app/globals.css.old](app/globals.css.old), [temp_log_entry.md](temp_log_entry.md), [temp_search_overlay.txt](temp_search_overlay.txt).

## Phase 5 — Hardcoding + Test Debt (5–10 min)
- **Hardcoded localhost/app URLs** in server actions for payments and subscriptions. Evidence: [app/[locale]/(checkout)/_actions/checkout.ts](app/[locale]/(checkout)/_actions/checkout.ts), [app/actions/subscriptions.ts](app/actions/subscriptions.ts).
- **Hardcoded app URL helper** defaulting to localhost instead of failing fast. Evidence: [lib/stripe-locale.ts](lib/stripe-locale.ts).
- **Hardcoded Capacitor dev server URL** in config. Evidence: [capacitor.config.ts](capacitor.config.ts).
- **Typecheck excludes tests/e2e** from `tsc` verification. Evidence: [tsconfig.json](tsconfig.json).
- **Coverage excludes critical runtime modules**, reducing signal. Evidence: [vitest.config.ts](vitest.config.ts).
- **E2E suites skip without credentials**, leaving critical seller flows unverified in CI. Evidence: [e2e/seller-routes.spec.ts](e2e/seller-routes.spec.ts), [e2e/seller-create-listing.spec.ts](e2e/seller-create-listing.spec.ts), [e2e/orders.spec.ts](e2e/orders.spec.ts).

---

## Remediation Shortlist (Prioritized)
### P0 (Highest impact)
1. **Collapse pricing logic** into a single canonical utility and replace inline formatters. Targets: [lib/format-price.ts](lib/format-price.ts), [lib/currency.ts](lib/currency.ts), [components/mobile/product/mobile-price-block.tsx](components/mobile/product/mobile-price-block.tsx), [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx).
2. **Stop layout-level user queries** by moving `HeaderWithUser` personalization into a client boundary or separate route-level fetch. Target: [app/[locale]/(main)/layout.tsx](app/[locale]/(main)/layout.tsx).
3. **Remove localhost fallbacks** in payment URLs for production paths (fail fast or env-only). Targets: [app/[locale]/(checkout)/_actions/checkout.ts](app/[locale]/(checkout)/_actions/checkout.ts), [app/actions/subscriptions.ts](app/actions/subscriptions.ts), [lib/stripe-locale.ts](lib/stripe-locale.ts).

### P1 (Debt containment)
1. **Decide on one mobile home shell** and deprecate the other. Targets: [components/mobile/mobile-home-tabs.tsx](components/mobile/mobile-home-tabs.tsx), [components/mobile/mobile-home-unified.tsx](components/mobile/mobile-home-unified.tsx).
2. **Normalize error/404 i18n** with next-intl and locale-aware links. Targets: [app/global-error.tsx](app/global-error.tsx), [app/global-not-found.tsx](app/global-not-found.tsx), [app/[locale]/error.tsx](app/[locale]/error.tsx), [app/[locale]/not-found.tsx](app/[locale]/not-found.tsx).
3. **Replace arbitrary Tailwind values** with tokens or theme equivalents. Targets: [components/ui/input.tsx](components/ui/input.tsx), [components/ui/textarea.tsx](components/ui/textarea.tsx), [components/ui/radio-group.tsx](components/ui/radio-group.tsx), [components/ui/toggle.tsx](components/ui/toggle.tsx), [components/ui/accordion.tsx](components/ui/accordion.tsx), [components/ui/chart.tsx](components/ui/chart.tsx), [components/shared/product/freshness-indicator.tsx](components/shared/product/freshness-indicator.tsx), [components/shared/product/product-card-list.tsx](components/shared/product/product-card-list.tsx).

### P2 (Process hardening)
1. **Add a credentialed smoke path** for seller routes in CI to prevent silent skips. Targets: [e2e/seller-routes.spec.ts](e2e/seller-routes.spec.ts), [e2e/seller-create-listing.spec.ts](e2e/seller-create-listing.spec.ts).
2. **Create a strict typecheck profile** that includes tests and e2e (separate config). Target: [tsconfig.json](tsconfig.json).

---

## Notes
- This audit complements the earlier snapshot in [codex/codebase-audit-2026-01-17.md](codex/codebase-audit-2026-01-17.md).
- The findings above are limited to the most visible offenders in the time window; they are not exhaustive.