# Phase 5 — Search & Quick View

> Mobile Playwright production audit · Phase 5 of 18
> Treido marketplace · AI-perfect document

---

## Metadata

| Field | Value |
|-------|-------|
| **Phase** | 5 |
| **Title** | Search & Quick View |
| **Scope** | Search input/overlay, search results page, mobile filters, sorting, quick-view bottom-sheet drawer |
| **Routes** | `/search` |
| **Priority** | P0 |
| **Dependencies** | Phase 1 (Shell — StorefrontShell, header search icon), Phase 4 (Categories — shared filter/sort components) |
| **Devices** | Pixel 5 (393 × 851) · iPhone 12 (390 × 844) |
| **Auth Required** | No |
| **Status** | 📝 Planned |
| **Created** | 2026-02-09 |

---

## Routes Under Test

| Route | Page File | Layout |
|-------|-----------|--------|
| `/{locale}/search` | `app/[locale]/(main)/search/page.tsx` | `(main)` layout → StorefrontShell |
| `/{locale}/search?q={query}` | Same — query-driven | Same |
| `/{locale}/search?q=...&category=...&sort=...` | Same — filtered/sorted | Same |

---

## Source Files

| File | Purpose |
|------|---------|
| `app/[locale]/(main)/search/page.tsx` | Search results page (server component) |
| `app/[locale]/(main)/search/loading.tsx` | Streaming loading UI |
| `app/[locale]/(main)/search/error.tsx` | Error boundary |
| `app/[locale]/(main)/search/_components/search-header.tsx` | SearchHeader (title / breadcrumb area) |
| `app/[locale]/(main)/search/_components/desktop-filters.tsx` | DesktopFilters (hidden on mobile) |
| `app/[locale]/(main)/search/_components/filters/search-filters.tsx` | SearchFilters sidebar |
| `app/[locale]/(main)/search/_lib/search-products.ts` | `searchProducts()` data fetcher |
| `app/[locale]/(main)/search/_lib/types.ts` | Product / Category types |
| `app/[locale]/(main)/_components/filters/mobile-filter-controls.tsx` | MobileFilterControls (shared) |
| `app/[locale]/(main)/_components/category/subcategory-tabs.tsx` | SubcategoryTabs (shared) |
| `app/[locale]/(main)/_components/filters/filter-chips.tsx` | FilterChips (shared) |
| `app/[locale]/(main)/_components/search-controls/sort-select.tsx` | SortSelect (shared) |
| `app/[locale]/(main)/_components/search-controls/search-pagination.tsx` | SearchPagination (shared) |
| `components/grid/product-grid.tsx` | ProductGrid (`data-slot="product-grid"`, `id="product-grid"`) |
| `app/[locale]/_components/empty-state-cta.tsx` | EmptyStateCTA (no results) |
| `app/[locale]/_components/search/mobile-search-overlay.tsx` | MobileSearchOverlay (full-screen) |
| `components/layout/header/desktop/desktop-search.tsx` | DesktopSearch (`id="treido-desktop-search-input"`) |
| `components/mobile/drawers/product-quick-view-drawer.tsx` | ProductQuickViewDrawer (mobile only) |
| `components/shared/product/quick-view/product-quick-view-content.tsx` | ProductQuickViewContent → delegates to Mobile/Desktop |
| `components/shared/product/quick-view/quick-view-skeleton.tsx` | QuickViewSkeleton |
| `components/shared/product/quick-view/quick-view-image-gallery.tsx` | QuickViewImageGallery (aspect-square, touch-pan) |
| `app/globals.css` | Global `touch-action: manipulation` (line ~951) |
| `app/shadcn-components.css` | `touch-action: none` (line ~10) |
| `app/utilities.css` | `touch-action: pan-x pinch-zoom` (line ~350) |

---

## Prerequisites

1. Dev server running at `http://127.0.0.1:3000`.
2. Supabase seeded with ≥ 6 products across ≥ 2 categories (needed for filters, pagination, grid).
3. At least one product with images (needed for quick-view gallery).
4. Mobile viewport configured: Pixel 5 `393 × 851` or iPhone 12 `390 × 844`.
5. Locale: `en` (default).
6. No authentication required — search is public.

---

## Known Bugs

