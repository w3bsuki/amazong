# Opus Structure — Target Frontend Architecture

The ideal frontend organization after cleanup. Use this as the blueprint.

---

## Target Component Tree

```
components/
├── ui/                          # shadcn primitives ONLY (38 files)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── input.tsx
│   ├── select.tsx
│   ├── sheet.tsx
│   ├── tabs.tsx
│   ├── toast.tsx
│   └── ... (28 more primitives)
│
├── shared/                      # Domain composites (cross-route)
│   ├── product/                 # Product display components
│   │   ├── product-card.tsx           # ← CANONICAL card
│   │   ├── product-card-image.tsx
│   │   ├── product-card-price.tsx
│   │   ├── product-grid.tsx
│   │   ├── product-feed.tsx
│   │   └── product-price.tsx
│   │
│   ├── filters/                 # Filter system (consolidated)
│   │   ├── filter-hub.tsx             # ← CANONICAL filter modal
│   │   ├── filter-chips.tsx
│   │   ├── filter-list.tsx
│   │   ├── price-slider.tsx
│   │   └── sort-modal.tsx
│   │
│   ├── category/                # Category navigation
│   │   ├── category-breadcrumb-trail.tsx
│   │   ├── subcategory-circles.tsx
│   │   └── subcategory-tabs.tsx
│   │
│   ├── search/                  # Search components
│   │   └── search-overlay.tsx
│   │
│   └── wishlist/                # Wishlist components
│       └── wishlist-button.tsx
│
├── layout/                      # Shells and navigation
│   ├── header/
│   │   ├── app-header.tsx             # ← CANONICAL adaptive header
│   │   ├── minimal-header.tsx         # Checkout/auth flows
│   │   └── dashboard-header.tsx       # Dashboard variant
│   │
│   ├── sidebar/
│   │   └── sidebar.tsx                # ← CANONICAL sidebar
│   │
│   ├── footer/
│   │   └── site-footer.tsx
│   │
│   ├── nav-main.tsx
│   └── nav-secondary.tsx
│
├── mobile/                      # Mobile-specific compositions
│   ├── mobile-tab-bar.tsx             # Bottom navigation
│   ├── mobile-menu-sheet.tsx          # Hamburger menu
│   ├── mobile-home.tsx                # Home page mobile layout
│   ├── mobile-category-browser.tsx    # Category browsing
│   └── category-nav/
│       └── ...
│
├── desktop/                     # Desktop-specific compositions
│   ├── desktop-home.tsx               # Home page desktop layout
│   ├── desktop-search.tsx             # Search overlay
│   ├── desktop-filter-modal.tsx       # Desktop filter modal
│   ├── filters-sidebar.tsx            # Persistent filter sidebar
│   ├── category-sidebar.tsx           # Category navigation
│   └── feed-toolbar.tsx               # Grid/list toggle, sort
│
├── providers/                   # React context providers
│   ├── auth-state-manager.tsx
│   ├── cart-context.tsx
│   ├── wishlist-context.tsx
│   ├── currency-context.tsx
│   ├── drawer-context.tsx
│   ├── header-context.tsx
│   ├── message-context.tsx
│   ├── theme-provider.tsx
│   └── sonner.tsx
│
├── dropdowns/                   # Header dropdown menus
│   ├── account-dropdown.tsx
│   ├── messages-dropdown.tsx
│   ├── notifications-dropdown.tsx
│   └── wishlist-dropdown.tsx
│
├── auth/                        # Auth-specific UI
│   └── auth-card.tsx
│
├── category/                    # Category display
│   ├── category-breadcrumb-trail.tsx
│   ├── subcategory-circles.tsx
│   └── subcategory-tabs.tsx
│
├── orders/                      # Order-specific UI
│   └── order-status-badge.tsx
│
├── pricing/                     # Pricing display
│   └── plan-card.tsx
│
├── seller/                      # Seller-specific UI
│   └── follow-seller-button.tsx
│
├── navigation/                  # Navigation helpers
│   └── app-breadcrumb.tsx
│
└── charts/                      # Data visualization
    └── chart-area-interactive.tsx
```

---

## Target App Structure

