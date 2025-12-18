# Phase 0 — Foundation + Full Audit (Creates the real production work queue)

Purpose: turn the current repo into an executable, verifiable production plan by producing a **baseline report**, **work queues**, and **quality gates**.

This phase is intentionally “heavy on discovery + validation” so later phases can be fast, surgical, and confident.

---

## Outputs (must exist at end of Phase 0)

- [x] A written baseline snapshot appended to this file (see "Baseline Report Template").
- [x] 4 terminal plan files created in `docs/planning/`:
  - [x] `PHASE_1_FRONTEND_UX_UI.md`
  - [x] `PHASE_2_SUPABASE_BACKEND_TYPES.md`
  - [x] `PHASE_3_NEXTJS_APP_ROUTER_BEST_PRACTICES.md`
  - [x] `PHASE_4_PRODUCTION_PLAYWRIGHT_RELEASE.md`
- [x] A shared "quality gates" section in each phase: typecheck, lint, build, and route smoke.
- [x] A prioritized work queue (top ~20 items) with **file pointers** + **acceptance criteria**.

Hard requirement: do not add features in Phase 0. Only audit, organize, and set gates.

---

## AI Execution Protocol (how the agent should operate)

When an AI agent is asked to “execute Phase 0”, it MUST:

1) **Work in loops**
- Loop A: discover → record → propose change list (no code edits)
- Loop B: validate assumptions by searching code and running checks
- Loop C: write plan files + queues + acceptance criteria

2) **Prefer evidence over guessing**
- Always search for the real implementation before describing it.
- Refer to existing scripts from `package.json`:
  - `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm lint`
  - Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`

3) **Keep Phase 0 “non-invasive”**
- No refactors, no behavior changes, no “cleanup” unless it’s required to unblock auditing.
- If a check fails, document it and defer fixes into Phase 1/2/3 unless it blocks Phase 4.

4) **Use runtime tooling when available**
- If Next.js dev server is running and MCP tools are available, use Next.js MCP to extract routes/errors.
- If Supabase MCP tools are available, use them to list tables/types/advisors.

5) **Definition of Done is objective**
- Phase 0 is done only when outputs exist, and baseline checks are recorded.

---

## 0. Preconditions

- [x] Clean git state (commit/stash WIP).
- [x] Node + pnpm installed.
- [x] Dependencies installed: `pnpm i`.
- [x] Confirm `.env.local` strategy exists (don't leak secrets; just confirm examples/docs exist).

---

## 1. Baseline Checks (record results)

Run and capture outcomes (pass/fail + key warnings):

- [x] Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit` ✅ GREEN
- [x] Lint: `pnpm lint` ⚠️ 91 warnings (no errors)
- [x] Build: `pnpm build` ❌ FAILING (cookies() in API routes)
- [x] Dev boot: `pnpm dev` (confirm it serves at least `/`) ✅ Works

Also inspect existing audit artifacts (do not regenerate yet):

- [x] `audit-results/depcheck-report.txt` (unused + missing deps)
- [x] `audit-results/knip-report.txt` (unused files/exports)
- [x] `audit-results/circular-deps.txt` (dependency cycles)
- [x] `audit-results/jscpd-report/` (duplicate code)

Phase 0 note: depcheck already reports missing `pg` for `scripts/apply-migration.js`.
- [x] Confirm whether `scripts/apply-migration.js` is still used.
  - ~~If used: create a Phase 2 task to fix it cleanly.~~
  - **RESULT: Unused - knip confirms. Phase 3 task to remove the script.**

---

## 2. Route Map + Critical User Flows (must be explicit)

Goal: define exactly what “production ready” means in terms of routes and flows.

### 2.1 Build the route inventory
- [x] Generate a route list from the filesystem under `app/`.
- [x] Group routes by area:
  - Public browsing (home, categories, product pages)
  - Auth-required (account, orders, wishlist)
  - Seller flows (sell, listings)
  - Plans/billing
  - Profiles
  - API routes under `app/api/`

### 2.2 Define "critical routes" for release smoke
- [x] Choose the smallest set that blocks release if broken (5–10 routes).
- [x] For each critical route: define "page loaded" criteria (header visible, not-found absent, no error boundary).

---

## 3. Architecture Baseline (Next.js App Router + client/server boundaries)

Goal: locate the biggest correctness risks in Next.js 16 + React 19.

