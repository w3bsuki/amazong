# 09 — Mobile-First UX: End Goal

---

## Principle

Layout-driven spacing. Zero manual padding hacks. Every page mobile-audited.

---

## Layout-Driven Bottom Spacing

### The Fix (REF-ALIGNMENT-011)

**Delete all 14 `pb-20` hacks.** Bottom clearance is a layout concern.

#### Option A: Layout Shell (preferred)
```tsx
// app/[locale]/(main)/layout.tsx
export default function MainLayout({ children }) {
  return (
    <>
      <div className="pb-tabbar-safe md:pb-0">{children}</div>
      <MobileTabBar />
    </>
  );
}
```
Every page inside `(main)` automatically gets bottom clearance on mobile, none on desktop.

#### Option B: CSS-only
```css
/* utilities.css — already exists */
.pb-tabbar-safe {
  padding-bottom: calc(var(--spacing-bottom-nav) + var(--spacing-content-padding));
}
```
Apply once on the layout wrapper, never on individual pages.

### Result
- **14 → 0** manual `pb-20` references
- New pages auto-correct
- Desktop (`md:`) gets zero bottom padding
- Maintenance cost: zero

---

## Mobile Chrome Contract

### Header
```
Every (main) page gets:
  - Auto header variant detection from route metadata
  - Fixed top, z-header
  - Safe area + status bar clearance
```

### Tab Bar
```
Every (main) page gets:
  - Fixed bottom, z-nav
  - Hidden at md: breakpoint
  - Active state from pathname
  - Auth-driven sell/chat/profile behavior
```

### Contract
- `components/layout/mobile-tab-bar.tsx` — the single source
- `components/layout/mobile-header.tsx` — header with variant prop
- `app/[locale]/(main)/layout.tsx` — composes both, adds spacing

---

## Touch Target Audit (REF-POLISH-007)

### All interactive elements verified at:
- **Minimum 44×44px** tap area (`--control-default`)
- **Primary CTAs 48×48px** (`--control-primary`)
- **Compact actions 36×36px** only when visually grouped

### Audit Process
1. Screenshot every route at 375×812 (iPhone SE)
2. Overlay 44px grid
3. Flag any tappable element smaller than minimum
4. Fix with `min-h-11 min-w-11` or padding

---

## 375px Viewport Audit (REF-POLISH-007, sub-task)

### Every `(main)` route validated at 375px:
- [ ] No horizontal overflow
- [ ] No text truncation that hides meaning
- [ ] Touch targets meet minimums
- [ ] Proper empty states for zero-data
- [ ] Loading skeletons match content layout
- [ ] No overlapping elements

### Tools
- Playwright: `devices['iPhone SE']` viewport
- Manual: DevTools responsive mode

---

## Drawer Standardization

### Current: 6 drawers with inconsistent APIs
### Target: Unified drawer contract

```tsx
// Every drawer follows:
<DrawerShell title={string} onClose={fn}>
  <DrawerBody>{content}</DrawerBody>
  <DrawerFooter>{actions}</DrawerFooter>
</DrawerShell>
```

- All drawers use Vaul (already true)
- Consistent snap points: `[0.5, 0.85]` for content drawers
- Close on outside tap + swipe down
- Focus trap on open

---

## Empty States

### Every route group has a designed empty state:
| Route | Empty State Message |
|-------|-------------------|
| Search results | "No items match your filters" + reset CTA |
| Wishlist | "Save items you love" + browse CTA |
| Cart | "Your cart is empty" + browse CTA |
| Orders | "No orders yet" + shop CTA |
| Messages | "No conversations" + browse CTA |
| Seller products | "You haven't listed anything" + sell CTA |

### Implementation
```tsx
// components/shared/empty-state.tsx
export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  // Consistent layout, semantic tokens, optional CTA
}
```

---

## Acceptance Criteria

| Metric | Current | Target |
|--------|---------|--------|
| Manual pb-20 hacks | 14 | 0 |
| Layout-driven spacing | 1 utility | All (main) pages |
| Touch targets < 44px | Unknown | 0 |
| 375px overflow routes | Unknown | 0 |
| Missing empty states | ~6 routes | 0 |
| Drawer API variants | ~3 patterns | 1 unified |
