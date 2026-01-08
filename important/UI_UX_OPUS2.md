# UI/UX Evolution Plan v2 ("Project Opus")

**Created:** January 8, 2026  
**Purpose:** Comprehensive mobile-first shopping UI/UX improvements  
**Philosophy:** "Fast, focused, friction-free browsing and filtering"

---

## Executive Summary

This plan evolves Treido's current UI/UX while **preserving the existing fast, clean design language**. Key improvements focus on:

1. **Filter Hub** – Modal-based filtering (inspired by eBay/Vinted)
2. **Category Navigation** – Keep circles for L0→L2, evolve deeper levels
3. **Product Cards** – Refinement, not redesign
4. **Control Bar** – Sticky sort/filter access
5. **Visual Consistency** – Systematic design tokens

> [!IMPORTANT]
> This is an evolution, not a redesign. We preserve what works (speed, clean cards, circles), and refine the filter/search UX for complex shopping flows.

---

## Part 1: Current State Analysis

### What Works (Keep)
| Component | Location | Status |
|-----------|----------|--------|
| Category circles (L0→L2) | `category-circles.tsx` | ✅ Keep |
| Quick filter pills | `category-quick-pills.tsx` | ✅ Keep for common filters |
| Product card design | `product-card.tsx` | ✅ Minor tweaks only |
| Drawer-based filter UI | `mobile-filters.tsx` | ⚠️ Evolve to modal |
| Filter chips (active) | `filter-chips.tsx` | ✅ Keep |
| Fast page loads | SSR + caching | ✅ Preserve |

### Pain Points (Fix)
| Issue | Severity | Current Behavior |
|-------|----------|------------------|
| Circles reload on every click | 🔴 High | State resets on navigation |
| Deep filtering requires many taps | 🟠 Medium | Drawer opens but no drill-down |
| No live result count during filtering | 🟠 Medium | User doesn't know impact until apply |
| Attribute filters lack visual hierarchy | 🟡 Low | All filters look the same |
| Desktop filter modal is underutilized | 🟡 Low | Different UX from mobile |

---

## Part 2: The "Filter Hub" Experience

### 2.1 Core Philosophy
> "Refinement must be a focused, interrupt-free task. Never reload the product grid until the user confirms their selection."

### 2.2 The Entry Point: Sticky Control Bar

**Placement:** Sticky below the page header on category/search pages.

```
┌─────────────────────────────────────────┐
│  Sort ▼             │   Filter / Refine │
│  (40%)              │      (60%)        │
└─────────────────────────────────────────┘
```

**Behavior:**
- Remains visible while scrolling down products
- `Sort` opens a small bottom menu (quick action)
- `Filter/Refine` opens the **Main Hub** (full modal)

**Scroll Behavior:**
- Adds subtle shadow on scroll for visual separation
- Background becomes `bg-white/95 backdrop-blur-md`

### 2.3 The Main Hub (Bottom Sheet Modal)

**Trigger:** "Filter/Refine" button tap  
**Coverage:** 90% of viewport height  
**Background:** Dim backdrop with blur (`bg-black/40 backdrop-blur-sm`)

**Layout:**
```
┌──────────────────────────────────────┐
│           ─── (drag handle)          │
│  × Clear All                Filters  │
├──────────────────────────────────────┤
│                                      │
│  Category          Electronics >     │
│  ─────────────────────────────────── │
│  Price Range              $50-$500 > │
│  ─────────────────────────────────── │
│  Brand                     Apple   > │
│  ─────────────────────────────────── │
│  Color                              >│
│  ─────────────────────────────────── │
│  Condition                   New   > │
│                                      │
├──────────────────────────────────────┤
│  ╔══════════════════════════════════╗│
│  ║     Show 1,024 Results           ║│
│  ╚══════════════════════════════════╝│
└──────────────────────────────────────┘
```

### 2.4 Navigation Type: Drill-Down (Apple Settings Style)

