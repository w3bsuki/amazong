# Phase 4: Categories & Discovery

> Validate the full category browsing experience on mobile — from the tab-bar category drawer through the 3-level hierarchy (L0→L1→L2/L3), category index and slug pages with product grids, filter/sort bar interactions, location chip, sort options, pagination, and back-navigation scroll preservation.

| Field | Value |
|-------|-------|
| **Scope** | Category browsing through 3-level hierarchy (L0→L1→L2/L3), category browse drawer, category pages with product grids, filter/sort bar, location filter |
| **Routes** | `/categories`, `/categories/:slug`, `/categories/:slug/:sub` |
| **Priority** | P0 |
| **Dependencies** | Phase 1 (Shell), Phase 3 (Auth — for auth-gated filters) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No (public routes) |
| **Status** | 📝 Planned |

---

## Source Files

| File | Role |
|------|------|
| `app/[locale]/(main)/categories/page.tsx` | Categories index page — L0 directory with inline L1 names |
| `app/[locale]/(main)/categories/[slug]/` | Category slug pages (L1/L2 grids) |
| `app/[locale]/(main)/categories/@modal/` | Modal intercept route for category overlays |
| `app/[locale]/_components/category-browse-drawer.tsx` | Tab-bar category drawer (`data-testid="mobile-category-drawer"`) |
| `components/mobile/category-nav/filter-sort-bar.tsx` | Filter/Sort bar (`data-testid="mobile-filter-sort-bar"`, `data-testid="mobile-location-chip"`) |
| `components/mobile/category-nav/category-drawer-context.tsx` | `CategoryDrawerProvider`, `useCategoryDrawer` |
| `components/mobile/category-nav/index.ts` | Barrel — `CategoryCirclesSimple`, `CategoryDrawerProvider`, `useCategoryDrawerOptional` |
| `components/grid/product-grid.tsx` | Product grid (`data-slot="product-grid"`, `id="product-grid"`) |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — tab bar, StorefrontShell render | Phase 1 audit green |
| 2 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 3 | Locale set to `en` | URL prefix `/en/` |
| 4 | At least one category with products exists in the database | Seed data or production state |
| 5 | At least one empty category exists (no products) | Seed data or known slug |

---

## Routes Under Test

| Route | Description | Auth |
|-------|-------------|------|
| `/en/categories` | Categories index — L0 directory list | Public |
| `/en/categories/:slug` | Category page — product grid with filters | Public |
| `/en/categories/:slug/:sub` | Subcategory page — filtered product grid | Public |

---

## Known Bugs

| ID | Summary | Severity | Status |
|----|---------|----------|--------|
| CAT-001 | Product cards show L4 subcategory instead of L0 root category label | Medium | Open |

---

## Scenarios

### S4.1 — Categories index page renders L0 list with L1 subcategories

**Goal:** Verify the `/categories` index page renders all L0 categories with L1 subcategory names inline.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en/categories` | `await page.goto('/en/categories')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert at least one L0 category item is visible | `await expect(page.locator('[class*="divide-y"] > *').first()).toBeVisible()` |
| 4 | Assert L0 items have `min-h-touch-lg` interactive target | Verify computed min-height ≥ 48px |
| 5 | Assert L1 subcategory names are visible inline within each L0 item | Text content check on sub-elements |
| 6 | 📸 Screenshot | `categories-index-l0-list` |

**Expected:**
- L0 categories render in a divided list (`divide-y divide-border/60`).
- Each L0 row shows its L1 subcategory names inline.
- Touch targets meet `min-h-touch-lg` (48px).

---

### S4.2 — Category browse drawer opens from tab bar

**Goal:** Verify tapping the Categories tab in the bottom tab bar opens the category browse drawer.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to `/en` (home) | `await page.goto('/en')` |
| 2 | Locate the Categories tab button in bottom tab bar | `page.getByRole('navigation').getByRole('link', { name: /categories/i })` or tab bar Categories button |
| 3 | Tap the Categories tab | `await categoriesTab.tap()` |
| 4 | Wait for drawer to appear | `await expect(page.getByTestId('mobile-category-drawer')).toBeVisible()` |
| 5 | Assert drawer has rounded top | Verify `rounded-t-2xl` class on `DrawerContent` |
| 6 | Assert drawer has max-height constraint | Verify `max-h-dialog` class |
| 7 | 📸 Screenshot | `category-drawer-open` |

