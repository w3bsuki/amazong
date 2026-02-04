# animations.md — Transitions & Motion

> Animation patterns for Treido marketplace.

## Transition Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 50ms | Instant feedback (checkbox, toggle) |
| `--duration-fast` | 100ms | Quick interactions (button press, hover) |
| `--duration-normal` | 200ms | Standard animations (modal open, tab switch) |
| `--duration-slow` | 300ms | Complex animations (page transitions, carousel) |

| Easing | Value | Usage |
|--------|-------|-------|
| `--ease-snappy` | `cubic-bezier(0.2, 0, 0, 1)` | Buttons, taps, quick interactions |
| `--ease-smooth` | `cubic-bezier(0.4, 0, 0.2, 1)` | Page transitions, modals |

## Tailwind Transition Classes

```tsx
// Quick hover feedback
<button className="transition-colors duration-(--duration-fast)">

// Button with scale on press
<button className="
  transition-all duration-(--duration-fast)
  active:scale-[0.98]
">

// Modal/dialog open
<div className="
  transition-opacity duration-(--duration-normal)
  ease-(--ease-smooth)
">
```

## Common Animation Patterns

### Button Press Feedback

```tsx
<Button className="
  transition-all duration-(--duration-fast)
  hover:opacity-90
  active:scale-[0.98]
">
  Submit
</Button>
```

### Card Hover Elevation

```tsx
<Card className="
  transition-shadow duration-(--duration-fast)
  hover:shadow-md
">
```

### Tab Indicator

```tsx
<div className="
  transition-transform duration-(--duration-normal)
  ease-(--ease-snappy)
">
```

### Fade In/Out

```tsx
// Enter
<div className="
  animate-in fade-in
  duration-(--duration-normal)
">

// Exit
<div className="
  animate-out fade-out
  duration-(--duration-fast)
">
```

## Motion Library (Framer Motion)

When CSS isn't sufficient, use the Motion library:

```tsx
import { motion, AnimatePresence } from "framer-motion";

// Staggered list
<AnimatePresence>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: i * 0.05 }}
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>

// Sheet/drawer spring
<motion.div
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }}
  transition={{ type: "spring", damping: 25, stiffness: 300 }}
>
```

### When to Use Motion vs CSS

| Use CSS | Use Motion |
|---------|------------|
| Simple hover/focus | Complex orchestration |
| Single property | Multi-step sequences |
| No exit animation | Enter/exit animations |
| Performance critical | Physics-based springs |

## Skeleton Loading

```tsx
// Shimmer pulse effect
<Skeleton className="animate-pulse" />

// Multiple skeletons
<div className="space-y-2">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
  <Skeleton className="h-4 w-1/2" />
</div>
```

## CRITICAL: Reduced Motion

**Always respect user preference:**

```tsx
// Tailwind utility
<div className="
  transition-transform
  motion-reduce:transition-none
">

// CSS media query (in utilities.css)
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

// Motion library
const prefersReducedMotion = useReducedMotion();
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
>
```

## Forbidden Animation Patterns

| ❌ Never | Why |
|----------|-----|
| Autoplay videos with motion | Distracting, accessibility |
| Flashing content (>3 flashes/sec) | Seizure risk (WCAG) |
| Long animations (>500ms) | Feels slow |
| Animation blocking interaction | Frustrating UX |
| No reduced-motion fallback | Accessibility violation |

## Checklist

- [ ] Use semantic duration tokens (`--duration-*`)
- [ ] Use semantic easing tokens (`--ease-*`)
- [ ] Respect `prefers-reduced-motion`
- [ ] Keep animations under 300ms for interactions
- [ ] Exit animations match or faster than enter
- [ ] No layout shift from animations
