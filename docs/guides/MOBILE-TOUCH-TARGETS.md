# Mobile Touch Targets & Icon Sizing Guide

**Created:** 2026-01-15  
**Status:** Implemented  
**Stack:** Tailwind CSS v4 + Phosphor Icons

---

## Design System Summary

### The 65% Fill Rule

For mobile header icons (icon-only buttons without labels), use **65% fill ratio**:

```
Icon Size / Touch Target = 65%
26px / 40px = 65%
```

This provides:
- Visible, prominent icons
- Adequate touch area (WCAG 2.2 compliant: ≥24px)
- Tight spacing without excessive gaps

### Design Tokens (globals.css)

```css
/* Touch targets */
--spacing-touch-xs: 2rem;      /* 32px - minimum WCAG */
--spacing-touch-sm: 2.25rem;   /* 36px - compact */
--spacing-touch: 2.5rem;       /* 40px - header icons */
--spacing-touch-lg: 3rem;      /* 48px - bottom nav */

/* Icon sizes (65% fill ratio) */
--size-icon-xs: 1.25rem;       /* 20px - small inline */
--size-icon-sm: 1.375rem;      /* 22px - compact header */
--size-icon: 1.5rem;           /* 24px - bottom nav (50% of 48px) */
--size-icon-header: 1.625rem;  /* 26px - header icons (65% of 40px) */
--size-icon-lg: 1.75rem;       /* 28px - large/bold */
```

### Final Values

| Area | Touch Target | Icon | Fill | Tailwind Token |
|------|--------------|------|------|----------------|
| **Header icons** | 40px | 26px | 65% | `size-(--spacing-touch)` + `size-(--size-icon-header)` |
| **Header row** | 40px | — | — | `h-(--spacing-touch)` |
| **Bottom nav** | 48px | 24px | 50% | `h-(--spacing-touch-lg)` + `size-(--size-icon)` |

---

## Implementation Patterns

### Header Icon Button (40px touch, 26px icon)

```tsx
// ✅ PREFERRED: Using design tokens
<button className="size-(--spacing-touch) [&_svg]:size-(--size-icon-header)">
  <Icon weight="regular" />
</button>

// ✅ ACCEPTABLE: Using Tailwind scale (when tokens match)
<button className="size-10 [&_svg]:size-[1.625rem]">
  <Icon weight="regular" />
</button>

// ✅ ACCEPTABLE: Using explicit size prop with token value
<button className="size-(--spacing-touch)">
  <Icon size={26} weight="regular" />
</button>
```

### Bottom Nav Icon (48px touch, 24px icon)

```tsx
<Link className="flex flex-col items-center justify-center w-full h-full">
  <Icon className="size-(--size-icon)" weight="regular" />
  <span className="text-2xs">{label}</span>
</Link>
```

Container uses `h-(--spacing-touch-lg)` (48px) with `grid-cols-5`.

---

## Tailwind CSS v4 Token Reference

### Touch Target Tokens

| Token | Class | Pixels | Use Case |
|-------|-------|--------|----------|
| `--spacing-touch-xs` | `size-(--spacing-touch-xs)` | 32px | Minimum (WCAG 2.2 enhanced) |
| `--spacing-touch-sm` | `size-(--spacing-touch-sm)` | 36px | Compact header |
| `--spacing-touch` | `size-(--spacing-touch)` | 40px | **Standard header (recommended)** |
| `--spacing-touch-lg` | `size-(--spacing-touch-lg)` | 48px | Material Design / Bottom nav |

### Icon Size Tokens

| Token | Class | Pixels | Use Case |
|-------|-------|--------|----------|
| `--size-icon-xs` | `size-(--size-icon-xs)` | 20px | Small inline icons |
| `--size-icon-sm` | `size-(--size-icon-sm)` | 22px | Compact header icons |
| `--size-icon` | `size-(--size-icon)` | 24px | **Bottom nav icons** |
| `--size-icon-header` | `size-(--size-icon-header)` | 26px | **Header icons (recommended)** |
| `--size-icon-lg` | `size-(--size-icon-lg)` | 28px | Large/bold icons |

### Equivalent Tailwind Scale (for reference)

| Token Value | Tailwind Class | Pixels |
|-------------|----------------|--------|
| 2rem | `size-8` | 32px |
| 2.25rem | `size-9` | 36px |
| 2.5rem | `size-10` | 40px |
| 2.75rem | `size-11` | 44px |
| 3rem | `size-12` | 48px |

---

## Component Checklist

### Header Components (use `size-(--spacing-touch)` + `size-(--size-icon-header)`)

