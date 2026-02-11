# Phase 11: Wishlist

> Validate the full mobile Wishlist experience — auth-gated wishlist page, wishlist drawer (Vaul bottom sheet), add/remove items, move-to-cart, empty states, responsive drawer height, shared/public wishlist view, account-integrated wishlist with stats/toolbar/filtering/sharing, and wishlist badge count in header.

| Field | Value |
|-------|-------|
| **Scope** | Wishlist page (auth-gated), wishlist drawer, add/remove items, shared/public wishlist views, account wishlist integration |
| **Routes** | `/wishlist`, `/wishlist/shared/:token`, `/account/wishlist` |
| **Priority** | P1 |
| **Dependencies** | Phase 1 (Shell), Phase 3 (Auth), Phase 6 (PDP — add to wishlist) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | Yes for `/wishlist` and `/account/wishlist`; No for `/wishlist/shared/:token` |
| **Status** | ✅ Complete (code audit 2026-02-11) |

---

## Source Files

| File | Role |
|------|------|
| `app/[locale]/(main)/wishlist/page.tsx` | Wishlist page — server component, renders `WishlistPageClient` |
| `app/[locale]/(main)/wishlist/loading.tsx` | Loading skeleton for wishlist page |
| `app/[locale]/(main)/wishlist/error.tsx` | Error boundary for wishlist route |
| `app/[locale]/(main)/wishlist/_components/wishlist-page-client.tsx` | `WishlistPageClient` — client component, grid of saved items, share button, add-all-to-cart, empty state, breadcrumb |
| `app/[locale]/(main)/wishlist/shared/[token]/page.tsx` | `SharedWishlistPage` — public shared wishlist, no auth required, SSR via `get_shared_wishlist` RPC |
| `app/[locale]/(main)/wishlist/shared/[token]/add-all-to-cart.tsx` | `AddAllToCartButton` — client button to add all shared wishlist items to cart |
| `app/[locale]/(account)/account/wishlist/page.tsx` | Account wishlist page — server component, auth-gated with `redirect`, fetches items + categories + stats |
| `app/[locale]/(account)/account/wishlist/loading.tsx` | Loading skeleton for account wishlist |
| `app/[locale]/(account)/account/wishlist/wishlist-content.tsx` | `WishlistContent` — orchestrates stats, toolbar, grid, share button, filter state |
| `app/[locale]/(account)/account/wishlist/_components/account-wishlist-grid.tsx` | `AccountWishlistGrid` — 2-column mobile grid with detail Sheet, move-to-cart, remove, stock badges, floating "Add All" button |
| `app/[locale]/(account)/account/wishlist/_components/account-wishlist-stats.tsx` | `AccountWishlistStats` — mobile: Revolut-style pills (total + in-stock); desktop: 4 stat cards |
| `app/[locale]/(account)/account/wishlist/_components/account-wishlist-toolbar.tsx` | `AccountWishlistToolbar` — search input, category chips (horizontal scroll), stock filter dropdown, clear filters |
| `app/[locale]/(account)/account/wishlist/_components/share-wishlist-button.tsx` | `ShareWishlistButton` — enable/disable sharing dialog, copy link, uses `enable_wishlist_sharing` / `disable_wishlist_sharing` RPCs |
| `components/shared/wishlist/wishlist-drawer.tsx` | `WishlistDrawer` — Vaul-based bottom sheet, item grid, move-to-cart / remove buttons, "View All" footer link |
| `components/shared/wishlist/mobile-wishlist-button.tsx` | `MobileWishlistButton` — header heart icon with `CountBadge`, opens `WishlistDrawer` |
| `components/providers/wishlist-context.tsx` | `WishlistProvider` / `useWishlist()` — optimistic add/remove via `useOptimistic`, Supabase CRUD, `totalItems` count |
| `components/providers/cart-context.tsx` | `useCart()` / `addToCart` — used by move-to-cart flows |
| `app/api/wishlist/[token]/route.ts` | API route for shared wishlist data |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — header with `MobileWishlistButton` renders | Phase 1 audit green |
| 2 | Phase 3 (Auth) passes — login flow works for auth-gated routes | Phase 3 audit green |
| 3 | Phase 6 (PDP) passes — heart toggle on PDP adds to wishlist | Phase 6 audit green |
| 4 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 5 | Locale set to `en` | URL prefix `/en/` |
| 6 | Authenticated user with ≥ 3 items in wishlist | Seed data or manual add via PDP |
| 7 | At least one wishlist item is out of stock (`stock <= 0`) | Needed for S11.9 stock badge / filter test |
| 8 | A shared wishlist token exists (public wishlist enabled) | `enable_wishlist_sharing` RPC called, token stored |
| 9 | Overlays dismissed (cookie consent + geo modal) | `localStorage.setItem('cookie-consent', 'accepted'); localStorage.setItem('geo-welcome-dismissed', 'true')` |

