# Treido Style Guide

> **Philosophy**: Dense · Flat · Fast · Trustworthy · Mobile-first  
> **Inspiration**: Amazon, eBay, Target — clean professional marketplace UI

---

## 1. Typography Scale

### Body Text

| Class | Size | Use |
|-------|------|-----|
| `text-2xs` | 10px | Badges, tiny labels |
| `text-xs` | 12px | Meta text, captions, helper text |
| `text-sm` | 14px | **Body text (default)** |
| `text-base` | 16px | Prices, emphasis |
| `text-lg` | 18px | Section titles |
| `text-xl` | 20px | Page titles |
| `text-2xl`+ | 24px+ | Hero text only |

### Font Weights

| Class | Weight | Use |
|-------|--------|-----|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, navigation |
| `font-semibold` | 600 | Prices, CTAs, headings |
| `font-bold` | 700 | Hero headlines only |

### Line Clamping

```tsx
// Title truncation
<h3 className="text-sm font-medium line-clamp-2">{title}</h3>

// Single line
<p className="text-xs text-muted-foreground line-clamp-1">{meta}</p>
```

---

## 2. Spacing System

### Gap Values (4px grid)

| Class | Pixels | Use |
|-------|--------|-----|
| `gap-1` | 4px | Inline items, badges |
| `gap-1.5` | 6px | Tight groups |
| `gap-2` | 8px | **Mobile default** |
| `gap-3` | 12px | **Desktop default** |
| `gap-4` | 16px | Section spacing |
| `gap-6` | 24px | Major sections |

### Padding

| Class | Use |
|-------|-----|
| `p-2` | Card content (mobile) |
| `p-3` | Card content (desktop) |
| `px-3 py-2` | Standard component padding |
| `px-4` | Container horizontal padding |

### Section Spacing

```tsx
// Section vertical spacing
<section className="py-6">...</section>           // Compact
<section className="py-8">...</section>           // Standard
<section className="pt-6 pb-12">...</section>     // Asymmetric
```

---

## 3. Color System

### DO: Use Semantic Tokens

```tsx
// ✅ GOOD - semantic tokens
className="bg-background text-foreground"
className="bg-card border-border"
className="text-muted-foreground"
className="bg-primary text-primary-foreground"
className="text-price-sale"
className="bg-cta-trust-blue text-white"
```

### DON'T: Hardcode Colors

```tsx
// ❌ BAD - hardcoded values
className="bg-[#1a1a1a]"
className="text-blue-600"
className="bg-oklch(0.48 0.22 260)"
```

**Allowed exceptions (use sparingly):**

- `text-white` when rendering on a known dark solid token surface (e.g. `bg-cta-trust-blue`).
- Subtle alpha overlays like `bg-white/10` and `border-white/20` when the base surface is a solid CTA token.
- Avoid using Tailwind palette colors like `text-blue-50`, `bg-blue-600/30`, etc. (prefer tokens or neutral overlays).

### Key Semantic Tokens

| Token | Use |
|-------|-----|
| `bg-background` | Page background |
| `bg-card` | Card/surface backgrounds |
| `border-border` | Default borders |
| `text-foreground` | Primary text |
| `text-muted-foreground` | Secondary/meta text |
| `bg-primary` / `text-primary` | Brand color |
| `bg-cta-trust-blue` | Primary CTA buttons |
| `text-price-sale` | Sale price |
| `bg-deal` | Deal badges |
| `text-success` / `text-error` | Status colors |

### Condition Badges (C2C Marketplace)

| Token | Use |
|-------|-----|
| `text-condition-new` / `bg-condition-new-bg` | New items |
| `text-condition-likenew` / `bg-condition-likenew-bg` | Like new / Very good |
| `text-condition-good` / `bg-condition-good-bg` | Good condition |
| `text-condition-fair` / `bg-condition-fair-bg` | Fair condition |
| `text-condition-used` / `bg-condition-used-bg` | Used items |
| `text-condition-refurb` / `bg-condition-refurb-bg` | Refurbished |

### Verification & Trust

