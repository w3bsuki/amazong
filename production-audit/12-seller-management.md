# Phase 12: Seller Management

| Field | Value |
|-------|-------|
| **Scope** | Seller-specific routes — selling dashboard, payout settings, listing management, sales overview, seller orders |
| **Routes** | `/account/selling`, `/account/selling/edit`, `/account/selling/:id/edit`, `/account/sales`, `/sell/orders`, `/seller/dashboard` (redirect), `/seller/settings/payouts` |
| **Priority** | P1 |
| **Dependencies** | Phase 1 (Shell), Phase 3 (Auth), Phase 8 (Sell Form) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | Yes — seller role required |
| **Status** | 📝 Planned |

---

## Prerequisites

| Requirement | Detail |
|-------------|--------|
| Auth session | Authenticated user with seller role (has at least one listing or completed seller onboarding) |
| Existing listings | At least 2 published listings and 1 draft listing in seller's inventory for list/edit scenarios |
| Stripe Connect | Seller account with Stripe Connect onboarding completed (for payout scenarios) |
| Completed sale | At least 1 order in seller's sales history (for sales/orders scenarios) |
| Phase 1 (Shell) | Mobile shell, bottom nav, header verified passing |
| Phase 3 (Auth) | Auth flow verified; seller session fixture available |
| Phase 8 (Sell Form) | Sell form submission verified; listing creation works end-to-end |

---

## Routes Under Test

| # | Route | Layout Group | Auth | Purpose |
|---|-------|--------------|------|---------|
| 1 | `/account/selling` | `(account)` | Seller | Selling dashboard — stats + product list |
| 2 | `/account/selling/edit` | `(account)` | Seller | Create new listing form |
| 3 | `/account/selling/:id/edit` | `(account)` | Seller | Edit existing listing |
| 4 | `/account/sales` | `(account)` | Seller | Sales overview |
| 5 | `/sell/orders` | `(sell)` | Seller | Seller order management |
| 6 | `/seller/dashboard` | `(main)` | Seller | Legacy redirect → `/dashboard` |
| 7 | `/seller/settings/payouts` | `(main)` | Seller | Stripe Connect payout setup |

---

## Scenarios

### S12.1 — Selling Dashboard: Revolut-Style Mobile Header

**Route:** `/account/selling`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/account/selling` as authenticated seller | — |
| 2 | Wait for page load; confirm loading skeleton dismissed | `loading.tsx` skeleton no longer visible |
| 3 | Verify mobile header is visible (sm:hidden variant) | Header container with store info — look for seller store name text |
| 4 | Verify circular "Add" button is present in mobile header | Button element with add/plus icon within the mobile header |
| 5 | Tap the "Add" button | Circular add button |
| 6 | Confirm navigation to listing creation flow | URL contains `/selling/edit` or sell form route |

**Expected:**
- Mobile header renders in Revolut-style layout with store information and seller avatar/name
- Circular "Add" button is prominently visible and tappable
- Desktop header (`hidden sm:flex`) is not visible at mobile viewport
- Tapping "Add" navigates to listing creation

**Screenshot checkpoint:** `s12-1-selling-mobile-header.png` — full mobile header with store info and add button visible

---

### S12.2 — Selling Dashboard: Stats Pills

**Route:** `/account/selling`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/account/selling` as authenticated seller with listings | — |
| 2 | Wait for stats data to load | Stats pills container visible |
| 3 | Verify stats pills are visible on mobile | Container with `flex items-center gap-3 text-sm` classes |
| 4 | Check for active listings count pill | Pill badge showing active count |
| 5 | Check for draft listings count pill | Pill badge showing draft count |
| 6 | Check for sold items count pill | Pill badge showing sold count |
| 7 | Verify desktop stats grid is hidden | Element with `hidden sm:grid` not visible |

**Expected:**
- Stats render as rounded pill badges in a horizontal flex row
- Each pill shows a count and label (active, draft, sold)
- Pill counts match actual listing data for the seller
- Desktop grid layout (`hidden sm:grid`) is not visible at mobile viewport
- No overflow or truncation on smallest test device (390px)

