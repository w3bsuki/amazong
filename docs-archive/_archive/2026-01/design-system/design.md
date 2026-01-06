# Design System

> **The Bazaar Standard** — Temu density + eBay professionalism  
> **Stack:** Tailwind v4 · shadcn/ui · OKLCH colors  
> **Philosophy:** Dense · Flat · Fast · Trustworthy · Mobile-first

---

## Quick Reference

```
Typography     Price: 16px/18px bold | Body: 14px | Meta: 12px | Micro: 10px
Spacing        Grid: gap-1.5 (6px) mobile, gap-3 (12px) desktop | Content: p-2
Touch          40px primary | 36px standard | 32px secondary | 28px compact | 24px min
Radius         2px badges | 4px buttons/inputs | 6px cards | Never >6px on cards
Shadows        none default | shadow-sm hover | shadow-md modals only
Motion         none default | ≤120ms opacity/translate only | No scale/shimmer
```

---

## 1. Philosophy & Hard Rules

### The Formula
```
TEMU DENSITY  +  EBAY PROFESSIONALISM  =  OUR STANDARD
─────────────    ──────────────────       ─────────────
• 4-6px gaps     • Sharp 2-4px radius     • Maximum images
• Minimal pad    • No gradients/glows     • Price-first hierarchy
• Stacked info   • Professional type      • Trust signals visible
```

### ❌ NEVER (Non-Negotiable)
- Gradients, glows, heavy shadows (`shadow-lg`, `shadow-xl`, `shadow-2xl`)
- Hover/active scale transforms (`hover:scale-*`, `active:scale-*`)
- Shimmer/pulse animations on skeletons
- Rounded corners > 6px on cards (`rounded-lg`, `rounded-xl`, `rounded-2xl`)
- Body text under 12px (except badges)
- Arbitrary values (`text-[13px]`, `h-[42px]`)
- Color-only indicators (always add icons)
- Touch targets over 40px (except hero sections)

### ✅ ALWAYS
- Flat, solid OKLCH colors
- Dense spacing (`gap-1.5`, `p-2`)
- Sharp corners (`rounded-sm` to `rounded-md`)
- 4px spacing grid
- Semantic color tokens
- Price as the largest element on product cards
- 16px font on mobile inputs (prevents iOS zoom)

---

## 2. Color System

### Core Tokens (globals.css)
```css
/* Brand */
--color-brand: oklch(0.48 0.22 260);
--color-brand-hover: oklch(0.40 0.24 260);

/* Text */
--color-foreground: oklch(0.12 0 0);
--color-muted-foreground: oklch(0.45 0 0);

/* Surfaces */
--color-background: oklch(0.985 0 0);
--color-card: oklch(1 0 0);
--color-border: oklch(0.90 0 0);

/* Prices */
--color-price-regular: oklch(0.15 0.01 250);
--color-price-sale: oklch(0.50 0.22 27);
--color-price-original: oklch(0.55 0.01 250);

/* Status */
--color-success: oklch(0.60 0.18 145);
--color-warning: oklch(0.75 0.16 85);
--color-error: oklch(0.55 0.25 27);
--color-info: oklch(0.55 0.18 250);
```

### Badge Tokens (Contrast-Safe ≥4.5:1)
All badge combinations must pass 4.5:1 contrast at 10-12px text.

| Badge Type | Background | Text | Usage |
|------------|------------|------|-------|
| Deal/Sale | `oklch(0.92 0.08 27)` | `oklch(0.35 0.18 27)` | Discounts |
| Shipping | `oklch(0.92 0.06 145)` | `oklch(0.32 0.12 145)` | Free shipping |
| Urgency | `oklch(0.92 0.08 65)` | `oklch(0.35 0.14 65)` | Low stock |
| Verified | `oklch(0.92 0.04 250)` | `oklch(0.35 0.12 250)` | Seller verified |
| Top Rated | `oklch(0.92 0.06 90)` | `oklch(0.32 0.12 75)` | High ratings |