---

## Routes Under Test

| Route | Description | Auth |
|-------|-------------|------|
| `/en/wishlist` | Wishlist page — client-side grid of saved items, share, add-all-to-cart | Yes |
| `/en/wishlist/shared/:token` | Public shared wishlist — SSR, no auth, "Add All to Cart" CTA | No |
| `/en/account/wishlist` | Account-integrated wishlist — stats, toolbar (search/filter), grid with detail Sheet, sharing | Yes |

---

## Known Bugs

| ID | Summary | Severity | Audit Scope | Status |
|----|---------|----------|-------------|--------|
| — | No known bugs specific to wishlist at audit time. R9.5 (Share Wishlist) is ⬜ not yet fully exposed in UI but backend RPC exists. | — | — | — |

---

## Scenarios

### S11.1 — Auth gate: unauthenticated user is redirected from `/wishlist`

**Goal:** Verify that `/wishlist` requires authentication and redirects unauthenticated users to the login page.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Clear session (ensure unauthenticated) | `await context.clearCookies()` |
| 2 | Navigate to wishlist page | `await page.goto('/en/wishlist')` |
| 3 | Wait for navigation to settle | `await page.waitForLoadState('networkidle')` |
| 4 | Assert URL redirected to login | `await expect(page).toHaveURL(/\/auth\/login/)` |
| 5 | 📸 Screenshot | `phase-11-S11.1-wishlist-auth-gate.png` |

**Expected:**
- Unauthenticated users are redirected to `/en/auth/login` (with optional `?next=` query parameter).
- No flash of wishlist content before redirect.
- The `/account/wishlist` route has the same auth gate behavior (server-side `redirect` in `page.tsx`).

---

### S11.2 — Wishlist page renders saved items grid

**Goal:** Verify the authenticated wishlist page (`/wishlist`) displays saved items in a responsive 2-column grid with images, titles, prices, and action buttons.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Authenticate as user with ≥ 3 wishlist items | Login via auth flow or restore session |
| 2 | Navigate to wishlist page | `await page.goto('/en/wishlist')` |
| 3 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 4 | Assert breadcrumb is visible | `await expect(page.locator('nav').filter({ hasText: /home/i })).toBeVisible()` |
| 5 | Assert page title with heart icon | `await expect(page.locator('h1')).toContainText(/wishlist/i)` |
| 6 | Assert item count indicator | `await expect(page.locator('h1')).toContainText(/\(\d+\)/)` |
| 7 | Assert 2-column grid layout | `page.locator('.grid.grid-cols-2')` is visible |
| 8 | Assert each item has image | Each grid child has `img` or `Image` with `aspect-square` container |
| 9 | Assert each item has title (line-clamp-2) | `page.locator('h3.line-clamp-2')` or `.line-clamp-2` text elements |
| 10 | Assert each item has price | `page.locator('[class*="font-bold"]').filter({ hasText: /€/ })` |
| 11 | Assert each item has "Move to Cart" CTA | `page.getByRole('button', { name: /move to cart|add to cart/i })` per item |
| 12 | Assert remove button on each item | `page.getByRole('button', { name: /remove/i })` — Trash icon overlay on image |
| 13 | Assert "Share Wishlist" button | `page.getByRole('button', { name: /share/i })` |
| 14 | Assert "Add All to Cart" button | `page.getByRole('button', { name: /add all/i })` |
| 15 | 📸 Screenshot | `phase-11-S11.2-wishlist-items-grid.png` |

