# Phase 6: Product Detail Page

> Validate the full mobile Product Detail Page experience — product-specific sticky header, edge-to-edge image gallery with swipe and fullscreen viewer, price display, seller preview card, product attributes/specs, reviews, category-adaptive bottom bar CTAs, wishlist, similar items, recently viewed tracking, share functionality, and tab bar suppression.

| Field | Value |
|-------|-------|
| **Scope** | Full PDP mobile layout — product-specific header, image gallery with swipe/fullscreen, price, seller card, attributes, reviews, add-to-cart CTA, add-to-wishlist, recently viewed |
| **Routes** | `/:username/:productSlug` |
| **Priority** | P0 |
| **Dependencies** | Phase 1 (Shell), Phase 5 (Search — entry point to PDP) |
| **Devices** | Pixel 5 (393×851) · iPhone 12 (390×844) |
| **Auth Required** | No (public page; wishlist/review/cart actions may require auth) |
| **Status** | ✅ Complete (code audit rerun 2026-02-11) |

---

## Source Files

| File | Role |
|------|------|
| `app/[locale]/[username]/[productSlug]/page.tsx` | PDP server page — data fetching, SEO metadata, JSON-LD, `generateStaticParams` for ISR |
| `app/[locale]/[username]/[productSlug]/loading.tsx` | Loading skeleton shown during PDP data fetch |
| `app/[locale]/[username]/[productSlug]/error.tsx` | Per-route error boundary |
| `app/[locale]/[username]/layout.tsx` | Parent layout wrapping `[username]` routes |
| `app/[locale]/[username]/[productSlug]/_components/product-page-layout.tsx` | `ProductPageLayout` — splits mobile (`MobileProductSingleScroll`, `lg:hidden`) vs desktop (`PageShell hidden lg:block`) |
| `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-product-single-scroll.tsx` | `MobileProductSingleScroll` — main mobile PDP wrapper, single continuous scroll layout |
| `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-gallery.tsx` | `MobileGallery` — edge-to-edge swipeable gallery, floating buttons, thumbnails, fullscreen viewer |
| `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-bottom-bar.tsx` | `MobileBottomBar` — fixed sticky CTA bar (Chat + "Add · €price"), category-adaptive |
| `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-seller-preview-card.tsx` | `MobileSellerPreviewCard` — compact seller info card with rating, response time, "View Profile" |
| `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-trust-sections.tsx` | `MobileSafetyTips`, `MobileReportButton` — trust and safety modules |
| `app/[locale]/[username]/[productSlug]/_components/mobile/seller-profile-drawer.tsx` | `SellerProfileDrawer` — full seller profile slide-up drawer |
| `components/layout/header/mobile/product-header.tsx` | `MobileProductHeader` — sticky top-0, `[Back] [Avatar · Title] [Wishlist] [Share]` |
| `app/[locale]/[username]/[productSlug]/_components/pdp/product-header-sync.tsx` | `ProductHeaderSync` — syncs product data to mobile header |
| `app/[locale]/[username]/[productSlug]/_components/pdp/product-header.tsx` | `ProductHeader` — price, title, condition badge, negotiable indicator |
| `app/[locale]/[username]/[productSlug]/_components/pdp/meta-row.tsx` | `MetaRow` — category breadcrumb, time ago, view count |
| `app/[locale]/[username]/[productSlug]/_components/pdp/hero-specs.tsx` | `HeroSpecs` — top 4 key specs in compact grid |
| `app/[locale]/[username]/[productSlug]/_components/pdp/specifications-list.tsx` | `SpecificationsList` — full attribute table |
| `app/[locale]/[username]/[productSlug]/_components/pdp/product-description.tsx` | `ProductDescription` — description with expand/collapse |
| `app/[locale]/[username]/[productSlug]/_components/pdp/delivery-options.tsx` | `DeliveryOptions` — pickup only / free shipping badges |
| `app/[locale]/[username]/[productSlug]/_components/pdp/shipping-returns-info.tsx` | `ShippingReturnsInfo` — shipping & returns policy |
| `app/[locale]/[username]/[productSlug]/_components/pdp/similar-items-grid.tsx` | `SimilarItemsGrid` — related products grid |
| `app/[locale]/[username]/[productSlug]/_components/pdp/recently-viewed-tracker.tsx` | `RecentlyViewedTracker` — records product view to localStorage |
| `app/[locale]/[username]/[productSlug]/_components/pdp/customer-reviews-hybrid.tsx` | `CustomerReviewsHybrid` — rating summary + review cards |
| `app/[locale]/[username]/[productSlug]/_components/pdp/write-review-dialog.tsx` | `WriteReviewDialog` — auth-gated review submission |
| `app/[locale]/[username]/[productSlug]/_components/pdp/product-social-proof.tsx` | `ProductSocialProof` — view count, favorites badge |
| `app/[locale]/[username]/[productSlug]/_components/pdp/trust-badges.tsx` | `TrustBadges` — platform trust indicators |
| `app/[locale]/[username]/[productSlug]/_components/pdp/view-tracker.tsx` | `ViewTracker` — increments server-side view count |
| `components/providers/wishlist-context.tsx` | `useWishlist()` — `isInWishlist`, `toggleWishlist` |
| `components/providers/cart-context.tsx` | `useCart()` — `addToCart` |