- [x] Identify where `use client` is used and why.
- [x] Identify server-only modules and ensure they are not imported by client components.
- [x] Identify all Server Actions usage under `app/[locale]/actions/` (or equivalent) and categorize:
  - Auth/session retrieval
  - Data reads
  - Data writes
- [x] Check how errors are handled:
  - global error: `app/global-error.tsx`
  - not found: `app/global-not-found.tsx`

Deliverable:
- [x] A short section in the Baseline Report: "Top 10 Next.js risks to fix in Phase 3".

---

## 4. Frontend Baseline (shadcn + Tailwind v4 + UI consistency)

Goal: find inconsistent patterns and hardcoding that causes UX drift.

- [x] Identify the core UI primitives actually used (button, input, card, dialog, toast).
- [x] Identify repeated UI implementations across `components/` (especially account/sell/plans).
- [x] Identify tailwind "anti-pattern hotspots":
  - extremely long class strings repeated across files
  - magic numbers that fight design consistency
  - responsive breakpoints inconsistently applied

Deliverable:
- [x] A prioritized list of UI cleanup tasks (Phase 1) with file pointers.

---

## 5. Supabase Baseline (auth boundaries + types + RLS assumptions)

Goal: confirm backend correctness and security boundaries.

- [x] Identify all Supabase client entry points.
- [x] Identify where auth/session is read (server vs client).
- [x] Identify all DB access patterns:
  - direct queries from server components
  - queries in route handlers (`app/api/...`)
  - queries inside actions
- [x] Confirm database type generation strategy:
  - where types live (commonly `types/`)
  - whether code imports them consistently

Deliverable:
- [x] "Supabase Risk Register" section with:
  - tables/features touched
  - suspected RLS expectations
  - any insecure patterns to remove in Phase 2

---

## 6. Dependency + Debloat Baseline (what to remove vs keep)

Goal: create a *safe* removal queue (do not remove in Phase 0).

- [x] From `audit-results/depcheck-report.txt`, classify each unused dependency:
  - False positive (keep, document why)
  - Real unused (Phase 1 or 3 removal)
- [x] From `audit-results/knip-report.txt`, classify each item:
  - Real dead code
  - Tooling false positive
- [x] From `audit-results/circular-deps.txt`, pick the **top 3** cycles that cause real pain.

Deliverable:
- [x] A "Debloat Queue" (Phase 1/3) with safe deletion candidates and confidence level.

---

## 7. Production Quality Gates (non-negotiable)

These gates must be copied into Phase 1–4 plans.

- [x] Gate A: typecheck is green. ✅ Currently passing
- [x] Gate B: lint is green (or documented baseline exceptions with a removal plan). ⚠️ 91 warnings documented
- [ ] Gate C: production build succeeds. ❌ Blocked by cookies() issue (Phase 3 fix required)
- [ ] Gate D: critical routes smoke passes. (Requires dev server test)
- [ ] Gate E: no recurring console errors on critical routes. (Requires Phase 4 Playwright)

---

## 8. Generate the 4 Terminal Phase Plan Files (this is the main output)

Create the four files listed in “Outputs” with:

- [x] A 3-part structure in each:
  1) Objective + scope boundaries
  2) Work queue (prioritized tasks with checkboxes)
  3) Verification (quality gates + route smoke)

Rules for writing tasks:
- Each task must have:
  - A short title
  - File/folder targets (exact paths)
  - Acceptance criteria (observable)
  - A "Verify" command or manual check
- Keep tasks small enough to be completed in <1–3 hours each.

**STATUS: All 4 phase files exist with proper structure.**

---

## Baseline Report Template (fill this in during execution)

Date: **2025-12-17**

### Environment
- Node: **v22.20.0**
- pnpm: **9.15.4**

### Current Status (from checks)
- Typecheck: ✅ **GREEN** - `pnpm -s exec tsc -p tsconfig.json --noEmit` passes
- Lint: ⚠️ **91 warnings, 0 errors** - all warnings are `@next/next/no-img-element` and `react-hooks/exhaustive-deps` (documented, non-blocking)
- Build: ❌ **FAILING** - Turbopack build fails with 1 error: API routes using `cookies()` during prerendering (`/api/billing/invoices`, `/api/badges`, `/api/plans`, `/api/seller/limits`) cause `HANGING_PROMISE_REJECTION`
- Dev boot: ✅ Works - `pnpm dev` serves routes successfully

