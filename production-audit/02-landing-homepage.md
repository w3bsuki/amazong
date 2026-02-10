# Phase 2: Landing & Homepage

> Audit the mobile homepage at `/` — hero sections, category circles, promoted listings, newest grid, curated rail, scope bar, sticky category pills, and product card accuracy.

| Field | Value |
|-------|-------|
| **Scope** | All mobile-visible homepage sections rendered by `MobileHome`, including category navigation, scope filtering, promoted/newest/curated feeds, sticky pills, and product card content |
| **Routes** | `/` |
| **Priority** | P0 |
| **Dependencies** | Phase 1 (Shell & Navigation) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No |
| **Status** | 📝 Planned |

---

## Source Files

| File | Purpose |
|------|---------|
| `app/[locale]/(main)/page.tsx` | Homepage server component; parallel data fetching via `Promise.all` (newest 24, boosted 24, deals 10, fashion 10, electronics 10, automotive 10); mobile renders `MobileHome`, desktop renders `DesktopHome` |
| `app/[locale]/(main)/_components/mobile-home.tsx` | Client component; assembles all homepage sections for mobile (`md:hidden`); manages scope state, sticky pills scroll observer, search overlay |
| `app/[locale]/(main)/_components/mobile/home-section-hero.tsx` | Promoted and newest hero banner cards (`HomeSectionHero`); accepts `variant="promoted"` or `variant="newest"` and optional `testId` |
| `app/[locale]/(main)/_components/mobile/promoted-listings-strip.tsx` | Horizontal strip of promoted product cards (`PromotedListingsStrip`); renders in `layout="strip"` mode with snap scroll |
| `app/[locale]/(main)/_components/mobile/home-section-header.tsx` | Section header with title + "See all" CTA link (`HomeSectionHeader`); `variant="promoted"` adds lightning icon |
| `app/[locale]/(main)/_components/mobile/home-sticky-category-pills.tsx` | Fixed sticky pill bar (`HomeStickyCategoryPills`); appears when category circles scroll out of view; positioned at `top: var(--app-header-offset)` |
| `app/[locale]/(main)/_components/mobile/home-scope-bar.tsx` | City + category scope filter bar (`HomeScopeBar`); triggers city/category drawers; shows clear button when scoped |
| `app/[locale]/(main)/_components/mobile/home-scope-copy.ts` | Pure function `getHomeScopeCopy()` — resolves hero eyebrow/title/subtitle based on scope mode (default, city, category, cityCategory) |
| `app/[locale]/(main)/_components/mobile/home-city-drawer.tsx` | Drawer for selecting city scope (`HomeCityDrawer`); uses `BULGARIAN_CITIES` data; Vaul-based bottom sheet |
| `app/[locale]/(main)/_components/mobile/home-category-drawer.tsx` | Drawer for selecting category scope (`HomeCategoryDrawer`); shows L0 root categories with search filter |
| `components/mobile/category-nav/category-circles-simple.tsx` | Horizontal category circle rail (`CategoryCirclesSimple`); shows up to `maxVisible` (7) L0 categories + "More" button; integrates with `CategoryDrawerProvider` |
| `components/shared/product/card/mobile.tsx` | `MobileProductCard` — renders product image, title, price, seller row, category badge, boost badge; `layout="feed"` for grid, `layout="rail"` for horizontal strips |
| `hooks/use-home-scoped-feed.ts` | `useHomeScopedFeed` hook — manages city/category scope state with localStorage persistence, fetches scoped products, caches results |
| `app/[locale]/_components/storefront-shell.tsx` | Layout shell wrapping all `(main)` routes; renders `AppHeader` → `<main>` → `SiteFooter` → `MobileTabBar` → `CategoryBrowseDrawer` → overlays |
| `app/[locale]/_components/storefront-layout.tsx` | Async layout; fetches `getCategoryHierarchy(null, 2)`, wraps children in `StorefrontShell` + `CommerceProviders` |
| `components/layout/header/mobile/homepage-header.tsx` | `MobileHomepageHeader` — hamburger + "treido." logo + inline search trigger + cart/wishlist; used when `AppHeader` variant is `"homepage"` |
| `app/[locale]/_components/page-shell.tsx` | `PageShell` — canonical surface wrapper; `variant="default"` = `bg-background`, `variant="muted"` = `bg-surface-subtle` |
| `app/[locale]/_components/mobile-tab-bar.tsx` | `MobileTabBar` — 4-tab bottom navigation (Home, Categories, Sell, Profile) with `data-testid="mobile-tab-bar"` |