---

## Prerequisites

| # | Condition | How to verify |
|---|-----------|---------------|
| 1 | Phase 1 (Shell) passes — StorefrontShell, headers render correctly | Phase 1 audit green |
| 2 | Phase 5 (Search) passes — can navigate to PDP from search results | Phase 5 audit green |
| 3 | Device viewport set to Pixel 5 (393×851) or iPhone 12 (390×844) | Playwright `use: { viewport }` |
| 4 | Locale set to `en` | URL prefix `/en/` |
| 5 | At least one product with multiple images exists | Seed data or known `/:username/:productSlug` |
| 6 | At least one product with customer reviews exists | Seed data or known slug |
| 7 | At least one product in `automotive` or `real-estate` category exists | Needed for S6.11 (category-adaptive CTAs) |
| 8 | Overlays dismissed (cookie consent + geo modal) | `localStorage.setItem('cookie-consent', 'accepted'); localStorage.setItem('geo-welcome-dismissed', 'true')` |

---

## Routes Under Test

| Route | Description | Auth |
|-------|-------------|------|
| `/en/:username/:productSlug` | Product Detail Page — full mobile PDP with gallery, details, CTAs | Public |

---

## Known Bugs

| ID | Summary | Severity | Audit Scope | Status |
|----|---------|----------|-------------|--------|
| FE-UX-006 | Invalid `touch-action-*` TW4 utilities + bracket `aspect-[...]` in quick view components. Verify PDP uses standard `aspect-square` instead of bracket syntax. | High | Gallery images | 🟡 Open |

---

## Scenarios

### S6.1 — PDP loads with MobileProductHeader (sticky, product title, seller avatar)

**Goal:** Verify the PDP renders the `MobileProductHeader` with correct sticky positioning, product title, seller avatar, and action buttons.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a known product PDP | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 3 | Assert MobileProductHeader is visible | `await expect(page.locator('header').filter({ has: page.locator('h1') }).first()).toBeVisible()` |
| 4 | Assert header has sticky positioning | Verify `sticky top-0 z-50` — computed `position: sticky`, `top: 0px` |
| 5 | Assert header has safe area padding | Verify `pt-safe` class on `<header>` |
| 6 | Assert header height uses `h-(--control-primary)` | Verify computed height matches `--control-primary` token |
| 7 | Assert header shows product title in `<h1>` | `await expect(page.locator('header h1')).toContainText(/<product-title>/i)` |
| 8 | Assert header shows seller avatar | `page.locator('header').locator('img, [class*="avatar"]').first()` is visible |
| 9 | Assert header has back button with aria-label | `page.locator('header').getByRole('button', { name: /back/i })` or `aria-label` containing "back" |
| 10 | Assert header has wishlist button | `page.locator('header').getByRole('button', { name: /wishlist|favorite/i })` |
| 11 | Assert header has share button | `page.locator('header').getByRole('button', { name: /share/i })` |
| 12 | Assert header is hidden at `md:` breakpoint | Verify `md:hidden` class — header only renders on mobile |
| 13 | 📸 Screenshot | `phase-6-S6.1-product-header.png` |

**Expected:**
- `MobileProductHeader` renders with `sticky top-0 z-50 border-b border-border-subtle bg-background pt-safe md:hidden`.
- Height is `h-(--control-primary)`.
- Layout: `[Back] [Avatar · Title] [Wishlist] [Share]`.
- Product title is an `<h1>` with `text-sm font-semibold leading-tight truncate`.
- All action buttons have `aria-label` attributes.

---

### S6.2 — Mobile gallery: swipe between images (snap-x snap-mandatory)