**Level 1:** List of all filterable attributes  
**Action:** User taps "Brand"  
**Transition:** L1 slides left, L2 (brand list) slides in from right  
**Header:** Changes to "Select Brand" with "< Back" button

```
TRANSITION ANIMATION:
─────────────────────────────────────────
L1 (Filters)    →    L2 (Brand Selection)
─────────────────────────────────────────
transform: translateX(0)  →  translateX(-100%)
                   while L2 enters from right
─────────────────────────────────────────
Duration: 200ms ease-out
```

### 2.5 Smart Context Defaults

Based on current category, auto-promote relevant filters:

| Category Context | Top-Level Filters |
|-----------------|-------------------|
| Fashion | Size, Gender, Brand, Color |
| Electronics | Condition, Brand, Model |
| Beauty | Type, Cruelty Free, Vegan |
| Home & Garden | Material, Size, Style |
| Default | Price, Brand, Condition |

### 2.6 The Live Feedback Loop

**The Action Button:** Fixed at bottom of modal

**Label Logic:**
- Default: `"Show 1,024 Results"`
- User selects "Red": Button pulses → `"Show 450 Results"`
- User selects "Size S": → `"Show 12 Results"`
- Zero state: Button becomes gray → `"No items found"` (disabled)

**API Strategy:**
- Debounced count fetch (300ms after last selection)
- Use optimistic UI: show previous count with loading indicator
- Endpoint: `GET /api/products/count?filters=...`

---

## Part 3: Category Navigation Strategy

### 3.1 Current Circle System (L0→L2)

**Keep For:**
- L0 categories (All, Fashion, Electronics, etc.)
- L1 subcategories (Men's, Women's, Phones, Laptops)
- L2 sub-subcategories (Sneakers, Dresses, iPhones)

**Improvement:**
- Do NOT reload circles on every click
- Use client-side state for drill-down within same page
- Only navigate to new page when selecting final browsable category

### 3.2 Beyond L2: Filter-Based Refinement

**Current Problem:** Circles become too granular at L3+ levels

**Solution:** L3 and beyond become chip-style filters, not circles

```
┌─────────────────────────────────────────┐
│ ◉ Sneakers  ◉ Boots  ◉ Sandals  (L2)   │
├─────────────────────────────────────────┤
│ [Running] [Basketball] [Casual] (L3)   │
│ [Nike] [Adidas] [Puma] (Brand chips)   │
└─────────────────────────────────────────┘
```

### 3.3 Preventing Circle Reload

**Current Behavior:**
```javascript
// Every circle click navigates → full page reload
<Link href={`/categories/${slug}`}>
```

**Improved Behavior:**
```javascript
// State-based navigation for drill-down
const [activeL1, setActiveL1] = useState(null)
const [activeL2, setActiveL2] = useState(null)

// Only navigate when selecting leaf category
if (isLeafCategory) {
  router.push(`/categories/${slug}`)
} else {
  setActiveL1(slug) // Client-side drill-down
}
```

---

## Part 4: Visual Design Specifications

### 4.1 Modal Container

| Property | Value |
|----------|-------|
| Border radius | `rounded-t-[24px]` (friendly, modern) |
| Background (light) | `bg-white` |
| Background (dark) | `bg-neutral-900` |
| Handle | `w-12 h-1.5 bg-gray-300 rounded-full` centered |
| Max height | `90vh` |
| Animation | `slide-up 200ms ease-out` |

### 4.2 Filter Rows (Level 1)

| Property | Value |
|----------|-------|
| Height | `h-14` (56px, easy thumb tap) |
| Layout | `flex justify-between items-center` |
| Label | `text-base font-medium text-foreground` |
| Selection preview | `text-sm text-primary` (e.g., "Red, Blue") |
| Chevron | `w-5 h-5 text-muted-foreground` |
| Separator | `border-b border-border/30` |

### 4.3 Visual Selectors (Level 2)

**Color Swatches:**
```css
.color-swatch {
  @apply w-10 h-10 rounded-full border border-border shadow-sm;
}
.color-swatch--selected {
  @apply ring-2 ring-primary ring-offset-2;
}
```

