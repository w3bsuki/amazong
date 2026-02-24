# 04 — shadcn/ui: End Goal

---

## Primitive Purity Rule

`components/ui/` contains **only** shadcn/ui primitives with minimal, documented deviations.

### What belongs in `components/ui/`
- shadcn upstream components (can be updated from registry)
- Minor variant additions that are truly generic (e.g., `icon` size for icon buttons)
- `data-slot` attributes for CSS targeting

### What does NOT belong in `components/ui/`
- Domain-specific variants (`black`, `brand` on button)
- App-specific logic or imports
- Hooks with state management
- Direct `lib/` or `app/` imports

---

## Composition Pattern

### Treido composites in `components/shared/`

Domain-specific button variants move to composites:
```tsx
// components/shared/cta-button.tsx
import { Button } from "@/components/ui/button";

export function CtaButton({ children, ...props }) {
  return <Button variant="default" className="bg-brand-dark text-brand-light ..." {...props}>{children}</Button>;
}
```

### MarketplaceBadge (keep in `components/shared/`)
Already correct — wraps `Badge` primitive with marketplace variants.

---

## CSS Override Rules

| Override Type | Location | Example |
|--------------|----------|---------|
| Token-level (colors, spacing) | `app/shadcn-components.css` | `[data-slot="dialog-content"] { ... }` |
| Structural (layout) | Component TSX | `className="flex gap-2"` |
| Variant (new option) | CVA in component file | `variants: { size: { compact: "..." } }` |

Rule: If the override uses design tokens → CSS file. If it uses Tailwind utilities → TSX.

---

## data-slot Convention

Every shadcn component should use `data-slot` for CSS targeting:
```tsx
<div data-slot="card" className={...}>
  <div data-slot="card-header">...</div>
  <div data-slot="card-content">...</div>
</div>
```

This enables predictable CSS overrides in `shadcn-components.css`:
```css
[data-slot="card"] { border-radius: var(--radius-lg); }
```

---

## Primitives API Contract

Document in `docs/DESIGN.md` (or separate `docs/primitives-contract.md`):

| Component | Variants | Sizes | Notes |
|-----------|----------|-------|-------|
| Button | default, destructive, outline, secondary, ghost, link | default, sm, lg, icon | No `black`/`brand` (moved to composites) |
| Badge | default, secondary, destructive, outline | — | MarketplaceBadge wraps this |
| Input | — | default, sm | — |
| Dialog | — | default | Centered desktop overlay |
| Drawer | — | default | Mobile bottom sheet |
| Sheet | side: top, right, bottom, left | — | Side panels |

---

## Future: `asChild` → `render` Prop Migration

> **AUDIT NOTE:** Latest shadcn/ui releases are migrating from `asChild` to a `render` prop
> pattern (e.g., `<NavigationMenuLink render={<Link href="/docs" />}>`). This is not urgent
> but should be tracked for a future pass when updating shadcn components from the registry.

---

## Acceptance Criteria

- [ ] `components/ui/` has zero app/domain imports (lint enforced)
- [ ] `black` and `brand` button variants moved to `components/shared/`
- [ ] `data-slot` used consistently on all shadcn components
- [ ] CSS overrides centralized in `shadcn-components.css`
- [ ] Primitives API contract documented
- [ ] `icon-button` evaluated: stays in `ui/` if generic, moves to `shared/` if not
- [ ] (Future) Track `asChild` → `render` prop migration for next shadcn update
