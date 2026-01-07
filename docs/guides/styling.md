# Styling Guide

Reference for Tailwind CSS v4, design tokens, and visual consistency on Treido. This is the **canonical styling guide** for both humans and agents.

## Quick Reference

**Gates (run after every change):**
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:e2e:smoke
```

**Drift scan:**
```bash
pnpm -s exec node scripts/scan-tailwind-palette.mjs
```

---

## Non-Negotiables

- **No gradients** - Backgrounds are solid colors only
- **Cards are flat** - `border`, `rounded-md` max, no heavy shadows
- **No arbitrary values** - Use Tailwind scale, not `h-[42px]` or `text-[13px]`
- **Dense spacing** - Mobile `gap-2`, desktop `gap-3`

## Tailwind CSS v4

### Key v4 Changes
- **CSS-first config**: Use `@theme` directive in CSS
- **Import**: `@import "tailwindcss"` (single import)
- **Variables**: Native CSS variables
- **Syntax**: `w-(--token)` not `w-[var(--token)]`

### Configuration Files
- Global styles: `app/globals.css`
- PostCSS: `postcss.config.mjs`

## Color System

### Use Semantic Tokens
```tsx
// GOOD - semantic tokens
className="bg-background text-foreground"
className="bg-primary text-primary-foreground"
className="bg-muted text-muted-foreground"
className="bg-card border-border"

// GOOD - CSS variable (v4 syntax)
className="bg-(--my-brand-color)"

// AVOID - arbitrary hex
className="bg-[#1a1a1a] text-[#fafafa]"
```

### Available Tokens
| Token | Use |
|-------|-----|
| `background` / `foreground` | Base colors |
| `primary` / `primary-foreground` | Brand/action |
| `secondary` / `secondary-foreground` | Secondary actions |
| `muted` / `muted-foreground` | Subdued elements |
| `accent` / `accent-foreground` | Highlights |
| `destructive` / `destructive-foreground` | Errors/danger |
| `border` | Border color |
| `ring` | Focus ring |

## Typography

### Font Sizes (Use Tailwind Scale)
```
text-xs    - 12px (captions, badges)
text-sm    - 14px (secondary text)
text-base  - 16px (body text)
text-lg    - 18px (emphasized body)
text-xl    - 20px (subheadings)
text-2xl   - 24px (headings)
text-3xl   - 30px (page titles)
```

### Font Weights
- `font-normal` (400) - Body text
- `font-medium` (500) - Emphasis
- `font-semibold` (600) - Headings
- `font-bold` (700) - Strong (use sparingly)

## Spacing

### Use Tailwind Scale
```
1 = 4px    4 = 16px    8 = 32px
2 = 8px    5 = 20px    10 = 40px
3 = 12px   6 = 24px    12 = 48px
```

### Patterns
```tsx
// Card content
<CardContent className="p-4 space-y-3">

// Form fields
<div className="space-y-4">

// Button groups
<div className="flex gap-2">
```

## Border Radius

### Standard Values
- `rounded-sm` - 2px (subtle)
- `rounded` - 4px (default)
- `rounded-md` - 6px (cards, inputs)
- `rounded-lg` - 8px (modals)

### Avoid
- `rounded-xl`, `rounded-2xl`, `rounded-3xl`
- `rounded-full` (except avatars, badges)

## Shadows

### Rules
- Cards: `shadow-sm` max, prefer `border` only
- Dropdowns/modals: `shadow-md` acceptable
- **Never**: `shadow-xl`, `shadow-2xl`

## Responsive Design

### Mobile-First
```tsx
// Base = mobile, md: = tablet+, lg: = desktop+
className="p-3 md:p-4 lg:p-6"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
```

### Breakpoints
```
sm:  640px  (rarely needed)
md:  768px  (tablet, common)
lg:  1024px (desktop)
xl:  1280px (use sparingly)
```

## shadcn/ui Components

### Import Pattern
```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
```

### Customization
- Modify via className prop, not component source
- Use `cn()` utility for conditional classes
- Don't add feature logic to ui components

```tsx
import { cn } from '@/lib/utils';

<Button className={cn(
  "w-full",
  isActive && "bg-primary",
  disabled && "opacity-50"
)}>
```

## Icons (lucide-react)

### Sizing
- Small (inline): `h-4 w-4`
- Default: `h-5 w-5`
- Large (standalone): `h-6 w-6`

```tsx
import { ShoppingCart } from 'lucide-react';

<Button>
  <ShoppingCart className="h-4 w-4 mr-2" />
  Add to Cart
</Button>
```

## Animation

### Minimal Motion
- **Allowed**: Loading spinners, smooth transitions
- **Avoid**: `animate-bounce`, `animate-pulse`, parallax

```tsx
// Loading spinner (OK)
<Loader2 className="h-4 w-4 animate-spin" />

// Smooth transition (OK)
className="transition-colors duration-150"
```

## Common Patterns

### Product Card
```tsx
<Card className="border rounded-md overflow-hidden">
  <div className="aspect-square relative">
    <Image ... className="object-cover" />
  </div>
  <CardContent className="p-3 space-y-1">
    <h3 className="font-medium text-sm line-clamp-2">{name}</h3>
    <p className="text-lg font-semibold">{price}</p>
  </CardContent>
</Card>
```

### Form Layout
```tsx
<form className="space-y-4">
  <div className="space-y-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" />
  </div>
  <Button type="submit" className="w-full">Submit</Button>
</form>
```

### Page Container
```tsx
<div className="container mx-auto px-4 py-6 md:py-8">
  {/* Page content */}
</div>
```

## Quick "Good Defaults"

- Card: `rounded-md border border-border bg-card p-3`
- Section spacing: `space-y-3` (desktop) / `space-y-2` (mobile)
- Muted surface: `bg-muted/50 text-muted-foreground border-border`

## Verification Checklist

Before marking styling work complete:

- [ ] No gradients added
- [ ] Cards are flat (border, rounded-md max)
- [ ] Using semantic color tokens
- [ ] No arbitrary values
- [ ] Spacing uses Tailwind scale
- [ ] Tested on mobile (390×844)
- [ ] Tested on desktop (1440×900)
- [ ] `pnpm -s exec node scripts/scan-tailwind-palette.mjs` passes