**Expected:**
- The category browse drawer slides up from the bottom.
- Drawer content has `rounded-t-2xl` top corners and `max-h-dialog` height constraint.
- Drawer is fully visible and interactive.

---

### S4.3 — Category browse drawer: L0 list with icons and search input

**Goal:** Verify the drawer shows a search input and L0 category list with icons.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Open category drawer (S4.2 steps 1-4) | Drawer visible |
| 2 | Assert search input is visible | `await expect(page.getByTestId('mobile-category-drawer').locator('input[type="search"], input[type="text"]')).toBeVisible()` |
| 3 | Assert search input has `aria-label` | `await expect(searchInput).toHaveAttribute('aria-label')` |
| 4 | Assert search input styling | Verify `h-10 rounded-full border-border-subtle bg-surface-subtle pl-9 pr-9 text-sm` |
| 5 | Assert L0 category items are visible | `page.getByTestId('mobile-category-drawer').locator('[class*="min-h"]')` — at least 3 items |
| 6 | Assert category items have proper styling | Verify `min-h-(--spacing-touch-md) rounded-xl border border-border-subtle bg-background px-3.5` |
| 7 | Assert header has border and padding | Verify `border-b border-border-subtle px-inset py-2.5` on header area |
| 8 | Assert close button exists with `aria-label` | `page.getByTestId('mobile-category-drawer').getByRole('button', { name: /close/i })` |
| 9 | 📸 Screenshot | `category-drawer-l0-list` |

**Expected:**
- Search input is `h-10`, rounded-full, with left/right padding for icon placeholders.
- L0 categories render as rounded-xl bordered items with `min-h-(--spacing-touch-md)` touch targets.
- Each L0 item displays an icon and category name.
- Close button and search input both have ARIA labels.

---

### S4.4 — Category browse drawer: tap L0 shows L1 subcategories

**Goal:** Verify tapping an L0 category in the drawer expands or navigates to show its L1 subcategories.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Open category drawer (S4.2 steps 1-4) | Drawer visible |
| 2 | Identify first L0 category item | `const l0Item = page.getByTestId('mobile-category-drawer').locator('[class*="rounded-xl"][class*="border"]').first()` |
| 3 | Store L0 item text | `const l0Name = await l0Item.textContent()` |
| 4 | Tap L0 item | `await l0Item.tap()` |
| 5 | Wait for L1 subcategories to appear | `await page.waitForTimeout(300)` — allow animation |
| 6 | Assert L1 subcategory items are visible | At least 1 subcategory item rendered |
| 7 | Assert "See All" button is visible | `await expect(page.getByTestId('mobile-category-drawer').locator('text=/see all/i')).toBeVisible()` |
| 8 | Assert "See All" button styling | Verify `min-h-(--spacing-touch-md) rounded-xl border border-foreground bg-foreground text-background` |
| 9 | 📸 Screenshot | `category-drawer-l1-subcategories` |

**Expected:**
- Tapping an L0 category reveals its L1 subcategories.
- A "See All" button is visible with inverted styling (bg-foreground, text-background).
- L1 items are tappable with adequate touch targets.

---

### S4.5 — Category browse drawer: tap L1 navigates to category page

**Goal:** Verify tapping an L1 subcategory in the drawer navigates to `/categories/:slug`.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Open category drawer and expand L0 (S4.4 steps 1-6) | L1 subcategories visible |
| 2 | Identify first L1 subcategory item | `const l1Item = ...` (first subcategory below L0) |
| 3 | Store L1 item text for later assertion | `const l1Name = await l1Item.textContent()` |
| 4 | Tap L1 item | `await l1Item.tap()` |
| 5 | Wait for navigation | `await page.waitForURL('**/categories/**')` |
| 6 | Assert URL matches `/en/categories/:slug` | `expect(page.url()).toMatch(/\/en\/categories\/[^/]+$/)` |
| 7 | Assert drawer is dismissed | `await expect(page.getByTestId('mobile-category-drawer')).not.toBeVisible()` |
| 8 | 📸 Screenshot | `category-drawer-l1-navigation` |

