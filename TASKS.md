# TASKS — Production Execution Plan

> **Purpose**: Codex execution checklist to make this project production-ready.
> **Approach**: Small, atomic tasks. Each task should be completable in one session.
> **Verification**: Run gates after each batch (`pnpm -s exec tsc -p tsconfig.json --noEmit`)

---

## Gates (Run After Every Batch)

```bash
# Required
pnpm -s exec tsc -p tsconfig.json --noEmit

# Recommended after significant changes
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## Scope Note (Important)

- **Supabase Phase 1 security tasks completed (2026-01-24).** See `audit/supabase.md` for details and remaining manual step (leaked password protection toggle).

---

## P0 — DEAD CODE / KNIP CLEANUP (Current)

> **Status (2026-01-24)**: `pnpm -s knip` is clean ✅

### P0-1: Remove unused deps (DONE)
- [x] Remove `@ai-sdk/gateway`
- [x] Remove `@radix-ui/react-toggle`

### P0-2: Remove unused exports/types (DONE)
- [x] Remove unused exports from `i18n/routing.ts`
- [x] Remove unused exports from `components/layout/sidebar/sidebar.tsx`
- [x] Remove unused exports from `components/ui/*` (table/toast/breadcrumb/sheet)
- [x] Remove unused exported types from `lib/ai/schemas/*`
- [x] Remove default export from `components/shared/page-shell.tsx`

### P0-3: Remove legacy middleware entrypoint (DONE)
- [x] Delete `middleware.ts` (request hook is `proxy.ts`)

### P0-4: Optional — remove Capacitor (DECIDE)
- [ ] If mobile is out of scope: remove Capacitor deps + `capacitor.config.ts`

---

## P1 — REMOVE UNUSED EXPORTS (15 exports)

> **Goal**: Clean up API surface to reduce confusion and bundle size.

### P1-1: Remove Unused Stripe Env Exports
- [ ] In `lib/env.ts`, remove or mark as internal:
  - `getStripeWebhookSecret` (line 31) → keep if used by webhooks, else remove
  - `getStripePublishableKey` (line 51) → keep if used by client, else remove
- **Verify**: Search for usages before removing

### P1-2: Remove Unused Analytics Drawer Exports
- [ ] In `lib/analytics-drawer.ts`, remove:
  - `trackDrawerCta` (line 155)
  - `trackDrawerConversion` (line 166)
  - `getSessionDrawerMetrics` (line 180)
- **Alternative**: Delete entire file if analytics drawer is out of scope
- **Verify**: Typecheck passes

### P1-3: Remove Unused Helper Exports
- [ ] In `lib/bulgarian-cities.ts`, remove `getCityLabel` (line 71)
- [ ] In `lib/feature-flags.ts`, remove `getFeatureFlags` (line 159)
- **Verify**: Search for usages, typecheck passes

### P1-4: Clean Up Supabase Type Exports
- [ ] In `lib/supabase/database.types.ts`:
  - Keep `Tables`, `TablesInsert`, `TablesUpdate` if used for type safety
  - Remove `Constants`, `Enums`, `CompositeTypes` if unused
- **Note**: These are auto-generated; regenerate with `supabase gen types` if needed

### P1-5: Remove Unused Component Exports
- [ ] In `components/providers/currency-context.tsx`, remove `useCurrency` if unused
- [ ] In `components/dropdowns/locale-delivery-dropdown.tsx`, remove `LocaleDeliveryDropdown` if unused
- [ ] In `components/mobile/category-nav/sticky-category-tabs.tsx`, remove `StickyCategoryTabs` if unused
- **Verify**: Search for usages first

### P1-6: Clean Up Sell Components
- [ ] In `app/[locale]/(sell)/_components/ui/list-card.tsx`:
  - Remove `ListCard`, `ListCardHeader` if unused
- [ ] In `app/[locale]/(sell)/_components/ui/list-row.tsx`:
  - Remove `ListRow`, `ListRowGroup` if unused
- **Verify**: Typecheck passes

---

## P2 — TYPESCRIPT SAFETY (66 Drift Items)

> **Goal**: Fix unsafe TypeScript patterns to prevent runtime errors.
> **Reference**: `scripts/ts-safety-gate.baseline.json`

### P2-1: Fix Checkout Action Type Safety
- [ ] In `app/[locale]/(checkout)/_actions/checkout.ts`:
  - Line 106:37 has non-null assertion — add proper null check
  - Review all `!` assertions and replace with guards or early returns
- **Verify**: `pnpm ts:gate` or manual review

### P2-2: Fix Payments Webhook Type Safety
- [ ] In `app/api/payments/webhook/route.ts`:
  - Line 55:27 has `as any` cast — provide proper types
  - Check Stripe webhook event typing
- **Verify**: Typecheck passes

### P2-3: Fix Categories Data Layer
- [ ] In `lib/data/categories.ts`:
  - Line 949 has `(supabase as any)` — investigate and fix
  - Ensure Supabase client has proper generic types
- **Verify**: Typecheck passes

### P2-4: Global TypeScript Audit
- [ ] Run `grep -r "as any" lib/ app/ components/ --include="*.ts" --include="*.tsx"`
- [ ] Fix or document each occurrence
- [ ] Update baseline if intentional: `pnpm ts:gate:baseline`
- **Verify**: `pnpm ts:gate` passes or baseline updated

---

## P3 — HEADER CONSISTENCY AUDIT

> **Goal**: Ensure consistent header experience across all routes.
> **Current System**: `AppHeader` in `components/layout/header/app-header.tsx` with 5 variants

### P3-1: Audit Header Variants Per Route
- [ ] Document current header behavior in each route group:
  - `(main)` → `AppHeader` (auto-detects) ✓
  - `(auth)` → Minimal or none (intentional)
  - `(checkout)` → Custom `CheckoutHeader`
  - `(sell)` → Client component handles it
  - `(account)` → Sidebar layout
  - `(admin)` → `DashboardHeader`
  - `(chat)` → Full-screen (no header)
  - `(plans)` → Page handles own nav

### P3-2: Standardize Search Bar Position
- [ ] Verify all `default` variant pages have consistent search bar placement
- [ ] Check `/assistant` specifically — should use homepage-style inline search or keep current
- [ ] Decision: Should `default` variant have search inline or below icons?
- **Action**: Update `AppHeader` or route-specific overrides if needed

### P3-3: Remove Legacy Header Remnants
- [ ] After P0-1 (delete `site-header-unified.tsx`), verify no references remain
- [ ] Check for any hardcoded header implementations in route layouts

---

## ISSUE-0003 — UI duplication cleanup (2026-01-24)

Reference:
- Audit: `UI_COMPONENT_AUDIT_2026-01-24.md`
- Execution plan (OPUS): `UI_REFACTOR_PLAN_OPUS_2026-01-24.md`

Entry tasks:
- [x] (ISSUE-0003) Delete or quarantine `app/[locale]/demo/` (unblocks `pnpm -s styles:gate`)
- [x] (ISSUE-0003) Decide `/assistant` header variant and implement it via `AppHeader` route mapping + header context sync
- Header matrix (2026-01-24): default=`homepage`, `/categories*`=`contextual`, `/{username}/{productSlug}`=`product`, `/assistant`=`contextual`
- [ ] (ISSUE-0003) Consolidate ProductCard variants and delete redundant card files when unused
- [x] (ISSUE-0003) Remove unused deps/exports/types per Knip (`pnpm -s knip` clean)


---

## ISSUE-0004 — Seller flows UI consistency (2026-01-24)

Entry tasks:
- [x] Share payout setup UI (`SellerPayoutSetup`) and reuse it in `/sell` payout gating
- [x] Use `ProgressHeader` for `/sell` gating states (remove legacy fixed header usage)
- [x] Remove nested `PageShell` usage across `(sell)` routes (layout owns page shell)
- [x] Move seller onboarding copy to `next-intl` (`Sell.sellerOnboardingWizard.*`)
- [ ] Align sell-related rounding to repo defaults (`rounded-md`, avoid `rounded-xl` unless justified)
- [ ] Move obvious inline strings in seller flows to `next-intl` (no `locale === "bg" ? … : …` in UI)

---

## P4 — SUPABASE ALIGNMENT

> **Goal**: Ensure database layer follows best practices.
> **Reference**: `BACKEND.md`, `ENGINEERING.md`
> **Status (2026-01-24)**: `category_stats` hardening + anon privilege hardening done (see `audit/supabase.md`). Leaked password protection still pending.

### P4-1: Regenerate Supabase Types
- [ ] Run `supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts`
- [ ] Update imports if type shapes changed
- [ ] Remove `any` casts that the new types make unnecessary
- **Verify**: Typecheck passes

### P4-2: Audit Data Layer Queries
- [ ] Verify no `select('*')` calls in `lib/data/` — ✓ (already confirmed)
- [ ] Review query projections in:
  - `lib/data/products.ts` — explicit selects ✓
  - `lib/data/categories.ts` — explicit selects ✓
  - `lib/data/product-page.ts` — explicit selects ✓
- **Verify**: No new wide selects introduced

### P4-3: Verify Caching Patterns
- [ ] All `'use cache'` calls have `cacheLife()` pairing
- [ ] No user-specific data (`cookies()`, `headers()`) inside cached functions
- [ ] Cache tags are granular (not broad "invalidate everything")
- **Files to check**:
  - `lib/data/products.ts` — 3 cached functions
  - `lib/data/categories.ts` — 4 cached functions
  - `lib/data/product-page.ts` — 4 cached functions
  - `lib/data/profile-page.ts` — 2 cached functions
  - `lib/data/product-reviews.ts` — 1 cached function

### P4-4: RLS Policy Audit
- [ ] Verify RLS enabled on all user-data tables (see `BACKEND.md`)
- [ ] Check for `(SELECT auth.uid())` pattern in policies (performance)
- [ ] Document any tables with RLS disabled and justify
- **Reference**: `supabase/schema.sql`

### P4-5: Enable Leaked Password Protection
- [ ] In Supabase Dashboard → Authentication → Settings
- [ ] Enable "Leaked Password Protection"
- [ ] Document completion in `audit/supabase.md`
- **Note**: This is a dashboard-only setting

---

## P5 — NEXT.JS 16 BEST PRACTICES

> **Goal**: Ensure optimal Next.js 16 App Router patterns.
> **Reference**: `ENGINEERING.md`, `ARCHITECTURE.md`

### P5-1: Proxy Configuration Audit
- [ ] Verify `proxy.ts` is the only middleware (not `middleware.ts`)
- [ ] Check matcher config excludes static assets
- [ ] Verify session update only runs for protected routes
- **File**: `proxy.ts`

### P5-2: Server/Client Boundary Audit
- [ ] No client components importing server actions directly
- [ ] Actions passed via props or invoked through handlers
- [ ] Check for `"use server"` directives in correct locations
- **Common violation**: UI components importing from `app/actions/`

### P5-3: Image Optimization Audit
- [ ] Verify `next.config.ts` image settings are production-ready
- [ ] Check `remotePatterns` include all required domains
- [ ] Remove `unoptimized: true` for production (only for E2E)
- **File**: `next.config.ts`

### P5-4: Build Verification
- [ ] Run `pnpm build` successfully
- [ ] Check for any build warnings to address
- [ ] Verify output matches Vercel runtime expectations
- **Command**: `pnpm -s build`

---

## P6 — I18N COMPLETENESS

> **Goal**: All user-facing strings via next-intl.
> **Reference**: `FRONTEND.md`

### P6-1: Messages Parity Check
- [ ] Run `pnpm test:unit __tests__/i18n-messages-parity.test.ts`
- [ ] Fix any missing keys in `messages/en.json` or `messages/bg.json`
- **Verify**: Test passes

### P6-2: Hardcoded String Audit
- [ ] Search for inline locale checks: `locale === "bg" ?`
- [ ] Convert critical user-facing strings to `useTranslations()` or `getTranslations()`
- [ ] Acceptable exceptions: metadata strings, error codes
- **High-traffic areas to prioritize**:
  - Homepage
  - Product pages
  - Auth forms
  - Checkout

### P6-3: Locale Routing Consistency
- [ ] All internal links use `Link` from `@/i18n/routing`
- [ ] All programmatic navigation uses `useRouter` from `@/i18n/routing`
- [ ] No hardcoded `/en/` or `/bg/` prefixes in href strings

---

## P7 — TAILWIND V4 + SHADCN ALIGNMENT

> **Goal**: Design system consistency, no drift.
> **Reference**: `DESIGN.md`

### P7-1: Run Style Drift Scans
```bash
pnpm -s styles:scan
pnpm -s styles:gate
```
- [ ] 0 gradient violations
- [ ] < 20 arbitrary values (currently 9)
- [ ] Document any justified exceptions

### P7-2: Semantic Token Audit
- [ ] No hardcoded `bg-white`, `text-black`, `border-gray-*`
- [ ] Use `bg-background`, `text-foreground`, `border-border`
- [ ] Product status colors are intentional exceptions (emerald/stone/etc.)

### P7-3: Touch Target Compliance
- [ ] All tappable elements ≥ 32px
- [ ] Use `h-touch-*` utilities from `globals.css`
- [ ] Mobile buttons use `h-touch-lg` (48px) for primary CTAs

### P7-4: Component Boundary Audit
- [ ] `components/ui/` has no app hooks/imports
- [ ] `components/shared/` uses only ui primitives + lib utilities
- [ ] Route-private components stay in `_components/`

---

## P8 — FEATURE COMPLETENESS AUDIT

> **Goal**: Every button works, every flow completes.
> **Reference**: `FEATURES.md`

### P8-1: Auth Flow Audit
- [ ] Sign up → email confirmation → login works
- [ ] Password reset flow works
- [ ] OAuth providers work (if configured)
- [ ] Redirect after login respects `?next=` param
- **E2E**: `e2e/auth.spec.ts` (28 tests)

### P8-2: Browse/Search Flow Audit
- [ ] Homepage loads with products
- [ ] Category navigation works
- [ ] Search returns results
- [ ] Filters apply correctly
- [ ] Pagination works
- **E2E**: `e2e/smoke.spec.ts`

### P8-3: Product Page Audit
- [ ] Images load and gallery works
- [ ] Price displays correctly (with currency toggle)
- [ ] Seller info displays
- [ ] Add to cart works (if in scope)
- [ ] Reviews section loads
- **E2E**: `e2e/reviews.spec.ts`

### P8-4: Seller Flow Audit
- [ ] Create listing form works
- [ ] Image upload works
- [ ] Edit listing works
- [ ] Payout setup works (Stripe Connect)
- **E2E**: `e2e/seller-routes.spec.ts`

### P8-5: Messaging Flow Audit
- [ ] Start conversation works
- [ ] Send message works
- [ ] Image upload in chat works
- [ ] Mobile scroll/UX is smooth
- **Manual QA required**

### P8-6: Checkout/Orders Flow Audit (if in scope)
- [ ] Add to cart works
- [ ] Cart persists across page loads
- [ ] Checkout creates payment intent
- [ ] Webhooks process correctly
- [ ] Order appears for buyer + seller
- **Manual QA required**

### P8-7: Reviews/Voting Flow Audit
- [ ] Submit review works
- [ ] "Helpful" vote works
- [ ] Delete own review works
- [ ] Reviews refresh after submit
- **E2E**: `e2e/reviews.spec.ts`

---

## P9 — STRIPE ALIGNMENT

> **Goal**: Payments are deterministic and secure.
> **Reference**: `BACKEND.md`, `PRODUCTION.md`

### P9-1: Webhook Signature Verification
- [ ] All 3 webhook endpoints verify signatures:
  - `/api/checkout/webhook`
  - `/api/payments/webhook`
  - `/api/subscriptions/webhook`
- [ ] Use `stripe.webhooks.constructEvent()` with env secrets

### P9-2: Idempotency Audit
- [ ] Orders check `stripe_payment_intent_id` before insert
- [ ] Boosts check `stripe_checkout_session_id` before insert
- [ ] Subscriptions check `stripe_subscription_id` before insert/update

### P9-3: Env Var Verification
- [ ] `STRIPE_SECRET_KEY` set (server-only)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` set
- [ ] `STRIPE_WEBHOOK_SECRET` set
- [ ] `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET` set

### P9-4: Connect Onboarding
- [ ] `/api/connect/onboarding` returns 200 (not 500)
- [ ] Individual + Business flows supported
- [ ] Onboarding redirect URLs are correct

---

## P10 — FINAL VERIFICATION

> **Goal**: All gates pass, ready for production.

### P10-1: Run All Gates
```bash
pnpm -s lint                                    # 0 errors (warnings OK)
pnpm -s exec tsc -p tsconfig.json --noEmit      # 0 errors
pnpm test:unit                                  # All pass
pnpm -s build                                   # Success
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke  # All pass
```

### P10-2: Manual QA Checklist
- [ ] Test `/en` and `/bg` locales
- [ ] Test auth flow end-to-end
- [ ] Test browse → product → cart flow
- [ ] Test seller listing creation
- [ ] Test messaging
- [ ] Test on mobile viewport

### P10-3: Performance Check
- [ ] Run Lighthouse on key pages (Home, PDP, Search)
- [ ] Check Core Web Vitals
- [ ] Verify no blocking resources

### P10-4: Security Check
- [ ] No secrets in logs
- [ ] No `SUPABASE_SERVICE_ROLE_KEY` in client bundles
- [ ] RLS enabled on user data tables
- [ ] Webhook signatures verified

---

## Execution Order (Recommended)

1. **P0** (Dead Code) — Safe to do immediately, reduces noise
2. **P1** (Unused Exports) — Quick cleanup
3. **P2** (TypeScript) — Fix safety issues
4. **P3** (Headers) — UI consistency
5. **P4** (Supabase) — Data layer correctness
6. **P5** (Next.js) — Framework alignment
7. **P6** (i18n) — User-facing strings
8. **P7** (Tailwind) — Design system
9. **P8** (Features) — Functional completeness
10. **P9** (Stripe) — Payment flows
11. **P10** (Final) — Gates + QA

---

## Notes for Codex

- Each P-section can be a session
- Run typecheck after each batch of deletions
- Don't modify multiple unrelated systems in one session
- If a task reveals more issues, create a sub-task
- Update this file as tasks complete

---

## Completion Tracking

| Phase | Tasks | Done | Blocked |
|-------|-------|------|---------|
| P0 | 4 | 3 | 0 |
| P1 | 6 | 0 | 0 |
| P2 | 4 | 0 | 0 |
| P3 | 3 | 0 | 0 |
| P4 | 5 | 0 | 0 |
| P5 | 4 | 0 | 0 |
| P6 | 3 | 0 | 0 |
| P7 | 4 | 0 | 0 |
| P8 | 7 | 0 | 0 |
| P9 | 4 | 0 | 0 |
| P10 | 4 | 0 | 0 |
| **Total** | **48** | **3** | **0** |