**Screenshot checkpoint:** `s12-2-selling-stats-pills.png` — stats pills row fully visible with counts

---

### S12.3 — Selling Dashboard: Mobile Product List

**Route:** `/account/selling`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/account/selling` as seller with ≥2 published + 1 draft listing | — |
| 2 | Wait for product list to render | List items visible below stats |
| 3 | Verify mobile product list variant is displayed | Container with `sm:hidden mt-4` — no Card wrapper |
| 4 | Verify desktop product list is hidden | Container with `hidden sm:block` not visible |
| 5 | Count visible listing items | At least 3 items rendered |
| 6 | Verify each item shows title, price, and status indicator | Text content within each list item |
| 7 | Scroll product list to verify all items accessible | Scroll action on list container |
| 8 | Tap on a listing item | First listing item |
| 9 | Confirm navigation to edit page for that listing | URL matches `/account/selling/:id/edit` |

**Expected:**
- Mobile list variant renders without Card wrapper (flat list style)
- Desktop Card-wrapped list (`hidden sm:block`) is not visible
- Each listing shows product title, price, and status (active/draft/sold)
- List is scrollable; all listings are accessible
- Tapping a listing navigates to its edit page
- No layout overflow on 390px viewport

**Screenshot checkpoint:** `s12-3-selling-product-list-mobile.png` — product list with at least 3 items visible

---

### S12.4 — Create New Listing

**Route:** `/account/selling/edit`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/account/selling/edit` as authenticated seller | — |
| 2 | Wait for edit form to render | `edit-product-client.tsx` form visible |
| 3 | Verify form is in "create" mode (no pre-filled data) | Form fields empty; heading indicates new listing |
| 4 | Verify all required form fields are visible on mobile | Title, description, price, category, condition, images fields |
| 5 | Scroll through entire form | Scroll to bottom |
| 6 | Verify submit/publish button is accessible at bottom | Submit button visible after scroll |
| 7 | Verify form does not overflow viewport horizontally | No horizontal scroll on 393px viewport |

**Expected:**
- Form renders in create mode with empty fields
- All required fields are present and labeled
- Form is fully scrollable on mobile without horizontal overflow
- Submit/publish button is reachable at bottom of form
- Cross-references with Phase 8 (Sell Form) — same form component

**Screenshot checkpoint:** `s12-4-create-listing-form.png` — top of create listing form on mobile

---

### S12.5 — Edit Existing Listing

**Route:** `/account/selling/:id/edit`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/account/selling` as seller with existing listings | — |
| 2 | Tap on a published listing from the product list | First published listing item |
| 3 | Wait for edit page to load | URL matches `/account/selling/:id/edit` |
| 4 | Verify form is pre-filled with listing data | Title field contains existing listing title |
| 5 | Verify price field shows current price | Price input has existing value |
| 6 | Verify images section shows uploaded images | Image preview(s) visible |
| 7 | Modify the listing title | Clear and type new title into title field |
| 8 | Scroll to submit button and tap save | Save/update button |
| 9 | Verify success feedback (toast or redirect) | Success indicator visible or redirected to selling page |

**Expected:**
- Edit form loads with all existing listing data pre-populated
- Title, price, description, category, condition, and images all pre-filled
- Modifications can be made and saved successfully
- Success feedback appears after save (toast notification or redirect to dashboard)
- Form maintains mobile layout without overflow

**Screenshot checkpoint:** `s12-5-edit-listing-prefilled.png` — edit form with pre-filled data visible

---

### S12.6 — Sales Overview

**Route:** `/account/sales`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/account/sales` as seller with at least 1 completed sale | — |
| 2 | Wait for sales data to load | Sales list or summary visible |
| 3 | Verify sales summary/stats are displayed | Revenue or sales count indicator |
| 4 | Verify individual sale entries are listed | Sale line items with buyer info, amount, date |
| 5 | Scroll through sales list | Scroll action |
| 6 | Tap on a sale entry | First sale item |
| 7 | Verify sale detail or order detail is accessible | Detail view or modal opens |

