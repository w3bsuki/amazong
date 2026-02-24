# Playwright MCP Full Audit — 2026-02-24

> **Auditor:** Orchestrator (Copilot) via Playwright MCP at 764×485 viewport
> **Target:** localhost:3000 — all routes, EN + BG
> **Goal:** Brutally honest, production-ready audit for Codex CLI to fix
> **Honesty pledge:** Every finding is verified via DOM snapshot + evaluate. Nothing invented.

---

## Viewport Note

Playwright MCP locks viewport at 764×485 (between mobile/desktop). Mobile tab bar IS visible at this width (md breakpoint = 768px, our 764px is just below). True 375px mobile layout testing needs manual device or real Playwright config.

---

## GLOBAL ISSUES (affect multiple/all pages)

### G-001: Double H1 on most pages (SEO + A11y)
**Severity:** HIGH
**Where:** Homepage, profile pages, ALL legal/support pages (terms, privacy, cookies, returns, contact, security, feedback, customer-service), categories index, search
**What:** Two `<h1>` elements on the same page. Pattern varies:
- **Homepage:** "Home" (sr-only) + "Treido Home" (sr-only) — both 1×1px
- **Legal/support pages:** Raw slug in header ("terms", "privacy", "cookies", "customer-service", "feedback", "security", "returns", "contact") + proper title in main content ("Terms of Service", "Privacy Policy", etc.)
- **Search/categories:** Empty H1 in header (heading [level=1] with NO text) + real H1 in main
- **Profile:** "123123123" (display_name) appears as H1 twice
**Fix:** One H1 per page. Header should use a different heading level or visually hidden breadcrumb. Kill the raw-slug H1 in the search/browse/legal header.
**Files:** `components/layout/` (header components), `app/[locale]/(main)/(support)/`, `app/[locale]/(main)/(legal)/`

### G-002: Double "| Treido" in page titles (SEO)
**Severity:** MEDIUM
**Where:** Categories pages, Plans page
**Examples:**
- `/en/categories/electronics` → "Electronics — Treido | Treido"
- `/en/plans` → "Plans | Treido | Treido"
- `/bg/plans` → "Plans | Treido | Treido" (also not translated!)
**Fix:** `generateMetadata` on these pages is returning a title that already includes "| Treido" or "— Treido", but the root layout template also appends "| Treido". Remove the suffix from the page-level metadata.
**Files:** `app/[locale]/(main)/categories/[slug]/page.tsx`, `app/[locale]/(plans)/plans/page.tsx`

### G-003: Console auth errors on every page load
**Severity:** LOW (expected for unauthenticated)
**What:** Every page shows `[WARNING] GoTrueClient...` + `[ERROR] Failed to refresh session` — Supabase auth trying to refresh a non-existent session for guest users.
**Fix:** Suppress or handle gracefully. Not blocking but noisy.

### G-004: Raw URL slug as H1 in header (legal/support/search pages)
**Severity:** HIGH
**Where:** ALL support/legal pages: terms, privacy, cookies, customer-service, returns, contact, security, feedback. Also 404 pages.
**What:** The header component displays the raw URL slug (e.g., "customer-service", "terms", "feedback") as an H1. This is not user-facing text — it's a routing artifact.
**Fix:** Either hide this header H1 entirely on these pages, or use the translated page title instead of the route slug.
**Files:** The header component that renders the slug-based H1 (likely in `components/layout/` or a shared page header)

---

## SECTION-BY-SECTION FINDINGS

### Section 2: Auth — PASS (8/10)