### Usage Map
| Element | Token/Class |
|---------|-------------|
| Body text | `text-foreground` |
| Secondary text | `text-muted-foreground` |
| Current price | `text-foreground font-bold` or `text-price-sale font-bold` |
| Original price | `text-muted-foreground line-through` |
| Links | `text-brand hover:text-brand-hover` |
| Primary buttons | `bg-brand text-white` |
| Borders | `border-border` |

---

## 3. Typography

### Scale
| Element | Mobile | Desktop | Weight | Class |
|---------|--------|---------|--------|-------|
| **Current Price** | 16px | 18px | 700 | `text-base font-bold` / `text-lg font-bold` |
| Original Price | 12px | 13px | 400 | `text-xs line-through` |
| Product Title | 13px | 14px | 400 | `text-[13px]` / `text-sm` |
| Meta (rating/sold) | 11px | 12px | 500 | `text-[11px]` / `text-xs` |
| Micro (badges) | 10px | 11px | 600 | `text-2xs` |
| Body | 14px | 14px | 400 | `text-sm` |
| Section Header | 18px | 20px | 600 | `text-lg font-semibold` / `text-xl` |
| Page Title | 24px | 28px | 700 | `text-2xl font-bold` |

### Rules
- **Body text:** `text-sm` (14px) — same as Amazon, eBay
- **Prices:** Always the largest element on product cards
- **Minimum:** 12px for readable text, 10px only for badges
- **No arbitrary sizes** in components (use scale above)
- **Line height:** 1.3-1.4 for titles, 1.5 for body
- **Mobile inputs:** 16px font minimum (prevents iOS zoom)

### Font Stack
```css
--font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial;
--font-mono: "JetBrains Mono", monospace;
```

---

## 4. Spacing (4px Grid)

### Gaps
| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Tight inline (price + badge) |
| `gap-1.5` | 6px | **Mobile product grid** ⭐ |
| `gap-2` | 8px | Standard component spacing |
| `gap-3` | 12px | **Desktop grid**, section gaps |
| `gap-4` | 16px | Page section spacing |

### Padding
| Token | Value | Usage |
|-------|-------|-------|
| `p-1.5` | 6px | Card content (below image) |
| `p-2` | 8px | Dense cards, mobile |
| `p-3` | 12px | Desktop cards, forms |
| `p-4` | 16px | Page shell, sections |

### Grid Layouts
```tsx
// Mobile: 2 cols, tight gaps
<div className="grid grid-cols-2 gap-1.5 px-2">

// Desktop: 4-6 cols, roomier
<div className="grid grid-cols-2 gap-1.5 px-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 xl:grid-cols-5">
```

---

## 5. Touch Targets

WCAG 2.2 AA requires **24px minimum**. We use a marketplace-dense scale.

| Element | Size | Class | Usage |
|---------|------|-------|-------|
| **Primary CTA** | 40px | `h-10` | Add to Cart, Buy Now (max standard) |
| **Standard** | 36px | `h-9` | Modal CTAs, important actions |
| **Secondary** | 32px | `h-8` | Filter pills, inputs, default buttons |
| **Compact** | 28px | `h-7` | Icon buttons, wishlist, compact |
| **Minimum** | 24px | `h-6` | Inline icons, dense actions |

### Button Sizes (button.tsx)
```tsx
xs: "h-6 px-2 text-xs"      // 24px - inline
sm: "h-7 px-3 text-xs"      // 28px - compact
default: "h-8 px-4 text-sm" // 32px - standard ⭐
lg: "h-9 px-5 text-sm"      // 36px - primary CTA
icon: "size-9"              // 36px
"icon-sm": "size-8"         // 32px
"icon-lg": "size-10"        // 40px
```

### Implementation
```tsx
// Wishlist: 28px visual
<button className="flex items-center justify-center size-7">
  <Heart className="size-5" />
</button>

// Quick-add: 32px
<button className="flex items-center justify-center size-8 rounded bg-primary">
  <Plus className="size-4 text-white" />
</button>

// Primary CTA: 40px max
<Button size="lg" className="h-10 w-full">Add to Cart</Button>
```

---

## 6. Border Radius

Sharp, professional corners. eBay aesthetic, not playful.

