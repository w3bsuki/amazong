# Treido UI/UX Evolution Plan — Opus Edition

**Generated:** January 8, 2026  
**Context:** Gemini 3 ideation + Existing codebase analysis + eBay mobile benchmark  
**Goal:** Evolve the current fast, clean UI/UX into a best-in-class mobile shopping experience without sacrificing performance or simplicity.

---

## Executive Summary

The current Treido mobile UI is **fast and functional** but has UX friction in the browsing/filtering flow. This plan proposes a **"Filter Hub"** paradigm shift that:

1. **Eliminates reload-on-every-tap** for category navigation
2. **Consolidates filtering into a focused, drill-down modal** (eBay-inspired)
3. **Adds live result counts** so users never land on empty pages
4. **Preserves circles for L0→L2 category browsing** (visual familiarity)
5. **Upgrades attribute/filter selection** to a professional bottom sheet modal

### Key Principles

| Principle | Current State | Target State |
|-----------|---------------|--------------|
| Filter Experience | Drawer with flat list | Drill-down "Hub" modal with live counts |
| Category Circles | Reload on every tap | Keep for L0→L2, URL navigation preserved |
| Result Feedback | Static "Show results" button | Dynamic "Show 450 Results" with pulse animation |
| Visual Polish | Functional but inconsistent | eBay/Temu density + clean hierarchy |
| Touch Targets | Mixed (some < 44px) | Consistent 44-48px for all interactive rows |

---

## Part 1: The Filter Hub Architecture

### 1.1 Current Pain Points

Based on codebase analysis of `mobile-filters.tsx` and `mobile-home-tabs.tsx`:

1. **Circles reload products on every tap** — Even for L1/L2 navigation, the entire product grid reloads
2. **Filter drawer is flat** — All options visible at once; no progressive disclosure
3. **No live count feedback** — User doesn't know if their selection yields 0 results until after navigation
4. **"Filter" button competes with circles** — Two mental models for refinement

### 1.2 Proposed Flow: Circles + Hub

```
┌─────────────────────────────────────────────────────────────┐
│ [Sort ▼]                              [Filter / Refine ▼]   │  ← Sticky Control Bar
├─────────────────────────────────────────────────────────────┤
│ ○ Electronics  ○ Fashion  ○ Home  ○ Auto  ○ Sports  →      │  ← L0 Pills (keep)
├─────────────────────────────────────────────────────────────┤
│ ◉ Phones  ○ Laptops  ○ TVs  ○ Audio  ○ Cameras  ←          │  ← L1 Circles (keep)
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐            │
│  │Product │  │Product │  │Product │  │Product │            │
│  │  Card  │  │  Card  │  │  Card  │  │  Card  │            │
│  └────────┘  └────────┘  └────────┘  └────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Tapping "Filter / Refine"** opens the **Filter Hub Modal**:

```
┌─────────────────────────────────────────────────────────────┐
│  ━━━━━━━━  (Drag handle)                                    │
├─────────────────────────────────────────────────────────────┤
│  Refine Your Search                              [Clear All]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Category          Electronics > Phones         [>] │   │ ← Drill-down row
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Price             $100 - $500                  [>] │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Brand             Apple, Samsung               [>] │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Color             (Visual Swatches)            [>] │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Condition         New, Like New                [>] │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Show 1,247 Results                          │   │ ← Live count CTA
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Drill-Down Navigation (Apple Settings Style)

When user taps "Brand", the modal **slides left** and shows:

