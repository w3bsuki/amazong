# Desktop Product Page Audit + Refactor Plan

Route audited (Playwright, desktop viewport):
- `http://localhost:3000/bg/shop4e/12322`
- Source route: [app/[locale]/[username]/[productSlug]/page.tsx](../app/%5Blocale%5D/%5Busername%5D/%5BproductSlug%5D/page.tsx)

Primary components involved:
- Similar/top bar: [components/shared/product/similar-items-bar.tsx](../components/shared/product/similar-items-bar.tsx)
- Gallery: [components/shared/product/product-gallery-hybrid.tsx](../components/shared/product/product-gallery-hybrid.tsx)
- Buy box: [components/shared/product/product-buy-box.tsx](../components/shared/product/product-buy-box.tsx)
- “More from seller”: [components/shared/product/seller-products-grid.tsx](../components/shared/product/seller-products-grid.tsx)
- Reviews: [components/shared/product/customer-reviews-hybrid.tsx](../components/shared/product/customer-reviews-hybrid.tsx)

---

## What’s broken (desktop UX/UI)

### 1) Layout is effectively “full-bleed” on large screens
Observed:
- The main content spans nearly the full viewport width on 1920px (no horizontal overflow, but too wide).
- The 2-column layout becomes visually unbalanced: the gallery becomes huge (square) while the buy box remains relatively narrow.

Root causes:
- Current page wrapper uses `container`, but the resulting layout still renders near full width.
- Gallery uses `aspect-square` + `max-h-[80vh]` which balloons on wide screens.

Impact:
- Excess whitespace and “cheap”/unfinished look.
- Poor readability and weak visual hierarchy.

### 2) Gallery proportions feel wrong for desktop
Observed:
- `ProductGalleryHybrid` forces a square hero image area, which is rarely ideal for apparel/photos.
- Thumbnails + main image layout does not cap total visual weight.

Root causes:
- `aspect-square` and wide container.

Impact:
- Users spend too much attention on empty space, less on key decision info.

### 3) Buy box content is placeholder-ish / inconsistent
Observed:
- Seller avatar uses a hardcoded `github.com/shadcn.png` in `ProductBuyBox`.
- Seller “Visit” button doesn’t navigate.
- Condition is hard-coded (“New with tags”) rather than product data.
- Shipping/returns/payments blocks are placeholders.

Impact:
- Trust hit. The buy box should be the most “finished” region.

### 4) A11y/UX duplication: multiple skip links
Observed (DOM inspection):
- Both “Към съдържанието” and “Преминете към основното съдържание” appear.

Impact:
- Looks like duplicate banners/overlays and feels unpolished.

### 5) “Similar items” top bar feels bolted on
Observed:
- The bar exists, but competes with the header and doesn’t clearly fit the page hierarchy.
- Thumbnails are `md:flex` (shows on desktop) but spacing/padding is minimal (`p-1.5`).

Impact:
- Adds noise at the top; reads like an ad unit.

### 6) Information architecture is not “eBay/Amazon-like”
Observed:
- “About this item” and “Item specifics” are embedded inside the buy box on desktop.

Impact:
- Right sidebar grows too tall; users scroll a lot while the key “buy now” actions move away.

---

## Refactor goals (desktop)

1) Constrain content width (comfortable reading + premium feel)
- Target max width: `1200–1280px` with consistent gutters.

2) Strong, predictable 2-column layout
- Left: gallery + key details
- Right: sticky buy box (CTA always available)

3) Clean hierarchy
- Top: title + seller
- Mid: price + CTAs + shipping trust
- Below: specs/details + reviews + more from seller

4) No placeholders in trust-critical areas
- Seller avatar, links, condition, shipping/returns

5) Ship in phases with minimal risk

---

## Phased plan

### Phase 0 — Baseline + guardrails (1–2 hours)
- Add a dedicated desktop snapshot test route in Playwright (or reuse existing E2E smoke) to capture `1920x945`.
- Capture “before” screenshots for:
  - top fold
  - buy box
  - below fold (More from seller + Reviews)

