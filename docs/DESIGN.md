# Design System (SSOT)

> **One-stop reference for UI/UX and styling.** Read this before touching any component.

| Stack | Theme | Style |
|-------|-------|-------|
| Next.js 16 + React 19 | Twitter (via tweakcn.com) | shadcn/ui new-york |
| Tailwind CSS v4 | oklch colors | Semantic tokens |

---

## Quick Answers

| Question | Answer |
|----------|--------|
| "What color is primary?" | Twitter Blue `oklch(0.67 0.16 243)` / `#1D9BF0` |
| "What's the radius?" | `4px` (`--radius: 0.25rem`) — tight marketplace feel |
| "How do I make a subtle bg?" | Use `bg-surface-subtle`, NOT `bg-muted/30` |
| "Can I use `bg-primary/10`?" | No. Use `bg-selected` or `bg-hover` instead |
| "What about dark mode?" | Automatic via `.dark` class — all tokens adapt |
| "Where are theme vars?" | `app/globals.css` -> `:root` and `.dark` blocks |

---

## Twitter Theme Palette

Our theme comes from [tweakcn.com/editor/theme?theme=twitter](https://tweakcn.com/editor/theme?theme=twitter).

### Core Tokens

| Token | Light | Dark | Hex (Light) |
|-------|-------|------|-------------|
| `--primary` | `oklch(0.67 0.16 243)` | same | `#1D9BF0` |
| `--foreground` | `oklch(0.19 0.01 249)` | `oklch(0.98 0 0)` | `#0F1419` |
| `--background` | `oklch(1 0 0)` | `oklch(0.19 0.01 249)` | `#FFFFFF` |
| `--muted` | `oklch(0.97 0.003 265)` | `oklch(0.28 0.02 253)` | `#F7F9FA` |
| `--muted-foreground` | `oklch(0.55 0.02 264)` | `oklch(0.68 0.02 253)` | `#536471` |
| `--border` | `oklch(0.93 0.006 251)` | `oklch(0.37 0.02 253)` | `#EFF3F4` |
| `--destructive` | `oklch(0.58 0.22 27)` | `oklch(0.70 0.19 22)` | `#F4212E` |

### Accent Colors

| Token | Value | Use |
|-------|-------|-----|
| `--accent` | Same as muted | Hover backgrounds |
| `--accent-foreground` | Twitter Blue | Accent text/icons |
| `--ring` | Twitter Blue | Focus rings |

---

## Forbidden Patterns

**These patterns cause inconsistent UI. Do not use them.**

| Don't | Do Instead | Why |
|-------|------------|-----|
| `bg-muted/30` | `bg-surface-subtle` | Opacity modifiers drift across codebase |
| `bg-primary/10` | `bg-selected` | Use semantic interactive token |
| `bg-primary/5` | `bg-hover` | Use semantic hover token |
| `hover:bg-accent/50` | `hover:bg-hover` | Predefined hover surface |
| `border-primary/20` | `border-selected-border` | Use semantic border token |
| `text-blue-600` | `text-primary` | Must use theme tokens |
| `bg-gray-100` | `bg-muted` | Must use theme tokens |
| `bg-white` | `bg-background` | Must respect dark mode |
| `text-black` | `text-foreground` | Must respect dark mode |
| `bg-[#1DA1F2]` | `bg-primary` | No hardcoded colors |

### One Exception: Product Color Swatches

Hex values like `bg-[#FF5733]` are **only** allowed for displaying actual product colors (the "Red", "Navy Blue" filter swatches). See `components/shared/filters/color-swatches.tsx`.

---

## Surface Hierarchy

Use semantic surfaces. **Never invent opacity variants.**

| Token | Class | Use |
|-------|-------|-----|
| `--background` | `bg-background` | Base page canvas |
| `--surface-page` | `bg-surface-page` | Muted page (grids, search) — use via `<PageShell variant="muted">` |
| `--surface-subtle` | `bg-surface-subtle` | Ultra-subtle section backgrounds |
| `--card` | `bg-card` | Cards, elevated surfaces |
| `--surface-elevated` | `bg-surface-elevated` | Bottom bars, sticky headers |
| `--muted` | `bg-muted` | Input backgrounds, disabled states |
| `--surface-gallery` | `bg-surface-gallery` | Dark image gallery backgrounds |

### PageShell Component

**Always use PageShell** for page backgrounds:

```tsx
import { PageShell } from "@/components/shared/page-shell";

// Clean white/dark canvas (auth, account, profile)
<PageShell>
  <YourContent />
</PageShell>

// Muted tinted canvas (home, search, PDP)
<PageShell variant="muted">
  <YourContent />
</PageShell>
```

---

## Interactive States

These tokens handle hover/active/selected consistently:

| State | Background | Border | Text |
|-------|------------|--------|------|
| **Default** | `bg-background` | `border-border` | `text-foreground` |
| **Hover** | `bg-hover` | `border-hover-border` | — |
| **Active (pressed)** | `bg-active` | — | — |
| **Selected** | `bg-selected` | `border-selected-border` | — |
| **Focus** | — | `ring-2 ring-ring` | — |
| **Checked** | `bg-checked` | — | `text-checked-foreground` |

### Interactive Pill/Chip Pattern

```tsx
// Inactive (default)
<button className="h-touch-sm px-3 rounded-full bg-background text-muted-foreground border border-border hover:bg-hover hover:text-foreground">
  Category
</button>

// Active/selected (inverted)
<button className="h-touch-sm px-3 rounded-full bg-foreground text-background border-foreground">
  Category
</button>
```

### Button Variants

Use `<Button>` from `components/ui/button.tsx`:

| Variant | Use |
|---------|-----|
| `default` | Primary CTA (Twitter blue) |
| `secondary` | Secondary actions |
| `outline` | Tertiary actions |
| `ghost` | Icon buttons, minimal actions |
| `destructive` | Delete, cancel |
| `deal` | Urgency CTAs (sales) |

```tsx
<Button>Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost" size="icon"><IconHeart /></Button>
```

---

## Semantic Colors

Use these for status indicators and badges:

### Status

| Token | Class | Use |
|-------|-------|-----|
| `--color-success` | `text-success`, `bg-success` | Positive states, confirmations |
| `--color-warning` | `text-warning`, `bg-warning` | Warnings, attention needed |
| `--color-error` | `text-error`, `bg-error` | Errors, failures |
| `--color-info` | `text-info`, `bg-info` | Informational |

### Marketplace

| Token | Class | Use |
|-------|-------|-----|
| `--color-verified` | `text-verified` | Verified badges |
| `--color-shipping-free` | `text-shipping-free` | Free shipping indicator |
| `--color-rating` | `text-rating`, `fill-rating` | Star ratings |
| `--color-wishlist` | `text-wishlist` | Heart icons |
| `--color-deal` | `text-deal`, `bg-deal` | Sale/deal urgency |

### Prices

| Token | Class | Use |
|-------|-------|-----|
| `--color-price-regular` | `text-price-regular` | Normal prices |
| `--color-price-sale` | `text-price-sale` | Discounted prices |
| `--color-price-original` | `text-price-original` | Strikethrough prices |
| `--color-price-savings` | `text-price-savings` | "Save X%" text |

---

## Token Quick Reference

### Border Radius

| Token | Value | Use |
|-------|-------|-----|
| `rounded-sm` | 2px | Badges, inline elements |
| `rounded-md` | 4px | **Cards, buttons, inputs (default)** |
| `rounded-lg` | 6px | Dialogs, sheets |
| `rounded-full` | 9999px | **Pills, chips, avatars** |

### Spacing (4px base)

| Use | Mobile | Desktop |
|-----|--------|---------|
| Between items | `gap-2` (8px) | `gap-3` (12px) |
| Section spacing | `py-6` (24px) | `py-8` (32px) |
| Card padding | `p-2` (8px) | `p-3` (12px) |
| Container edge | `px-3` (12px) | `px-4` (16px) |

### Typography

| Use | Classes |
|-----|---------|
| Body text | `text-sm font-normal` (14px) |
| Labels | `text-sm font-medium` |
| Prices | `text-base font-semibold` (16px) |
| Section titles | `text-lg font-semibold` (18px) |
| Meta/captions | `text-xs text-muted-foreground` (12px) |

### Touch Targets

| Token | Size | Use |
|-------|------|-----|
| `h-touch-xs` | 32px | Minimum (compact chips) |
| `h-touch-sm` | 36px | Pills, chips |
| `h-touch` | 40px | Standard buttons |
| `h-touch-lg` | 48px | Primary CTAs |

---

## Component Patterns

### Card

```tsx
<div className="rounded-md border border-border bg-card p-3">
  Content
</div>
```

### Sticky Header

```tsx
<header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
  Content
</header>
```

### Bottom Navigation

```tsx
<nav className="fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-xl border-t border-border/60">
  Content
</nav>
```

---

## Rails (Non-Negotiables)

| Rule | Check |
|------|-------|
| No arbitrary values | `h-[42px]` -> use `h-touch` tokens |
| No hardcoded colors | `bg-white` -> `bg-background` |
| No gradients | Twitter theme is flat |
| Touch targets >= 32px | WCAG compliance |
| All strings via next-intl | i18n |
| Forms use Field component | Consistent validation UX |

### Drift Detection

```bash
pnpm -s styles:scan    # Find violations
pnpm -s styles:gate    # CI enforcement
```

---

## Component Boundaries

| Directory | Contains |
|-----------|----------|
| `components/ui/*` | Primitives only (shadcn). No app logic. |
| `components/shared/*` | Reusable composites across routes |
| `components/layout/*` | Shells (header, nav, sidebars) |
| `app/[locale]/(group)/**/_components/*` | Route-specific UI |

---

## Accessibility

- All dialogs/drawers trap focus and restore on close
- Inputs have visible labels or `aria-label`
- Error messages linked via `aria-describedby`
- Color contrast meets WCAG AA
- Focus indicators always visible

---

## Verification

Before shipping UI changes:

```bash
pnpm -s exec tsc -p tsconfig.json --noEmit   # Type check
pnpm -s lint                                   # ESLint
pnpm -s styles:gate                            # Style drift
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke # Visual smoke
```