**Goal:** Verify the `MobileGallery` renders edge-to-edge with swipeable images using CSS scroll snapping.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product with multiple images | `await page.goto('/en/<username>/<multi-image-product>')` |
| 2 | Wait for gallery to render | `await expect(page.locator('[class*="snap-x"]')).toBeVisible()` |
| 3 | Assert gallery is full-width (edge-to-edge) | Computed width equals viewport width (393px or 390px) |
| 4 | Assert gallery uses snap scroll | Verify `overflow-x-auto snap-x snap-mandatory scrollbar-hide` on the gallery container |
| 5 | Assert each image is full-width | Each child has `flex-none w-full snap-center` with `aspect-square` |
| 6 | Assert first image has `priority` loading | `<img>` for first image has `priority` attribute |
| 7 | Count total images | `const imageCount = await page.locator('[class*="snap-x"] > div').count()` — assert ≥ 2 |
| 8 | Swipe left on the gallery | `await page.locator('[class*="snap-x"]').evaluate(el => el.scrollBy({ left: el.offsetWidth, behavior: 'smooth' }))` |
| 9 | Wait for snap to settle | `await page.waitForTimeout(500)` |
| 10 | Assert scroll position changed | `const scrollLeft = await page.locator('[class*="snap-x"]').evaluate(el => el.scrollLeft)` — assert > 0 |
| 11 | 📸 Screenshot | `phase-6-S6.2-gallery-swipe.png` |

**Expected:**
- Gallery fills full viewport width with no horizontal margins.
- Images display in `aspect-square` containers.
- Swiping snaps cleanly to the next image.
- `bg-surface-gallery` background on the gallery container.

---

### S6.3 — Mobile gallery: image counter visible (e.g. "1/5")

**Goal:** Verify the image counter overlay renders in the bottom-right of the gallery.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product with multiple images | `await page.goto('/en/<username>/<multi-image-product>')` |
| 2 | Wait for gallery | `await expect(page.locator('[class*="snap-x"]')).toBeVisible()` |
| 3 | Assert image counter is visible | `await expect(page.locator('[class*="bg-surface-overlay"]').filter({ hasText: /\d+\/\d+/ })).toBeVisible()` |
| 4 | Assert counter reads "1/N" initially | `await expect(counter).toHaveText(/^1\//)` |
| 5 | Assert counter styling | Verify `bg-surface-overlay text-overlay-text text-xs font-medium px-2 py-1 rounded` |
| 6 | Assert counter is positioned bottom-right | Verify `absolute bottom-3 right-3 z-20` |
| 7 | Swipe to second image | Scroll gallery by one viewport width |
| 8 | Wait for counter update | `await page.waitForTimeout(500)` |
| 9 | Assert counter reads "2/N" | `await expect(counter).toHaveText(/^2\//)` |
| 10 | 📸 Screenshot | `phase-6-S6.3-image-counter.png` |

**Expected:**
- Counter renders as `bg-surface-overlay text-overlay-text` pill at bottom-right of gallery.
- Counter updates reactively as user swipes between images.
- Counter is only visible when `images.length > 1`.

---

### S6.4 — Mobile gallery: tap image opens fullscreen viewer

**Goal:** Verify tapping a gallery image opens the fullscreen image viewer overlay.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product with images | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Wait for gallery | `await expect(page.locator('[class*="snap-x"]')).toBeVisible()` |
| 3 | Tap the main gallery image | `await page.locator('[class*="snap-x"] [class*="aspect-square"]').first().tap()` |
| 4 | Wait for fullscreen viewer | `await page.waitForTimeout(300)` |
| 5 | Assert fullscreen overlay is visible | `await expect(page.locator('[class*="fixed inset-0"][class*="z-60"]')).toBeVisible()` |
| 6 | Assert viewer has `bg-surface-gallery` background | Verify class on the fixed overlay |
| 7 | Assert close button is visible | `page.locator('[class*="fixed inset-0"]').getByRole('button', { name: /close/i })` |
| 8 | Assert close button uses `size-10 rounded-full bg-surface-overlay` | Verify computed styles |
| 9 | Assert image counter in viewer header | `page.locator('[class*="fixed inset-0"]').locator('text=/\\d+ \\/ \\d+/')` |
| 10 | Assert thumbnail strip at bottom | `page.locator('[class*="fixed inset-0"]').locator('button[class*="size-14"]')` — count matches image count |
| 11 | Assert viewer image uses `object-contain` (not cover) | Verify class on `<img>` in viewer |
| 12 | Tap close button | `await closeButton.tap()` |
| 13 | Assert viewer is dismissed | `await expect(page.locator('[class*="fixed inset-0"][class*="z-60"]')).not.toBeVisible()` |
| 14 | 📸 Screenshot | `phase-6-S6.4-fullscreen-viewer.png` |

**Expected:**
- Tapping gallery opens a `fixed inset-0 z-60` fullscreen viewer.
- Viewer shows image with `object-contain` (full image visible, no crop).
- Close button, image counter, and thumbnail strip are all accessible.
- Thumbnails in viewer use `size-14 rounded-lg` with active ring styling.

---

### S6.5 — Mobile gallery: floating wishlist button (heart icon)

