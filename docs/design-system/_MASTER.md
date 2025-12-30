# MASTER DESIGN SYSTEM
> **The "Temu-Killer" Standard**  
> Temu density + eBay professionalism + Native app feel

---

## 🎯 IMPLEMENTATION STRATEGY

### Recommended Order: Mobile-First, Then Desktop Polish

| Phase | Focus | Impact | Effort |
|-------|-------|--------|--------|
| **Phase 1** | 📱 Mobile Product Grid & Cards | 🔥 Highest (80% traffic) | Medium |
| **Phase 2** | 📱 Mobile Product Page | 🔥 High (conversion) | Medium |
| **Phase 3** | 📱 Mobile Navigation & Bottom Bar | High | Low |
| **Phase 4** | 🖥️ Desktop Grid & Filters | Medium | Medium |
| **Phase 5** | 🖥️ Desktop Product Page | Medium | Low |
| **Phase 6** | ✨ Polish & Micro-interactions | Low | Low |

**Why Mobile-First?**
1. Most marketplace traffic is mobile (70-85%)
2. Mobile constraints force better design decisions
3. Desktop adapts naturally from tight mobile specs
4. Temu/Shein success is mobile-driven

---

## 1. Core Philosophy

### The "Dense + Clean" Formula
```
TEMU DENSITY  +  EBAY PROFESSIONALISM  =  OUR STANDARD
─────────────    ──────────────────       ─────────────
• 4-6px gaps     • Sharp 2-4px radius     • Maximum images
• Minimal pad    • No gradients/glows     • Price-first hierarchy
• Stacked info   • Professional type      • Trust signals visible
```

### Hard Rules (Non-Negotiable)
1. **No gradients, glows, heavy shadows** — Urgency = hierarchy + contrast, not effects
2. **No hover animations** — Speed > delight
3. **Price is ALWAYS the largest element** on product cards
4. **Touch targets: 24px minimum (WCAG 2.2 AA), 40px max for primary CTA height** — Dense marketplace scale
5. **Zero layout shift** — Every image has aspect ratio locked

### Visual Identity
```
┌─────────────────────────────────────────────────────────────┐
│  TEMU          │  EBAY           │  OURS                    │
├─────────────────────────────────────────────────────────────┤
│  Playful       │  Professional   │  Professional + Urgent   │
│  Busy          │  Clean          │  Dense but Scannable     │
│  Bright colors │  Muted tones    │  Strategic color pops    │
│  Rounded       │  Sharp          │  Sharp (2-4px radius)    │
│  Gamified      │  Trustworthy    │  Trust-first, deal-aware │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Mobile-First Grid System

### 📱 Mobile Product Grid (THE MONEY MAKER)

**The Goal:** Maximum product images per viewport while maintaining readability.

| Density Level | Gap | Page Padding | Image % | When to Use |
|---------------|-----|--------------|---------|-------------|
| **Ultra-Dense** | `gap-1` (4px) | `px-1` (4px) | ~49% | Flash sales, endless scroll |
| **Dense** ⭐ | `gap-1.5` (6px) | `px-2` (8px) | ~48% | **Default grid** |
| **Balanced** | `gap-2` (8px) | `px-3` (12px) | ~46% | Premium/featured sections |

**⭐ Recommended Default: Dense (`gap-1.5`)**

```tsx
// Mobile Grid - Dense Mode (Default)
<div className="grid grid-cols-2 gap-1.5 px-2">
  {products.map(p => <ProductCard key={p.id} {...p} />)}
</div>

// Ultra-Dense for Flash Sales
<div className="grid grid-cols-2 gap-1 px-1">
  {flashDeals.map(p => <ProductCard key={p.id} variant="compact" {...p} />)}
</div>
```

### 🖥️ Desktop Grid

| Breakpoint | Columns | Gap | Container |
|------------|---------|-----|-----------|
| `md` (768px) | 3 | `gap-3` (12px) | 960px |
| `lg` (1024px) | 4 | `gap-3` (12px) | 1200px |
| `xl` (1280px) | 5-6 | `gap-4` (16px) | 1360px |

```tsx
// Responsive Grid
<div className="
  grid grid-cols-2 gap-1.5 px-2
  md:grid-cols-3 md:gap-3 md:px-4
  lg:grid-cols-4
  xl:grid-cols-5 xl:gap-4
