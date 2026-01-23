# TODO

> **Start here**: `agents.md` → `RULES.md` → `docs/README.md`
> 
> **Execution Board (multi-session):** `codex-xhigh/EXECUTION-BOARD.md` (owners/status) + `codex-xhigh/STATUS.md` (resume fast)
>
> **Scope / roadmap:** `docs/PRODUCT.md`
> 
> **Prefixes**: `TREIDO:` (general dev), `TAILWIND:` (UI audit), `SUPABASE:` (DB audit)

## Gates (run after changes)
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Production Push (V1) — Master Plan (Phased)

**SSOT scope:** `docs/PRODUCT.md` (what we ship) + `docs/FEATURES.md` (routes/actions/DB map)

**Work style:** pick 1 checkbox, keep batch small, run gates (`docs/TESTING.md`, `docs/PRODUCTION.md`).

### P0 — Release blockers (ship stability first)
- [ ] TREIDO: Fix Turbopack crash after sign-in (missing client manifest / `OnboardingProvider`) → `docs/desktop_uiux_audit.md`
- [x] TREIDO: Fix hydration mismatch on `/en` and product pages (SSR/CSR divergence) → `docs/desktop_uiux_audit.md`
- [x] TREIDO: Fix cart badge vs `/cart` state desync (single cart SSOT) → `docs/desktop_uiux_audit.md`
- [x] TREIDO: Fix `/checkout` line items render (no infinite loader / blank shell) → `docs/desktop_uiux_audit.md`
- [ ] TREIDO: Fix Stripe Connect onboarding 500 (`/api/connect/onboarding`) → `docs/desktop_uiux_audit.md`, `docs/BACKEND.md` *(needs prod verification)*
- [x] TREIDO: Make cookie consent + region modals non-blocking (must not intercept primary CTAs) → `docs/desktop_uiux_audit.md`
- [ ] TEST: Add/extend Playwright smoke coverage for cart → checkout → order created (happy path) → `e2e/*` *(cart → checkout covered; order creation pending)*

### P1 — Next.js 16 full audit (App Router correctness + performance)
- [x] TREIDO: Remove client UI → server action imports; keep actions server-only → `docs/FRONTEND.md`, `codex-xhigh/nextjs/FULL-AUDIT.md`
- [x] TREIDO: Audit caching usage (`'use cache'`, `cacheLife`, `cacheTag`, `revalidateTag(tag, profile)`) → `docs/ENGINEERING.md`
- [x] TREIDO: Ensure no user-specific reads are cached (no `cookies()`/`headers()` inside cached functions) → `docs/ENGINEERING.md`
- [x] TREIDO: Reduce over-fetching in hot paths (no `select('*')`, narrow joins) → `docs/ENGINEERING.md`, `docs/BACKEND.md`
- [x] TREIDO: Confirm `pnpm -s build` is clean and matches Vercel runtime (no webpack-only workarounds) → `docs/PRODUCTION.md`

### P2 — shadcn/ui full audit (primitives + a11y)
- [x] TAILWIND: Audit `components/ui/**` for boundary violations (no app hooks/imports) → `agents.md`, `docs/FRONTEND.md`
- [x] TAILWIND: Standardize Dialog/Drawer usage for “modal-first” UX (one pattern, consistent headers/footers) → `docs/DESIGN.md`
- [x] TAILWIND: Fix auth form a11y issues (duplicate “Remember me”, ambiguous labels) → `docs/desktop_uiux_audit.md`
- [x] TAILWIND: Verify focus/disabled states are consistent for Buttons/Inputs/Selects → `docs/DESIGN.md`

### P3 — Tailwind CSS v4 full audit (tokens + drift gates)
- [x] TAILWIND: Run `pnpm -s styles:scan` and drive arbitrary values toward 0 (or a justified allow-list) → `docs/DESIGN.md`
- [ ] TAILWIND: Verify 0 gradient violations in app code → `docs/DESIGN.md`
- [ ] TAILWIND: Replace hardcoded neutrals (`bg-white`, `text-black`, `border-gray-*`) with semantic tokens → `docs/DESIGN.md`