**Goal:** Verify the floating wishlist/heart button renders in the gallery and toggles state.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Wait for gallery | `await expect(page.locator('[class*="snap-x"]')).toBeVisible()` |
| 3 | Assert floating wishlist button is visible in gallery | `page.locator('[class*="bg-surface-floating"]').getByRole('button', { name: /wishlist|favorite/i })` |
| 4 | Assert button uses `size-touch-lg rounded-full bg-surface-floating shadow-sm` | Verify classes |
| 5 | Assert button has `aria-label` | Contains "Add to wishlist" or equivalent i18n text |
| 6 | Assert heart icon is NOT filled initially (not wishlisted) | Icon does not have `fill-current` class |
| 7 | Tap the wishlist button | `await wishlistBtn.tap()` |
| 8 | Assert wishlist state toggles | Button background changes to `bg-destructive text-destructive-foreground`, heart icon gets `fill-current` |
| 9 | Assert `aria-label` updates | Now reads "Remove from wishlist" or equivalent |
| 10 | 📸 Screenshot | `phase-6-S6.5-wishlist-toggled.png` |

**Expected:**
- Floating wishlist button at top-right of gallery with `size-touch-lg rounded-full bg-surface-floating shadow-sm`.
- Toggle changes button to `bg-destructive text-destructive-foreground` with filled heart.
- `aria-label` changes between add/remove states.

---

### S6.6 — Price display: correct currency and formatting

**Goal:** Verify the product price renders correctly with proper currency formatting and locale-aware number format.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product with known price | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Wait for content section | `await expect(page.locator('[class*="bg-card"]')).toBeVisible()` |
| 3 | Locate the `ProductHeader` price area | `page.locator('[class*="bg-card"]').locator('text=/€/')` or price element |
| 4 | Assert price includes currency symbol (€) | `await expect(priceEl).toContainText('€')` |
| 5 | Assert price format matches `en-IE` locale convention | e.g., "€29.99" — decimal separator is `.`, EUR currency |
| 6 | Assert price is visually prominent | Font size/weight indicates primary price element |
| 7 | Assert condition badge is visible | Badge with condition text (e.g., "New", "Like New", "Good") |
| 8 | Assert negotiable indicator if applicable | "Negotiable" label visible when `is_negotiable` is true |
| 9 | 📸 Screenshot | `phase-6-S6.6-price-display.png` |

**Expected:**
- Price formatted via `Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' })`.
- EUR uses 2 decimal places; BGN uses 0 (locale-dependent).
- Condition badge and negotiable indicator are visible where applicable.

---

### S6.7 — Seller preview card: name, avatar, rating, "View Profile" button

**Goal:** Verify the `MobileSellerPreviewCard` renders correctly with all seller information.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Scroll to the seller card section | `await page.locator('[class*="bg-card"][class*="rounded-2xl"]').scrollIntoViewIfNeeded()` |
| 3 | Assert seller card is visible | `await expect(page.locator('[class*="bg-card"][class*="rounded-2xl"]').filter({ hasText: /profile/i })).toBeVisible()` |
| 4 | Assert seller card styling | Verify `bg-card rounded-2xl border border-border p-4` |
| 5 | Assert seller avatar is visible | `page.locator('[class*="rounded-2xl"]').locator('img, [class*="avatar"]')` |
| 6 | Assert seller name is visible | Text content matches expected seller display name |
| 7 | Assert seller rating is visible (if present) | Star icon + rating number rendered |
| 8 | Assert response time label (if present) | Text like "Responds within 1 hour" or equivalent |
| 9 | Assert "View Profile" button is visible | `page.locator('[class*="rounded-2xl"]').getByRole('button', { name: /profile/i })` |
| 10 | Tap "View Profile" button | `await viewProfileBtn.tap()` |
| 11 | Assert seller profile drawer opens | Drawer or slide-up panel with extended seller info visible |
| 12 | 📸 Screenshot | `phase-6-S6.7-seller-card.png` |

**Expected:**
- Seller card renders as `bg-card rounded-2xl border border-border p-4`.
- Shows avatar, seller name, verified badge (if seller is verified), star rating, review count, response time.
- "View Profile" opens `SellerProfileDrawer` with full seller details and product listings.

---

### S6.8 — Product attributes/specs section (HeroSpecs, SpecificationsList)

**Goal:** Verify the hero specs grid and full specifications list render in the content scroll.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product with attributes | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Scroll to hero specs section | Locate specs area within `[class*="bg-card"]` content |
| 3 | Assert `HeroSpecs` grid is visible (if product has hero specs) | Grid of up to 4 key specs in compact layout |
| 4 | Assert hero specs variant is `mobile` | Verify mobile-optimized layout |
| 5 | Scroll to full specifications | Continue scrolling below hero specs |
| 6 | Assert `SpecificationsList` is visible | Table/list of attribute key-value pairs |
| 7 | Assert at least one spec row is present | `const specCount = await ... count()` — assert ≥ 1 |
| 8 | Assert spec labels and values are readable | Font size ≥ 12px, adequate contrast |
| 9 | 📸 Screenshot | `phase-6-S6.8-product-specs.png` |