">
```

---

## 3. Typography Hierarchy (Price-First)

### The Golden Rule
> **Current price is ALWAYS the largest, boldest element on a product card.**

### Mobile Typography Scale

| Element | Size | Weight | Line Height | Token |
|---------|------|--------|-------------|-------|
| **Current Price** | **18px** | **700** | 1.2 | `text-price-sale` |
| Original Price | 12px | 400 | 1.2 | `text-price-original` + strike |
| Discount Badge | 11px | 600 | 1 | Badge tokens |
| Product Title | 13px | 400 | 1.3 | `text-foreground` |
| Meta (sold/rating) | 11px | 500 | 1.2 | `text-muted-foreground` |
| Micro (shipping) | 10px | 400 | 1.2 | `text-muted-foreground` |

### Desktop Scale (md+)

| Element | Size | Weight |
|---------|------|--------|
| **Current Price** | **20px** | **700** |
| Original Price | 14px | 400 |
| Product Title | 14px | 400 |
| Meta | 12px | 500 |

### Price Display Component Spec

```tsx
interface PriceBlockProps {
  current: number;
  original?: number;
  discount?: number;      // e.g., 25 for 25% off
  coupon?: string;        // e.g., "SAVE5"
  freeShipping?: boolean;
}

// Visual Hierarchy (top to bottom):
// 1. Current price (18-20px, bold, sale color)
// 2. Original price (12-14px, struck, muted)
// 3. Discount badge (inline with price)
// 4. Coupon tag (if available)
// 5. Free shipping badge (smallest)
```

---

## 4. Product Card Anatomy (Mobile)

### The Perfect Card Structure
```
┌─────────────────────────────────┐
│  ┌───────────────────────────┐  │  ← Image Container
│  │                           │  │    aspect-[4/5] or aspect-square
│  │      PRODUCT IMAGE        │  │
│  │                           │  │
│  │  [♡]                      │  │  ← Wishlist: top-right, 28px visual (32px hit when over image)
│  │           [-25%]          │  │  ← Discount badge: bottom-left overlay
│  └───────────────────────────┘  │
│                                 │
│  лв 24.99  ̶л̶в̶ ̶3̶2̶.̶9̶9̶            │  ← Price row: 18px + 12px struck
│  Product Title Here...         │  ← Title: 13px, line-clamp-2
│  ★ 4.8 · 2.3K sold             │  ← Meta: 11px
│  🚚 Free shipping              │  ← Shipping: 10px (optional)
│                         [🛒]   │  ← Quick-add: bottom-right, 32px
└─────────────────────────────────┘
```

### Card Spacing (Dense Mode)
```css
/* Card internal spacing */
--card-padding: 0;           /* No outer padding */
--card-content-padding: 6px; /* Content below image */
--card-content-gap: 2px;     /* Between text lines */
--card-radius: 4px;          /* Sharp eBay-style */
```

### Image Aspect Ratios

| Context | Ratio | Class | Why |
|---------|-------|-------|-----|
| Grid card | 4:5 | `aspect-[4/5]` | Taller = more product visible |
| Grid card (alt) | 1:1 | `aspect-square` | Square = uniform grid |
| List item | 1:1 | `aspect-square` | Thumbnail efficiency |
| Product page | 1:1 | `aspect-square` | Standard e-commerce |

---

## 5. Touch Targets (Marketplace Dense Scale)

### The Scale (WCAG 2.2 AA = 24px minimum)
> We use a tight marketplace scale. 40px is our max for primary CTAs.
>
> Note: 44×44 is commonly cited as a comfortable touch target, but it’s not required for WCAG 2.2 AA. We optimize for dense commerce while meeting the 24×24 minimum and using spacing to prevent mis-taps.

| Element | Size | Class | Usage |
|---------|------|-------|-------|
| **Primary CTA** | 40px | `h-10` | Add to Cart, Buy Now |
| **Standard** | 36px | `h-9` | Modal CTAs |
| **Secondary** | 32px | `h-8` | Filter pills, Quantity |
| **Compact** | 28px | `h-7` | Wishlist, icon buttons |
| **Minimum** | 24px | `h-6` | Inline icons, dense actions |

### Implementation Pattern
```tsx
// Wishlist Heart: 28px
<button className="flex items-center justify-center size-7">
  <Heart className="size-5" />
</button>

// Quick-add: 32px
<button className="flex items-center justify-center size-8 rounded-full bg-primary">
  <Plus className="size-4 text-white" />
</button>

// Primary CTA: 40px (max)
<Button className="h-10 w-full">Add to Cart</Button>
```

---

## 6. Color System

### Core Principle
> **High contrast badges. No tinted backgrounds with same-hue text.**

### Badge Tokens (Contrast-Safe)
```css
/* All badges pass 4.5:1 contrast at 10-12px */

