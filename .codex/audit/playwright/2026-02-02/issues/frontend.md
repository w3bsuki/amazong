# Frontend Issues — Playwright Audit

> UI/UX issues discovered during Playwright testing

| Started | 2026-02-02 |
|---------|------------|
| Status | 🔄 Collecting |

---

## Issue Count by Severity

| Severity | Count |
|----------|-------|
| 🔴 Critical | 2 |
| 🟠 High | 3 |
| 🟡 Medium | 1 |
| 🟢 Low | 3 |

---

## Issue Log

### ISSUE-001: Forgot Password Page Title Missing

| Field | Value |
|-------|-------|
| Viewport | Desktop, Mobile |
| Route | `/auth/forgot-password` |
| Severity | 🟢 Low |
| Type | UX/SEO |
| Evidence | Page title shows "Treido" only |
| Expected | "Forgot password \| Treido" |
| Actual | "Treido" |
| Impact | Minor - tab doesn't indicate current page |
| Related | Auth routes |

**Fix:** Update page metadata to include route-specific title.

---

### ISSUE-002: Public Routes Redirect to Onboarding

| Field | Value |
|-------|-------|
| Viewport | Desktop, Mobile |
| Route | `/search`, `/cart`, `/categories` |
| Severity | 🟠 High |
| Type | Routing/UX |
| Evidence | Navigation test - unauthenticated user redirected |
| Expected | Routes should be accessible without login (per docs/05-ROUTES.md) |
| Actual | Redirects to `/onboarding/account-type` |
| Impact | Users cannot search, view cart, or browse categories without completing onboarding first |
| Related | [docs/05-ROUTES.md](../../../../../docs/05-ROUTES.md) marks these as "public" |

**Affected Routes:**
- `/search?q=*` - Should allow guest search
- `/cart` - Should allow guest cart
- `/categories` - Should show all categories

**Fix Suggestions:**
1. Check middleware/proxy.ts for overly aggressive session checks
2. Verify onboarding flow isn't gating public routes
3. May need to distinguish "session exists but incomplete onboarding" from "no session"

---

### ISSUE-003: Sell Page Title Missing

| Field | Value |
|-------|-------|
| Viewport | Desktop, Mobile |
| Route | `/sell` |
| Severity | 🟢 Low |
| Type | UX/SEO |
| Evidence | Page title shows "Treido" only |
| Expected | "Sell \| Treido" or "Create Listing \| Treido" |
| Actual | "Treido" |
| Impact | Minor - tab doesn't indicate current page |
| Related | Seller flows |

**Fix:** Update page metadata to include route-specific title.

---

### ISSUE-004: Post-login Redirect Duplicates Locale (`/en/en/...`)

| Field | Value |
|-------|-------|
| Viewport | Mobile |
| Route | `/auth/login?next=%2F<locale>%2Faccount` |
| Severity | 🔴 Critical |
| Type | Auth/Routing |
| Evidence | After successful sign-in, browser lands on `/<locale>/<locale>/account` and shows a 404 “Profile not found” |
| Expected | Redirect to `/<locale>/account` |
| Actual | Redirect to `/<locale>/<locale>/account` |
| Impact | Users can successfully authenticate but are dropped onto a broken route; first-run “Sign in → Account” appears broken |
| Related | Account layout redirect + auth redirect handling |

**Fix suggestions:**
1. Normalize `next` values to be **locale-less** (e.g. `/account`) before building redirect URLs.
2. Alternatively: when applying `locale`, detect and strip an existing `/<locale>/` prefix from `next` to avoid double-prefixing.

---

### ISSUE-005: Onboarding Deadlock Blocks Cart/Checkout (Onboarding completion fails)

| Field | Value |
|-------|-------|
| Viewport | Mobile |
| Routes | `/cart` → `/onboarding/*` |
| Severity | 🔴 Critical |
| Type | Onboarding/Routing |
| Evidence | Attempting to open `/cart` redirects to `/onboarding/account-type`; onboarding completion screen shows “Something went wrong. Please try again.” |
| Expected | Users can complete onboarding and access cart/checkout |
| Actual | Onboarding cannot complete, so cart/checkout remain inaccessible due to onboarding gate |
| Impact | Blocks buying flow end-to-end (cart → checkout → Stripe) for users who haven’t completed onboarding |
| Related | Backend issue: POST `/<locale>/api/onboarding/complete` returns 500 |

**Fix suggestions:**
1. Fix onboarding completion API (see backend issue log).
2. Remove onboarding gating from `/cart` and `/checkout` (at minimum), or allow an “incomplete onboarding” state to proceed for buying.

---

### ISSUE-006: Sell Wizard — Category Step “Continue” Doesn’t Validate

| Field | Value |
|-------|-------|
| Viewport | Mobile |
| Route | `/sell` |
| Severity | 🟠 High |
| Type | UX/Validation |
| Evidence | Step “Choose a category” shows `Continue` as enabled even when category is “Select…”. Tapping `Continue` does nothing (no error, no progress). |
| Expected | `Continue` disabled until required category chosen OR shows a clear inline error on click |
| Actual | No feedback; user is stuck guessing why nothing happens |
| Impact | Funnel drop-off; feels broken |
| Related | Sell wizard step gating |