| ID | Summary | Severity | Impact on Audit |
|----|---------|----------|-----------------|
| FE-UX-006 | Invalid `touch-action-*` TW4 utilities and bracket `aspect-[...]` in quick-view drawer/gallery | P1 | S5.15 explicitly validates; touch interactions in S5.12 may be affected |

---

## Scenarios

### S5.1 — Search Overlay Opens from Header

**Goal:** Tapping the header search icon opens the full-screen MobileSearchOverlay.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}` | — |
| 2 | Tap search icon in mobile header | `button` inside header with search icon (magnifying glass SVG); fallback: `header button:has(svg.lucide-search)` or `[aria-label*="search" i]` |
| 3 | Assert overlay is visible | MobileSearchOverlay container — locate by: full-screen overlay `div` with `role="dialog"` or the search input within; use `page.locator('input[type="search"], input[type="text"]').filter({ hasText: '' })` inside overlay |
| 4 | Assert search input is focused | `await expect(searchInput).toBeFocused()` |

**Expected:** Full-screen overlay renders over page content; search input auto-focused; keyboard visible (implicit on real device).

📸 **Screenshot:** `s5-1-search-overlay-open.png`

---

### S5.2 — Recent Searches Shown in Overlay

**Goal:** When overlay opens, recent/trending searches are displayed.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Perform S5.1 to open overlay | — |
| 2 | Assert recent searches section visible | Look for heading text "Recent" or "Trending" inside overlay: `page.getByText(/recent|trending/i)` |
| 3 | Assert at least one search suggestion item | List items inside overlay: `overlay.locator('a, button, [role="option"]')` — count ≥ 1 |

**Expected:** Recent or trending search suggestions render below the input. If user has no history, trending section still shows.

📸 **Screenshot:** `s5-2-recent-searches.png`

---

### S5.3 — Live Search Results on Typing

**Goal:** Typing a query in the overlay produces live results.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Open overlay (S5.1) | — |
| 2 | Type a known product keyword (e.g. first 3 chars of a seeded product) | `searchInput.fill('shirt')` or `searchInput.pressSequentially('shi', { delay: 80 })` |
| 3 | Wait for live results | `page.waitForResponse(resp => resp.url().includes('/search') \|\| resp.url().includes('supabase'))` or wait for result items to appear |
| 4 | Assert ≥ 1 result item visible | Result links/cards inside overlay |
| 5 | Tap first result | First result link/button |
| 6 | Assert navigation occurred | URL changed — either to PDP or to `/search?q=...` |

**Expected:** Results appear within ~500 ms of typing pause; tapping a result navigates away from overlay.

📸 **Screenshot:** `s5-3-live-search-results.png` (after step 4)

---

### S5.4 — Search Results Page: Product Grid Renders

**Goal:** Navigating to `/search?q={query}` renders the mobile product grid.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}/search?q=shirt` | Direct navigation |
| 2 | Wait for product grid | `page.locator('[data-slot="product-grid"]')` or `page.locator('#product-grid')` |
| 3 | Assert grid is visible | `await expect(grid).toBeVisible()` |
| 4 | Assert ≥ 1 product card inside grid | `grid.locator('[data-slot="product-card"], article, a').first()` — count ≥ 1 |
| 5 | Assert mobile preset applied | Grid should NOT have desktop multi-column classes; on mobile viewport it should render single/double column feed |

**Expected:** ProductGrid with `preset="mobile-feed"` + `density="compact"` renders; product cards show image, title, price.

📸 **Screenshot:** `s5-4-search-results-grid.png`

---

### S5.5 — Results Count Strip (Mobile Only)