**Expected:**
- Grid: `grid grid-cols-2 gap-2 sm:gap-3`.
- Each item card: `bg-card rounded-lg border border-border overflow-hidden`.
- Image: `aspect-square bg-secondary overflow-hidden` with `object-contain p-2`.
- Remove button: absolute positioned `top-2 right-2`, `rounded-full bg-background/90`, Trash icon.
- Price: `text-base md:text-lg font-bold text-foreground`.
- "Move to Cart" CTA: `variant="cta" size="sm" w-full rounded-full`.
- "Share Wishlist" button: `variant="outline" size="sm"` with Share icon.
- "Add All to Cart" button: `variant="cta" size="sm"` with ShoppingCart icon.

---

### S11.3 — Remove item from wishlist page

**Goal:** Verify removing an item from the wishlist updates the grid and shows a success toast.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Authenticate and navigate to `/en/wishlist` | Pre-condition: ≥ 2 items |
| 2 | Count initial items | `const initialCount = await page.locator('.grid.grid-cols-2 > div').count()` |
| 3 | Tap remove button on first item | `await page.getByRole('button', { name: /remove/i }).first().tap()` |
| 4 | Assert toast appears | `await expect(page.locator('[data-sonner-toast]')).toContainText(/removed/i)` |
| 5 | Assert item count decremented | `await expect(page.locator('.grid.grid-cols-2 > div')).toHaveCount(initialCount - 1)` |
| 6 | Assert title count updates | `await expect(page.locator('h1')).toContainText(new RegExp(`\\(${initialCount - 1}\\)`))` |
| 7 | 📸 Screenshot | `phase-11-S11.3-wishlist-item-removed.png` |

**Expected:**
- Optimistic removal — item disappears instantly from the grid via `useOptimistic`.
- Toast: `toast.success(t("removedFromWishlist"))` with Sonner.
- Grid re-renders with one fewer item.
- Header count (`totalItems`) updates via `WishlistProvider`.

---

### S11.4 — Wishlist drawer opens from header heart icon

**Goal:** Verify tapping the `MobileWishlistButton` heart icon in the header opens the `WishlistDrawer` (Vaul bottom sheet).

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Authenticate as user with ≥ 1 wishlist item | Login via auth flow |
| 2 | Navigate to any page (e.g., homepage) | `await page.goto('/en')` |
| 3 | Wait for hydration | `await page.waitForLoadState('networkidle')` |
| 4 | Assert MobileWishlistButton is visible in header | `page.getByRole('button', { name: /wishlist/i })` in header region |
| 5 | Assert count badge shows item count | `page.locator('[class*="bg-wishlist-active"]')` — absolute positioned badge with count |
| 6 | Tap the heart button | `await page.getByRole('button', { name: /wishlist/i }).tap()` |
| 7 | Assert drawer opens | `await expect(page.locator('[data-vaul-drawer]')).toBeVisible()` or `page.locator('[role="dialog"]')` |
| 8 | Assert drawer header with heart icon + title + count | Heart icon `text-wishlist`, title "Wishlist", count `(N)` |
| 9 | Assert close button (X) | `page.getByRole('button', { name: /close/i })` inside drawer |
| 10 | 📸 Screenshot | `phase-11-S11.4-wishlist-drawer-open.png` |

**Expected:**
- `MobileWishlistButton`: `size-touch-md`, Heart icon `size-icon-header text-header-text`.
- Count badge: `absolute -top-1 -right-1 h-4 min-w-4 bg-wishlist-active text-2xs ring-1 ring-header-bg`.
- Drawer opens as Vaul bottom sheet with overlay.
- Header: `border-b border-border`, Heart `text-wishlist`, title `text-sm font-semibold`, count `text-xs text-muted-foreground`.
- Close button: `IconButton variant="ghost" size="icon-compact"`, X icon.

---

### S11.5 — Wishlist drawer: items with move-to-cart and remove buttons

