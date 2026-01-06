# Tokens

Authoritative design tokens for Tailwind v4 + shadcn/ui. Sync with `app/globals.css`.

> Reference: [_MASTER.md](./_MASTER.md) for full rationale.

---

## Color (OKLCH)

### Core
| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand` | `oklch(0.48 0.22 260)` | Primary actions |
| `--color-brand-hover` | `oklch(0.40 0.24 260)` | Primary hover |
| `--color-foreground` | `oklch(0.12 0 0)` | Body text |
| `--color-muted-foreground` | `oklch(0.45 0 0)` | Secondary text |
| `--color-background` | `oklch(0.985 0 0)` | Page background |
| `--color-card` | `oklch(1 0 0)` | Card surfaces |
| `--color-border` | `oklch(0.90 0 0)` | Borders |
| `--color-ring` | `oklch(0.48 0.22 260)` | Focus rings |

### Price (High Priority)
| Token | Value | Usage |
|-------|-------|-------|
| `--color-price-regular` | `oklch(0.12 0 0)` | Standard price |
| `--color-price-sale` | `oklch(0.50 0.22 27)` | Sale/discounted price |
| `--color-price-original` | `oklch(0.55 0 0)` | Strike-through original |

### Status
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `oklch(0.55 0.18 145)` | Success states |
| `--color-warning` | `oklch(0.70 0.16 85)` | Warning states |
| `--color-error` | `oklch(0.55 0.22 27)` | Error states |
| `--color-info` | `oklch(0.55 0.18 250)` | Info states |

### Badges (Contrast-Safe) ⚠️ CRITICAL
All badge combos must pass **4.5:1** contrast for 10-12px text.

| Badge Type | Background | Text |
|------------|------------|------|
| Deal/Sale | `oklch(0.92 0.08 27)` | `oklch(0.35 0.18 27)` |
| Shipping | `oklch(0.92 0.06 145)` | `oklch(0.32 0.12 145)` |
| Stock/Urgency | `oklch(0.92 0.08 65)` | `oklch(0.35 0.14 65)` |
| Verified | `oklch(0.92 0.04 250)` | `oklch(0.35 0.12 250)` |
| Top Rated | `oklch(0.92 0.06 90)` | `oklch(0.32 0.12 75)` |
| New | `oklch(0.92 0.06 180)` | `oklch(0.32 0.12 180)` |

---

## Typography

### Scale
| Element | Mobile | Desktop | Weight |
|---------|--------|---------|--------|
| **Price (current)** | 16px | 18px | 700 |
| Price (original) | 12px | 13px | 400 |
| Product title | 12px | 14px | 400 |
| Meta (rating/sold) | 10px | 12px | 500 |
| Badge text | 10px | 11px | 600 |

### Rules
- Body: `text-sm` (14px) base; `text-base` (16px) on md+ dense tables only
- Page titles: `text-2xl`; Section: `text-xl`; Card: `text-lg`
- **Never** use 12px for current price — price must pop (16-18px)
- Inputs: 16px font to prevent iOS zoom

---

## Spacing (4px Grid)

### Gaps
| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Tight grouping (price + badge) |
| `gap-1.5` | 6px | **Mobile product grid** (Temu pattern) |
| `gap-2` | 8px | Standard component spacing |
| `gap-3` | 12px | Desktop grid |
| `gap-4` | 16px | Section spacing |

### Padding
| Token | Value | Usage |
|-------|-------|-------|
| `p-2` | 8px | Cards |
| `p-3` | 12px | Dense cards desktop, mobile forms |
| `p-4` | 16px | Page shell desktop |

---

## Touch Targets (Hybrid System)

| Action Type | Visual Size | Hit Area | Usage |
|-------------|-------------|----------|-------|
| **Primary CTA** | 40px | 40px | Add to Cart, Buy Now |
| **Standard** | 36px | 36px | Most buttons, modal CTAs |
| **Secondary** | 32px | 32px | Filter pills, Quantity |
| **Icon Actions** | 28px | 28–32px | Wishlist, Share, Close |
| **Inline** | 24px | 24px | Minimum allowed |

```css
--touch-primary: 2.5rem;   /* 40px */
--touch-standard: 2.25rem; /* 36px */
--touch-secondary: 2rem;   /* 32px */
--touch-compact: 1.75rem;  /* 28px */
--touch-inline: 1.5rem;    /* 24px minimum */
```

---

## Radius
| Token | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 2px | Badges |
| `rounded` | 4px | Buttons, inputs |
| `rounded-md` | 6px | Cards |
| `rounded-full` | — | Pills, avatars |

---

## Elevation
- Default: `shadow-none`
- Hover/dropdowns: `shadow-sm` only
- Modals: `shadow-md` only
- **Never** use larger shadows

---

## Motion
- **Default: none**
- Allowed: opacity/translateY (1-2px), ≤120ms, `ease-out`
- **Never**: shimmer, scale, springs, parallax, infinite spinners >2s

---

## Breakpoints
| Name | Range | Container |
|------|-------|-----------|
| base | ≤640px | full-bleed, 12-16px padding |
| sm | 641-768px | — |
| md | 769-1024px | 960px |
| lg | 1025-1280px | 1200px |
| xl | >1280px | 1360px |

---

## Badge Sizing
| Context | Height | Padding | Font |
|---------|--------|---------|------|
| Product card (mobile) | 16px | 4px | 10px |
| Product card (desktop) | 20px | 6px | 11px |
| Product page | 24px | 8px | 12px |
| Filters/pills | 28px | 12px | 12px |

**Mobile rule:** Prefer icon-only badges with `sr-only` text.
