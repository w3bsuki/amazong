# Frontend Audit — Treido Marketplace

> **Generated**: January 2026  
> **Scope**: Full frontend architecture, patterns, and improvement areas  
> **Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui

---

## 📊 Executive Summary

| Area | Current State | Health |
|------|--------------|--------|
| Component Architecture | Well-organized | ✅ Good |
| Next.js 16 Cache Components | Properly implemented | ✅ Good |
| Client/Server Boundaries | Minor optimization opportunities | 🟡 Fair |
| Design System (Tokens) | Comprehensive, needs enforcement | 🟡 Fair |
| Gradient Violations | 13 files | 🔴 Needs Fix |
| Arbitrary Values | 189 instances (97 files) | 🔴 Needs Fix |
| Hooks | Well-structured | ✅ Good |
| i18n | Complete (en/bg) | ✅ Good |
| TypeScript Coverage | Strong | ✅ Good |

---

## 🏗️ Architecture Overview

### Directory Structure

```
app/
├── [locale]/                    # i18n root (en, bg)
│   ├── (account)/              # Protected user account routes
│   ├── (admin)/                # Admin dashboard
│   ├── (auth)/                 # Auth flows (login, signup, reset)
│   ├── (business)/             # Seller business dashboard
│   ├── (chat)/                 # Real-time messaging
│   ├── (checkout)/             # Checkout flow
│   ├── (main)/                 # Public marketplace (home, products, categories)
│   ├── (plans)/                # Subscription plans
│   ├── (sell)/                 # Seller listing management
│   ├── layout.tsx              # Root locale layout
│   └── locale-providers.tsx    # Provider composition
├── actions/                    # Server Actions (13 files)
├── api/                        # Route Handlers (~20 endpoints)
└── globals.css                 # Design tokens + Tailwind v4
```

### Component Architecture

```
components/
├── ui/                 # shadcn/ui primitives (38 components)
├── layout/             # Shell components (header, footer, sidebar)
├── shared/             # Cross-route composites
├── providers/          # React Context providers (7 providers)
├── auth/               # Auth-specific components
├── buyer/              # Buyer-facing features
├── seller/             # Seller-facing features
├── mobile/             # Mobile-specific components
├── desktop/            # Desktop-specific components
├── navigation/         # Navigation components
├── pricing/            # Pricing/plan components
└── promo/              # Promotional banners
```

---

## 🎨 Design System Status

### Tokens (Source of Truth: `app/globals.css`)

**Typography Tokens** ✅
| Token | Value | Purpose |
|-------|-------|---------|
| `text-2xs` | 10px | Tiny badges |
| `text-xs` | 12px | Meta, captions |
| `text-sm` | 14px | Body (default) |
| `text-base` | 16px | Prices, emphasis |
| `text-lg` - `text-2xl` | 18-24px | Headings |

**Spacing Tokens** ✅
| Token | Value | Purpose |
|-------|-------|---------|
| `gap-2` | 8px | Mobile spacing |
| `gap-3` | 12px | Desktop spacing |
| `h-touch-xs/sm/md/lg` | 24-36px | Touch targets |
| `--page-inset` | 8px | Mobile edge padding |

**Container Tokens** ✅
- `--container-dropdown-sm/md/lg`
- `--container-modal-sm/md/lg`
- `--container-gallery`
- `--container-header-content`

**Color Tokens** ✅
- Full shadcn compatibility (`--color-background`, `--color-foreground`, etc.)
- Marketplace semantics (`--color-brand`, `--color-price-*`, `--color-deal-*`)
- Status colors (`--color-success/warning/error/info`)
- Dark mode parity (~95% coverage)

### Design Violations to Fix

#### Gradient Violations (13 total)

| File | Count | Priority |
|------|-------|----------|
| `wishlist-page-client.tsx` | 3 | High |
| `toast.tsx` | 3 | High |
| `page.tsx` (home) | 1 | High |
| `desktop-layout.tsx` | 1 | High |
| `cookie-consent.tsx` | 1 | Medium |
| `start-selling-banner.tsx` | 1 | Medium |
| `mobile-filters.tsx` | 1 | Medium |
| Other wishlist pages | 2 | Medium |

**Rule**: No gradients. Replace with solid semantic tokens.

#### Arbitrary Value Violations (189 total)

| Pattern | Count | Replace With |
|---------|-------|--------------|
| `w-[px]` | ~50 | Container tokens |
| `h-[px]` | ~40 | Touch target tokens |
| `text-[px]` | ~30 | Typography scale |
| `gap-[px]` | ~25 | Standard spacing |
| `rounded-[px]` | ~20 | Radius tokens |
| `p-[px]` / `m-[px]` | ~24 | Standard spacing |

**Top offending files**:
- `products-table.tsx` (6)
- `chat/loading.tsx` (6)
- `sidebar.tsx` (6)
- `plan-card.tsx` (6)
- `drawer.tsx` (5)

---

## ⚛️ React Patterns

### Provider Stack (locale-providers.tsx)

```tsx
IntlClientProvider
  └── ThemeProvider
      └── AuthStateManager
          └── CartProvider
              └── WishlistProvider
                  └── {children}
```

**Strengths**:
- Clean composition
- Single auth listener via `AuthStateManager`
- Optimistic updates in `WishlistProvider`

**Improvements Needed**:
- Consider lazy-loading CartProvider for guests
- MessageProvider missing from stack (chat context)

### Server/Client Boundaries

**Current Pattern** ✅
- Data fetching in Server Components via `lib/data/*.ts`
- Interactive features in Client Components
- `'use client'` directive used appropriately

