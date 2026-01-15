# Task: Improve Mobile Touch Targets

**Created:** 2026-01-15  
**Status:** Planning  
**Scope:** Mobile touch target accessibility improvements (~2px increase)

---

## Problem Statement

Touch targets on mobile feel slightly cramped, especially in the header area. Need to marginally increase hit areas while preserving the tight, dense marketplace layout that defines Treido's UX.

**Constraint:** No arbitrary Tailwind values. Use only design tokens.

---

## Current Token System Analysis

### Touch Target Tokens (globals.css)

```css
--spacing-touch-xs: 1.75rem;   /* 28px */
--spacing-touch-sm: 2rem;      /* 32px */
--spacing-touch:    2.25rem;   /* 36px */
--spacing-touch-lg: 2.75rem;   /* 44px */
```

**Wait — issue identified!** 

The documentation (DESIGN.md) says:
- `h-touch-xs` = 24px
- `h-touch-sm` = 28px  
- `h-touch`    = 32px
- `h-touch-lg` = 36px

But globals.css defines:
- `--spacing-touch-xs` = 1.75rem = **28px**
- `--spacing-touch-sm` = 2rem    = **32px**
- `--spacing-touch`    = 2.25rem = **36px**
- `--spacing-touch-lg` = 2.75rem = **44px**

**The CSS tokens are ALREADY one step larger than documented.** The docs are outdated, OR the tokens were increased and docs not updated.

### Standard Tailwind Spacing Scale (4px grid)

| Token | Pixels | rem |
|-------|--------|-----|
| `6` | 24px | 1.5rem |
| `7` | 28px | 1.75rem |
| `8` | 32px | 2rem |
| `9` | 36px | 2.25rem |
| `10` | 40px | 2.5rem |
| `11` | 44px | 2.75rem |
| `12` | 48px | 3rem |

A **+2px bump** doesn't align cleanly with the 4px grid. Options:
- +4px (one Tailwind step) — bigger change
- +2px via custom token — risks arbitrary values proliferation
- Stay on grid, accept 4px increments

---

## Current Component Audit

### Mobile Tab Bar (`components/mobile/mobile-tab-bar.tsx`)

```tsx
// Bar height
<div className="grid grid-cols-5 h-12 items-center">  // h-12 = 48px ✓

// Tab items - use full cell height
className="flex flex-col items-center justify-center gap-0.5 w-full h-full"

// Sell button (center)
<span className="size-10 flex ...">  // 40px circle ✓
```

**Analysis:**
- Bar: 48px total ✓ (exceeds WCAG minimum)
- Tab touch areas: Full cell width × 48px = excellent
- Sell button: 40px circle ✓
- **No issues here.** The full-height cells give ample touch area.

### Mobile Header (`components/layout/header/site-header.tsx`)

```tsx
// Top row
<div className="h-10 px-(--page-inset) flex items-center gap-0">  // h-10 = 40px

// Back button
className="flex items-center justify-center size-9 rounded-full"  // 36px

// Hamburger menu trigger (SidebarMenuV2)
triggerClassName="justify-start"  // Need to check actual size
```

**Analysis:**
- Header row: 40px — adequate for the row itself
- Back button: 36px (`size-9`) — **borderline** (WCAG 2.2 AA = 24px min)
- Actions area: Need to trace actual button sizes

### Header Icon Buttons (Desktop, but pattern applies)

```tsx
// Icon buttons
className="size-10 [&_svg]:size-6 ..."  // 40px button, 24px icon ✓
```

### Mobile Search Button

```tsx
className="w-full flex items-center gap-2 h-10 px-3 rounded-md"  // 40px ✓
```

---

## The Real Problem Areas

After audit, the pain points are likely:

1. **Hamburger menu trigger** — need to verify its actual size
2. **Header icon buttons on mobile** — may be using smaller variants
3. **Category pills/chips** — documented as `h-touch-sm` (28-32px)
4. **Filter chips** — same concern

Let me trace the actual problematic components:

### SidebarMenuV2 Trigger

Need to check `components/layout/sidebar/sidebar-menu-v2.tsx` for the trigger size.

### Mobile Icon Buttons

The header shows these mobile actions:
- `NotificationsDropdown`
- `MobileWishlistButton`  
- `MobileCartDropdown`

Each likely has its own button sizing.

---

## Proposed Token Changes

### Option A: Bump All Touch Tokens +4px (one Tailwind step)

```css
/* Before */
--spacing-touch-xs: 1.75rem;   /* 28px */
--spacing-touch-sm: 2rem;      /* 32px */
--spacing-touch:    2.25rem;   /* 36px */
--spacing-touch-lg: 2.75rem;   /* 44px */

/* After */
--spacing-touch-xs: 2rem;      /* 32px */
--spacing-touch-sm: 2.25rem;   /* 36px */
--spacing-touch:    2.5rem;    /* 40px */
--spacing-touch-lg: 3rem;      /* 48px */
```