**Expected:**
- `HeroSpecs` shows top 4 specs in a compact mobile grid (if `viewModel.heroSpecs.length > 0`).
- `SpecificationsList` renders all `viewModel.itemSpecifics.details` as key-value pairs.
- Both sections are wrapped in `px-4` padding within the `bg-card` content area.

---

### S6.9 — Product description section (ProductDescription)

**Goal:** Verify the product description renders with expand/collapse behavior for long text.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product with a description | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Scroll to the description section | Locate `ProductDescription` within the scrolling content |
| 3 | Assert description text is visible | `await expect(descriptionEl).not.toBeEmpty()` |
| 4 | Assert description is within `px-4` padding | Verify horizontal padding matches other sections |
| 5 | If description is long, assert "Show more" / expand control exists | Tap to reveal full text |
| 6 | If expanded, assert "Show less" / collapse control exists | Tap to collapse back |
| 7 | Assert text is readable | Font size ≥ 14px for body, line height adequate |
| 8 | 📸 Screenshot | `phase-6-S6.9-description.png` |

**Expected:**
- Description text renders within `px-4` padding.
- Long descriptions have an expand/collapse toggle.
- Text uses standard body typography (readable without zooming).

---

### S6.10 — Add to Cart CTA: MobileBottomBar sticky at bottom

**Goal:** Verify the `MobileBottomBar` renders fixed at the bottom with the default "Chat + Add · €price" CTA pattern.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a standard product (non-automotive, non-real-estate) | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Assert bottom bar is visible | `await expect(page.locator('[class*="fixed bottom-0"]').filter({ hasText: /add|cart/i })).toBeVisible()` |
| 3 | Assert bottom bar positioning | Verify `fixed bottom-0 left-0 right-0 z-50` |
| 4 | Assert bottom bar styling | Verify `border-t border-border bg-background pb-safe` |
| 5 | Assert Chat button is visible (left CTA) | `page.locator('[class*="fixed bottom-0"]').getByRole('button', { name: /chat/i })` |
| 6 | Assert Chat button has MessageCircle icon | SVG icon within the button |
| 7 | Assert Add to Cart button is visible (right CTA) | `page.locator('[class*="fixed bottom-0"]').getByRole('button', { name: /add/i })` |
| 8 | Assert Add to Cart button includes price | Button text matches `"Add · €<price>"` format |
| 9 | Assert Add to Cart button uses `flex-[1.5]` (wider than Chat) | Verify computed flex ratio |
| 10 | Assert bottom bar has `pb-safe` for safe area | Verify padding-bottom accounts for device home indicator |
| 11 | Scroll page up and down | Bottom bar remains fixed in viewport |
| 12 | Tap "Add to Cart" | `await addToCartBtn.tap()` |
| 13 | Assert cart state updates | Cart badge in header increments or confirmation feedback shown |
| 14 | 📸 Screenshot | `phase-6-S6.10-bottom-bar-default.png` |

**Expected:**
- Bottom bar is `fixed bottom-0` and always visible regardless of scroll position.
- Default layout: `[Chat (outline, flex-1)] [Add · €price (primary, flex-[1.5])]`.
- Both buttons use `size="primary"` and `gap-2` for icon spacing.
- `pb-safe` ensures content clears home indicator on notched devices.

---

### S6.11 — Category-adaptive CTAs: automotive shows Call + Contact

**Goal:** Verify that products in `automotive` and `real-estate` categories render different CTA buttons in `MobileBottomBar`.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product in the **automotive** category | `await page.goto('/en/<username>/<automotive-product-slug>')` |
| 2 | Wait for bottom bar | `await expect(page.locator('[class*="fixed bottom-0"]')).toBeVisible()` |
| 3 | Assert "Call Seller" button is visible | `page.locator('[class*="fixed bottom-0"]').getByRole('button', { name: /call/i })` with Phone icon |
| 4 | Assert "Contact Seller" button is visible | `page.locator('[class*="fixed bottom-0"]').getByRole('button', { name: /contact/i })` with User icon |
| 5 | Assert NO "Add to Cart" button | `await expect(page.locator('[class*="fixed bottom-0"]').getByRole('button', { name: /add|cart/i })).not.toBeVisible()` |
| 6 | 📸 Screenshot | `phase-6-S6.11a-automotive-cta.png` |
| 7 | Navigate to a product in the **real-estate** category | `await page.goto('/en/<username>/<real-estate-product-slug>')` |
| 8 | Wait for bottom bar | `await expect(page.locator('[class*="fixed bottom-0"]')).toBeVisible()` |
| 9 | Assert "Schedule Visit" button is visible | `page.locator('[class*="fixed bottom-0"]').getByRole('button', { name: /schedule|visit/i })` with Calendar icon |
| 10 | Assert "Contact Agent" button is visible | `page.locator('[class*="fixed bottom-0"]').getByRole('button', { name: /contact/i })` |
| 11 | 📸 Screenshot | `phase-6-S6.11b-real-estate-cta.png` |

