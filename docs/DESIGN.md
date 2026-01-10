# Design System (Canonical)

This is the **single source of truth** for UI/UX and styling rules in this repo.

Stack: **Next.js 16 + React 19 + Tailwind CSS v4 + shadcn/ui**.

Goal: a clean, dense marketplace UI that is consistent, fast, and easy to maintain (Treido-inspired for mobile).

Engineering boundaries and production rails: see `docs/ENGINEERING.md`.

---

## Non‑negotiables (repo rails)

- **No redesigns**. Improve hierarchy/consistency, keep layouts and behavior.
- **No gradients**.
- **Cards are flat**: border + subtle elevation at most (avoid heavy shadows).
- **Prefer dense spacing**: mobile `gap-2`, desktop `gap-3`.
- **Avoid arbitrary Tailwind values** (`h-[42px]`, `text-[13px]`) unless absolutely necessary.
- **Use semantic tokens** from Tailwind v4 theme (e.g. `bg-background`, `text-foreground`, `border-border`).
- **No hover/active scale gimmicks** (the repo intentionally discourages these).
- **All user-facing strings via `next-intl`**.

---

## Tokens (source of truth)

- Colors/spacing/typography tokens live in `app/globals.css` under `@theme`.
- Prefer semantic classes: `bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`.
- Tailwind v4 CSS var usage is allowed when it maps to a token (examples): `w-(--token)`, `max-h-(--token)`.

## Core principles (what makes it "Treido clean")

1) **Hierarchy through contrast, not color**
   - Default to neutral/gray scale (via semantic tokens). Use brand color sparingly.
   - Active states should be clear with *shape + contrast*, not just tint.

2) **Consistency beats creativity**
   - Chips, tabs, and filter pills should share the same sizing and states.
   - Sticky surfaces should share the same "glass" recipe.

3) **Touch-first ergonomics**
   - Use existing touch-size utilities (`h-touch-sm`, `size-touch`, `pb-safe`, etc.)
   - Prefer large hit targets over tiny icons.

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
| `h-touch-xs` | 24px | Minimum (inline icons) |
| `h-touch-sm` | 28px | **Compact buttons, chips** |
| `h-touch` | 32px | Standard buttons |
| `h-touch-lg` | 36px | Primary CTA buttons |

**Rule**: All tappable elements ≥24px. Pills/chips = `h-touch-sm rounded-full`.

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
