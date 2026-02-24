# 03 — Tailwind CSS v4: Current State

---

## Architecture

- **Tailwind CSS v4.1.18** with CSS-first configuration
- `@import "tailwindcss"` + `tw-animate-css`
- **OKLCH color space** throughout
- Three-layer token system: `:root/.dark` → `@theme inline` → component classes

---

## File Structure

| File | Lines | Purpose |
|------|-------|---------|
| `app/globals.css` | 1,090 | **Monolith** — tokens + theme bridge + base + overrides + custom utils |
| `app/utilities.css` | 460 | Custom utilities (some collide with Tailwind) |
| `app/legacy-vars.css` | ? | Legacy CSS variable aliases |
| `app/shadcn-components.css` | ? | shadcn component token overrides |

**Problem:** `globals.css` does too much. It mixes 5 concerns in a single file, making it hard to maintain and easy to regress.

---

## Token Inventory (~260 tokens)

### Core (standard shadcn/ui)
`--background`, `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive` (each with `-foreground`)

### Borders & Rings
`--border`, `--border-subtle`, `--input`, `--ring`, `--ring-subtle`

### Interactive States
`--hover`, `--active`, `--selected`, `--selected-foreground`, `--selected-border`, `--hover-border`, `--nav-active`, `--nav-inactive`, `--nav-indicator`, `--notification`

### CTA/Brand
`--cta-primary-hover`, `--cta-secondary-hover`, `--brand-dark`, `--brand-light`

### Badge System (Two-Tier)
SOLID + SUBTLE for: success, warning, critical, info, neutral
Condition: new, likenew, good, fair, used, refurb
Shipping, stock, promoted, sponsored

### Category Tones (11 families)
tech, fashion, home, sports, gaming, beauty, family, media, business, lifestyle, auto — each with `-bg`, `-fg`, `-ring`

### Surfaces (10 levels)
page, subtle, section-header, card, elevated, gallery, overlay, floating, glass + home-specific CTA surfaces

### Legacy Aliases
`--success`, `--warning`, `--info`, `--error` all map to `--primary` (blue). These are misleading.

### Shadows (OKLCH-based, 9 levels)
2xs→2xl + dropdown, modal, card, nav, Cta

---

## Custom Utilities — Collision Issues

| Utility in `utilities.css` | Tailwind v4 Built-in | Issue |
|---------------------------|---------------------|-------|
| `@utility container` | YES — `container` exists | **Direct override** |
| `@utility w-20` | YES — `w-20 = 5rem` | **Redundant redefinition** |
| `@utility touch-pan-x` | YES — built-in in v4 | **Redundant** |
| `@utility touch-pan-y` | YES — built-in in v4 | **Redundant** |
| `@utility touch-manipulation` | YES — built-in in v4 | **Redundant** |
| `@utility z-60` | YES — arbitrary z-index | **Redundant** |

Clean extensions (keep): `container-wide`, `container-content`, `container-narrow`, `control-*`, `pb-tabbar-safe`, `pb-safe`, `aspect-*`, `grid-cols-*`, `animate-*`

---

## Responsive Patterns

### Breakpoints
| Token | Width |
|-------|-------|
| default | 0-639px |
| `sm` | 640px |
| `md` | 768px (primary split) |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

### Mobile-First Issues
- **14 files** use `pb-20` instead of `pb-tabbar-safe`
- Pattern is `pb-20 sm:pb-12` — clearly a bottom-nav clearance hack
- `pb-tabbar-safe` exists in utilities.css but isn't used consistently

---

## Forbidden Patterns (Enforced by styles:gate)

| Pattern | Status |
|---------|--------|
| Palette utilities (`bg-gray-100`) | Enforced |
| Gradients (`bg-gradient-to-*`) | Enforced |
| Arbitrary values (`w-[560px]`) | Enforced |
| Raw hex/oklch in TSX | Enforced |
| Token-alpha (`bg-primary/10`) | Enforced |

The enforcement is mechanical and working — `styles:gate` catches violations.
