# OPUS_TASKS.md — Multi-Agent Codebase Refactor Plan

> **Goal**: Production-ready codebase with zero tech debt, clean gates, and minimal bloat.
> **Date**: 2026-01-24
> **Agents**: 7 specialized Codex agents
> **Project**: Treido — Modern marketplace (Next.js 16 + Supabase + Stripe)

---

## Current State Metrics

| Metric | Value | Target |
|--------|-------|--------|
| Dead files (Knip) | ~49 files | 0 |
| Unused exports | 21 exports + 5 types | 0 |
| Unused deps | 2 | 0 |
| Client components | 277 | <150 |
| Code duplication | 310 clones (3.6%) | <1% |
| Pages | 94 | — |
| Route handlers | 56 | — |
| Total tasks | 54 (P0-P10) | All done |

---

## Verification Gates (ALL agents must run after each batch)

```bash
# Required after EVERY batch
pnpm -s exec tsc -p tsconfig.json --noEmit   # Typecheck

# Required after UI/flow changes
pnpm test:unit                                # Vitest
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke  # E2E smoke

# Required before PR/merge
pnpm -s lint                                  # ESLint
pnpm -s build                                 # Production build
pnpm -s knip                                  # Dead code check
pnpm -s styles:gate                           # Tailwind drift
```

---

## Agent Domain Map

| Agent | Domain | Scope | Reference |
|-------|--------|-------|-----------|
| **Agent 1** | Next.js 16 | App Router, caching, server/client boundaries, proxy, layouts | `audit/nextjs.md` |
| **Agent 2** | Supabase | RLS policies, types, client usage, security advisories | `audit/supabase.md` |
| **Agent 3** | Tailwind v4 + shadcn | Tokens, drift, component recipes, design system | `audit/tailwind-shadcn.md` |
| **Agent 4** | TypeScript | Type safety, `as any` removal, strict compliance | `audit/typescript-tooling.md` |
| **Agent 5** | Dead Code | Knip cleanup (files, exports, deps) | `cleanup/knip-report.txt` |
| **Agent 6** | UI Components | Headers, ProductCard consolidation, deduplication | `audit/UI_REFACTOR_PLAN_OPUS_2026-01-24.md` |
| **Agent 7** | Stripe + Payments | Webhooks, idempotency, Connect | `TASKS.md` P9 |

---

# AGENT 1 — Next.js 16 (App Router)

**Scope**: `app/`, `proxy.ts`, `next.config.ts`, `lib/data/`, layouts

**Key Stats**:
- Pages: 94
- Route handlers: 56
- Layouts: 19
- Client components: 277 (target: <150)

## Phase 1: Structural Audit
- [ ] Confirm `proxy.ts` is the only middleware (no `middleware.ts` at root)
- [ ] Verify matcher config excludes static assets
- [ ] Audit `cacheLife()` + `cacheTag()` pairings in `lib/data/*`
- [ ] Ensure no `cookies()`/`headers()` inside `'use cache'` functions
- [ ] Verify `revalidateTag(tag, profile)` uses two args

**Files to check**:
- `proxy.ts`
- `lib/data/products.ts` — 3 cached functions
- `lib/data/categories.ts` — 4 cached functions
- `lib/data/product-page.ts` — 4 cached functions
- `lib/data/profile-page.ts` — 2 cached functions
- `lib/data/product-reviews.ts` — 1 cached function

## Phase 2: Server/Client Boundary Cleanup
- [ ] Reduce client components (277 → target <150)
- [ ] Move data fetching to server components where possible
- [ ] Verify no `"use client"` imports `@/lib/supabase/server`
- [ ] Check server actions have `"use server"` directives
- [ ] Actions passed via props or invoked through handlers (not imported directly in client)

**Scan command**:
```bash
rg -l '^\s*"use client"' app components lib hooks | wc -l
```

## Phase 3: Route Handler Consolidation
- [ ] Audit API routes (`app/api/*`) for duplication with `lib/data/*`
- [ ] Remove redundant endpoints
- [ ] Ensure webhooks declare appropriate runtime/limits
- [ ] Check for duplicate products/categories endpoints

**Duplication hotspots**:
- `app/api/products/*/route.ts`
- `app/api/categories/*/route.ts`
- Overlap with `lib/data/products.ts`, `lib/data/categories.ts`

