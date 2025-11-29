# STYLING.md - Full Tailwind CSS v4 + shadcn/ui Standardization Plan

## ✅ Implementation Status

### Completed ✅

| Component | Changes Made |
|-----------|-------------|
| `globals.css` | Typography tokens, @utility classes, reduced shadows, --radius: 0.125rem |
| `button.tsx` | rounded-sm, font-normal |
| `card.tsx` | rounded-sm, CardTitle font-medium |
| `product-card.tsx` | No animations, no hover:border, font-normal for titles, font-medium for prices |
| `subcategory-circles.tsx` | No active:scale, border-2, font-medium |
| `category-circles.tsx` | font-semibold titles, font-normal links |
| `tabbed-product-section.tsx` | All font weights reduced one level |
| `deals-section.tsx` | All font weights reduced, removed color hovers |
| `promo-card.tsx` | font-medium badge, font-bold highlight, rounded-sm |
| `site-header.tsx` | font-semibold logo, font-normal sell link, rounded-sm |
| `hero-carousel.tsx` | font-semibold title, font-medium CTA, no active-scale |
| `header-dropdowns.tsx` | All font-bold → font-medium/semibold, all titles |
| `add-to-cart.tsx` | font-normal buttons |
| `mobile-tab-bar.tsx` | font-normal labels, font-medium badge |
| `site-footer.tsx` | font-normal back-to-top, font-medium titles, rounded-sm button |
| `mega-menu.tsx` | font-normal triggers/labels, font-medium headings |
| `daily-deals-banner.tsx` | font-semibold badge/title, font-medium buttons, no scale |
| `accordion.tsx` | font-normal triggers, rounded-sm |
| `badge.tsx` | font-normal, rounded-sm, no transitions |
| `dialog.tsx` | font-medium title, rounded-sm |
| `tabs.tsx` | font-normal triggers, rounded-sm, no transitions |
| `alert.tsx` | font-normal title, rounded-sm |
| `input.tsx` | rounded-sm, font-normal file text |

### Font Weight Mapping Applied

| Before | After | Usage |
|--------|-------|-------|
| `font-black` | `font-bold` | Hero highlights only |
| `font-bold` | `font-semibold` | Section titles, h2 |
| `font-semibold` | `font-medium` | Prices, emphasis |
| `font-medium` | `font-normal` | Body, links, buttons |

---

## Executive Summary

This document provides a complete audit and refactoring plan to standardize the project's styling following:
- **Tailwind CSS v4** best practices (design tokens, CSS-first configuration)
- **shadcn/ui** accessibility and component patterns
- **eBay.com** visual reference (clean, thin fonts, no effects)

### Key Findings from eBay.com Audit

| Property | eBay Value | Our Current | Status |
|----------|------------|-------------|--------|
| **Font Family** | `"Market Sans", Arial, sans-serif` | `Inter, sans-serif` | ✅ Keep Inter (modern equivalent) |
| **Base Font Size** | `14px` | Mixed (`text-sm`=14px) | ✅ Standardized |
| **Base Font Weight** | `400` (normal) | Mixed (`font-bold`, `font-medium`) | ✅ Fixed - lighter weights |
| **Line Height** | `1.43` (~20px/14px) | Mixed | ✅ Standardized |
| **Letter Spacing** | `normal` | `0em` | ✅ OK |
| **H2 Font Weight** | `700` (bold) | Mixed (`font-bold`) | ✅ OK for headings only |
| **H2 Font Size** | `21px` | Mixed | ✅ Standardized |
| **Link Font Weight** | `400` | Mixed | ✅ Fixed |
| **Button Border Radius** | `0px` | `rounded-sm` (2px) | ✅ Fixed - sharp radii |
| **Box Shadow** | `none` | --shadow-product: none | ✅ Removed |
| **Hover Effects** | None (underline only) | Scale/zoom removed | ✅ Removed |

---

## Part 1: Typography Token System

### Current Problems
1. **Inconsistent font weights**: `font-bold`, `font-semibold`, `font-medium`, `font-light` used randomly
2. **Hardcoded sizes**: `text-[10px]`, `text-[11px]`, `text-[13px]`, `text-[16px]`, `text-[18px]`, `text-[28px]`
3. **Missing scale hierarchy**: No clear heading/body/caption scale

### Solution: Typography Tokens for `globals.css`