### Phase 1 — Fix the desktop container + grid (quick win; 1–2 hours)
In [app/[locale]/[username]/[productSlug]/page.tsx](../app/%5Blocale%5D/%5Busername%5D/%5BproductSlug%5D/page.tsx):
- Replace the outer `container` usage for the product content with an explicit max width wrapper, e.g.
  - `mx-auto w-full max-w-[1280px] px-4 lg:px-6`
- Change grid to a predictable sidebar width:
  - `lg:grid-cols-[minmax(0,1fr)_380px]` (or 400px)
  - `lg:gap-10`
- Make right column sticky with correct offset:
  - `lg:sticky lg:top-[calc(var(--header-height)+16px)]`
  - If you don’t have `--header-height`, hardcode `top-20` as a first pass.

Acceptance:
- On 1920px wide screens, the content no longer stretches edge-to-edge.
- Gallery + buy box look proportionate.

### Phase 2 — Fix the gallery proportions + interaction (2–4 hours)
In [components/shared/product/product-gallery-hybrid.tsx](../components/shared/product/product-gallery-hybrid.tsx):
- Replace `aspect-square` with a more product-friendly ratio:
  - Consider `aspect-[4/5]` or `aspect-[3/4]` and cap max height like `max-h-[70vh]`.
- Wire the “Zoom” button to open PhotoSwipe at the current index.
- Add desktop affordances:
  - show arrows on desktop too (optional)
  - ensure thumbnails don’t cause layout shift

Acceptance:
- The gallery never dominates the screen.
- Zoom button actually zooms.

### Phase 3 — Make the buy box “real” (2–6 hours)
In [components/shared/product/product-buy-box.tsx](../components/shared/product/product-buy-box.tsx):
- Replace hardcoded avatar URL with `product.store.avatarUrl` (extend prop if needed).
- “Visit” should navigate to the seller/store route.
- Replace hardcoded condition (“New with tags”) with product condition.
- Audit spacing and label alignment:
  - current `lg:grid-cols-[90px_1fr]` is okay, but tighten typography and keep consistent with site.

Acceptance:
- No “obviously fake” content in the sidebar.
- Seller actions are clickable and correct.

### Phase 4 — Rebuild information architecture (4–8 hours)
Move long-form sections out of the buy box:
- Keep buy box focused on:
  - price, variants, quantity
  - CTAs (Buy/Add)
  - shipping/returns trust summary
- Move “About this item” + “Item specifics” to the left/main column below the fold (desktop) using a `Tabs` or `Accordion`.

Implementation sketch:
- Create `ProductPageDesktopLayout` component (new file) that composes:
  - `SimilarItemsBar`
  - `ProductGalleryHybrid`
  - `ProductBuyBox`
  - `ProductDetailsTabs` (new)
  - `SellerProductsGrid`
  - `CustomerReviewsHybrid`

Acceptance:
- Right sidebar remains compact and sticky.
- Users can scan details without losing CTAs.

### Phase 5 — Clean the top “Similar items” bar (1–3 hours)
In [components/shared/product/similar-items-bar.tsx](../components/shared/product/similar-items-bar.tsx):
- Increase padding and align visuals with the rest of the page (`p-3`, consistent radius).
- Consider limiting thumbnails on desktop to 3 and making the bar less dominant.
- Alternative: demote it below title/seller as a secondary module.

Acceptance:
- It reads like an intentional “seller context” module, not a random banner.

### Phase 6 — Fix skip-link duplication (1–2 hours)
Repo-wide:
- Find where both skip links are added (likely a layout + a header component).
- Keep exactly one skip link to `#main-content` and one to footer, max.

Acceptance:
- Only one “skip to content” link in the DOM.

---

## Quick wins you can do immediately
- Constrain width + fix grid columns (Phase 1).
- Wire zoom button to actually open PhotoSwipe.
- Remove hardcoded avatar in buy box.

---

## Notes
- There’s a separate desktop experiment component: [components/shared/product/product-page-desktop-v2.tsx](../components/shared/product/product-page-desktop-v2.tsx). It also includes a “Find similar items” banner; if you ever swap to it, avoid rendering `SimilarItemsBar` twice.
- The current page uses placeholder values for rating/condition/shipping. Even if the data model isn’t ready, prefer hiding unknown fields over showing fake ones.