**Expected:**
- Sales overview page loads with sales data for the seller
- Sales summary (total revenue, count) is visible
- Individual sales are listed with relevant details (item, buyer, amount, date, status)
- Sales list is scrollable on mobile
- Tapping a sale navigates to detail view
- Page handles zero-sales state gracefully (empty state message if no sales)

**Screenshot checkpoint:** `s12-6-sales-overview.png` — sales list with at least one completed sale visible

---

### S12.7 — Seller Order Management

**Route:** `/sell/orders`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/sell/orders` as seller with active orders | — |
| 2 | Wait for loading skeleton to dismiss | `loading.tsx` skeleton replaced by content |
| 3 | Verify order list renders via `client.tsx` | Order items visible in list |
| 4 | Verify each order shows status badge | Status indicator per order (pending, shipped, delivered, etc.) |
| 5 | Locate order with actionable status (e.g., pending shipment) | Order item with action button |
| 6 | Verify status action buttons are visible | `order-status-actions.tsx` rendered actions |
| 7 | Verify "Rate Buyer" action is visible on completed orders | `seller-rate-buyer-actions.tsx` rendered if applicable |
| 8 | Tap a status action button | First available action button |
| 9 | Verify action confirmation or status update UI appears | Modal, toast, or inline status change |

**Expected:**
- Order list loads with seller's orders from `client.tsx`
- Each order displays status badge, item summary, buyer info, and order date
- Actionable orders show status action buttons from `order-status-actions.tsx`
- Completed orders show "Rate Buyer" actions from `seller-rate-buyer-actions.tsx`
- Actions trigger appropriate confirmation UI
- No horizontal overflow on mobile viewport

**Screenshot checkpoint:** `s12-7-seller-orders.png` — order list with status badges and action buttons visible

---

### S12.8 — Legacy Seller Dashboard Redirect

**Route:** `/seller/dashboard`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate directly to `/seller/dashboard` as authenticated seller | — |
| 2 | Wait for redirect to complete | URL changes from `/seller/dashboard` |
| 3 | Verify final URL is `/dashboard` (or locale-prefixed equivalent) | `page.url()` assertion |
| 4 | Verify dashboard page content loads | Dashboard content visible |
| 5 | Verify no error page or 404 was shown during redirect | No error UI flash |

**Expected:**
- `/seller/dashboard` immediately redirects to `/dashboard`
- Redirect is seamless — no error flash, no loading skeleton from `loading.tsx` visible for extended time
- Final destination loads correctly with dashboard content
- Redirect preserves locale prefix if present (e.g., `/en/seller/dashboard` → `/en/dashboard`)

**Screenshot checkpoint:** `s12-8-seller-dashboard-redirect.png` — final dashboard page after redirect

---

### S12.9 — Stripe Connect Payout Setup

**Route:** `/seller/settings/payouts`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/seller/settings/payouts` as authenticated seller | — |
| 2 | Wait for payout setup component to render | `seller-payout-setup.tsx` content visible |
| 3 | Verify Stripe Connect status indicator is displayed | Connected/not-connected status |
| 4 | If not connected: verify onboarding CTA button is present | "Connect Stripe" or "Set up payouts" button |
| 5 | If connected: verify payout details are shown | Bank/account info summary, payout schedule |
| 6 | Verify page layout fits mobile viewport | No horizontal overflow at 393px |
| 7 | Verify sensitive info is partially masked | Account numbers masked (e.g., ••••1234) |

**Expected:**
- Payout setup page renders `seller-payout-setup.tsx` component
- Stripe Connect status is clearly indicated (connected vs. not connected)
- Not-connected state shows prominent onboarding CTA
- Connected state shows payout details with masked sensitive info
- Page is fully functional on mobile without overflow
- Stripe Connect onboarding button (if shown) is tappable and initiates Stripe OAuth flow

**Screenshot checkpoint:** `s12-9-payout-setup.png` — payout settings page showing Stripe Connect status

---

### S12.10 — Non-Seller Access Guard