/* Sale/Deal - Warm red */
--badge-deal-bg: oklch(0.95 0.04 27);
--badge-deal-text: oklch(0.40 0.20 27);

/* Shipping - Trust green */
--badge-shipping-bg: oklch(0.95 0.03 145);
--badge-shipping-text: oklch(0.35 0.15 145);

/* Urgency - Warning amber */
--badge-urgency-bg: oklch(0.95 0.05 85);
--badge-urgency-text: oklch(0.35 0.15 85);

/* Verified - Trust blue */
--badge-verified-bg: oklch(0.95 0.02 250);
--badge-verified-text: oklch(0.40 0.15 250);

/* Neutral - Gray */
--badge-neutral-bg: oklch(0.95 0 0);
--badge-neutral-text: oklch(0.35 0 0);
```

### Price Colors
```css
--price-current: oklch(0.12 0 0);       /* Black - regular */
--price-sale: oklch(0.50 0.22 27);      /* Red - on sale */
--price-original: oklch(0.55 0 0);      /* Gray - struck */
--price-savings: oklch(0.50 0.18 145);  /* Green - "Save $X" */
```

---

## 7. Navigation Patterns

### Mobile Bottom Bar (56px + safe area)
```
┌─────────────────────────────────────────┐
│  🏠      🔍      📂      ❤️      👤    │  ← 56px
│  Home   Search  Category Saved  Account │  ← 10px labels
└─────────────────────────────────────────┘
     ↑ Safe area padding below
```

### Instant Category Switching
```tsx
// Anti-pattern: Full page reload
<Link href="/category/electronics">Electronics</Link>

// Master pattern: Client-side tabs
<Tabs defaultValue="all" className="w-full">
  <TabsList className="sticky top-0 z-40 overflow-x-auto no-scrollbar">
    <TabsTrigger value="all">All</TabsTrigger>
    <TabsTrigger value="electronics">Electronics</TabsTrigger>
    <TabsTrigger value="fashion">Fashion</TabsTrigger>
  </TabsList>
  <TabsContent value="all">...</TabsContent>
  <TabsContent value="electronics">...</TabsContent>
