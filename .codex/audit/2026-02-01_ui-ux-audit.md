# Audit — 2026-02-01 — UI/UX Mobile Issues

## Scope
- Goal: Identify and fix mobile UI/UX issues across search, drawer animations, category circles, and filter styling
- Bundle: UI (spec-tailwind + spec-shadcn audit + treido-ui)
- Files/routes: /search, /categories, drawers, category components

## TW4 (spec-tailwind subagent audit)

### Scope
- Category circles: `category-circle-visual.tsx`, `category-circle.tsx`, `category-circles.tsx`, `subcategory-circles.tsx`
- Drawers: `drawer.tsx`, `product-quick-view-drawer.tsx`
- Quick view: `quick-view-skeleton.tsx`
- Filters: `quick-filter-row.tsx`

### Findings

| ID | Severity | File:Line | Issue | Proposed Fix |
|----|----------|-----------|-------|--------------|
| TW4-001 | Medium | category-circle-visual.tsx:57 | Opacity hack `ring-border/60` | Use `ring-border-subtle` token |
| TW4-002 | Medium | category-circle.tsx:96 | Opacity hack `border-foreground/20` | Use `border-border` or subtle token |
| TW4-003 | Medium | category-circle.tsx:100 | Opacity hack `text-muted-foreground/70` | Use `text-muted-foreground` |
| TW4-004 | Medium | category-circles.tsx:108 | Opacity hack `bg-background/20` | Use `bg-surface-subtle` |
| TW4-005 | Medium | category-circles.tsx:154 | Opacity hack `border-foreground/30` | Use `border-border` |
| TW4-006 | Medium | category-circles.tsx:160 | Opacity hack `hover:border-foreground/30` | Use `hover:border-border` |
| TW4-007 | Medium | drawer.tsx:233 | Opacity hacks on handle | Use `bg-handle` / `hover:bg-handle-hover` |
| TW4-008 | Low | product-quick-view-drawer.tsx:91 | Opacity hack `border-border/30` | Use `border-border` |
| TW4-009 | Low | quick-filter-row.tsx:140 | Opacity hack `border-border/50` | Use `border-border` |
| TW4-010 | Low | quick-filter-row.tsx:148 | Opacity hack `border-border/30` | Use `border-border` |