**Expected:**
- Tapping an L1 subcategory closes the drawer and navigates to the category page.
- URL is `/en/categories/:slug` with the correct slug.
- Category page begins loading/rendering.

---

### S4.6 — Category page renders with contextual header

**Goal:** Verify the category page shows `MobileContextualHeader` with the category name.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a known category page | `await page.goto('/en/categories/electronics')` (or known slug) |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert MobileContextualHeader is visible | `await expect(page.locator('[data-testid="mobile-contextual-header"], header').first()).toBeVisible()` |
| 4 | Assert header shows category name | `await expect(header).toContainText(/electronics/i)` (or actual category name) |
| 5 | Assert back button is present | `page.locator('header').getByRole('button', { name: /back/i })` or back arrow |
| 6 | Assert Categories tab in tab bar is active | Active state styling on Categories tab |
| 7 | 📸 Screenshot | `category-page-contextual-header` |

**Expected:**
- `MobileContextualHeader` renders at the top with the category name.
- A back button is available for navigation.
- The Categories tab in the bottom tab bar shows active state.

---

### S4.7 — Category page: filter/sort bar visible

**Goal:** Verify the filter/sort bar renders on the category page.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a category page with products | `await page.goto('/en/categories/electronics')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert filter/sort bar is visible | `await expect(page.getByTestId('mobile-filter-sort-bar')).toBeVisible()` |
| 4 | Assert bar styling | Verify `bg-background px-inset py-2` and `sticky z-20` |
| 5 | Assert Filter button is visible | Button with text "Filter" or filter icon, `flex-1 h-11 rounded-full px-4 gap-2 font-semibold` |
| 6 | Assert Sort button is visible | Button with text "Sort" or sort icon, same styling |
| 7 | Assert bar is sticky on scroll | Scroll page down 300px, assert bar still visible at top |
| 8 | 📸 Screenshot | `category-page-filter-sort-bar` |

**Expected:**
- Filter/sort bar renders with `data-testid="mobile-filter-sort-bar"`.
- Contains Filter and Sort buttons, both `h-11 rounded-full`.
- Bar is sticky and remains visible on scroll.

---

### S4.8 — Category page: filter button opens filter panel

**Goal:** Verify tapping the Filter button opens a filter panel/drawer.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a populated category page | `await page.goto('/en/categories/electronics')` |
| 2 | Wait for filter bar | `await expect(page.getByTestId('mobile-filter-sort-bar')).toBeVisible()` |
| 3 | Tap Filter button | `await page.getByTestId('mobile-filter-sort-bar').getByRole('button', { name: /filter/i }).tap()` |
| 4 | Wait for filter panel to appear | `await page.waitForTimeout(300)` |
| 5 | Assert filter panel/drawer is visible | Filter options rendered (checkboxes, radio buttons, or list items) |
| 6 | Select a filter option | Tap first available filter option |
| 7 | Assert active filter state styling | Verify `bg-selected border-selected-border text-selected-foreground` on applied filter chip |
| 8 | 📸 Screenshot | `category-page-filter-panel-open` |

**Expected:**
- Tapping Filter opens a panel/drawer with filter options.
- Selecting a filter applies active state styling (`bg-selected text-selected-foreground`).
- Filter state persists in the UI.

---

### S4.9 — Category page: sort options work

**Goal:** Verify the Sort button opens sort options and applying a sort reorders results.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a populated category page | `await page.goto('/en/categories/electronics')` |
| 2 | Wait for products to load | `await expect(page.locator('[data-slot="product-grid"]')).toBeVisible()` |
| 3 | Capture initial first product text | `const firstBefore = await page.locator('[data-slot="product-grid"] > *').first().textContent()` |
| 4 | Tap Sort button | `await page.getByTestId('mobile-filter-sort-bar').getByRole('button', { name: /sort/i }).tap()` |
| 5 | Wait for sort options | `await page.waitForTimeout(300)` |
| 6 | Assert sort options are visible | At least 2 sort options (e.g., "Price: Low to High", "Price: High to Low", "Newest") |
| 7 | Select a sort option (e.g., price ascending) | Tap `Price: Low to High` or equivalent |
| 8 | Wait for grid to update | `await page.waitForTimeout(500)` |
| 9 | Assert URL contains sort parameter | `expect(page.url()).toContain('sort=')` or search params updated |
| 10 | 📸 Screenshot | `category-page-sorted` |

**Expected:**
- Sort options appear in a dropdown/drawer.
- Selecting a sort option refreshes the product grid.
- URL or state reflects the active sort.

---

### S4.10 — Category page: location chip visible and interactive

**Goal:** Verify the location chip renders in the filter bar and is tappable.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a category page | `await page.goto('/en/categories/electronics')` |
| 2 | Wait for filter bar | `await expect(page.getByTestId('mobile-filter-sort-bar')).toBeVisible()` |
| 3 | Assert location chip is visible | `await expect(page.getByTestId('mobile-location-chip')).toBeVisible()` |
| 4 | Assert location chip styling | Verify `min-h-10 rounded-full border px-3 text-sm font-medium` |
| 5 | Assert location chip shows a label | `await expect(page.getByTestId('mobile-location-chip')).not.toBeEmpty()` |
| 6 | Tap location chip | `await page.getByTestId('mobile-location-chip').tap()` |
| 7 | Assert location selection UI appears | Modal, drawer, or dropdown for location selection |
| 8 | Assert active location chip styling when active | Verify `border-selected-border bg-selected text-selected-foreground` |
| 9 | 📸 Screenshot | `category-page-location-chip` |

**Expected:**
- Location chip renders with `data-testid="mobile-location-chip"`.
- Chip is `min-h-10 rounded-full` with adequate touch target.
- Tapping opens a location selection UI.
- Active state shows selected styling.

---

### S4.11 — Category page: product grid renders

**Goal:** Verify the product grid renders with correct layout on the category page.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a populated category page | `await page.goto('/en/categories/electronics')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert product grid is visible | `await expect(page.locator('[data-slot="product-grid"]')).toBeVisible()` |
| 4 | Also verify by id | `await expect(page.locator('#product-grid')).toBeVisible()` |
| 5 | Assert grid has 2-column layout on mobile | Verify `grid-cols-2` — computed `grid-template-columns` has 2 columns |
| 6 | Assert grid gap uses CSS variable | Verify `gap-(--product-grid-gap)` |
| 7 | Count product cards | `const count = await page.locator('[data-slot="product-grid"] > *').count()` — assert ≥ 1 |
| 8 | Assert product cards have images | First card contains an `<img>` element |
| 9 | Assert product cards have prices | First card contains price text (currency symbol + number) |
| 10 | 📸 Screenshot | `category-page-product-grid` |

