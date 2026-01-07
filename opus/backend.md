# Backend Audit — Treido Marketplace

> **Generated**: January 2026  
> **Scope**: Full backend architecture, APIs, Supabase, and data layer  
> **Stack**: Supabase (Postgres + Auth + Storage) + Next.js Server Actions + Route Handlers

---

## 📊 Executive Summary

| Area | Current State | Health |
|------|--------------|--------|
| Supabase Client Usage | Correct patterns | ✅ Good |
| Server Actions | Well-structured | ✅ Good |
| Route Handlers | Needs field projection | 🟡 Fair |
| RLS Policies | Need security advisor review | 🟡 Fair |
| Cache Invalidation | Properly implemented | ✅ Good |
| Middleware (Proxy) | Optimized matchers | ✅ Good |
| Data Layer (`lib/data/`) | Clean, cached | ✅ Good |
| Validation | Zod schemas | ✅ Good |
| Error Handling | Consistent patterns | ✅ Good |

---

## 🏗️ Architecture Overview

### Backend Structure

```
lib/
├── supabase/
│   ├── server.ts         # Server clients (4 variants)
│   ├── client.ts         # Browser client (singleton)
│   ├── middleware.ts     # Auth session handling
│   ├── database.types.ts # Generated types
│   └── shared.ts         # Shared utilities
├── data/
│   ├── categories.ts     # Category fetching (7 cached)
│   ├── products.ts       # Product fetching (3 cached)
│   ├── product-page.ts   # Product page data (2 cached)
│   ├── product-reviews.ts # Review fetching (1 cached)
│   └── profile-page.ts   # Profile data (1 cached)
├── api/
│   └── response-helpers.ts # Cache headers, error responses
├── validations/
│   └── auth.ts           # Auth validation schemas
├── stripe.ts             # Stripe integration
└── shipping.ts           # Shipping logic
```

### Server Actions (`app/actions/`)

| File | Purpose | Methods |
|------|---------|---------|
| `products.ts` | Product CRUD | create, update, delete, setDiscount, clearDiscount |
| `orders.ts` | Order management | updateStatus, getSellerOrders, getBuyerOrders |
| `reviews.ts` | Review system | submit, update, delete, markHelpful |
| `profile.ts` | Profile updates | updateProfile, updateAvatar |
| `payments.ts` | Payment processing | createCheckout, handleWebhook |
| `subscriptions.ts` | Plan management | subscribe, cancel, upgrade |
| `onboarding.ts` | User onboarding | completeStep, skipOnboarding |
| `boost.ts` | Product boosting | boostProduct, cancelBoost |
| `seller-follows.ts` | Follow system | follow, unfollow |
| `seller-feedback.ts` | Seller feedback | submitFeedback |
| `buyer-feedback.ts` | Buyer feedback | submitFeedback |
| `blocked-users.ts` | User blocking | block, unblock |
| `username.ts` | Username management | checkAvailability, claim |

### Route Handlers (`app/api/`)

| Endpoint | Purpose | Method |
|----------|---------|--------|
| `/api/products/search` | Product search | GET |
| `/api/products/feed` | Product feed | GET |
| `/api/products/newest` | New products | GET |
| `/api/products/deals` | Deal products | GET |
| `/api/products/nearby` | Nearby products | GET |
| `/api/products/promoted` | Promoted products | GET |
| `/api/products/category/[slug]` | Category products | GET |
| `/api/categories/...` | Category endpoints | GET |
| `/api/orders/[id]` | Order details | GET |
| `/api/seller/...` | Seller endpoints | GET/POST |
| `/api/stores/...` | Store endpoints | GET |
| `/api/payments/...` | Payment webhooks | POST |
| `/api/subscriptions/...` | Subscription webhooks | POST |
| `/api/checkout/...` | Checkout sessions | POST |
| `/api/upload-image` | Image upload | POST |
| `/api/badges/...` | Badge system | GET/PATCH |
| `/api/geo/...` | Geo detection | GET |
| `/api/revalidate/...` | Cache revalidation | POST |
| `/api/health` | Health check | GET |

---

## 🔐 Supabase Client Usage

### Client Variants

```typescript
// lib/supabase/server.ts

// 1. Auth-dependent (cookies) - for user-specific queries
export async function createClient()

// 2. Static (no cookies) - for cached public data
export function createStaticClient()

// 3. Route Handler - for API routes
export function createRouteHandlerClient(request)

// 4. Admin - bypasses RLS (internal only)
export function createAdminClient()

// lib/supabase/client.ts

// 5. Browser client (singleton)
export function createClient()
```

