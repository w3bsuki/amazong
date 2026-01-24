# Design System

This is the **single source of truth** for UI/UX and styling rules in this repo.

Stack: **Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui**.

Goal: A premium, world-class marketplace UI inspired by StockX, Grailed, and modern e-commerce leaders.

---

## Design Philosophy

**Bold hierarchy, not bland minimalism.** Our design system uses semantic colors purposefully to create visual interest and clear information hierarchy. "Clean" doesn't mean boring—it means intentional.

### Key Principles

1. **Use semantic colors for meaning**
   - Green (`shipping-free`, `success`) for positive signals (free shipping, verified, savings)
   - Blue (`verified`, `info`) for trust signals and verification badges
   - Red (`destructive`, `price-sale`) for urgency and sale prices
   - Yellow/amber (`rating`, `warning`) for ratings and warnings

2. **Create visual weight through contrast**
   - Large, bold prices (text-4xl font-bold)
   - Subtle backgrounds with color tints for emphasis
   - Rounded containers with subtle borders
   - Strategic use of shadows for elevation

3. **Premium product presentations**
   - Vertical thumbnail galleries (like StockX)
   - Square product images with generous padding
   - Dual CTA patterns (Buy Now / Make Offer)
   - Trust signals with colored icon backgrounds

---

## Non-Negotiables (Repo Rails)

- **No arbitrary Tailwind values** (`h-[42px]`, `text-[13px]`) unless absolutely necessary.
- **Use semantic tokens** from Tailwind v4 theme (see globals.css).
- **All user-facing strings via `next-intl`**.
- **Touch targets ≥32px minimum** (WCAG compliance).

---

## Implementation Rules (Tailwind v4 + shadcn/ui)

