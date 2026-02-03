# Frontend Issues — Playwright Audit (2026-02-03)

> UI/UX + routing issues discovered during production testing.

| Started | 2026-02-03 |
|---------|------------|
| Status | ✅ Complete |
| Target | https://www.treido.eu |

---

## Issue Count by Severity

| Severity | Count |
|----------|-------|
| 🔴 Critical | 4 |
| 🟠 High | 3 |
| 🟡 Medium | 4 |
| 🟢 Low | 1 |

---

## Critical

### ISSUE-001: Obvious junk/test listings visible on production

| Field | Value |
|-------|-------|
| Viewport | Desktop + Mobile |
| Routes | `/bg/categories/*`, `/bg/search` |
| Severity | 🔴 Critical |
| Type | Trust / Content Quality |
| Evidence | Listings like `asadsdasdasd`, giant numeric titles, absurd review counts, placeholder-like prices |

**Expected**
- Production catalog contains real listings only (or clearly marked demo content in a non-prod environment).

**Actual**
- Category/search grids show junk listings and unrealistic metadata (review counts, titles), which makes the site feel fake.

**Impact**
- This alone can kill conversion and brand trust; also breaks layout (long titles overflow/wrap badly).

**Tasks (ship-blocking)**
- [ ] Purge/disable junk listings in production (soft-delete or status flag; don’t “hide” only in UI).
- [ ] Add server-side validation for listing creation (min length, profanity/garbage heuristics, max length).
- [ ] Add “production content QA” checklist before deploy (spot-check category + search grids).
- [ ] Add UI fallback for long titles (line clamp + tooltip on desktop).

**Acceptance criteria**
- No placeholder/junk titles appear in `/bg/search` and top 5 categories.
- No absurd review counts or placeholder store names are visible in production.

---

### ISSUE-002: Missing i18n keys visible + repeated console `MISSING_MESSAGE` + React error #419

| Field | Value |
|-------|-------|
| Viewport | Desktop + Mobile |
| Routes | Store profile pages like `/bg/tech_haven` (also seen across other routes) |
| Severity | 🔴 Critical |
| Type | i18n / Runtime Stability |
| Evidence | UI shows raw keys like `ProfilePage.listings`, `Seller.message`; console logs `MISSING_MESSAGE: Navigation.back (bg)`; React runtime error #419 |

**Expected**
- No missing translation keys in production; no runtime React errors in console.

**Actual**
- Store profile renders raw i18n keys and emits repeated missing-message logs; React throws minified error #419.

**Impact**
- Makes the product look unfinished; runtime error could break interactions and cause unpredictable UI state.

**Tasks (ship-blocking)**
- [ ] Add missing keys to both `messages/bg.json` and `messages/en.json` (at minimum: `Navigation.back`, `ProfilePage.*`, `Seller.message`).
- [ ] Add a build-time/CI gate to fail on missing messages (production must not ship with `MISSING_MESSAGE`).
- [ ] Debug React error #419 on store profile page (reproduce locally using production build, not dev; fix underlying component/state issue).
- [ ] Ensure buttons never render translation keys as labels (no “key-as-fallback” in production UI).

**Acceptance criteria**
- Store profile page shows translated labels (no raw keys).
- Console has **zero** `MISSING_MESSAGE` errors on `/bg`, `/bg/search`, `/bg/categories/*`, `/bg/:store`.
- No React runtime errors during navigation and interaction.

---

### ISSUE-003: AI assistant is live but broken (`/api/assistant/chat` → 404) and UI doesn’t recover

| Field | Value |
|-------|-------|
| Viewport | Desktop + Mobile |
| Routes | Search AI assistant UI (toggle “AI Режим”) |
| Severity | 🔴 Critical |
| Type | Feature Integrity / Error Handling |
| Evidence | Console/network shows `https://www.treido.eu/api/assistant/chat` returns 404; user sees no error; send button can remain disabled/stuck |

**Expected**
- If AI mode is visible in production, it must work; if it fails, the UI must show a localized error and recover.

**Actual**
- Endpoint returns 404; UI accepts user input but silently fails; users can get stuck.

**Impact**
- Looks like a scam “fake AI”; destroys trust and wastes user time.

**Tasks (ship-blocking)**
- [ ] Either (A) ship the backend endpoint and wire it correctly, or (B) hide/disable AI mode in production behind a feature flag.
- [ ] Add user-facing, localized error state (toast/callout) for failed AI requests (network/4xx/5xx).
- [ ] Ensure the send button always re-enables after an error; provide “Retry”.

**Acceptance criteria**
- No 404 requests to `/api/assistant/chat` from production UI.
- On failure, user sees a localized error and can retry; input/send is not stuck disabled.

---