### Usage Pattern Analysis

| Context | Should Use | Currently Using |
|---------|------------|-----------------|
| Server Components (cached) | `createStaticClient()` | ✅ Correct |
| Server Actions (auth) | `createClient()` | ✅ Correct |
| Route Handlers | `createRouteHandlerClient()` | ✅ Correct |
| Client Components | `createClient()` (browser) | ✅ Correct |
| Admin operations | `createAdminClient()` | ✅ Correct |

### Security Patterns

**Middleware Session Validation**:
```typescript
// lib/supabase/middleware.ts
// Uses getUser() for auth validation (not getSession())
const { data: { user } } = await supabase.auth.getUser()
```

**Protected Route Detection**:
- `/account/**` - Account pages
- `/sell/**` - Seller dashboard
- `/chat/**` - Messaging

---

## 📦 Data Layer (`lib/data/`)

### Caching Strategy

All data fetchers use Next.js 16 Cache Components:

```typescript
// Pattern used in all data files
'use cache'
cacheTag('entity', `entity-${id}`)
cacheLife('profile')  // matches next.config.ts

const supabase = createStaticClient()  // No cookies = cacheable
```

### Categories (`categories.ts`)

| Function | Cache Profile | Tags |
|----------|--------------|------|
| `getCategoryHierarchy()` | categories | categories, category-hierarchy-all |
| `getCategoryBySlug()` | categories | categories, category-{slug} |
| `getCategoryAncestry()` | categories | categories, ancestry-{slug} |
| `getCategoryAttributes()` | categories | attributes, attrs-{id} |
| `getSiblingCategories()` | categories | categories, siblings-{parentId} |
| `getChildCategories()` | categories | categories, children-{id} |
| `getCategoryContext()` | categories | categories, context-{slug} |

### Products (`products.ts`)

| Function | Cache Profile | Tags |
|----------|--------------|------|
| `getProducts()` | products | products, products-list |
| `getProductsByCategory()` | products | products, products-{category} |
| `getProductsBySeller()` | products | products, seller-{sellerId} |

### Product Page (`product-page.ts`)

| Function | Cache Profile | Tags |
|----------|--------------|------|
| `fetchProductByUsernameAndSlug()` | products | products, product-{id}, seller-{id} |
| `fetchSellerProfile()` | products | seller-{username} |

### Profile Page (`profile-page.ts`)

| Function | Cache Profile | Tags |
|----------|--------------|------|
| `getProfilePageData()` | user | profile-{username} |

---

## 🚀 Server Actions Audit

### Products (`app/actions/products.ts`)

```typescript
// Validation: Zod schema
const productSchema = z.object({
  title: z.string().min(1).max(255),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  // ... more fields
})

// Auth: getUser() validation
const { data: { user } } = await supabase.auth.getUser()

// Cache invalidation: revalidateTag with profile
revalidateTag("products:list", "max")
revalidateTag(`seller-products-${user.id}`, "max")
```

**Quality**: ✅ Follows all patterns correctly

### Orders (`app/actions/orders.ts`)

```typescript
// Ownership verification
.eq("seller_id", user.id)  // RLS + extra safety

// Status transition validation
if (newStatus === "shipped" && !existingItem.shipped_at) {
  updateData.shipped_at = now
}

// Cache invalidation
revalidateTag('orders', "max")
revalidateTag('messages', "max")
```

**Quality**: ✅ Proper ownership checks and state management

### Reviews (`app/actions/reviews.ts`)

```typescript
// Business rules enforced:
// 1. Can't review own products
// 2. Can't duplicate reviews
// 3. Rating 1-5 validation
// 4. Verified purchase detection

// Self-review prevention
if (product.seller_id === user.id) {
  return { success: false, error: "You cannot review your own product" }
}
```

**Quality**: ✅ Comprehensive validation

---

## 🌐 API Response Patterns

### Response Helpers (`lib/api/response-helpers.ts`)

```typescript
// Cache profiles
export const CACHE_PROFILES = {
  products: { ttl: 300, swr: 60 },
  deals: { ttl: 120, swr: 30 },
  categories: { ttl: 600, swr: 120 },
  shared: { ttl: 60, swr: 30 },
  private: { ttl: 0, swr: 0 },
}

// Cached response helper
export function cachedJsonResponse(data, profile = "products")

// Error response helper
export function errorResponse(message, status = 500)
```

### Search API Example

```typescript
// app/api/products/search/route.ts
export async function GET(request: Request) {
  // Input validation
  const query = rawQuery?.slice(0, 80)
  const safeLimit = Math.min(Math.max(limit, 1), 20)

  // Field projection (good)
  .select(`id, title, price, images, slug, seller:profiles(username)`)

  // Cached response
  return cachedJsonResponse({ products: transformedProducts })
}
```

