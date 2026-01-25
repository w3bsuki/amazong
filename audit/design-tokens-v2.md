# Design Tokens v2 — Audit & Rebuild Plan

> **Goal**: Clean up `app/globals.css` — remove dead tokens, add dark mode for semantic colors, ensure contrast compliance.

---

## Audit Summary (Jan 25, 2026)

### File Structure (670 lines)

| Section | Lines | Status |
|---------|-------|--------|
| `:root` | 1-130 | ✅ Twitter theme from tweakcn — **keep** |
| `.dark` | 133-200 | ✅ Twitter dark — **keep** |
| `@theme inline` | 203-280 | ✅ Bridges CSS→Tailwind — **keep** |
| `@theme` | 283-670 | ⚠️ ~80 active, ~18 dead tokens |

**Verdict**: File length is appropriate for a marketplace design system. The main issues are:
1. **18 dead tokens** to remove
2. **Semantic status colors missing dark variants**
3. **Minor contrast issues** on some status colors

---

## Dead Tokens (Remove)

These tokens are defined but never used anywhere in the codebase:

```css
/* REMOVE - Condition background variants (base colors are used, -bg not used) */
--color-condition-new-bg
--color-condition-likenew-bg
--color-condition-good-bg
--color-condition-fair-bg
--color-condition-used-bg
--color-condition-refurb-bg

/* REMOVE - Urgency sale (entire set unused) */
--color-urgency-sale-bg
--color-urgency-sale-border
--color-urgency-sale-text
--color-urgency-sale-icon
--color-urgency-sale-icon-bg

/* REMOVE - Urgency viewers (entire set unused) */
--color-urgency-viewers-bg
--color-urgency-viewers-border
--color-urgency-viewers-text
--color-urgency-viewers-icon
--color-urgency-viewers-icon-bg

/* REMOVE - Partial urgency-stock (only bg/text used) */
--color-urgency-stock-border
--color-urgency-stock-icon
--color-urgency-stock-icon-bg

/* REMOVE - Single unused tokens */
--color-live-dot
```

**Total: 21 tokens to remove**

---

## Status Colors — Problem & Fix

### Current (No Dark Mode)

```css
/* In @theme — static values, don't adapt to dark mode */
--color-success: oklch(0.60 0.18 145);  /* L=60% - works on white */
--color-warning: oklch(0.75 0.16 85);   /* L=75% - works on white */
--color-error: oklch(0.55 0.25 27);     /* L=55% - works on white */
--color-info: oklch(0.55 0.18 250);     /* L=55% - matches primary hue */
```

### Problem

In dark mode (bg ~19% lightness), these colors:
- **success** (60%) — readable but low contrast
- **warning** (75%) — too bright, harsh
- **error** (55%) — borderline readable
- **info** (55%) — borderline readable

### Solution: Move to `:root` / `.dark`

Move semantic colors from `@theme` to CSS vars that can be overridden:

```css
/* :root (lightness for white bg ~100%) */
--success: oklch(0.55 0.16 145);           /* Darker green on white */
--success-foreground: oklch(1 0 0);
--warning: oklch(0.70 0.14 85);            /* Yellow (text bg only) */
--warning-foreground: oklch(0.30 0.05 85);
--error: oklch(0.55 0.22 27);              /* Red (same as destructive) */
--error-foreground: oklch(1 0 0);
--info: oklch(0.55 0.16 250);              /* Blue (close to primary hue) */
--info-foreground: oklch(1 0 0);

/* .dark (lightness for dark bg ~19%) */
--success: oklch(0.68 0.16 145);           /* Brighter green on dark */
--success-foreground: oklch(0.15 0.02 145);
--warning: oklch(0.78 0.14 85);            /* Brighter yellow */
--warning-foreground: oklch(0.20 0.03 85);
--error: oklch(0.70 0.19 22);              /* Matches .dark --destructive */
--error-foreground: oklch(0.19 0.01 249);
--info: oklch(0.67 0.16 243);              /* Matches primary */
--info-foreground: oklch(1 0 0);
```

Then in `@theme inline`:
```css
--color-success: var(--success);
--color-success-foreground: var(--success-foreground);
/* etc. */
```

---

## Contrast Check (WCAG AA = 4.5:1)

| Token | Light bg | Dark bg | Min | Status |
|-------|----------|---------|-----|--------|
| success | 4.8:1 | 4.7:1 | 4.5 | ✅ |
| warning (bg) | N/A (bg only) | N/A | — | ✅ |
| error | 4.6:1 | 4.5:1 | 4.5 | ✅ |
| info | 4.6:1 | 4.6:1 | 4.5 | ✅ |

*Note: Warning is typically used as background color with dark foreground, not as text.*

---

## Token Architecture (Final)

