# Phase 15: Plans & Pricing

> Validate the full mobile Plans & Pricing experience — public plans page with 5 sections (pricing cards, features grid, comparison table, guarantee banner, FAQ accordion), account plans view, upgrade flow with intercepting modal, billing/account-type toggles, and responsive grid breakpoints from 1-column mobile to 5-column XL.

| Field | Value |
|-------|-------|
| **Scope** | Public plans page (5 sections), account plans view, upgrade flow with modal |
| **Routes** | `/plans`, `/account/plans`, `/account/plans/upgrade` |
| **Priority** | P2 |
| **Dependencies** | Phase 1 (Shell), Phase 10 (Account) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No for `/plans`; Yes for `/account/plans` |
| **Status** | 📝 Planned |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — header, bottom nav, sticky behavior verified | Phase 1 audit green |
| 2 | Phase 10 (Account) passes — account layout and navigation working | Phase 10 audit green |
| 3 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 4 | Locale set to `en` | URL prefix `/en/` |
| 5 | Plans data seeded — at least 3 plan tiers available from server fetch | Plans returned by `page.tsx` server component |
| 6 | Authenticated user session available for account plans scenarios | Login via auth flow or restore session |
| 7 | Overlays dismissed (cookie consent + geo modal) | `localStorage.setItem('cookie-consent', 'accepted'); localStorage.setItem('geo-welcome-dismissed', 'true')` |

---

## Routes Under Test

| # | Route | Layout Group | Auth | Purpose |
|---|-------|--------------|------|---------|
| 1 | `/plans` | `(plans)` | No | Public plans page — 5 sections: pricing, features, comparison, guarantee, FAQ |
| 2 | `/account/plans` | `(account)` | Yes | Account plans view — current plan, available upgrades |
| 3 | `/account/plans/upgrade` | `(account)` | Yes | Upgrade flow — plan selection and checkout |

---

## Scenarios

### S15.1 — Plans Page: All 5 Sections Render on Mobile

**Route:** `/plans`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/plans` (unauthenticated) | — |
| 2 | Wait for loading skeleton to dismiss | `loading.tsx` skeleton no longer visible |
| 3 | Verify MinimalHeader is sticky at top | Sticky header container with section navigation links |
| 4 | Verify Section 1 (Pricing) is visible | Plan cards grid visible — `PlansPageClient` rendered |
| 5 | Verify account type toggle is visible | Toggle with `rounded-full border bg-surface-subtle p-1` classes |
| 6 | Verify billing toggle is visible | Container with `flex items-center gap-3` — monthly/annual switch |
| 7 | Scroll to Section 2 (Features) | Scroll until features grid visible |
| 8 | Assert features grid renders | `grid gap-px rounded-md border bg-border sm:grid-cols-3` — single column on mobile |
| 9 | Scroll to Section 3 (Comparison) | Scroll until comparison table visible |
| 10 | Assert comparison table renders | Full plan comparison table with horizontal scroll |
| 11 | Scroll to Section 4 (Guarantee) | Scroll until guarantee banner visible |
| 12 | Assert guarantee card/banner renders | Banner card with guarantee messaging |
| 13 | Scroll to Section 5 (FAQ) | Scroll until FAQ accordion visible |
| 14 | Assert FAQ accordion renders with collapsed items | Accordion items with expand/collapse triggers |
| 15 | 📸 Screenshot | `phase-15-S15.1-plans-all-sections.png` — top of page with pricing section |

**Expected:**
- All 5 sections render sequentially on mobile: Pricing → Features → Comparison → Guarantee → FAQ.
- MinimalHeader sticks to top and provides section navigation anchors.
- No horizontal overflow on 390px viewport at any scroll position.
- Loading skeleton from `loading.tsx` fully dismissed before content appears.
- Account type toggle and billing toggle are both visible above the pricing cards.

---

### S15.2 — Pricing Cards: Single-Column Mobile Grid

**Route:** `/plans`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/plans` | — |
| 2 | Wait for pricing cards to render | `PricingCard` compound components visible |
| 3 | Assert pricing grid renders in single column on mobile | Grid container with `grid gap-4` — verify only 1 card per row at 393px |
| 4 | Verify first card renders compound parts: Header, Plan, Price, Body, List | Card child elements: plan name, price amount, feature list |
| 5 | Verify each card has a CTA button | Button within each `PricingCard` — "Get Started", "Upgrade", or similar |
| 6 | Scroll through all plan cards vertically | Scroll through stacked cards |
| 7 | Count total plan cards | At least 3 cards rendered |
| 8 | Verify card content is not truncated | All text, prices, and feature lists fully visible within card bounds |
| 9 | 📸 Screenshot | `phase-15-S15.2-pricing-cards-mobile.png` — first 2 cards stacked vertically |

