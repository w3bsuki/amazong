# AMZN UX/UI Audit Master Plan

**Created:** December 28, 2025  
**Domain:** Local dev: http://localhost:3000 (production domain TBD)  
**Method:** Systematic Playwright browser automation testing  

---

## Executive Summary

This document outlines a comprehensive UX/UI audit plan for www.treido.eu. The audit will systematically test every main route, UI component, and user interaction using Playwright browser automation.

### Critical Issues Identified in Initial Reconnaissance

1. **🔴 Locale/Region Sync Bug**
   - Location detection works correctly (detects Bulgaria)
   - Selecting "Shop in Bulgaria" sets region BUT does NOT change locale
   - URL remains `/en` instead of switching to `/bg`
   - Region cookie is set, but locale routing is disconnected

2. **🔴 Cookie Consent + Location Modal Race Condition**
   - Cookie consent dialog appears AFTER or simultaneously with location modal
   - These should be sequenced: Cookie consent FIRST → Location prompt SECOND
   - Random timing causes confusing UX

3. **🟡 Bulgarian Translation Issues**
   - When Bulgarian region is selected, some translations appear incorrect
   - Need full translation audit when in `/bg` locale

4. **🟡 Interactive Elements Not Working as Expected**
   - Product card wishlist/cart buttons may navigate instead of performing action
   - Need to verify all hover-state buttons work correctly

5. **🟠 Console Errors**
   - 404 errors for some resources on search page
   - CSS preload warnings

---

## Phase 0 Results (Validated)

**Environment:** Next.js dev server on `http://localhost:3000` with modals enabled (NOT `NEXT_PUBLIC_E2E=true`).

- **BUG-002 fixed:** Cookie consent is sequenced first; geo prompt no longer overlaps it.
- **BUG-001 fixed:** Clicking **"Yes, show Bulgaria products"** navigates to **`/bg`** and sets `NEXT_LOCALE=bg` alongside `user-zone=BG`, `user-country=BG`.
- **Note (pre-flight requirement):** If the dev server is started with `NEXT_PUBLIC_E2E=true`, both GeoWelcome and CookieConsent intentionally return `null`, so Phase 0 cannot be validated.

---

## Audit Tasks

Use the checklist in [docs/production/UX_AUDIT_TASKS.md](docs/production/UX_AUDIT_TASKS.md). This file stays intentionally high-level to avoid duplicated, drifting lists.

### Phase Summary

| # | Phase | Primary routes |
|---|-------|----------------|
| 0 | Pre-flight (cookies/locale) | Global |
| 1 | Landing page | `/[locale]` |
| 2 | Search & categories | `/[locale]/search`, `/[locale]/categories/*` |
| 3 | Product detail | `/[locale]/[username]/[slug]`, `/[locale]/product/[id]` |
| 4 | Auth | `/[locale]/auth/*` |
| 5 | Account | `/[locale]/account/*` |
| 6 | Seller | `/[locale]/sell/*`, `/[locale]/[username]` |
| 7 | Cart & checkout | `/[locale]/cart`, `/[locale]/checkout/*` |
| 8 | Support & static | `/[locale]/about`, `/[locale]/terms`, etc. |
| 9 | Wishlist & following | Various |
| 10 | Internationalization | `/en`, `/bg` |
| 11 | Mobile responsiveness | All |
| 12 | Error states | Not-found, error boundaries |

## Route Reference Table

