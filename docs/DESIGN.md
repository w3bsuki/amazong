# Design System (Canonical)

This is the **single source of truth** for UI/UX and styling rules in this repo.

Stack: **Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui**.

Goal: A premium, world-class marketplace UI inspired by StockX, Grailed, and modern e-commerce leaders.

Engineering boundaries and production rails: see `docs/ENGINEERING.md`.

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

## Non-negotiables (repo rails)

- **No arbitrary Tailwind values** (`h-[42px]`, `text-[13px]`) unless absolutely necessary.
- **Use semantic tokens** from Tailwind v4 theme (see globals.css).
- **All user-facing strings via `next-intl`**.
- **Touch targets ≥32px minimum** (WCAG compliance).

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

### Mobile Text (Product Pages)
| Token | Class | Use |
|-------|-------|-----|
| `--text-strong` | `text-text-strong` | Titles, prices, strong emphasis |
| `--text-default` | `text-text-default` | Body text |
| `--text-muted-alt` | `text-text-muted-alt` | Secondary text, meta info |
| `--text-subtle` | `text-text-subtle` | Timestamps, hints |

### Pricing
| Token | Class | Use |
|-------|-------|-----|
| `--color-price` | `text-price` | Regular prices |
| `--color-price-sale` | `text-price-sale` | Sale/reduced prices |
| `--color-price-original` | `text-price-original` | Strikethrough prices |
| `--color-price-savings` | `text-price-savings` | "Save X%" text |

### Condition Badges
| Token | Class | Use |
|-------|-------|-----|
| `--color-condition-new` | `text-condition-new` | New items |
| `--color-condition-likenew` | `text-condition-likenew`, `bg-condition-likenew-bg` | Like new |
| `--color-condition-good` | `text-condition-good` | Good condition |
| `--color-condition-fair` | `text-condition-fair` | Fair condition |

### Ratings
| Token | Class | Use |
|-------|-------|-----|
| `--color-rating` | `text-rating`, `fill-rating` | Star ratings |
| `--color-wishlist` | `text-wishlist` | Heart/wishlist icons |

---

## Tokens (source of truth)

- Colors/spacing/typography tokens live in `app/globals.css` under `@theme`.
- **Semantic classes are first-class**: Use `bg-shipping-free/10`, `text-verified`, `text-price-savings` etc.
- Core neutrals: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`.

## Core principles

1. **Hierarchy through typography AND color**
   - Use semantic colors for status, trust, and pricing
   - Bold prices, subtle metadata, colored accents for key info
   - Don't be afraid of green for shipping, blue for trust

2. **Premium presentation**
   - Product images are heroes: large, padded, on subtle backgrounds
   - Vertical thumbnail galleries on desktop
   - Dual CTA patterns (Buy Now / Make Offer) like StockX

3. **Trust signals that pop**
   - Colored backgrounds (`bg-shipping-free/5`, `bg-verified/10`)
   - Icon circles with colored fills
   - Clear visual separation from content

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
| `bg-card` | Elevated surfaces (cards, modals) |
| `bg-muted` | Subdued backgrounds, inactive states |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary text, placeholders |
| `border-border` | Standard borders |
| `bg-foreground text-background` | **Active/inverted pill state** |

**Rule**: Never hardcode `bg-white`, `text-black`, or `border-gray-*`. Use semantic tokens.

---

## Surfaces

### "Glass" sticky surfaces (headers / strips / bottom bars)
Use *one consistent recipe*:
- `bg-background/90 backdrop-blur-md border-b border-border/50`
- For bottom nav: `bg-card/95 backdrop-blur-xl border-t border-border/60`

Notes:
- Keep opacity subtle (90–95%) and borders soft (`/50`–`/60`).
- Don't stack multiple shadows; the blur + border is the primary separation.

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

Rules:
- Don't use brand color for "active" by default.
- Keep the same chip sizing everywhere (category pills, filter chips, "All filters", etc.).

---

## Navigation

### Bottom nav
- Active state should be neutral and readable: `text-foreground` (not brand).
- Icons should be thin and consistent (`strokeWidth={1.5}` on lucide icons).
- Keep the bar "glassy" and safe-area aware.

### Horizontal strips
- Always `no-scrollbar` and keep spacing tight.
- Avoid "fancy" separators; use subtle borders or one divider element.

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

## Filters (mobile UX)

### Two-tier filter UX
1) **Single-section modals** (default) - triggered by quick filter pills
2) **All filters hub** (escape hatch) - full drawer with drill-down

### State model
- `pending` selections change inside modals
- `applied` selections are what the grid uses
- Only Apply updates the grid and URL

### Live result count
- Sticky CTA at bottom: "Show 1,024 Results"
- Updates on every pending change (debounced 250–300ms)
- If count is 0: disable CTA and show "No items found"

---

## Anti-patterns to avoid

- **Hard-coded grays/whites** instead of semantic tokens
- **Arbitrary sizes** for typography/offsets (`top-[105px]`, `text-[10px]`)
- **Scale animations** on hover/press — use subtle background/border transitions instead
- **Over-shadowing** — use border separation + muted backgrounds

---

## Component boundaries

- `components/ui/**`: primitives only (shadcn-style). No feature composites, no app hooks.
- `components/common/**`: shared composites used across routes.
- `components/layout/**`: shells (header/nav/sidebars).
- Route-owned UI must live under its route group: `app/[locale]/(group)/**/_components/**`.

---

## Quick "good defaults"

- Card: `rounded-md border border-border bg-card p-3`
- Section spacing: `space-y-2` (mobile) / `space-y-3` (desktop)
- Muted surface: `bg-muted/50 text-muted-foreground border-border`
- Active pill: `bg-foreground text-background border-foreground`
- Inactive pill: `bg-background text-muted-foreground border-border/60`
- Sticky header: `bg-background/90 backdrop-blur-md border-b border-border/50`
- Bottom nav: `bg-card/95 backdrop-blur-xl border-t border-border/60`

---

## Verification gates

For any non-trivial UI work:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```