**Route:** `/account/selling`, `/sell/orders`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Sign in as a buyer-only user (no seller role) | Auth session without seller permissions |
| 2 | Navigate to `/account/selling` | — |
| 3 | Verify access is denied — redirect to appropriate page or error message | Redirect URL or error banner |
| 4 | Navigate to `/sell/orders` | — |
| 5 | Verify access is denied — redirect or error | Redirect URL or error banner |
| 6 | Navigate to `/seller/settings/payouts` | — |
| 7 | Verify access is denied — redirect or error | Redirect URL or error banner |
| 8 | Verify no seller data is leaked in any denied response | No product list, no order data visible |

**Expected:**
- Non-seller users are redirected away from seller-only routes (to account page, home, or upgrade prompt)
- No seller data (listings, orders, payout info) is rendered or leaked
- Redirect is clean — no flash of seller content before redirect
- All three seller route groups enforce the guard consistently
- Error/redirect message is user-friendly (not a raw 403)

**Screenshot checkpoint:** `s12-10-non-seller-guard.png` — redirect or error state for non-seller user

---

## Source Files

| File | Purpose |
|------|---------|
| `app/[locale]/(account)/account/selling/page.tsx` | Selling dashboard page — stats + product list |
| `app/[locale]/(account)/account/selling/loading.tsx` | Selling page loading skeleton |
| `app/[locale]/(account)/account/selling/selling-products-list.tsx` | Product list component for seller's listings |
| `app/[locale]/(account)/account/selling/edit/page.tsx` | Create listing page |
| `app/[locale]/(account)/account/selling/edit/edit-product-client.tsx` | Client-side listing form component |
| `app/[locale]/(account)/account/selling/[id]/edit/page.tsx` | Edit existing listing page |
| `app/[locale]/(account)/account/sales/page.tsx` | Sales overview page |
| `app/[locale]/(sell)/sell/orders/page.tsx` | Seller orders page |
| `app/[locale]/(sell)/sell/orders/loading.tsx` | Seller orders loading skeleton |
| `app/[locale]/(sell)/sell/orders/client.tsx` | Seller orders client component |
| `app/[locale]/(sell)/sell/orders/_components/order-status-actions.tsx` | Order status action buttons |
| `app/[locale]/(sell)/sell/orders/_components/seller-rate-buyer-actions.tsx` | Rate buyer action component |
| `app/[locale]/(main)/seller/dashboard/page.tsx` | Legacy dashboard redirect |
| `app/[locale]/(main)/seller/dashboard/loading.tsx` | Legacy dashboard loading skeleton |
| `app/[locale]/(main)/seller/dashboard/error.tsx` | Legacy dashboard error boundary |
| `app/[locale]/(main)/seller/dashboard/_components/seller-dashboard-loading-skeleton.tsx` | Dashboard skeleton component |
| `app/[locale]/(main)/seller/settings/payouts/page.tsx` | Payout settings page |
| `app/[locale]/(main)/seller/settings/payouts/_components/seller-payout-setup.tsx` | Stripe Connect setup component |

---

## Known Bugs

None identified for seller management routes.

---

## Findings

| ID | Scenario | Status | Notes |
|----|----------|--------|-------|
| S12.1 | Selling dashboard mobile header | ⬜ | — |
| S12.2 | Stats pills | ⬜ | — |
| S12.3 | Mobile product list | ⬜ | — |
| S12.4 | Create new listing | ⬜ | — |
| S12.5 | Edit existing listing | ⬜ | — |
| S12.6 | Sales overview | ⬜ | — |
| S12.7 | Seller order management | ⬜ | — |
| S12.8 | Legacy dashboard redirect | ⬜ | — |
| S12.9 | Stripe Connect payout setup | ⬜ | — |
| S12.10 | Non-seller access guard | ⬜ | — |

---

## Summary

Phase 12 covers the complete seller management surface across 7 routes spanning 3 layout groups (`(account)`, `(sell)`, `(main)`). The selling dashboard uses a Revolut-style mobile header with responsive breakpoints (`sm:hidden` / `hidden sm:flex`) requiring mobile-specific validation. Key risk areas include Stripe Connect integration on the payout setup page, order status action flows, and the legacy `/seller/dashboard` redirect. No `data-testid` attributes exist in seller components — all selectors must rely on structural queries, text content, or ARIA roles. The non-seller access guard scenario (S12.10) validates authorization enforcement across all seller route groups.
