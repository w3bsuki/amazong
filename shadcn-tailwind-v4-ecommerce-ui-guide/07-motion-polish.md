# 07 — Motion & Polish (the “app feel” layer)

A good marketplace UI isn’t just colors — it’s **micro-interactions**:
- press feedback
- smooth sheet transitions
- subtle fades on content load
- skeletons instead of spinners

shadcn v4 projects use **tw-animate-css** for animation utilities (Tailwind v4 compatible).

---

## The rules (don’t overdo it)

1. **Motion should explain change** (enter/exit, state change), not distract.
2. Keep durations tight:
   - 120–200ms for press/hover
   - 200–350ms for sheets/drawers
3. Respect reduced-motion users:
   - wrap “extra” animation in `motion-safe:*` utilities when possible.

---

## What to animate in a marketplace UI

### 1) Sheet/Drawer open & close
- `animate-in fade-in slide-in-from-bottom-8`
- close: `animate-out fade-out slide-out-to-bottom-8`

Use `data-[state=open]` selectors where needed.

### 2) Product card press feedback
- `active:scale-[0.985]`
- `transition-transform duration-150`

### 3) Wishlist toggle
- quick “pop” effect on the icon:
  - `active:scale-110` (very subtle)

### 4) Loading states
- use `Skeleton` for layout stability
- optional shimmer is okay, but avoid heavy animations

---

## tw-animate-css quick examples

Make sure `@import "tw-animate-css";` exists in your global CSS.

```html
<!-- Fade + zoom in on mount -->
<div class="animate-in fade-in zoom-in duration-200">...</div>

<!-- Slide in from top by 8 spacing units -->
<div class="animate-in fade-in slide-in-from-top-8 duration-300">...</div>

<!-- Exit animation -->
<div class="animate-out fade-out slide-out-to-top-8 duration-200">...</div>
```

---

## App-like “frosted bars” (header/nav)

Use blur only on sticky UI chrome:

- `bg-background/80`
- `backdrop-blur-md`
- `supports-[backdrop-filter]:bg-background/60`

Avoid blur on product cards; it looks messy and reduces clarity.

---

## The “polish checklist”

- [ ] Bottom nav has safe-area padding.
- [ ] Header feels elevated (border + subtle blur).
- [ ] Cards have consistent radius and shadow (`shadow-card`).
- [ ] Press states exist on all tappable elements.
- [ ] Focus rings are visible and consistent.
- [ ] No layout shift on load (use skeletons).
- [ ] Animations are subtle and not everywhere.