**Expected:**
- **Automotive:** `[Call Seller (outline, flex-1)] [Contact Seller (primary, flex-1)]` — no cart button.
- **Real-estate:** `[Schedule Visit (outline, flex-1)] [Contact Agent (primary, flex-1)]` — no cart button.
- CTA logic switches on `viewModel.categoryType` prop.

---

### S6.12 — Reviews section: CustomerReviewsHybrid, rating summary

**Goal:** Verify the customer reviews section renders with a rating summary and individual review cards.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product with reviews | `await page.goto('/en/<username>/<product-with-reviews>')` |
| 2 | Scroll to the reviews section | `await page.locator('text=/review/i').first().scrollIntoViewIfNeeded()` |
| 3 | Assert `CustomerReviewsHybrid` is visible | Reviews section rendered within `px-4 pt-2` |
| 4 | Assert rating summary shows aggregate score | Star rating number and star icons visible |
| 5 | Assert total review count is displayed | e.g., "4.5 (12 reviews)" |
| 6 | Assert individual review cards render | At least 1 review card with author, rating, text |
| 7 | Assert review cards show author avatar or initials | Avatar element in each review card |
| 8 | Assert review cards show star rating | Star icons per review |
| 9 | If `submitReview` is available, assert "Write a Review" button exists | Button or link to write review dialog |
| 10 | 📸 Screenshot | `phase-6-S6.12-reviews.png` |

**Expected:**
- Reviews section renders with aggregate rating and up to 8 review cards (per fetch limit).
- Review cards display author info, star rating, and review text.
- "Write a Review" triggers `WriteReviewDialog` (auth-gated — may prompt login if unauthenticated).

---

### S6.13 — Similar items grid (SimilarItemsGrid)

**Goal:** Verify the `SimilarItemsGrid` renders related products below the main content.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a product with related products | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Scroll to the bottom of the PDP content | `await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))` |
| 3 | Assert `SimilarItemsGrid` section is visible | Section heading + product cards grid |
| 4 | Assert section heading text | Contains "Similar" or equivalent i18n text |
| 5 | Assert at least 1 related product card is visible | `const count = await page.locator('[class*="SimilarItemsGrid"] img, [class*="similar"] img').count()` — assert ≥ 1 |
| 6 | Assert product cards have images, titles, prices | Each card contains `<img>`, text, price with currency |
| 7 | Tap a similar product card | `await page.locator('[class*="similar"] a, [class*="SimilarItems"] a').first().tap()` |
| 8 | Assert navigation to new PDP | URL changes to a different `/:username/:productSlug` |
| 9 | 📸 Screenshot | `phase-6-S6.13-similar-items.png` |

**Expected:**
- Related products render in a responsive grid below the main PDP content.
- Cards are tappable and navigate to the respective PDP.
- Grid uses `rootCategory` to scope related product suggestions.

---

### S6.14 — Recently viewed tracking (RecentlyViewedTracker)

**Goal:** Verify that visiting a PDP records the product in the recently viewed list (localStorage).

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Clear recently viewed state | `await page.evaluate(() => localStorage.removeItem('recently-viewed'))` |
| 2 | Navigate to Product A | `await page.goto('/en/<username>/<product-a-slug>')` |
| 3 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 4 | Assert `RecentlyViewedTracker` has written to localStorage | `const rv = await page.evaluate(() => localStorage.getItem('recently-viewed'))` — assert not null |
| 5 | Parse recently viewed data | `const parsed = JSON.parse(rv)` — assert array with 1 entry |
| 6 | Assert entry contains product A's ID, title, price, image | Match against known product data |
| 7 | Navigate to Product B | `await page.goto('/en/<username>/<product-b-slug>')` |
| 8 | Wait for page load | `await page.waitForLoadState('networkidle')` |
| 9 | Assert recently viewed now has 2 entries | Product B added, Product A still present |
| 10 | 📸 Screenshot | `phase-6-S6.14-recently-viewed.png` |

