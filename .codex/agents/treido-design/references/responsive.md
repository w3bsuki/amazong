# responsive.md — Breakpoints & Responsive Patterns

> Mobile-first responsive design for Treido marketplace.

## Tailwind Breakpoints

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| (none) | 0px | Mobile first (default styles) |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Extra large screens |

## CRITICAL: Mobile-First Pattern

```tsx
// ✅ GOOD - mobile first (additive)
<div className="
  grid grid-cols-2          /* mobile: 2 columns */
  sm:grid-cols-3            /* 640px+: 3 columns */
  lg:grid-cols-4            /* 1024px+: 4 columns */
">

// ❌ BAD - desktop first (subtractive)
<div className="
  grid-cols-4               /* assumes desktop */
  max-sm:grid-cols-2        /* override for mobile */
">
```

## Container Utilities

| Utility | Max Width | Usage |
|---------|-----------|-------|
| `container` | 90rem (1440px) | Standard page content |
| `container-wide` | 96rem (1536px) | Full-width layouts |
| `container-content` | `--container-header` | Match header width |
| `container-narrow` | 48rem (768px) | Forms, text content |

All containers include responsive padding:
- Mobile: 0.75rem (12px)
- `sm:` 1rem (16px)
- `lg:` 1.5rem (24px)

```tsx
<div className="container">
  {/* Content constrained to 1440px, centered, padded */}
</div>
```

## Responsive Component Patterns

### Dialog → Drawer (Mobile)

```tsx
const isMobile = useIsMobile(); // hook from lib/hooks

return isMobile ? (
  <Drawer open={open} onOpenChange={setOpen}>
    <DrawerContent>{children}</DrawerContent>
  </Drawer>
) : (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>{children}</DialogContent>
  </Dialog>
);
```

### Responsive Grid

```tsx
// Product grid
<div className="
  grid
  grid-cols-2 gap-3         /* mobile: 2 col, tight */
  sm:grid-cols-3 sm:gap-4   /* tablet: 3 col */
  lg:grid-cols-4 lg:gap-6   /* desktop: 4 col, loose */
">

// Form layout
<div className="
  flex flex-col gap-4       /* mobile: stack */
  md:flex-row md:gap-6      /* tablet+: row */
">
```

### Hide/Show by Breakpoint

```tsx
// Mobile only
<div className="md:hidden">Mobile nav</div>

// Desktop only
<div className="hidden md:block">Desktop sidebar</div>

// Tablet and up
<div className="hidden sm:flex">Tablet+ content</div>
```

## Layout Height Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-header` | 48px | Mobile header height |
| `--spacing-bottom-nav` | 48px | Mobile bottom nav |
| `--app-header-offset` | calc(header + safe-area) | Content offset |

```tsx
// Fixed header
<header className="
  fixed top-0 inset-x-0
  h-(--spacing-header)
  z-50
">

// Content below fixed header
<main className="pt-app-header md:pt-0">

// Above bottom nav (mobile)
<div className="pb-tabbar-safe md:pb-0">
```

## Safe Area Utilities

For iOS notch/Dynamic Island and home indicator:

| Class | Effect |
|-------|--------|
| `pb-safe` | `padding-bottom: env(safe-area-inset-bottom)` |
| `pb-safe-max` | `padding-bottom: max(1rem, safe-area)` |
| `pt-safe` | `padding-top: env(safe-area-inset-top)` |
| `pt-app-header` | Header + safe area offset |
| `pb-tabbar-safe` | Bottom nav + safe area (mobile only) |

```tsx
// Bottom navigation
<nav className="
  fixed bottom-0 inset-x-0
  h-(--spacing-bottom-nav)
  pb-safe
">

// Content that needs clearance
<main className="
  pt-app-header
  pb-tabbar-safe
  md:pt-0 md:pb-0
">
```

## Viewport Height

```tsx
// ❌ BAD - broken on mobile (iOS address bar)
<div className="h-screen">

// ✅ GOOD - dynamic viewport height
<div className="h-dvh">
<div className="min-h-dvh">
```

## Responsive Typography

```tsx
// Responsive heading
<h1 className="
  text-xl          /* mobile: 20px */
  sm:text-2xl      /* tablet: 24px */
  lg:text-3xl      /* desktop: 30px */
  font-semibold
">

// Responsive body
<p className="
  text-sm          /* mobile: 14px */
  md:text-base     /* desktop: 16px */
  text-muted-foreground
">
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| `max-sm:` desktop-first | Mobile-first with `sm:`, `md:` |
| Hardcoded widths | Use `container` or percentages |
| `h-screen` | `h-dvh` for full viewport |
| Fixed px for responsive | Tailwind breakpoints |
| Ignore safe areas | Use `pb-safe`, `pt-app-header` |

## Checklist

- [ ] Mobile-first approach (base → larger)
- [ ] Container utility for page content
- [ ] Safe areas handled for iOS
- [ ] `dvh` instead of `100vh`
- [ ] Dialog/Drawer swap pattern
- [ ] Touch targets maintained at all sizes
- [ ] No horizontal scroll on mobile
