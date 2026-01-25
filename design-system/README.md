# Treido Design System

**Tailwind CSS v4 + shadcn/ui + Twitter-Perfect Aesthetics**

A professional e-commerce design system built for marketplaces that need to compete with eBay and Amazon.

## Philosophy

1. **Pure Neutrals** - Backgrounds are true neutral (0 chroma) for professional clarity
2. **Twitter Blue CTAs** - `oklch(0.62 0.19 243)` for primary actions only
3. **Marketplace Density** - Optimized for product grids and transaction clarity
4. **OKLCH Everywhere** - Perceptually uniform colors that work in both modes
5. **Component-First** - shadcn/ui patterns with marketplace extensions

## Structure

```
/design-system
  /tokens
    primitives.css    # Raw color scales (neutral, brand, semantic)
    semantic.css      # Semantic aliases (success, warning, error, info)
    typography.css    # Font stacks, sizes, weights, tracking
    layout.css        # Spacing, containers, radius, breakpoints
    effects.css       # Shadows, blurs, transitions, animations
    marketplace.css   # E-commerce specific tokens (prices, badges, status)
  /utilities
    twitter.css       # Twitter-style utility classes (@utility)
    marketplace.css   # Marketplace-specific utilities
    animations.css    # Loading, transitions, micro-interactions
  /components
    button.tsx        # Reference button implementation
    badge.tsx         # Badge variants (condition, status, etc.)
    card.tsx          # Product card with proper surfaces
  theme.css           # Main entry point (imports all tokens)
  README.md           # This file
```

## Usage

### Option 1: Import theme.css (Recommended)
```css
/* In your globals.css or main CSS */
@import "tailwindcss";
@import "../design-system/theme.css";
```

### Option 2: Import specific tokens
```css
@import "tailwindcss";
@import "../design-system/tokens/primitives.css";
@import "../design-system/tokens/semantic.css";
/* ... only what you need */
```

## Key Tokens

### Colors (Primitives)
- `neutral-50` → `neutral-950` - True neutral scale (0 chroma)
- `brand-50` → `brand-900` - Twitter Blue scale
- `success`, `warning`, `error`, `info` - Semantic colors

### Typography
- `--font-sans: Inter` - Primary UI font
- `--text-2xs` → `--text-5xl` - Size scale
- `--tracking-tight` → `--tracking-wide` - Letter spacing

### Layout
- `--radius-sm` → `--radius-full` - Border radius scale
- `--spacing-*` - Touch targets, insets, heights
- `--container-*` - Width constraints

### Effects
- `--shadow-2xs` → `--shadow-2xl` - Depth scale
- `--ease-snappy`, `--ease-smooth` - Timing functions
- `--duration-instant` → `--duration-slow` - Animation durations

## Twitter-Style Utilities

```html
<!-- Primary CTA button -->
<button class="btn-twitter">Tweet</button>

<!-- Outline variant -->
<button class="btn-twitter-outline">Follow</button>

<!-- Card with Twitter borders -->
<div class="card-twitter">Content</div>

<!-- Pill badge -->
<span class="badge-pill">New</span>
```

## Marketplace Utilities

```html
<!-- Price display -->
<span class="price-sale">$29.99</span>
<span class="price-original">$49.99</span>

<!-- Condition badge -->
<span class="badge-condition-new">New</span>

<!-- Status badge -->
<span class="badge-success">In Stock</span>
```

## Animation Utilities

### Skeleton Loading
```html
<!-- Text placeholder -->
<div class="skeleton-text"></div>

<!-- Avatar placeholder -->
<div class="skeleton-avatar"></div>

<!-- Product card placeholder -->
<div class="skeleton-card"></div>

<!-- Price placeholder -->
<div class="skeleton-price"></div>
```

### Loading Spinners
```html
<!-- Circle spinner -->
<div class="spinner"></div>
<div class="spinner-sm"></div>
<div class="spinner-lg"></div>

<!-- Indeterminate progress -->
<div class="progress-indeterminate"></div>
```

### Transitions
```html
<!-- Toast animations -->
<div class="animate-toast-enter">Notification</div>
<div class="animate-toast-exit">Notification</div>

<!-- Modal animations -->
<div class="animate-backdrop-enter"></div>
<div class="animate-modal-enter">Modal content</div>

<!-- Bottom sheet (mobile) -->
<div class="animate-sheet-enter">Sheet content</div>

<!-- Dropdown -->
<div class="animate-dropdown-enter">Menu</div>
```

### Micro-interactions
```html
<!-- Button press effect -->
<button class="animate-press">Click me</button>

<!-- Card hover lift -->
<div class="animate-lift">Hoverable card</div>

<!-- Heart/like animation -->
<button class="animate-heart">❤️</button>

<!-- Add to cart pop -->
<button class="animate-cart-add">Add to Cart</button>
```

### Reduced Motion
All animations respect `prefers-reduced-motion: reduce` automatically.

## Dark Mode

Dark mode is handled via `.dark` class on `<html>` or `<body>`:

```html
<html class="dark">
  <!-- All tokens automatically switch -->
</html>
```

## WCAG Compliance

All color combinations meet WCAG 2.1 AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio
- UI components: 3:1 contrast ratio

## Migration from Legacy

If migrating from the old system, these aliases are provided:
- `--color-brand` → `--color-primary`
- `--color-interactive` → `--color-primary`
- `--color-link` → `--color-primary`