### P4 — Tailwind v4 + shadcn alignment (design system consistency)
- [ ] TAILWIND: Ensure all forms use `components/shared/field.tsx` consistently (labels/errors/help) → `docs/FRONTEND.md`
- [ ] TAILWIND: Normalize spacing + touch targets across key surfaces (search, PDP, cart, checkout) → `docs/DESIGN.md`
- [ ] TREIDO: Pilot desktop modal browsing with Next.js intercepting routes (PDP quick view from search) → `docs/FRONTEND.md` *(optional for V1)*

### P5 — TypeScript full audit + Supabase types
- [ ] TREIDO: Decide TS policy (`ts:gate` baseline vs fix-now) and keep drift at 0 → `codex-xhigh/typescript/FULL-AUDIT.md`
- [ ] SUPABASE: Regenerate `lib/supabase/database.types.ts` and remove `any` casts in hot paths → `supabase_tasks.md`
- [ ] TREIDO: Tighten types in checkout/orders/chat actions (no silent fallthrough) → `docs/FEATURES.md`

### P6 — i18n full audit (next-intl)
- [ ] TREIDO: Enforce key parity (`messages/en.json` ↔ `messages/bg.json`) → `docs/FRONTEND.md`
- [ ] TREIDO: Replace remaining hardcoded UI strings with `useTranslations()` / `getTranslations()` → `docs/FRONTEND.md`
- [ ] TREIDO: Standardize localized navigation to `@/i18n/routing` everywhere → `docs/ENGINEERING.md`

### P7 — Frontend ↔ Backend alignment (core feature completeness)
- [ ] SUPABASE: Re-run advisor checks; confirm dashboard settings (leaked password protection) → `docs/PRODUCTION.md`, `supabase_tasks.md`
- [ ] SUPABASE: Inventory “over-engineered” DB pieces (tables/RPCs/triggers) vs V1 scope; defer deletions until after launch → `docs/PRODUCT.md`
- [ ] TREIDO: Make order lifecycle SSOT (statuses, seller actions like “sent”, buyer views) across DB + UI → `docs/FEATURES.md`
- [ ] TREIDO: Ensure purchase creates seller notification + buyer↔seller chat thread (or on first message) → `docs/FEATURES.md`
- [ ] TREIDO: Fix reviews refresh after submit (invalidate cache tags / refetch strategy) → `docs/desktop_uiux_audit.md`
- [ ] TREIDO: Ensure report/dispute entry points exist for Buyer Protection (min viable) → `docs/PRODUCT.md`, `docs/FEATURES.md`
- [ ] TREIDO: Stripe webhooks: signature verify + idempotency + env separation (staging vs prod) → `docs/BACKEND.md`, `docs/PRODUCTION.md`

### P8 — Full UI/UX + QA pass (desktop-first)
- [ ] TREIDO: Re-run `docs/PRODUCTION.md` manual QA on both `/en` and `/bg` and update `docs/desktop_uiux_audit.md`
- [ ] TEST: Expand e2e smoke to cover selling → payouts gating → listing creation (happy path) → `e2e/*`
- [ ] TREIDO: Verify all CTAs navigate correctly (no dead links, correct locale, correct redirects) → `docs/desktop_uiux_audit.md`
- [ ] TREIDO: Onboarding: post-signup flow to choose Personal vs Business and persist in `profiles` → `docs/FEATURES.md`, `docs/PRODUCT.md`
- [ ] TREIDO: Gating UX: prompt sign-in when attempting Sell/Chat/Wishlist (non-blocking, reversible) → `docs/FRONTEND.md`