**Expected:**
- Grid: `grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5` — collapses to 1 column at mobile viewport.
- Each `PricingCard` compound component renders: `Card`, `Header`, `Plan`, `Price`, `Body`, `List`.
- Card CTA buttons are full-width and tappable (minimum 44px touch target).
- Cards stack vertically with consistent `gap-4` spacing.
- No card content overflows horizontally at 390px.

---

### S15.3 — Account Type & Billing Toggles

**Route:** `/plans`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/plans` | — |
| 2 | Wait for toggles to render | Account type toggle and billing toggle visible |
| 3 | Assert account type toggle has 2 segments | Toggle with `rounded-full border bg-surface-subtle p-1` — two clickable segments |
| 4 | Tap inactive account type segment | Second segment of the account type toggle |
| 5 | Verify pricing cards update to reflect new account type | Card plan names and/or prices change |
| 6 | Assert billing toggle renders with label | Container with `flex items-center gap-3` — Monthly/Annual labels |
| 7 | Tap billing toggle to switch from monthly to annual (or vice versa) | Toggle switch element |
| 8 | Verify pricing cards update to reflect new billing period | Price amounts change (annual should show savings) |
| 9 | Verify savings badge or discount indicator appears for annual | Discount percentage or savings text visible on cards |
| 10 | 📸 Screenshot | `phase-15-S15.3-billing-toggle-annual.png` — cards showing annual pricing |

**Expected:**
- Account type toggle: `rounded-full border bg-surface-subtle p-1`, two segments, active segment visually distinguished.
- Billing toggle: `flex items-center gap-3`, switch component between Monthly/Annual labels.
- Toggling either control updates pricing cards without page reload (client-side state in `PlansPageClient`).
- Annual pricing shows discounted amounts with savings indicator.
- Toggle state is visually clear — active state is unambiguous on mobile.
- Both toggles fit within 390px viewport without overflow or wrapping.

---

### S15.4 — Comparison Table: Horizontal Scroll on Mobile

**Route:** `/plans` (Section 3)

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/plans` and scroll to comparison section | Scroll until comparison table visible |
| 2 | Assert comparison table is rendered | Table element with plan columns and feature rows |
| 3 | Verify table overflows horizontally on mobile | Table container has horizontal scroll (width exceeds 393px viewport) |
| 4 | Swipe/scroll table horizontally to reveal hidden plan columns | Horizontal scroll within table container |
| 5 | Verify first column (feature names) remains sticky or visible | Feature labels accessible while scrolling horizontally |
| 6 | Verify checkmarks/crosses render correctly in cells | Icon indicators (check, cross, dash) per feature per plan |
| 7 | Scroll table fully to the rightmost plan column | All columns accessible via horizontal scroll |
| 8 | Verify no vertical layout breakage from horizontal overflow | Page structure intact — no unintended horizontal scroll on the page itself |
| 9 | 📸 Screenshot | `phase-15-S15.4-comparison-table-scroll.png` — table mid-scroll showing feature column and plan columns |

**Expected:**
- Comparison table renders all plans as columns with features as rows.
- Table container enables horizontal scroll on mobile — table is not squished to fit.
- Feature name column ideally stays sticky (position: sticky) during horizontal scroll for readability.
- Check/cross icons are clearly distinguishable at mobile size.
- Horizontal scroll is contained within the table container — does not affect the page-level scroll.
- Table header (plan names) is visible while scrolling vertically through features.

---

### S15.5 — FAQ Accordion: Expand/Collapse Items

