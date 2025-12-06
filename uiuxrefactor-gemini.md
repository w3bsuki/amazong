# UI/UX Ultra-Refactor Plan: Amazong → eBay-Quality Marketplace
> **Target**: Pixel-perfect, high-performance e-commerce experience using **Tailwind CSS v4** and **shadcn/ui** best practices.

## 1. Executive Summary & Audit

### Current State Analysis
*   **Styling Architecture**: Currently "over-engineered" with 1,600+ lines of CSS in `globals.css`. It manually declares hundreds of CSS variables and custom `@utility` classes that duplicate native Tailwind functionality.
*   **Tailwind Usage**: Using Tailwind v4 but treating it like v3 with a massive `:root` block. Not fully leveraging the new `@theme` block for token management.
*   **Component Structure**:
    *   `category-subheader.tsx` (48KB, 1170 lines): Contains a massive ~500 line `MEGA_MENU_CONFIG` object that should be a separate data file.
    *   `product-page-content-new.tsx` (49KB, 977 lines): A monolithic client component handling gallery, buy box, shipping info, and seller details all in one file.
    *   `mega-menu.tsx` (35KB): Likely redundant or needs merging with the subheader logic.
    *   `desktop-filter-modal.tsx` (30KB): Too large for a modal, needs decomposition.
*   **Mobile Experience**: Functional but lacks "app-like" polish (touch targets, smooth sheet transitions, native-feeling gestures).
*   **Desktop Experience**: Good foundation but needs refinement in spacing, typography hierarchy, and grid density to match eBay's information density.

### The "Ultra-Think" Approach
We will shift from **"Custom CSS Wrappers"** to **"Native Tailwind v4 Configuration"**.
Instead of defining `@utility text-heading-1`, we will configure the *theme* so `text-3xl font-bold` *is* our heading style.

---

## 2. Technical Foundation (Tailwind v4 & Shadcn)

### 2.1 `globals.css` Refactor (The "Great Purge")
**Goal**: Reduce `globals.css` from ~1,600 lines to <300 lines.

*   **Action**: Move design tokens from `:root` into a CSS-native `@theme` block.
*   **Action**: Remove custom `@utility` classes that just wrap Tailwind utilities.
*   **Action**: Use OKLCH color space natively within Tailwind v4.

**Example Transformation:**

```css
/* CURRENT (Bad Pattern) */
:root {
  --text-3xl: 1.5rem;
  --font-weight-bold: 700;
}
@utility text-heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
}

/* NEW (Tailwind v4 Best Practice) */
@import "tailwindcss";

@theme {
  /* Define tokens directly in the theme */
  --font-sans: "Inter", sans-serif;
  
  /* Colors using OKLCH */
  --color-brand: oklch(0.48 0.22 260);
  --color-brand-hover: oklch(0.40 0.24 260);
  
  /* Semantic spacing if needed */
  --spacing-container: 1rem;
}

/* Usage in HTML: <h1 class="text-3xl font-bold text-brand"> */
```

### 2.2 Shadcn/UI Alignment
*   **Audit**: Ensure all shadcn components (`components/ui/*`) are using the *new* CSS variables defined in the `@theme` block.
*   **Refactor**: Update `components.json` to point to the simplified `globals.css`.
*   **Icons**: Standardize on `lucide-react` (via `lucide-svelte` or React equivalent) for consistency, replacing mixed icon sets if any.

---

## 3. Mobile-First UX Refactor (The "App-Like" Feel)

### 3.1 Mobile Navigation & Header
*   **Problem**: Header is often too tall on mobile; search bar feels cramped.
*   **Solution**:
    *   **Slim Header**: Reduce height to 56px or 60px on mobile.
    *   **Search UX**: On tap, search should expand to full screen (modal-like) with immediate focus.
    *   **Bottom Nav**: Ensure the bottom navigation bar has proper safe-area padding (`pb-safe`) and glassmorphism effect (`backdrop-blur-md`).

### 3.2 Touch Targets & Gestures
*   **Audit**: Check all interactive elements (buttons, links, inputs).
*   **Rule**: Minimum 44x44px tappable area. Use `min-h-[44px]` or padding to achieve this without making the visual element huge.
*   **Gestures**:
    *   Implement **swipe-to-dismiss** for all sheets and drawers (using `vaul` which shadcn uses for Drawer).
    *   Horizontal scroll containers (e.g., "Category Cards") must have `snap-x snap-mandatory` and `no-scrollbar` utility.

