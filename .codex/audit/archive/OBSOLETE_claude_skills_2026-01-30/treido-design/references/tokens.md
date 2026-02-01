# Design Tokens Reference for Treido

## Spacing Scale

Use Tailwind's standard spacing scale. No arbitrary values.

| Token | Value | Use Case |
|-------|-------|----------|
| `0` | 0px | Reset |
| `0.5` | 2px | Tiny gaps |
| `1` | 4px | Icon spacing |
| `1.5` | 6px | Small gaps |
| `2` | 8px | Tight spacing |
| `3` | 12px | Compact spacing |
| `4` | 16px | **Standard spacing** |
| `5` | 20px | Medium spacing |
| `6` | 24px | Section gaps |
| `8` | 32px | Large gaps |
| `10` | 40px | Section padding |
| `12` | 48px | Page sections |
| `16` | 64px | Major sections |

### Common Usage
```tsx
// Card padding
className="p-4"          // 16px all sides

// Stack spacing
className="space-y-4"    // 16px between children

// Grid gaps
className="gap-4"        // 16px grid gap

// Section margins
className="my-8"         // 32px top/bottom
```

## Typography Scale

| Class | Size | Use Case |
|-------|------|----------|
| `text-xs` | 12px | Captions, badges |
| `text-sm` | 14px | Secondary text, meta |
| `text-base` | 16px | **Body text** |
| `text-lg` | 18px | Emphasized body |
| `text-xl` | 20px | Card titles |
| `text-2xl` | 24px | Section headings |
| `text-3xl` | 30px | Page titles |
| `text-4xl` | 36px | Hero text |

### Font Weights
```tsx
className="font-normal"   // 400 - body text
className="font-medium"   // 500 - emphasis
className="font-semibold" // 600 - headings
className="font-bold"     // 700 - strong emphasis
```

### Line Heights
```tsx
className="leading-none"     // 1.0
className="leading-tight"    // 1.25
className="leading-snug"     // 1.375
className="leading-normal"   // 1.5 (default)
className="leading-relaxed"  // 1.625
className="leading-loose"    // 2.0
```

## Color Tokens (Semantic Only)

### Backgrounds
```tsx
className="bg-background"      // Page background
className="bg-card"            // Card/elevated surfaces
className="bg-muted"           // Muted sections
className="bg-primary"         // Primary actions
className="bg-secondary"       // Secondary elements
className="bg-accent"          // Accents/highlights
className="bg-destructive"     // Errors/destructive
```

### Text
```tsx
className="text-foreground"           // Primary text
className="text-muted-foreground"     // Secondary text
className="text-primary-foreground"   // On primary bg
className="text-secondary-foreground" // On secondary bg
className="text-destructive"          // Error text
```

### Borders
```tsx
className="border-border"      // Default borders
className="border-input"       // Input borders
className="border-ring"        // Focus rings
```

## Sizing

### Container Widths
```tsx
className="max-w-sm"    // 384px - Narrow content
className="max-w-md"    // 448px - Forms
className="max-w-lg"    // 512px - Cards
className="max-w-xl"    // 576px - Medium content
className="max-w-2xl"   // 672px - Wide content
className="max-w-4xl"   // 896px - Page content
className="max-w-6xl"   // 1152px - Wide layouts
className="max-w-7xl"   // 1280px - Max page width
```

### Touch Targets
```tsx
// Minimum 44px for mobile
className="min-h-11 min-w-11"  // 44px
className="h-10 w-10"          // 40px (icons)
className="h-12"               // 48px (buttons)
```

## Responsive Breakpoints

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile (default) |
| `sm:` | 640px | Large phones |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large screens |

### Mobile-First Example
```tsx
// Single column mobile, 2 cols tablet, 3 cols desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

## Shadows & Elevation

```tsx
className="shadow-sm"     // Subtle elevation
className="shadow"        // Default elevation
className="shadow-md"     // Medium elevation
className="shadow-lg"     // High elevation (modals)
```

## Border Radius

```tsx
className="rounded-sm"    // 2px
className="rounded"       // 4px
className="rounded-md"    // 6px
className="rounded-lg"    // 8px
className="rounded-xl"    // 12px
className="rounded-2xl"   // 16px
className="rounded-full"  // Circular
```

## Z-Index Scale

| Value | Use Case |
|-------|----------|
| `z-0` | Base |
| `z-10` | Dropdowns |
| `z-20` | Sticky headers |
| `z-30` | Fixed elements |
| `z-40` | Modals (backdrop) |
| `z-50` | Modals (content) |

## Forbidden Patterns

```tsx
// ❌ NEVER use these
className="p-[13px]"           // Arbitrary spacing
className="text-[14px]"        // Arbitrary size
className="bg-[#1a1a1a]"       // Arbitrary color
className="bg-blue-500"        // Palette color
className="bg-gradient-to-r"   // Gradients
```