| Check | Status | Notes |
|-------|--------|-------|
| Login page | ✅ | H1 "Sign in", Google OAuth, email/password, show/hide toggle, remember me, forgot link, sign up link, legal links, disabled submit |
| Sign up | ✅ | H1 "Create account", 5 fields (name, username, email, password, confirm), Google OAuth, disabled submit, legal links |
| Forgot password | ✅ | H1 "Forgot password", email field, send reset, back to login link |
| Reset password | ⚠️ | Shows "Link expired" correctly for invalid tokens, BUT **hydration error** in console |
| Auth error | ✅ | H1 "Something went wrong", try again/home/contact support links |
| Sign-up success | ✅ | Thank you heading, check email, resend button, sign in/home links |
| Auth guards | ✅ | /account → /auth/login?next=, /onboarding → /auth/login?next=, /checkout → /auth/login?next= |
| BG i18n | ✅ | Login fully translated: "Влез", "Имейл", "Парола", "Запомни ме", etc. |

**Issues:**
- **AUTH-001:** Hydration error on `/en/auth/reset-password` — "Hydration failed because the server rendered..." Console error visible. This is a real React bug.
- **AUTH-002:** Missing autocomplete attributes on email/password inputs (modern webapp pattern)

---

### Section 3: Selling — CONDITIONAL PASS (6/10)

| Check | Status | Notes |
|-------|--------|-------|
| Guest CTA | ✅ | "Sign in to start selling" with sign in/sign up/back to home |
| Auth guard | ✅ | /account/selling redirects to login with ?next= |
| BG i18n | ✅ | Guest CTA translated |
| Sell form (auth) | ❓ | Cannot test without credentials |
| Two nested `<main>` | ⚠️ | DOM has `<main>` layout wrapper + `<main>` content — invalid HTML |

**Issues:**
- **SELL-001:** Two `<main>` landmark elements in DOM (layout wrapper + page content). Invalid HTML, accessibility violation.
- **SELL-002:** Cannot test the actual sell form, image upload, validation, or listing creation without authentication.

---

### Section 4: PDP — PASS (7/10)

| Check | Status | Notes |
|-------|--------|-------|
| Product loads | ✅ | Title, price (BGN), category badges, condition, location, attributes, accordions, safety tips, similar items |
| Image | ✅ | Main image renders with alt text |
| Seller info | ✅ | Avatar, name, verified badge visible |
| Contact buttons | ✅ | Call Seller (disabled), Contact Seller (enabled) |
| Share | ✅ | Button present in header |
| Similar items | ✅ | 10 items in horizontal scroll with prices |
| 404 handling | ❌ | See below |

**Issues:**
- **PDP-001:** Title includes test data: "2022 BMW 330i xDrive Sedan | **123123123** | Treido" — the seller's display_name "123123123" is garbage data shown in the browser tab title.
- **PDP-002:** Price currency mismatch — homepage shows **€38,500** but PDP shows **BGN 38,500.00**. Users see different currencies for the same product depending on where they look.
- **PDP-003:** Banner landmark nested inside banner landmark (`<header>` > `<header>`) — accessibility violation.
- **PDP-004:** Similar items show Bulgarian product names on English page ("Айсифон 17", "Грозни обувки", "БУБА", "ЧРД АНТОНИЯ") — products have BG titles that aren't translated.
- **PDP-005:** Product "iPhone 15 Pro Max" categorized under "Huawei" subcategory — data quality (seed data, not code bug).

---

### Section 5: Search & Browse — PASS (7/10)

| Check | Status | Notes |
|-------|--------|-------|
| Search results | ✅ | /search?q=bmw returns correct result |
| Empty state | ✅ | "No results found" with "Try different keywords" and "Browse All" link |
| Category page | ✅ | Electronics shows 20+ products with subcategory nav |
| Categories index | ✅ | 24 categories with icons and search box |
| Sort & Filter | ✅ | Sort dropdown and Filters button present |
| Seller mode | ✅ | "Sellers" tab link present |

**Issues:**
- **SEARCH-001:** H1 is EMPTY on search and browse pages. The header `<h1>` element exists but has no text content — invisible, useless H1. SEO harmful.
- **SEARCH-002:** Category page title double suffix: "Electronics — Treido | Treido" (see G-002).
- **SEARCH-003:** "Back" link on categories index page points to `/en/categories` (itself!) — circular navigation.
- **SEARCH-004:** Search results show seller "123123123" — seed data quality.