**Size Tiles:**
```css
.size-tile {
  @apply h-11 border rounded-lg flex items-center justify-center font-medium;
}
.size-tile--selected {
  @apply bg-foreground text-background border-foreground;
}
```

**Grid Layout:** 4 columns for sizes, 6 columns for colors

### 4.4 CTA Button

| Property | Value |
|----------|-------|
| Position | Fixed at modal bottom with `p-4` wrapper |
| Style | `w-full h-12 rounded-full bg-primary text-primary-foreground font-bold` |
| Shadow | `shadow-lg shadow-primary/20` |
| Animation | `active:scale-[0.98] transition-transform` |
| Disabled state | `bg-muted text-muted-foreground cursor-not-allowed` |

### 4.5 Control Bar (On Page)

```css
.control-bar {
  @apply sticky top-[var(--header-height)] z-40;
  @apply bg-background/95 backdrop-blur-md;
  @apply border-b border-border/30;
}
.control-bar--scrolled {
  @apply shadow-sm;
}
```

---

## Part 5: Product Card Refinements

### 5.1 Keep Current Design, Fix Details

| Element | Current | Improvement |
|---------|---------|-------------|
| Aspect ratio | Variable | Enforce `aspect-square` or `aspect-[4/3]` |
| Image | `object-cover` | ✅ Keep |
| Price | Bold, prominent | ✅ Keep as primary visual |
| Title | Variable lines | Limit to 2 lines with `line-clamp-2` |
| Heart icon | Gray circle overlay | Make smaller, semi-transparent bg |
| Badge ("-15%") | Heavy styling | Move to top-left, smaller, `bg-black/70` |
| Borders | Inconsistent | Add `border border-border/40` consistently |

### 5.2 Card Typography Hierarchy

1. **Price:** `text-base font-bold text-foreground` (most prominent)
2. **Title:** `text-sm font-normal text-foreground line-clamp-2`
3. **Original price:** `text-xs text-muted-foreground line-through`
4. **Badge:** `text-2xs font-semibold text-white bg-black/70`

### 5.3 Hover/Active States

- Subtle border color change on hover: `hover:border-border`
- Light shadow on hover: `hover:shadow-sm`
- Scale on active: `active:scale-[0.98]`

---

## Part 6: Header & Brand Color

### 6.1 Current State
- Blue header feels dated
- Competes with product images

### 6.2 Recommended Evolution

| Element | Current | Proposed |
|---------|---------|----------|
| Header background | `bg-primary` (blue) | `bg-background` (white/dark) |
| Icons | White on blue | `text-foreground` |
| Search bar | In header | Light gray bg `bg-muted` |
| Logo | White | Brand color or monochrome |

> [!NOTE]
> This is a significant visual change. Consider A/B testing or user feedback before implementing.

---

## Part 7: Implementation Phases

### Phase 1: Control Bar + Sort Modal (Low Risk)
**Files:**
- `components/shared/filters/control-bar.tsx` (NEW)
- `components/shared/filters/sort-modal.tsx` (NEW)

**Changes:**
- Add sticky control bar below header
- Implement simple sort modal (bottom sheet)
- Keep current filter drawer for now

**Verification:**
- Visual check on mobile (375px)
- Sort changes URL params correctly

---

### Phase 2: Filter Hub Modal (Medium Risk)
**Files:**
- `components/shared/filters/filter-hub.tsx` (NEW)
- `components/shared/filters/filter-section.tsx` (NEW)
- `components/shared/filters/visual-selectors.tsx` (NEW)

**Changes:**
- Build new filter hub modal
- Implement drill-down navigation
- Add live result count
- Replace filter drawer trigger

**Verification:**
- All existing filter params work
- Live count updates correctly
- Drill-down animation smooth

---

### Phase 3: Category Circle Optimization (Medium Risk)
**Files:**
- `components/mobile/category-nav/category-circles.tsx`
- `app/[locale]/(main)/categories/[slug]/page.tsx`