**Pros:**
- Uses standard Tailwind tokens
- Consistent 4px grid
- Significant improvement (4px is noticeable)

**Cons:**
- May feel too big
- Could break tight layouts
- Header might need height adjustment

### Option B: Add Intermediate Tokens (+2px)

```css
/* New intermediate sizes */
--spacing-touch-2xs: 1.625rem; /* 26px - arbitrary! */
--spacing-touch-xs:  1.875rem; /* 30px - arbitrary! */
--spacing-touch-sm:  2.125rem; /* 34px - arbitrary! */
```

**Pros:**
- Precise 2px increase

**Cons:**
- Off-grid arbitrary values ❌
- Violates design system principles
- More tokens to maintain

### Option C: Keep Tokens, Increase Padding/Hit Areas

Instead of changing element heights, add invisible padding or use `min-h-*` + `p-*` combinations to expand touch areas without visual size change.

```tsx
// Before
className="size-9"

// After - same visual, larger hit area  
className="size-9 -m-1 p-1"  // 36px visual, 44px touch
```

**Pros:**
- No token changes
- Preserves visual density
- Surgical fixes per component

**Cons:**
- More verbose
- Easy to forget
- Inconsistent if not systematized

### Option D: Use `min-w-*` and `min-h-*` utilities

Ensure all touchable elements have minimum dimensions:

```tsx
className="size-9 min-w-11 min-h-11"  // 36px visual, 44px minimum touch
```

**Pros:**
- Explicit minimum sizing
- Uses standard Tailwind tokens

**Cons:**
- May cause layout shifts
- Need to audit every component

---

## Recommended Approach: Hybrid (C + Component Fixes)

Given the constraints (no arbitrary values, preserve tight layout), the safest approach is:

### Phase 1: Audit & Document

1. List every touchable element on mobile
2. Measure current sizes
3. Identify sub-40px targets

### Phase 2: Targeted Fixes

For each undersized element, apply ONE of:
- Increase to next token size if visual change is acceptable
- Add negative margin + padding trick for invisible expansion
- Ensure parent containers allow proper sizing

### Phase 3: Update Documentation

Sync DESIGN.md with actual token values.

---

## Specific Component Fixes (Preliminary)

| Component | Current | Target | Method |
|-----------|---------|--------|--------|
| Mobile header height | `h-10` (40px) | `h-11` (44px) | Token bump |
| Back button | `size-9` (36px) | `size-10` (40px) | Direct change |
| Hamburger trigger | TBD | 40px+ | TBD |
| Header icons | TBD | 40px | TBD |
| Category pills | `h-touch-sm` | `h-touch` | Token usage |

---

## Risk Assessment

### Layout Impact

- **Header height +4px:** Minimal, already has `pt-safe` for notch
- **Bottom nav:** Already 48px, no change needed
- **Content shift:** Only if sticky headers change height
- **Scroll positions:** May need `scroll-margin-top` adjustment

### Breaking Changes

- None expected if using existing tokens
- Visual density preserved

### Testing Required

1. Visual regression on all mobile viewports
2. E2E smoke tests
3. Manual iPhone/Android testing
4. Safe area behavior verification

---

## Next Steps

1. [ ] Trace actual sizes of `SidebarMenuV2` trigger
2. [ ] Trace sizes of `NotificationsDropdown`, `MobileWishlistButton`, `MobileCartDropdown`
3. [ ] Measure category pill components
4. [ ] Create specific fix list with before/after
5. [ ] Implement fixes one component at a time
6. [ ] Run typecheck + E2E smoke after each change
7. [ ] Update DESIGN.md token documentation

---

## Files to Investigate

- [ ] `components/layout/sidebar/sidebar-menu-v2.tsx` — hamburger trigger
- [ ] `components/dropdowns/notifications-dropdown.tsx` — bell icon
- [ ] `components/shared/wishlist/mobile-wishlist-button.tsx` — heart icon
- [ ] `components/layout/header/cart/mobile-cart-dropdown.tsx` — cart icon
- [ ] `components/mobile/category-nav/*` — category pills
- [ ] `components/mobile/mobile-home-tabs.tsx` — filter tabs

---

## Decision Needed

**Before implementation, choose:**

- [ ] **Option A:** Bump all touch tokens +4px (bigger change, cleaner)
- [ ] **Option C:** Keep tokens, use padding/margin tricks (surgical, same visual)
- [ ] **Hybrid:** Fix individual components to use existing larger tokens

Recommend: **Hybrid** — promote undersized elements to use `h-10` / `size-10` (40px) where they currently use `h-9` / `size-9` (36px). This is one Tailwind step (4px) but only applied to problematic areas.