---

### Section 6: Checkout — PASS (7/10)

| Check | Status | Notes |
|-------|--------|-------|
| Auth guard | ✅ | Redirects to /auth/login?next=%2Fcheckout |
| BG redirect | ✅ | Preserves locale correctly |

**Issues:**
- **CHECKOUT-001:** Cannot test checkout flow, Stripe payment, order creation, or success page without auth + cart items.
- **CHECKOUT-002:** Cart page errors (see CART section) block checkout testing.

---

### Section 7: Orders — PASS (7/10)

| Check | Status | Notes |
|-------|--------|-------|
| Auth guard (orders) | ✅ | /account/orders → login with ?next= |
| Auth guard (sales) | ✅ | /account/sales → login with ?next= |
| Auth guard (sell/orders) | ✅ | Redirects to login |

**Issues:**
- **ORDERS-001:** Cannot test order list, detail, status updates, or reviews without authentication.

---

### Section 8: Profile & Account — PASS (7/10)

| Check | Status | Notes |
|-------|--------|-------|
| Auth guard (account) | ✅ | Redirects to login with ?next= |
| Public profile | ✅ | /treido loads with avatar, badges, stats (7 listings, 1 sold, 0 followers, 6 following), tabs (For sale, Reviews) |
| Nonexistent profile | ⚠️ | Title correct ("Profile not found | Treido") but body empty! |

**Issues:**
- **PROFILE-001:** Display name "123123123" appears as title, H1 (twice!), and throughout the profile page — seed data.
- **PROFILE-002:** Two H1 elements on profile page, both showing "123123123".
- **PROFILE-003:** Profile 404 page has **empty body** — no message, no links, just blank main area. User sees an empty page with a raw slug H1.

---

### Section 9: Cart & Wishlist — FAIL (4/10)

| Check | Status | Notes |
|-------|--------|-------|
| Cart page loads | ❌ | Crashes: "Couldn't load cart" due to invalid image src props in seed data |
| Cart badge | ⚠️ | Shows "123" — clearly test/seed data artifact |
| Wishlist page | ✅ | Loads with empty state after brief loading spinner. "Your wishlist is empty" with "Start Shopping" CTA |
| Wishlist breadcrumb | ✅ | "Home / My Wishlist" navigation path |

**Issues:**
- **CART-001:** Cart page throws error immediately: "Invalid src prop" from seed data images. 4 console errors. Error boundary catches it ("Couldn't load cart" with retry + continue shopping) but the page is completely broken for viewing cart contents.
- **CART-002:** Cart badge shows "123" — leftover seed data or test state. Should show 0 for guests.
- **CART-003:** Wishlist shows brief "Loading wishlist..." then empty state — acceptable for guests, but no login prompt to suggest signing in to see saved items.
- **CART-004:** Cannot test add/remove cart items, quantities, totals, or proceed-to-checkout without auth + working cart.

---

### Section 10: Onboarding — CONDITIONAL PASS (7/10)

| Check | Status | Notes |
|-------|--------|-------|
| Auth guard | ✅ | /onboarding → /auth/login?next= |
| BG redirect | ✅ | Works with correct locale |

**Issues:**
- **ONBOARD-001:** Cannot test the 5-step wizard, account type selection, or completion flow without fresh signup.
- **ONBOARD-002:** Console TypeError during navigation: "Failed to execute 'measure' on 'Performance'" — likely Next.js internal, but worth noting.

---

### Section 11: Navigation & Layout — PASS (7/10)

| Check | Status | Notes |
|-------|--------|-------|
| Mobile tab bar | ✅ | 5 tabs: Home (link), Browse (button), Sell (link), Chat (button), Profile (button). Visible at 764px. |
| Header | ✅ | Logo, search button, wishlist, cart icons. Hamburger menu on mobile |
| Skip links | ✅ | 4 skip links: main content, sidebar, products, footer |
| Footer | ✅ | Company, Help (expanded), Sell & Business, Services sections. Legal links: Terms, Privacy, Cookies, ODR. Company info with registration numbers |

