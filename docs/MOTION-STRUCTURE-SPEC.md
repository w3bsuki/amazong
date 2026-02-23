# Motion & Structure — Spec

> Goal: Add tasteful Framer Motion to key UI surfaces + structural improvements.
> This is the second Codex pass — MOBILE-001 (spacing, touch targets, consistency) is done.
> Reference: `docs/DESIGN.md` § Motion & Accessibility, `docs/STACK.md` § Key Dependencies.

---

## Principles

**Motion philosophy:** Between minimal and tasteful. Motion communicates state changes, guides attention, and creates the feeling of a physical interface. Never decorative.

**Rules:**
1. `MotionConfig reducedMotion="user"` wraps the app — all motion auto-disables for accessibility
2. No animation on first SSR paint — content appears instantly, motion only on subsequent interactions
3. Entrance: 200-300ms ease-out. Exit: 150ms ease-in. Spring for gestures.
4. No scroll-triggered animation on mobile (performance). `whileInView` only for desktop hero sections if needed
5. Framer Motion is `"use client"` only — never in Server Components
6. Import from `"framer-motion"` (v12.x, already installed)

**Bundle impact:** Framer Motion tree-shakes well. Only import what you use: `motion`, `AnimatePresence`, `MotionConfig`, `useReducedMotion`, `stagger`. Do NOT import `LazyMotion`/`domAnimation` — the full bundle is fine for a marketplace app.

---

## Part 1: MotionConfig Provider (Foundation)

Create a motion config wrapper that auto-respects `prefers-reduced-motion`:

- [x] Create `components/providers/motion-provider.tsx`:
  ```tsx
  "use client"
  import { MotionConfig } from "framer-motion"
  
  export function MotionProvider({ children }: { children: React.ReactNode }) {
    return (
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    )
  }
  ```