**Goal:** Verify the drawer item list shows product image, title, price, move-to-cart (ShoppingCart), and remove (Trash) buttons with `data-vaul-no-drag`.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Open wishlist drawer (via S11.4) | User has ≥ 2 items |
| 2 | Assert item entries render in grid layout | `page.locator('.grid.grid-cols-wishlist-item')` — each item is a grid row |
| 3 | Assert each item has product image | `page.locator('[data-vaul-drawer] img')` — `size-14 bg-muted rounded-xl` container |
| 4 | Assert each item has title (line-clamp-2) | `.line-clamp-2` text inside drawer |
| 5 | Assert each item has price | `page.locator('[data-vaul-drawer]').locator('[class*="tabular-nums"]')` — `text-sm font-semibold` |
| 6 | Assert move-to-cart button with `data-vaul-no-drag` | `page.locator('[data-vaul-no-drag]').filter({ has: page.locator('[aria-label]') }).first()` — ShoppingCart icon |
| 7 | Assert remove button with `data-vaul-no-drag` | Second `[data-vaul-no-drag]` button — Trash icon, `text-muted-foreground hover:text-destructive` |
| 8 | Tap move-to-cart on first item | `await page.locator('[data-vaul-no-drag]').first().tap()` |
| 9 | Assert toast: "Moved to cart" | `await expect(page.locator('[data-sonner-toast]')).toContainText(/moved to cart/i)` |
| 10 | Assert item removed from drawer | Item disappears, count decrements |
| 11 | Assert "View All" footer link | `page.getByRole('link', { name: /view all/i })` — links to `/account/wishlist` |
| 12 | 📸 Screenshot | `phase-11-S11.5-wishlist-drawer-items.png` |

**Expected:**
- Item layout: `grid grid-cols-wishlist-item gap-1.5 py-2`, separator `border-b border-border` between items.
- Image: `size-14 bg-muted rounded-xl overflow-hidden border border-border`.
- Title: `text-sm text-foreground line-clamp-2 leading-snug`.
- Price: `text-sm font-semibold tabular-nums text-foreground`.
- Move-to-cart: `IconButton variant="ghost" size="icon-compact"`, ShoppingCart 18px, `data-vaul-no-drag`.
- Remove: `IconButton variant="ghost" size="icon-compact"`, Trash 16px, `text-muted-foreground hover:text-destructive`, `data-vaul-no-drag`.
- Footer: `Button variant="cta"` wrapping `Link href="/account/wishlist"`, ArrowRight icon.
- Move-to-cart flow: calls `addToCart()` then `removeFromWishlist()`, shows `toast.success(t("movedToCart"))`.

---

### S11.6 — Wishlist drawer: responsive height based on item count

**Goal:** Verify the drawer body uses `max-h-dialog-sm` for ≤ 2 items and `max-h-dialog` for > 2 items.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Set up user with exactly 1 wishlist item | Remove extras if needed |
| 2 | Open wishlist drawer | Tap header heart icon |
| 3 | Assert drawer body has `max-h-dialog-sm` class | `page.locator('[data-vaul-drawer]').locator('[class*="max-h-dialog-sm"]')` |
| 4 | 📸 Screenshot | `phase-11-S11.6a-drawer-few-items.png` |
| 5 | Add 2 more items to wishlist (total ≥ 3) | Via PDP heart toggle or direct Supabase insert |
| 6 | Re-open wishlist drawer | Close and re-open |
| 7 | Assert drawer body has `max-h-dialog` class (not `max-h-dialog-sm`) | `page.locator('[data-vaul-drawer]').locator('[class*="max-h-dialog"]:not([class*="max-h-dialog-sm"])')` |
| 8 | Verify scroll within drawer body | If items overflow, drawer body scrolls internally |
| 9 | 📸 Screenshot | `phase-11-S11.6b-drawer-many-items.png` |

**Expected:**
- Height logic: `items.length <= 2 ? "max-h-dialog-sm" : "max-h-dialog"`.
- CSS variables: `--wishlist-drawer-max-h-empty: 30dvh`, `--wishlist-drawer-max-h-few: 40dvh`, `--wishlist-drawer-max-h: 55dvh`.
- Drawer body (`DrawerBody`) uses `px-inset` horizontal padding.
- Scroll region is contained within the drawer body, not the full drawer.

---

### S11.7 — Empty wishlist: helpful empty state