---

## Prerequisites

- Overlay dismissal configured (cookie consent + geo welcome modal)
  ```typescript
  await page.addInitScript(() => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('geo-welcome-dismissed', 'true');
  });
  ```
- Hydration wait: `<main>` visible + `header[data-hydrated="true"]`
- No auth needed — homepage is public
- Products must exist in database:
  - Promoted: ≥ 1 boosted product with `boostExpiresAt` in the future
  - Newest: ≥ 12 products (grid renders `slice(0, 12)`)
  - Curated: ≥ 1 product in at least one of: fashion, electronics, automotive, deals (priority order)
- Category hierarchy data available (L0 + L1 + L2)

---

## Routes Under Test

| # | Route | URL Pattern | Key Elements |
|---|-------|-------------|--------------|
| 1 | Homepage | `/en` | `MobileHome` with all sections: category circles, scope bar, promoted hero, promoted strip, newest hero, newest grid, curated rail, "All Listings" CTA |

---

## Test Scenarios

### S2.1: All Homepage Sections Render in Correct Document Order

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport (393×851).
2. Wait for hydration (`<main>` visible).
3. Assert `[data-testid="home-category-circles"]` is visible.
4. Assert `[data-testid="home-scope-bar"]` is visible below category circles.
5. Assert `[data-testid="home-section-promoted-hero"]` is visible below scope bar.
6. Assert `[data-testid="home-section-promoted"]` OR `[data-testid="home-section-promoted-empty"]` exists (depends on scoped state).
7. Assert `[data-testid="home-section-newest"]` is visible.
8. Assert `[data-testid="home-section-newest-hero"]` is visible inside the newest section.
9. Scroll down. Assert `[data-testid="home-section-curated-rail"]` is visible (if curated data exists).
10. Verify document order: circles → scope bar → promoted hero → promoted strip/empty → newest section → curated rail.

**Expected:** All sections render in the correct order without overlap, gaps, or missing elements. No blank sections.

**Screenshot checkpoint:** `phase-02-S2.1-homepage-sections-order.png`

---

### S2.2: Category Circles Horizontal Scroll

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Locate `[data-testid="home-category-circles"]`.
3. Verify a "Categories" root button/link is the first circle item.
4. Verify up to 7 L0 category circles are visible (per `maxVisible={7}`).
5. Verify a "More" circle is present as the last item (with `DotsThree` icon).
6. Swipe/scroll horizontally within the category circles container.
7. Confirm the container has `overflow-x-auto` and `no-scrollbar` (no visible scrollbar).
8. Tap one category circle — verify the `CategoryBrowseDrawer` opens (if `CategoryDrawerProvider` is present).

**Expected:** Category circles form a horizontally scrollable rail with momentum scroll. Max 7 + root + "More" = up to 9 items. Tapping a circle opens the category drawer. No horizontal overflow escapes the container.

**Screenshot checkpoint:** `phase-02-S2.2-category-circles-scroll.png`

---

### S2.3: Scope Bar — City and Category Drawers

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Locate `[data-testid="home-scope-bar"]`.
3. Verify two scope trigger buttons are visible:
   - `[data-testid="home-scope-city-trigger"]` — shows city label with `MapPin` icon.
   - `[data-testid="home-scope-category-trigger"]` — shows category label with `SquaresFour` icon.
4. Verify `[data-testid="home-scope-clear"]` is NOT visible (no active scope).
5. Tap `[data-testid="home-scope-city-trigger"]` — verify `HomeCityDrawer` opens as a Vaul bottom sheet.
6. Select a city (e.g., Sofia). Verify drawer closes, scope bar updates to show the selected city label.
7. Verify `[data-testid="home-scope-clear"]` is now visible.
8. Tap `[data-testid="home-scope-category-trigger"]` — verify `HomeCategoryDrawer` opens.
9. Select a category. Verify scope bar updates.
10. Tap `[data-testid="home-scope-clear"]` — verify scope resets, clear button disappears.

**Expected:** Both scope drawers open/close smoothly. Selecting a scope updates hero copy and feeds (via `useHomeScopedFeed`). Clear button resets all scope state.