| Token | Size | Usage |
|-------|------|-------|
| `rounded-sm` | 2px | Badges |
| `rounded` | 4px | Buttons, inputs, small cards |
| `rounded-md` | 6px | Cards (max for cards) |
| `rounded-full` | pill | Pills, avatars only |

### ⚠️ Forbidden on Cards
Never use `rounded-lg`, `rounded-xl`, `rounded-2xl` on product cards or main content cards.

---

## 7. Shadows & Elevation

Flat design — minimal shadows only for elevation hierarchy.

| Token | Usage |
|-------|-------|
| `shadow-none` | Default for all cards |
| `shadow-sm` | Hover states, dropdowns |
| `shadow-md` | Modals, dialogs only |

**Never:** `shadow-lg`, `shadow-xl`, `shadow-2xl`

---

## 8. Motion Policy

### ❌ Forbidden
- Skeleton shimmer/pulse (`animate-pulse`, `animate-shimmer`)
- Card hover scale (`hover:scale-105`)
- Button press scale (`active:scale-95`, `active:scale-[0.98]`)
- Parallax effects
- Star rating fill animations
- Infinite spinners > 2 seconds

### ✅ Allowed
- Opacity transitions: ≤120ms, `ease-out`
- TranslateY (1-2px): ≤120ms for toasts/modals
- Bounded loading spinners (< 2s visible)
- Sheet/modal enter/exit only

```css
/* Globals.css already blocks scale transforms */
[class*="hover:scale-"]:hover,
[class*="active:scale-"]:active {
  transform: none !important;
}
```

---

## 9. Product Card Anatomy

### Structure (Mobile)
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │  ← Image: aspect-[4/5] or square
│  │                           │  │
│  │      PRODUCT IMAGE        │  │
│  │                           │  │
│  │  [♡]                      │  │  ← Wishlist: top-right, 28px
│  │           [-25%]          │  │  ← Discount badge: bottom-left
│  └───────────────────────────┘  │
│                                 │
│  лв 24.99  л̶в̶ ̶3̶2̶.̶9̶9̶            │  ← Price: 16px bold + 12px strike
│  Product Title Here...         │  ← Title: 13px, line-clamp-2
│  ★ 4.8 · 2.3K sold             │  ← Meta: 11px muted
│  🚚 Free shipping              │  ← Micro: 10px (optional)
│                         [🛒]   │  ← Quick-add: 32px
└─────────────────────────────────┘
```

### Specs
```tsx
// Card container
"border border-border rounded-md bg-card" // No shadow, sharp corners

// Image
"aspect-[4/5]" // or aspect-square

// Content padding
"p-1.5 space-y-0.5" // 6px padding, tight stacking

// Price
"text-base font-bold" // 16px mobile, use text-lg for desktop

// Title
"text-[13px] line-clamp-2" // 13px mobile, text-sm desktop

// Meta
"text-[11px] text-muted-foreground" // 11px, muted
```

### Grid
```tsx
// ProductGrid component
<div className="grid grid-cols-2 gap-1.5 px-2 sm:gap-2 sm:px-3 lg:grid-cols-4 lg:gap-3">
```

---

## 10. Image Optimization

### Sizing
| Context | Max Width | Format | Quality |
|---------|-----------|--------|---------|
| Grid thumbnail | 400px | WebP | 75% |
| Product main | 800px | WebP | 85% |
| Product zoom | 1600px | WebP | 90% |
| Avatar | 80px | WebP | 80% |

### Implementation
```tsx
<Image
  src={product.image}
  alt={product.title}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="object-cover"
/>
```

### Skeleton Rules
- **No shimmer/pulse** — use static gray blocks
- Match exact final dimensions
- Max 8 skeleton cards visible
- Instant swap (no fade transition)

---

## 11. Navigation Patterns

### Mobile Bottom Bar (56px + safe area)
```
┌─────────────────────────────────────────┐
│  🏠      🔍      📂      ❤️      👤    │  ← 56px height
│  Home   Search  Category Saved  Account │  ← 10px labels
└─────────────────────────────────────────┘
     ↑ Safe area padding below