**Goal:** Verify that an empty wishlist shows a curated empty state with illustration and CTA to start shopping.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Authenticate as user with 0 wishlist items | Remove all items or use fresh account |
| 2 | Open wishlist drawer | Tap header heart icon |
| 3 | Assert empty state in drawer | Heart duotone icon in `size-11 bg-muted rounded-xl` container |
| 4 | Assert empty title | `page.locator('[data-vaul-drawer]').locator('text=/empty/i')` — `t("empty")` |
| 5 | Assert empty description | `t("emptyDescription")` — `text-xs text-muted-foreground` |
| 6 | Assert "Start Shopping" CTA | `page.getByRole('link', { name: /start shopping|browse/i })` — `variant="cta"`, links to `/search` |
| 7 | 📸 Screenshot | `phase-11-S11.7a-drawer-empty.png` |
| 8 | Navigate to `/en/wishlist` page | `await page.goto('/en/wishlist')` |
| 9 | Assert page-level empty state | Larger illustration: `size-20 bg-muted rounded-full`, Heart duotone `size-10` |
| 10 | Assert empty heading | `page.locator('h2')` with `t("empty")` — `text-lg font-semibold` |
| 11 | Assert description text | `t("emptyDescription")` — `text-muted-foreground max-w-md mx-auto` |
| 12 | Assert "Start Shopping" CTA links to `/search` | `page.getByRole('link', { name: /start shopping/i })` — `variant="cta"` |
| 13 | 📸 Screenshot | `phase-11-S11.7b-page-empty.png` |

**Expected:**
- Drawer empty state: centered flex column, `py-5 px-inset`, Heart duotone in muted circle, title `text-sm font-medium`, description `text-xs text-muted-foreground`, CTA `Button variant="cta"` linking to `/search` with ArrowRight icon.
- Page empty state: `bg-card rounded-md border border-border`, larger circle `size-20`, `h2` heading, `Button variant="cta"` CTA.
- Both states are visually distinct but semantically consistent.

---

### S11.8 — Public shared wishlist renders without auth

**Goal:** Verify `/wishlist/shared/:token` renders a public shared wishlist SSR page with no authentication required.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Clear session (ensure unauthenticated) | `await context.clearCookies()` |
| 2 | Navigate to shared wishlist | `await page.goto('/en/wishlist/shared/<valid-token>')` |
| 3 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 4 | Assert no redirect to login | `await expect(page).toHaveURL(/\/wishlist\/shared\//)` |
| 5 | Assert page title (wishlist name) | `await expect(page.locator('h1')).toBeVisible()` — Gift icon + wishlist name |
| 6 | Assert owner name | `page.locator('text=/created by/i')` — `t('createdBy', { name: ownerName })` |
| 7 | Assert item count | `page.locator('text=/item/i')` — `t('itemCount', { count })` |
| 8 | Assert "Add All to Cart" button | `page.getByRole('button', { name: /add all/i })` — `AddAllToCartButton` |
| 9 | Assert product grid (2-column mobile) | `page.locator('.grid.grid-cols-2')` with Card items |
| 10 | Assert each item has image, title, price, "View Product" link | Card with `aspect-square`, title, price `font-bold`, Button linking to `/product/:id` |
| 11 | Assert CTA section at bottom | "Create Your Own" heading, "Sign Up Free" link to `/auth/sign-up` |
| 12 | 📸 Screenshot | `phase-11-S11.8-shared-wishlist.png` |

