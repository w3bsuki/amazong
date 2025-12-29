# Desktop UI/UX Standardization Task List

> **Created:** 2025-12-29  
> **Status:** Active  
> **Platform:** Desktop (1024px+)  
> **Related Docs:** [DESKTOP_DESIGN_SYSTEM.md](./DESKTOP_DESIGN_SYSTEM.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

---

## Audit Summary

### Design System Health Check ✅

| Document | Status | Notes |
|----------|--------|-------|
| DESIGN_SYSTEM.md | ✅ Good | Master reference, well-structured, WCAG 2.2 compliant |
| DESKTOP_DESIGN_SYSTEM.md | ✅ Good | Comprehensive, eBay/Temu-inspired density patterns |
| MOBILE_DESIGN_SYSTEM.md | ✅ Good | WCAG 2.2 touch targets, gesture alternatives documented |

### Identified Gaps

| Category | Issue | Priority |
|----------|-------|----------|
| Badge variants | Missing `deal`, `shipping`, `stock`, `top-rated` variants in code | 🔴 High |
| Button variants | Missing `cta`, `deal` marketplace variants in code | 🔴 High |
| Touch target tokens | `h-11` (44px) documented but code caps at `h-10` (40px) | 🟡 Medium |
| Product cards | No standardized desktop product card component | 🔴 High |
| Sidebar filters | No reusable filter sidebar component | 🟡 Medium |
| Mega menu | No standardized mega menu component | 🟡 Medium |
| Keyboard shortcuts | Not implemented globally | 🟢 Low |

---

## Phase 1: Foundation Alignment (Critical)

### 1.0 CSS Token Definitions (Pre-requisite)
- [ ] **Task:** Add missing OKLCH color tokens to `globals.css`
- **File:** `app/globals.css` → `@theme {}` block
- **Design System Reference:** DESIGN_SYSTEM.md → Color System (OKLCH)
- **Missing Tokens:**
  ```css
  /* CTA Colors */
  --color-cta-trust-blue: oklch(0.48 0.22 260);
  --color-cta-trust-blue-text: oklch(1 0 0);
  --color-cta-trust-blue-hover: oklch(0.43 0.20 260);
  
  /* Marketplace Semantic Colors */
  --color-deal: oklch(0.55 0.25 27);
  --color-shipping-free: oklch(0.50 0.18 145);
  --color-stock-low: oklch(0.70 0.18 65);
  --color-top-rated: oklch(0.75 0.18 65);
  ```
- **Acceptance:** All color tokens used in button/badge variants are defined

### 1.1 Button Component Standardization
- [ ] **Task:** Add marketplace button variants (`cta`, `deal`)
- **File:** `components/ui/button.tsx`
- **Design System Reference:** DESIGN_SYSTEM.md → Button Variants section
- **Changes:**
  ```tsx
  // Add these variants:
  cta: "bg-cta-trust-blue text-cta-trust-blue-text hover:bg-cta-trust-blue-hover",
  deal: "bg-deal text-white hover:bg-deal/90",
  ```
- **Acceptance:** All CTA buttons in desktop use `variant="cta"`, deal buttons use `variant="deal"`

### 1.2 Badge Component Enhancement
- [ ] **Task:** Add all marketplace badge variants
- **File:** `components/ui/badge.tsx`
- **Design System Reference:** DESIGN_SYSTEM.md → Badge Variants section
- **Missing Variants:**
  - `deal` - `bg-deal text-white`
  - `shipping` - `bg-shipping-free/10 text-shipping-free`
  - `stock` - `bg-stock-low/10 text-stock-low`
  - `top-rated` - `bg-top-rated/10 text-top-rated`
- **Acceptance:** All product badges use standardized variants

### 1.3 Input Component WCAG Compliance
- [ ] **Task:** Verify input sizes match design system
- **File:** `components/ui/input.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Forms section
- **Check:**
  - Default: `h-9` (36px) ✓
  - Large: `h-10` (40px) 
  - Filter inputs: `h-8` (32px)
- **Acceptance:** No `h-11` or `h-12` inputs on desktop

---

## Phase 2: Component Library Expansion

### 2.1 Desktop Product Card
- [ ] **Task:** Create standardized `DesktopProductCard` component
- **File:** `components/desktop/desktop-product-card.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Product Grids & Cards
- **Requirements:**
  - Aspect-square image container
  - 2-line title with `line-clamp-2`
  - Sale/original price display
  - Rating with star + count
  - Seller badge (optional)
  - Hover: shadow-md, quick action icons
  - Dense padding: `p-2`, `space-y-1`
- **Acceptance:** All desktop product grids use this component

### 2.2 Desktop Product Card (List View)
- [ ] **Task:** Create `DesktopProductCardList` for horizontal layout
- **File:** `components/desktop/desktop-product-card-list.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → List View Card
- **Requirements:**
  - Horizontal flex layout
  - 128px fixed image size
  - Full description line-clamp-2
  - Price + CTA on right side
- **Acceptance:** View toggle between grid/list works seamlessly

### 2.3 View Mode Toggle
- [ ] **Task:** Create `ViewModeToggle` component
- **File:** `components/desktop/view-mode-toggle.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Grid Controls
- **Requirements:**
  - Grid/List icon buttons
  - Active state indication
  - Accessible: `aria-pressed`
- **Acceptance:** Consistent view toggle across all product listings

### 2.4 Sort Dropdown
- [ ] **Task:** Create standardized `SortDropdown` component
- **File:** `components/desktop/sort-dropdown.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Grid Controls
- **Options:**
  - Best Match (relevance)
  - Price: Low to High
  - Price: High to Low
  - Newest First
  - Top Rated
- **Acceptance:** All search/category pages use same sort dropdown

---

## Phase 3: Navigation & Layout

### 3.1 Mega Menu Component
- [ ] **Task:** Create `DesktopMegaMenu` component
- **File:** `components/desktop/desktop-mega-menu.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Mega Menu
- **Requirements:**
  - 4-column grid layout (800px width)
  - Category headers with subcategory links
  - Keyboard navigable
  - Hover delay to prevent accidental triggers
- **Acceptance:** Main nav "All Categories" triggers mega menu

### 3.2 Sidebar Filters
- [ ] **Task:** Create `DesktopFilterSidebar` component
- **File:** `components/desktop/desktop-filter-sidebar.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Sidebar Filters
- **Requirements:**
  - 240px width (`w-60`)
  - Sticky positioning with header offset
  - Accordion-based filter groups
  - Checkbox/radio filter inputs
  - Price range slider
  - "Clear all" button
- **Acceptance:** Search/category pages have consistent filter UI

### 3.3 Filter Chip Pills
- [ ] **Task:** Create `FilterChips` component for active filters
- **File:** `components/desktop/filter-chips.tsx`
- **Requirements:**
  - Display active filters as removable pills
  - "Clear all" link
  - Horizontal scroll if overflow
- **Acceptance:** Active filters visible above product grid

---

## Phase 4: Tables & Data Display

### 4.1 Dense Data Table
- [ ] **Task:** Verify table styling matches design system
- **Files:** `components/ui/table.tsx`, seller dashboard tables
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Tables & Data
- **Check:**
  - Header height: `h-9` with `text-xs`
  - Row height: `py-2` compact
  - Alternating row colors (optional)
  - Sortable headers with icons
- **Acceptance:** All seller/admin tables follow dense pattern

### 4.2 Pagination Component
- [ ] **Task:** Verify pagination matches design system
- **File:** `components/ui/pagination.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Pagination
- **Check:**
  - Icon buttons: `size-8` (32px)
  - Page numbers: `size-8` (32px)
  - "Showing X-Y of Z" text present
- **Acceptance:** Consistent pagination across all paginated views

---

## Phase 5: Accessibility & Keyboard

### 5.1 Skip Links
- [ ] **Task:** Add skip navigation links
- **File:** `app/[locale]/layout.tsx` or `components/layout/skip-links.tsx`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Keyboard & Focus
- **Requirements:**
  - "Skip to main content" link
  - "Skip to search" link
  - "Skip to footer" link
  - Hidden until focused
- **Acceptance:** Tab focus reveals skip links

### 5.2 Focus Visibility Audit
- [ ] **Task:** Audit all interactive elements for focus rings
- **Design System Reference:** DESIGN_SYSTEM.md → Focus Ring section
- **Check:**
  - Ring width: 2px minimum
  - Ring contrast: 3:1 minimum
  - Ring offset: 2px
  - No `outline-none` without `focus-visible:ring-*`
- **Acceptance:** All buttons, links, inputs have visible focus

### 5.3 Keyboard Shortcuts (Optional Enhancement)
- [ ] **Task:** Implement global keyboard shortcuts
- **File:** `hooks/use-keyboard-shortcuts.ts`
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Keyboard Shortcuts
- **Shortcuts:**
  - `/` → Focus search
  - `?` → Show shortcuts modal
  - `g h` → Go home
  - `g c` → Go to cart
  - `g o` → Go to orders
- **Acceptance:** Shortcuts work globally when not in input

### 5.4 Focus Scroll Margin (WCAG 2.4.11)
- [ ] **Task:** Add scroll-margin to prevent focus obscured by sticky header
- **File:** `app/globals.css`
- **Design System Reference:** DESIGN_SYSTEM.md → WCAG 2.2 → Focus Not Obscured
- **Implementation:**
  ```css
  /* Prevent sticky header from obscuring focused elements */
  :target,
  [tabindex]:focus,
  a:focus,
  button:focus,
  input:focus,
  select:focus,
  textarea:focus {
    scroll-margin-top: 5rem; /* 80px - accounts for h-14 header + buffer */
  }
  ```
- **Acceptance:** Tab-focusing through page never hides elements under sticky header

### 5.5 Drag Alternative Audit (WCAG 2.5.7)
- [ ] **Task:** Audit all carousels/sliders for button alternatives
- **Files:** All carousel/slider components
- **Design System Reference:** DESIGN_SYSTEM.md → WCAG 2.2 → Dragging Movements
- **Checklist:**
  - [ ] Product image gallery has prev/next buttons
  - [ ] Product rails have arrow buttons
  - [ ] Any horizontal scroll areas have button controls
- **Acceptance:** Every swipe/drag action has a single-pointer alternative

### 5.6 Live Region Implementation
- [ ] **Task:** Add aria-live regions for dynamic updates
- **Files:** Cart components, filter components, toast system
- **Design System Reference:** DESIGN_SYSTEM.md → ARIA Patterns
- **Requirements:**
  - Cart item add/remove announcements
  - Filter result count updates
  - Toast notifications use aria-live="polite"
- **Acceptance:** Screen readers announce dynamic content changes

---

## Phase 6: Page-by-Page Audit

### 6.1 Homepage Desktop
- [ ] **Task:** Audit homepage against design system
- **File:** `app/[locale]/page.tsx`, homepage components
- **Checklist:**
  - [ ] Header follows 56px height pattern
  - [ ] Hero section uses design system colors
  - [ ] Product rails use `DesktopProductCard`
  - [ ] Category cards follow design system
  - [ ] No arbitrary sizes (e.g., `text-[13px]`)
  - [ ] Shadows: minimal/flat (`shadow-sm` max)

### 6.2 Search Results Desktop
- [ ] **Task:** Audit search results page
- **Checklist:**
  - [ ] Filter sidebar: 240px width, accordion filters
  - [ ] Product grid: 4-5-6 column responsive
  - [ ] Sort dropdown present
  - [ ] View mode toggle present
  - [ ] Pagination at bottom
  - [ ] Active filters shown as chips

### 6.3 Product Detail Desktop
- [ ] **Task:** Audit product detail page
- **Checklist:**
  - [ ] Image gallery follows design system
  - [ ] Price display matches `text-base font-semibold text-price-sale`
  - [ ] "Add to Cart" button: `h-10` or `h-9`
  - [ ] "Buy Now" button: `variant="cta"`
  - [ ] Product description typography: `text-sm`
  - [ ] Reviews section follows table patterns

### 6.4 Cart Desktop
- [ ] **Task:** Audit cart page
- **Checklist:**
  - [ ] Item list follows dense table pattern
  - [ ] Quantity input: `h-9` with proper touch target
  - [ ] Remove button accessible
  - [ ] Summary card on right side
  - [ ] Checkout CTA: `variant="cta"` `h-10`

### 6.5 Checkout Desktop
- [ ] **Task:** Audit checkout flow
- **Checklist:**
  - [ ] Form inputs: `h-9` minimum
  - [ ] Labels: `text-sm font-medium`
  - [ ] Error messages: `text-xs text-destructive`
  - [ ] Step indicator present
  - [ ] Payment buttons: proper height
  - [ ] WCAG 3.3.7: No redundant entry (auto-fill)

### 6.6 Seller Dashboard Desktop
- [ ] **Task:** Audit seller dashboard
- **Checklist:**
  - [ ] Sidebar navigation: 240-256px width
  - [ ] Tables: dense pattern with `h-9` headers
  - [ ] Stats cards: proper padding
  - [ ] Charts: using Chart.js or recharts consistently
  - [ ] Form inputs in modals: proper sizes

### 6.7 Account/Profile Desktop
- [ ] **Task:** Audit account pages
- **Checklist:**
  - [ ] Tab navigation follows design system
  - [ ] Order history table: dense pattern
  - [ ] Address cards: consistent styling
  - [ ] Settings forms: proper input sizes
  - [ ] Profile image: avatar component

---

## Phase 7: Performance & Polish

### 7.1 Shadow Audit
- [ ] **Task:** Remove heavy shadows project-wide
- **Design System Reference:** DESIGN_SYSTEM.md → Anti-Patterns
- **Find & Replace:**
  - `shadow-lg` → `shadow-md` or `shadow-sm`
  - `shadow-xl` → `shadow-md`
  - `shadow-2xl` → `shadow-lg`
- **Acceptance:** No shadows heavier than `shadow-md` on cards

### 7.2 Border Radius Audit
- [ ] **Task:** Ensure sharp, professional corners
- **Design System Reference:** DESIGN_SYSTEM.md → Border Radius
- **Check:**
  - Cards: `rounded` or `rounded-lg` (6px max)
  - Buttons: `rounded-md` (4px)
  - No `rounded-xl`, `rounded-2xl`, `rounded-3xl` on cards
- **Acceptance:** eBay-style sharp corners throughout

### 7.3 Typography Audit
- [ ] **Task:** Standardize typography usage
- **Design System Reference:** DESKTOP_DESIGN_SYSTEM.md → Typography
- **Check:**
  - No body text below `text-sm` (14px)
  - No arbitrary sizes like `text-[13px]`
  - Prices: `text-base font-semibold`
  - Meta: `text-xs text-muted-foreground`
- **Acceptance:** Typography matches design system scale

### 7.4 Spacing Audit
- [ ] **Task:** Verify 4px grid compliance
- **Design System Reference:** DESIGN_SYSTEM.md → Spacing
- **Check:**
  - All spacing uses Tailwind defaults (4px increments)
  - No arbitrary values like `gap-[15px]`
  - Container padding: `px-4` on desktop
- **Acceptance:** All spacing on 4px grid

---

## Completion Checklist

### Phase 1: Foundation Alignment
- [ ] 1.0 CSS Token Definitions (pre-requisite)
- [ ] 1.1 Button variants added
- [ ] 1.2 Badge variants added
- [ ] 1.3 Input sizes verified

### Phase 2: Component Library
- [ ] 2.1 Desktop product card (grid)
- [ ] 2.2 Desktop product card (list)
- [ ] 2.3 View mode toggle
- [ ] 2.4 Sort dropdown

### Phase 3: Navigation & Layout
- [ ] 3.1 Mega menu
- [ ] 3.2 Sidebar filters
- [ ] 3.3 Filter chips

### Phase 4: Tables & Data
- [ ] 4.1 Dense data table
- [ ] 4.2 Pagination

### Phase 5: Accessibility
- [ ] 5.1 Skip links
- [ ] 5.2 Focus visibility audit
- [ ] 5.3 Keyboard shortcuts (optional)
- [ ] 5.4 Focus scroll margin (WCAG 2.4.11)
- [ ] 5.5 Drag alternative audit (WCAG 2.5.7)
- [ ] 5.6 Live region implementation

### Phase 6: Page Audits
- [ ] 6.1 Homepage
- [ ] 6.2 Search results
- [ ] 6.3 Product detail
- [ ] 6.4 Cart
- [ ] 6.5 Checkout
- [ ] 6.6 Seller dashboard
- [ ] 6.7 Account/Profile

### Phase 7: Polish
- [ ] 7.1 Shadow audit
- [ ] 7.2 Border radius audit
- [ ] 7.3 Typography audit
- [ ] 7.4 Spacing audit

---

## Estimated Effort

| Phase | Tasks | Effort |
|-------|-------|--------|
| Phase 1 | 4 | 3-4 hours |
| Phase 2 | 4 | 4-6 hours |
| Phase 3 | 3 | 4-5 hours |
| Phase 4 | 2 | 1-2 hours |
| Phase 5 | 6 | 4-5 hours |
| Phase 6 | 7 | 6-8 hours |
| Phase 7 | 4 | 2-3 hours |
| **Total** | **30** | **24-33 hours** |

---

## Next Steps

1. **Start with Phase 1** - Foundation alignment ensures all subsequent work uses correct patterns
2. **Create components in Phase 2** - Reusable components reduce page audit effort
3. **Audit pages in Phase 6** - Use new components during audits
4. **Polish in Phase 7** - Final consistency pass

---

*This task list should be updated as tasks are completed. Check off items and add notes for any blockers or decisions made.*