**Goal:** The mobile-only results count strip is visible above the grid.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}/search?q=shirt` | — |
| 2 | Wait for page load | `page.locator('[data-slot="product-grid"]')` visible |
| 3 | Locate results strip | `page.locator('.sm\\:hidden').filter({ hasText: /result/i })` — the strip has classes `sm:hidden mb-4 flex items-center justify-between text-sm text-muted-foreground bg-surface-subtle rounded-lg px-3 py-2.5` |
| 4 | Assert strip visible | `await expect(strip).toBeVisible()` |
| 5 | Assert strip contains a number | `await expect(strip).toHaveText(/\d+/)` |

**Expected:** Strip shows e.g. "12 results" or "Showing 1–20 of 45"; hidden on `sm:` breakpoint and above.

📸 **Screenshot:** `s5-5-results-count-strip.png`

---

### S5.6 — Mobile Filter Controls Visible

**Goal:** MobileFilterControls (filter button / drawer trigger) is rendered on mobile.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}/search?q=shirt` | — |
| 2 | Locate filter controls area | `page.locator('button').filter({ hasText: /filter/i })` or button with funnel/sliders icon |
| 3 | Assert filter button visible | `await expect(filterBtn).toBeVisible()` |
| 4 | Tap filter button | `filterBtn.click()` |
| 5 | Assert filter drawer/sheet opens | Look for drawer/sheet: `page.locator('[role="dialog"]')` or `page.locator('[data-slot="sheet-content"], [data-vaul-drawer]')` |
| 6 | Assert filter options inside drawer | Category checkboxes, price range, etc. |

**Expected:** Filter button visible in mobile controls bar; tapping opens bottom sheet / drawer with SearchFilters content.

📸 **Screenshot:** `s5-6-filter-controls.png` (after step 5)

---

### S5.7 — Sort Select Works

**Goal:** SortSelect dropdown changes sort order and updates results.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}/search?q=shirt` | — |
| 2 | Locate sort control | `page.locator('select, [role="combobox"], button').filter({ hasText: /sort|newest|price|popular/i })` |
| 3 | Assert sort control visible | `await expect(sortControl).toBeVisible()` |
| 4 | Change sort option | Click/select a different option (e.g. "Price: Low to High") |
| 5 | Wait for URL update | `page.waitForURL(/sort=/)` |
| 6 | Assert URL contains sort param | `expect(page.url()).toContain('sort=')` |
| 7 | Assert grid re-renders | Product grid still visible with updated order |

**Expected:** Selecting a sort option updates URL search params and re-renders grid with new ordering.

📸 **Screenshot:** `s5-7-sort-select.png`

---

### S5.8 — Filter Chips for Active Filters

**Goal:** When filters are active, FilterChips are rendered and dismissible.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}/search?q=shirt&category=electronics` (or apply filter via S5.6) | — |
| 2 | Locate filter chips area | `page.locator('[data-slot="filter-chips"], .filter-chips').first()` or chips container with small badge-like elements |
| 3 | Assert ≥ 1 chip visible | Chip elements: `chipsContainer.locator('button, [role="option"]')` — count ≥ 1 |
| 4 | Assert chip text matches filter | Chip text includes category name or filter value |
| 5 | Tap chip dismiss (×) button | `chip.locator('svg, [aria-label*="remove" i], [aria-label*="clear" i]').click()` |
| 6 | Assert chip removed | Chip count decreased or chip no longer visible |
| 7 | Assert URL param removed | `expect(page.url()).not.toContain('category=electronics')` |

**Expected:** Active filters display as dismissible chips; removing a chip updates URL and refreshes results.

📸 **Screenshot:** `s5-8-filter-chips.png`

---

### S5.9 — Pagination Works

**Goal:** SearchPagination allows navigating between result pages.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}/search?q=a` (broad query to ensure multiple pages) | — |
| 2 | Scroll to bottom of results | `page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))` |
| 3 | Locate pagination | `page.locator('nav[aria-label*="pagination" i], [data-slot="pagination"]')` or `page.getByRole('navigation', { name: /pagination/i })` |
| 4 | Assert pagination visible | `await expect(pagination).toBeVisible()` |
| 5 | Assert "Next" or page 2 button exists | `pagination.locator('a, button').filter({ hasText: /next|2|→/i })` |
| 6 | Tap next/page 2 | Click the button |
| 7 | Assert URL updated | `expect(page.url()).toMatch(/page=2/)` |
| 8 | Assert grid re-renders with new products | Grid visible, first product card differs from page 1 |

**Expected:** Pagination nav renders below grid; page navigation updates URL and loads new result set.

📸 **Screenshot:** `s5-9-pagination.png`

> **Note:** If dataset is small and only 1 page exists, this scenario validates that pagination is NOT shown (acceptable alternative).

---

### S5.10 — Product Card Tap Opens Quick-View Drawer

**Goal:** Tapping a product card on mobile opens the ProductQuickViewDrawer bottom sheet.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}/search?q=shirt` | — |
| 2 | Wait for grid | `page.locator('[data-slot="product-grid"]')` |
| 3 | Locate first product card | `page.locator('[data-slot="product-card"], #product-grid article, #product-grid a').first()` |
| 4 | Tap product card | `card.click()` |
| 5 | Wait for drawer to open | `page.locator('[data-vaul-drawer], [role="dialog"]').filter({ has: page.locator('img') })` — the ProductQuickViewDrawer |
| 6 | Assert drawer is visible | `await expect(drawer).toBeVisible()` |
| 7 | Assert drawer has rounded top | Drawer content has class `rounded-t-2xl` (visual — screenshot validation) |