### 3.3 Mobile Product Page
*   **Sticky CTA**: "Add to Cart" / "Buy Now" should be in a sticky bottom bar that appears when the main button scrolls out of view.
*   **Gallery**: 1:1 Aspect ratio images with smooth swipe and pagination dots.
*   **Sheet Filters**: Filter menu should be a full-height bottom sheet on mobile, not a sidebar or modal.

---

## 4. Desktop UX Polish (The "Pro" Feel)

### 4.1 Information Density & Grid
*   **Problem**: E-commerce needs high density without clutter.
*   **Solution**:
    *   **Responsive Grid**:
        *   Mobile: 1 column (list) or 2 columns (grid).
        *   Tablet: 3 columns.
        *   Desktop: 4 columns.
        *   Wide: 5 or 6 columns.
    *   **Code**: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6`.

### 4.2 Mega Menu Refactor
*   **Problem**: `category-subheader.tsx` is 1170 lines long.
*   **Plan**:
    *   **Extract Config**: Move `MEGA_MENU_CONFIG` (lines 133-654) to `lib/config/mega-menu.ts`.
    *   **Extract Components**: Split into `components/layout/mega-menu/MegaMenuColumn.tsx` and `MegaMenuBanner.tsx`.
    *   **Use Primitives**: Use `NavigationMenu` primitive from shadcn for accessible keyboard navigation.

### 4.3 Product Page Decomposition
*   **Problem**: `product-page-content-new.tsx` is 977 lines.
*   **Plan**:
    *   Extract `ProductGallery` (lines 265-466).
    *   Extract `ProductBuyBox` (lines 555-587).
    *   Extract `ProductSellerCard` (lines 713-792).
    *   Extract `ProductSpecs` (lines 660-680).

---

## 5. Next.js & React Architecture

### 5.1 Component Extraction
*   **File**: `app/[locale]/(main)/page.tsx`
*   **Action**: Extract inline components (`CategoryCards`, `PromoCards`, `MoreWaysToShop`) into `components/home/*`.
    *   `components/home/category-rail.tsx`
    *   `components/home/promo-grid.tsx`
    *   `components/home/feature-rail.tsx`
*   **Benefit**: Better HMR performance and cleaner page file.

### 5.2 Server Components & Streaming
*   **Strategy**: Keep `page.tsx` as a Server Component.
*   **Suspense**: Wrap heavy sections (like "Deals of the Day" or "Trending") in `<Suspense fallback={<Skeleton />}>`.
*   **Images**: Enforce `sizes` prop on all `next/image` usage to prevent layout shift and download proper sizes.
    *   Example: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`

---

## 6. Implementation Roadmap

### Phase 1: The Cleanup (Day 1-2)
1.  [ ] **Refactor `globals.css`**: Migrate to `@theme` syntax, remove custom utilities.
2.  [ ] **Audit `tailwind.config.ts`**: Ensure it's minimal (v4 handles most config in CSS).
3.  [ ] **Fix Typography**: Establish a single type scale in Tailwind theme.

### Phase 2: Mobile Core (Day 3-4)
1.  [ ] **Mobile Header**: Redesign for slim profile + search overlay.
2.  [ ] **Bottom Nav**: Polish styling and safe areas.
3.  [ ] **Home Page Mobile**: Fix horizontal scrolling snap points and card sizing.

### Phase 3: Desktop & Components (Day 5-6)
1.  [ ] **Mega Menu**: Extract `MEGA_MENU_CONFIG` and split `category-subheader.tsx`.
2.  [ ] **Product Page**: Decompose `product-page-content-new.tsx` into smaller, focused components.
3.  [ ] **Home Page Extraction**: Move inline components to separate files.

### Phase 4: Polish (Day 7)
1.  [ ] **Loading States**: Create high-quality skeletons for all async sections.
2.  [ ] **Micro-interactions**: Add hover/active states.
3.  [ ] **Final Audit**: Lighthouse score check (Performance, Accessibility, SEO).

---

## 7. Best Practices Checklist (Reference)

*   **Responsiveness**: Always use `mobile-first` classes (e.g., `p-4 md:p-6` not `md:p-6 p-4`).
*   **Colors**: Use semantic names (`bg-card`, `text-muted-foreground`) over raw colors (`bg-white`, `text-gray-500`) for Dark Mode support.
*   **Spacing**: Use standard Tailwind spacing scale (`gap-4`, `p-6`). Avoid arbitrary values (`p-[13px]`) unless absolutely necessary for pixel-perfect alignment with assets.
*   **Images**: Always use `next/image` with `alt` text and `sizes`.
*   **Icons**: Use `lucide-react` with `strokeWidth={1.5}` for a refined look.