- [x] `components/layout/sidebar/sidebar-menu-v2.tsx` — Hamburger menu trigger
- [x] `components/dropdowns/notifications-dropdown.tsx` — Bell icon
- [x] `components/shared/wishlist/mobile-wishlist-button.tsx` — Heart icon
- [x] `components/layout/header/cart/mobile-cart-dropdown.tsx` — Cart icon
- [x] `components/layout/header/site-header.tsx` — Back button (product pages)

### Bottom Nav Components (use `h-(--spacing-touch-lg)` + `size-(--size-icon)`)

- [x] `components/mobile/mobile-tab-bar.tsx` — All 5 nav icons

---

## WCAG 2.2 Compliance

### Target Size (Minimum) — Level AA

> The size of the target for pointer inputs is at least 24 by 24 CSS pixels.

**Our compliance:** ✅ 40px touch targets exceed minimum by 67%

### Exceptions (where smaller is OK)

1. **Spacing:** Targets can be smaller if there's 24px spacing to nearest target
2. **Inline:** Text links within sentences
3. **User agent:** Browser-controlled elements
4. **Essential:** Size is legally required

---

## Common Mistakes to Avoid

### ❌ Don't: Use Button variant that overrides icon size

```tsx
// BAD - Button's size="icon" forces [&_svg]:size-5 (20px)
<Button size="icon">
  <Icon size={26} />  // size prop ignored!
</Button>
```

### ✅ Do: Override with design token

```tsx
// GOOD - Token-based override wins
<Button size="icon" className="[&_svg]:size-(--size-icon-header)">
  <Icon />
</Button>
```

### ❌ Don't: Mix touch target and icon size incorrectly

```tsx
// BAD - 48px touch with 20px icon = huge gaps (42% fill)
<button className="size-(--spacing-touch-lg)">
  <Icon className="size-(--size-icon-xs)" />
</button>
```

### ✅ Do: Maintain ~65% fill ratio using matching tokens

```tsx
// GOOD - 40px touch with 26px icon = 65% fill
<button className="size-(--spacing-touch)">
  <Icon className="size-(--size-icon-header)" />
</button>

// GOOD - 48px touch with 24px icon = 50% fill (nav bar)
<button className="size-(--spacing-touch-lg)">
  <Icon className="size-(--size-icon)" />
</button>
```

### ❌ Don't: Use arbitrary values when tokens exist

```tsx
// BAD - Hardcoded arbitrary value
<button className="size-[40px] [&_svg]:size-[26px]">

// GOOD - Semantic tokens
<button className="size-(--spacing-touch) [&_svg]:size-(--size-icon-header)">
```

---

## Restoration Steps

If touch targets get broken, here's how to restore:

### 1. Header Icons (40px/26px)

```bash
# Files to check
components/layout/sidebar/sidebar-menu-v2.tsx
components/dropdowns/notifications-dropdown.tsx
components/shared/wishlist/mobile-wishlist-button.tsx
components/layout/header/cart/mobile-cart-dropdown.tsx
components/layout/header/site-header.tsx
```

Search for: `size-` classes on button/span wrappers
Replace with:
- Touch target: `size-(--spacing-touch)` or `size-10`
- Icon: `size-(--size-icon-header)` or `[&_svg]:size-(--size-icon-header)`

### 2. Bottom Nav Icons (48px/24px)

```bash
# File
components/mobile/mobile-tab-bar.tsx
```

Ensure:
- Container: `h-(--spacing-touch-lg)` or `h-12` (48px)
- Icons: `size-(--size-icon)` or `size-6` (24px)

### 3. Header Row Height

```bash
# File
components/layout/header/site-header.tsx
```

Mobile header row should be: `h-(--spacing-touch)` or `h-10` (40px)

---

## Token Reference (globals.css)

All touch and icon tokens are defined in `@theme` block:

```css
/* Touch targets */
--spacing-touch-xs: 2rem;      /* 32px - minimum WCAG */
--spacing-touch-sm: 2.25rem;   /* 36px - compact */
--spacing-touch: 2.5rem;       /* 40px - header icons */
--spacing-touch-lg: 3rem;      /* 48px - bottom nav */

/* Icon sizes */
--size-icon-xs: 1.25rem;       /* 20px */
--size-icon-sm: 1.375rem;      /* 22px */
--size-icon: 1.5rem;           /* 24px */
--size-icon-header: 1.625rem;  /* 26px */
--size-icon-lg: 1.75rem;       /* 28px */
```

**Recommended:** Use token classes like `size-(--spacing-touch)` for maintainability.

---

## Verification

```bash
# Typecheck
pnpm -s exec tsc -p tsconfig.json --noEmit

# E2E smoke tests
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

Visual verification: Check mobile viewport (375px width) in dev tools.