```css
/* ===== TYPOGRAPHY SCALE (eBay-inspired) ===== */
/* Base: 14px (text-sm equivalent) */

:root {
  /* === FONT WEIGHTS (LIGHT/NORMAL PREFERENCE) === */
  --font-weight-thin: 300;      /* Rarely used */
  --font-weight-normal: 400;    /* DEFAULT - body, links, buttons */
  --font-weight-medium: 500;    /* Emphasis */
  --font-weight-semibold: 600;  /* Section titles */
  --font-weight-bold: 700;      /* Headings only */
  
  /* === FONT SIZES (Semantic Scale) === */
  --text-2xs: 0.625rem;    /* 10px - badges, tiny labels */
  --text-xs: 0.6875rem;    /* 11px - captions, meta */
  --text-sm: 0.8125rem;    /* 13px - small text */
  --text-base: 0.875rem;   /* 14px - DEFAULT body */
  --text-md: 0.9375rem;    /* 15px - enhanced body */
  --text-lg: 1rem;         /* 16px - large body */
  --text-xl: 1.125rem;     /* 18px - section titles */
  --text-2xl: 1.3125rem;   /* 21px - h2 (eBay style) */
  --text-3xl: 1.5rem;      /* 24px - h1 */
  --text-4xl: 1.75rem;     /* 28px - hero */
  
  /* === LINE HEIGHTS === */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.43;   /* eBay default: 20px/14px */
  --leading-relaxed: 1.625;
  --leading-loose: 2;
}

@theme inline {
  /* Typography tokens exposed to Tailwind */
  --font-weight-thin: var(--font-weight-thin);
  --font-weight-normal: var(--font-weight-normal);
  --font-weight-medium: var(--font-weight-medium);
  --font-weight-semibold: var(--font-weight-semibold);
  --font-weight-bold: var(--font-weight-bold);
  
  --text-2xs: var(--text-2xs);
  --text-xs: var(--text-xs);
  --text-sm: var(--text-sm);
  --text-base: var(--text-base);
  --text-md: var(--text-md);
  --text-lg: var(--text-lg);
  --text-xl: var(--text-xl);
  --text-2xl: var(--text-2xl);
  --text-3xl: var(--text-3xl);
  --text-4xl: var(--text-4xl);
}
```

### Custom Utilities for Typography

```css
/* === TYPOGRAPHY UTILITIES === */
@utility text-heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: -0.01em;
}

@utility text-heading-2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-snug);
}

@utility text-heading-3 {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--leading-snug);
}

@utility text-body {
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
}

@utility text-body-sm {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
}

@utility text-caption {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  color: var(--muted-foreground);
}

@utility text-label {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-tight);
}

@utility text-price {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-none);
  letter-spacing: -0.01em;
}

@utility text-price-lg {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-none);
  letter-spacing: -0.01em;
}
```

---

## Part 2: Component Styling Standardization

### Remove All Animations, Shadows, and Effects

#### Files to Update

| File | Current Issue | Fix |
|------|--------------|-----|
| `product-card.tsx` | `hover:border-brand` animation | Remove, use simple underline on text |
| `category-circles.tsx` | No issues | ✅ |
| `subcategory-circles.tsx` | `active:scale-95 transition-transform` | Remove scale effects |
| `promo-card.tsx` | Shadows, gradients | Remove |
| `hero-carousel.tsx` | Gradient overlays | Simplify |
| `deals-section.tsx` | Glow effects | Remove |
| `globals.css` | `--shadow-product`, `--shadow-product-hover` | Keep minimal or remove |

### Product Card Standardization

**Before (current)**:
```tsx
<Card className="... hover:border-brand ... group-hover:text-brand">
```

**After (eBay-style)**:
```tsx
<Card className="bg-card border border-border rounded-sm">
  {/* Image - no hover effects */}
  <CardContent className="p-3">
    <Image ... />
  </CardContent>
  
  {/* Text - underline on hover only */}
  <CardFooter className="p-3">
    <h3 className="text-body font-normal group-hover:underline">
      {title}
    </h3>
    <span className="text-price">{price}</span>
  </CardFooter>
</Card>
```

### Category/Subcategory Circles

**Before**:
```tsx
"active:scale-95 transition-transform"
"group-hover:text-link group-hover:underline"
```

**After**:
```tsx
"group-hover:underline"  // Simple underline only
// NO scale effects
// NO transforms
```

---

## Part 3: Font Weight Standardization