**Route:** `/plans` (Section 5)

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Navigate to `/en/plans` and scroll to FAQ section | Scroll until FAQ heading and accordion visible |
| 2 | Assert FAQ heading is visible | Heading element with FAQ-related text |
| 3 | Count accordion items | At least 3 accordion trigger items rendered |
| 4 | Assert all items are initially collapsed | No expanded content panels visible |
| 5 | Tap first accordion trigger | First accordion item trigger button |
| 6 | Assert first item expands showing answer content | Expanded panel with answer text visible |
| 7 | Assert answer text is readable and not truncated | Full answer content within accordion panel |
| 8 | Tap second accordion trigger | Second accordion item trigger button |
| 9 | Verify accordion behavior (single or multi) | If single-expand: first item collapses when second opens; if multi: both remain open |
| 10 | Tap expanded item trigger to collapse | Same trigger button |
| 11 | Assert item collapses | Panel content no longer visible |
| 12 | 📸 Screenshot | `phase-15-S15.5-faq-expanded.png` — FAQ with one item expanded |

**Expected:**
- FAQ renders as Radix/shadcn Accordion component with trigger + content pairs.
- Triggers are tappable with minimum 44px touch target height.
- Expanded answer content is fully readable on mobile without horizontal overflow.
- Accordion animation is smooth (expand/collapse transition).
- Chevron or icon indicator rotates/changes to reflect open/closed state.
- Overall FAQ section fits within mobile viewport width.

---

### S15.6 — Account Plans Page (Auth-Gated)

**Route:** `/account/plans`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Clear session (ensure unauthenticated) | `await context.clearCookies()` |
| 2 | Navigate to `/en/account/plans` | — |
| 3 | Assert redirect to login | `await expect(page).toHaveURL(/\/auth\/login/)` |
| 4 | Authenticate as user with an active plan | Login via auth flow |
| 5 | Navigate to `/en/account/plans` | — |
| 6 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 7 | Assert current plan is displayed | `PlansContent` component renders current plan details |
| 8 | Verify plan name, billing period, and status are visible | Text content showing active plan information |
| 9 | Verify upgrade CTA or available plans are shown | Button or link to upgrade flow |
| 10 | Verify page layout fits mobile viewport | No horizontal overflow at 393px |
| 11 | 📸 Screenshot | `phase-15-S15.6-account-plans.png` — account plans page with current plan visible |

**Expected:**
- Unauthenticated users are redirected to `/en/auth/login` (with optional `?next=` parameter).
- `PlansContent` component renders the user's current plan with name, billing period, and status.
- Available upgrade options or plan comparison is accessible from this page.
- Layout is mobile-optimized within the account layout shell.
- Loading state from `loading.tsx` displays skeleton before content hydrates.

---

### S15.7 — Upgrade Modal (Intercepting Route)

**Route:** `/account/plans/upgrade` (also via `@modal/(.)account/plans/upgrade`)

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Authenticate as user | Login via auth flow |
| 2 | Navigate to `/en/account/plans` | — |
| 3 | Tap upgrade button or link | CTA button linking to upgrade flow |
| 4 | Assert intercepting modal opens (if navigating from account) | Modal dialog or sheet overlay visible — `@modal/(.)account/plans/upgrade` |
| 5 | Verify modal shows plan selection or upgrade content | `UpgradeContent` component rendered within modal |
| 6 | Verify modal is scrollable if content exceeds viewport | Scroll within modal body |
| 7 | Verify close/dismiss button on modal | X button or overlay tap to dismiss |
| 8 | Dismiss modal | Tap close or overlay |
| 9 | Assert return to `/account/plans` without full page reload | URL returns to `/account/plans` |
| 10 | Navigate directly to `/en/account/plans/upgrade` (hard navigation) | `await page.goto('/en/account/plans/upgrade')` |
| 11 | Assert full page renders (not modal) | `UpgradeContent` renders as full page, not in modal overlay |
| 12 | 📸 Screenshot | `phase-15-S15.7-upgrade-modal.png` — upgrade modal open over account plans |

**Expected:**
- Intercepting route pattern: navigating from `/account/plans` opens upgrade in a modal (`@modal/(.)account/plans/upgrade`).
- Direct navigation to `/account/plans/upgrade` renders as full page (standard Next.js intercepting route behavior).
- Modal is appropriately sized for mobile — full-width or near-full-width with rounded top.
- Modal content is scrollable if it exceeds viewport height.
- Dismissing the modal returns to the previous page without full reload (client-side navigation).
- Upgrade content shows plan options with pricing and selection CTA.

---

### S15.8 — Loading Skeleton: Horizontal Card Scroll on Mobile

**Route:** `/plans`