**Screenshot checkpoint:** `phase-02-S2.3-scope-bar-city-selected.png`

---

### S2.4: Promoted Section Hero Rendering

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport (unscoped, default state).
2. Locate `[data-testid="home-section-promoted-hero"]`.
3. Verify the hero is a `<section>` containing a `<Link>` element.
4. Verify the hero displays:
   - Eyebrow text (uppercase, `text-2xs`)
   - Title text (`text-base font-semibold`)
   - Subtitle text (`text-xs text-muted-foreground`)
   - CTA button with `CaretRight` icon
   - `Lightning` icon (fill weight) in a circular badge
5. Verify the link `href` points to a search URL with `promoted=true` params.
6. Tap the hero — verify navigation to the promoted search results page.

**Expected:** Promoted hero banner renders with all text elements, the lightning icon, and a working CTA link. The banner adapts its copy when scope changes.

**Screenshot checkpoint:** `phase-02-S2.4-promoted-hero.png`

---

### S2.5: Promoted Strip — Horizontal Product Rail

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Verify promoted products exist (at least 1 boosted product with valid `boostExpiresAt`).
3. Locate `[data-testid="home-section-promoted"]` section.
4. Inside it, locate `[data-testid="home-section-promoted-strip"]`.
5. Verify the strip renders product cards in a horizontal scroll container with:
   - `overflow-x-auto scroll-smooth no-scrollbar`
   - `flex snap-x snap-mandatory` layout
   - Each card wrapped in a `w-(--spacing-home-card-column-w) shrink-0 snap-start` div
6. Verify up to 10 cards are rendered (`maxItems={10}`).
7. Swipe horizontally — verify smooth snap scrolling.
8. Verify each card uses `MobileProductCard` with `layout="rail"`.

**Expected:** Promoted products display in a horizontal snap-scrolling rail. Cards are uniformly sized. No horizontal overflow bleeds outside the section.

**Screenshot checkpoint:** `phase-02-S2.5-promoted-strip-scroll.png`

---

### S2.6: Promoted Section Empty State (Scoped, No Results)

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Tap `[data-testid="home-scope-city-trigger"]` and select a city unlikely to have promoted products.
3. Wait for scoped feed to load (loading indicator in scope bar).
4. Verify `[data-testid="home-section-promoted-empty"]` is visible.
5. Verify the empty state contains:
   - Explanatory text (`text-xs text-muted-foreground`)
   - A "Clear" button to reset scope
6. Tap the "Clear" button — verify scope resets and promoted strip reloads.

**Expected:** When scoped and no promoted products exist, a graceful empty state with a clear button is shown instead of the promoted strip. The empty state is styled with `rounded-xl border border-border-subtle bg-surface-subtle`.

**Screenshot checkpoint:** `phase-02-S2.6-promoted-empty-state.png`

---

### S2.7: Newest Products Section with 2-Column Grid

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Locate `[data-testid="home-section-newest"]`.
3. Inside it, locate `[data-testid="home-section-newest-hero"]` — verify it renders a `HomeSectionHero` with `variant="newest"` (uses `Sparkle` icon instead of `Lightning`).
4. Below the hero, verify a 2-column product grid renders with class `grid grid-cols-2 gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-1`.
5. Count the product cards — verify up to 12 cards are rendered (`newestGridProducts = slice(0, 12)`).
6. Verify each card uses `MobileProductCard` with `layout="feed"`.
7. Verify the grid has consistent spacing (no cards overlapping or leaving unexpected gaps).
8. Scroll through the entire grid — verify all cards are fully visible and not clipped.

**Expected:** Newest section shows a hero banner followed by a 2-column grid of up to 12 product cards. Cards are uniformly sized with consistent spacing. Grid aligns with home inset padding.

**Screenshot checkpoint:** `phase-02-S2.7-newest-grid.png`

---

### S2.8: Curated Rail Horizontal Scroll (Fashion / Electronics / Automotive)

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Scroll down to `[data-testid="home-section-curated-rail"]`.
3. Verify a `HomeSectionHeader` renders above the rail with:
   - A title matching one of the curated section names (fashion, electronics, automotive, or deals — first non-empty in priority order)
   - A "See all" CTA link
