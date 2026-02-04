# mobile.md — Touch & Responsive Rules

> Mobile-first patterns for Treido marketplace.

## Touch Target Requirements

### Minimum Sizes (CRITICAL)

| Platform | Minimum | Recommended | Token |
|----------|---------|-------------|-------|
| WCAG 2.2 | 24×24px | 44×44px | `--spacing-touch-md` |
| Apple HIG | 44×44px | 48×48px | `--spacing-touch-lg` |
| Material | 48×48px | 48×48px | `--spacing-touch-lg` |

**Treido default:** 44×44px (`--spacing-touch-md`)

### Implementation

```tsx
// ❌ BAD - hardcoded arbitrary value
<button className="min-h-[44px] min-w-[44px]">

// ✅ GOOD - semantic token
<button className="min-h-(--spacing-touch-md) min-w-(--spacing-touch-md)">

// ✅ GOOD - square touch targets
<button className="size-(--spacing-touch-md)">
```

### Common Touch Target Patterns

```tsx
// Icon button with proper touch target
<button className="
  size-(--spacing-touch-md)
  flex items-center justify-center
  rounded-full
  hover:bg-accent
  active:bg-active
  transition-colors
">
  <Icon className="size-(--size-icon)" />
</button>

// List item with proper touch target
<li className="
  min-h-(--spacing-touch-md)
  flex items-center
  px-4
  hover:bg-accent
  active:bg-active
">
  {content}
</li>
```

## Tap Feedback

### Required Feedback

Every tappable element needs visual feedback:

```tsx
// ✅ GOOD - multiple feedback levels
<button className="
  bg-primary text-primary-foreground
  hover:bg-primary/90          /* subtle hover */
  active:scale-[0.98]          /* press shrink */
  active:opacity-90            /* press dim */
  transition-all duration-fast
">
  Tap me
</button>
```

### iOS Tap Highlight

Remove default iOS highlight, provide custom feedback:

```css
/* In globals.css */
a, button, [role="button"] {
  touch-action: manipulation;  /* Disable double-tap zoom */
  -webkit-tap-highlight-color: transparent;
}
```

## Responsive Breakpoints

### Tailwind Breakpoints

| Prefix | Min Width | Usage |
|--------|-----------|-------|
| (none) | 0px | Mobile first (default) |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Extra large |

### Mobile-First Pattern

```tsx
// ✅ GOOD - mobile first
<div className="
  grid grid-cols-2          /* 2 cols on mobile */
  sm:grid-cols-3            /* 3 cols on sm+ */
  lg:grid-cols-4            /* 4 cols on lg+ */
  gap-4
">

// ❌ BAD - desktop first
<div className="
  grid-cols-4               /* Assumes desktop */
  max-sm:grid-cols-2        /* Override for mobile */
">
```

## Safe Area Handling

### iOS Notch/Dynamic Island

```tsx
// Bottom navigation with safe area
<nav className="
  fixed bottom-0 inset-x-0
  pb-[env(safe-area-inset-bottom)]
  bg-background border-t border-border
">
  {/* nav content */}
</nav>

// Sticky header with safe area
<header className="
  fixed top-0 inset-x-0
  pt-[env(safe-area-inset-top)]
  bg-background border-b border-border
">
  {/* header content */}
</header>
```

### Treido Safe Area Token

```css
/* globals.css defines this */
--app-header-offset: calc(var(--header-h-mobile, 3.5rem) + env(safe-area-inset-top));
```

```tsx
// Content with header offset
<main className="pt-(--app-header-offset)">
```

## Viewport Height

### Use dvh for Full-Screen

```tsx
// ❌ BAD - 100vh broken on mobile
<div className="h-screen">

// ✅ GOOD - dynamic viewport height
<div className="h-dvh">

// ✅ GOOD - min with dvh
<div className="min-h-dvh">
```

### Modal/Drawer Heights

```tsx
// Full-screen drawer
<Drawer className="h-(--height-dialog)">  /* 90dvh */

// Compact dialog
<Dialog className="max-h-(--height-dialog-sm)">  /* 75dvh */
```

## Scroll & Touch Behavior

### Momentum Scrolling

```tsx
// ✅ Enable smooth iOS scrolling
<div className="overflow-auto overscroll-contain">
```

### Scroll Snap (Horizontal Carousels)

```tsx
<div className="
  flex gap-4 overflow-x-auto
  snap-x snap-mandatory
  scrollbar-hide
">
  {items.map(item => (
    <div className="snap-start shrink-0 w-72">
      {item}
    </div>
  ))}
</div>
```

### Pull-to-Refresh Guard

```tsx
// Prevent accidental pull-to-refresh
<div className="overscroll-none">
```

## Layout Patterns

### Bottom Navigation

```tsx
<nav className="
  fixed bottom-0 inset-x-0
  h-(--spacing-bottom-nav)
  pb-[env(safe-area-inset-bottom)]
  bg-background/95 backdrop-blur-sm
  border-t border-border
  flex items-center justify-around
  z-50
">
  {navItems.map(item => (
    <button className="
      flex flex-col items-center justify-center
      h-(--spacing-touch-lg)
      w-full
      text-xs
      hover:bg-accent
      active:bg-active
    ">
      <Icon className="size-(--size-icon)" />
      <span className="mt-0.5">{item.label}</span>
    </button>
  ))}
</nav>
```

### Floating Action Button

```tsx
<button className="
  fixed bottom-20 right-4
  size-14
  rounded-full
  bg-primary text-primary-foreground
  shadow-lg
  flex items-center justify-center
  hover:bg-primary/90
  active:scale-95
  transition-transform
  z-40
">
  <PlusIcon className="size-6" />
</button>
```

### Sticky Header

```tsx
<header className="
  sticky top-0
  h-(--spacing-header)
  bg-background/95 backdrop-blur-sm
  border-b border-border
  z-40
">
```

## Common Mobile Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Hover-only interactions | Provide tap feedback too |
| Small touch targets (<44px) | Use `--spacing-touch-md` |
| Fixed px values for height | Use `dvh` or tokens |
| Horizontal scroll on mobile | Use vertical scroll or carousel |
| Double-tap needed | Use single tap with feedback |
| Ignore safe areas | Account for notch/home indicator |