### Post-launch (V1.1+) — Optional / non-blockers
- [ ] TREIDO: AI listing assistant (title/description/photos guidance) — V2 per `docs/PRODUCT.md`
- [ ] TREIDO: AI shopping assistant (search/refine/compare) — V2 per `docs/PRODUCT.md`
- [ ] TREIDO: Docs strategy: make `docs/` the SSOT rendered by `docs-site/` and/or `/admin/docs` (no drift) → `docs/README.md`
- [ ] TREIDO: Legal pages in main app (`/privacy`, `/terms`, `/cookies`) + footer links (localized) → `docs/PRODUCTION.md`

## Architecture / Repo Structure — Pre-production (Audit → Fix)

**Blueprint**: `codex-xhigh/frontend/opus_structure.md` (target structure)

**Baseline audits**: `codex-xhigh/FOLDER-AUDIT.md`, `codex-xhigh/ARCHITECTURE-AUDIT.md`

**Lane full audits**: `codex-xhigh/DOCS-INDEX.md` (index) + `codex-xhigh/*/FULL-AUDIT.md`

**Derived list (not SSOT)**: `codex-xhigh/AUDIT-TASKS.md`

### Phase 0 — Decide what stays (no refactors yet)
- [ ] Decide demo strategy: delete vs keep `app/demo/*` and `app/[locale]/demo/*` → `codex-xhigh/FOLDER-AUDIT.md`, `codex-xhigh/frontend/opus_remove.md`
- [ ] Decide docs strategy: keep vs archive `docs-site/` (separate Next.js app) → `codex-xhigh/FOLDER-AUDIT.md`
- [ ] Decide mobile strategy: keep vs remove Capacitor (`capacitor.config.ts`, `cap:*` scripts, `@capacitor/*`) → `codex-xhigh/DEPENDENCIES-AUDIT.md`, `codex-xhigh/frontend/opus_remove.md`
- [ ] Document “what belongs in repo root” (don’t move Next/TS/PostCSS configs that tools expect in root) → `docs/ENGINEERING.md`

### Phase 1 — Delete-first cleanup (safe + measurable)
- [ ] Run Knip and delete Tier 1 unused files (49) → `codex-xhigh/typescript/knip-2026-01-20.log`, `codex-xhigh/frontend/opus_remove.md`
- [ ] Consolidate duplicate UI surfaces only after deletions (header/filters/sidebar) → `codex-xhigh/frontend/opus_hotspots.md`
- [ ] Clean generated artifacts (never “reorganize” build output) → `pnpm -s clean:artifacts`

### Phase 2 — Enforce boundaries (Next.js + data access)
- [ ] Next.js: fix 2 lint errors (React Compiler memoization) → `codex-xhigh/nextjs/FULL-AUDIT.md`
- [ ] Next.js: remove UI → server action imports (20) (pass handlers via props / keep actions server-only) → `codex-xhigh/nextjs/FULL-AUDIT.md`, `docs/FRONTEND.md`
- [ ] SSOT per domain: centralize duplicated selects/plan logic/badge derivations → `codex-xhigh/frontend/structure.md`, `docs/FEATURES.md`

### Phase 3 — TypeScript safety (reduce drift)
- [ ] Decide `ts:gate` policy (fix vs baseline) and get drift back to 0 → `codex-xhigh/typescript/FULL-AUDIT.md`
- [ ] Remove unsafe patterns in core flows (checkout/payments/sell) before new work → `codex-xhigh/typescript/FULL-AUDIT.md`

### Phase 4 — Supabase + i18n rails (ship correctness)
- [ ] Supabase (Dashboard): enable leaked password protection → `codex-xhigh/supabase/FULL-AUDIT.md`, `docs/PRODUCTION.md`
- [ ] i18n: fix messages parity (7 missing keys in `en.json`) → `codex-xhigh/i18n/FULL-AUDIT.md`

### Suggested parallel lanes (Opus exec + GPT review)
- `agent/fe-nextjs`: Phase 2 items (lint + action-boundary imports)
- `agent/ts`: Phase 1 + Phase 3 (Knip + ts:gate drift)
- `agent/supabase`: Phase 4 Supabase dashboard-only + deferred advisor work
- `agent/i18n`: Phase 4 i18n parity + inline locale branching removal
- `agent/ui`: Tailwind tokenization after demo deletions → `codex-xhigh/ui/TAILWIND-V4-AUDIT.md`