4. Verify the rail container has `overflow-x-auto scroll-smooth no-scrollbar`.
5. Verify product cards are wrapped in `flex snap-x snap-mandatory gap-(--spacing-home-card-gap) px-(--spacing-home-inset) pb-1.5`.
6. Verify each card is wrapped in `w-(--spacing-home-card-column-w) shrink-0 snap-start`.
7. Swipe horizontally — verify smooth snap scrolling.
8. Verify up to 10 cards are rendered (`slice(0, 10)`).
9. Tap the "See all" CTA — verify navigation to the appropriate category or deals page (e.g., `/categories/fashion`, `/categories/electronics`, `/categories/automotive`, or `/todays-deals`).

**Expected:** A single curated rail renders (the first non-empty section in priority: fashion → electronics → automotive → deals). The rail is horizontally scrollable with snap behavior. The "See all" link navigates correctly.

**Screenshot checkpoint:** `phase-02-S2.8-curated-rail.png`

---

### S2.9: Sticky Category Pills Appear on Scroll

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Verify `[data-testid="home-sticky-category-pills"]` exists in the DOM but is visually hidden (`opacity-0 pointer-events-none -translate-y-1`).
3. Scroll down until `[data-testid="home-category-circles"]` is fully out of the viewport (its `bottom <= 0`).
4. Verify `[data-testid="home-sticky-category-pills"]` transitions to visible state (`opacity-100 pointer-events-auto translate-y-0`).
5. Verify the sticky pills bar is `position: fixed` at `top: var(--app-header-offset)`.
6. Verify the pills contain:
   - A "Categories" root pill (first item)
   - Individual category pills matching the L0 categories
7. Verify pills are horizontally scrollable (`overflow-x-auto no-scrollbar`).
8. Tap a category pill — verify the `CategoryBrowseDrawer` opens (if `CategoryDrawerProvider` is active).
9. Scroll back up — verify sticky pills hide when category circles are back in view.

**Expected:** Sticky category pills appear/disappear smoothly with a 200ms transition as the user scrolls past the category circles section. Pills are interactive and open the category drawer on tap.

**Screenshot checkpoint:** `phase-02-S2.9-sticky-pills-visible.png`

---

### S2.10: Product Card Data Accuracy (Image, Title, Price, Category — Verify CAT-001)

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Locate the first `MobileProductCard` in the newest grid (`[data-testid="home-section-newest"]`).
3. Verify the card displays:
   - Product image (not broken, proper aspect ratio)
   - Product title (truncated to 1 line per `titleLines={1}`)
   - Price row (`[data-testid="product-card-price-row"]`) with formatted currency
   - Seller row (`[data-testid="product-card-seller-row"]`) with seller name and avatar
4. If the product has a category path, check the category badge displayed on the card.
5. **CAT-001 verification:** Does the category badge show the L0 root category (e.g., "Fashion") or the L4 deep subcategory (e.g., "Men's Casual Shirts")? Record which is displayed.
6. If the product is boosted, verify `[data-testid="product-card-ad-badge"]` is visible with "Ad" badge text.
7. Repeat for a product card in the promoted strip (`[data-testid="home-section-promoted-strip"]`).

**Expected:** Product cards display accurate data. **CAT-001 expected behavior:** Cards should show the L0 root category label, but the known bug causes L4 subcategory display instead. Document whether the bug is still present.

**Screenshot checkpoint:** `phase-02-S2.10-product-card-accuracy.png`

---

### S2.11: Product Card Tap Navigates to PDP

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Locate a product card in the newest grid (`[data-testid="home-section-newest"]`).
3. Note the product title and seller username.
4. Tap the product card.
5. Verify navigation to the PDP at `/{username}/{slug}` or `/{username}/{id}`.
6. Verify the PDP loads (product header, image, price visible — detailed PDP testing is Phase 6).
7. Navigate back (browser back button).
8. Verify return to homepage with scroll position preserved (or at least homepage loads correctly).

**Expected:** Tapping a product card navigates to the correct PDP route. Back navigation returns to the homepage.

**Screenshot checkpoint:** `phase-02-S2.11-product-card-tap-pdp.png`

---

### S2.12: No Horizontal Overflow on Any Section

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport (393×851).
2. Execute JavaScript to check for horizontal overflow:
   ```javascript
   const docWidth = document.documentElement.scrollWidth;
   const viewportWidth = window.innerWidth;
   console.log('Overflow:', docWidth > viewportWidth, docWidth, viewportWidth);
   ```