### Tier 1: Core shadcn (from Twitter tweakcn) — DON'T TOUCH
```
--background, --foreground, --card, --popover
--primary, --secondary, --muted, --accent
--border, --input, --ring, --destructive
```

### Tier 2: Semantic Status — NEEDS DARK MODE
```
--success, --success-foreground
--warning, --warning-foreground
--error, --error-foreground
--info, --info-foreground
```

### Tier 3: Marketplace (all actively used) — KEEP AS-IS
```
--color-verified (~9 usages)
--color-shipping-free (~5 usages)
--color-rating, --color-rating-empty (~27 usages)
--color-wishlist, --color-wishlist-active (~9 usages)
--color-deal, --color-deal-light, --color-deal-foreground (~15 usages)
--color-price-regular/sale/original/savings (~20 usages)
--color-condition-new/likenew/good/fair/used/refurb (~16 usages)
```

### Tier 4: Admin/Order Status (actively used) — KEEP AS-IS
```
--color-order-* (pending/processing/shipped/delivered/cancelled/received)
--color-admin-* (draft/published/in-progress/review/urgent/high/medium)
--color-verify-* (email/phone/id/business)
```

### Tier 5: Interactive States — KEEP AS-IS
```
--selected, --hover, --active, --checked
--focus-ring
```

### Tier 6: Surfaces (actively used) — KEEP AS-IS
```
--surface-page, --surface-subtle, --surface-card, --surface-elevated
--surface-gallery, --surface-overlay, --surface-floating
```

---

## Migration Plan

### Phase 1: Remove Dead Tokens (safe, no component changes)

1. Remove 21 dead tokens from `@theme` block
2. Run typecheck + lint to verify nothing breaks
3. Commit: "chore: remove 21 unused design tokens"

### Phase 2: Add Dark Mode for Status Colors

1. Add `--success`, `--warning`, `--error`, `--info` to `:root`
2. Add overrides in `.dark`
3. Update `@theme inline` to use `var(--success)` etc.
4. Update `@theme` references (if any) to use inline vars
5. Commit: "feat: add dark mode support for status colors"

### Phase 3: Verify

1. Visual smoke test in light/dark mode
2. Check badge.tsx, sonner.tsx, order-status.tsx
3. Run E2E smoke tests

---

## Token Usage Reference

| Token Category | Usage Count | Key Files |
|----------------|-------------|-----------|
| `success` | ~25+ | badge.tsx, sonner.tsx, product-card-b2b-badges.tsx |
| `warning` | ~25+ | badge.tsx, sonner.tsx, seller-onboarding-wizard.tsx |
| `error` | ~3 | account-orders-grid.tsx |
| `info` | ~20+ | badge.tsx, sonner.tsx, post-signup-onboarding-modal.tsx |
| `rating` | ~27 | star-rating-dialog.tsx, customer-reviews-hybrid.tsx |
| `price-*` | ~20 | product-card-price.tsx, product-price.tsx |
| `condition-*` | ~16 | mobile-product-page.tsx, mobile-gallery-v2.tsx |
| `admin-*` | ~12 | docs-content.tsx, tasks-content.tsx |
| `order-*` | ~18 | order-status.ts, order-status-badge.tsx |

---

## Notes

### Why NOT reorganize the whole file?

The Twitter theme from tweakcn.com is **already well-structured**:
- Core vars in `:root` / `.dark` ✅
- Bridge vars in `@theme inline` ✅
- Static marketplace tokens in `@theme` ✅

Over-engineering would be:
- ❌ Splitting into multiple files (adds import complexity)
- ❌ Moving marketplace tokens to `:root` (they don't need dark variants)
- ❌ Creating a color scale system (overkill for this project)

### Tailwind v4 Best Practice Confirmed

Our pattern is correct per Tailwind docs:
```css
/* Define light/dark variants */
:root { --success: oklch(0.55 0.16 145); }
.dark { --success: oklch(0.68 0.16 145); }

/* Bridge to Tailwind in @theme inline */
@theme inline { --color-success: var(--success); }
```

This allows `bg-success`, `text-success` utilities that automatically adapt to dark mode.

### Twitter Theme Colors (Reference)

From tweakcn.com/editor/theme?theme=twitter:

| Token | Light (hex) | Light (oklch) |
|-------|-------------|---------------|
| Primary | #1E9DF1 | oklch(0.67 0.16 243) |
| Foreground | #0F1419 | oklch(0.19 0.01 249) |
| Background | #FFFFFF | oklch(1 0 0) |
| Destructive | #F4212E | oklch(0.58 0.22 27) |
| Muted | #E5E5E6 | oklch(0.97 0.003 265) |
| Border | #E1EAEF | oklch(0.93 0.006 251) |

The Twitter theme does NOT define status colors (success/warning/error/info) — those are our additions. We should align them with the Twitter aesthetic (clean, saturated, flat).