**Expected:**
- `RecentlyViewedTracker` writes product data to `localStorage` key (likely `recently-viewed` or similar).
- Each visit records `{ id, title, price, image, slug, username }`.
- Duplicate visits update the timestamp, not add duplicates.

---

### S6.15 — Tab bar hidden on PDP

**Goal:** Verify the mobile tab bar is NOT visible on the Product Detail Page.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to the homepage | `await page.goto('/en')` |
| 2 | Assert tab bar is visible on homepage | `await expect(page.getByTestId('mobile-tab-bar')).toBeVisible()` |
| 3 | Navigate to a PDP | `await page.goto('/en/<username>/<productSlug>')` |
| 4 | Wait for PDP to load | `await page.waitForLoadState('networkidle')` |
| 5 | Assert tab bar is NOT visible | `await expect(page.getByTestId('mobile-tab-bar')).not.toBeVisible()` or tab bar not in DOM |
| 6 | Assert MobileBottomBar CTA is the only bottom-fixed element | No tab bar competing with the CTA bar |
| 7 | 📸 Screenshot | `phase-6-S6.15-tab-bar-hidden.png` |

**Expected:**
- The PDP route renders outside the `(main)` layout group that includes the tab bar, OR the tab bar is hidden via route-specific logic.
- Only `MobileBottomBar` (Chat + Add to Cart) is fixed at the bottom.
- No layout collision between tab bar and bottom CTA.

---

### S6.16 — Back navigation returns to previous page

**Goal:** Verify the back button in `MobileProductHeader` and browser back both return to the previous page.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to search results or category page | `await page.goto('/en/search?q=jacket')` |
| 2 | Wait for products | `await page.waitForLoadState('networkidle')` |
| 3 | Record the current URL | `const prevUrl = page.url()` |
| 4 | Tap a product card to navigate to PDP | `await page.locator('[data-slot="product-grid"] > * a').first().tap()` |
| 5 | Wait for PDP to load | `await page.waitForURL('**/en/**/**')` |
| 6 | Assert MobileProductHeader back button is visible | `page.locator('header').getByRole('button', { name: /back/i })` |
| 7 | Tap the back button in the header | `await backBtn.tap()` |
| 8 | Assert navigation returns to previous page | `await page.waitForURL(/search/)` — URL matches `prevUrl` |
| 9 | Navigate to PDP again | Tap same product card |
| 10 | Use browser back (`page.goBack()`) | `await page.goBack()` |
| 11 | Assert navigation returns to previous page | URL matches search/category page |
| 12 | 📸 Screenshot | `phase-6-S6.16-back-navigation.png` |

**Expected:**
- Header back button triggers `onBack` callback (likely `router.back()`).
- Browser back also returns to the correct previous page.
- No navigation loops or blank screens on back.

---

### S6.17 — Share functionality

**Goal:** Verify the share button in `MobileProductHeader` triggers the native share API or falls back to clipboard copy.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a PDP | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Assert share button in header | `const shareBtn = page.locator('header').getByRole('button', { name: /share/i })` |
| 3 | Assert share button has proper `aria-label` | `await expect(shareBtn).toHaveAttribute('aria-label')` |
| 4 | Mock `navigator.share` to verify it's called | `await page.evaluate(() => { window.__shareCalled = false; navigator.share = async (data) => { window.__shareCalled = true; window.__shareData = data; } })` |
| 5 | Tap the share button | `await shareBtn.tap()` |
| 6 | Assert `navigator.share` was called with correct data | `const result = await page.evaluate(() => ({ called: window.__shareCalled, data: window.__shareData }))` |
| 7 | Assert share data includes title and URL | `expect(result.data.title).toBeTruthy()` and `expect(result.data.url).toContain(window.location.href)` |
| 8 | 📸 Screenshot | `phase-6-S6.17-share.png` |

**Expected:**
- Share button calls `navigator.share({ title, url })` when available.
- Falls back to `navigator.clipboard.writeText(url)` when `navigator.share` is unsupported.
- Share uses the current product title and page URL.

---

### S6.18 — FE-UX-006: verify aspect-square used (not bracket aspect-[...])

**Goal:** Regression check for FE-UX-006 — verify the PDP gallery uses standard `aspect-square` Tailwind utility, not the invalid bracket `aspect-[...]` syntax flagged in the audit.

**Steps:**