## Phase 4: Provider Audit
- [ ] Audit `app/[locale]/locale-providers.tsx` for over-stacking
- [ ] Move contexts closer to usage where possible
- [ ] Reduce "client-adjacent" surface area

## Phase 5: Build Verification
- [ ] `pnpm build` succeeds
- [ ] Check for build warnings
- [ ] Verify output matches Vercel runtime expectations
- [ ] Remove `unoptimized: true` from images for production

**Gate**:
```bash
pnpm -s build
```

---

# AGENT 2 — Supabase

**Scope**: `lib/supabase/`, `supabase/`, RLS policies, types

**Key Files**:
- `lib/supabase/server.ts` — client helpers
- `lib/supabase/client.ts` — browser client
- `lib/supabase/middleware.ts` — session refresh
- `lib/supabase/database.types.ts` — generated types

## Phase 1: Security (CRITICAL — blocks release)

### 1.1 Lock down `public.profiles`
- [ ] Re-audit `profiles` vs `private_profiles` exposure (see `audit/supabase.md`)
- [ ] If needed: create `public_profiles` view with safe columns only and switch public reads to it
- [ ] If needed: tighten `public.profiles` SELECT policy (authenticated own-row + admin/service role)

**Evidence**: Policy `SELECT true` + anon select privilege on `public.profiles`

### 1.2 Restrict `public.category_stats`
- [x] Revoke anon/auth privileges on materialized view (`public.category_stats_mv`)
- [x] Expose safe alternative: `public.category_stats` (SECURITY INVOKER view) → `public.get_category_stats()` (SECURITY DEFINER)

**Evidence**: Advisor `materialized_view_in_api`

### 1.3 Enable leaked password protection
- [ ] Supabase Dashboard → Authentication → Settings
- [ ] Enable "Leaked Password Protection"
- [ ] Document completion

**Evidence**: Advisor `auth_leaked_password_protection`

### 1.4 Harden anon privileges (public schema)
- [x] Revoke anon DML on all tables/sequences in `public`
- [x] Revoke EXECUTE on all `public` functions from PUBLIC/anon, then allow-list only required anon RPCs

## Phase 2: Type Safety
- [ ] Regenerate types:
  ```bash
  supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
  ```
- [ ] Remove `as any` casts that new types make unnecessary
- [ ] Update imports if type shapes changed
- [ ] Fix `lib/data/categories.ts` line 949 `(supabase as any)`

## Phase 3: Client Usage Audit
- [ ] Verify correct client selection per use case:

| Use Case | Client |
|----------|--------|
| Server Components / Actions | `createClient()` |
| Cached/public reads | `createStaticClient()` |
| Route handlers | `createRouteHandlerClient()` |
| Admin (bypass RLS) | `createAdminClient()` |
| Client Components | `createBrowserClient()` |

- [ ] No `select('*')` in hot paths
- [ ] Never import `createAdminClient()` in `"use client"` modules

## Phase 4: RLS Policy Audit
- [ ] RLS enabled on all user-data tables
- [ ] Check for `(SELECT auth.uid())` pattern in policies (performance)
- [ ] Document any tables with RLS disabled and justify

**Reference**: `supabase/schema.sql`