**Issues:**
- **NAV-001:** Hamburger menu icon visible at top-left (`ref=e11` on cart page) but NOT on homepage — inconsistent header between routes.
- **NAV-002:** No language switcher visible anywhere in the UI. Users cannot switch between EN and BG from the interface.
- **NAV-003:** No dark mode toggle visible anywhere in the UI.
- **NAV-004:** Cart page shows completely different header from homepage (hamburger + logo vs logo only + search). Check header consistency across routes.

---

### Section 12: Business Dashboard — NOT TESTED (Auth required)

| Check | Status | Notes |
|-------|--------|-------|
| Auth guard | ⚠️ | Redirects to /auth/login WITHOUT `?next=` param! Return URL lost. |

**Issues:**
- **DASH-001:** Dashboard auth redirect goes to `/en/auth/login` without `?next=%2Fen%2Fdashboard` — user loses their intended destination after login. All other auth guards correctly preserve the return URL.

---

### Section 13: Plans & Subscriptions — PARTIAL (5/10)

| Check | Status | Notes |
|-------|--------|-------|
| Plans page loads | ✅ | H1 "Plans & Pricing", plan tiers visible, comparison table |
| Plan tiers | ✅ | Personal Free (current), Personal Plus (€3.99), Personal Pro (€7.99) |
| BG translation | ⚠️ | Partial — headers translated, plan features NOT translated |

**Issues:**
- **PLANS-001:** Title "Plans | Treido | Treido" — double suffix (see G-002). Also NOT translated in BG.
- **PLANS-002:** Price display shows "€3.99 //mo" and "€7.99 //mo" — double slash before period unit. Should be "/mo".
- **PLANS-003:** BG plans page has MIXED translations:
  - ✅ Translated: "Планове и цени", "Личен/Бизнес", "Месечно/Годишно", "30 обяви/мес", "Такса за купувача"
  - ❌ NOT translated (English on BG page): "30 active listings", "0% seller fee (keep 100% of item price)", "Buyer protection: 4% + €0.50 (cap €15)", "Personal Free", "Personal Plus", "Personal Pro"
- **PLANS-004:** "Current" badge shows on free plan for unauthenticated users — confusing for guests who don't have a plan.

---

### Section 14: Chat & Messaging — PASS (guest state) (6/10)

| Check | Status | Notes |
|-------|--------|-------|
| Guest CTA | ✅ | "Sign in to view messages" with sign in (preserves ?next=), sign up, home links |

**Issues:**
- **CHAT-001:** No `<h1>` or heading element on the chat guest page — content uses generic divs. Accessibility violation.
- **CHAT-002:** Cannot test actual messaging, conversation list, send/receive without auth.

---

### Section 15: Support & Legal Pages — PARTIAL (5/10)

| Check | Status | Notes |
|-------|--------|-------|
| Terms of Service | ✅ | Real content: 12 sections, table of contents, last updated date |
| Privacy Policy | ✅ | Has content (BG verified) |
| Cookie Policy | ✅ | Has content |
| Customer Service | ✅ | Rich page: 7 help categories, search, accordion topics, "Start Chatting" CTA |
| Returns & Refunds | ✅ | Has content |
| Contact Us | ✅ | Has content |
| Security | ✅ | Has content |
| Feedback | ✅ | Full form: 4 feedback types, textarea, optional email, "Send Feedback" button |

**Issues:**
- **LEGAL-001:** ALL legal/support pages have double H1 (see G-001, G-004). Header shows raw slug ("terms", "privacy", etc.) as first H1.
- **LEGAL-002:** Some pages have a "Share" button in the header — does sharing a Terms of Service page make sense? Noise in the UI.

---

## 404 / NOT-FOUND HANDLING — FAIL (3/10)