| # | Action | Detail |
|---|--------|--------|
| 1 | Navigate to a PDP | `await page.goto('/en/<username>/<productSlug>')` |
| 2 | Wait for gallery to render | `await expect(page.locator('[class*="snap-x"]')).toBeVisible()` |
| 3 | Inspect gallery image containers | `const imageContainers = page.locator('[class*="snap-x"] [class*="aspect-"]')` |
| 4 | Assert all use `aspect-square` (not bracket syntax) | `for (const el of await imageContainers.all()) { const cls = await el.getAttribute('class'); expect(cls).toContain('aspect-square'); expect(cls).not.toMatch(/aspect-\[/); }` |
| 5 | Verify no `touch-action-*` invalid utilities in the DOM | `const allClasses = await page.evaluate(() => [...document.querySelectorAll('*')].map(el => el.className).filter(c => typeof c === 'string' && c.includes('touch-action')))` — assert empty or valid |
| 6 | Assert gallery images render correctly (aspect ratio intact) | Computed width equals computed height on `.aspect-square` containers |
| 7 | 📸 Screenshot | `phase-6-S6.18-aspect-square-check.png` |

**Expected:**
- All gallery image wrappers use `aspect-square` (standard Tailwind class).
- No `aspect-[...]` bracket syntax exists in the PDP DOM.
- No invalid `touch-action-*` utilities present on the page.
- **Bug FE-UX-006 status:** If bracket syntax or invalid utilities are present, mark as FAIL.

---

## Additional Cross-Cutting Checks (per master.md §9)

The following cross-cutting checks apply to every scenario above:

- [ ] No horizontal overflow on the PDP page
- [ ] No content clipped behind `MobileProductHeader` (sticky) or `MobileBottomBar` (fixed)
- [ ] `pb-20 md:pb-28` on `PageShell` provides clearance above the bottom bar
- [ ] Safe area insets respected (`pt-safe` on header, `pb-safe` on bottom bar)
- [ ] All interactive elements have touch targets ≥ 44px (gallery floating buttons use `size-touch-lg`)
- [ ] No console errors (React hydration, missing images, failed fetches)
- [ ] Loading skeleton (`loading.tsx`) renders during navigation to PDP
- [ ] Error boundary (`error.tsx`) renders on fetch failure
- [ ] JSON-LD structured data (`Product`, `BreadcrumbList`) present in `<head>`
- [ ] No hardcoded English strings — all text through `next-intl` (`Product` namespace)

---

## Evidence Log (v2)

Fixed columns. Add one row per scenario run (or per sub-scenario if needed).

| Scenario | Method | Artifact | Result | Issue ID | Severity | Owner | Date |
|----------|--------|----------|--------|----------|----------|-------|------|
| S6.2 | manual | `phase6-S6.2-gallery-swipe-pixel5.png`; `phase6-S6.2-gallery-swipe-iphone12.png` | Pass | F6-001 | P1 | Codex | 2026-02-11 |
| S6.3 | manual | `phase6-S6.3-image-counter-pixel5.png`; `phase6-S6.3-image-counter-iphone12.png` | Pass | F6-001 | P1 | Codex | 2026-02-11 |
| S6.4 | manual | `phase6-S6.4-fullscreen-viewer-pixel5.png`; `phase6-S6.4-fullscreen-viewer-iphone12.png` | Pass | F6-001 | P1 | Codex | 2026-02-11 |
| S6.15 | manual | `phase6-S6.15-tab-bar-hidden-pixel5.png`; `phase6-S6.15-tab-bar-hidden-iphone12.png` | Pass | — | — | Codex | 2026-02-11 |
| S6.1 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.2 | code trace | N/A (code trace) | Pass | F6-001 | P1 | Codex | 2026-02-11 |
| S6.3 | code trace | N/A (code trace) | Pass | F6-001 | P1 | Codex | 2026-02-11 |
| S6.4 | code trace | N/A (code trace) | Pass | F6-001 | P1 | Codex | 2026-02-11 |
| S6.5 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.6 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.7 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.8 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.9 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.10 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.11 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.12 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.13 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.14 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.15 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.16 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.17 | code trace | N/A (code trace) | Pass | — | — | Codex | 2026-02-11 |
| S6.18 | code trace | N/A (code trace) | Pass | FE-UX-006 | P2 | Codex | 2026-02-11 |

Method suggestions: `runtime` | `code trace` | `manual` (keep it consistent within a phase).


---

## Findings

| ID | Scenario | Severity | Description | Screenshot |
|----|----------|----------|-------------|------------|
| F6-001 | S6.2, S6.3, S6.4 | P1 | Historical resolved item retained: image resilience hardening added normalization/fallback handling (`lib/normalize-image-url.ts:1`, `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-gallery.tsx:135`) and rerun scenarios stayed green. | `phase6-category-to-pdp-navigation-pixel5.png` |

---

## Summary

| Metric | Value |
|--------|-------|
| Total scenarios | 18 |
| Executed | 18 |
| Passed | 18 |
| Failed | 0 |
| Blocked | 0 |
| Findings | 1 (P1:1, historical resolved) |
| Known bugs verified | FE-UX-006 — resolved |
| Status | ✅ Complete |