### ISSUE-004: Mobile bottom-nav “Профил” can land on an English 404 (client navigation bug)

| Field | Value |
|-------|-------|
| Viewport | Mobile |
| Routes | Repro seen from `/bg/search?q=iphone` → bottom nav `Профил` |
| Severity | 🔴 Critical |
| Type | Routing / Client navigation |
| Evidence | Navigates to `/bg/auth/login?next=%2Fbg%2Faccount` but renders an English 404 page (direct navigation to same URL works) |

**Expected**
- Bottom nav Profile always routes to correct auth/account screen; never a 404; locale preserved.

**Actual**
- Client-side navigation can route to a 404 page (and in English), while direct load works.

**Impact**
- Users interpret this as “Profile is broken” and abandon.

**Tasks (ship-blocking)**
- [ ] Fix bottom-nav Profile link to use the canonical routing helper (next-intl link builder).
- [ ] Investigate route groups/intercepts and client navigation handling for `next=` auth URLs.
- [ ] Add an e2e smoke test: open `/bg/search?q=iphone` → click Profile → assert login page renders (no 404).

**Acceptance criteria**
- Repro route no longer produces 404 via client navigation.
- Profile nav works from all main routes (home, search, product, cart).

---

## High

### ISSUE-005: Locale-less internal links (pagination + similar items + category links)

| Field | Value |
|-------|-------|
| Viewport | Desktop + Mobile |
| Routes | `/bg/search` pagination; product detail “Similar items”; some category links |
| Severity | 🟠 High |
| Type | i18n / Navigation / SEO |
| Evidence | Pagination hrefs like `/search?page=2`; product links like `/tech_haven/...` (missing `/bg`) |

**Expected**
- All internal links include locale prefix (`/bg/...`) and do not rely on redirects.

**Actual**
- Multiple links omit locale and rely on redirects / ambiguous locale selection.

**Impact**
- Locale leakage (BG → EN), extra redirects (slower), broken deep links, SEO issues.

**Tasks**
- [ ] Add a single “buildHref” helper for internal links that always includes locale.
- [ ] Fix search pagination link generation (ensure `/[locale]/search?...`).
- [ ] Fix product “Similar items” and category breadcrumb links (ensure `/[locale]/:store/:slug` and `/[locale]/categories/...`).
- [ ] Add an automated check (unit/e2e) to fail if pagination renders locale-less hrefs on localized routes.

**Acceptance criteria**
- On `/bg/*`, all internal links start with `/bg/` (except truly external links).
- No redirect hop occurs when using pagination and similar-item links.

---

### ISSUE-006: Checkout gating is late + English `alert`; `/checkout` state inconsistencies

| Field | Value |
|-------|-------|
| Viewport | Desktop + Mobile |
| Routes | `/bg/checkout` |
| Severity | 🟠 High |
| Type | Checkout UX / Auth |
| Evidence | After filling address, clicking continue triggers browser `alert(\"Please sign in to checkout.\")` (English). Direct navigation to `/bg/checkout` can show “cart empty” while `/bg/cart` has items. |

**Expected**
- If login is required: redirect to login immediately (or show inline sign-in UI) before collecting address.
- No browser alerts; copy localized; cart state consistent.

**Actual**
- User fills the form, then gets an English `alert` at the end; direct `/checkout` can show empty cart.

**Impact**
- High drop-off at the most valuable step; feels broken/unprofessional.

**Tasks**
- [ ] Decide: guest checkout allowed or not (document + implement).
- [ ] If auth required: gate at route entry with redirect to `/[locale]/auth/login?next=/checkout` (or `/cart`) and localized UI.
- [ ] Replace browser `alert` with an inline callout/toast (localized).
- [ ] Unify cart source-of-truth between `/cart` and `/checkout` (guest cart vs account cart).

**Acceptance criteria**
- `/bg/checkout` never shows “cart empty” if `/bg/cart` has items in the same session.
- No English browser alerts in BG locale.
- User understands auth requirement before entering shipping details.

---

### ISSUE-007: Desktop home category navigation doesn’t deep-link; “Виж всички” appears non-functional

| Field | Value |
|-------|-------|
| Viewport | Desktop |
| Routes | `/bg` (home) |
| Severity | 🟠 High |
| Type | Navigation / Information Architecture |
| Evidence | Clicking category buttons changes content but URL stays `/bg`; “Виж всички” button doesn’t navigate to a category page |

**Expected**
- Category selection should update the URL (route or query) so it’s shareable, bookmarkable, and back-button friendly.
- “Виж всички” should navigate to the corresponding category route.

**Actual**
- URL stays on home; “Виж всички” does not appear to navigate.

**Impact**
- Navigation feels “fake”; users can’t share category pages; analytics/SEO loses signal.

