# Mobile UX Perfection — Spec & Audit Checklist

> Goal: Make every mobile surface (375px) feel polished, consistent, and premium.
> Reference: `docs/DESIGN.md` for design system, `docs/STACK.md` for tech choices.

---

## Design North Star

Treido mobile should feel like **Depop meets Vinted meets iOS** — clean surfaces, confident spacing, fluid gestures, zero visual noise. Every screen should pass the "screenshot test": crop any screen and it looks like a designed product, not a web app.

**Key principles:**
- Touch-confident: every tap target ≥ 44px (`--control-default`), with active state feedback
- Breathing room: generous but purposeful spacing (not cramped, not wasteful)
- Surface hierarchy: content floats on subtle layers (`bg-background` → `bg-surface-subtle` → `bg-surface-elevated`)
- Consistent chrome: same header, same tab bar, same drawer patterns everywhere
- Motion: subtle, purposeful, never decorative. Vaul handles drawer physics. Framer Motion for specific enhancements only

---

## 1. Drawer & Overlay Patterns

### Product Quick View Drawer
The quick view drawer uses **inline actions** (Buy Now + Add to Cart inside the scroll area), NOT a sticky `DrawerFooter`. This is correct — the quick view is a compact preview, not a full checkout flow. The content is short enough that actions are always visible.

**Keep:** Inline actions pattern. No `DrawerFooter` for quick view.
**Improve:**
- [x] Ensure actions section has consistent spacing: `pt-1 pb-safe-max` on the actions container
- [x] Verify the "View full page" link has a ≥ 44px touch target height
- [x] Image gallery in quick view should have smooth gesture-based swiping (currently using `QuickViewImageGallery`)
- [x] Close button (X) should be 44px touch target minimum

### Drawer Animation
**Do NOT add Framer Motion to drawer animations.** Vaul handles spring-based physics natively (drag-to-dismiss, snap points, velocity-aware). Adding Framer Motion would:
- Conflict with Vaul's gesture system
- Add bundle size for no benefit
- Break the native iOS-like feel Vaul provides

**Where Framer Motion IS appropriate:**
- [ ] Staggered entrance of product cards in grids (subtle, `0.03s` per card)
- [ ] Badge/chip entrance animations (scale from 0.95 → 1.0 + fade)
- [ ] Page-level content transitions when switching tabs or categories
- [ ] Image gallery cross-fade between slides
- These are OPTIONAL polish — only add if time allows, after core work is done

### `DrawerShell` consistency
- [x] Verify all drawers use `DrawerShell` (not raw Vaul primitives)
- [x] Verify all drawers have: drag handle, proper `aria-label`, `rounded-t-2xl`, `border-t border-border`
- [x] Cart drawer, account drawer, category browse drawer, filter hub — all consistent

---

## 2. Product Detail Page (PDP) Mobile

The PDP uses `VisualDrawerSurface` to create an iOS-style "content slides over gallery" effect. The `MobileBottomBar` is a fixed bar at the bottom with category-adaptive CTAs.

**Keep:** `VisualDrawerSurface` pattern, `MobileBottomBar` fixed bar, Accordion sections.
**Improve:**
- [x] `MobileBottomBar` should respect the tab bar: when the tab bar is visible, bottom bar sits above it. Currently `pb-safe` only handles safe area, not tab bar overlap
- [x] Price formatting in `MobileBottomBar` should use the shared `formatPrice` from `lib/price.ts`, not an inline formatter
- [x] Accordion triggers should be 48px min-height (`--control-primary`) for easy touch
- [x] Space between gallery bottom and VisualDrawerSurface should be consistent (currently `-mt-4` overlap — verify this looks clean with all image sizes)
- [x] Hero specs pills should have consistent padding and touch targets
- [x] Seller preview card should be visually consistent with other cards in the system
- [x] Related/similar products grid at bottom should use the same card + spacing as the homepage feed

---

## 3. Category Page Mobile — Upgrade

The category page currently uses `SmartRail` + `ProductFeed` in a flat layout. It's functional but feels flat compared to the PDP's elevated surface treatment.

**Improve:**
- [x] Add visual hierarchy: the `SmartRail` acts as navigation chrome, the product grid should feel like the main content surface. Consider using `PageShell variant="muted"` as background with the grid area having a subtle surface treatment
- [x] Product cards in the category grid should be identical to homepage feed cards (same density, same spacing, same hover/active states)
- [x] The subcategory pill rail should have clear active states: active pill gets `bg-foreground text-background` (inverted) vs. inactive `bg-surface-subtle text-foreground`
- [x] Filter button (SlidersHorizontal icon) in SmartRail should show active filter count badge
- [x] Empty state should be consistent with homepage empty state styling
- [x] Infinite scroll trigger zone should be generous (200px rootMargin — currently correct)
- [x] Loading skeletons should match the exact card layout shape (currently `ProductGridSkeleton`)
- [x] End-of-results indicator should be subtle and consistent

---

## 4. Homepage Mobile Feed

The homepage is the best reference for what "good" looks like. Preserve its patterns.