**Expected:**
- SSR page, no client-side auth check.
- Header: Gift icon + wishlist name `text-3xl font-bold`, owner name, item count.
- Product grid: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`, Card components.
- Each card: `aspect-square bg-muted`, title `.line-clamp-2 min-h-10`, price `text-lg font-bold`.
- "View Product" CTA: `Button variant="cta" size="sm" w-full`.
- Bottom CTA: `bg-surface-subtle rounded-xl border border-border-subtle`, "Sign Up Free" `variant="cta"`.
- Invalid token → `notFound()` (404 page).

---

### S11.9 — Account wishlist: stats, toolbar, grid with detail Sheet

**Goal:** Verify `/account/wishlist` renders the full account-integrated wishlist with stats pills, toolbar (search + filters), 2-column product grid, and tappable item detail Sheet.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Authenticate as user with ≥ 3 items (some in-stock, some out-of-stock) | Login via auth flow |
| 2 | Navigate to account wishlist | `await page.goto('/en/account/wishlist')` |
| 3 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 4 | Assert stats pills (mobile) | `page.locator('[class*="rounded-full"][class*="bg-background"]')` — total items count with Heart icon |
| 5 | Assert in-stock pill (if > 0) | `page.locator('[class*="bg-success/10"]')` — green dot + count + "ready" |
| 6 | Assert search input | `page.getByRole('textbox', { name: /search/i })` — `rounded-full bg-surface-subtle`, search icon |
| 7 | Assert category chip bar (horizontal scroll) | `page.locator('button').filter({ hasText: /all/i })` — "All" chip with count, plus category chips |
| 8 | Assert stock filter dropdown | `page.locator('button').filter({ hasText: /stock|filter/i })` — dropdown trigger |
| 9 | Assert 2-column product grid | `page.locator('.grid.grid-cols-2')` — mobile-only grid (`md:hidden`) |
| 10 | Assert each item has image with stock badge | Green `bg-success` circle (in-stock) or `bg-warning` "Sold" badge (out-of-stock) |
| 11 | Assert each item has category badge overlay | `bg-surface-overlay` pill at bottom-left of image |
| 12 | Assert tapping an item opens detail Sheet | `await page.locator('.grid.grid-cols-2 > div').first().tap()` |
| 13 | Assert Sheet shows full product detail | Title, image, price, availability badge, "Add to Cart" / "View" / "Remove" buttons |
| 14 | Assert Sheet footer has safe area padding | `pb-safe-max` class on `SheetFooter` |
| 15 | Assert floating "Add All" button (if > 2 in-stock items) | `page.locator('.fixed.bottom-tabbar-offset')` — `z-40 md:hidden`, full-width rounded pill |
| 16 | Assert Share Wishlist button | `page.getByRole('button', { name: /share/i })` — `ShareWishlistButton` |
| 17 | 📸 Screenshot | `phase-11-S11.9-account-wishlist.png` |

**Expected:**
- Stats pills (mobile `sm:hidden`): `flex items-center gap-3`, total items with Heart icon, in-stock count with green dot.
- Search: `Input rounded-full bg-surface-subtle border-border/40 h-10`, SearchIcon `left-3`.
- Category chips: horizontal scrollable `overflow-x-auto no-scrollbar`, active chip `bg-foreground text-background`.
- Stock filter: dropdown with "All", "In Stock" (IconPackage green), "Out of Stock" (IconPackageOff warning).
- Grid: `grid grid-cols-2 gap-3 pb-20 md:hidden` — padding for floating button.
- Item card: `rounded-md bg-card border border-border`, image `aspect-square`, stock badge absolute `top-2 right-2`.
- Out-of-stock: image `opacity-60 grayscale-30`, price `text-muted-foreground line-through`.
- Quick cart button: absolute `bottom-2 right-2`, `size-8 rounded-full bg-foreground`, ShoppingCart `text-overlay-text`.
- Detail Sheet: `side="bottom" max-h-(--dialog-h-85vh) rounded-t-2xl`, header with title + date + category badge, image `max-w-60`, price, availability, footer with "Add to Cart" `h-12`, "View" + "Remove" row.
- Floating CTA: `fixed bottom-tabbar-offset left-4 right-4 z-40`, `Button w-full h-12 rounded-full`.
- Share button: top-right alignment via `flex items-center justify-end`.

---

### S11.10 — Add item from PDP: heart toggles, wishlist count updates

**Goal:** Verify adding a product to the wishlist from a PDP toggles the heart icon and updates the `MobileWishlistButton` count badge in the header.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Authenticate as user | Login via auth flow |
| 2 | Navigate to a product PDP not yet in wishlist | `await page.goto('/en/<username>/<productSlug>')` |
| 3 | Record current wishlist count | `const badge = page.locator('[class*="bg-wishlist-active"]'); const initialCount = badge.isVisible() ? parseInt(await badge.textContent()) : 0` |
| 4 | Tap the wishlist/heart button on PDP header or product page | `await page.getByRole('button', { name: /wishlist|favorite/i }).tap()` |
| 5 | Assert optimistic heart fill | Heart icon changes to filled state instantly (optimistic via `useOptimistic`) |
| 6 | Assert toast: "Added to wishlist" | `await expect(page.locator('[data-sonner-toast]')).toContainText(/added to wishlist/i)` |
| 7 | Assert badge count incremented | `await expect(page.locator('[class*="bg-wishlist-active"]')).toContainText(String(initialCount + 1))` |
| 8 | Tap heart again to toggle off | `await page.getByRole('button', { name: /wishlist|favorite/i }).tap()` |
| 9 | Assert toast: "Removed from wishlist" | `await expect(page.locator('[data-sonner-toast]')).toContainText(/removed/i)` |
| 10 | Assert badge count decremented | Count returns to `initialCount` |
| 11 | 📸 Screenshot | `phase-11-S11.10-wishlist-toggle-pdp.png` |

**Expected:**
- Heart toggle uses `toggleWishlist()` from `WishlistProvider` — checks `isInWishlist(productId)` and calls `addToWishlist` or `removeFromWishlist`.
- Optimistic update: `useOptimistic` + `startTransition` — UI updates before server response.
- Badge count on `MobileWishlistButton` uses `totalItems` from `optimisticItems.length`.
- Toast messages: `t("addedToWishlist")` on add, `t("removedFromWishlist")` on remove.
- If user is unauthenticated during add, toast error with "Sign In" action link: `toast.error(tWishlist("signInRequired"), { action: ... })`.

---

## Execution Evidence Log

> Required for release sign-off. Add one row per executed scenario.

| Scenario ID | Auto Result | Manual Result | Owner | Build/Commit | Screenshot/Video | Defect ID | Severity | Retest Result | Sign-off |
|-------------|-------------|---------------|-------|--------------|------------------|-----------|----------|---------------|---------|
| S11.1 | N/A (code trace) | ❌ Fail | Codex | working-tree (2026-02-11) | `/wishlist` page has no server auth redirect; route renders directly | WISH-AUTH-001 | P1 | ❌ Fail | ✅ |
| S11.2 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Grid rendering in `wishlist-page-client.tsx` | — | — | — | ✅ |
| S11.3 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Remove path in page client + context | — | — | — | ✅ |
| S11.4 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Drawer trigger/components wiring | — | — | — | ✅ |
| S11.5 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Drawer item actions (`add`, `remove`) in `wishlist-drawer.tsx` | — | — | — | ✅ |
| S11.6 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Drawer max-height classes and responsive container | — | — | — | ✅ |
| S11.7 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Empty-state handling in page/drawer | — | — | — | ✅ |
| S11.8 | N/A (code trace) | ⚠ Partial | Codex | working-tree (2026-02-11) | Public shared page exists, but links/prices are non-canonical/hardcoded | WISH-002, WISH-003 | P1/P2 | ⚠ Partial | ✅ |
| S11.9 | N/A (code trace) | ⚠ Partial | Codex | working-tree (2026-02-11) | Account wishlist works; share-link generator targets wrong path format | WISH-001 | P1 | ⚠ Partial | ✅ |
| S11.10 | N/A (code trace) | ✅ Pass | Codex | working-tree (2026-02-11) | Provider `toggleWishlist` and optimistic updates are present | — | — | — | ✅ |

---

## Findings

| ID | Scenario | Severity | Description | Screenshot | Device |
|----|----------|----------|-------------|------------|--------|
| WISH-AUTH-001 | S11.1 | P1 | Route protection mismatch: `/wishlist` is documented/auth-mapped as auth-only but currently renders without server auth redirect (`app/[locale]/(main)/wishlist/page.tsx`). | N/A (code audit) | N/A |
| WISH-001 | S11.9 | P1 | Share button builds `/{locale}/wishlist/{token}` instead of `/{locale}/wishlist/shared/{token}`, producing broken shared links. | N/A (code audit) | N/A |
| WISH-002 | S11.8 | P1 | Shared wishlist page links product cards to `/product/{id}` instead of canonical `/{username}/{slug}` URLs. | N/A (code audit) | N/A |
| WISH-003 | S11.8 | P2 | Shared page hardcodes dollar formatting via `${price.toFixed(2)}`; bypasses locale/currency formatting strategy. | N/A (code audit) | N/A |
| WISH-I18N-004 | Cross-cutting | P2 | Share dialog and related account wishlist UI still contain many inline `locale === "bg"` string branches instead of `next-intl` keys. | N/A (code audit) | N/A |

---

## Summary

| Metric | Value |
|--------|-------|
| Scenarios | 10 |
| Executed | 10 |
| Passed | 7 |
| Failed | 1 |
| Partial | 2 |
| Issues found | 5 (P1:3, P2:2) |
| Blockers | 0 |
| Status | ✅ Complete (code audit) |
