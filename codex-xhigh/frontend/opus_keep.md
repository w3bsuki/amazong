# Opus Keep — Frontend Patterns to Preserve

Code, patterns, and architecture decisions that are working well and should be maintained.

---

## 1. Component Boundary Model ✅

The repo correctly implements the three-tier component model:

```
components/
├── ui/          # Primitives only (shadcn) — NO app imports
├── shared/      # Domain composites — cross-route usage
├── layout/      # Shells (header/nav/sidebar/footer)
```

**Evidence**: Grep found zero `@/app` imports in `components/ui/`.

### Rules to Preserve
- `components/ui/*` must never import from `@/app/`, `@/hooks/`, or other component folders
- `components/shared/*` can import from `ui/` but not from `layout/`
- `components/layout/*` can import from both `ui/` and `shared/`

---

## 2. Token System in globals.css ✅

Single source of truth for design tokens:

```css
/* app/globals.css — preserve this pattern */
@theme {
  --color-success: ...
  --color-warning: ...
  --color-verified: ...
  --surface-card: ...
  --surface-elevated: ...
}
```

### Semantic Classes to Keep Using
```
/* Status */
text-success, bg-success
text-warning, bg-warning  
text-error, bg-error
text-verified, bg-verified

/* Surfaces */
bg-surface-card
bg-surface-elevated
bg-surface-gallery
bg-surface-overlay

/* Pricing */
text-price
text-price-sale
text-price-original
text-price-savings
```

---

## 3. Data Access Layer ✅

Centralized query modules in `lib/data/`:

```typescript
// lib/data/products.ts — this pattern works
export async function getProducts(filters) { ... }
export async function getProductById(id) { ... }
```

### Keep These Patterns
- Query functions return typed data (no `any`)
- Projections are explicit (no `select('*')`)
- Client selection is intentional:
  - `createClient()` for authenticated server operations
  - `createStaticClient()` for cached reads
  - `createAdminClient()` only for admin ops

---

## 4. Route-Private Code Convention ✅

Underscore prefix for route-private code:

```
app/[locale]/(sell)/
├── sell/
│   └── page.tsx
├── _components/     # Only imported by (sell) routes
├── _actions/        # Only imported by (sell) routes
├── _lib/            # Only imported by (sell) routes
```

**Rule**: Never import `_*` folders across route groups.

---

## 5. Hooks Organization ✅

Clean 12-hook library:

```typescript
// hooks/use-mobile.ts — correct pattern
export function useMobile() {
  // Pure React hook, no server imports
}
```

### Active Hooks (Verified Usage)
- `use-mobile.ts` — responsive breakpoint detection
- `use-toast.ts` — toast notifications (shadcn)
- `use-product-search.ts` — search state management
- `use-recently-viewed.ts` — localStorage recent products
- `use-category-navigation.ts` — category tree navigation
- `use-instant-category-browse.ts` — optimistic category UI
- `use-geo-welcome.ts` — geolocation modal state

---

## 6. Provider Architecture ✅

Thin providers with focused responsibility:

```typescript
// components/providers/cart-context.tsx — correct pattern
export const CartProvider = ({ children }) => {
  // State management only
  // No data fetching inside provider
}
```

### Active Providers
- `auth-state-manager.tsx` — auth session sync
- `cart-context.tsx` — cart state
- `wishlist-context.tsx` — wishlist state
- `theme-provider.tsx` — dark/light mode
- `currency-context.tsx` — currency selection
- `drawer-context.tsx` — global drawer state
- `header-context.tsx` — header variant selection
- `message-context.tsx` — chat unread count

---

## 7. Canonical UI Components

### Header (Primary)
```
components/layout/header/app-header.tsx
```
This is the main adaptive header. Mobile/desktop variants should derive from it.

### Product Card (Primary)
```
components/shared/product/product-card.tsx
```
Standard product card used across feeds and grids.

### Filter Hub (Primary)
```
components/shared/filters/filter-hub.tsx
```
Main filter implementation. Other filter files are candidates for removal.

### Mobile Tab Bar (Primary)
```
components/mobile/mobile-tab-bar.tsx
```
Bottom navigation for mobile. Safe-area aware.

---

## 8. Server Action Organization ✅

Domain-separated server actions:

```
app/actions/
├── orders.ts        # Order lifecycle
├── products.ts      # Product CRUD
├── payments.ts      # Payment processing
├── reviews.ts       # Review system
├── subscriptions.ts # Plan management
├── profile.ts       # User profile
├── username.ts      # Username/handle
├── seller-feedback.ts
├── buyer-feedback.ts
├── seller-follows.ts
├── blocked-users.ts
├── onboarding.ts
```

**Note**: Some files are large (800+ LOC) and may need splitting, but the domain separation is correct.

---

## 9. i18n Routing ✅

Using `@/i18n/routing` for locale-aware navigation:

```typescript
// Correct pattern
import { Link, useRouter } from '@/i18n/routing';

// NOT next/navigation for localized routes
```

---

## 10. Styling Patterns to Preserve

### Card Pattern
```tsx
<div className="rounded-md border border-border bg-card p-3">
```

### Active Pill
```tsx
<button className="bg-foreground text-background border-foreground">
```

### Inactive Pill
```tsx
<button className="bg-background text-muted-foreground border-border/60">
```

### Sticky Header
```tsx
<header className="bg-background/90 backdrop-blur-md border-b border-border/50">
```

### Bottom Nav
```tsx
<nav className="bg-card/95 backdrop-blur-xl border-t border-border/60">
```

---

## Files to Explicitly Preserve

```
components/ui/*                          # All shadcn primitives
components/shared/product/product-card.tsx
components/shared/filters/filter-hub.tsx
components/layout/header/app-header.tsx
components/mobile/mobile-tab-bar.tsx
components/providers/*                   # All providers (audit for unused exports)
hooks/*                                  # All hooks
lib/supabase/*                           # Client configuration
lib/data/*                               # Query modules
app/globals.css                          # Token system
```