**Expected:**
- Product grid renders with `data-slot="product-grid"` and `id="product-grid"`.
- Mobile layout is 2-column grid (`grid-cols-2`).
- Product cards display images, titles, and prices.

---

### S4.12 — Product cards: verify CAT-001 (category label shows L0 not L4)

**Goal:** Regression check for CAT-001 — product cards should show the L0 root category label, not the L4 deep subcategory.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a category page with known L0 name | `await page.goto('/en/categories/electronics')` |
| 2 | Wait for product grid | `await expect(page.locator('[data-slot="product-grid"]')).toBeVisible()` |
| 3 | Locate first product card | `const card = page.locator('[data-slot="product-grid"] > *').first()` |
| 4 | Extract category label text from card | `const categoryLabel = await card.locator('[class*="category"], [data-slot="category"]').textContent()` |
| 5 | Assert label matches L0 root category | `expect(categoryLabel?.toLowerCase()).toContain('electronics')` (or L0 name) |
| 6 | Assert label does NOT show deep L4 subcategory | Label should be a broad category, not a narrow sub-sub-subcategory |
| 7 | Check 3 more cards for consistency | Repeat assertion on cards 2-4 |
| 8 | 📸 Screenshot | `category-page-cat001-label-check` |

**Expected:**
- Product cards display the L0 root category name (e.g., "Electronics"), **not** a deep L4 subcategory.
- **Bug CAT-001 status:** If cards still show L4 labels, mark as FAIL and document in Findings.

