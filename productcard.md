# 🚀 Master Plan: Hybrid Product Page Implementation

**Objective:** Migrate the polished "Hybrid" product page preview (`/preview/product-hybrid/demo/demo`) to the production route (`/app/[locale]/[username]/[productSlug]/page.tsx`).

**Target Audience:**
-   **Desktop:** Power users needing detailed specs, galleries, and sticky buy boxes.
-   **Mobile:** Shoppers needing quick "Buy Now" access, collapsible details, and compact headers.

**Tech Stack:**
-   **Framework:** Next.js 16 (App Router)
-   **Styling:** Tailwind CSS v4 (using CSS variables/tokens)
-   **UI Library:** Shadcn UI (Radix Primitives)
-   **Backend:** Supabase (PostgreSQL)
-   **Language:** TypeScript (Strict)

---

## 1. Component Architecture (Modularization)

We will split the monolithic preview into reusable, responsive components.

### A. Core Components (`components/shared/product/`)

1.  **`ProductGalleryHybrid.tsx`** (Client)
    -   **Desktop:** Left column, PhotoSwipe lightbox, vertical thumbnails.
    -   **Mobile:** Swipeable carousel (Embla/Carousel), aspect ratio optimized.
    -   *Dependencies:* `photoswipe`, `embla-carousel-react`.

2.  **`ProductBuyBox.tsx`** (Client)
    -   **Desktop:** Sticky right column card. Contains Price, Condition, Size/Color selectors, Quantity, "Add to Cart".
    -   **Mobile:** Inline content.
        -   *Critical:* "Select Size" buttons must be compact (`h-9`, `text-xs`) on mobile.
        -   *Critical:* Price/Condition must wrap (`flex-wrap`) on mobile.
        -   *Critical:* Hide "Buy" buttons on mobile (handled by Sticky Bar).

3.  **`MobileStickyBar.tsx`** (Client)
    -   **Mobile Only:** Fixed to bottom (`fixed bottom-0`).
    -   **Features:** "Add to Cart", "Buy It Now", "Wishlist".
    -   **Styling:** `backdrop-blur-md`, `pb-[env(safe-area-inset-bottom)]` for iOS home bar safety.

4.  **`SimilarItemsBar.tsx`** (Client)
    -   **Desktop:** Row of thumbnails.
    -   **Mobile:** Horizontal scroll view (`overflow-x-auto`).

5.  **`MobileAccordions.tsx`** (Client)
    -   **Mobile Only:** Collapsible sections for "Description", "Details", "Shipping".
    -   *Dependencies:* `@radix-ui/react-accordion`.

6.  **`SellerProductsGrid.tsx`** (Server/Client)
    -   **Desktop:** Grid layout (5 columns).
    -   **Mobile:** Horizontal scroll snap (`snap-x`).

### B. Data Fetching Strategy (Server Components)

The main `page.tsx` will be a **Server Component**.

1.  **Fetch Data:**
    -   Fetch `product` by `slug`.
    -   Fetch `seller` (store) profile.
    -   Fetch `related_products` (same seller).
    -   Fetch `reviews` (summary + list).
2.  **Pass Props:**
    -   Pass plain objects to Client Components.
    -   Use `next-intl` for all text labels.

---

## 2. Implementation Steps for AI Agent

### Phase 1: Component Extraction
1.  Create the file structure in `components/shared/product/`.
2.  Copy logic from `preview/.../page.tsx` into individual components.
3.  **Strictly** type all props using TypeScript interfaces.
4.  Ensure `use client` directive is present where hooks (`useState`, `useRef`) are used.

### Phase 2: Mobile Optimization (The "Hybrid" Logic)
1.  **`ProductBuyBox`**: Implement the `lg:hidden` and `lg:block` toggles for layout shifts.
    -   *Verify:* Size buttons are `h-9` on mobile, `h-10` on desktop.
2.  **`MobileStickyBar`**: Ensure z-index is `z-50` and padding handles safe areas.
3.  **`MobileAccordions`**: Verify smooth animation using Shadcn Accordion.

### Phase 3: Integration
1.  Open `app/[locale]/[username]/[productSlug]/page.tsx`.
2.  Replace existing JSX with the new layout structure:
    ```tsx
    <div className="container ...">
      <SimilarItemsBar />
      <div className="lg:hidden"> <MobileSellerCard /> </div>
      <div className="grid ... lg:grid-cols-[2fr_1fr]">
         <div>
            <ProductGalleryHybrid />
            <DesktopDetails /> {/* Hidden on mobile */}
         </div>
         <div>
            <ProductBuyBox />
         </div>
      </div>
      <MobileAccordions /> {/* Hidden on desktop */}
      <SellerProductsGrid />
      <CustomerReviewsHybrid />
      <MobileStickyBar />
    </div>
    ```

### Phase 4: Styling & Polish (Tailwind v4)
1.  Use CSS variables for colors (e.g., `bg-[var(--color-primary)]` if defined, or standard Tailwind colors).
2.  Ensure `backdrop-blur` is used on sticky elements.
3.  Verify `active:scale` states on mobile buttons for touch feedback.

---

## 3. Verification Checklist

-   [ ] **Mobile:** "Select Size" buttons fit on one row (or wrap gracefully without taking too much space).
-   [ ] **Mobile:** Sticky bottom bar does not overlap content at the very bottom.
-   [ ] **Mobile:** Horizontal scrolls (Similar Items, Seller Products) have hidden scrollbars (`no-scrollbar`).
-   [ ] **Desktop:** Sticky Buy Box stays fixed while scrolling images.
-   [ ] **General:** All images use `next/image` or optimized `img` tags with proper aspect ratios.
-   [ ] **General:** No hydration errors (check console).

## 4. Supabase & Types

Ensure all data matches the Supabase schema:
-   `products` table: `id`, `title`, `price`, `stock`, `seller_id`, `slug`.
-   `profiles` (sellers) table: `id`, `username`, `full_name`, `avatar_url`.

---

**Execute this plan to finalize the product page.**