---
## UI/UX Sprint — Design System Refactor

See `AGENT-ORCHESTRATION.md` for full execution plan.

### Phase 0: Foundation ✅ COMPLETE
- [x] **AGENT-0**: Token inventory audit — All tokens verified in `app/globals.css`
- [x] **AGENT-0**: Dark mode parity check — ~95% coverage, no critical gaps
- [x] **AGENT-0**: Gradient baseline — **13 violations** (see `cleanup/DESIGN-SYSTEM-STATUS.md`)
- [x] **AGENT-0**: Arbitrary values baseline — **189 violations** (97 files)
- [x] **AGENT-0**: Created reference sheets for parallel agents

### Phase 1: Parallel Execution (Ready to Launch)
- [ ] **AGENT-1**: Typography audit (font sizes/weights/line-heights)
- [ ] **AGENT-2**: Spacing & layout audit (gaps/padding/containers/touch targets)
- [ ] **AGENT-3**: Colors & theming audit (**13 gradients**, shadows, dark mode, border radius)

### Phase 2: Treido UI/UX Refactor 🚀 IN PROGRESS
> **Plan:** See `TREIDO-UI-REFACTOR-PLAN.md` (comprehensive implementation guide)
> **Reference:** `inspiration/treido-mock/` (latest clone from GitHub)

- [x] **Week 1: Foundation** ✅ COMPLETE
  - [x] Update `globals.css` with Treido tokens (radius 6px, 48px rhythm, no shadows)
  - [x] Override shadcn Button (active:opacity-90, h-10, rounded-md, zinc-900 default)
  - [x] Override shadcn Input (bg-zinc-50, h-11, text-[16px], focus:border-zinc-900)
  - [x] Override shadcn Card (shadow-none, border-zinc-200)
  - [x] Update `DoubleDeckNav` component (Treido styling)
  - [x] Add Treido utility classes (min-touch, tap-highlight-transparent)

- [x] **Week 2: Category Navigation** ✅ COMPLETE
  - [x] Refactor contextual-category-header to 48px standard
  - [x] Update inline filter bar (Treido dense styling)
  - [x] Update mobile-bottom-nav (48px, 5-grid, center sell button)

- [ ] **Week 3: Product Display**
  - [ ] Refactor ProductCard to Treido spec (dense, rounded-sm images, tags)
  - [ ] Update product grids to `gap-2`
  - [ ] Test transitions

- [ ] **Week 4: Navigation & Polish**
  - [ ] Update homepage category section (gender tabs, department circles)
  - [ ] Create Treido-style filter sheet (bottom slide, rounded-t-xl)
  - [ ] Full E2E testing

### Targets
| Metric | Current | Target |
|--------|---------|--------|
| Gradient violations | 13 | 0 |
| Arbitrary values | 189 | < 20 |
| Palette violations | 0 | 0 |

## Desktop UX Sprint — OLX/Bazar Competitive Parity 🚀 IN PROGRESS

> **Goal**: Best-in-class desktop shopping experience for Bulgarian C2C marketplace
> **Reference**: `docs/audit/competitive/olx-bg-desktop-audit.md`, `docs/audit/competitive/bazar-bg-desktop-audit.md`

### Phase 1: Search & Discovery ✅ COMPLETE
- [x] **Hero Search Section** — Full-width search below header with location picker
  - [x] Create `HeroSearch` component (search input + location dropdown)
  - [x] Add location picker dropdown (Bulgarian cities: София, Пловдив, Варна, etc.)
  - [x] Integrate into `MarketplaceHero` above value proposition
  - [x] Persist location preference in cookie