---

### S4.13 — Empty category shows empty state

**Goal:** Verify a category with no products shows an appropriate empty state.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a known empty category | `await page.goto('/en/categories/<empty-slug>')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert no product grid or grid is empty | `await expect(page.locator('[data-slot="product-grid"] > *')).toHaveCount(0)` or empty state element visible |
| 4 | Assert empty state message is visible | Text like "No products found", "No items", or illustration |
| 5 | Assert empty state is centered and readable | Visual check — not broken layout |
| 6 | Assert filter bar is still visible (allows changing filters) | `await expect(page.getByTestId('mobile-filter-sort-bar')).toBeVisible()` |
| 7 | 📸 Screenshot | `category-page-empty-state` |

**Expected:**
- Empty state message or illustration renders when no products exist.
- Layout is not broken — no blank white screen.
- Filter bar remains accessible so users can adjust filters.

---

### S4.14 — Pagination / infinite scroll

**Goal:** Verify additional products load as the user scrolls down (infinite scroll) or taps a "Load more" button.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a category with many products (>20) | `await page.goto('/en/categories/electronics')` |
| 2 | Wait for initial product grid | `await expect(page.locator('[data-slot="product-grid"]')).toBeVisible()` |
| 3 | Count initial products | `const initialCount = await page.locator('[data-slot="product-grid"] > *').count()` |
| 4 | Scroll to bottom of product grid | `await page.locator('[data-slot="product-grid"]').evaluate(el => el.scrollIntoView({ block: 'end' }))` then `await page.evaluate(() => window.scrollBy(0, 500))` |
| 5 | Wait for loading indicator or new products | `await page.waitForTimeout(1000)` |
| 6 | Count products again | `const afterCount = await page.locator('[data-slot="product-grid"] > *').count()` |
| 7 | Assert more products loaded | `expect(afterCount).toBeGreaterThan(initialCount)` OR a "Load more" button is visible |
| 8 | 📸 Screenshot | `category-page-pagination` |

**Expected:**
- Scrolling to the bottom triggers loading of additional products (infinite scroll) or reveals a "Load more" button.
- Product count increases after scroll/load.
- No duplicate products appear.

---

### S4.15 — Back navigation preserves scroll position

**Goal:** Verify navigating to a product detail and pressing back restores the category page scroll position.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a populated category page | `await page.goto('/en/categories/electronics')` |
| 2 | Wait for product grid | `await expect(page.locator('[data-slot="product-grid"]')).toBeVisible()` |
| 3 | Scroll down to reveal lower products | `await page.evaluate(() => window.scrollBy(0, 600))` |
| 4 | Record scroll position | `const scrollBefore = await page.evaluate(() => window.scrollY)` |
| 5 | Tap a visible product card | `await page.locator('[data-slot="product-grid"] > *').nth(3).tap()` |
| 6 | Wait for product detail page | `await page.waitForURL('**/products/**')` or detail page selector |
| 7 | Navigate back | `await page.goBack()` |
| 8 | Wait for category page to reload | `await page.waitForURL('**/categories/**')` |
| 9 | Assert scroll position is restored | `const scrollAfter = await page.evaluate(() => window.scrollY)` — `expect(scrollAfter).toBeGreaterThanOrEqual(scrollBefore - 50)` |
| 10 | 📸 Screenshot | `category-page-scroll-restored` |

**Expected:**
- After navigating back from a product detail page, the category page restores to approximately the same scroll position.
- The user does not lose their place in the product grid.

---

## Findings

| ID | Scenario | Severity | Description | Screenshot |
|----|----------|----------|-------------|------------|
| — | — | — | _No findings yet_ | — |

---

## Summary

| Metric | Value |
|--------|-------|
| Total scenarios | 15 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Not run | 15 |
| Known bugs verified | CAT-001 (pending) |