</Tabs>
```

---

## 8. Performance Rules

### Zero Layout Shift (CLS < 0.1)
1. **All images have explicit aspect ratios**
2. **Skeleton dimensions match final layout exactly**
3. **No shimmer animations** — plain gray blocks only
4. **Font-display: swap** with size-adjust fallbacks

### Image Optimization
| Context | Max Size | Format | Quality |
|---------|----------|--------|---------|
| Grid thumbnail | 400px | WebP | 75% |
| Product main | 800px | WebP | 85% |
| Product zoom | 1600px | WebP | 90% |

```tsx
// Always set sizes to prevent mobile downloading desktop images
<Image
  src={product.image}
  alt={product.title}
  fill
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  className="object-cover"
/>
```

### Skeleton Rules
- No shimmer/pulse animation
- Match exact dimensions of content
- Max 8 skeleton cards, then load more on scroll
- Instant swap (no fade transition)

---

## 9. Motion Policy (Strict)

### ✅ Allowed
- `opacity` transitions: 100-150ms, ease-out
- `transform: translate` for modals/drawers: 150ms max
- Loading spinners (bounded, max 2s visible)

### ❌ Never Use
- Skeleton shimmer/pulse
- Card hover scale (`hover:scale-105`)
- Button press scale (`active:scale-95`)
- Parallax effects
- Star rating fill animations
- Infinite spinners > 2 seconds

---

## 10. Accessibility & QA

### Contrast Requirements
| Element | Min Ratio | Test At |
|---------|-----------|---------|
| Body text | 4.5:1 | 14px |
| Small text | 4.5:1 | 10-12px |
| Large text | 3:1 | 18px+ |
| UI components | 3:1 | — |

### Touch Target Audit
- [ ] Primary CTAs: 40px (`h-10`)
- [ ] Standard buttons: 32-36px (`h-8` / `h-9`)
- [ ] Icon buttons: 28px minimum (`h-7`)
- [ ] All interactive: 24px minimum (`h-6`)

### Performance Targets
- CLS: < 0.1
- LCP: < 2.5s
- FID: < 100ms

---

## 11. Component Checklist (Gold Standard)

### ✅ Product Card (Mobile)
- [ ] Image takes 70%+ of card height
- [ ] `aspect-[4/5]` or `aspect-square` locked
- [ ] Price is 18px bold, largest element
- [ ] Title 13px, `line-clamp-2`
- [ ] Meta 11px muted
- [ ] Wishlist: 28px (`h-7`)
- [ ] Quick-add: 32px (`h-8`)
- [ ] No hover scale, no shimmer
- [ ] Grid gap: `gap-1.5` (6px)

### ✅ Product Card (Desktop)
- [ ] Price 20px bold
- [ ] Title 14px
- [ ] Hover: subtle border/shadow only
- [ ] No scale transform

### ✅ Bottom Navigation
- [ ] Height: 56px + safe area
- [ ] Icons: 24px
- [ ] Labels: 10px
- [ ] Active state: fill/color change only

### ✅ Forms & Inputs
- [ ] Default input height: 32px (`h-8`), dense marketplace standard
- [ ] Header search height: 36px (`h-9`) for sticky top bars
- [ ] Primary CTA max: 40px (`h-10`), use sparingly
- [ ] Input font: 16px on mobile (prevents iOS zoom)
- [ ] Minimum interactive size: 24px (`h-6`); expand hit areas via padding when needed

---

## 12. Implementation Phases (Detailed)

### Phase 1: Mobile Product Grid & Cards (Week 1)

**Files to modify:**
- `components/shared/product/product-card.tsx`
- `components/shared/product/product-grid.tsx` (or equivalent)
- `app/globals.css` (tokens if needed)

**Tasks:**
1. Update grid to `gap-1.5 px-2`
2. Ensure card image uses `aspect-[4/5]`
3. Price block: 18px current, 12px original
4. Title: 13px `line-clamp-2`
5. Meta: 11px
6. Touch targets: 24px min, 40px max (dense marketplace scale)
7. Remove any hover scale animations

### Phase 2: Mobile Product Page (Week 2)

**Focus areas:**
- Sticky bottom bar (Add to Cart)
- Image gallery (swipe, no zoom animation)
- Price display prominence
- Trust signals (seller info, shipping)
- Quantity stepper (32px buttons)

### Phase 3: Mobile Navigation (Week 2-3)

**Focus areas:**
- Bottom tab bar refinement
- Category switching (tabs, not page reloads)
- Search bar UX
- Filter/sort sheets

### Phase 4-5: Desktop (Week 3-4)

**Approach:** Scale up from mobile specs
- More columns (4-6)
- Slightly larger typography
- Filter sidebar
- Hover states (subtle only)

### Phase 6: Polish (Week 4+)

- Accessibility audit
- Performance audit (CLS, LCP)
- Cross-browser testing
- Edge cases

---

## 13. Quick Reference

### Spacing Cheat Sheet
```
Mobile Grid:     gap-1.5 px-2
Desktop Grid:    gap-3 md:gap-4
Card Content:    p-1.5 (6px)
Section:         py-4 md:py-6
```

### Typography Cheat Sheet
```
Price (mobile):  text-lg font-bold (18px)
Price (desktop): text-xl font-bold (20px)
Title:           text-[13px] md:text-sm
Meta:            text-[11px] md:text-xs
Micro:           text-[10px]
```

### Touch Target Cheat Sheet
```
Primary CTA:     h-10 (40px) - max
Standard:        h-9 (36px)
Secondary:       h-8 (32px)
Compact:         h-7 (28px)
Minimum:         h-6 (24px)
```

### Color Cheat Sheet
```
Sale price:      text-price-sale
Regular price:   text-foreground
Original price:  text-muted-foreground line-through
Success badge:   bg-badge-shipping-bg text-badge-shipping-text
```

---

## 14. Final Notes

### Why This Approach Works

1. **Temu's success** = Density. More products visible = more impulse buys.
2. **eBay's trust** = Professionalism. Clean design = legitimate marketplace.
3. **Mobile-first** = Reality. 70-85% of e-commerce traffic is mobile.

### Common Mistakes to Avoid

❌ Making desktop first, then "shrinking" to mobile  
❌ Using 8px+ gaps on mobile product grids  
❌ Hover animations that don't translate to touch  
❌ Shimmer skeletons that cause performance issues  
❌ Low-contrast "aesthetic" badges  
❌ Prices smaller than titles

### Success Metrics

- **Products visible above fold (mobile):** 4-6 cards
- **Time to first meaningful paint:** < 1.5s
- **CLS score:** < 0.1
- **Touch error rate:** < 2%