```

### Category Tabs (Zero Page Load)
```tsx
// Use Tabs component, not Link navigation
<Tabs defaultValue="all">
  <TabsList className="sticky top-0 z-40 overflow-x-auto">
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="electronics">Electronics</TabsTrigger>
  </TabsList>
  <TabsContent value="all">...</TabsContent>
</Tabs>
```

### Mobile Header
```
[☰ Menu] [Logo] [🔍] [🛒 (badge)]
```

---

## 12. Forms & Inputs

### Sizing
| Element | Height | Font |
|---------|--------|------|
| Standard input | 32px (`h-8`) | 16px (iOS zoom prevention) |
| Header search | 36px (`h-9`) | 14px |
| Primary CTA | 40px (`h-10`) | 14px |
| Textarea | 80px min | 16px |

### Layout
- Stack labels above inputs (mobile)
- Inline labels allowed on desktop settings
- Error text: `text-error text-xs` with 4px top margin
- Inline validation, no modal interruptions

---

## 13. Breakpoints & Containers

### Breakpoints
| Name | Range | Usage |
|------|-------|-------|
| base | ≤640px | Mobile default |
| sm | 641-768px | Large phones |
| md | 769-1024px | Tablet |
| lg | 1025-1280px | Desktop |
| xl | >1280px | Wide desktop |

### Containers
| Utility | Max Width | Usage |
|---------|-----------|-------|
| `container` | 1440px | Default page container |
| `container-content` | 1152px | Forms, account pages |
| `container-narrow` | 768px | Auth, settings |
| `container-wide` | 1536px | Special wide sections |

---

## 14. Accessibility (WCAG 2.2 AA)

### Requirements
| Requirement | Implementation |
|-------------|----------------|
| Touch targets | 24px minimum, 32-40px standard |
| Text contrast | 4.5:1 for normal, 3:1 for large |
| Focus visible | 2px ring, `ring-brand` |
| Keyboard nav | Tab navigation works |
| Reduced motion | Respected via `prefers-reduced-motion` |

### Focus States
```css
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
  scroll-margin-top: 5rem;    /* Clear sticky header */
  scroll-margin-bottom: 7rem; /* Clear bottom nav */
}
```

---

## 15. Component Checklist

### ✅ Product Card
- [ ] Image: `aspect-[4/5]` or `aspect-square`
- [ ] Price: 16px bold (largest element)
- [ ] Title: 13px, `line-clamp-2`
- [ ] Meta: 11px muted
- [ ] Wishlist: 28px (`size-7`)
- [ ] Quick-add: 32px (`size-8`)
- [ ] Grid gap: `gap-1.5` mobile, `gap-3` desktop
- [ ] No hover scale
- [ ] No shimmer skeleton

### ✅ Buttons
- [ ] Default: 32px (`h-8`)
- [ ] Primary CTA: 40px max (`h-10`)
- [ ] No `active:scale-*`
- [ ] Rounded corners: `rounded-md` max

### ✅ Cards
- [ ] Border: `border border-border`
- [ ] Radius: `rounded-md` max
- [ ] Shadow: `shadow-none` default
- [ ] No gradients

### ✅ Forms
- [ ] Input height: 32px (`h-8`)
- [ ] Font: 16px on mobile
- [ ] Inline validation
- [ ] Labels above inputs

---

## 16. File Reference

| File | Purpose |
|------|---------|
| `globals.css` | All CSS tokens, theme variables |
| `components/ui/button.tsx` | Button variants & sizes |
| `components/shared/product/product-card.tsx` | Product card component |
| `tailwind.config.ts` | Tailwind extensions (if any) |

---

## 17. Migration Notes

### Items to Fix (Current Violations)
1. `product-buy-box.tsx`: Remove `active:scale-[0.98]` from buttons
2. Various components: Replace `rounded-xl` with `rounded-md` on cards
3. `coming-soon-page.tsx`: Remove `animate-pulse` from Bell icon
4. Ensure all badge text uses contrast-safe tokens

### Deprecated Patterns
- `hover:scale-*` — Blocked globally in globals.css
- `shadow-lg` and above — Only use shadow-sm/shadow-md
- `rounded-xl` on cards — Use `rounded-md` max

---

*Last updated: 2024-12-30*
*Source of truth for all UI/UX decisions*
