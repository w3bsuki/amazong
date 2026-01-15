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

## Complete Component Audit

### ✅ Files Investigated

| Component | File | Current Size | Analysis |
|-----------|------|--------------|----------|
| Mobile Tab Bar | `mobile-tab-bar.tsx` | `h-12` (48px) grid cells | **Good** — Full cell height gives excellent touch |
| Mobile Header Row | `site-header.tsx` | `h-10` (40px) | **Acceptable** — WCAG compliant |
| Back Button | `site-header.tsx` | `size-9` (36px) | ⚠️ **Borderline** — could improve |
| Hamburger Trigger | `sidebar-menu-v2.tsx` | `h-9 w-9` (36px) via Button `size="icon"` | ⚠️ **Undersized** — should be 40px |
| Wishlist Button | `mobile-wishlist-button.tsx` | `size-touch` = **36px** | ⚠️ **Uses custom token** — check token value |
| Cart Button | `mobile-cart-dropdown.tsx` | `size-touch` = **36px** | ⚠️ **Same issue** |
| Notifications | `notifications-dropdown.tsx` | `size-10` (40px) | **Good** ✓ |
| Search Bar | `site-header.tsx` | `h-10` (40px) | **Good** ✓ |

### Critical Finding: Token Discrepancy

The `size-touch` utility maps to `--spacing-touch` which is **2.25rem = 36px**.

But the actual values in globals.css are:
```css
--spacing-touch-xs: 1.75rem;   /* 28px - NOT 24px as documented */
--spacing-touch-sm: 2rem;      /* 32px - NOT 28px as documented */  
--spacing-touch:    2.25rem;   /* 36px - NOT 32px as documented */
--spacing-touch-lg: 2.75rem;   /* 44px - NOT 36px as documented */
```

**The docs are ONE STEP BEHIND the actual tokens!**

This means elements using `size-touch` (36px) are actually:
- 36px = `h-9` in Tailwind scale
- Slightly below the ideal 40px (`h-10`) for comfortable mobile tapping

---

## Recommended Fix Plan

### Strategy: Bump Touch Tokens +4px (One Tailwind Step)

Since the layout already uses tokens (not hardcoded values), we can update the token definitions to increase all touch targets consistently.

**New token values:**

```css
/* Before */
--spacing-touch-xs: 1.75rem;   /* 28px */
--spacing-touch-sm: 2rem;      /* 32px */
--spacing-touch:    2.25rem;   /* 36px */
--spacing-touch-lg: 2.75rem;   /* 44px */

/* After (+4px each) */
--spacing-touch-xs: 2rem;      /* 32px */
--spacing-touch-sm: 2.25rem;   /* 36px */
--spacing-touch:    2.5rem;    /* 40px */  ← Now matches h-10
--spacing-touch-lg: 3rem;      /* 48px */  ← Now matches h-12
```

### Impact Analysis

| Component | Token Used | Before | After | Visual Impact |
|-----------|------------|--------|-------|---------------|
| Wishlist Button | `size-touch` | 36px | 40px | +4px each side |
| Cart Button | `size-touch` | 36px | 40px | +4px each side |
| Hamburger Menu | `Button size="icon"` | 36px | N/A (doesn't use token) | **Separate fix needed** |
| Back Button | `size-9` hardcoded | 36px | N/A | **Separate fix needed** |

### Additional Component Fixes

1. **Hamburger Menu Trigger** (`sidebar-menu-v2.tsx`)
   - Change: Add `size-10` to SSR placeholder span
   - Change: Button already uses `size="icon"` which is 36px — need explicit `size-10`

2. **Back Button** (`site-header.tsx`)
   - Change: `size-9` → `size-10`

3. **Header Row Height** (`site-header.tsx`)
   - Optional: `h-10` → `h-11` (40px → 44px) to accommodate larger buttons
   - Risk: May increase total header height by 4px

---

## Implementation Checklist

### Phase 1: Token Update (globals.css)
- [ ] Update `--spacing-touch-xs`: 1.75rem → 2rem
- [ ] Update `--spacing-touch-sm`: 2rem → 2.25rem
- [ ] Update `--spacing-touch`: 2.25rem → 2.5rem
- [ ] Update `--spacing-touch-lg`: 2.75rem → 3rem

### Phase 2: Hardcoded Size Fixes
- [ ] `sidebar-menu-v2.tsx`: SSR span `h-9 w-9` → `size-10`
- [ ] `sidebar-menu-v2.tsx`: Button add explicit class override or use `size-touch`
- [ ] `site-header.tsx`: Back button `size-9` → `size-10`

### Phase 3: Documentation Update
- [ ] `docs/DESIGN.md`: Sync touch target table with actual values

### Phase 4: Verification
- [ ] Run typecheck
- [ ] Run E2E smoke tests
- [ ] Manual iPhone test
- [ ] Verify header height doesn't break sticky positioning

---

## Decision: APPROVED

**Approach:** Bump all touch tokens +4px AND fix hardcoded sizes.

**Rationale:**
1. Uses proper token system (no arbitrary values)
2. Consistent 4px grid alignment
3. Minimal layout impact (most elements already have flex/grid containers)
4. All touch targets will be ≥40px, exceeding WCAG 2.2 AA (24px min)

**Risk:** Low — touch targets becoming slightly larger is universally positive for mobile UX.

---

## Status: Ready for Implementation

Next steps:
1. Implement Phase 1 (token update)
2. Implement Phase 2 (hardcoded fixes)
3. Run verification gates
4. Update documentation

---

## Desktop Audit

See separate file: [AUDIT-desktop-touch-targets.md](AUDIT-desktop-touch-targets.md)

**Result:** No desktop changes needed.

---

## Final Implementation Scope

**Mobile-only changes:**

### 1. Token Update (globals.css)
Bump touch tokens +4px to align with modern mobile UX:
```css
--spacing-touch-xs: 2rem;      /* 32px (was 28px) */
--spacing-touch-sm: 2.25rem;   /* 36px (was 32px) */
--spacing-touch:    2.5rem;    /* 40px (was 36px) */
--spacing-touch-lg: 3rem;      /* 48px (was 44px) */
```

### 2. Hardcoded Mobile Fixes
- `sidebar-menu-v2.tsx`: SSR span + Button → `size-10`
- `site-header.tsx`: Back button → `size-10`

### 3. Documentation Sync
- Update `docs/DESIGN.md` touch target table

**No desktop changes required.**
