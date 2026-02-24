# 07 — Components: Current State

---

## Architecture

| Folder | Files | Client % | Purpose |
|--------|-------|----------|---------|
| `components/ui/` | 34 | ~15% | shadcn/ui primitives |
| `components/shared/` | 60+ | ~25% | Cross-route composites |
| `components/layout/` | 20+ | ~30% | App shells |
| `components/mobile/` | 15+ | ~50% | Mobile-specific UI |
| `components/desktop/` | 4 | ~75% | Desktop-specific UI |
| `components/auth/` | 10 | ~80% | Auth forms |
| `components/dropdowns/` | 3 | 100% | User dropdowns |
| `components/providers/` | 18 | 100% | Context providers |

**Total: 173 files, 25.4% client components.** Good Server Component ratio.

---

## Server vs Client Split

### Server Components by Default
- Pages, layouts, data-fetching wrappers
- 29 files import `server-only`
- lib/ is 100% server/shared

### Client Boundary Issues

**1. Global chrome is heavy client-side:**
- `app/[locale]/_components/app-header.tsx` — large client component
- `app/[locale]/_components/mobile-tab-bar.tsx` — client component with identity fetch
- `components/providers/motion-provider.tsx` → wraps entire app in `MotionConfig`

**2. Cross-route chrome lives in wrong place:**
App header, mobile tab bar, and navigation components live in `app/[locale]/_components/` but are used across all route groups. Should be in `components/layout/`.

**3. Tab bar does client-side identity query:**
Mobile tab bar fetches user avatar/name client-side instead of deriving from `AuthStateManager`.

---

## Provider Architecture (18 files)

| Provider | Purpose | Issue |
|----------|---------|-------|
| `cart-context` | Cart state (+types, helpers, calculations, server-storage) | 5 sub-files, some `console.error` |
| `drawer-context` | Global drawer state | Clean |
| `header-context` | Header variant state | Clean |
| `message-context` | Messaging (+5 sub-modules) | 4 console statements |
| `wishlist-context` | Wishlist state | 4 console statements, `as unknown as` |
| `auth-state-manager` | Auth state singleton | 1 `as unknown as`, sensitive |
| `motion-provider` | Global MotionConfig | **Wraps all routes unnecessarily** |
| `analytics-drawer` | Dev analytics | Clean |

---

## Duplication

### Current: 89 clone clusters, 1,111 duplicated lines (0.7%)

**Highest-impact files:**
- `products-discounts.ts` — 3 self-clones, 42 lines
- `addresses-content.tsx` — 3 self-clones, 39 lines
- `account-badges.tsx` — 2 self-clones, 30 lines
- `nav-user.tsx` ↔ `account-sidebar.tsx` — 2 cross-file clones, 35 lines

### Dedup Plan (from DEDUP-ITERATION-4.md)
4 batches targeting ~53 clones and ~500 lines of elimination.

---

## Key Patterns

### Product Card System (19 files in `shared/product/card/`)
- `mobile.tsx`, `desktop.tsx`, `mini.tsx`, `list.tsx`
- Shared: `image.tsx`, `price.tsx`, `actions.tsx`, `social-proof.tsx`
- Frame/Surface composition: `product-card-frame.tsx`, `product-card-surface.tsx`
- Types: `types.ts`, `metadata.ts`
- Stretch-link pattern for full-card tap targets

### Drawer System (6 drawers in `mobile/drawers/`)
- cart, messages, product-quick-view, auth, account
- Global mount via `useDrawer()` context
- `DrawerShell` provides consistent header/close/title

### Search System (5+ files in `shared/search/`)
- AI-powered search with chat interface
- Context-based search state

---

## Pain Points

1. **Global MotionProvider** wraps all routes — heavy JS for routes without animation
2. **Cross-route chrome in _components/** — header, tab bar should be in components/layout/
3. **Console.error in providers** — 15+ raw console statements in cart, message, wishlist contexts
4. **Client-side identity queries** — tab bar fetches user data instead of deriving from auth state
5. **89 clone clusters** — dedup plan exists but hasn't been fully executed
6. **Provider sub-module sprawl** — cart-context has 5 files, message-context has 6