| Token | Use |
|-------|-----|
| `text-verify-email` | Email verified tier |
| `text-verify-phone` | Phone verified tier |
| `text-verify-id` | ID verified tier |
| `text-verify-business` | Business verified tier |
| `text-verified` | Generic verified badge |
| `text-shipping-free` | Free shipping indicator |

### Freshness & Social Proof

| Token | Use |
|-------|-----|
| `text-fresh` / `bg-fresh-bg` | "Today" freshness |
| `text-recent` / `bg-recent-bg` | "Yesterday/Recent" |
| `text-hot` / `bg-hot-bg` | Popular/trending items |
| `text-favorite` | Wishlist/favorites |

### Urgency Banners

| Token | Use |
|-------|-----|
| `bg-urgency-stock-bg` / `text-urgency-stock-text` | Low stock warnings |
| `bg-urgency-sale-bg` / `text-urgency-sale-text` | Sale ending soon |
| `bg-urgency-viewers-bg` / `text-urgency-viewers-text` | "X people viewing" |

### Seller UI

| Token | Use |
|-------|-----|
| `bg-seller-card` / `border-seller-card-border` | Seller info cards |
| `bg-seller-banner` / `bg-seller-banner-pill` | Seller banners |

### Social Platforms

| Token | Use |
|-------|-----|
| `bg-social-instagram` | Instagram brand color |
| `bg-social-tiktok` | TikTok brand color |
| `bg-social-youtube` | YouTube brand color |
| `bg-social-twitter` | Twitter/X brand color |

### Status Aliases

| Token | Use |
|-------|-----|
| `text-status-success` | Success states |
| `text-status-warning` | Warning states |
| `text-status-error` | Error states |
| `text-status-info` | Info states |
| `bg-live-dot` | Live/online indicator |

---

## 3.1 Project-Defined Utilities (Important)

This repo defines a few non-standard utilities and layout helpers in `app/globals.css` (Tailwind v4 CSS-first):

- Layout containers: `container`, `container-content`, `container-narrow`, `container-wide`, `container-bleed`
- Touch targets: `h-touch-xs`, `h-touch-sm`, `h-touch`, `h-touch-lg` (and related `min-h-*` utilities)
- UX helpers: `tap-transparent`, `no-scrollbar`
- Typography: `text-2xs` (10px)

If you see one of these in the codebase, it’s expected — don’t replace it with arbitrary pixel values.

---

## 4. Component Sizing

### Buttons

| Size | Height | Use |
|------|--------|-----|
| `size="xs"` | 24px (h-6) | Inline, dense UI |
| `size="sm"` | 28px (h-7) | Compact actions |
| `size="default"` | 32px (h-8) | **Standard** |
| `size="lg"` | 36px (h-9) | Primary CTAs |
| `size="icon"` | 36px (h-9) | Icon-only |
| `size="icon-sm"` | 32px (h-8) | Icon-only compact |

```tsx
// Primary CTA
<Button size="lg" className="bg-cta-trust-blue text-white">
  Buy Now
</Button>

// Secondary action
<Button variant="outline" size="default">
  Add to Cart
</Button>

// Inline action
<Button variant="ghost" size="xs">
  View
</Button>
```

### Inputs

```tsx
// Standard input - mobile-first height
<Input className="h-10 md:h-9 text-sm" />

// With label
<div className="space-y-1.5">
  <Label className="text-sm font-medium">Email</Label>
  <Input type="email" />
  <p className="text-xs text-muted-foreground">Helper text</p>
</div>
```

### Icons

| Size | Use |
|------|-----|
| `size-3` (12px) | Inside XS buttons |
| `size-3.5` (14px) | Inside SM buttons |
| `size-4` (16px) | **Standard** |
| `size-5` (20px) | Prominent icons |
| `size-6` (24px) | Large standalone |

---

## 5. Cards & Containers

### Card Pattern

```tsx
// ✅ APPROVED: Flat card with border
<div className="rounded-md border bg-card p-3">
  {content}
</div>

// ✅ With hover (desktop only)
<div className="rounded-md border bg-card p-3 lg:hover:border-border lg:hover:shadow-sm">
  {content}
</div>
```

### DON'T