- Prefer semantic tokens (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`) over Tailwind palette classes (`text-blue-600`, `bg-zinc-100`, etc.).
- Don't introduce gradients. Prefer solid token surfaces + subtle borders.
- Don't introduce arbitrary values (`w-[…]`, `text-[…]`, `bg-[#…]`) unless there is no stable token alternative.
- **Hex color policy**: Hex values (e.g. `bg-[#AABBCC]`) are allowed **only** for real product color swatches (see `components/shared/filters/color-swatches.tsx`), not for general UI.
- Use the existing touch target utilities from `app/globals.css` (`h-touch-xs/sm/...`) instead of inventing custom heights.
- For forms, use `components/shared/field.tsx` (`Field`, `FieldLabel`, `FieldError`, …) and `components/ui/*` inputs/buttons.

Drift scans:

```bash
pnpm -s styles:scan
pnpm -s styles:gate
```

---

## Semantic Color System

Our globals.css defines rich semantic colors. **USE THEM.**

### Status & Trust
| Token | Class | Use |
|-------|-------|-----|
| `--color-success` | `text-success`, `bg-success` | Positive states |
| `--color-warning` | `text-warning`, `bg-warning` | Warnings, attention |
| `--color-error` | `text-error`, `bg-error` | Errors, destructive |
| `--color-info` | `text-info`, `bg-info` | Informational |
| `--color-verified` | `text-verified`, `bg-verified` | Verified badges |
| `--color-shipping-free` | `text-shipping-free`, `bg-shipping-free` | Free shipping |

### Mobile Surfaces (Product Pages)
| Token | Class | Use |
|-------|-------|-----|
| `--surface-page` | `bg-surface-page` | Page canvas (visible gray) |
| `--surface-card` | `bg-surface-card` | Cards (pure white for contrast) |
| `--surface-elevated` | `bg-surface-elevated` | Elevated elements (bottom bar) |
| `--surface-gallery` | `bg-surface-gallery` | Gallery background (near black) |
| `--surface-overlay` | `bg-surface-overlay` | Image counter overlays |
| `--surface-floating` | `bg-surface-floating` | Floating buttons on gallery |

### Pricing
| Token | Class | Use |
|-------|-------|-----|
| `--color-price-regular` | `text-price-regular` | Regular prices |
| `--color-price-sale` | `text-price-sale` | Sale/reduced prices |
| `--color-price-original` | `text-price-original` | Strikethrough prices |
| `--color-price-savings` | `text-price-savings` | "Save X%" text |

### Condition Badges
| Token | Class | Use |
|-------|-------|-----|
| `--color-condition-new` | `text-condition-new` | New items |
| `--color-condition-likenew` | `text-condition-likenew` | Like new |
| `--color-condition-good` | `text-condition-good` | Good condition |
| `--color-condition-fair` | `text-condition-fair` | Fair condition |

### Ratings
| Token | Class | Use |
|-------|-------|-----|
| `--color-rating` | `text-rating`, `fill-rating` | Star ratings |
| `--color-wishlist` | `text-wishlist` | Heart/wishlist icons |

---

## Token Quick Reference

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `rounded-none` | 0 | Tables, borders |
| `rounded-sm` | 2px | Badges, inline elements |
| `rounded-md` | 4px | **Cards, buttons, inputs (default)** |
| `rounded-lg` | 6px | Dialogs, sheets, modals |
| `rounded-xl` | 8px | Hero cards (rare) |
| `rounded-full` | 9999px | **Pills, chips, avatars, category circles** |

**Rule**: Cards and containers use `rounded-md`. Interactive pills/chips use `rounded-full`.

### Spacing (4px grid)

| Token | Pixels | Use |
|-------|--------|-----|
| `gap-1` | 4px | Inline items, icon + text |
| `gap-1.5` | 6px | Tight groups |
| `gap-2` | 8px | **Mobile default between items** |
| `gap-3` | 12px | **Desktop default between items** |
| `gap-4` | 16px | Between sections (mobile) |
| `gap-6` | 24px | Between sections (desktop) |
| `p-2` | 8px | Card internal padding (mobile) |
| `p-3` | 12px | Card internal padding (desktop) |
| `px-4` | 16px | Container horizontal edge padding |

**Rule**: Mobile = `gap-2`, Desktop = `gap-3`. Section spacing = `py-6` (mobile) / `py-8` (desktop).

### Typography

| Token | Size | Use |
|-------|------|-----|
| `text-2xs` | 10px | Tiny badges, micro labels |
| `text-xs` | 12px | Meta text, captions, timestamps |
| `text-sm` | 14px | **Body text (default)** |
| `text-base` | 16px | Prices, emphasis |
| `text-lg` | 18px | Section headings |
| `text-xl` | 20px | Page titles, logo |
| `text-2xl+` | 24px+ | Hero headlines only |

**Weights**:
- `font-normal` (400): Body text
- `font-medium` (500): Labels, navigation items
- `font-semibold` (600): Prices, CTAs, headings
- `font-bold` (700): Hero only (rare)

**Rule**: Default body = `text-sm font-normal`. Prices = `text-base font-semibold`.

### Touch Targets

| Token | Size | Use |
|-------|------|-----|
| `h-touch-xs` | 32px | Minimum (inline icons, compact chips) |
| `h-touch-sm` | 36px | **Compact buttons, chips** |
| `h-touch` | 40px | Standard buttons, icon buttons |
| `h-touch-lg` | 48px | Primary CTA buttons |

**Rule**: All tappable elements ≥32px. Pills/chips = `h-touch-sm rounded-full`.

### Semantic Colors

| Class | Use |
|-------|-----|
| `bg-background` | Page/section canvas |
| `bg-surface-page` | Muted page canvas (subtle tint) |
| `bg-card` | Elevated surfaces (cards, modals) |
| `bg-muted` | Subdued backgrounds, inactive states |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text, placeholders |
| `border-border` | Standard borders |
| `bg-foreground text-background` | **Active/inverted pill state** |

**Rule**: Never hardcode `bg-white`, `text-black`, or `border-gray-*`. Use semantic tokens.

---

## Page Surfaces (PageShell)

**Single source of truth for page canvases.** Use the `PageShell` component (`components/shared/page-shell.tsx`) instead of hand-coding `min-h-screen bg-*` patterns.

### Variants
| Variant | Background | Use |
|---------|------------|-----|
| `default` | `bg-background` | Clean white/dark canvas — most pages (auth, account, profile) |
| `muted` | `bg-surface-page` | Subtle page tint — grid pages (home, search, PDP) |

### Usage
```tsx
import { PageShell } from "@/components/shared/page-shell";

// Default (clean background)
<PageShell className="pb-24">
  <YourPageContent />
</PageShell>

// Muted (grid pages, product pages)
<PageShell variant="muted" className="pb-10">
  <YourPageContent />
</PageShell>
```

### Props
- `variant`: `"default" | "muted"` (default: `"default"`)
- `fullHeight`: `boolean` (default: `true`) — applies `min-h-dvh`
- `className`: Additional styles (padding, responsive visibility, etc.)

**Rule**: Stop using `min-h-screen bg-muted/30`, `bg-surface-page`, or `bg-background` directly. Use `PageShell`.

---

## Surfaces

### "Glass" sticky surfaces (headers / strips / bottom bars)
Use *one consistent recipe*:
- `bg-background/90 backdrop-blur-md border-b border-border/50`
- For bottom nav: `bg-card/95 backdrop-blur-xl border-t border-border/60`

---

## Pills / Chips (the key Treido pattern)

### The canonical chip style
- Height: `h-touch-sm`
- Shape: `rounded-full`
- Inactive: outlined + muted text
- Active: **inverted** (foreground background) for instant clarity

Recommended states:
- **Active**: `bg-foreground text-background border-foreground`
- **Inactive**: `bg-background text-muted-foreground border-border/60 hover:bg-muted/40 hover:text-foreground`

---

## Product Cards

- Image is the hero, with a subtle border
- Wishlist icon is a small floating button with blur
- Text block is compact; title truncates

**Standard card classes**:
```
rounded-md border border-border bg-card
```

**Typography stack**:
- Price: `text-sm font-semibold` or `text-base font-semibold`
- Title: `text-xs font-medium line-clamp-1`
- Meta: `text-2xs text-muted-foreground`

---

## Anti-Patterns to Avoid

- **Hard-coded grays/whites** instead of semantic tokens
- **Arbitrary sizes** for typography/offsets (`top-[105px]`, `text-[10px]`)
- **Scale animations** on hover/press — use subtle background/border transitions instead
- **Over-shadowing** — use border separation + muted backgrounds

---

## Quick "Good Defaults"

- Card: `rounded-md border border-border bg-card p-3`
- Section spacing: `space-y-2` (mobile) / `space-y-3` (desktop)
- Muted surface: `bg-muted/50 text-muted-foreground border-border`
- Active pill: `bg-foreground text-background border-foreground`
- Inactive pill: `bg-background text-muted-foreground border-border/60`
- Sticky header: `bg-background/90 backdrop-blur-md border-b border-border/50`
- Bottom nav: `bg-card/95 backdrop-blur-xl border-t border-border/60`

---

## Accessibility Baseline

- Every dialog/drawer must trap focus and restore focus on close.
- Inputs must have labels (or accessible name) + clear error text.

---

## Component Boundaries

- `components/ui/**`: primitives only (shadcn-style). No feature composites, no app hooks.
- `components/shared/**`: shared composites used across routes.
- `components/layout/**`: shells (header/nav/sidebars).
- Route-owned UI must live under its route group: `app/[locale]/(group)/**/_components/**`.

---

## Verification Gates

For any non-trivial UI work:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