3. Scroll through the entire homepage top to bottom.
4. Re-check `scrollWidth` vs `innerWidth` at each major section break.
5. Inspect key overflow candidates:
   - Category circles container (`[data-testid="home-category-circles"]`)
   - Promoted strip (`[data-testid="home-section-promoted-strip"]`)
   - Curated rail (`[data-testid="home-section-curated-rail"]`)
   - Newest grid (inside `[data-testid="home-section-newest"]`)
6. Repeat on iPhone 12 viewport (390×844).

**Expected:** `document.documentElement.scrollWidth` never exceeds `window.innerWidth`. No horizontal scrollbar appears at the document level. Horizontal scroll is contained within individual rail containers only.

**Screenshot checkpoint:** `phase-02-S2.12-no-horizontal-overflow.png`

---

### S2.13: Homepage Header Variant Active (MobileHomepageHeader)

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Verify the mobile header renders the `MobileHomepageHeader` variant (not the default/standard header).
3. Verify the homepage header contains:
   - Hamburger menu trigger (sidebar menu) on the far left
   - "treido." logo text (`text-xl font-extrabold tracking-tight`)
   - Inline search trigger button (rounded pill with `MagnifyingGlass` icon and placeholder text)
   - Cart icon (via `MobileCartDropdown`)
   - Wishlist icon (via `MobileWishlistButton`)
4. Verify the header has `bg-background pt-safe` and is inside the `md:hidden` mobile gate.
5. Tap the search trigger — verify `MobileSearchOverlay` opens.
6. Verify header height matches `--control-primary` (the header row height token).

**Expected:** The homepage uses the `MobileHomepageHeader` variant with inline search, not the standard header with a separate search row. All header elements are visible and functional.

**Screenshot checkpoint:** `phase-02-S2.13-homepage-header-variant.png`

---

### S2.14: Tab Bar Home Active State

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Locate `[data-testid="mobile-tab-bar"]`.
3. Verify the tab bar is visible and fixed at the bottom of the viewport.
4. Verify the "Home" tab (first tab, `House` icon) is in the active state:
   - Active styling applied (check for active color class or `aria-current="page"`)
   - Icon weight is `fill` (active) rather than `regular` (inactive)
5. Verify the other tabs (Categories, Sell, Profile) are in inactive state.
6. Verify the tab bar is not overlapping homepage content (main has `pb-tabbar-safe` padding).

**Expected:** The Home tab shows as active on the homepage. The tab bar doesn't obscure content thanks to `pb-tabbar-safe` bottom padding on `<main>`.

**Screenshot checkpoint:** `phase-02-S2.14-tabbar-home-active.png`

---

### S2.15: "All Listings" CTA at Bottom

**Steps:**
1. Navigate to `/en` on Pixel 5 viewport.
2. Scroll to the bottom of the homepage content (past the curated rail section).
3. Verify an "All Listings" link button is visible:
   - Full-width (`w-full`)
   - Styled as `rounded-xl border border-border-subtle bg-background`
   - Contains text label and a `CaretRight` icon
   - Touch target is at least `min-h-(--spacing-touch-md)`
4. Tap the CTA — verify navigation to the scoped search results page (uses `buildScopedSearchHref({ sort: "newest" })`).

**Expected:** A prominent "All Listings" CTA appears as the final element of the homepage feed, clearly directing users to the full product listing.

**Screenshot checkpoint:** `phase-02-S2.15-all-listings-cta.png`

---

## Known Bugs to Verify

| Bug ID | Expected Behavior | Actual Behavior | Status |
|--------|-------------------|-----------------|--------|
| CAT-001 | Product cards display L0 root category label (e.g., "Fashion", "Electronics") | Product cards show L4 deep subcategory label instead (e.g., "Men's Casual Shirts") | 🔴 Open |

---

## Findings

> Filled during audit execution.

| # | Severity | Component | Description | Screenshot | Repro Steps |
|---|----------|-----------|-------------|------------|-------------|

---

## Summary

| Metric | Value |
|--------|-------|
| Routes tested | — |
| Scenarios executed | — |
| Findings | — |
| Known bugs verified | — |
| Status | 📝 Planned |