**Changes:**
- Implement client-side circle state
- Prevent unnecessary page reloads
- Add L3+ filter chip mode

**Verification:**
- Circle selection doesn't reload page
- Navigation to leaf categories still works
- State persists during back navigation

---

### Phase 4: Product Card Polish (Low Risk)
**Files:**
- `components/shared/product/product-card.tsx`

**Changes:**
- Enforce aspect ratio
- Refine typography hierarchy
- Improve badge positioning
- Add consistent borders

**Verification:**
- Visual regression check
- Cards align in grid
- All interactive elements work

---

### Phase 5: (Optional) Header Evolution
**Files:**
- `components/layout/header/site-header.tsx`
- Theme/design tokens

**Changes:**
- Test white header variant
- Adjust icon colors
- Search bar styling

**Verification:**
- User feedback/A/B test
- All header functionality intact

---

## Part 8: Component Architecture

### New Components

```
components/
├── shared/
│   └── filters/
│       ├── control-bar.tsx        # Sticky sort/filter bar
│       ├── sort-modal.tsx         # Bottom sheet for sort options
│       ├── filter-hub.tsx         # Main filter modal
│       ├── filter-section.tsx     # Individual filter row
│       ├── visual-selectors/
│       │   ├── color-swatches.tsx
│       │   ├── size-tiles.tsx
│       │   └── price-slider.tsx
│       └── filter-context.tsx     # State management
```

### State Management Strategy

```typescript
// filter-context.tsx
interface FilterState {
  // Pending selections (not yet applied)
  pending: Record<string, string[]>
  // Currently applied filters (in URL)
  applied: Record<string, string[]>
  // Live result count
  resultCount: number | null
  isLoading: boolean
}

// Actions
type FilterAction =
  | { type: 'SET_PENDING'; key: string; values: string[] }
  | { type: 'APPLY_FILTERS' }
  | { type: 'CLEAR_ALL' }
  | { type: 'SET_COUNT'; count: number }
```

---

## Part 9: Animation Specifications

### Modal Enter/Exit
```css
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes slide-down {
  from { transform: translateY(0); }
  to { transform: translateY(100%); }
}
```

### Drill-Down Navigation
```css
/* L1 exits left */
.filter-level--exit {
  animation: slide-out-left 200ms ease-out forwards;
}

/* L2 enters from right */
.filter-level--enter {
  animation: slide-in-right 200ms ease-out forwards;
}
```

### Result Count Update
```css
@keyframes pulse-subtle {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

.result-count--updating {
  animation: pulse-subtle 300ms ease-in-out;
}
```

---

## Part 10: Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Filter modal open → apply time | Unknown | < 5 seconds |
| Page reloads during browsing | High | Minimize to essential |
| Filter abandonment rate | Unknown | < 30% |
| Mobile touch target compliance | Partial | 100% ≥44px |
| Zero-result filter selections | Possible | Prevented by live count |

---

## Appendix A: Comparison with Competitors

| Feature | Treido Current | eBay | Vinted | Proposed |
|---------|---------------|------|--------|----------|
| Filter entry point | Drawer button | Modal button | Modal button | Control bar |
| Filter navigation | Flat list | Drill-down | Drill-down | Drill-down |
| Live result count | ❌ | ✅ | ✅ | ✅ |
| Visual selectors | Text only | Mixed | Swatches | Swatches + Tiles |
| Sort location | In filter | Separate | Separate | Separate (Control bar) |

---

## Appendix B: Accessibility Requirements

- Modal focus trap when open
- Escape key closes modal
- Touch target minimum: 44×44px
- Color swatches include text labels
- Screen reader announces filter selections
- Keyboard navigation for all controls

---

## Appendix C: Integration with Bottom Navbar

**Current:** Bottom navbar exists for main navigation

**Conflict Resolution:**
- Filter Hub modal overlays bottom navbar
- Control bar sits in main content area, not conflicting
- Modal z-index above navbar (`z-50`)
- Navbar remains visible until modal opens

---

*Document Version: 2.0*  
*Last Updated: January 8, 2026*