### Rule: Prefer Lighter Weights (eBay uses `font-weight: 400` everywhere)

| Element Type | Current | Target | Tailwind Class |
|-------------|---------|--------|----------------|
| Body text | Mixed | 400 | `font-normal` |
| Links | `font-medium` | 400 | `font-normal` |
| Buttons | `font-medium` | 400-500 | `font-normal` or `font-medium` |
| Section titles | `font-bold` | 600-700 | `font-semibold` or `font-bold` |
| H1 | `font-bold` | 700 | `font-bold` |
| H2 | `font-bold` | 700 | `font-bold` |
| H3 | `font-semibold` | 600 | `font-semibold` |
| Prices | `font-bold` | 500 | `font-medium` |
| Badges | `font-bold` | 500 | `font-medium` |
| Reviews count | `font-medium` | 400 | `font-normal` |

### Files Requiring Font Weight Updates

```bash
# High priority (visible on homepage)
components/product-card.tsx       # Price: font-bold → font-medium
components/category-circles.tsx   # Title: font-bold → font-semibold
components/subcategory-circles.tsx # Multiple issues
components/tabbed-product-section.tsx # Multiple issues
components/deals-section.tsx      # Price, badges

# Medium priority
components/site-header.tsx        # Logo, nav links
components/site-footer.tsx        # Section titles
components/header-dropdowns.tsx   # Dropdown items

# Low priority (pages)
app/[locale]/page.tsx            # Section headings
app/[locale]/product/[id]/page.tsx # Product details
```

---

## Part 4: Hardcoded Size Elimination

### Replace All `text-[Xpx]` with Semantic Tokens

| Hardcoded | Semantic Token | Usage |
|-----------|---------------|-------|
| `text-[10px]` | `text-2xs` or `text-caption` | Badges, tiny meta |
| `text-[11px]` | `text-xs` | Captions, small labels |
| `text-[12px]` | `text-xs` | Standard small text |
| `text-[13px]` | `text-sm` | Buttons, enhanced small |
| `text-[14px]` | `text-base` | Body text (default) |
| `text-[15px]` | `text-md` | Enhanced body |
| `text-[16px]` | `text-lg` | Large body, button emphasis |
| `text-[18px]` | `text-xl` | Section titles |
| `text-[21px]` | `text-2xl` | H2 headings |
| `text-[24px]` | `text-3xl` | H1 headings |
| `text-[28px]` | `text-4xl` | Hero text |

### Search & Replace Commands

```bash
# Use VS Code Find/Replace with regex
# Pattern: text-\[10px\] → text-2xs
# Pattern: text-\[11px\] → text-xs  
# Pattern: text-\[13px\] → text-sm
# Pattern: text-\[16px\] → text-lg
# Pattern: text-\[18px\] → text-xl
# Pattern: text-\[28px\] → text-4xl
```

---

## Part 5: Border Radius Standardization

### eBay Uses VERY Sharp Corners

| Element | eBay Radius | Our Current | Target |
|---------|-------------|-------------|--------|
| Buttons | 0px | `rounded-md` (6px) | `rounded-sm` (2px) |
| Cards | 0px | `rounded-md` | `rounded-sm` |
| Inputs | 3px | `rounded-md` | `rounded-sm` |
| Badges | pill | `rounded-full` | `rounded-full` ✅ |
| Dropdowns | 3px | `rounded-md` | `rounded-sm` |

### Update globals.css

```css
:root {
  --radius: 0.125rem;  /* 2px - eBay-style sharp */
}
```

---

## Part 6: Shadow Removal

### Current Shadow Tokens (to simplify/remove)

```css
/* CURRENT - Too many shadows */
--shadow-product: 0 2px 8px 0 hsl(0 0% 0% / 0.08);
--shadow-product-hover: 0 8px 24px 0 hsl(0 0% 0% / 0.12);
--shadow-dropdown: 0 4px 16px 0 hsl(0 0% 0% / 0.12);
--shadow-modal: 0 16px 48px 0 hsl(0 0% 0% / 0.20);

/* TARGET - Minimal shadows */
--shadow-product: none;
--shadow-product-hover: none;
--shadow-dropdown: 0 2px 8px 0 hsl(0 0% 0% / 0.08);  /* Light dropdown only */
--shadow-modal: 0 4px 12px 0 hsl(0 0% 0% / 0.10);    /* Light modal only */
```

---

## Part 7: Button Standardization

### shadcn/ui Button Updates