**Fix suggestions:**
1. Disable `Continue` until a category path is selected.
2. If you keep it enabled, show an inline error (like the price step) on click.

---

### ISSUE-007: Sell Wizard — Skips Required Product Details, Reaches “Publish” Too Early

| Field | Value |
|-------|-------|
| Viewport | Mobile |
| Route | `/sell` |
| Severity | 🟠 High |
| Type | Data Integrity/UX |
| Evidence | After selecting a deep category, the wizard advanced from “Product details” to “Price & shipping” without completing required specifics (e.g. Model/Storage). After entering a price, the UI surfaced a “Publish Listing” CTA. |
| Expected | Required details enforced before publishing; publish should require a complete listing + final review/confirmation |
| Actual | Users can reach “Publish Listing” with incomplete listing details |
| Impact | Incomplete or invalid listings; higher support load; marketplace quality degradation |
| Related | Sell wizard step state + validation |

**Fix suggestions:**
1. Treat “main specifics” as required for relevant categories; block progression until complete.
2. Add a final “Review & publish” step with validation summary before enabling publish.

---

### ISSUE-008: Chat Order Summary Shows `$` Instead of `€`

| Field | Value |
|-------|-------|
| Viewport | Mobile |
| Route | `/chat/[conversationId]` |
| Severity | 🟡 Medium |
| Type | Data Display |
| Evidence | Order summary card in conversation shows `$20.00` while the rest of the site uses `€` |
| Expected | Currency formatting consistent with listing/order currency (or locale) |
| Actual | `$` displayed |
| Impact | Trust hit; confusion about actual amount charged |
| Related | Order/chat UI formatting |

**Fix:** Use a single currency formatting helper across product/order/chat surfaces.

---

### ISSUE-009: Missing i18n Message Key Logged (Navigation.back)

| Field | Value |
|-------|-------|
| Viewport | Mobile |
| Routes | Onboarding flows |
| Severity | 🟢 Low |
| Type | i18n/Console Errors |
| Evidence | Console logs show `MISSING_MESSAGE: Navigation.back (en)` |
| Expected | No missing translation keys in production |
| Actual | Missing key logged |
| Impact | Minor user impact, but indicates i18n drift and can mask real errors |
| Related | `messages/en.json` + navigation/back UI |

**Fix:** Add the missing key (and bg equivalent) or ensure the UI uses an existing translation key.

---

## Issues by Category

### Layout Issues

*None found*

### Responsive Issues

*None found - tested viewports responsive*

### Routing Issues

- **ISSUE-002**: Public routes incorrectly require onboarding
- **ISSUE-004**: Post-login redirect duplicates locale
- **ISSUE-005**: Onboarding deadlock blocks cart/checkout

### Accessibility Issues

*None found - skip links present, form labels correct*

### UX Issues

- **ISSUE-001**: Page title missing on forgot password
- **ISSUE-003**: Page title missing on sell page
- **ISSUE-006**: Sell category step lacks validation feedback
- **ISSUE-007**: Sell flow reaches publish too early

---

## Resolution Tracking

| Issue | Status | Fixed In | Assigned |
|-------|--------|----------|----------|
| ISSUE-001 | 🔴 Open | — | — |
| ISSUE-002 | 🔴 Open | — | — |
| ISSUE-003 | 🔴 Open | — | — |
| ISSUE-004 | 🔴 Open | — | — |
| ISSUE-005 | 🔴 Open | — | — |
| ISSUE-006 | 🔴 Open | — | — |
| ISSUE-007 | 🔴 Open | — | — |
| ISSUE-008 | 🔴 Open | — | — |
| ISSUE-009 | 🔴 Open | — | — |

---

## Verified Working

The following features passed testing:

### Auth (Desktop + Mobile)
- ✅ Signup form with all fields, validation, links
- ✅ Login form with remember me, forgot password
- ⚠️ Post-login redirect can land on `/[locale]/[locale]/account` (ISSUE-004)
- ✅ Auth error page with recovery options
- ✅ Password reset request form

### Buying (Desktop + Mobile)
- ✅ Homepage with all sections (promoted, deals, trending, etc.)
- ✅ Product detail page with SEO/structured data
- ✅ Today's Deals page with 48 products
- ⚠️ Cart/checkout blocked when onboarding cannot complete (ISSUE-005)
- ✅ Product cards with all features (images, prices, ratings, wishlist)

### Selling
- ✅ Sell page accessible without auth (allows guest listing start)
- ✅ Create listing wizard Step 1 (title, photos)
- ✅ Photo upload UI (up to 8 images, size limits)
- ⚠️ Category step lacks clear validation (ISSUE-006)
- ⚠️ Wizard can reach publish with incomplete details (ISSUE-007)

### Navigation
- ✅ Header with search, wishlist, cart buttons
- ✅ Category tabs (24+ categories)
- ✅ Mobile bottom navigation bar
- ✅ Mobile hamburger menu
- ✅ Footer sections
- ✅ Breadcrumbs

---

*Last updated: 2026-02-02*