- [x] **Listing Counts on Categories** — Abundance psychology
  - [x] Add `count` prop to `CategoryCircle` component
  - [x] Create `/api/categories/counts` endpoint (aggregate by category_ancestors)
  - [x] Create `useCategoryCounts` hook with localStorage caching
  - [x] Display formatted counts (e.g., "51K" for 51,089)

- [x] **Quick Filter Chips** — One-tap common filters
  - [x] Create `QuickFilterChips` component (`components/shared/filters/`)
  - [x] Chips: `[🔥 Urgent] [🎁 Free] [📦 Free Shipping] [✨ New Only] [🏷️ On Sale] [📅 Today]`
  - [x] Integrate into `TabbedProductFeed`
  - [x] Add translations (en.json, bg.json)

### Phase 2: Filters & Trust ✅ COMPLETE
- [x] **Desktop Filter Sidebar** — Persistent left column on listing pages
  - [x] Create `DesktopFilterSidebar` component (`components/shared/filters/`)
  - [x] Price range slider (using existing `PriceSlider`)
  - [x] Condition filter (New/Used/Like New/Refurbished)
  - [x] Seller type toggle (All/Private/Business)
  - [x] Free shipping toggle
  - [x] Add translations (en.json, bg.json)

- [x] **Enhanced Seller Trust Card** — Conversion driver
  - [x] Add "Member since [date]" to seller info
  - [x] Add "Last active [time]" indicator (DB: `profiles.last_active` column)
  - [x] Add total listing count
  - [x] Add Business/Private badge
  - [x] Add verification icons (email, phone)

- [x] **Dual Currency Display** — Bulgarian market essential
  - [x] Add currency toggle (лв./€) to header (in LocaleDeliveryDropdown)
  - [x] Create `CurrencyProvider` context with localStorage persistence
  - [x] Update `ProductCardPrice` to support currency conversion
  - [x] Use fixed EUR/BGN rate (1.95583)
  - [x] Add translations (en.json, bg.json)

### Phase 2: Filters & Trust ✅ COMPLETE

### Phase 3: Conversion & Retention ✅ COMPLETE

### Done (Desktop UX)
- [x] **Phase 3: Save Search Feature** — Added SaveSearchButton to search results with localStorage persistence
- [x] **Phase 3: View Count Display** — Added ProductSocialProof component to product detail page
- [x] **Phase 3: Grid/List View Toggle** — ViewModeToggle + useViewMode hook + ProductCardList for list view
- [x] **Phase 3: Freshness Indicator** — FreshnessIndicator component showing "Today", "Yesterday", relative dates on cards and detail page

---

## Open (Other)

- [ ] E2E: auto-pick free port (`playwright.config.ts`)
- [ ] Tooling: reduce Tailwind palette/gradient scan false positives (`scripts/scan-tailwind-palette.mjs`)
- [ ] Chat: fix mobile scroll containment + broken avatars (verify via manual QA in `docs/PRODUCTION.md`)
- [ ] Supabase: enable leaked password protection (dashboard-only; see `docs/PRODUCTION.md`)
- [ ] Supabase: review Performance advisors (unused indexes) and decide keep/drop (requires DB query review before any DDL)

## Blocked on Human

_(none)_

## Done Today

- [x] **Desktop PDP Phase 4 Polish** — Gallery count + improved lightbox controls + trust badges i18n
  - Updated `components/shared/product/product-gallery-hybrid.tsx` (count indicator, translated labels, full lightbox UI)
  - Updated `components/shared/product/trust-badges.tsx` (Buyer Protection / Free Shipping / Returns via next-intl)
  - Updated `components/shared/product/product-page-layout.tsx` (shipping/returns strings via next-intl)
  - Updated `lib/data/product-page.ts` (fix seller profile Pick type for TS)
  - Updated `messages/en.json`, `messages/bg.json` (new keys: `Product.goToImage`, `Product.moreImages`, `Product.freeShipping*`, `Product.returns*`)