```
┌─────────────────────────────────────────────────────────────┐
│  ← Brand                                         [Clear]    │
├─────────────────────────────────────────────────────────────┤
│  🔍 Search brands...                                        │
├─────────────────────────────────────────────────────────────┤
│  ☑ Apple                                           (324)    │
│  ☑ Samsung                                         (256)    │
│  ☐ Google                                          (89)     │
│  ☐ OnePlus                                         (67)     │
│  ☐ Xiaomi                                          (45)     │
│  ☐ Sony                                            (23)     │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Show 580 Results                            │   │ ← Updated live
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Key behaviors:**
- Horizontal slide animation (300ms ease-out)
- "← Back" returns to Level 1 (slide right)
- Search input for long lists (> 8 options)
- Per-option counts in parentheses (optional, requires API)
- Checkbox = multi-select, Radio = single-select

---

## Part 2: Visual Styling Specifications

### 2.1 Modal Container

```css
/* Bottom sheet modal */
.filter-hub-modal {
  /* Shape */
  border-radius: 24px 24px 0 0; /* rounded-t-3xl */
  
  /* Size */
  max-height: 90dvh;
  min-height: 50dvh;
  
  /* Background */
  background: var(--color-background); /* white / neutral-900 */
  
  /* Overlay */
  backdrop: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

/* Drag handle */
.drag-handle {
  width: 48px;  /* w-12 */
  height: 6px;  /* h-1.5 */
  background: var(--color-muted-foreground);
  opacity: 0.3;
  border-radius: 9999px;
  margin: 8px auto;
}
```

### 2.2 Filter Rows (Level 1)

```css
.filter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px; /* h-14 — comfortable thumb tap */
  padding: 0 16px;
  border-bottom: 1px solid var(--color-border-subtle); /* border-border/30 */
}

.filter-row-label {
  font-size: 15px; /* text-[15px] — slightly larger than text-sm */
  font-weight: 600; /* font-semibold */
  color: var(--color-foreground);
}

.filter-row-preview {
  font-size: 13px; /* text-[13px] */
  font-weight: 500;
  color: var(--color-primary); /* trust blue */
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filter-row-chevron {
  width: 20px;
  height: 20px;
  color: var(--color-muted-foreground);
  opacity: 0.6;
}
```

### 2.3 Visual Selectors (Colors)

**DO:** Use color swatches, not text labels.

```css
.color-swatch {
  width: 40px;  /* w-10 */
  height: 40px; /* h-10 */
  border-radius: 9999px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: transform 100ms ease;
}

.color-swatch:active {
  transform: scale(0.95);
}

.color-swatch[data-selected="true"] {
  box-shadow: 0 0 0 2px var(--color-primary), 0 0 0 4px var(--color-background);
}
```

### 2.4 Size Tiles (Fashion)

**DO:** Use tile grid, not dropdown.

```css
.size-tile-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.size-tile {
  height: 48px; /* h-12 */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  border-radius: 8px; /* rounded-lg */
  font-size: 14px;
  font-weight: 500;
  transition: all 100ms ease;
}

.size-tile[data-selected="true"] {
  background: var(--color-foreground);
  color: var(--color-background);
  border-color: var(--color-foreground);
}
```

### 2.5 CTA Button (Live Count)

```css
.show-results-btn {
  width: 100%;
  height: 48px; /* h-12 */
  border-radius: 9999px; /* rounded-full */
  background: var(--color-primary);
  color: white;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(var(--color-primary-rgb), 0.2);
  transition: transform 100ms ease;
}

.show-results-btn:active {
  transform: scale(0.98);
}

.show-results-btn[data-updating="true"] {
  animation: pulse 200ms ease-out;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  100% { opacity: 1; }
}

.show-results-btn[data-empty="true"] {
  background: var(--color-muted);
  color: var(--color-muted-foreground);
  cursor: not-allowed;
}
```

### 2.6 Control Bar (Sort + Filter Entry)

```css
.control-bar {
  position: sticky;
  top: var(--header-height); /* Dynamic from JS */
  z-index: 40;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border-subtle);
  padding: 8px var(--page-inset);
  display: flex;
  gap: 8px;
}