```tsx
// components/ui/button.tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-normal transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-link underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-6",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Key Changes:
1. `rounded-md` → `rounded-sm` (sharper corners)
2. `font-medium` → `font-normal` (lighter weight)
3. Simplified focus states

---

## Part 8: Accessibility (a11y) Improvements

### WCAG 2.1 AA Compliance Checklist

| Requirement | Current Status | Fix |
|-------------|---------------|-----|
| Touch targets ≥44px | ✅ `min-h-11` | OK |
| Color contrast 4.5:1 | ⚠️ Check `text-muted-foreground` | Verify with tool |
| Focus indicators | ✅ `focus-visible:ring` | OK |
| Keyboard navigation | ✅ | OK |
| Screen reader labels | ⚠️ Missing some `aria-label` | Add |
| Skip links | ❌ Missing | Add |

### Add Skip Link Component

```tsx
// components/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground focus:ring-2 focus:ring-ring"
    >
      Skip to main content
    </a>
  )
}
```

---

## Part 9: Component-by-Component Refactor Checklist

### Priority 1: Product Cards (Most Visible)

- [ ] `product-card.tsx`
  - [ ] Remove `hover:border-brand`
  - [ ] Change title `font-medium` → `font-normal`
  - [ ] Change price `font-bold` → `font-medium`
  - [ ] Remove scale animations
  - [ ] Add `text-body` typography utility

### Priority 2: Category Navigation

- [ ] `category-circles.tsx`
  - [ ] Remove scale effects
  - [ ] Simplify hover to underline only
  - [ ] Standardize text sizes

- [ ] `subcategory-circles.tsx`
  - [ ] Remove `active:scale-95 transition-transform`
  - [ ] Remove `font-bold` from "All" button

### Priority 3: Section Headers

- [ ] All `font-bold text-base sm:text-lg` → `text-heading-2`
- [ ] Consistent spacing with `mb-4` or `mb-6`

### Priority 4: Price Display

- [ ] `product-price.tsx`
  - [ ] Change `font-medium` → use `text-price` utility
  - [ ] Remove hardcoded `text-2xl sm:text-[28px]`

### Priority 5: Buttons

- [ ] `components/ui/button.tsx`
  - [ ] `rounded-md` → `rounded-sm`
  - [ ] `font-medium` → `font-normal`

- [ ] All custom buttons in components
  - [ ] Standardize to shadcn Button variants

---

## Part 10: Implementation Order

### Phase 1: Design Tokens (Day 1)
1. Add typography tokens to `globals.css`
2. Add typography utility classes
3. Update `--radius` to `0.125rem`
4. Simplify shadow tokens

### Phase 2: Core Components (Day 2)
1. Update `button.tsx`
2. Update `card.tsx`
3. Update `input.tsx`
4. Update `badge.tsx`

### Phase 3: Product Components (Day 3)
1. Refactor `product-card.tsx`
2. Refactor `product-price.tsx`
3. Update `tabbed-product-section.tsx`
4. Update `deals-section.tsx`

### Phase 4: Navigation (Day 4)
1. Update `site-header.tsx`
2. Update `category-circles.tsx`
3. Update `subcategory-circles.tsx`
4. Update `mega-menu.tsx`

### Phase 5: Pages (Day 5)
1. Homepage sections
2. Product page
3. Search page
4. Cart page

### Phase 6: A11y & Testing (Day 6)
1. Add skip link
2. Check color contrast
3. Test keyboard navigation
4. Cross-browser testing

---

## Appendix A: Complete globals.css Typography Section

```css
/* ===================================================================
   TYPOGRAPHY SYSTEM - eBay-Inspired Clean E-commerce
   =================================================================== */

:root {
  /* === FONT FAMILIES === */
  --font-sans: Inter, system-ui, -apple-system, sans-serif;
  --font-serif: Georgia, serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* === FONT WEIGHTS (PREFER LIGHTER) === */
  --font-weight-thin: 300;
  --font-weight-normal: 400;     /* DEFAULT */
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;       /* Headings only */
  
  /* === FONT SIZES (Based on 14px body) === */
  --text-2xs: 0.625rem;    /* 10px */
  --text-xs: 0.6875rem;    /* 11px */
  --text-sm: 0.8125rem;    /* 13px */
  --text-base: 0.875rem;   /* 14px - DEFAULT */
  --text-md: 0.9375rem;    /* 15px */
  --text-lg: 1rem;         /* 16px */
  --text-xl: 1.125rem;     /* 18px */
  --text-2xl: 1.3125rem;   /* 21px */
  --text-3xl: 1.5rem;      /* 24px */
  --text-4xl: 1.75rem;     /* 28px */
  --text-5xl: 2rem;        /* 32px */
  
  /* === LINE HEIGHTS === */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.43;  /* eBay: 20px / 14px */
  --leading-relaxed: 1.5;
  --leading-loose: 1.625;
  
  /* === LETTER SPACING === */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
}