### Acceptance Checks
- [x] No palette classes (bg-gray-*, text-blue-*, etc.)
- [x] No gradients (bg-gradient-to-*)
- [x] No arbitrary values in color context
- [ ] No opacity hacks — 10 instances found
- [x] No hardcoded colors (#hex, oklch)

### Risks
- Opacity modifier deprecation: TW4 changes how opacity modifiers work with CSS variables
- Ring border opacity may render incorrectly on high-contrast themes
- Interactive states using opacity modifiers may have inconsistent browser behavior

---

## SHADCN (spec-shadcn subagent audit)

### Scope
- Primitives: `components/ui/drawer.tsx`, `components/ui/skeleton.tsx`, `components/ui/button.tsx`
- Composites: `components/shared/category/category-circle.tsx`, `components/mobile/drawers/product-quick-view-drawer.tsx`, `components/shared/product/quick-view/product-quick-view-content.tsx`

### Findings

| ID | Severity | File:Line | Issue | Proposed Fix |
|----|----------|-----------|-------|--------------|
| SHADCN-001 | Medium | category-circle.tsx:144 | Raw `<button>` in composite | Use `Button` primitive |
| SHADCN-002 | Medium | product-quick-view-content.tsx:306 | Raw `<button>` for qty decrease | Use `Button` primitive |
| SHADCN-003 | Medium | product-quick-view-content.tsx:318 | Raw `<button>` for qty increase | Use `Button` primitive |
| SHADCN-004 | Medium | product-quick-view-content.tsx:358 | Raw `<button>` for "view full listing" | Use `Button` primitive |
| SHADCN-005 | Low | product-quick-view-drawer.tsx:116 | Button size override conflicts with variant | Remove conflicting classes |

### Acceptance Checks
- [x] No `components/ui/*` imports from `app/**`
- [x] No `components/ui/*` imports `next-intl` / `useTranslations`
- [x] No `components/ui/*` imports Supabase / Stripe
- [ ] No raw HTML controls in composites — 4 raw buttons found
- [x] No className palette overrides on primitives

### Risks
- Inconsistent interaction states: raw buttons bypass Button's standardized focus/tap states
- Design drift: size overrides create maintenance burden
- Accessibility gap: raw buttons lack consistent focus-visible behaviors

---

## TREIDO-UI (UX Issues)

### Scope
- User-reported UX issues from screenshots
- Mobile drawer experience
- Category circle sizing and consistency
- Filter/sort button styling

### Findings

| ID | Severity | File:Line | Issue | Proposed Fix |
|----|----------|-----------|-------|--------------|
| UI-001 | HIGH | components/mobile/drawers/product-quick-view-drawer.tsx:84 | Skeleton larger than content - causes jank on load | Match skeleton dimensions to actual content |
| UI-002 | HIGH | components/shared/product/quick-view/quick-view-skeleton.tsx | Skeleton aspect ratio mismatch (4:3 vs actual) | Ensure consistent aspect ratios |
| UI-003 | MED | components/ui/drawer.tsx | Drawer animations may feel sluggish | Optimize animation timing and easing |
| UI-004 | MED | app/globals.css:482 | Category circles at 60px (3.75rem) feel small | Increase to 72px (4.5rem) or larger |
| UI-005 | MED | components/shared/category/category-circle-visual.tsx | Inconsistent Visual: homepage uses pills, /categories uses icons only | Standardize appearance with images+icons |
| UI-006 | LOW | components/mobile/category-nav/quick-filter-row.tsx | Filter pills have styling but may need more emphasis | Review contrast and visual weight |
| UI-007 | MED | Multiple | Drag-to-close requires dragging handle specifically | Review Vaul handleOnly setting |

### Root Cause Analysis

1. **Skeleton Size Mismatch (UI-001, UI-002)**:
   - `QuickViewSkeleton` uses `aspect-4-3` for the image placeholder
   - `ProductQuickViewContent` uses `QuickViewImageGallery` which may have different aspect ratios
   - Content sections have different heights than skeleton placeholders

2. **Category Circle Inconsistency (UI-004, UI-005)**:
   - Homepage header uses `CategoryNavItem` with `variant="pill"` (text-based pills)
   - `/categories` page uses `CategoryCircleVisual` with `variant="muted"` (icon circles)
   - `/categories/[slug]` uses `SubcategoryCircles` for subcategory navigation
   - Main inconsistency: No category images shown, only icons as fallback

3. **Drawer Animation (UI-003, UI-007)**:
   - Vaul drawer has iOS-specific workarounds in `drawer.tsx`
   - The `showHandle` prop controls drag handle visibility
   - Lag may come from `useProductQuickViewDetails` hook fetching data

### Acceptance Checks
- [ ] Skeleton matches actual quick view content size
- [ ] Category circles are visually consistent across routes
- [ ] Drawer animations feel smooth (150-250ms)
- [ ] Filter buttons have appropriate visual weight
- [ ] Drag gestures work predictably

### Risks
- Category circle size increase may affect horizontal scrolling on small screens
- Animation changes need testing on iOS Safari
- Skeleton changes should be tested with slow network conditions

---

## Task Candidates (for TASKS.md)

### Priority 1 - High Impact
1. **UI-SKL-001**: Fix quick view skeleton dimensions to match content
2. **UI-DRW-001**: Audit and optimize drawer animation timing

### Priority 2 - Medium Impact
3. **UI-CAT-001**: Increase category circle size from 60px to 72px
4. **UI-CAT-002**: Ensure category circles show images when available (not just icons)
5. **UI-CAT-003**: Standardize category visual treatment across routes

### Priority 3 - Polish
6. **UI-FLT-001**: Review filter button visual weight and contrast
7. **UI-DRW-002**: Investigate drag gesture sensitivity

---

## Implementation Notes

### Skeleton Fix Approach
```tsx
// quick-view-skeleton.tsx
// Change aspect ratio to match actual content
<Skeleton className="aspect-square w-full rounded-none" /> // Instead of aspect-4-3
```

### Category Circle Size Increase
```css
/* globals.css */
--spacing-category-circle: 4.5rem; /* Was 3.75rem (60px), now 72px */
```

### Drawer Animation Optimization
- Review Vaul's default animation duration
- Consider adding `transition-transform duration-300 ease-out` for smoother feel
- Test on actual iOS device

