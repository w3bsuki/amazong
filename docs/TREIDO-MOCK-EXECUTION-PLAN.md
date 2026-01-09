# 🎯 Treido-Mock UX Implementation Plan

**Status:** ACTIVE
**Reference:** [inspiration](../inspiration) folder (cloned from `github.com/w3bsuki/treido-mock`)
**Live Demo:** https://www.treido-mock.vercel.app

---

## Executive Summary

The treido-mock demonstrates a superior "Invisible Utility" UX philosophy for mobile marketplaces. This plan adapts those patterns to our **Next.js 16 + Tailwind v4 + shadcn** stack while preserving our existing token system and component boundaries.

### What We're Taking
- ✅ "Smart Anchor" navigation (morphing row pattern)
- ✅ Dense layout rhythm (48px headers, gap-2 grids)
- ✅ Flat card design (borders over shadows)
- ✅ iOS-native touch feedback (active:opacity, no scale gimmicks)
- ✅ High-density product grids
- ✅ Inline filter strip pattern

### What We're Keeping
- ✅ Our Tailwind v4 `@theme` tokens (`bg-background`, `text-foreground`, etc.)
- ✅ Our shadcn/ui primitives
- ✅ Our `next-intl` i18n infrastructure
- ✅ Our component boundaries (`components/ui`, `components/mobile`, etc.)
- ✅ Our touch-size utilities (`h-touch-sm`, `size-touch`, `pb-safe`)
- ✅ Our dark mode support via semantic tokens

---

## Phase 1: Smart Anchor Navigation (Priority: HIGH)

**Goal:** Replace stacked navigation rows with a single "morphing row" that transforms based on depth.

### Current State
- Multiple sticky rows stack up (tabs → circles → pills)
- Uses space inefficiently on mobile
- `contextual-double-decker-nav.tsx` exists but isn't fully Treido-style

### Target State (from treido-mock)
```
State 0 (Root):     [Women] [Men] [Kids]
State 1 (L1):       [← Women] [Shoes] [Clothing] [Bags]
State 2 (L2):       [← Shoes] [Sneakers] [Boots] [Sandals]
```

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `components/mobile/category-nav/smart-anchor-nav.tsx` | CREATE | New component implementing morphing row |
| `components/mobile/category-nav/contextual-double-decker-nav.tsx` | REFACTOR | Update to use smart anchor pattern |
| `app/[locale]/(main)/categories/[slug]/page.tsx` | MODIFY | Wire up new nav component |

### Implementation Details

**Smart Anchor Component:**
```tsx
// Visual Structure (from treido-mock COMPONENT_PATTERNS.md)
<div className="bg-muted/50 backdrop-blur-md border-b border-border">
  <div className="flex items-center px-3 h-[48px] gap-2 overflow-x-auto no-scrollbar">
    {/* ANCHOR (only when drilled down) */}
    {hasParent && (
      <button className="shrink-0 h-8 pl-2 pr-3.5 bg-foreground text-background rounded-full flex items-center gap-1.5 active:scale-95">
        <ArrowLeft className="w-3.5 h-3.5 stroke-[3]" />
        <span className="text-[13px] font-bold">{parentName}</span>
      </button>
    )}
    
    {/* SIBLINGS (next level options) */}
    {options.map(opt => (
      <button className="whitespace-nowrap h-8 px-4 rounded-full text-[13px] font-semibold border bg-background text-muted-foreground border-border active:opacity-90">
        {opt.name}
      </button>
    ))}
  </div>
</div>
```

**Key Treido Rules:**
1. Anchor is ALWAYS `bg-foreground text-background` (black pill)
2. Anchor ALWAYS has ArrowLeft icon
3. Siblings are ALWAYS outlined (white with border)
4. On state change, container scrolls to `left: 0`

---

## Phase 2: Dense Product Grid (Priority: HIGH)

**Goal:** Tighter gaps, flat cards, structured content hierarchy.

### Current State
- Cards have varying padding/spacing
- Some cards use shadows
- Grid gaps inconsistent

### Target State
- Grid: `grid-cols-2 gap-2 px-3`
- Cards: `border border-border rounded-md p-2 bg-card shadow-none`
- Image: `aspect-square rounded-sm bg-muted`
- Title: `text-[13px] font-medium leading-tight line-clamp-2`
- Price: `text-[15px] font-bold`

### Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `components/shared/product/product-card.tsx` | REFACTOR | Apply Treido density patterns |
| `components/mobile/product/product-card-mobile.tsx` | REFACTOR | If exists, align with above |

### Key Changes
1. Remove any `shadow-*` classes
2. Change `rounded-xl` → `rounded-md` (cards), `rounded-sm` (images)
3. Tighten padding: `p-3` → `p-2`
4. Ensure `active:border-foreground/30` for touch feedback

---

## Phase 3: Filter Strip (Priority: MEDIUM)

**Goal:** Dense horizontal filter strip that scrolls with content.

### Target Pattern (from treido-mock)
```tsx
<div className="px-3 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
  <button className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-[13px] font-bold shadow-sm active:bg-muted">
    <Filter className="w-3.5 h-3.5 stroke-[2.5]" />
    Filters
  </button>
  <div className="w-[1px] h-6 bg-border mx-1" /> {/* Divider */}
  {quickFilters.map(f => (
    <button className="px-3 py-2 bg-card border border-border rounded-lg text-[13px] font-medium active:bg-muted whitespace-nowrap">
      {f.label} <ChevronDown className="w-3 h-3 inline-block ml-1 opacity-50" />
    </button>
  ))}
</div>
```

### Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `components/mobile/category-nav/inline-filter-bar.tsx` | REFACTOR | Apply Treido pattern |
| `components/shared/filters/filter-chips.tsx` | REFACTOR | Align styling |

---

## Phase 4: Header Cleanup (Priority: MEDIUM)

**Goal:** Consistent 48px header with clean iconography.

### Target Pattern
- Header height: exactly `h-[48px]`
- Icons: `w-[22px] h-[22px] stroke-[1.5]`
- Touch targets: `w-9 h-9 rounded-full active:bg-muted`
- Title: `text-[17px] font-bold truncate`

### Files to Review

| File | Action | Description |
|------|--------|-------------|
| `components/layout/header/*.tsx` | AUDIT | Check heights and icon sizing |
| `components/mobile/category-nav/contextual-category-header.tsx` | REFACTOR | Apply 48px rhythm |

---

## Phase 5: Bottom Nav Polish (Priority: LOW)

**Goal:** Consistent fixed bottom nav with proper safe area handling.

### Target Pattern
```tsx
<nav className="fixed bottom-0 w-full h-[48px] bg-card/95 backdrop-blur-xl border-t border-border/60 pb-safe z-50">
  {/* Nav items */}
</nav>
```

---

## Token Mapping (Treido-Mock → Our Tokens)

| Treido-Mock | Our Equivalent | Notes |
|-------------|----------------|-------|
| `bg-white` | `bg-card` or `bg-background` | Semantic for dark mode |
| `bg-zinc-50` | `bg-muted` | App background |
| `bg-zinc-900` | `bg-foreground` | Active pills |
| `text-zinc-900` | `text-foreground` | Primary text |
| `text-zinc-500` | `text-muted-foreground` | Secondary text |
| `border-zinc-200` | `border-border` | Standard borders |
| `border-zinc-100` | `border-border/50` | Subtle borders |
| `rounded-md` | `rounded-md` | Same (6px) |
| `rounded-sm` | `rounded-sm` | Same (4px) |

---

## Component-by-Component Comparison

### ProductCard

| Aspect | Treido-Mock | Our Current | Action |
|--------|-------------|-------------|--------|
| Container | `p-2 border rounded-md shadow-none` | `p-3 border rounded-md shadow-sm` | Tighten padding, remove shadow |
| Image | `aspect-square rounded-sm` | `aspect-square rounded-md` | Change to `rounded-sm` |
| Title | `text-[13px] font-medium line-clamp-2` | `text-sm font-medium line-clamp-2` | Keep (close enough) |
| Price | `text-[15px] font-bold` | `text-base font-semibold` | Keep |
| Tags | `text-[9px] uppercase bg-foreground/90` | varies | Standardize |
| Touch feedback | `active:border-foreground/30` | varies | Add consistently |

### Navigation Pills

| Aspect | Treido-Mock | Our Current | Action |
|--------|-------------|-------------|--------|
| Height | `h-8` (32px) | `h-8` | Same ✓ |
| Shape | `rounded-full` | `rounded-full` | Same ✓ |
| Active | `bg-foreground text-background` | `bg-foreground text-background` | Same ✓ |
| Inactive | `bg-background border-border` | `bg-background border-border/60` | Similar ✓ |
| Font | `text-[13px] font-semibold` | `text-[13px] font-medium` | Adjust weight |

---

## Execution Order

### Sprint 1: Foundation (Est. 3-5 changes)
1. [ ] Create `smart-anchor-nav.tsx` component
2. [ ] Integrate smart anchor in category page (mobile only)
3. [ ] Update product card density (padding, shadows)

### Sprint 2: Refinement (Est. 3-5 changes)
4. [ ] Refactor filter strip pattern
5. [ ] Polish header heights to 48px
6. [ ] Ensure consistent touch feedback across pills/buttons

### Sprint 3: Polish (Est. 2-3 changes)
7. [ ] Bottom nav safe area fixes
8. [ ] Typography fine-tuning (title sizes, weights)
9. [ ] Final QA pass on mobile responsive

---

## Verification Gates

For each change:
```bash
# Type check
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke (mobile routes)
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

---

## Anti-Patterns to Avoid

From treido-mock `MASTER_STYLE_GUIDE.md`:

| ❌ Never | ✅ Instead |
|----------|-----------|
| `shadow-md`, `shadow-lg`, `shadow-xl` | `border border-border` |
| `rounded-2xl`, `rounded-3xl` | `rounded-md` (cards), `rounded-full` (pills) |
| `scale-90` on touch | `active:opacity-70` or `active:bg-muted` |
| Stacking 3+ header rows | Smart Anchor single morphing row |
| Arbitrary hex colors | Semantic tokens (`bg-muted`, `text-foreground`) |

---

## Reference Files (in `/inspiration`)

- `guide/MASTER_STYLE_GUIDE.md` - Laws of physics
- `guide/COMPONENT_PATTERNS.md` - Blueprints for complex UI
- `guide/04_UX_LOGIC_NAVIGATION.md` - Smart anchor state machine
- `components/CategoryPage.tsx` - Reference implementation
- `components/ProductCard.tsx` - Card pattern
- `components/FilterStrip.tsx` - Filter strip pattern

---

## Success Metrics

After implementation:
1. Mobile category navigation fits in ≤2 sticky rows (vs 3-4 current)
2. Product grid visual density matches treido-mock
3. All touch feedback uses opacity/bg, not scale
4. No `shadow-md+` classes on mobile components
5. E2E smoke passes