- [x] Add `<MotionProvider>` to the app's provider tree (find the main providers wrapper, add it there)
- [x] This means ALL `motion.*` components automatically respect reduced motion — no per-component checks needed
- [x] The existing `prefers-reduced-motion` check in `stepper-wrapper.tsx` can stay (it's a JS check for conditional rendering, different from CSS-only)

---

## Part 2: Product Grid Staggered Entrance

The main visual payoff. When a product grid appears (homepage feed, category page, search results), cards fade-in with a subtle stagger.

- [x] Create `components/shared/product/animated-product-grid.tsx` — a thin wrapper around the existing `ProductGrid`:
  ```tsx
  "use client"
  import { motion, AnimatePresence } from "framer-motion"
  
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.04,  // 40ms between cards — subtle cascade
      },
    },
  }
  
  const item = {
    hidden: { opacity: 0, y: 8 },      // Start slightly below + invisible
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    },
  }
  ```
- [x] Wrap grid items in `motion.div` with these variants
- [x] Use `AnimatePresence` so cards animate out when switching categories/filters
- [x] The stagger should only apply to newly loaded cards, not cards already visible (use a key based on the data batch)
- [x] Apply to: homepage feed grid, category page grid, search results grid
- [x] Do NOT apply to: PDP related products (too small), cart items, account lists

---

## Part 3: Drawer Content Entrance

When a drawer opens, the content inside should have a subtle fade-in (after the drawer itself finishes its Vaul slide-up).

- [x] In `DrawerBody`, add a subtle content fade-in:
  - The content (`children`) fades from `opacity: 0` → `opacity: 1` with fast tokenized timing and no extra delay
  - Duration: 200ms ease-out
  - This is a CSS animation, NOT Framer Motion (to avoid conflict with Vaul):
    ```css
    @keyframes drawer-content-in {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    ```
  - Apply via `animate-drawer-content-in` utility class (no delay, fast tokenized timing)
  - Wrap in `motion-safe:` so it respects reduced motion
- [x] Do NOT touch the drawer's slide/drag animation — that's Vaul

---

## Part 4: Page Transitions (Category Tab Switching)

When the user taps a different category pill on the SmartRail, the product grid should cross-fade:

- [x] Wrap the `ProductFeed` content area in `AnimatePresence mode="wait"`:
  - Key on `activeSlug` (already available)
  - Enter: `opacity: 0` → `opacity: 1`, 200ms
  - Exit: `opacity: 0`, 150ms
  - No Y movement (just fade — the grid is in the same position)
- [x] Apply to:
  - Homepage category switching (in `mobile-home.tsx`)
  - Category page sub-category switching (in `mobile-category-browser-contextual.tsx`)
  - Search results when query changes
- [x] Ensure loading skeletons participate in the animation (fade in as placeholder, fade out when real content arrives)

---

## Part 5: Badge & Chip Micro-animations

Small scale+fade on badges/chips when they appear:

- [x] In badge/chip components, add entrance animation when they mount:
  - Scale from 0.92 → 1.0 + opacity 0 → 1
  - Duration: 200ms, ease-out
  - This applies to: `MarketplaceBadge`, `Badge` (when used for dynamic status like "Free Shipping", discount badges)
- [x] Only animate on dynamic appearance (not on static page load). Add the animation only when badges are inside a `motion` parent that's animating
- [x] Keep it CSS-based for simplicity:
  ```css
  @keyframes badge-pop {
    from { opacity: 0; transform: scale(0.92); }
    to { opacity: 1; transform: scale(1); }
  }
  ```

---

## Part 6: Sell Flow Step Transitions (Improve Existing)

The sell flow already uses Framer Motion with direction-aware slide transitions. Keep it but improve:

- [x] The existing `pageVariants` in `stepper-wrapper.tsx` use `x: 100` / `x: -100` — this is pixels. On mobile, 100px feels jarring. Reduce to `x: 60` or use percentage `x: "20%"` for a smoother feel
- [x] The spring transition `stiffness: 300, damping: 30` is good. Keep it
- [x] Verify the existing `prefersReducedMotion` check still works correctly (should skip animation entirely)

---

## Part 7: Structural Improvements

While adding motion, also clean up these structural issues:

- [x] `MobileBottomBar` (`app/[locale]/[username]/[productSlug]/_components/mobile/mobile-bottom-bar.tsx`): 
  - Already fixed price formatter in MOBILE-001. Verify it uses `formatPrice` from `lib/price.ts`
  - Remove the inline `formatPrice` function if it still exists
- [x] `stepper-wrapper.tsx`: The `prefersReducedMotion` state + useEffect can be replaced by the `MotionConfig reducedMotion="user"` from Part 1. But it's also doing a conditional render (skip `AnimatePresence` entirely) — that's actually MORE accessible. Keep both: MotionConfig as global safety net, local check for full skip
- [x] Verify all existing `motion-reduce:` CSS classes still work alongside `MotionConfig`— they should, they're independent
- [x] Any `from "framer-motion"` import should be consistent across files (not mixed with `"motion/react"` — we use `"framer-motion"` everywhere)

---

## Part 8: Motion Token Reference

Add these animation utilities to `app/utilities.css`:

```css
/* Stagger entrance for grid items */
@keyframes fade-up-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Drawer content entrance */
@keyframes drawer-content-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Badge/chip pop */
@keyframes badge-pop {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}

/* Tab content cross-fade */
@keyframes content-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

- [x] Add these to `app/utilities.css`
- [x] Register as Tailwind utilities: `animate-fade-up-in`, `animate-drawer-content-in`, `animate-badge-pop`, `animate-content-fade-in`
- [x] All wrapped in `motion-safe:` when used — or applied via Framer Motion which handles it via MotionConfig

---

## What NOT to Do

- Do NOT add Framer Motion to Vaul drawer slide/drag — Vaul owns that
- Do NOT add scroll-triggered animations on mobile — performance cost
- Do NOT add page route transitions (Next.js App Router doesn't support them well)
- Do NOT add loading spinners or skeleton pulse animations with Framer Motion — CSS is fine
- Do NOT change any existing Vaul/drawer behavior
- Do NOT add `motion-primitives` or any new dependencies
- Do NOT animate anything on first SSR paint
- Do NOT touch auth, payments, DB, or RLS

---

## Verification

After all changes:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

All four gates must pass.

---

*Created: 2026-02-23*