.control-bar[data-scrolled="true"] {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
```

---

## Part 3: Smart Context Defaults

### 3.1 Category-Aware Filter Ordering

The Filter Hub should **re-order** filter rows based on the active category:

| Category | Priority Filters (Top 3) |
|----------|-------------------------|
| Fashion | Size, Gender, Color |
| Electronics | Brand, Condition, Model |
| Vehicles | Make, Model, Year |
| Home & Garden | Material, Style, Room |
| Beauty | Brand, Skin Type, Cruelty Free |

**Implementation:** Pass `categoryRootSlug` to Filter Hub and use a priority map:

```typescript
const FILTER_PRIORITY: Record<string, string[]> = {
  fashion: ['size', 'gender', 'color', 'brand'],
  electronics: ['brand', 'condition', 'model', 'storage'],
  vehicles: ['make', 'model', 'year', 'mileage'],
  // ... etc
}
```

### 3.2 Recent/Popular Options First

Within each filter, sort options by:
1. **User's recent selections** (localStorage)
2. **Global popularity** (from product counts)
3. **Alphabetical** (fallback)

---

## Part 4: Keeping Current Strengths

### 4.1 Category Circles — KEEP

The circle navigation (L0→L2) is **visually distinctive** and provides quick drill-down. **Do not remove.**

**Improvements:**
- Add subtle spring animation on tap (100ms scale 0.95→1)
- Show badge with product count on hover/long-press (optional)
- Ensure circles don't trigger full page reload when `circlesNavigateToPages=false`

### 4.2 Quick Pills (L3) — KEEP

The horizontal pill scroll for deep categories works well. **Keep as-is.**

### 4.3 Product Cards — POLISH

Current cards are functional but need refinement per Gemini feedback:

**Changes:**
1. **Enforce 1:1 aspect ratio** for image container (`aspect-square`)
2. **Price prominence:** Make price `text-base font-bold`, title `text-sm font-medium`
3. **Wishlist icon:** Move from gray circle overlay to subtle top-right icon (no background)
4. **Subtle card border:** Add `border border-border/50` on mobile (currently desktop-only)
5. **Limit title to 2 lines** with `line-clamp-2`

### 4.4 Sticky Bottom Nav — KEEP

The 5-tab bottom nav (Home, Categories, Sell, Chat, Account) is standard and works. No changes needed.

---

## Part 5: Implementation Roadmap

### Phase 1: Filter Hub Foundation (2-3 days)

| Task | Files | Priority |
|------|-------|----------|
| Create `FilterHubModal` component | `components/shared/filters/filter-hub-modal.tsx` | P0 |
| Add drill-down navigation state | Same file | P0 |
| Wire up live count API endpoint | `app/api/products/count/route.ts` | P0 |
| Replace `MobileFilters` trigger with hub entry | `mobile-home-tabs.tsx`, `categories/[slug]/page.tsx` | P0 |

### Phase 2: Visual Polish (1-2 days)

| Task | Files | Priority |
|------|-------|----------|
| Color swatch selector component | `components/shared/filters/color-swatches.tsx` | P1 |
| Size tile selector component | `components/shared/filters/size-tiles.tsx` | P1 |
| Slide animation for drill-down | `filter-hub-modal.tsx` | P1 |
| Pulse animation for count update | Same | P1 |

### Phase 3: Smart Defaults (1 day)

| Task | Files | Priority |
|------|-------|----------|
| Category-aware filter ordering | `lib/filter-priority.ts` | P2 |
| Recent selections localStorage | `hooks/use-recent-filters.ts` | P2 |

### Phase 4: Product Card Polish (1 day)

| Task | Files | Priority |
|------|-------|----------|
| Enforce aspect-square images | `product-card-image.tsx` | P1 |
| Adjust price/title typography | `product-card.tsx` | P1 |
| Wishlist icon refinement | `product-card-actions.tsx` | P2 |
| Mobile card borders | `product-card.tsx` | P2 |

---

## Part 6: API Requirements

### 6.1 Live Count Endpoint

```typescript
// POST /api/products/count
// Body: { categoryId, filters: { brand: ['Apple'], minPrice: 100, ... } }
// Response: { count: 1247 }

export async function POST(req: Request) {
  const { categoryId, filters } = await req.json()
  
  // Build Supabase query with filters
  let query = supabase.from('products').select('id', { count: 'exact', head: true })
  
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }
  
  if (filters.brand?.length) {
    query = query.in('attributes->>brand', filters.brand)
  }
  
  // ... apply other filters
  
  const { count } = await query
  return Response.json({ count })
}
```

**Performance:** This is a `HEAD` count query — no data transfer, just `COUNT(*)`.

### 6.2 Per-Option Counts (Optional, Future)

For showing "(324)" next to each brand:

```sql
SELECT 
  attributes->>'brand' as brand,
  COUNT(*) as count