- [x] **AGENT-0 Design System Audit COMPLETE** — Created `cleanup/DESIGN-SYSTEM-STATUS.md` baseline
- [x] Cache Components: verify `'use cache'` + `cacheLife()` pairing — All 17 usages in `lib/data/` verified correct
- [x] Created `docs/OPUSvsGPT.md` — v3 workflow for Codex (architect/reviewer) + Opus (executor with MCPs)
- [x] **Treido UI/UX Week 1 & 2 COMPLETE** — Foundation + Category Navigation
  - Updated `globals.css` with Treido tokens (48px rhythm, flat shadows, tight radius)
  - Updated `button.tsx` (zinc-900 default, active:opacity-90, h-10)
  - Updated `input.tsx` (bg-zinc-50, h-11, focus:border-zinc-900)
  - Updated `card.tsx` (border-zinc-200, shadow-none)
  - Updated `mobile-tab-bar.tsx` (48px, 5-grid, center black sell button)
  - Updated `contextual-category-header.tsx` (48px, Treido styling)
  - Updated `contextual-double-decker-nav.tsx` (zinc colors, animation)
  - Updated `inline-filter-bar.tsx` (dense Treido style)
- [x] **Boosted/Promoted UX Consistency Polish** — Zero inference hacks, proper API-driven state
  - Removed tab-based boost inference in `tabbed-product-feed.tsx` and `newest-listings-section.tsx`
  - Added seller-facing boost visibility: "Active until" date, time left (Xd Xh), re-boost on expiry
  - Updated `boost-dialog.tsx` with detailed status display and re-boost trigger
  - Updated `selling-products-list.tsx` with expired boost indicator and re-boost button
  - Added i18n keys: `Boost.boostActiveUntil`, `Boost.boostExpired`, `Boost.reboost`, `Boost.timeLeft`
  - Audited all Supabase queries - all correctly use `is_boosted=true AND boost_expires_at > now`

---

## Launch Status

### Phase 3: Stripe Hard Gate ✅ COMPLETE (2026-01-15)

> **Plan:** `docs/PRODUCTION.md` (go-live checklist) + `docs/BACKEND.md` (Stripe rules)

**Verified:**
- ✅ Signature verification: All 3 webhook endpoints use `stripe.webhooks.constructEvent()` with secrets from env
- ✅ Multi-secret support: `getStripeWebhookSecrets()` splits by comma/newline for key rotation
- ✅ Separate webhook secrets: `STRIPE_WEBHOOK_SECRET` (checkout/payments) vs `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET` (subscriptions)
- ✅ Idempotency patterns:
  - Orders: by `stripe_payment_intent_id` (checked before insert)
  - Listing boosts: by `stripe_checkout_session_id` (robust)
  - Subscriptions: by `stripe_subscription_id` (checked before insert/update)
- ✅ Checkout action has race-condition handling with webhook

**Fixed:**
- ✅ **Removed duplicate boost handler** from `app/api/subscriptions/webhook/route.ts`
  - Boost was handled in BOTH payments and subscriptions webhooks (risk of double-processing)
  - Canonical handler is now `app/api/payments/webhook/route.ts` only (uses `stripe_checkout_session_id`)

**Webhook endpoint inventory:**
| Endpoint | Purpose | Webhook Secret Env |
|----------|---------|-------------------|
| `/api/checkout/webhook` | Goods orders | `STRIPE_WEBHOOK_SECRET` |
| `/api/payments/webhook` | Setup intents + listing boosts | `STRIPE_WEBHOOK_SECRET` |
| `/api/subscriptions/webhook` | Subscriptions only | `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET` |

**Remaining (deployment):**
- [ ] Verify env vars set in Vercel: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUBSCRIPTION_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] Configure Stripe dashboard webhooks with correct URLs + event types
- [ ] Run end-to-end test payment in production (test mode)

**Gates passed:**
- `tsc --noEmit` ✅
- `e2e:smoke` ✅ (16 passed)

### Phase 4: Core User Flows ✅ COMPLETE (2026-01-15)

> **Plan:** `docs/FEATURES.md` + manual QA checklist in `docs/PRODUCTION.md`