| Step | Action | Selector / Target |
|------|--------|--------------------|
| 1 | Throttle network to slow 3G | Playwright `page.route('**/*', ...)` with delay, or CDP network throttling |
| 2 | Navigate to `/en/plans` | — |
| 3 | Assert loading skeleton renders | `loading.tsx` skeleton visible |
| 4 | Verify skeleton cards in horizontal scroll layout | Cards with `snap-center shrink-0` classes in horizontally scrollable container |
| 5 | Swipe skeleton cards horizontally | Horizontal gesture on skeleton container |
| 6 | Verify snap behavior on skeleton cards | Cards snap to center positions during scroll |
| 7 | Wait for actual content to replace skeleton | `PlansPageClient` renders, skeleton dismissed |
| 8 | Verify transition from skeleton to content is clean | No layout shift or flash between skeleton and real content |
| 9 | 📸 Screenshot | `phase-15-S15.8-loading-skeleton.png` — skeleton cards in horizontal scroll |

**Expected:**
- Loading skeleton renders card placeholders in a horizontal scroll container (mobile behavior).
- Cards use `snap-center shrink-0` for horizontal snap scrolling.
- Skeleton cards match the approximate dimensions of real pricing cards.
- Transition from skeleton to real content is seamless — no jarring layout shift (CLS).
- Skeleton is visible long enough to validate on throttled network.

---

## Source Files

| File | Purpose |
|------|---------|
| `app/[locale]/(plans)/plans/page.tsx` | Plans server component — fetches plan data |
| `app/[locale]/(plans)/plans/loading.tsx` | Plans loading skeleton with horizontal scroll cards |
| `app/[locale]/(plans)/_components/plans-page-client.tsx` | `PlansPageClient` — full plans page with 5 sections, toggles, client state |
| `app/[locale]/(plans)/_components/pricing-card.tsx` | `PricingCard` compound component — Card, Header, Plan, Price, Body, List |
| `app/[locale]/(plans)/_components/minimal-header.tsx` | `MinimalHeader` — sticky header with section navigation anchors |
| `app/[locale]/(account)/account/plans/page.tsx` | Account plans server component — auth-gated |
| `app/[locale]/(account)/account/plans/loading.tsx` | Account plans loading skeleton |
| `app/[locale]/(account)/account/plans/plans-content.tsx` | `PlansContent` — current plan display, upgrade options |
| `app/[locale]/(account)/account/plans/upgrade/page.tsx` | Upgrade page — full-page variant |
| `app/[locale]/(account)/account/plans/upgrade/upgrade-content.tsx` | `UpgradeContent` — plan selection and upgrade flow |
| `app/[locale]/(account)/@modal/(.)account/plans/upgrade/page.tsx` | Intercepting modal for upgrade — renders `UpgradeContent` in modal overlay |

---

## Known Bugs

None identified for plans and pricing routes.

---

## Findings

| ID | Scenario | Status | Notes |
|----|----------|--------|-------|
| S15.1 | Plans page 5 sections render | ⬜ | — |
| S15.2 | Pricing cards single-column mobile | ⬜ | — |
| S15.3 | Account type & billing toggles | ⬜ | — |
| S15.4 | Comparison table horizontal scroll | ⬜ | — |
| S15.5 | FAQ accordion expand/collapse | ⬜ | — |
| S15.6 | Account plans page (auth-gated) | ⬜ | — |
| S15.7 | Upgrade modal (intercepting route) | ⬜ | — |
| S15.8 | Loading skeleton horizontal scroll | ⬜ | — |

---

## Summary

| Metric | Value |
|--------|-------|
| Scenarios | 8 |
| Executed | 0 |
| Passed | 0 |
| Issues found | 0 |
| Blockers | 0 |
| Status | 📝 Planned |

Phase 15 covers the plans and pricing surface across 3 routes spanning 2 layout groups (`(plans)`, `(account)`) plus an intercepting modal route. The public plans page uses `PlansPageClient` with 5 distinct sections requiring vertical scroll validation. Key mobile-specific risks include the pricing card grid collapsing from 5 columns (XL) to 1 column (mobile), the comparison table requiring horizontal scroll containment, and the loading skeleton using `snap-center shrink-0` horizontal card scroll. The `PricingCard` compound component (Card, Header, Plan, Price, Body, List) must render all subcomponents without truncation at 390px. The upgrade flow uses Next.js intercepting routes (`@modal/(.)account/plans/upgrade`) requiring both modal and full-page rendering validation. No `data-testid` attributes exist — all selectors must rely on structural queries, text content, or ARIA roles.