**Tasks**
- [ ] Make category selection navigate to `/[locale]/categories/<slug>` (recommended) or update URL query state + handle back button.
- [ ] Ensure “Виж всички” is an actual link with correct href (locale aware).
- [ ] Add a quick e2e test: click category → URL changes and content matches.

**Acceptance criteria**
- From home, category selection changes the URL and is back-button friendly.
- “Виж всички” navigates to a real category page.

---

## Medium

### ISSUE-008: Product UI shows broken counts (`\"0\"`, `{count}`) and inconsistent metadata

| Field | Value |
|-------|-------|
| Viewport | Desktop + Mobile |
| Routes | Product detail + product quick view |
| Severity | 🟡 Medium |
| Type | Copy / Formatting |
| Evidence | Product page shows `\"0\"` with quotes near view count; quick view shows `{count}` placeholder in review text |

**Tasks**
- [ ] Fix count rendering (remove quoted strings, ensure numbers are actual numbers).
- [ ] Use next-intl ICU formatting for pluralization/interpolation (BG + EN).

**Acceptance criteria**
- No product UI shows literal quotes around numbers or `{count}` placeholders.

---

### ISSUE-009: Dialog accessibility warnings (Radix DialogTitle) + inconsistent close labels

| Field | Value |
|-------|-------|
| Viewport | Desktop + Mobile |
| Routes | Product quick view dialogs / drawers |
| Severity | 🟡 Medium |
| Type | Accessibility |
| Evidence | Console warning: `DialogContent requires a DialogTitle`; close button sometimes labeled “Close” (English) |

**Tasks**
- [ ] Ensure every dialog has a proper `DialogTitle` (or visually hidden title) and correct aria labels.
- [ ] Localize close labels via next-intl.

**Acceptance criteria**
- No dialog-related a11y warnings in console during normal flows.
- Close buttons are localized.

---

### ISSUE-010: Mobile safe-area + overlap problems (bottom nav covers footer; awkward word breaks)

| Field | Value |
|-------|-------|
| Viewport | Mobile |
| Routes | Home footer; Categories sheet |
| Severity | 🟡 Medium |
| Type | Layout / Mobile polish |
| Evidence | Bottom nav overlaps footer content; category label breaks mid-word (e.g. “Електромобилн ост”) |

**Tasks**
- [ ] Add bottom padding equal to bottom-nav height + `env(safe-area-inset-bottom)` where needed.
- [ ] Fix Bulgarian word-breaking/wrapping rules for category labels (no mid-word breaks).

**Acceptance criteria**
- Footer content is never hidden behind the bottom nav on iOS.
- Category labels wrap cleanly.

---

### ISSUE-011: Broken images / resource load errors on listings

| Field | Value |
|-------|-------|
| Viewport | Desktop (also possible mobile) |
| Routes | Home/category/search grids |
| Severity | 🟡 Medium |
| Type | Reliability |
| Evidence | Console: “Failed to load resource” for some image URLs |

**Tasks**
- [ ] Validate image URLs at ingestion; reject invalid URLs.
- [ ] Provide a safe placeholder image for missing/broken sources.
- [ ] Ensure image optimization/loader config matches production domains.

**Acceptance criteria**
- No broken image resource errors during normal browsing.

---

## Low

### ISSUE-012: Metadata polish — duplicate titles (“… | Treido | Treido”) + missing titles (Sell)

| Field | Value |
|-------|-------|
| Viewport | Desktop + Mobile |
| Routes | `/bg/customer-service`, `/bg/terms`, `/bg/privacy`, `/bg/sell` |
| Severity | 🟢 Low |
| Type | SEO / Polish |
| Evidence | Page titles contain duplicate “Treido”; Sell title is just “Treido” |

**Tasks**
- [ ] Fix metadata composition so title is exactly `"<page> | Treido"` (once).
- [ ] Add route-specific metadata for Sell and other pages.

**Acceptance criteria**
- Titles are consistent and non-duplicated across main marketing/help pages.

---

## iOS-style polish backlog (after blockers)

> These are not “bugs” but required to hit the “iOS native app” feel on mobile.

- [ ] Define a mobile UI spec for: top bar, bottom tabs, sheet/drawer sizes, list rows, card style, spacing scale.
- [ ] Reduce visual noise on mobile (fewer icons per row; clearer primary actions; consistent “one primary CTA” rule).
- [ ] Make sheets feel native: consistent corner radius, drag handle, snap points, background dimming, safe-area padding.
- [ ] Normalize typography: fewer font sizes; stronger hierarchy; larger tap targets (44px+).
- [ ] Add consistent feedback: toasts for add-to-cart, loading states, empty states (all localized).