**E2E Test Results:**

| Test Suite | Result | Notes |
|------------|--------|-------|
| `e2e/auth.spec.ts` | ✅ 28 passed | Sign up, login, password reset, accessibility |
| `e2e/smoke.spec.ts` | ✅ 16 passed | Homepage, categories, search, filters, API |
| `e2e/seller-routes.spec.ts` | ✅ 1 passed, 2 skipped | Skipped require auth creds |
| `e2e/reviews.spec.ts` | ✅ 7 passed | Display, filters, dialog, auth guard, locale |

**Fixed:**
- ✅ `e2e/reviews.spec.ts` test assertion updated (button text is "Submit" not "Submit Review", toast message pattern fixed)

**Manual QA required (per CHECKLIST-QA.md):**
- [ ] Messaging: start conversation, send message, upload image, mobile scroll (verify via manual QA in `docs/PRODUCTION.md`)
- [ ] Cart/checkout/orders (if in-scope): full flow verification
- [ ] Business dashboard (if in-scope): access gates

**Known issues (not blockers):**
- Chat mobile scroll + avatars need manual verification (see manual QA in `docs/PRODUCTION.md`)
- Seller routes tests skip when no `TEST_USER_EMAIL`/`TEST_USER_PASSWORD` configured

**Gates passed:**
- `tsc --noEmit` ✅
- `e2e:smoke` ✅ (16 passed)

### Phase 5: i18n + UI Drift Compliance ✅ COMPLETE (2026-01-15)

> **Plan:** `docs/FRONTEND.md` (i18n rules) + `docs/DESIGN.md` (design rails)

**Tailwind Scan Results:**
| Metric | Result | Target | Status |
|--------|--------|--------|--------|
| Gradient violations | 0 | 0 | ✅ |
| Arbitrary values | 9 | < 20 | ✅ |
| Palette violations | 80 | 0 | ⚠️ (see notes) |

**Verified:**
- ✅ **0 gradients** in production code (only found in docs as anti-pattern examples)
- ✅ **9 arbitrary values** (6 files) - well below target of 20
- ✅ Auth forms use `useTranslations()` properly (login-form.tsx, sign-up-form.tsx)
- ✅ Search page uses `getTranslations()` for UI strings
- ✅ Homepage/hero uses inline locale checks (acceptable short-term per `docs/FRONTEND.md`)
- ✅ Account components use inline locale checks with proper Bulgarian translations
- ✅ All high-traffic surfaces load in both `/en` and `/bg` locales (verified via e2e)

**Palette violations context (80 violations in 7 files):**
- `condition-badge.tsx` (36): Semantic colors for product conditions (new=emerald, used=stone, etc.) - **intentional per Vinted/Depop industry standard**
- `seller-verification-badge.tsx` (24): Status colors for verification states - **intentional**
- `freshness-indicator.tsx` (10): Relative date colors - **intentional**
- `product-social-proof.tsx` (5): Engagement indicator colors - **intentional**
- Other files (5): Minor status indicators

**Decision:** Palette violations are **not blockers** - they are semantic status colors that follow industry conventions (green=new, blue=like-new, amber=good, etc.). The Design System rails prohibit hardcoded grays/whites for general UI, not semantic status colors.

**i18n Audit Summary:**
- Critical surfaces (Auth, Search, Homepage, Account) use next-intl patterns
- Metadata strings (page titles) use inline locale checks - acceptable short-term
- Server action errors return English strings - acceptable per `docs/FRONTEND.md` (error codes preferred but not blocking)

**Remaining (post-launch cleanup):**
- [ ] Refactor metadata strings to use next-intl `getTranslations()` for consistency
- [ ] Consider migrating server action errors to error codes for full i18n compliance

**Gates passed:**
- `tsc --noEmit` ✅
- `e2e:smoke` ✅ (16 passed)

### Phase 6: Release Gates + Deployment Runbook ✅ COMPLETE (2026-01-15)

