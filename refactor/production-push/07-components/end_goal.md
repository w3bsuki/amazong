# 07 — Components: End Goal

---

## Target Architecture

### Layer Rules

```
components/
├── ui/           ← Pure shadcn primitives (NO app/lib imports)
├── shared/       ← Cross-route composites (product cards, fields, drawers, badges)
├── layout/       ← App shells (header, sidebar, bottom nav, page shell)
│   ├── header/   ← ALL header variants (standard, contextual, product, homepage)
│   ├── sidebar/  ← Desktop sidebar navigation
│   ├── bottom-nav/ ← Mobile tab bar (moved FROM app/[locale]/_components/)
│   └── page-shell.tsx ← Content wrapper with spacing
├── mobile/       ← Mobile-specific composites
│   ├── chrome/   ← Rails, discovery bar
│   ├── drawers/  ← Bottom sheet overlays
│   └── category-nav/
├── desktop/      ← Desktop-specific composites
├── auth/         ← Auth form components
├── dropdowns/    ← User dropdown menus
└── providers/    ← Client state contexts (minimal, no DB calls)
```

### Provider Cleanup

| Provider | Change |
|----------|--------|
| `motion-provider` | **DELETE** — load MotionConfig only where animations are used |
| `cart-context` | Replace `console.error` → `logger.error` |
| `message-context` | Replace `console.error` → `logger.error` |
| `wishlist-context` | Replace `console.error` → `logger.error`, remove `as unknown as` |
| `auth-state-manager` | No changes (sensitive — requires human approval) |

### Cross-Route Chrome Migration

| Component | Current Location | Target Location |
|-----------|-----------------|-----------------|
| `app-header.tsx` | `app/[locale]/_components/` | `components/layout/header/` |
| `mobile-tab-bar.tsx` | `app/[locale]/_components/` | `components/layout/bottom-nav/` |
| Shared nav components | `app/[locale]/_components/` | `components/layout/` |

Route-private adapters remain in `_components/` — thin wrappers that pass route-specific props.

---

## Server-First Optimization

### Reduce Client Boundary

**Current:** App header is one large client component.
**Target:** Split into:
- Server: header shell, navigation links, logo
- Client: search input, dropdown triggers, auth state display

**Current:** Tab bar does client-side identity fetch.
**Target:** Tab bar receives auth state as props from `AuthStateManager` — no duplicate query.

### Motion Provider Elimination

**Current:** `MotionProvider` wraps `locale-providers.tsx` → all routes pay framer-motion bundle cost.

**Target:** 
```tsx
// Only routes that use animation import MotionConfig
// Welcome flow, sell stepper, animated product grid
const MotionConfig = dynamic(
  () => import("framer-motion").then(m => m.MotionConfig),
  { ssr: false }
);
```

Routes affected: welcome flow (5 files), sell stepper (1 file), animated product grid (1 file).
All other routes: zero framer-motion cost.

---

## Dedup Targets

| Batch | Clones | Lines Saved |
|-------|--------|-------------|
| 1 — Action self-clones | ~14 | ~165L |
| 2 — UI self-clones | ~17 | ~200L |
| 3 — Cross-file structural | ~10 | ~130L |
| 4 — Admin stretch | ~12 | ~100L |
| **Total** | **~53** | **~595L** |

Target: <40 clone clusters (currently 89).

---

## Acceptance Criteria

- [ ] `MotionProvider` deleted from global providers
- [ ] MotionConfig loaded dynamically only where used
- [ ] App header moved to `components/layout/header/`
- [ ] Tab bar moved to `components/layout/bottom-nav/`
- [ ] Zero `console.error/warn` in providers (use logger)
- [ ] No `as unknown as` in provider code
- [ ] Tab bar derives state from AuthStateManager (no duplicate fetch)
- [ ] Duplicate clones reduced from 89 → <40 clusters
- [ ] `components/ui/` has zero app/domain imports