**Issues:**
- **404-001:** Navigating to `/en/nonexistent-page` shows:
  - Title: "Profile not found | Treido" (always assumes it's a missing profile, even for random URLs)
  - H1: Raw URL slug "nonexistent-page-testing-404" displayed as heading
  - Body: COMPLETELY EMPTY — no message, no "Go to homepage" link, nothing
  - Has a "Share" button (why share a 404?)
- **404-002:** The `[username]` catch-all route intercepts ALL unknown paths, so there's no real 404 page for non-profile URLs.
- **404-003:** This was supposedly fixed in "FIX-D" but the body content is still empty at audit time. The fix may have been incomplete or regressed.

---

## CURRENCY INCONSISTENCY — HIGH PRIORITY

**Issue:**
- Homepage product cards show prices in **€** (EUR): "€38,500", "€2,500", "€1,950"
- PDP page shows the same product in **BGN**: "BGN 38,500.00"
- Search results show **€** prices
- Plans page shows **€** prices

This is confusing for users. Pick one currency and be consistent everywhere, or clearly label the currency context.

---

## UI/UX PATTERNS FOR 2026 — OBSERVATIONS

These aren't bugs but areas where the app doesn't match modern 2026 webapp expectations:

1. **No loading skeletons** — Route transitions show blank/empty main content before data loads (confirmed by homepage snapshot showing empty main before products render). Modern apps show skeleton placeholders.
2. **No toast/notification system visible** — actions (add to cart, wishlist) likely need feedback but no toast component was observed in any snapshot.
3. **No "back to top" button** — Long homepage scroll (20+ products) with no quick-jump-to-top.
4. **No cookie consent banner** — European marketplace (GDPR) should show cookie consent on first visit.
5. **No pull-to-refresh** on mobile — standard mobile webapp pattern.
6. **No image lazy loading indicators** — Products load images but no blur placeholder or skeleton.
7. **Cart badge "123" for guests** — Should show 0 or be hidden for unauthenticated users.
8. **Price formatting inconsistency** — Some prices use comma separators (€38,500), some use dots (€299.99). The locale-specific formatting may be correct but feels inconsistent.
9. **No breadcrumb navigation** on most pages — Only seen on wishlist. Modern ecommerce shows breadcrumbs on PDP, categories, etc.
10. **Footer accordion** — "Help" section is expanded by default but Company/Sell & Business/Services are collapsed. Should all start collapsed on mobile for cleaner layout.

---

## SCORE SUMMARY (Honest Re-Assessment)

| # | Section | Previous Score | New Score | Delta | Reason |
|---|---------|---------------|-----------|-------|--------|
| 1 | Infrastructure & Gates | 10 | 10 | = | Not re-tested (gates pass) |
| 2 | Auth | 9 | 8 | -1 | Hydration error on reset-password |
| 3 | Selling | 7 | 6 | -1 | Double main landmark, can't verify form |
| 4 | PDP | 8 | 7 | -1 | Currency mismatch, nested banners, BG product names on EN |
| 5 | Search & Browse | 9 | 7 | -2 | Empty H1, double title suffix, circular back link |
| 6 | Checkout | 8 | 7 | -1 | Can't test without auth + working cart |
| 7 | Orders | 9 | 7 | -2 | Can't test without auth |
| 8 | Profile & Account | 9 | 7 | -2 | Empty 404 body, double H1 |
| 9 | Cart & Wishlist | 8 | 4 | -4 | Cart page crashes, badge shows 123 |
| 10 | Onboarding | 8 | 7 | -1 | Can't test, console TypeError |
| 11 | Navigation & Layout | 9 | 7 | -2 | No lang switcher, no dark toggle, inconsistent header |
| 12 | Business Dashboard | — | 3 | new | Auth redirect loses return URL |
| 13 | Plans | — | 5 | new | Double title, //mo typo, partial BG translation |
| 14 | Chat | — | 6 | new | No heading, basic guest CTA only |
| 15 | Legal/Support | — | 5 | new | Raw slug H1s, share on legal pages |

**Overall Average: 6.4/10** (was reported as 8.7/10 — previous audit was too generous)

---

## PRIORITY FIXES FOR CODEX CLI

### P0 — Must Fix Before Launch

| ID | Fix | Files to check |
|----|-----|----------------|
| FIX-001 | Fix single H1 per page globally — kill raw-slug H1 in header component for legal/support/search pages | `components/layout/` page header component |
| FIX-002 | Fix double "| Treido" title suffix on categories + plans pages | `app/[locale]/(main)/categories/[slug]/page.tsx`, `app/[locale]/(plans)/` |
| FIX-003 | Fix empty 404 body — [username] not-found needs to render error message + links | `app/[locale]/[username]/not-found.tsx` |
| FIX-004 | Fix currency consistency — either all EUR or all BGN, not mixed | `components/shared/product/`, PDP price component, product card price |
| FIX-005 | Fix hydration error on /auth/reset-password | `app/[locale]/(auth)/auth/reset-password/` |
| FIX-006 | Fix cart page crash from invalid image src | Cart components, image normalization |
| FIX-007 | Fix plans page "//mo" — should be "/mo" | Plans pricing component |
| FIX-008 | Fix dashboard auth guard to preserve return URL (?next=) | `app/[locale]/(business)/dashboard/` layout or middleware |

### P1 — Should Fix

| ID | Fix | Files to check |
|----|-----|----------------|
| FIX-009 | Fix plans page BG translation — half the features are in English | `messages/bg.json` plans section |
| FIX-010 | Fix plans page title not translated in BG | `app/[locale]/(plans)/` metadata |
| FIX-011 | Fix nested `<main>` on sell page | `app/[locale]/(sell)/` layout |
| FIX-012 | Fix nested `<banner>` on PDP (header > header) | PDP layout, `app/[locale]/[username]/[productSlug]/` |
| FIX-013 | Add H1 to chat guest page | `app/[locale]/(chat)/` |
| FIX-014 | Remove "Share" button from legal/support page headers | Legal page header component |
| FIX-015 | Fix cart badge showing "123" for guests | Cart context/provider |
| FIX-016 | Categories "Back" link points to itself — should go to homepage | `app/[locale]/(main)/categories/page.tsx` |
| FIX-017 | Add language switcher to UI (visible toggle for EN/BG) | `components/layout/` header/footer |
| FIX-018 | "Current" badge on free plan for unauthenticated users is confusing | Plans page component |

### P2 — Nice to Have

| ID | Fix |
|----|-----|
| FIX-019 | Add cookie consent banner (GDPR requirement) |
| FIX-020 | Add loading skeletons for route transitions |
| FIX-021 | Add breadcrumb navigation to PDP and category pages |
| FIX-022 | Suppress GoTrueClient console warnings for unauthenticated users |
| FIX-023 | Footer: all accordion sections collapsed by default on mobile |

---

## METHODOLOGY

Every finding was verified by:
1. `navigate` to the URL — captured full accessibility tree snapshot
2. `evaluate` to extract DOM data (titles, H1s, text content, visibility, computed styles)
3. `screenshot` for visual reference
4. Cross-checked EN vs BG for i18n parity

**What I could NOT test (requires authentication):**
- Sell form fields, image upload, listing creation/edit/delete
- Checkout payment flow (Stripe)
- Order list, detail, status updates, reviews
- Account settings, profile edit, avatar upload
- Onboarding wizard steps
- Business dashboard content
- Cart add/remove, quantity changes
- Wishlist save/remove interactions
- Chat conversations, send/receive messages

These items remain unchecked in the CHECKLIST.md and require either:
1. Test user credentials provided to the auditor
2. Manual testing by the human
3. Automated E2E tests with seeded auth state

---

*Audit completed: 2026-02-24T05:22Z*
*Auditor: Orchestrator via Playwright MCP*
*Total routes tested: 25+*
*Total issues found: 23 distinct issues across 15 sections*