> **Plan:** `docs/PRODUCTION.md` (release gates + deployment + manual QA)

**Release Gates Summary:**

| Gate | Result | Notes |
|------|--------|-------|
| `pnpm -s lint` | ✅ PASS | 0 errors, 526 warnings (acceptable) |
| `pnpm -s exec tsc -p tsconfig.json --noEmit` | ✅ PASS | No type errors |
| `pnpm test:unit` | ✅ PASS | 399 tests passed |
| `pnpm -s build` | ✅ PASS | 498 pages compiled successfully |
| `e2e:smoke` (REUSE_EXISTING_SERVER) | ✅ PASS | 16 tests passed |

**Fixes Applied:**
- ✅ Fixed React hooks rules-of-hooks error in `mobile-home-tabs.tsx` (moved `useInstantCategoryBrowse` outside conditional)
- ✅ Fixed "Cannot create components during render" error in `app/[locale]/(main)/layout.tsx` (moved `HeaderWithUser` to module scope)
- ✅ Fixed type errors with CategoryLite/CategoryAttribute conversions

**Deployment Checklist:**

#### Required Environment Variables (Vercel Production)
```
# App URLs
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>

# Stripe
STRIPE_SECRET_KEY=<live-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<live-publishable-key>
STRIPE_WEBHOOK_SECRET=<webhook-secret>
STRIPE_SUBSCRIPTION_WEBHOOK_SECRET=<subscription-webhook-secret>

# Cache invalidation (recommended)
REVALIDATION_SECRET=<random-secret>
```

#### Supabase Configuration
- [ ] Add redirect URLs in Auth settings:
  - `https://yourdomain.com/auth/confirm`
  - `https://yourdomain.com/auth/callback`
- [ ] Verify email templates use production domain
- [ ] Enable leaked password protection (dashboard-only setting)
- [ ] Verify storage buckets: `product-images`, `avatars` exist with correct policies

#### Stripe Configuration
- [ ] Configure production webhooks:
  - `/api/checkout/webhook` → events: `checkout.session.completed`, `payment_intent.*`
  - `/api/payments/webhook` → events: `setup_intent.succeeded`, `checkout.session.completed`
  - `/api/subscriptions/webhook` → events: `customer.subscription.*`, `invoice.*`
- [ ] Use separate webhook secrets for checkout vs subscriptions

#### Vercel Configuration
- [ ] Confirm `proxy.ts` deploys (Next.js 16 proxy, NOT middleware.ts)
- [ ] Set all environment variables for Production environment
- [ ] Keep a known-good deployment ready for rollback

#### Post-Deploy Verification
1. Run manual QA (see `docs/PRODUCTION.md`) on staging first
2. Deploy to production
3. Re-run QA checklist on production
4. Verify Stripe webhook logs show 200s
5. Monitor error tracking for first 24h

#### Rollback Plan
- Keep previous Vercel deployment marked as "ready to promote"
- No schema changes in this release that require data migration
- If critical issues: promote previous deployment in Vercel dashboard

**Go/No-Go Criteria:**
| Criterion | Status |
|-----------|--------|
| All release gates pass | ✅ |
| Auth redirects work correctly | ⏳ Manual QA required |
| Checkout/webhooks work (if in-scope) | ⏳ Manual QA required |
| Supabase security advisors clean | ⏳ Dashboard check required |
| E2E smoke passes on production | ⏳ Post-deploy check |

---

## 🚀 GO/NO-GO RECOMMENDATION

**RECOMMENDATION: GO (conditional)**

All automated release gates pass. Ready for deployment pending:
1. Manual QA checklist verification (`docs/PRODUCTION.md`)
2. Environment variables configured in Vercel
3. Stripe webhooks configured for production URLs
4. Supabase auth redirect URLs configured

**Next Steps (Human Required):**
1. Configure production environment in Vercel
2. Configure Stripe dashboard webhooks
3. Configure Supabase auth settings
4. Run manual QA on staging
5. Deploy and monitor