FROM products
WHERE category_id = $1
GROUP BY attributes->>'brand'
ORDER BY count DESC
```

This can be expensive for large catalogs. Consider caching or making it opt-in.

---

## Part 7: Accessibility Checklist

- [ ] Modal has `role="dialog"` and `aria-modal="true"`
- [ ] Focus trapped inside modal when open
- [ ] Escape key closes modal
- [ ] All touch targets ≥ 44×44px
- [ ] Color swatches have `aria-label` with color name
- [ ] Live count updates announced via `aria-live="polite"`
- [ ] Back navigation via swipe-right gesture (iOS affordance)

---

## Part 8: What NOT to Change

| Element | Reason |
|---------|--------|
| Category circle visual design | Users familiar with current look |
| Bottom tab bar layout | Standard pattern, works well |
| Product card grid (2 cols mobile) | Optimal density for price comparison |
| Search input location | Already prominent in header |
| Cart/checkout flow | Not in scope |

---

## Part 9: Risk Mitigation

### Performance Risk: Live Count Queries

**Mitigation:**
- Debounce count requests (300ms after last filter change)
- Show skeleton shimmer while loading
- Cache popular filter combinations (Redis/Vercel KV)
- Fall back to "Show Results" (no count) if query > 2s

### UX Risk: Learning Curve

**Mitigation:**
- Keep current drawer as fallback behind feature flag
- A/B test hub vs drawer with real users
- Add tooltip/coach mark on first use: "Tap here to refine your search"

### Development Risk: Scope Creep

**Mitigation:**
- Phase 1 is MVP: just the hub structure + basic filters
- Visual polish (swatches, tiles) is Phase 2
- Smart defaults is Phase 3 (nice-to-have)

---

## Appendix A: Component Structure

```
components/
  shared/
    filters/
      filter-hub-modal.tsx       # NEW - Main hub component
      filter-hub-row.tsx         # NEW - Individual filter row
      filter-hub-level2.tsx      # NEW - Drill-down content
      color-swatches.tsx         # NEW - Visual color picker
      size-tiles.tsx             # NEW - Tile-based size picker
      mobile-filters.tsx         # EXISTING - Keep for fallback
      desktop-filters.tsx        # EXISTING - No changes
      desktop-filter-modal.tsx   # EXISTING - No changes
```

---

## Appendix B: Tailwind Token Usage

All new components must use existing design tokens from `app/globals.css`:

| Token | Usage |
|-------|-------|
| `--dialog-max-h` | Modal max height |
| `--spacing-touch` | Touch target minimum |
| `--page-inset` | Horizontal padding |
| `--color-primary` | CTA buttons, selected states |
| `--color-muted-foreground` | Secondary text |
| `--color-border` | Dividers, card borders |
| `rounded-t-3xl` | Modal top corners (24px) |
| `rounded-full` | CTA button shape |

**Forbidden:**
- Arbitrary values (`h-[56px]`, `text-[15px]`) — use closest token
- Gradients
- Heavy shadows (`shadow-lg` on cards)

---

## Appendix C: i18n Keys Required

```json
// messages/en.json additions
{
  "FilterHub": {
    "refineSearch": "Refine Your Search",
    "clearAll": "Clear All",
    "showResults": "Show {count} Results",
    "noResults": "No items found",
    "back": "Back",
    "searchPlaceholder": "Search {filterName}...",
    "selected": "{count} selected"
  }
}
```

---

## Appendix D: Reference Screenshots

| Platform | Feature | URL |
|----------|---------|-----|
| eBay Mobile | Filter modal drill-down | [eBay Filters](https://www.ebay.com/b/Cell-Phones-Smartphones/9355) |
| Temu | Category circles + density | [Temu App](https://www.temu.com) |
| Vinted | Bottom sheet filters | [Vinted App](https://www.vinted.com) |
| Amazon | Live count on filter | [Amazon Mobile](https://www.amazon.com) |

---

## Summary: The Treido Filter Hub Advantage

| Before | After |
|--------|-------|
| Flat drawer with all options | Drill-down modal with progressive disclosure |
| Static "Show results" button | Live "Show 1,247 Results" with pulse |
| Generic filter order | Category-aware priority ordering |
| Text labels for colors/sizes | Visual swatches and tile grids |
| Reload on every tap | Batch all selections, single navigation |

**Result:** A mobile shopping experience that matches eBay's filter sophistication while keeping Treido's fast, clean aesthetic.

---

*End of Plan*