**Client Component Count by Area**:
- `hooks/` → 7 (all client)
- `components/ui/` → ~15 client (Radix-based)
- `components/providers/` → 7 client
- `components/dropdowns/` → 3 client

**Optimization Opportunities**:
1. `category-icons.tsx` - Can be Server Component (no hooks)
2. Some components mark `'use client'` but only use server-safe code
3. Heavy client components could be split (code-splitting)

### Hooks Audit

| Hook | Purpose | Quality |
|------|---------|---------|
| `use-auth` | Auth state management | ✅ Good |
| `use-badges` | Badge fetching/toggling | ✅ Good |
| `use-category-navigation` | Category nav state | ✅ Good |
| `use-geo-welcome` | Geo detection modal | ✅ Good |
| `use-mobile` | Viewport detection | ✅ Good |
| `use-product-search` | Search with debounce | ✅ Good |
| `use-recently-viewed` | Local storage products | ✅ Good |
| `use-toast` | Toast notifications | ✅ Good |

**Pattern Compliance**:
- All hooks use `'use client'` directive ✅
- Proper cleanup in useEffect ✅
- Debouncing implemented where needed ✅
- localStorage access guarded for SSR ✅

---

## 🚀 Next.js 16 Patterns

### Cache Components Configuration

```typescript
// next.config.ts
cacheComponents: true,
cacheLife: {
  categories: { stale: 300, revalidate: 3600, expire: 86400 },
  products: { stale: 60, revalidate: 300, expire: 3600 },
  deals: { stale: 30, revalidate: 120, expire: 600 },
  user: { stale: 30, revalidate: 60, expire: 300 },
}
```

### Data Fetching Pattern (lib/data/*.ts)

```typescript
// ✅ Correct pattern used throughout
'use cache'
cacheTag('products', `product-${id}`)
cacheLife('products')

const supabase = createStaticClient()  // No cookies, safe for cache
```

**Verified Files**:
- `categories.ts` → 7 cached functions ✅
- `products.ts` → 3 cached functions ✅
- `product-page.ts` → 2 cached functions ✅
- `product-reviews.ts` → 1 cached function ✅
- `profile-page.ts` → 1 cached function ✅

### Route Static Params

```typescript
// ✅ Implemented in key layouts
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
```

**Status**: ✅ Locale static params in root and main layouts

---

## 🔗 i18n Patterns

### Routing (next-intl)

```typescript
// Correct usage
import { Link, useRouter } from '@/i18n/routing'  // Not 'next/navigation'
```

### Message Files

- `messages/en.json` - English translations
- `messages/bg.json` - Bulgarian translations

**Coverage**: Full coverage for UI text

---

## 📱 Responsive Design

### Breakpoint Strategy

- Mobile-first with `md:` and `lg:` breakpoints
- Mobile-specific components in `components/mobile/`
- Desktop-specific components in `components/desktop/`

### Mobile Components

- `MobileTabBar` - Bottom navigation
- `MobileSearchOverlay` - Full-screen search
- Mobile-specific product cards
- Mobile filters drawer

**Quality**: ✅ Good separation of concerns

---

## 🧪 Testing Coverage

### Unit Tests (`__tests__/`)

- `currency.test.ts`
- `format-price.test.ts`
- `geolocation.test.ts`
- `image-utils.test.ts`
- `normalize-image-url.test.ts`
- `order-status.test.ts`
- `product-card-hero-attributes.test.ts`
- `product-price.test.tsx`
- `safe-json.test.ts`
- `shipping.test.ts`
- `stripe-locale.test.ts`
- `url-utils.test.ts`
- `validations-auth.test.ts`

### E2E Tests (`e2e/`)

- `smoke.spec.ts` - Critical paths
- `auth.spec.ts` - Authentication flows
- `seller-routes.spec.ts` - Seller features
- `orders.spec.ts` - Order management
- `reviews.spec.ts` - Review system
- `profile.spec.ts` - Profile pages
- `accessibility.spec.ts` - A11y checks
- `mobile-responsiveness.spec.ts` - Mobile tests

---

## 🎯 Improvement Areas

### High Priority

1. **Remove 13 gradient violations** - Replace with solid colors
2. **Reduce arbitrary values** - Use design tokens
3. **Optimize client boundary** - Review unnecessary `'use client'`
4. **Add MessageProvider** - Chat context missing from provider stack

### Medium Priority

5. **Component code-splitting** - Heavy components like charts
6. **Image optimization** - Review lazy loading patterns
7. **Form validation consistency** - Standardize Zod schemas
8. **Error boundary coverage** - Add to critical paths

### Low Priority

9. **Remove dead code** - Unused components/hooks
10. **Documentation** - Component storybook/docs
11. **Type refinement** - Reduce `unknown` and `any` usage
12. **Console cleanup** - Remove development logs

---

## 📋 Frontend Metrics

| Metric | Value | Target |
|--------|-------|--------|
| UI Primitives | 38 | - |
| Shared Components | ~25 | - |
| Hooks | 7 | - |
| Providers | 7 | - |
| Server Actions | 13 | - |
| API Routes | ~20 | - |
| Test Files | 13 unit + 10 E2E | - |
| Gradient Violations | 13 | 0 |
| Arbitrary Values | 189 | < 20 |
| TypeScript Strict | Yes | Yes |

---

## 🔗 Related Documents

- [backend.md](./backend.md) - Backend patterns audit
- [issues.md](./issues.md) - All identified issues
- [tasks.md](./tasks.md) - Phased execution plan
- [guide.md](./guide.md) - Execution guide
- `cleanup/DESIGN-SYSTEM-STATUS.md` - Detailed token audit