## Phase 5: Advisor Cleanup
- [x] Run Supabase security advisors
- [x] Run Supabase performance advisors
- [ ] Review unused index advisories (don't auto-delete)
- [x] Confirm warnings cleared or documented (remaining: leaked password protection)

**Gate**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
```

---

# AGENT 3 — Tailwind v4 + shadcn/ui

**Scope**: `app/globals.css`, `app/*.css`, `components/ui/`, design tokens

**Key Files**:
- `app/globals.css` — primary token source
- `app/legacy-vars.css` — potential drift
- `app/shadcn-components.css` — potential drift
- `app/utilities.css` — utility classes
- `components.json` — shadcn config

## Phase 1: Token Consolidation
- [ ] Audit token sources for duplication/drift:
  - `app/globals.css` (primary)
  - `app/legacy-vars.css`
  - `app/shadcn-components.css`
  - `app/utilities.css`
- [ ] Migrate necessary tokens to `globals.css`
- [ ] Delete or minimize legacy files
- [ ] Remove unused tokens

## Phase 2: Drift Cleanup
- [ ] Run drift scans:
  ```bash
  pnpm -s styles:scan
  pnpm -s styles:gate
  ```
- [ ] Fix any palette/gradient findings
- [ ] Replace arbitrary values with tokens:
  - `z-[...]` → semantic z-index
  - `max-w-[...]` → utility class in `utilities.css`
- [ ] Remove hardcoded colors:
  - `bg-white` → `bg-background`
  - `text-black` → `text-foreground`
  - `border-gray-*` → `border-border`

**Target**:
- 0 gradient violations
- < 20 arbitrary values

## Phase 3: Component Recipes
- [ ] Enforce `PageShell` wrapper across all routes
- [ ] Create variant recipes for repeated UI:
  - Product cards (grid/list/horizontal)
  - Badges (status, condition, trust)
  - Chips (filters, categories)
- [ ] Touch target compliance:
  - All tappable elements ≥ 32px
  - Use `h-touch-*` utilities
  - Mobile buttons use `h-touch-lg` (48px) for primary CTAs

## Phase 4: Boundary Enforcement
- [ ] `components/ui/` has NO app hooks/imports (shadcn primitives only)
- [ ] `components/shared/` uses only ui primitives + lib utilities
- [ ] Route-private components stay in `_components/`
- [ ] No data fetching in `components/`

**Gate**:
```bash
pnpm -s styles:gate
pnpm -s exec tsc -p tsconfig.json --noEmit
```

---

# AGENT 4 — TypeScript

**Scope**: All `.ts`/`.tsx` files, `tsconfig.json`, type safety

**Config**:
- TypeScript: `5.9.3`
- `strict: true`
- `exactOptionalPropertyTypes: true`
- `noUncheckedIndexedAccess: true`

## Phase 1: `as any` Removal
- [ ] Find all occurrences:
  ```bash
  grep -r "as any" lib/ app/ components/ --include="*.ts" --include="*.tsx"
  ```
- [ ] Fix each occurrence or document why it's necessary
- [ ] Priority fixes:
  - `lib/data/categories.ts` line 949 `(supabase as any)`
  - `app/api/payments/webhook/route.ts` line 55 `as any`

## Phase 2: Non-null Assertion Cleanup
- [ ] Find all `!` assertions:
  ```bash
  grep -rn "!\." lib/ app/ components/ --include="*.ts" --include="*.tsx"
  ```
- [ ] Replace with proper null checks or early returns
- [ ] Priority fix:
  - `app/[locale]/(checkout)/_actions/checkout.ts` line 106

## Phase 3: Strict Compliance
- [ ] Review `exactOptionalPropertyTypes` violations
- [ ] Check `noUncheckedIndexedAccess` patterns
- [ ] Ensure no implicit `any` in function parameters

## Phase 4: Gate Enforcement
- [ ] Run baseline check:
  ```bash
  pnpm ts:gate
  ```
- [ ] Update baseline if intentional exceptions:
  ```bash
  pnpm ts:gate:baseline
  ```
- [ ] Document any remaining `as any` with justification

**Gate**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
```

---

# AGENT 5 — Dead Code Cleanup (Knip)

**Scope**: Files identified by Knip, unused exports/deps

**Reference**: `cleanup/knip-report.txt`

## Phase 1: Delete Dead Files (49 files)

### P0-1: Dead Header (574 lines)
- [ ] Delete `components/layout/header/site-header-unified.tsx`
- [ ] Verify: `grep -r "site-header-unified" . --include="*.tsx"` returns nothing

### P0-2: Dead Desktop Components (7 files)
- [ ] Delete `components/desktop/desktop-category-nav.tsx`
- [ ] Delete `components/desktop/desktop-category-rail.tsx`
- [ ] Delete `components/desktop/desktop-filter-tabs.tsx`
- [ ] Delete `components/desktop/desktop-hero-cta.tsx`
- [ ] Delete `components/desktop/hero-search.tsx`
- [ ] Delete `components/desktop/marketplace-hero.tsx`
- [ ] Delete `components/desktop/filters-sidebar.tsx` (if exists)

### P0-3: Dead Promo/Section Components (6 files)
- [ ] Delete `components/promo/promo-card.tsx`
- [ ] Delete `components/sections/index.ts`
- [ ] Delete `components/sections/newest-listings-section.tsx`
- [ ] Delete `components/sections/newest-listings.tsx`
- [ ] Delete `components/sections/sign-in-cta.tsx`
- [ ] Delete `components/shared/trust-bar.tsx`

### P0-4: Dead Mobile Product Components (15 files)
- [ ] Delete `components/mobile/product/index.ts`
- [ ] Delete `components/mobile/product/mobile-bottom-bar.tsx`
- [ ] Delete `components/mobile/product/mobile-buyer-protection-badge.tsx`
- [ ] Delete `components/mobile/product/mobile-description-section.tsx`
- [ ] Delete `components/mobile/product/mobile-details-section.tsx`
- [ ] Delete `components/mobile/product/mobile-gallery-olx.tsx`
- [ ] Delete `components/mobile/product/mobile-hero-specs.tsx`
- [ ] Delete `components/mobile/product/mobile-price-block.tsx`
- [ ] Delete `components/mobile/product/mobile-price-location-block.tsx`
- [ ] Delete `components/mobile/product/mobile-quick-specs.tsx`
- [ ] Delete `components/mobile/product/mobile-seller-card.tsx`
- [ ] Delete `components/mobile/product/mobile-seller-trust-line.tsx`
- [ ] Delete `components/mobile/product/mobile-sticky-bar-enhanced.tsx`
- [ ] Delete `components/mobile/product/mobile-trust-block.tsx`
- [ ] Delete `components/mobile/product/mobile-urgency-banner.tsx`

### P0-5: Dead Filter Components (5 files)
- [ ] Delete `components/shared/filters/control-bar.tsx`
- [ ] Delete `components/shared/filters/desktop-filter-sidebar.tsx` (if exists)
- [ ] Delete `components/shared/filters/mobile-filters.tsx`
- [ ] Delete `components/shared/filters/quick-filter-chips.tsx`
- [ ] Delete `components/shared/filters/view-mode-toggle.tsx`

### P0-6: Dead Shared Product Components (7 files)
- [ ] Delete `components/shared/product/condition-badge.tsx`
- [ ] Delete `components/shared/product/item-specifics.tsx`
- [ ] Delete `components/shared/product/magnifier.tsx`
- [ ] Delete `components/shared/product/product-buy-box.tsx`
- [ ] Delete `components/shared/product/product-gallery-hybrid.tsx`
- [ ] Delete `components/shared/product/seller-banner.tsx`
- [ ] Delete `components/shared/product/sellers-note.tsx`

### P0-7: Dead Config Files (2 files)
- [ ] Delete `config/mega-menu-config.ts`
- [ ] Delete `config/subcategory-images.ts`

### P0-8: Dead App Components (4 files)
- [ ] Delete `app/[locale]/(main)/_components/more-ways-to-shop.tsx`
- [ ] Delete `app/[locale]/(main)/_components/promo-cards.tsx`
- [ ] Delete `app/[locale]/(main)/_components/sign-in-cta-skeleton.tsx`
- [ ] Delete `app/[locale]/(main)/cart/_components/mobile-cart-header.tsx`

### P0-9: Delete Demo Routes
- [ ] Delete `app/[locale]/demo/` folder entirely

**Gate after each batch**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
```

## Phase 2: Remove Unused Exports (21 exports)

### Sidebar exports (9)
- [ ] Remove from `components/layout/sidebar/sidebar.tsx`:
  - `SidebarGroupAction`
  - `SidebarInput`
  - `SidebarMenuAction`
  - `SidebarMenuBadge`
  - `SidebarMenuSkeleton`
  - `SidebarMenuSub`
  - `SidebarMenuSubButton`
  - `SidebarMenuSubItem`
  - `SidebarRail`
  - `SidebarSeparator`

### Table exports (2)
- [ ] Remove from `components/ui/table.tsx`:
  - `TableFooter`
  - `TableCaption`

### Toast exports (5)
- [ ] Remove from `components/ui/toast.tsx`:
  - `ToastProvider`
  - `ToastViewport`
  - `ToastTitle`
  - `ToastDescription`
  - `ToastClose`

### Other exports (5)
- [ ] Remove `BreadcrumbEllipsis` from `components/ui/breadcrumb.tsx`
- [ ] Remove `SheetClose` from `components/ui/sheet.tsx`
- [ ] Remove `permanentRedirect` from `i18n/routing.ts`
- [ ] Remove `getPathname` from `i18n/routing.ts`

## Phase 3: Remove Unused Types (5 types)
- [ ] Remove from `lib/ai/schemas/find-similar.ts`:
  - `FindSimilarRequest`
  - `FindSimilarExtracted`
- [ ] Remove from `lib/ai/schemas/sell-autofill.ts`:
  - `SellAutofillRequest`
  - `SellAutofillDraft`
- [ ] Remove `SmartAnchorNavPropsType` from `components/mobile/category-nav/smart-anchor-nav.tsx`

## Phase 4: Remove Unused Dependencies
- [ ] Remove packages:
  ```bash
  pnpm remove @ai-sdk/gateway @radix-ui/react-toggle
  ```
- [ ] Delete `capacitor.config.ts` (if mobile out of scope)
- [ ] Verify:
  ```bash
  pnpm install
  pnpm -s exec tsc -p tsconfig.json --noEmit
  ```

**Final gate**:
```bash
pnpm -s knip
```

---

# AGENT 6 — UI Components

**Scope**: Headers, ProductCard, filters, deduplication

**Reference**: `audit/UI_REFACTOR_PLAN_OPUS_2026-01-24.md`, `cleanup/dupes-report.txt`

## Phase 0: Baseline
- [ ] Create branch for large moves
- [ ] Capture baseline:
  ```bash
  pnpm -s styles:scan
  pnpm -s knip
  pnpm -s dupes
  ```
- [ ] Document golden routes to verify:
  - `/` (homepage)
  - `/search`
  - `/categories`
  - `/{username}` (store)
  - `/{username}/{productSlug}` (PDP)
  - `/assistant`
  - `/cart`

## Phase 1: Header Standardization

### 1.1 Document Header Matrix
- [ ] Create route → header variant matrix:

| Route | Variant | Notes |
|-------|---------|-------|
| `/` (homepage) | `homepage` | Pills row visible |
| `/search` | `default` | — |
| `/categories*` | `contextual` | Back + title |
| `/{username}/{productSlug}` | `product` | Product-specific |
| `/assistant` | `contextual` | Back + title |
| Other `(main)` | `default` | — |

### 1.2 Fix `/assistant` Header
- [ ] Update `components/layout/header/app-header.tsx` route detection
- [ ] Map `/assistant` to `contextual` variant
- [ ] Add `AssistantHeaderSync` client component (pattern like `ProductHeaderSync`):
  - Set contextual title (translated)
  - Set back href (`/` or `/search`)

### 1.3 Unify Shared Header Parts
- [ ] Extract shared "top row" into single component:
  - Hamburger + logo + search trigger + actions
- [ ] Make pills row optional (homepage only)
- [ ] Delete redundant header file(s) after migration

**Verify**:
- [ ] `/assistant` shows intended header (mobile + desktop)
- [ ] Homepage still shows pills
- [ ] Header drawers + search overlay still work

## Phase 2: ProductCard Consolidation

### 2.1 Define Variants
- [ ] `grid` — current default
- [ ] `list` — current `ProductCardList`
- [ ] `horizontal` — current `HorizontalProductCard`

### 2.2 Implement Single API
- [ ] Use `cva` (class-variance-authority) for variant classes
- [ ] Share subcomponents (image, price, badges)
- [ ] Single entry point: `components/shared/product/product-card.tsx`

### 2.3 Migrate Usage Sites
- [ ] `components/desktop/desktop-home.tsx` (list)
- [ ] `components/mobile/mobile-home.tsx` (horizontal)
- [ ] Search results
- [ ] Category browse

### 2.4 Delete Redundant Files
- [ ] Delete `components/shared/product/product-card-list.tsx`
- [ ] Delete `components/mobile/horizontal-product-card.tsx`

## Phase 3: Rename v2 Files

**Confirm no V1 in active use first**

- [ ] `components/desktop/product/desktop-buy-box-v2.tsx` → `desktop-buy-box.tsx`
- [ ] `components/desktop/product/desktop-gallery-v2.tsx` → `desktop-gallery.tsx`
- [ ] `components/mobile/product/mobile-bottom-bar-v2.tsx` → `mobile-bottom-bar.tsx`
- [ ] `components/mobile/product/mobile-gallery-v2.tsx` → `mobile-gallery.tsx`
- [ ] `components/layout/sidebar/sidebar-menu-v2.tsx` → `sidebar-menu.tsx`

**One rename per batch, update all imports**

## Phase 4: Deduplication (jscpd hotspots)

**Clone stats**: 310 clones, 5410 duplicated lines (3.6%)

### Priority targets:
- [ ] Product card list vs grid: extract shared builders
- [ ] Filters modal/list/hub: consolidate patterns
- [ ] Drawer/dropdown overlap: cart + wishlist patterns

**Gate**:
```bash
pnpm -s dupes
# Target: < 1% duplication
```

---

# AGENT 7 — Stripe + Payments

**Scope**: `/api/*webhook*`, Stripe Connect, checkout

## Phase 1: Webhook Signature Verification

### All webhooks must verify signatures
- [ ] `/api/checkout/webhook/route.ts`:
  ```typescript
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );
  ```
- [ ] `/api/payments/webhook/route.ts` — same pattern
- [ ] `/api/subscriptions/webhook/route.ts` — same pattern

## Phase 2: Idempotency Audit

### Prevent duplicate processing
- [ ] Orders: check `stripe_payment_intent_id` before insert
- [ ] Boosts: check `stripe_checkout_session_id` before insert
- [ ] Subscriptions: check `stripe_subscription_id` before insert/update

**Pattern**:
```typescript
const existing = await supabase
  .from('orders')
  .select('id')
  .eq('stripe_payment_intent_id', paymentIntentId)
  .single();

if (existing.data) {
  return; // Already processed
}
```

## Phase 3: Connect Onboarding
- [ ] `/api/connect/onboarding` returns 200 (not 500)
- [ ] Individual account type works
- [ ] Business/Company account type works
- [ ] Onboarding redirect URLs are correct:
  - Success URL
  - Refresh URL

## Phase 4: Environment Variables
- [ ] Verify all required env vars set:

| Variable | Location | Required |
|----------|----------|----------|
| `STRIPE_SECRET_KEY` | Server only | ✓ |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client | ✓ |
| `STRIPE_WEBHOOK_SECRET` | Server | ✓ |
| `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET` | Server | ✓ |

- [ ] Verify no secrets in client bundles:
  ```bash
  grep -r "STRIPE_SECRET_KEY" .next/
  # Should return nothing
  ```

**Gate**:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:unit
```

---

# Execution Schedule

## Recommended Order

```
┌─────────────────────────────────────────────────────────┐
│  WEEK 1: Foundation Cleanup                             │
├─────────────────────────────────────────────────────────┤
│  Day 1-2: AGENT 5 (Dead Code) — Phase 1-2               │
│  Day 3-4: AGENT 5 (Dead Code) — Phase 3-4               │
│  Day 5:   AGENT 4 (TypeScript) — Phase 1-2              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  WEEK 2: Backend & Framework                            │
├─────────────────────────────────────────────────────────┤
│  Day 1-2: AGENT 2 (Supabase) — Phase 1 (Security)       │
│  Day 3:   AGENT 2 (Supabase) — Phase 2-3                │
│  Day 4-5: AGENT 1 (Next.js) — Phase 1-3                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  WEEK 3: UI & Design System                             │
├─────────────────────────────────────────────────────────┤
│  Day 1-2: AGENT 3 (Tailwind) — All phases               │
│  Day 3-4: AGENT 6 (UI Components) — Phase 1-2           │
│  Day 5:   AGENT 6 (UI Components) — Phase 3-4           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  WEEK 4: Payments & Final QA                            │
├─────────────────────────────────────────────────────────┤
│  Day 1-2: AGENT 7 (Stripe) — All phases                 │
│  Day 3:   Final gate runs                               │
│  Day 4-5: Manual QA + fixes                             │
└─────────────────────────────────────────────────────────┘
```

## Parallel Execution (if multiple agents available)

```
Stream A: AGENT 5 → AGENT 4 → AGENT 1
Stream B: AGENT 2 → AGENT 3 → AGENT 6
Stream C: AGENT 7 (after Stream A/B merge)
```

---

# Final Gates (All must pass before production)

```bash
# Code quality
pnpm -s lint                   # 0 errors (warnings OK)
pnpm -s exec tsc -p tsconfig.json --noEmit  # 0 errors

# Tests
pnpm test:unit                 # All pass
pnpm test:e2e:smoke            # All pass

# Build
pnpm -s build                  # Success, no warnings

# Cleanup
pnpm -s knip                   # Clean (or documented ignores in knip.json)
pnpm -s styles:gate            # Clean (0 violations)
pnpm -s dupes                  # < 1% duplication
```

---

# Per-Agent Rules (Non-Negotiable)

1. **Small batches** — max 3 files per commit
2. **Run gates after every batch** — typecheck minimum
3. **Don't cross domains** — Agent 1 doesn't touch Supabase code, etc.
4. **Document exceptions** — if something can't be fixed, add to `knip.json` or create issue in `ISSUES.md`
5. **Update tracking** — mark tasks done in this file as you complete them
6. **No secrets in logs** — ever
7. **All UI strings via next-intl** — `messages/en.json` + `messages/bg.json`
8. **No gradients** — solid surfaces + subtle borders only
9. **No arbitrary Tailwind** — use semantic tokens from `globals.css`

---

# Completion Tracking

## Overall Progress

| Agent | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Phase 5 | Status |
|-------|---------|---------|---------|---------|---------|--------|
| Agent 1 (Next.js) | [ ] | [ ] | [ ] | [ ] | [ ] | Not started |
| Agent 2 (Supabase) | [ ] | [ ] | [ ] | [ ] | [ ] | Not started |
| Agent 3 (Tailwind) | [ ] | [ ] | [ ] | [ ] | — | Not started |
| Agent 4 (TypeScript) | [ ] | [ ] | [ ] | [ ] | — | Not started |
| Agent 5 (Dead Code) | [ ] | [ ] | [ ] | [ ] | — | Not started |
| Agent 6 (UI) | [ ] | [ ] | [ ] | [ ] | — | Not started |
| Agent 7 (Stripe) | [ ] | [ ] | [ ] | [ ] | — | Not started |

## Metrics After Refactor (fill in as completed)

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Dead files | 49 | — | 0 |
| Unused exports | 26 | — | 0 |
| Client components | 277 | — | <150 |
| Code duplication | 3.6% | — | <1% |
| `as any` casts | TBD | — | 0 |
| Typecheck errors | 0 | — | 0 |
| Lint errors | 0 | — | 0 |
| E2E smoke | Pass | — | Pass |

---

# Quick Reference

## Key Commands

```bash
# Development
pnpm dev                       # Dev server
pnpm build                     # Production build

# Testing
pnpm test:unit                 # Vitest unit tests
pnpm test:e2e                  # Playwright full suite
pnpm test:e2e:smoke            # Playwright smoke only

# Quality gates
pnpm lint                      # ESLint
pnpm -s exec tsc -p tsconfig.json --noEmit  # Typecheck

# Cleanup scans
pnpm -s knip                   # Dead code
pnpm -s dupes                  # Duplication
pnpm -s styles:scan            # Tailwind drift
pnpm -s styles:gate            # Tailwind gate
```

## Key Files

| Purpose | File |
|---------|------|
| Agent instructions | `CLAUDE.md` |
| Active tasks | `TASKS.md` |
| Open issues | `ISSUES.md` |
| Architecture | `ARCHITECTURE.md` |
| Design system | `DESIGN.md` |
| Testing guide | `TESTING.md` |
| Production checklist | `PRODUCTION.md` |
| This plan | `opus_tasks.md` |

## Audit Reports

| Report | Location |
|--------|----------|
| Knip (dead code) | `cleanup/knip-report.txt` |
| jscpd (dupes) | `cleanup/dupes-report.txt` |
| Tailwind palette | `cleanup/palette-scan-report.txt` |
| Tailwind arbitrary | `cleanup/arbitrary-scan-report.txt` |
| Next.js audit | `audit/nextjs.md` |
| Supabase audit | `audit/supabase.md` |
| Tailwind audit | `audit/tailwind-shadcn.md` |
| TypeScript audit | `audit/typescript-tooling.md` |
| UI audit | `audit/UI_COMPONENT_AUDIT_2026-01-24.md` |
| UI refactor plan | `audit/UI_REFACTOR_PLAN_OPUS_2026-01-24.md` |