| Route Pattern | Page | Status |
|--------------|------|--------|
| `/[locale]` | Home | ⬜ |
| `/[locale]/search` | Search Results | ⬜ |
| `/[locale]/categories/[...slug]` | Category Page | ⬜ |
| `/[locale]/todays-deals` | Deals | ⬜ |
| `/[locale]/product/[id]` | Product (by ID) | ⬜ |
| `/[locale]/[username]/[slug]` | Product (by store) | ⬜ |
| `/[locale]/[username]` | Seller Store | ⬜ |
| `/[locale]/sellers` | All Sellers | ⬜ |
| `/[locale]/auth/login` | Login | ⬜ |
| `/[locale]/auth/sign-up` | Register | ⬜ |
| `/[locale]/auth/forgot-password` | Forgot Password | ⬜ |
| `/[locale]/auth/reset-password` | Reset Password | ⬜ |
| `/[locale]/auth/sign-up-success` | Sign Up Success | ⬜ |
| `/[locale]/auth/welcome` | Welcome/Onboarding | ⬜ |
| `/[locale]/account` | Account Dashboard | ⬜ |
| `/[locale]/account/profile` | Profile | ⬜ |
| `/[locale]/account/orders` | Orders | ⬜ |
| `/[locale]/account/sales` | Sales | ⬜ |
| `/[locale]/account/wishlist` | Wishlist | ⬜ |
| `/[locale]/account/following` | Following | ⬜ |
| `/[locale]/account/addresses` | Addresses | ⬜ |
| `/[locale]/account/payments` | Payments | ⬜ |
| `/[locale]/account/security` | Security | ⬜ |
| `/[locale]/account/billing` | Billing | ⬜ |
| `/[locale]/account/plans` | Plans | ⬜ |
| `/[locale]/account/selling` | Selling Settings | ⬜ |
| `/[locale]/sell` | Sell Landing | ⬜ |
| `/[locale]/sell/orders` | Seller Orders | ⬜ |
| `/[locale]/cart` | Cart | ⬜ |
| `/[locale]/checkout` | Checkout | ⬜ |
| `/[locale]/wishlist` | Public Wishlist | ⬜ |
| `/[locale]/gift-cards` | Gift Cards | ⬜ |
| `/[locale]/registry` | Registry | ⬜ |
| `/[locale]/members` | Members | ⬜ |
| `/[locale]/about` | About | ⬜ |
| `/[locale]/terms` | Terms | ⬜ |
| `/[locale]/privacy` | Privacy | ⬜ |
| `/[locale]/cookies` | Cookies | ⬜ |
| `/[locale]/customer-service` | Customer Service | ⬜ |
| `/[locale]/contact` | Contact | ⬜ |

---

## Bug Tracking

### Critical Bugs (P0)
| ID | Description | Status | Phase |
|----|-------------|--------|-------|
| BUG-001 | Region selection doesn't change locale | ✅ Fixed | P0 |
| BUG-002 | Cookie consent + Location modal race condition | ✅ Fixed | P0 |

### High Priority Bugs (P1)
| ID | Description | Status | Phase |
|----|-------------|--------|-------|
| BUG-003 | Product card overlay link not clickable (z-index; image intercepts clicks) | ✅ Fixed | P1 |
| BUG-004 | Bulgarian translations incorrect/incomplete | 🟡 Open | P10 |

### Medium Priority Bugs (P2)
| ID | Description | Status | Phase |
|----|-------------|--------|-------|
| BUG-005 | 404 console errors on search page | 🟠 Open | P2 |
| BUG-006 | CSS preload warning | 🟠 Open | General |

---

## How to Use This Plan

### Starting an Audit Session

1. Open Playwright browser: Navigate to https://www.treido.eu
2. Clear cookies/storage for fresh state
3. Start with Phase 0 (Pre-flight checks)
4. Work through phases sequentially
5. Mark items as:
   - ✅ Passed
   - ❌ Failed (log bug)
   - ⏭️ Skipped (with reason)
6. Document all bugs with screenshots/console logs

### Marking Progress

Replace `[ ]` with:
- `[x]` - Completed/Passed
- `[!]` - Failed (see bug tracker)
- `[-]` - Skipped
- `[?]` - Needs investigation

---

## Next Steps

1. **Start Phase 0** - Fix critical cookie/locale bugs first
2. **Phase 1-3** - Core user flows (browse, view, interact)
3. **Phase 4-5** - Authentication & account management
4. **Phase 6-7** - Seller & checkout flows
5. **Phase 8-12** - Polish, i18n, mobile, edge cases

---

*Last Updated: December 28, 2025*