```
app/
├── [locale]/
│   ├── layout.tsx                    # Root locale layout
│   ├── page.tsx                      # Homepage
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── loading.tsx
│   │
│   ├── (main)/                       # Public marketplace routes
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Homepage content
│   │   ├── search/
│   │   ├── categories/
│   │   ├── cart/
│   │   ├── wishlist/
│   │   ├── seller/
│   │   ├── _components/              # Route-private
│   │   ├── _lib/                     # Route-private utilities
│   │   └── _providers/               # Route-private providers
│   │
│   ├── (sell)/                       # Sell flow
│   │   ├── layout.tsx
│   │   ├── sell/
│   │   ├── _components/
│   │   ├── _actions/
│   │   └── _lib/
│   │
│   ├── (account)/                    # User account
│   │   ├── layout.tsx
│   │   ├── account/
│   │   └── @modal/
│   │
│   ├── (checkout)/                   # Checkout flow
│   │   ├── layout.tsx
│   │   ├── checkout/
│   │   ├── _components/
│   │   └── _actions/
│   │
│   ├── (auth)/                       # Authentication
│   │   ├── layout.tsx
│   │   └── (login, signup, reset)/
│   │
│   ├── (chat)/                       # Messaging
│   │   └── chat/
│   │
│   ├── (business)/                   # Business dashboard
│   │   └── dashboard/
│   │
│   ├── (plans)/                      # Subscription plans
│   │   └── plans/
│   │
│   ├── (admin)/                      # Admin panel
│   │   └── admin/
│   │
│   ├── @productModal/                # Parallel route for product modal
│   │
│   └── [username]/                   # Public profiles
│
├── actions/                          # Server actions (domain-separated)
│   ├── orders.ts                     # → Split if > 500 LOC
│   ├── products.ts                   # → Split if > 500 LOC
│   ├── payments.ts
│   ├── reviews.ts
│   ├── subscriptions.ts
│   ├── profile.ts
│   ├── username.ts                   # → Split if > 500 LOC
│   ├── seller-feedback.ts            # → Split if > 500 LOC
│   ├── buyer-feedback.ts
│   ├── seller-follows.ts
│   ├── blocked-users.ts
│   └── onboarding.ts
│
├── api/                              # API routes
│   └── ...
│
├── globals.css                       # Token system (SSOT)
├── utilities.css
└── shadcn-components.css
```

---

## Target Lib Structure

```
lib/
├── supabase/                         # Database clients
│   ├── server.ts                     # createClient, createAdminClient
│   ├── client.ts                     # Browser client
│   ├── middleware.ts                 # Middleware helpers
│   ├── shared.ts                     # Shared utilities
│   ├── messages.ts                   # Realtime messaging
│   └── database.types.ts             # Auto-generated types
│
├── data/                             # Query modules (SSOT per domain)
│   ├── products.ts                   # Product queries
│   ├── categories.ts                 # Category queries
│   ├── product-page.ts               # Product detail queries
│   ├── product-reviews.ts            # Review queries
│   └── profile-page.ts               # Profile queries
│
├── filters/                          # Filter logic (TO BE CREATED)
│   ├── filter-types.ts               # Filter type definitions
│   ├── filter-utils.ts               # URL <-> filter conversion
│   └── filter-presets.ts             # Common filter configurations
│
├── types/                            # Shared TypeScript types
│   └── ...
│
├── utils/                            # General utilities
│   └── ...
│
├── validations/                      # Zod schemas
│   └── ...
│
└── (domain utilities)                # e.g., currency.ts, shipping.ts
```

---

## Target Hooks Structure

```
hooks/
├── use-mobile.ts                     # Responsive breakpoint
├── use-toast.ts                      # Toast notifications
├── use-product-search.ts             # Search state
├── use-recently-viewed.ts            # Recent products
├── use-category-navigation.ts        # Category tree
├── use-instant-category-browse.ts    # Optimistic category
├── use-geo-welcome.ts                # Geolocation modal
├── use-badges.ts                     # User badges
├── use-category-attributes.ts        # Dynamic attributes
├── use-category-counts.ts            # Category counts
├── use-filter-count.ts               # Filter result count
└── use-view-mode.ts                  # Grid/list toggle
```

---

## File Count Targets (Post-Cleanup)

| Directory | Current | Target | Notes |
|-----------|---------|--------|-------|
| `components/ui/` | 38 | 38 | No change (shadcn) |
| `components/shared/` | 51 | ~30 | Remove duplicates |
| `components/layout/` | 22 | ~12 | Consolidate headers |
| `components/mobile/` | 17 | ~8 | Remove unused product/ |
| `components/desktop/` | 13 | ~7 | Remove unused |
| `components/providers/` | 10 | 10 | No change |
| `hooks/` | 12 | 12 | No change |
| `app/demo/` | 32 | 0 | Delete post-launch |
| **Total components** | 217 | ~150 | -30% reduction |

---

## Import Rules

### Allowed Imports
```typescript
// components/ui/* can import:
// - Nothing from app/
// - Nothing from hooks/
// - Only other ui/* primitives

// components/shared/* can import:
// - ui/*
// - lib/*
// - hooks/*

// components/layout/* can import:
// - ui/*
// - shared/*
// - hooks/*

// components/mobile/* and desktop/* can import:
// - ui/*
// - shared/*
// - hooks/*
// - providers/*

// Route-private _components/* can import:
// - All of the above
// - Other _components/* in same route group ONLY
```

### Forbidden Imports
```typescript
// NEVER import _components across route groups
import { X } from '@/app/[locale]/(sell)/_components/...'  // ❌ in (main)

// NEVER import app/* in lib/*
import { action } from '@/app/actions/...'  // ❌ in lib/

// NEVER import hooks/* in ui/*
import { useMobile } from '@/hooks/...'  // ❌ in components/ui/
```

---

## Migration Path

1. **Delete Tier 1 unused files** (49 files)
2. **Consolidate headers** (7 variants → 3)
3. **Consolidate filters** (14 files → 5)
4. **Remove demo surfaces** (32+ files → 0)
5. **Split god-file actions** (4 files → 8-12)
6. **Create lib/filters/** (extract filter logic)
7. **Final verification** (tsc + e2e:smoke)