```tsx
// ❌ Heavy shadows
className="shadow-lg"
className="shadow-xl"

// ❌ Large radius
className="rounded-xl"
className="rounded-2xl"

// ❌ Gradients
className="bg-gradient-to-r"
```

### Radius Values

| Class | Use |
|-------|-----|
| `rounded-sm` | 2px - badges, pills |
| `rounded-md` | 4px - **cards, inputs** (max for cards) |
| `rounded-lg` | 6px - modals only |
| `rounded-full` | Pills, avatars |

---

## 6. Shadows

| Class | Use |
|-------|-----|
| `shadow-none` | **Default for cards** |
| `shadow-sm` | Hover states, dropdowns |
| `shadow-md` | Modals, popovers |

**Rule**: Never use `shadow-lg`, `shadow-xl`, or `shadow-2xl`.

---

## 7. Grid Layouts

### Product Grid

```tsx
// Mobile: 2 cols, Desktop: up to 6 cols
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
  {products.map(p => <ProductCard key={p.id} {...p} />)}
</div>
```

### Content Grid

```tsx
// 2 column layout with sidebar
<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
  <aside>{filters}</aside>
  <main>{content}</main>
</div>
```

---

## 8. Responsive Breakpoints

| Prefix | Min Width | Use |
|--------|-----------|-----|
| (none) | 0px | Mobile-first |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Wide screens |

### Pattern

```tsx
// Mobile-first, then desktop overrides
<div className="p-2 md:p-3 lg:p-4">
  <h2 className="text-lg lg:text-xl">Title</h2>
  <p className="text-sm">Body text stays consistent</p>
</div>
```

---

## 9. Touch Targets

**WCAG 2.2 AA**: Minimum 24px × 24px

| Class | Size | Use |
|-------|------|-----|
| `h-6 min-w-6` | 24px | Minimum (inline icons) |
| `h-8 min-w-8` | 32px | **Standard** |
| `h-9 min-w-9` | 36px | Primary CTA |
| `h-10 min-w-10` | 40px | Large touch areas |

```tsx
// Icon button with proper touch target
<button className="size-8 flex items-center justify-center rounded-md hover:bg-accent">
  <Heart className="size-4" />
</button>
```

---

## 10. Motion

### Default: None

Most interactions should be instant. No animations.

### Allowed (sparingly)

```tsx
// Opacity fade for overlays
className="transition-opacity duration-100"

// Subtle translate for dropdowns
className="transition-transform duration-100"
```

### Forbidden

- `animate-bounce`
- `animate-spin` (except loading spinners)
- Spring/bounce effects
- Shimmer effects on skeletons
- Hover scale transforms

---

## 11. Accessibility

### Focus States

```tsx
// Already in base styles, but can be explicit:
className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
```

### Color Contrast

- Body text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum
- Interactive elements: 3:1 minimum

### Screen Readers

```tsx
// Hide decorative elements
<Icon aria-hidden="true" />

// Label interactive elements
<button aria-label="Add to wishlist">
  <Heart />
</button>
```

---

## 12. Container Classes

| Class | Max Width | Use |
|-------|-----------|-----|
| `container` | 1440px | Standard page width |
| `container-content` | 1152px | Narrower content areas |
| `container-narrow` | 768px | Forms, auth pages |
| `container-wide` | 1536px | Full-width sections |
| `container-bleed` | 1440px | No padding variant |

```tsx
// Standard page layout
<main className="container py-6">
  {content}
</main>

// Form page
<main className="container-narrow py-8">
  {form}
</main>
```

---

## Quick Decision Tree

```
Need a button?
  → Use <Button> from components/ui/button.tsx
  → Pick size: xs/sm/default/lg
  → Pick variant: default/outline/ghost/cta/deal

Need a card?
  → Use <Card> from components/ui/card.tsx
  → Or: <div className="rounded-md border bg-card p-3">

Need spacing?
  → Mobile: gap-2, p-2
  → Desktop: gap-3, p-3
  → Sections: py-6 or py-8

Need a color?
  → Check globals.css semantic tokens
  → Never hardcode hex/oklch values

Need a shadow?
  → Default: none
  → Hover: shadow-sm
  → Modal: shadow-md
  → Never: shadow-lg or higher
```