### Build Failure Root Cause
API route handlers that call `cookies()` are being prerendered during build. Next.js 16 requires dynamic routes to properly opt out of prerendering. Affected routes:
- `/api/billing/invoices`
- `/api/badges`
- `/api/plans`
- `/api/seller/limits`

**Fix required in Phase 3**: Add `export const dynamic = 'force-dynamic'` to these API routes.

---

### Route Inventory (grouped by area)

**Public Browsing (anonymous)**
- `/[locale]` - Homepage
- `/[locale]/categories` - Category listing
- `/[locale]/categories/[slug]` - Category pages
- `/[locale]/search` - Search results
- `/[locale]/product/[slug]` - Product detail
- `/[locale]/todays-deals` - Deals page
- `/[locale]/sellers` - Seller directory
- `/[locale]/[username]` - Public seller profiles
- `/[locale]/[username]/[productSlug]` - Product by username

**Auth Flow**
- `/[locale]/auth/login` - Login
- `/[locale]/auth/sign-up` - Registration
- `/[locale]/auth/forgot-password` - Password recovery
- `/[locale]/auth/reset-password` - Password reset
- `/[locale]/auth/welcome` - Post-signup welcome

**Account (auth-required)**
- `/[locale]/account` - Account dashboard
- `/[locale]/account/profile` - Profile settings
- `/[locale]/account/orders` - Order history
- `/[locale]/account/addresses` - Address book
- `/[locale]/account/payments` - Payment methods
- `/[locale]/account/billing` - Billing history
- `/[locale]/account/security` - Security settings
- `/[locale]/account/wishlist` - Wishlist
- `/[locale]/account/following` - Followed sellers
- `/[locale]/account/plans` - Subscription plans
- `/[locale]/account/sales` - Sales history (for sellers)
- `/[locale]/account/selling` - Active listings (for sellers)

**Seller/Sell Flow**
- `/[locale]/sell` - Sell item form
- `/[locale]/sell/orders` - Seller order management

**Business Dashboard**
- `/[locale]/dashboard` - Business analytics

**Cart & Checkout**
- `/[locale]/cart` - Shopping cart
- `/[locale]/checkout` - Checkout flow

**Plans**
- `/[locale]/plans` - Pricing plans

**Chat**
- `/[locale]/messages` - Messaging (implied from `(chat)` group)

**API Routes (16 endpoints)**
- `/api/auth/sign-out`
- `/api/badges`, `/api/badges/[userId]`, `/api/badges/evaluate`, `/api/badges/feature/[badgeId]`
- `/api/billing/invoices`
- `/api/boost/checkout`
- `/api/categories`, `/api/categories/[slug]/attributes`, `/api/categories/[slug]/context`, `/api/categories/attributes`, `/api/categories/products`
- `/api/checkout/webhook`
- `/api/geo`
- `/api/payments/delete`, `/api/payments/set-default`, `/api/payments/setup`, `/api/payments/webhook`
- `/api/plans`
- `/api/products`, `/api/products/create`, `/api/products/deals`, `/api/products/newest`, `/api/products/promoted`, `/api/products/search`
- `/api/revalidate`
- `/api/seller/limits`
- `/api/stores`
- `/api/subscriptions/checkout`, `/api/subscriptions/portal`, `/api/subscriptions/webhook`
- `/api/upload-chat-image`, `/api/upload-image`

---

### Critical Routes for Release (smoke test targets)
1. `/en` - Homepage (public)
2. `/en/categories` - Category browsing (public)
3. `/en/search?q=test` - Search functionality (public)
4. `/en/cart` - Cart (public/auth-aware)
5. `/en/account` - Account dashboard (auth-gated)
6. `/en/sell` - Sell form (auth-gated)
7. `/en/auth/login` - Auth flow entry
8. `/bg` - Homepage in BG locale (i18n verification)

---