**Expected:** Bottom sheet drawer slides up with product quick view content; overlay dims background; drawer has `max-h-dialog rounded-t-2xl` styling.

📸 **Screenshot:** `s5-10-quickview-drawer-open.png`

---

### S5.11 — Quick-View Drawer Content

**Goal:** Quick-view drawer displays product image, title, price, and CTA buttons.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Open quick-view drawer (S5.10 steps 1–6) | — |
| 2 | Assert product image visible | `drawer.locator('img').first()` — within aspect-square container |
| 3 | Assert product title visible | `drawer.locator('h2, h3, [data-slot="title"]').first()` |
| 4 | Assert price visible | `drawer.locator('[data-slot="price"], .text-price, span').filter({ hasText: /[€$лв\d]/ }).first()` |
| 5 | Assert CTA button(s) visible | `drawer.locator('button, a').filter({ hasText: /add|buy|cart|view/i })` — at least 1 |
| 6 | Assert image gallery thumbnails (if multi-image product) | `drawer.locator('.touch-pan-x img, [class*="thumbnail"] img')` |

**Expected:** Drawer content includes: hero image (aspect-square), product title, formatted price, at least one action button. Image gallery with touch-pan-x thumbnails if product has multiple images.

📸 **Screenshot:** `s5-11-quickview-content.png`

---

### S5.12 — Quick-View Drawer Dismissal

**Goal:** Drawer closes on backdrop tap and swipe-down gesture.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Open quick-view drawer (S5.10) | — |
| 2 | **Backdrop tap test:** Tap the overlay/backdrop | `page.locator('[data-vaul-overlay], [data-slot="drawer-overlay"]').click({ position: { x: 10, y: 10 } })` |
| 3 | Assert drawer closed | `await expect(drawer).not.toBeVisible()` |
| 4 | Re-open drawer (S5.10 steps 3–6) | — |
| 5 | **Swipe-down test:** Perform swipe-down gesture on drawer handle | Touchscreen swipe: start at drawer top (`drawer.boundingBox()` → y), swipe 300px down |
| 6 | Assert drawer closed | `await expect(drawer).not.toBeVisible()` |

**Expected:** Both dismissal methods work. Drawer has `touch-pan-y` on content allowing vertical swipe; `overlayBlur="sm"` renders blurred backdrop.

📸 **Screenshot:** `s5-12-quickview-dismiss.png` (backdrop visible before tap)

> **Risk:** FE-UX-006 — invalid `touch-action-*` TW4 utilities may cause swipe-down to malfunction. If swipe fails, log as FE-UX-006 regression evidence.

---

### S5.13 — Quick-View "View Full" Navigates to PDP

**Goal:** The "View Full" or "View Details" button in quick view navigates to the product detail page.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Open quick-view drawer (S5.10) | — |
| 2 | Locate "View Full" or "View Details" link/button | `drawer.locator('a, button').filter({ hasText: /view full|view detail|see more|full detail/i })` |
| 3 | Assert link is visible | `await expect(viewFullLink).toBeVisible()` |
| 4 | Capture product URL from link href | `const href = await viewFullLink.getAttribute('href')` |
| 5 | Tap the link | `viewFullLink.click()` |
| 6 | Assert navigation to PDP | `await page.waitForURL(/\/[^/]+\/[^/]+$/)` — matches `/{username}/{productSlug}` pattern |
| 7 | Assert PDP page loaded | Product title visible on full page |