**Audit:**
- [x] Verify 2-column grid with `gap-(--spacing-home-card-gap)` is consistent
- [x] Cards use `MobileProductCard` with `layout="feed"` — this is the canonical mobile card
- [x] SmartRail on homepage with category pills + filter action — verify active states match category page
- [x] City picker integration works smoothly (sheet opens, selection applies)
- [x] Infinite scroll with `loadMoreRef` triggers at right distance
- [x] Error/empty state styling is consistent with design system
- [x] Skeleton loading matches card shape

---

## 5. Consistent Spacing & Tokens

Every mobile surface should use the same spacing vocabulary:

| Context | Token/Value | Example |
|---------|-------------|---------|
| Page edge padding | `px-inset` (8px mobile → 12px tablet) | All page content |
| Card grid gap | `gap-(--spacing-home-card-gap)` | Product grids |
| Section gap (vertical) | `space-y-4` (16px) | Between content sections |
| Tight vertical gap | `space-y-2` or `space-y-2.5` | Within a section |
| Content-to-chrome gap | `py-2` or `py-3` | Between header/footer and content |
| Card internal padding | `p-0` (image) + `px-2 py-2` (info) | Inside product cards |

**Audit across all mobile routes:**
- [x] Homepage: spacing consistent with table above
- [x] Category page: same grid gap as homepage
- [x] Search results: same grid gap as homepage
- [x] PDP: section spacing consistent
- [x] Cart page: consistent item spacing
- [x] Account pages: consistent list spacing
- [x] Auth pages: form spacing consistent
- [x] Sell flow pages: form spacing consistent

---

## 6. Touch Target Audit

Every interactive element on mobile must be ≥ 44px in at least one dimension:

- [x] All buttons: ≥ 44px height (use `size="default"` or `size="primary"`)
- [x] All icon buttons: ≥ 44px (use `size="icon-default"`)
- [x] Nav tabs in bottom tab bar: ≥ 44px touch area
- [x] SmartRail pills: ≥ 36px height (`--control-compact`) — acceptable for horizontal pills
- [x] Accordion triggers: ≥ 48px height
- [x] Drawer drag handle area: ≥ 20px vertical touch zone
- [x] List items (settings, addresses, orders): ≥ 48px row height
- [x] Form inputs: 16px font-size minimum (prevents iOS zoom)
- [x] Links in body text: have enough padding/margin to be distinguishable tap targets

---

## 7. Dark Mode Verification

- [x] All mobile surfaces render correctly in `.dark` class
- [x] `bg-surface-elevated` is distinguishable from `bg-background` in dark mode
- [x] Borders (`border-border`, `border-border-subtle`) are visible but not heavy in dark mode
- [x] Text contrast meets WCAG AA on all surfaces
- [x] Product card images don't flash white during load
- [x] Skeleton shimmer effect works in dark mode

---

## 8. Animation & Transitions

Use existing tools:
- **Vaul:** All bottom drawers. Physics-based. Don't touch.
- **CSS transitions:** Hover, focus, active states. `duration-fast` (100ms) for instant feedback.
- **Framer Motion (optional):** Already installed (`framer-motion` 12.x). Use for:
  - [ ] `AnimatePresence` for product card grid entrance (staggered fade-in)
  - [ ] `motion.div` for badge/chip entrance (scale + fade)
  - [ ] Layout animations when switching category tabs (content cross-fade)

**Rules:**
- Honor `prefers-reduced-motion` — wrap everything in `motion.div` with `reducedMotion="user"`
- No animation on first paint (SSR content should appear instantly)
- Entrance: 200ms ease-out. Exit: 150ms ease-in. Standard curves.
- No animation on scroll (performance killer on mobile)

---

## 9. Component Consistency Checklist

- [x] All product cards on mobile use `MobileProductCard` (not custom one-offs)
- [x] All drawers use `DrawerShell` wrapper
- [x] All page backgrounds use `PageShell` with appropriate variant
- [x] All empty states use `EmptyStateCTA` component
- [x] All loading states use `ProductGridSkeleton` for grids, `Skeleton` for individual elements
- [x] All forms use `Field` / `FieldLabel` / `FieldError` pattern
- [x] All navigation uses `Link` / `redirect` from `@/i18n/routing`
- [x] No raw `<a>` tags or `next/link` imports
- [x] All icons from `lucide-react`, consistent sizing per context (16px compact, 20px default, 24px hero)
- [x] Price displays use `formatPrice` from `lib/price.ts`

---

## 10. Route-by-Route Audit

For each route, verify: correct header variant, proper spacing, touch targets, dark mode, consistent components.

- [x] `/` — Homepage (mobile home feed + smart rail + category nav)
- [x] `/categories` — Category index (if exists)
- [x] `/categories/[slug]` — Category detail (smart rail + product feed)
- [x] `/search` — Search results (search controls + product grid)
- [x] `/[username]/[productSlug]` — PDP (gallery + VisualDrawerSurface + bottom bar)
- [x] `/cart` — Cart page (item list + summary)
- [x] `/checkout/*` — Checkout flow (multi-step)
- [x] `/account/*` — Account settings, orders, addresses, wishlist
- [x] `/sell/*` — Sell flow (form + image upload)
- [x] `/chat` — Messages (if exists)
- [x] Auth pages: `/login`, `/register`, `/forgot-password`

---

## Verification

After all changes:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

All four gates must pass. No new `any` types. No palette/gradient/arbitrary value violations.

---

*Created: 2026-02-23*
