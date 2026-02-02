# Frontend Issues — Playwright Audit

> UI/UX issues discovered during Playwright testing

| Started | 2026-02-02 |
|---------|------------|
| Status | 🔄 Collecting |

---

## Issue Count by Severity

| Severity | Count |
|----------|-------|
| 🔴 Critical | 0 |
| 🟠 High | 1 |
| 🟡 Medium | 0 |
| 🟢 Low | 2 |

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

## Issues by Category

### Layout Issues

*None found*

### Responsive Issues

*None found - tested viewports responsive*

### Routing Issues

- **ISSUE-002**: Public routes incorrectly require onboarding

### Accessibility Issues

*None found - skip links present, form labels correct*

### UX Issues

- **ISSUE-001**: Page title missing on forgot password
- **ISSUE-003**: Page title missing on sell page

---

## Resolution Tracking

| Issue | Status | Fixed In | Assigned |
|-------|--------|----------|----------|
| ISSUE-001 | 🔴 Open | — | — |
| ISSUE-002 | 🔴 Open | — | — |
| ISSUE-003 | 🔴 Open | — | — |

---

## Verified Working

The following features passed testing:

### Auth (Desktop + Mobile)
- ✅ Signup form with all fields, validation, links
- ✅ Login form with remember me, forgot password
- ✅ Auth error page with recovery options
- ✅ Password reset request form

### Buying (Desktop + Mobile)
- ✅ Homepage with all sections (promoted, deals, trending, etc.)
- ✅ Product detail page with SEO/structured data
- ✅ Today's Deals page with 48 products
- ✅ Checkout page (secure checkout header)
- ✅ Product cards with all features (images, prices, ratings, wishlist)

### Selling
- ✅ Sell page accessible without auth (allows guest listing start)
- ✅ Create listing wizard Step 1 (title, photos)
- ✅ Photo upload UI (up to 8 images, size limits)

### Navigation
- ✅ Header with search, wishlist, cart buttons
- ✅ Category tabs (24+ categories)
- ✅ Mobile bottom navigation bar
- ✅ Mobile hamburger menu
- ✅ Footer sections
- ✅ Breadcrumbs

---

*Last updated: 2026-02-02*