**Expected:** Tapping "View Full" closes drawer and navigates to full PDP route (`/{username}/{productSlug}`).

📸 **Screenshot:** `s5-13-view-full-pdp.png`

---

### S5.14 — Empty State: No Results

**Goal:** Searching for a nonsense query shows EmptyStateCTA.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Navigate to `/{locale}/search?q=xyznonexistent99` | — |
| 2 | Wait for page load | Network idle or loading skeleton gone |
| 3 | Assert product grid is empty or hidden | `page.locator('[data-slot="product-grid"]')` either not visible or contains 0 cards |
| 4 | Assert empty state rendered | `page.locator('[data-slot="empty-state"], .empty-state').first()` or `page.getByText(/no results|nothing found|try again/i)` |
| 5 | Assert CTA button in empty state | `page.locator('a, button').filter({ hasText: /browse|explore|home|clear/i })` |

**Expected:** EmptyStateCTA component renders with helpful message and action button (e.g. "Browse All" or "Clear Filters").

📸 **Screenshot:** `s5-14-empty-state.png`

---

### S5.15 — FE-UX-006: Touch-Action Classes in Quick View

**Goal:** Audit `touch-action` CSS classes in quick-view drawer for correctness under Tailwind v4.

| Step | Action | Selector / Locator |
|------|--------|--------------------|
| 1 | Open quick-view drawer (S5.10) | — |
| 2 | Locate drawer content container | `page.locator('[data-vaul-drawer-content], [data-slot="drawer-content"]')` or the `DrawerContent` wrapper |
| 3 | Evaluate computed `touch-action` on drawer content | `page.evaluate(el => getComputedStyle(el).touchAction, drawerContent)` |
| 4 | Assert value is valid | Should be `pan-y` (from `touch-pan-y` class). If value is `auto` or empty, TW4 class is not compiling — **FE-UX-006 confirmed** |
| 5 | Locate image gallery outer div | `drawer.locator('.touch-pan-y').first()` |
| 6 | Evaluate computed `touch-action` on gallery | Same `getComputedStyle` check |
| 7 | Locate thumbnail strip | `drawer.locator('.touch-pan-x').first()` |
| 8 | Evaluate computed `touch-action` on thumbnail strip | Should be `pan-x` |
| 9 | Check for `aspect-square` rendering | `drawer.locator('.aspect-square').first()` → evaluate `getComputedStyle(el).aspectRatio` → should be `1 / 1` |
| 10 | Check globals for conflicting `touch-action` | `page.evaluate(() => { const body = document.body; return getComputedStyle(body).touchAction })` — should NOT override element-level rules |

**Expected:** All `touch-action` utilities compile to correct CSS values. `aspect-square` resolves to `aspect-ratio: 1 / 1`. If any fail → FE-UX-006 confirmed/expanded.

📸 **Screenshot:** `s5-15-touch-action-audit.png` (DevTools overlay if possible)

---

## Selector Strategy

Since **no `data-testid` attributes exist** in search or quick-view components, selectors use this priority:

1. **`data-slot`** — present on `product-grid` (`data-slot="product-grid"`)
2. **`id`** — `#product-grid`, `#treido-desktop-search-input` (desktop only)
3. **`role` + `name`** — `getByRole('dialog')`, `getByRole('navigation', { name: /pagination/i })`
4. **`aria-label`** — `[aria-label*="search"]`
5. **CSS class chains** — `.sm\\:hidden.bg-surface-subtle` (results strip), `.touch-pan-y`, `.aspect-square`
6. **Text content** — `getByText(/results/i)`, `filter({ hasText: /filter/i })`

> **Recommendation:** Add `data-testid` to: search overlay container, search input, filter button, sort select, result count strip, product cards, quick-view drawer, quick-view CTA buttons.

---

## Findings

| ID | Scenario | Status | Notes |
|----|----------|--------|-------|
| — | — | — | _No findings yet — audit not started_ |

---

## Summary

| Metric | Value |
|--------|-------|
| Total scenarios | 15 |
| Passed | — |
| Failed | — |
| Blocked | — |
| Bugs found | — |
| Known bugs validated | FE-UX-006 (pending S5.15) |

---

*Generated for Treido production audit · Phase 5 of 18 · 2026-02-09*