---

## 🔄 Middleware/Proxy (`proxy.ts`)

### Current Implementation

```typescript
// Optimized matcher - skips static assets
export const config = {
  matcher: [
    '/((?!api(?:/|$)|_next(?:/|$)|_vercel(?:/|$)|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$|...).)*)',
  ],
}

// Features:
// 1. i18n routing (next-intl)
// 2. Geo-detection (user-country, user-zone cookies)
// 3. Session management (Supabase)
```

**Quality**: ✅ Properly scoped, doesn't run on static assets

---

## 🛡️ Security Analysis

### Authentication

| Area | Status |
|------|--------|
| Session validation | ✅ Uses `getUser()` not `getSession()` |
| Protected routes | ✅ Middleware checks account/sell/chat |
| Service key exposure | ✅ Only in server context |
| CSRF protection | ✅ Server Actions have built-in protection |

### RLS Policies

**Status**: Need to run Supabase advisors

**Recommendation**:
```bash
# Check security advisors
mcp_supabase_get_advisors({ type: "security" })

# Check performance advisors
mcp_supabase_get_advisors({ type: "performance" })
```

### Input Validation

| Area | Pattern | Status |
|------|---------|--------|
| Server Actions | Zod schemas | ✅ |
| Route Handlers | Manual + type guards | 🟡 Could improve |
| Search params | Clamping limits | ✅ |
| File uploads | Size + type validation | ✅ |

---

## 📊 Database Schema Highlights

### Key Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `profiles` | User profiles | Yes |
| `products` | Product listings | Yes |
| `categories` | Category tree | Read-only |
| `orders` | Order records | Yes |
| `order_items` | Order line items | Yes |
| `reviews` | Product reviews | Yes |
| `cart_items` | Shopping cart | Yes |
| `wishlists` | Wishlist items | Yes |
| `conversations` | Chat threads | Yes |
| `messages` | Chat messages | Yes |
| `seller_stats` | Aggregated seller metrics | Read-only |
| `subscriptions` | Subscription records | Yes |
| `badges` | Gamification badges | Yes |

### Key RPCs

```sql
-- Category hierarchy (recursive CTE)
get_category_hierarchy(p_parent_id, p_max_depth)

-- Product search with filters
search_products(p_query, p_category, p_min_price, p_max_price, ...)

-- Seller stats aggregation (materialized view)
refresh_seller_stats()
```

---

## ⚡ Performance Considerations

### Query Patterns

**Good**:
- Field projection in data layer
- Cached queries with proper tags
- Pagination with limits

**Needs Review**:
- Some route handlers may over-fetch
- Deep nested joins in category queries
- `select('*')` in some admin contexts

### Index Usage

**Status**: Need to verify with performance advisors

**Key indexes to verify**:
- `products(seller_id, status)` - Seller dashboard
- `products(category_id, created_at)` - Category pages
- `order_items(seller_id, status)` - Seller orders
- `reviews(product_id, created_at)` - Product reviews

---

## 🎯 Improvement Areas

### High Priority

1. **Run Supabase Security Advisors** - Check for RLS gaps
2. **Run Supabase Performance Advisors** - Check for missing indexes
3. **Enable Leaked Password Protection** - Dashboard setting

### Medium Priority

4. **Field projection in route handlers** - Review `/api/products/*`
5. **Standardize error responses** - Use `errorResponse()` consistently
6. **Add rate limiting** - Consider for search/auth endpoints
7. **Add request logging** - Structured logging for debugging

### Low Priority

8. **Remove deprecated RPCs** - Clean up unused database functions
9. **Add API documentation** - OpenAPI/Swagger specs
10. **Add request tracing** - Correlation IDs for debugging

---

## 📋 Backend Metrics

| Metric | Value |
|--------|-------|
| Server Actions | 13 files |
| Route Handlers | ~20 endpoints |
| Cached Data Fetchers | 14 functions |
| Zod Schemas | ~10 |
| RLS Policies | TBD (need advisor) |
| Database Tables | ~25 |
| Database RPCs | ~5 |

---

## 🔗 Related Documents

- [frontend.md](./frontend.md) - Frontend patterns audit
- [issues.md](./issues.md) - All identified issues
- [tasks.md](./tasks.md) - Phased execution plan
- [guide.md](./guide.md) - Execution guide
- `docs/ENGINEERING.md` - Engineering rules
- `supabase_tasks.md` - Supabase-specific tasks