### Top 10 Next.js Risks (Phase 3)
1. **Build failure from `cookies()` in API routes** - `/api/billing/invoices`, `/api/badges`, `/api/plans`, `/api/seller/limits` need `dynamic = 'force-dynamic'`
2. **Circular dependency** - `account/sales/page.tsx` ↔ `account/sales/sales-table.tsx`
3. **Over-clientization** - Many UI components marked `'use client'` that could be server components
4. **Dynamic leakage** - `cookies()` and `headers()` calls forcing dynamic rendering in cacheable sections
5. **Incorrect cache invalidation** - Need to verify `revalidateTag(tag, 'max')` vs deprecated single-arg usage
6. **Missing error boundaries** - Verify `error.tsx` coverage in all route groups
7. **Missing loading states** - Verify `loading.tsx` coverage for slow routes
8. **Server Actions location** - Actions in `app/actions/` and `lib/data/` - need consolidation
9. **Locale provider placement** - Confirm single layout source for i18n wrappers
10. **Dead route cleanup** - Demo/backup routes in `app/[locale]/(main)/demo/` should be removed

---

### Top UI/UX Fixes (Phase 1)
1. **Search page empty state** - Desktop audit reports empty `<main>` on search
2. **Language mixing (EN/BG)** - Mobile audit reports mixed language strings
3. **Currency inconsistency** - Mixed $, €, лв. symbols reported
4. **Footer encoding** - "Â©" glitch in footer
5. **Missing page titles/metadata** - Several routes lack localized metadata
6. **`<img>` → `<Image>`** - 91 lint warnings for unoptimized images
7. **`<a>` → `<Link>`** - HTML anchor elements used instead of Next.js Link
8. **Duplicate UI components** - `components/product-card.tsx` vs `components/ui/product-card.tsx`
9. **Long Tailwind class strings** - Many files with 50+ class strings needing extraction
10. **Unused UI components** - 92 unused files per knip report

---

### Supabase Risk Register (Phase 2)

**Client Entry Points:**
- `lib/supabase/server.ts` - `createClient`, `createStaticClient`, `createAdminClient`
- `lib/supabase/client.ts` - Browser client with mock fallback (⚠️ risk: silent failures)
- `lib/supabase/middleware.ts` - Session refresh

**Auth/Session Reading:**
- Server: via `cookies()` in server components and actions
- Client: via Supabase client auth methods

**DB Access Patterns:**
- Server components: direct queries
- Route handlers: `/api/*` routes
- Server actions: `app/actions/*.ts` and `lib/data/*.ts`

**Type Generation:**
- Types at `lib/supabase/database.types.ts`
- Regeneration method needs documentation

**Risks:**
- Silent Supabase mock in `client.ts` can hide production misconfiguration
- `scripts/apply-migration.js` has missing `pg` dependency (unused - safe to remove)
- Admin client usage needs audit for server-only enforcement

---

### Debloat Queue (Phase 1/3)

**Unused Dependencies (safe to remove in Phase 1):**
- `embla-carousel`, `embla-carousel-autoplay`, `embla-carousel-react` - knip confirms unused
- `@dnd-kit/*` packages (4 total) - knip confirms unused
- `@radix-ui/react-collapsible`, `@radix-ui/react-context-menu`, `@radix-ui/react-menubar` - unused
- `@tanstack/react-table` - unused
- `@vercel/analytics` - unused
- `input-otp`, `react-day-picker`, `react-markdown`, `react-resizable-panels` - unused
- `marked`, `shiki`, `remark-breaks`, `remark-gfm` - unused
- `use-stick-to-bottom` - unused

**DevDependencies (safe to remove):**
- `cross-env` - unused
- `dotenv` - unused
- `shadcn` - CLI tool, keep for component generation
- `supabase` - CLI tool, keep for type generation

**Unused Files (Phase 3 - confirm before removing):**
- 92 files reported by knip (need usage verification)
- Top candidates: `components/analytics.tsx`, `components/data-table.tsx`, `components/mega-menu.tsx`
- Scripts: `scripts/apply-migration.js`, `scripts/create-user.js`, `scripts/seed*.ts`, `scripts/setup-db.ts`

**Circular Dependency (Phase 3):**
- `account/sales/page.tsx` ↔ `sales-table.tsx` - only 1 cycle found, low priority

---

### Phase 0 Outputs Checklist

- [x] Baseline snapshot appended to this file
- [x] `PHASE_1_FRONTEND_UX_UI.md` exists with structure
- [x] `PHASE_2_SUPABASE_BACKEND_TYPES.md` exists with structure
- [x] `PHASE_3_NEXTJS_APP_ROUTER_BEST_PRACTICES.md` exists with structure
- [x] `PHASE_4_PRODUCTION_PLAYWRIGHT_RELEASE.md` exists with structure
- [x] Quality gates defined in each phase
- [x] Prioritized work queue with file pointers and acceptance criteria
