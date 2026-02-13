# Production Audit — Master Plan

> **Mobile-first Playwright audit with desktop core-flow coverage.**
> Single orchestration document linking all phase plans, tracking status, and defining execution order.

| Scope | Full mobile UI/UX audit + desktop core-flow pass on release-critical routes |
|-------|----------------------------------------------------------------|
| Devices | Pixel 5 (393×851) · iPhone 12 (390×844) |
| Playwright projects | `mobile-chrome` · `mobile-safari` |
| Locale | Primary: `en` · Cross-check: `bg` (Phase 18) |
| Release target | 2026-02-12 soft launch |
| Hard blockers | All P0 + `LAUNCH-001..007` in `TASKS.md` |
| Created | 2026-02-09 |
| Status | **Execution Ready** |

---

## Table of Contents

1. [Objective](#1-objective)
1.1 [Launch Policy & Readiness Gate](#11-launch-policy--readiness-gate)
2. [Device Matrix & Viewport Config](#2-device-matrix--viewport-config)
3. [Test Infrastructure](#3-test-infrastructure)
4. [Known Bugs Registry](#4-known-bugs-registry)
5. [Phase Registry](#5-phase-registry)
6. [Phase Dependency Graph](#6-phase-dependency-graph)
7. [Execution Order & Priority](#7-execution-order--priority)
8. [Route Coverage Matrix](#8-route-coverage-matrix)
9. [Cross-Cutting Checklist](#9-cross-cutting-checklist)
10. [Phase Document Template](#10-phase-document-template)
11. [File Index](#11-file-index)
12. [Definitions](#12-definitions)

---

## 1. Objective

Perform a comprehensive mobile-first audit of every user-facing route, interaction, and feature in the Treido marketplace, with desktop validation for core release routes. The audit will:

- **Verify** that every route renders correctly on mobile viewports without visual breakage
- **Validate** all interactive flows (auth, selling, buying, checkout, chat, account management)
- **Confirm** known P0/P1 bugs are still present or have been fixed
- **Document** every new issue found with severity, description, screenshot reference, and reproduction steps
- **Produce** a prioritized fix list for the development team

This is an **audit-only** effort — no code changes. The output is a set of detailed findings documents per phase.

---

## 1.1 Launch Policy & Readiness Gate

- Launch strategy: controlled soft launch on **2026-02-12**.
- Tracking source of truth: this file + `production-audit/01..18`.
- Test ownership: hybrid (automation + manual verification).
- Environment policy: full validation on preview, production smoke post-deploy only.
- Launch rule: **no-go** if any P0 remains open or any `LAUNCH-001..007` task is unresolved.

---

## 2. Device Matrix & Viewport Config

### Primary Devices

| Device | Viewport | UA | Touch | DPR | Playwright Device |
|--------|----------|-----|-------|-----|-------------------|
| Pixel 5 | 393 × 851 | Mobile Chrome | ✓ | 2.75 | `devices['Pixel 5']` |
| iPhone 12 | 390 × 844 | Mobile Safari | ✓ | 3 | `devices['iPhone 12']` |

### Viewport Setup Pattern

```typescript
// Per-test override
await page.setViewportSize({ width: 393, height: 851 });

// Per-describe override
test.use({ viewport: { width: 390, height: 844 } });

// Use Playwright device preset
test.use({ ...devices['Pixel 5'] });
```

### Breakpoint Reference

| Breakpoint | Value | Significance |
|------------|-------|-------------|
| Default (mobile) | < 768px | Tab bar visible, mobile headers, mobile drawers |
| `md:` | 768px | Primary mobile/desktop split — tab bar hidden, desktop headers |
| `lg:` | 1024px | Sell form layout split, account sidebar visible |

Both audit devices (393px, 390px) are well below `md:` (768px), ensuring we test the pure mobile experience.

---

## 3. Test Infrastructure

### Overlay Dismissal (Required Before Every Test)

```typescript
// Dismiss cookie consent + geo welcome modal
await page.addInitScript(() => {
  localStorage.setItem('cookie-consent', 'accepted');
  localStorage.setItem('geo-welcome-dismissed', 'true');
});
```

### Hydration Wait

```typescript
// Wait for main + header hydration
await app.waitForHydration();
// Waits for: <main> visible + header[data-hydrated="true"]
```

### Auth Credentials

```typescript
// From e2e/fixtures/auth.ts
const creds = getTestUserCredentials();
// Reads TEST_USER_EMAIL + TEST_USER_PASSWORD from env
// Tests skip if credentials unavailable
```

### Auth Session Reuse

```typescript
// Worker-scoped: login once, save storageState, reuse across tests
// From e2e/fixtures/authenticated.ts
```

### Console Error Policy

- **Strict by default** — any `console.error` fails the test
- Documented ignore patterns exist for known noisy errors (hydration, chunk loading)
- Audit should log but not block on console errors to capture full picture

### Key Test IDs (data-testid)

| Category | Test IDs |
|----------|----------|
| **Tab Bar** | `mobile-tab-bar`, `mobile-tab-bar-dock`, `mobile-tab-sell`, `mobile-tab-profile` |
| **Drawers** | `mobile-auth-drawer`, `mobile-account-drawer`, `mobile-category-drawer` |
| **Filters** | `mobile-filter-sort-bar`, `mobile-location-chip` |
| **Homepage** | `home-category-circles`, `home-section-promoted`, `home-section-newest`, `home-section-curated-rail`, `home-sticky-category-pills`, `home-section-featured-hero` |
| **Grid** | `product-grid` |
| **Account** | `account-drawer-quick-link` |
| **Auth** | `username-availability` |
| **Menu** | `mobile-menu-trigger` |

---

## 4. Known Bugs Registry

### P0 — Launch Blockers

| ID | Area | Description | Audit Phase | Status |
|----|------|-------------|-------------|--------|
| **AUTH-001** | Auth | Login doesn't reflect auth state without hard refresh — UI stays logged-out after successful login | Phase 3 (auth), verify in 8-12 | 🔴 Open |
| **SELL-001** | Selling | Sell form stuck on last step (Review), cannot publish listing | Phase 8 (sell form) | 🔴 Open |
| **CAT-001** | Categories | Product cards show L4 subcategory instead of L0 root category label | Phase 2, 4, 5 | 🔴 Open |

### P1 — Major UX Issues

| ID | Area | Description | Audit Phase | Status |
|----|------|-------------|-------------|--------|
| **AUTH-002** | Auth | Auth forms need shadcn component refactor for consistent styling | Phase 3 | 🟠 Open |
| **AUTH-003** | Auth | Auth forms have mobile responsiveness issues | Phase 3 | 🟠 Open |
| **ONB-001** | Onboarding | Onboarding wizard uses hardcoded styles instead of design tokens | Phase 3 | 🟠 Open |
| **ONB-002** | Onboarding | Onboarding routes accessible without auth (public route gating) | Phase 3 | 🟠 Open |
| **SELL-002** | Selling | Sell wizard components need shadcn refactor | Phase 8 | 🟠 Open |
| **LAUNCH-006** | Cart | Cart badge count doesn't match server truth — client/server desync | Phase 7 | 🟢 Resolved (retest pass 2026-02-11) |

### High — Infrastructure / Styling

| ID | Area | Description | Audit Phase | Status |
|----|------|-------------|-------------|--------|
| **FE-UX-006** | Styling | Invalid `touch-action-*` TW4 utilities + bracket `aspect-[...]` in quick view | Phase 5, 6 | 🟡 Open |
| **SAFE-001** | Layout | `--spacing-bottom-nav` is 56px (3.5rem) in CSS but documented as 48px in DESIGN.md — potential spacing mismatch | Phase 1 | 🟡 Open |
| **HYDRA-002** | Hydration | `useIsMobile()` returns `false` during SSR → mobile content flashes after hydration | Phase 1, 18 | 🟡 Open |
| **ACCT-001** | Account | Account layout hides sidebar at `< lg:` with no mobile navigation alternative — users may get stranded | Phase 10 | 🟡 Open |
| **DASH-001** | Dashboard | Business dashboard uses `SidebarProvider` with no explicit mobile responsive handling | Phase 16 | 🟡 Open |
| **ADMIN-001** | Admin | Admin panel uses sidebar layout with no explicit mobile responsive handling | Phase 17 | 🟡 Open |

---

## 5. Phase Registry

### Phase Overview

| # | Phase File | Scope | Routes | Priority | Status |
|---|------------|-------|--------|----------|--------|
| 1 | `01-shell-navigation.md` | App shell, headers, tab bar, drawers, safe areas, overlays | Global chrome | **P0** | 🧪 Ready |
| 2 | `02-landing-homepage.md` | Homepage sections, scroll, sticky pills, feed content | `/` | **P0** | 🧪 Ready |
| 3 | `03-auth-flows.md` | Sign up, login, password reset, auth drawer, session, onboarding | 7 auth routes + drawer | **P0** | 🧪 Ready |
| 4 | `04-categories-discovery.md` | Category browsing L0→L3, drawer, subcategories, filter/sort | `/categories`, `/categories/:slug`, `/categories/:slug/:sub` | **P0** | 🧪 Ready |
| 5 | `05-search-quickview.md` | Search input, results, filters, sorting, quick-view drawer | `/search` + `@modal` | **P0** | 🧪 Ready |
| 6 | `06-product-detail.md` | PDP mobile layout, gallery, price, seller card, attributes, reviews | `/:username/:productSlug` | **P0** | 🧪 Ready |
| 7 | `07-cart-checkout.md` | Cart drawer, cart page, checkout flow, Stripe, success | `/cart`, `/checkout`, `/checkout/success` | **P0** | 🧪 Ready |
| 8 | `08-sell-form.md` | Multi-step wizard, stepper, photo upload, draft, publish | `/sell` | **P0** | 🧪 Ready |
| 9 | `09-chat-messaging.md` | Chat inbox, conversation thread, real-time, images, report/block | `/chat`, `/chat/:id` | **P1** | 🧪 Ready |
| 10 | `10-account-pages.md` | All 18 account routes, mobile nav gap, profile, orders, settings | `/account/*` | **P1** | 🧪 Ready |
| 11 | `11-wishlist.md` | Wishlist page, drawer, add/remove, shared wishlist | `/wishlist`, `/wishlist/:token` | **P1** | 🧪 Ready |
| 12 | `12-seller-management.md` | Seller dashboard, payouts, listing edit, sales, orders | `/seller/*`, `/account/selling/*`, `/sell/orders` | **P1** | 🧪 Ready |
| 13 | `13-user-profiles.md` | Public user/seller profiles, product listings by user | `/:username` | **P2** | 🧪 Ready |
| 14 | `14-static-legal-pages.md` | About, cookies, privacy, returns, terms, contact, FAQ, help, etc. | 16 static routes | **P2** | 🧪 Ready |
| 15 | `15-plans-pricing.md` | Plans page, upgrade modal, plan comparison, CTAs | `/plans`, account upgrade | **P2** | 🧪 Ready |
| 16 | `16-business-dashboard.md` | All 13 business dashboard routes — mobile responsive audit | `/dashboard/*` | **P2** | 🧪 Ready |
| 17 | `17-admin-panel.md` | All 8 admin routes — mobile responsive audit | `/admin/*` | **P3** | 🧪 Ready |
| 18 | `18-cross-cutting.md` | i18n (BG locale), a11y (axe-core, touch targets), perf (LCP, CLS), hydration, error pages | All routes in `bg` | **P1** | 🧪 Ready |

### Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ Plan | Phase document not yet created |
| 🧪 Ready | Phase document written with test scenarios |
| 🔄 In Progress | Audit execution underway |
| ✅ Complete | Audit finished, findings documented |
| 🔴 Blocked | Cannot proceed (dependency or environment issue) |

---

## 6. Phase Dependency Graph

```
Phase 1: Shell & Navigation (no dependencies)
    │
    ├─── Phase 2: Landing / Homepage
    ├─── Phase 14: Static / Legal Pages
    ├─── Phase 13: User Profiles
    │
    └─── Phase 3: Auth Flows (requires shell working)
              │
              ├─── Phase 4: Categories & Discovery
              ├─── Phase 5: Search & Quick View
              │         │
              │         └─── Phase 6: Product Detail Page
              │                   │
              │                   ├─── Phase 7: Cart & Checkout
              │                   └─── Phase 11: Wishlist
              │
              ├─── Phase 8: Sell Form (auth required)
              │         │
              │         └─── Phase 12: Seller Management
              │
              ├─── Phase 9: Chat & Messaging (auth required)
              │
              ├─── Phase 10: Account Pages (auth required)
              │         │
              │         └─── Phase 15: Plans & Pricing
              │
              ├─── Phase 16: Business Dashboard (business auth)
              │
              └─── Phase 17: Admin Panel (admin auth)

Phase 18: Cross-Cutting (runs last, depends on all phases)
```

---

## 7. Execution Order & Priority

### Round 1 — P0 Critical Path (Phases 1–8)

Execute sequentially. These cover the core user journey from landing to purchase/sell.

| Order | Phase | Why Sequential |
|-------|-------|----------------|
| 1st | Phase 1: Shell & Navigation | Foundation — every other phase depends on shell working |
| 2nd | Phase 2: Landing / Homepage | First thing users see; validates feed, layout, entry points |
| 3rd | Phase 3: Auth Flows | Unlocks all authenticated phases (8-12, 16-17) |
| 4th | Phase 4: Categories & Discovery | Primary browse path; validates CAT-001 bug |
| 5th | Phase 5: Search & Quick View | Secondary discovery; validates quick-view drawer |
| 6th | Phase 6: Product Detail Page | Must work before cart/checkout can be tested |
| 7th | Phase 7: Cart & Checkout | Revenue-critical path; validates LAUNCH-006 |
| 8th | Phase 8: Sell Form | Supply-side critical; validates SELL-001 |

### Round 2 — P1 Key Features (Phases 9–12, 18)

Can execute in parallel batches after Round 1.

| Batch | Phases | Notes |
|-------|--------|-------|
| A | Phase 9 (Chat) + Phase 11 (Wishlist) | Independent features, both auth-gated |
| B | Phase 10 (Account) + Phase 12 (Seller Mgmt) | Account area, both auth-gated |
| C | Phase 18 (Cross-Cutting) | i18n + a11y + perf sweep across all routes |

### Round 3 — P2/P3 Secondary (Phases 13–17)

Lower priority, execute as time allows.

| Batch | Phases | Notes |
|-------|--------|-------|
| D | Phase 13 (Profiles) + Phase 14 (Static) + Phase 15 (Plans) | Public pages, no auth needed |
| E | Phase 16 (Business) + Phase 17 (Admin) | Role-gated, likely broken on mobile |

---

## 8. Route Coverage Matrix

Every route from `docs/ROUTES.md` (85 routes) mapped to an audit phase.

### (main) — Public Buyer Routes (30 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/` | 2 | public |
| `/about` | 14 | public |
| `/accessibility` | 14 | public |
| `/assistant` | 14 | public |
| `/cart` | 7 | public |
| `/categories` | 4 | public |
| `/categories/:slug` | 4 | public |
| `/categories/:slug/:sub` | 4 | public |
| `/cookies` | 14 | public |
| `/privacy` | 14 | public |
| `/returns` | 14 | public |
| `/terms` | 14 | public |
| `/contact` | 14 | public |
| `/customer-service` | 14 | public |
| `/faq` | 14 | public |
| `/feedback` | 14 | public |
| `/help` | 14 | public |
| `/security` | 14 | public |
| `/gift-cards` | 14 | public |
| `/members` | 14 | public |
| `/messages` | 14 | public |
| `/registry` | 14 | public |
| `/search` | 5 | public |
| `/seller/dashboard` | 12 | seller |
| `/seller/settings/payouts` | 12 | seller |
| `/sellers` | 13 | public |
| `/todays-deals` | 14 | public |
| `/wishlist` | 11 | auth |
| `/wishlist/:token` | 11 | public |
| `/wishlist/shared/:token` | 11 | public |

### (account) — User Dashboard (18 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/account` | 10 | auth |
| `/account/addresses` | 10 | auth |
| `/account/billing` | 10 | auth |
| `/account/following` | 10 | auth |
| `/account/notifications` | 10 | auth |
| `/account/orders` | 10 | auth |
| `/account/orders/:id` | 10 | auth |
| `/account/payments` | 10 | auth |
| `/account/plans` | 15 | auth |
| `/account/plans/upgrade` | 15 | auth |
| `/account/profile` | 10 | auth |
| `/account/sales` | 12 | seller |
| `/account/security` | 10 | auth |
| `/account/selling` | 12 | seller |
| `/account/selling/edit` | 12 | seller |
| `/account/selling/:id/edit` | 12 | seller |
| `/account/settings` | 10 | auth |
| `/account/wishlist` | 11 | auth |

### (auth) — Authentication (7 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/auth/login` | 3 | public |
| `/auth/sign-up` | 3 | public |
| `/auth/sign-up-success` | 3 | public |
| `/auth/forgot-password` | 3 | public |
| `/auth/reset-password` | 3 | public |
| `/auth/welcome` | 3 | public |
| `/auth/error` | 3 | public |

### (checkout) — Purchase Flow (2 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/checkout` | 7 | public |
| `/checkout/success` | 7 | public |

### (sell) — Seller Listing Creation (2 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/sell` | 8 | auth |
| `/sell/orders` | 12 | seller |

### (business) — Business Dashboard (13 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/dashboard` | 16 | business |
| `/dashboard/accounting` | 16 | business |
| `/dashboard/analytics` | 16 | business |
| `/dashboard/customers` | 16 | business |
| `/dashboard/discounts` | 16 | business |
| `/dashboard/inventory` | 16 | business |
| `/dashboard/marketing` | 16 | business |
| `/dashboard/orders` | 16 | business |
| `/dashboard/orders/:orderId` | 16 | business |
| `/dashboard/products` | 16 | business |
| `/dashboard/products/:id/edit` | 16 | business |
| `/dashboard/settings` | 16 | business |
| `/dashboard/upgrade` | 16 | business |

### (admin) — Platform Administration (8 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/admin` | 17 | admin |
| `/admin/docs` | 17 | admin |
| `/admin/notes` | 17 | admin |
| `/admin/orders` | 17 | admin |
| `/admin/products` | 17 | admin |
| `/admin/sellers` | 17 | admin |
| `/admin/tasks` | 17 | admin |
| `/admin/users` | 17 | admin |

### (plans) — Pricing (1 route)

| Route | Phase | Auth |
|-------|-------|------|
| `/plans` | 15 | public |

### (chat) — Messaging (2 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/chat` | 9 | auth |
| `/chat/:conversationId` | 9 | auth |

### [username] — Public Profiles (2 routes)

| Route | Phase | Auth |
|-------|-------|------|
| `/:username` | 13 | public |
| `/:username/:productSlug` | 6 | public |

### Coverage Verification

| Group | Routes | Phases Covering |
|-------|--------|-----------------|
| (main) | 30 | 2, 4, 5, 7, 11, 12, 13, 14 |
| (account) | 18 | 10, 11, 12, 15 |
| (auth) | 7 | 3 |
| (checkout) | 2 | 7 |
| (sell) | 2 | 8, 12 |
| (business) | 13 | 16 |
| (admin) | 8 | 17 |
| (plans) | 1 | 15 |
| (chat) | 2 | 9 |
| [username] | 2 | 6, 13 |
| **Total** | **85** | **All covered** |

---

## 9. Cross-Cutting Checklist

Applied during **every phase** for every route tested.

### Visual & Layout

- [ ] No horizontal overflow (no horizontal scrollbar)
- [ ] No content clipped or hidden behind fixed elements
- [ ] Safe area insets respected (bottom nav padding, notch area)
- [ ] Tab bar visible and correctly positioned (where applicable)
- [ ] Correct header variant for the route (5 variants: homepage, product, contextual, profile, minimal)
- [ ] Footer visible when scrolled to bottom (where applicable)
- [ ] No layout shift on load (CLS < 0.1)
- [ ] Images load with proper sizing (no stretched/squished images)
- [ ] Text is readable without zooming (≥ 14px body, ≥ 12px captions)
- [ ] Spacing consistent with design tokens (no visual crowding or gaps)

### Interaction & Touch

- [ ] All interactive elements have touch targets ≥ 44px (11 in Tailwind)
- [ ] No dead tap zones (elements that look interactive but don't respond)
- [ ] Scroll works smoothly (no jank, no stuck positions)
- [ ] Scroll position preserved on back navigation
- [ ] Pull-to-refresh doesn't interfere with content (if applicable)
- [ ] Drawers open/close smoothly with proper backdrop
- [ ] Modal/drawer dismissal via backdrop tap and swipe-down

### Navigation

- [ ] Tab bar navigation works (Home, Categories, Sell, Profile)
- [ ] Back button (browser) works correctly
- [ ] Deep linking works (direct URL access)
- [ ] Redirects happen correctly for auth-gated routes
- [ ] No navigation loops or dead ends

### State & Data

- [ ] Loading states present (skeleton, spinner, or placeholder)
- [ ] Empty states handled gracefully (no blank screens)
- [ ] Error states display meaningful messages
- [ ] Data persists correctly across navigation
- [ ] Form state preserved on back navigation

### Console & Errors

- [ ] No uncaught JavaScript errors in console
- [ ] No React hydration errors
- [ ] No 404 requests for assets
- [ ] No CORS errors
- [ ] Network requests complete successfully (no hanging)

### i18n

- [ ] No hardcoded English strings visible (all text through `next-intl`)
- [ ] Locale prefix in URL (`/en/...`)
- [ ] RTL-safe layout (future-proofing check)

---

## 10. Phase Document Template

Use `production-audit/TEMPLATE.md` for new phases and refreshes.  
As of 2026-02-13, phases `01..18` are aligned to the `Evidence Log (v2)` format.

```markdown
# Phase N: [Phase Name]

> One-line description of what this phase audits.

| Scope | ... |
|-------|-----|
| Routes | List of routes |
| Priority | P0/P1/P2/P3 |
| Dependencies | List of prerequisite phases |
| Devices | Pixel 5 (393×851) · iPhone 12 (390×844) |
| Auth Required | Yes/No — roles needed |
| Status | ⬜ Plan / 🧪 Ready / 🔄 In Progress / ✅ Complete |

---

## Prerequisites

- Auth state needed (logged out / logged in / seller / admin)
- Test data requirements (products, conversations, orders, etc.)
- Overlay dismissal (cookie consent, geo modal)
- Environment variables needed

---

## Routes Under Test

| # | Route | URL Pattern | Key Elements |
|---|-------|-------------|-------------|
| 1 | ... | `/en/...` | ... |

---

## Test Scenarios

### S{N}.{M}: [Scenario Name]

**Steps:**
1. Navigate to `...`
2. Verify `...`
3. Interact with `...`
4. Assert `...`

**Expected:** ...

**Screenshot checkpoint:** `phase-{N}-S{N}.{M}-{description}.png`

---

## Known Bugs to Verify

| Bug ID | Expected Behavior | Actual Behavior | Status |
|--------|-------------------|-----------------|--------|
| XXX-NNN | ... | ... | 🔴/✅ |

---

## Evidence Log (v2)

> Required: one row per scenario execution. This table is the release sign-off contract.

| Scenario | Method | Artifact | Result | Issue ID | Severity | Owner | Date |
|----------|--------|----------|--------|----------|----------|-------|------|
| S{N}.{M} | runtime/code trace/manual | `artifact` | Pass/Fail/Blocked | ISSUE-1234 | P0/P1/P2/P3 | ... | YYYY-MM-DD |

---

## Findings

> Filled during audit execution.

| # | Severity | Component | Description | Screenshot | Repro Steps |
|---|----------|-----------|-------------|------------|-------------|
| F{N}.1 | P0/P1/P2/P3 | ... | ... | `screenshot.png` | ... |

---

## Summary

| Metric | Value |
|--------|-------|
| Routes tested | N |
| Scenarios executed | N |
| Findings | N (P0: ?, P1: ?, P2: ?, P3: ?) |
| Known bugs verified | N |
| Status | ⬜/✅ |
```

---

## 11. File Index

Files to be created in `/production-audit/`:

| File | Content | Status |
|------|---------|--------|
| `master.md` | This document — orchestration + tracking | ✅ Created |
| `01-shell-navigation.md` | App shell, headers, tab bar, drawers, safe areas | 🧪 Ready |
| `02-landing-homepage.md` | Homepage sections, scroll, sticky pills, feed | 🧪 Ready |
| `03-auth-flows.md` | Sign up, login, password reset, auth drawer, onboarding | 🧪 Ready |
| `04-categories-discovery.md` | Category browsing, drawer, subcategories, filter/sort | 🧪 Ready |
| `05-search-quickview.md` | Search, results, filters, sorting, quick-view drawer | 🧪 Ready |
| `06-product-detail.md` | PDP layout, gallery, price, seller card, reviews | 🧪 Ready |
| `07-cart-checkout.md` | Cart drawer/page, checkout flow, Stripe, success | 🧪 Ready |
| `08-sell-form.md` | Multi-step wizard, stepper, photos, draft, publish | 🧪 Ready |
| `09-chat-messaging.md` | Chat inbox, conversation, real-time, images | 🧪 Ready |
| `10-account-pages.md` | All 18 account routes, mobile nav, profile, settings | 🧪 Ready |
| `11-wishlist.md` | Wishlist page, drawer, add/remove, shared | 🧪 Ready |
| `12-seller-management.md` | Seller dashboard, payouts, listings, sales, orders | 🧪 Ready |
| `13-user-profiles.md` | Public user/seller profiles | 🧪 Ready |
| `14-static-legal-pages.md` | 16 static/legal/info pages | 🧪 Ready |
| `15-plans-pricing.md` | Plans page, upgrade modal, comparison | 🧪 Ready |
| `16-business-dashboard.md` | 13 business dashboard routes | 🧪 Ready |
| `17-admin-panel.md` | 8 admin routes | 🧪 Ready |
| `18-cross-cutting.md` | i18n, a11y, performance, hydration, error pages | 🧪 Ready |

**Total: 19 files** (1 master + 18 phase documents)

---

## 12. Definitions

| Term | Definition |
|------|------------|
| **Phase** | A self-contained audit scope covering a specific area of the app |
| **Scenario** | A numbered test case within a phase (S{phase}.{number}) |
| **Finding** | A documented issue discovered during audit (F{phase}.{number}) |
| **Screenshot Checkpoint** | A specific app state that should be captured as a PNG |
| **Cross-Cutting Check** | A verification applied to every route in every phase |
| **P0** | Launch blocker — must fix before go-live |
| **P1** | Major UX issue — should fix before launch |
| **P2** | Polish — fix if time allows |
| **P3** | Nice-to-have — post-launch |
| **Shell** | The persistent UI chrome (header, tab bar, footer, drawers) |
| **Drawer** | Bottom-sheet overlay component (Vaul-based) |
| **Quick View** | Product preview drawer/dialog opened from search/category grid |
| **PDP** | Product Detail Page — full product page at `/:username/:product` |
| **Safe Area** | Device-specific inset areas (notch, home indicator) |
| **Hydration** | React server→client state synchronization |

---

## Phase Detail Summaries

### Phase 1: Shell & Navigation

**What:** The persistent mobile chrome that wraps every route — header variants (5 types), bottom tab bar, mobile drawers (auth, account, messages, category, cart, wishlist), safe area insets, cookie consent overlay, geo welcome modal.

**Why first:** Every other phase depends on the shell rendering correctly. If the tab bar is broken, navigation fails. If headers overlap content, every page is affected.

**Key tests:**
- Tab bar renders with 4 items (Home, Categories, Sell, Profile)
- Tab bar has correct active state per route
- Tab bar respects bottom safe area (`pb-tabbar-safe`)
- Each header variant renders for its route context
- Header height matches `--spacing-header` (48px)
- All 6 drawers open/close correctly (auth, account, messages, category, cart, wishlist)
- Drawer backdrop dismissal works
- No content hidden behind fixed header/tab bar
- Cookie consent + geo modal appear on fresh visit and can be dismissed
- `--spacing-bottom-nav` discrepancy (56px vs 48px documented) — verify which is correct

**Known bugs:** SAFE-001 (spacing mismatch), HYDRA-002 (useIsMobile SSR flash)

---

### Phase 2: Landing / Homepage

**What:** The homepage at `/` — hero section, category circles, promoted listings, newest listings, curated rail, featured hero, sticky category pills on scroll.

**Key tests:**
- All homepage sections render (`home-category-circles`, `home-section-promoted`, `home-section-newest`, `home-section-curated-rail`, `home-section-featured-hero`)
- Category circles are horizontally scrollable
- Sticky pills appear on scroll and are tappable
- Product cards display correct data (image, title, price, category — verify CAT-001)
- Promoted section shows boosted products (or graceful empty state)
- No horizontal overflow on any section
- Product card tap navigates to PDP
- Section headings are present and readable

**Known bugs:** CAT-001 (wrong category on cards)

---

### Phase 3: Auth Flows

**What:** All 7 auth routes + auth drawer + onboarding. Sign up form with username availability check, login form with remember-me, password reset flow, email confirmation screen, welcome page, error page. Auth drawer (tabbed login/signup in bottom sheet). Session persistence across navigation.

**Key tests:**
- Sign-up form: all fields visible, validation triggers, username availability check (500ms debounce), password strength meter with 4 indicators, submit works
- Login form: email + password fields, remember-me checkbox, submit works, **verify AUTH-001** (does UI update without hard refresh?)
- Auth drawer: opens from tab bar profile icon, tabs switch between login/signup, form works inside drawer, safe area padding
- Forgot password: form submits, confirmation shown
- Reset password: form with new password + confirm fields
- Sign-up success: email confirmation message displayed
- Welcome page: post-auth redirect works
- Error page: displays error message
- Touch targets ≥ 44px on all form elements (verify AUTH-003)
- Onboarding: wizard steps render, **verify ONB-001** (hardcoded styles), **verify ONB-002** (accessible without auth?)
- Form footer links have adequate touch targets (currently `min-h-8` = 32px, spec is 44px)

**Known bugs:** AUTH-001, AUTH-002, AUTH-003, ONB-001, ONB-002

---

### Phase 4: Categories & Discovery

**What:** Category browsing through the 3-level hierarchy (L0→L1→L2/L3). Category drawer (native mobile browsing), category pages with product grids, filter/sort bar, location filter chip.

**Key tests:**
- Category drawer opens from tab bar or header
- Category drawer shows L0 categories with icons
- Tapping L0 shows subcategories (L1)
- Tapping subcategory navigates to `/categories/:slug` or `/categories/:slug/:sub`
- Category page shows filter/sort bar (`mobile-filter-sort-bar`)
- Filter button opens filter panel
- Sort button opens sort options
- Location chip (`mobile-location-chip`) is visible and tappable
- Product grid renders with cards
- Product cards show correct category label (**verify CAT-001**)
- Empty category shows graceful empty state
- Pagination / infinite scroll works
- Back navigation preserves scroll position

**Known bugs:** CAT-001

---

### Phase 5: Search & Quick View

**What:** Search functionality — input, results grid, filters (price range, condition, location), sorting, and the product quick-view drawer (mobile-specific bottom sheet via `@modal` parallel route).

**Key tests:**
- Search input visible in header, tappable, opens keyboard
- Typing shows search results
- Results grid renders product cards
- Filter/sort bar present on results page
- Filters open and can be applied (price, condition, location)
- Sort options work (newest, price asc/desc, etc.)
- Tapping product card opens quick-view drawer (not full PDP)
- Quick-view drawer: product image, title, price, "View Full" button, "Add to Cart"
- Quick-view drawer closes on backdrop tap or swipe down
- Quick-view drawer scroll restore works (verify fragile `setTimeout(260ms)` hack)
- No results state shows helpful message
- **Verify FE-UX-006**: invalid `touch-action-*` utilities in quick view

**Known bugs:** FE-UX-006

---

### Phase 6: Product Detail Page

**What:** Full PDP at `/:username/:productSlug` — mobile-specific header, image gallery with swipe, price display, seller card, product attributes, share button, add-to-cart CTA, add-to-wishlist, reviews section, recently viewed rail.

**Key tests:**
- PDP loads with product-specific header (`MobileProductHeader`)
- Image gallery: swipe between images, pinch-to-zoom, dots indicator
- Price display correct (currency, formatting)
- Seller card: name, avatar, rating, "Message" button
- Attributes section (condition, size, brand, etc.)
- "Add to Cart" CTA is prominently visible and sticky (bottom of viewport)
- "Add to Wishlist" heart icon works
- Share button opens native share sheet or copies link
- Reviews section: displays existing reviews, rating summary
- "Write a Review" button (auth-gated)
- Recently viewed rail at bottom
- Back navigation returns to previous page
- Tab bar hidden on PDP (per main layout logic)
- **Verify FE-UX-006**: bracket `aspect-[...]` in quick view components

**Known bugs:** FE-UX-006

---

### Phase 7: Cart & Checkout

**What:** Cart drawer (slide-up from tab bar), full cart page, checkout flow (Stripe), and success/confirmation page. Guest checkout support.

**Key tests:**
- Cart drawer opens from header cart icon
- Cart drawer shows items with image, title, price, quantity controls
- Quantity +/- buttons work (verify `data-vaul-no-drag` prevents drawer scroll)
- Cart drawer "View Cart" navigates to `/cart`
- Full cart page: item list, subtotal, fees breakdown, "Proceed to Checkout"
- Cart badge count matches actual items (**verify LAUNCH-006**)
- Empty cart shows empty state with CTA
- Checkout page: shipping address, payment method, order summary
- Stripe payment element loads
- Checkout success page: order confirmation, order ID, next steps
- Guest checkout flow (no auth required)
- Remove item from cart works
- Back from checkout returns to cart

**Known bugs:** LAUNCH-006

---

### Phase 8: Sell Form

**What:** Multi-step mobile wizard at `/sell` — 5 steps: What (title + photos) → Category → Details → Pricing → Review. Framer Motion stepper transitions, photo upload, localStorage draft persistence, publish flow.

**Key tests:**
- Sell form requires auth (redirects to login if unauthenticated)
- Step 1 (What): Title input, photo upload area, AI autofill button
- Step 2 (Category): Category tree selection (3 levels)
- Step 3 (Details): Dynamic attribute fields based on category, condition selector, description
- Step 4 (Pricing): Price input, currency selector, shipping options
- Step 5 (Review): Summary of all entered data, "Publish" button
- Stepper header shows progress (step indicators)
- Stepper transitions animate smoothly (Framer Motion spring)
- Back/forward navigation between steps preserves data
- Draft auto-save to localStorage (2-second debounce)
- Draft restore on page reload
- Photo upload: select, preview, remove, reorder
- **Verify SELL-001**: Can the form progress past the Review step? Does Publish work?
- **Verify SELL-002**: shadcn styling consistency
- Stepper header/footer styling: verify `bg-background/95 backdrop-blur-md` and `border-border/40` (opacity modifiers flagged by DESIGN.md)
- Success screen renders after publish
- Sign-in prompt shown for unauthenticated users

**Known bugs:** SELL-001, SELL-002

---

### Phase 9: Chat & Messaging

**What:** Full-screen chat at `/chat` (inbox) and `/chat/:conversationId` (thread). Real-time Supabase messages, image sending, report/block. Messages drawer (recent 5 conversations).

**Key tests:**
- Chat layout takes over full viewport (`fixed inset-0`) — no header/tab bar
- Inbox: list of conversations with avatars, names, last message, timestamps, unread indicators
- Tapping conversation opens thread
- Thread: message bubbles (sent vs received styling), timestamps
- Message input: text field, send button, image attach button
- Send message works (appears in thread)
- Image upload in chat works
- Report conversation option accessible
- Block user option accessible
- Back button returns to inbox
- Messages drawer (from tab bar): shows recent 5 conversations
- Unread count badge on messages tab
- Empty inbox shows onboarding/empty state

**Known bugs:** None known — but this area is untested on mobile

---

### Phase 10: Account Pages

**What:** All 18 account routes. Mobile navigation gap: sidebar is `hidden lg:flex` at < 1024px — no visible nav alternative on mobile.

**Key tests:**
- `/account` dashboard renders with account overview
- `/account/profile` — edit display name, avatar, bio
- `/account/orders` — order list with filters
- `/account/orders/:id` — order detail view
- `/account/addresses` — address list, add/edit
- `/account/payments` — payment methods list
- `/account/security` — password change, 2FA (if any)
- `/account/settings` — general preferences
- `/account/notifications` — notification preferences
- `/account/billing` — billing history
- `/account/following` — followed sellers list
- **CRITICAL: Verify ACCT-001** — how do users navigate between account sections on mobile without the sidebar? Is there a mobile menu? Breadcrumbs? Or are users stranded?
- Each page has proper back navigation
- Each page handles empty states
- Unauthenticated access redirects to login (307)

**Known bugs:** ACCT-001 (no mobile navigation)

---

### Phase 11: Wishlist

**What:** Wishlist page (auth-gated), wishlist drawer, add/remove items, shared/public wishlist views.

**Key tests:**
- `/wishlist` requires auth (redirect if unauthenticated)
- Wishlist page shows saved items grid
- Remove item from wishlist
- Wishlist drawer opens from header heart icon
- Drawer shows items with prices (`suppressHydrationWarning` on price — check for flash)
- Empty wishlist shows helpful empty state
- `/wishlist/:token` — personal shareable link renders
- `/wishlist/shared/:token` — public shared wishlist renders
- `/account/wishlist` — account-integrated wishlist view
- Adding item from PDP updates wishlist count

**Known bugs:** None specific, but sharing UI not exposed (R9.5 ⬜)

---

### Phase 12: Seller Management

**What:** Seller-specific routes — dashboard, payout settings, listing management, sales, and seller orders.

**Key tests:**
- `/seller/dashboard` — basic dashboard with stats
- `/seller/settings/payouts` — Stripe Connect payout settings
- `/account/selling` — my listings grid
- `/account/selling/edit` — create new listing (different from `/sell` wizard?)
- `/account/selling/:id/edit` — edit existing listing
- `/account/sales` — sales overview
- `/sell/orders` — seller order management
- All routes require seller auth level
- Non-seller users redirected appropriately

**Known bugs:** None specific

---

### Phase 13: User Profiles

**What:** Public user/seller profile pages, product listings by user.

**Key tests:**
- `/:username` — profile page renders with avatar, bio, listings
- Seller profile shows: rating, badge, product count, join date
- Product grid shows user's active listings
- "Message" button initiates chat (auth-gated)
- "Follow" button works (auth-gated)
- Profile of non-existent user shows 404
- `/sellers` directory page — list of sellers

**Known bugs:** None specific

---

### Phase 14: Static & Legal Pages

**What:** 16 static/info pages that need to render correctly on mobile.

**Routes:**
`/about`, `/accessibility`, `/assistant`, `/cookies`, `/privacy`, `/returns`, `/terms`, `/contact`, `/customer-service`, `/faq`, `/feedback`, `/help`, `/security`, `/gift-cards`, `/members`, `/messages`, `/registry`, `/todays-deals`

**Key tests:**
- Each page renders without errors
- Content is readable on mobile viewport
- No horizontal overflow
- Navigation back to main app works
- Links in content are tappable (44px targets)
- Contact/feedback forms work (if form-based)

**Known bugs:** None specific

---

### Phase 15: Plans & Pricing

**What:** Plans page and upgrade modal.

**Key tests:**
- `/plans` — pricing table/cards render
- Plan comparison visible (features per tier)
- CTA buttons work ("Choose Plan", "Upgrade")
- `/account/plans` — current plan display
- `/account/plans/upgrade` — upgrade flow
- Upgrade `@modal` parallel route opens as overlay
- Price display correct by locale (€ formatting)

**Known bugs:** None specific

---

### Phase 16: Business Dashboard

**What:** All 13 business dashboard routes — likely uses sidebar layout that may not be mobile-responsive.

**Key tests:**
- Each route renders on mobile viewport
- Sidebar navigation: is it accessible? Hamburger menu? Collapsible?
- Content area doesn't overflow
- Tables/grids are readable (horizontal scroll or card view?)
- Forms work on mobile
- Charts/graphs render proportionally
- **Verify DASH-001**: `SidebarProvider` mobile handling

**Known bugs:** DASH-001

---

### Phase 17: Admin Panel

**What:** All 8 admin routes — similar sidebar layout concerns as business dashboard.

**Key tests:**
- Each route renders on mobile viewport
- Admin sidebar navigation on mobile
- Data tables are usable (not clipped)
- Admin actions are accessible
- **Verify ADMIN-001**: sidebar mobile handling

**Known bugs:** ADMIN-001

---

### Phase 18: Cross-Cutting

**What:** Final sweep across all routes for i18n, accessibility, performance, and systemic issues.

**Sub-audits:**

1. **i18n (Bulgarian locale):** Navigate all P0/P1 routes in `/bg/` locale. Verify translations present, no missing keys, date/number formatting correct, currency display correct.

2. **Accessibility (axe-core):** Run axe-core scans on top 10 routes. Check focus management, heading hierarchy, aria labels, color contrast, touch target sizes.

3. **Performance:** Measure LCP on homepage, category, search, PDP. Check CLS across navigation. Verify no layout shift from hydration.

4. **Error handling:** Test global error page (`global-error.tsx`), not-found page (`global-not-found.tsx`), per-route error boundaries, invalid URLs (404s).

5. **Hydration:** Systematically check for hydration mismatch warnings, especially on routes using `useIsMobile()`, `suppressHydrationWarning`, and client-only state.

**Known bugs:** HYDRA-002

---

## Execution Tracking

> Updated as phases are executed.

| Phase | Plan Status | Execution Status | Findings Count | Last Updated |
|-------|-------------|------------------|----------------|-------------|
| 0 (Command Center) | ✅ | ✅ Documentation baseline normalized | 0 | 2026-02-11 |
| 1 | 🧪 | ✅ Complete: 16/16 shell scenarios executed (SAFE-001 resolved, HYDRA-002 open) | 1 (P1:1) | 2026-02-11 |
| 2 | 🧪 | ✅ Complete: 15/15 homepage scenarios executed; promoted-stack gaps + CAT-001 still open | 4 (P1:2, P2:1, P3:1) | 2026-02-11 |
| 3 | 🧪 | ✅ Complete: auth/onboarding code audit rerun; AUTH-001/002 resolved, AUTH-003 partially open | 3 (P1:1, P2:1, P3:1) | 2026-02-11 |
| 4 | 🧪 | ✅ Complete: 15/15 category scenarios executed; CAT-001 remains open | 2 (P1:2, includes 1 resolved historical) | 2026-02-11 |
| 5 | 🧪 | ✅ Complete: 15/15 search/quick-view scenarios passed; FE-UX-006 resolved | 0 | 2026-02-11 |
| 6 | 🧪 | ✅ Complete: 18/18 PDP scenarios passed; FE-UX-006 resolved | 1 (P1:1, historical resolved) | 2026-02-11 |
| 7 | 🧪 | ✅ Complete: 15/15 cart/checkout scenarios passed; LAUNCH-006 resolved | 1 (P1:1, historical resolved) | 2026-02-11 |
| 8 | 🧪 | ✅ Complete: SELL-001 confirmed open (leaf-category + review edit mapping defects) | 5 (P0:1, P1:2, P2:2) | 2026-02-11 |
| 9 | 🧪 | ✅ Complete: chat/report flow audited; image-send, admin-report recipient, and route consistency issues found | 4 (P1:3, P2:1) | 2026-02-11 |
| 10 | 🧪 | ✅ Complete: account route/nav audit; ACCT-001 resolved, i18n debt remains | 1 (P2:1) | 2026-02-11 |
| 11 | 🧪 | ✅ Complete: wishlist/public-share audit; auth gate + shared-link issues found | 5 (P1:3, P2:2) | 2026-02-11 |
| 12 | 🧪 | ✅ Complete: seller management audit; role guard inconsistency, route issues, and action-surface risks found | 5 (P1:3, P2:2) | 2026-02-11 |
| 13 | 🧪 | ✅ Complete: profile/directory audit; message CTA query mismatch found | 2 (P2:1, P3:1) | 2026-02-11 |
| 14 | 🧪 | ✅ Complete: 6/6 static/legal scenarios executed; legal CTA touch target under spec | 1 (P2:1) | 2026-02-11 |
| 15 | 🧪 | ✅ Complete: plans/upgrade modal audit; tier-state + currency/i18n issues found | 3 (P1:1, P2:2) | 2026-02-11 |
| 16 | 🧪 | ✅ Complete: DASH-001 split verdict (sidebar mobile infra present, content responsiveness still open) | 9 (P1:4, P2:5) | 2026-02-11 |
| 17 | 🧪 | ✅ Complete: ADMIN-001 partial (sidebar fixed, table/readability + UX gaps remain) | 5 (P1:1, P2:4) | 2026-02-11 |
| 18 | 🧪 | ✅ Complete: 16/16 cross-cutting scenarios executed (7 pass, 4 fail, 5 blocked); HYDRA-002 open, a11y suite failing | 6 (P1:2, P2:4) | 2026-02-11 |

---

*Last updated: 2026-02-11*