/* === TYPOGRAPHY UTILITIES === */
@utility text-heading-1 {
  font-size: var(--text-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color: var(--foreground);
}

@utility text-heading-2 {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--leading-snug);
  color: var(--foreground);
}

@utility text-heading-3 {
  font-size: var(--text-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--leading-snug);
  color: var(--foreground);
}

@utility text-section-title {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--leading-snug);
  color: var(--foreground);
}

@utility text-body {
  font-size: var(--text-base);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  color: var(--foreground);
}

@utility text-body-sm {
  font-size: var(--text-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  color: var(--foreground);
}

@utility text-caption {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  color: var(--muted-foreground);
}

@utility text-label {
  font-size: var(--text-xs);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-tight);
  color: var(--foreground);
}

@utility text-price {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-none);
  letter-spacing: var(--tracking-tight);
  color: var(--foreground);
}

@utility text-price-lg {
  font-size: var(--text-2xl);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-none);
  letter-spacing: var(--tracking-tight);
  color: var(--foreground);
}

@utility text-price-sale {
  font-size: var(--text-lg);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-none);
  color: var(--price-sale);
}

@utility text-link {
  font-size: inherit;
  font-weight: var(--font-weight-normal);
  color: var(--link);
  text-decoration-line: none;
  &:hover {
    text-decoration-line: underline;
    color: var(--link-hover);
  }
}

@utility text-meta {
  font-size: var(--text-2xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--leading-normal);
  color: var(--muted-foreground);
}
```

---

## Appendix B: Component Migration Examples

### ProductCard Before/After

**Before:**
```tsx
<h3 className="font-medium text-foreground group-hover:text-brand line-clamp-2 leading-snug text-xs sm:text-sm mb-1 sm:mb-1.5 min-h-8 sm:min-h-10">
  {title}
</h3>
<span className="font-bold text-foreground tracking-tight text-sm sm:text-base md:text-lg">
  {formatPrice(price)}
</span>
```

**After:**
```tsx
<h3 className="text-body-sm group-hover:underline line-clamp-2 min-h-8 sm:min-h-10">
  {title}
</h3>
<span className="text-price">
  {formatPrice(price)}
</span>
```

### Button Before/After

**Before:**
```tsx
<Button className="w-full bg-interactive hover:bg-interactive-hover text-white font-medium rounded-md touch-action-manipulation active:scale-[0.98] min-h-11 text-xs sm:text-sm">
```

**After:**
```tsx
<Button className="w-full min-h-11" size="default">
```

---

## Appendix C: Testing Checklist

### Visual Regression
- [ ] Homepage renders correctly
- [ ] Product cards have no shadows/glows
- [ ] Category circles have no scale effects
- [ ] All text uses consistent weights
- [ ] Buttons have sharp corners

### Typography
- [ ] No hardcoded `text-[Xpx]` values
- [ ] All headings use semantic classes
- [ ] Body text is 14px base
- [ ] Font weight is predominantly 400

### Accessibility
- [ ] Color contrast passes 4.5:1
- [ ] Touch targets ≥44px
- [ ] Focus indicators visible
- [ ] Screen reader tested

### Responsive
- [ ] Mobile (320px) renders correctly
- [ ] Tablet (768px) renders correctly
- [ ] Desktop (1280px) renders correctly
- [ ] No horizontal overflow

---

## Summary

This standardization plan transforms the codebase from:
- ❌ Mixed hardcoded values → ✅ Design tokens
- ❌ Bold/heavy typography → ✅ Light/clean (eBay-style)
- ❌ Animations/effects → ✅ Simple hover underlines
- ❌ Inconsistent sizing → ✅ Semantic scale
- ❌ Rounded corners → ✅ Sharp/minimal radii

**Estimated effort:** 5-6 days of focused work
**Risk level:** Low (mostly CSS changes)
**Breaking changes:** None expected

