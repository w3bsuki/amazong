# Routes & Navigation Audit

**Date:** January 28, 2026  
**Application:** Treido Marketplace  
**Base URL:** http://localhost:3000

---

## Route Structure Overview

```
/[locale]/                           # Locale wrapper (en, bg)
├── (main)/                          # Public pages group
│   ├── page.tsx                     # Homepage
│   ├── categories/                  # Category pages
│   ├── search/                      # Search results
│   ├── [store]/[slug]/              # Product detail
│   └── ...
├── (cart)/                          # Cart group
│   └── cart/                        # Cart page
├── (checkout)/                      # Checkout group
│   └── checkout/                    # Checkout flow
├── (auth)/                          # Authentication group
│   └── auth/
│       ├── login/
│       ├── sign-up/
│       └── forgot-password/
├── (account)/                       # Account dashboard group
│   └── account/
│       ├── page.tsx                 # Overview
│       ├── orders/
│       ├── wishlist/
│       ├── profile/
│       └── ...
├── (sell)/                          # Seller group
│   └── sell/
├── (chat)/                          # Messaging group
│   └── chat/
├── (legal)/                         # Legal pages group
│   ├── terms/
│   ├── privacy/
│   └── cookies/
└── (support)/                       # Support pages group
    ├── about/
    ├── contact/
    └── ...
```

---

## Complete Route Inventory

### Public Routes (Unauthenticated)

| Route | Title | Status | Load Time |
|-------|-------|--------|-----------|
| `/en` | Home \| Treido | ✅ Pass | ~2s |
| `/en/categories` | Categories \| Treido | ✅ Pass | ~1s |
| `/en/categories/fashion` | Fashion \| Treido | ✅ Pass | ~1s |
| `/en/categories/electronics` | Electronics \| Treido | ✅ Pass | ~1s |
| `/en/search` | Search Results \| Treido | ✅ Pass | ~2s |
| `/en/search?q=phone` | "phone" - Search Results | ✅ Pass | ~2s |
| `/en/about` | About Us \| Treido | ✅ Pass | ~2s |
| `/en/terms` | Terms of Service \| Treido | ✅ Pass | ~1s |
| `/en/privacy` | Privacy Policy \| Treido | ✅ Pass | ~1s |
| `/en/cookies` | Cookie Policy \| Treido | ✅ Pass | ~1s |
| `/en/contact` | Contact \| Treido | ✅ Pass | ~1s |
| `/en/returns` | Returns \| Treido | ✅ Pass | ~1s |
| `/en/faq` | FAQ \| Treido | ✅ Pass | ~1s |
| `/en/customer-service` | Help \| Treido | ✅ Pass | ~1s |
| `/en/security` | Security \| Treido | ✅ Pass | ~1s |
| `/en/careers` | Careers \| Treido | ✅ Pass | ~1s |
| `/en/blog` | Blog \| Treido | ✅ Pass | ~1s |
| `/en/investors` | Investors \| Treido | ✅ Pass | ~1s |
| `/en/plans` | Membership \| Treido | ✅ Pass | ~1s |
| `/en/todays-deals` | Today's Deals \| Treido | ✅ Pass | ~1s |
| `/en/free-shipping` | Shipping Info \| Treido | ✅ Pass | ~1s |

### Authentication Routes

| Route | Title | Status | Notes |
|-------|-------|--------|-------|
| `/en/auth/login` | Sign in \| Treido | ✅ Pass | Full form |
| `/en/auth/sign-up` | Create Account \| Treido | ✅ Pass | Full form |
| `/en/auth/forgot-password` | Reset Password \| Treido | ✅ Pass | Email form |
| `/en/auth/reset-password` | New Password \| Treido | ✅ Pass | Token required |

### Product Routes (Dynamic)

| Route Pattern | Example | Status | Notes |
|---------------|---------|--------|-------|
| `/en/[store]` | `/en/tech_haven` | ✅ Pass | Store page |
| `/en/[store]/[slug]` | `/en/tech_haven/sk-ii-facial-treatment-essence` | ✅ Pass | PDP |

### Cart & Checkout Routes

| Route | Title | Status | Auth Required |
|-------|-------|--------|---------------|
| `/en/cart` | Cart \| Treido | ✅ Pass | No |
| `/en/checkout` | Checkout \| Treido | ✅ Pass | Yes |
| `/en/checkout/success` | Order Complete | ✅ Pass | Yes |

### Account Routes (Authenticated)

| Route | Title | Status | Notes |
|-------|-------|--------|-------|
| `/en/account` | Account Overview | ✅ Pass | Dashboard |
| `/en/account/orders` | Orders | ✅ Pass | Order history |
| `/en/account/wishlist` | Wishlist | ✅ Pass | Saved items |
| `/en/account/following` | Following | ✅ Pass | Followed sellers |
| `/en/account/profile` | Profile | ✅ Pass | User settings |
| `/en/account/security` | Security | ✅ Pass | Password, 2FA |
| `/en/account/addresses` | Addresses | ✅ Pass | Address book |
| `/en/account/payments` | Payments | ✅ Pass | Payment methods |
| `/en/account/billing` | Billing | ✅ Pass | Invoices |
| `/en/account/notifications` | Notifications | ✅ Pass | Preferences |
| `/en/account/selling` | Selling | ✅ Pass | Active listings |
| `/en/account/sales` | Sales | ✅ Pass | Sale history |

### Seller Routes

| Route | Title | Status | Notes |
|-------|-------|--------|-------|
| `/en/sell` | Create Listing | ⚠️ Issue | API error |
| `/en/sell/orders` | Seller Orders | ✅ Pass | Manage orders |

### Messaging Routes

| Route | Title | Status | Notes |
|-------|-------|--------|-------|
| `/en/chat` | Messages \| Treido | ⚠️ Issue | 503 error |
| `/en/chat/[id]` | Conversation | ⚠️ Issue | Depends on list |

### Business Routes

| Route | Title | Status | Notes |
|-------|-------|--------|-------|
| `/en/affiliates` | Affiliates | ✅ Pass | Partner info |
| `/en/advertise` | Advertise | ✅ Pass | Ad info |
| `/en/suppliers` | Suppliers | ✅ Pass | B2B info |
| `/en/store-locator` | Store Locator | ✅ Pass | Find stores |

---

## Navigation Patterns

### Primary Navigation (Header)

| Element | Target | Method |
|---------|--------|--------|
| Logo | `/[locale]` | `<Link>` |
| Account | `/[locale]/account` | `<Link>` |
| Wishlist | `/[locale]/account/wishlist` | `<Link>` |
| Messages | `/[locale]/chat` | `<Link>` |
| Notifications | `/[locale]/account/notifications` | `<Link>` |
| Create listing | `/[locale]/sell` | `<Link>` |
| Cart | `/[locale]/cart` | `<Link>` |

### Category Navigation (Sidebar)

| Element | Target | Method |
|---------|--------|--------|
| All Categories | Toggle submenu | `<button>` |
| Category item | `/[locale]/categories/[slug]` | `<button>` → `<Link>` |

### Footer Navigation

| Section | Links |
|---------|-------|
| Company | About, Careers, Blog, Investors |
| Help | Help Center, Returns, Track Orders, Contact, Security, Feedback |
| Sell & Business | Sell, Store Locator, Affiliates, Advertise, Suppliers |
| Services | Membership, Gift Cards, Registry, Shipping Info, Accessibility |
| Legal | Terms, Privacy, Cookies, ODR |

---

## Breadcrumb Navigation

### Implementation Pattern

```
Treido > [Parent] > [Current Page]
```

### Examples Audited

| Page | Breadcrumb |
|------|------------|
| Cart | Treido > Cart |
| Terms | Treido > Terms |
| About | Treido > About |
| Search | Treido > Search Results |
| PDP | (No breadcrumb - uses back navigation) |

---

## Skip Links (Accessibility)

| Skip Link | Target ID | Status |
|-----------|-----------|--------|
| Skip to main content | `#main-content` | ✅ Working |
| Skip to sidebar | `#shell-sidebar` | ✅ Working |
| Skip to products | `#product-grid` | ✅ Working |
| Skip to footer | `#footerHeader` | ✅ Working |

---

## Locale Handling

### Supported Locales

| Locale | Path | Status |
|--------|------|--------|
| English | `/en/*` | ✅ Primary |
| Bulgarian | `/bg/*` | ✅ Secondary |

### Locale Switching

- Automatic redirect based on browser preference
- Manual switch via locale selector (if available)
- All routes maintain locale prefix

---

## Authentication Flow Redirects

| Scenario | From | To |
|----------|------|-----|
| Unauthenticated checkout | `/checkout` | `/auth/login?redirect=/checkout` |
| Unauthenticated sell | `/sell` | `/auth/login?redirect=/sell` |
| Post-login | `/auth/login` | `redirect` param or `/` |
| Post-signup | `/auth/sign-up` | `/account` or `redirect` |
| Logout | Any | `/` |

---

## 404 Handling

| Scenario | Behavior |
|----------|----------|
| Invalid route | Shows 404 page |
| Invalid product | Shows 404 or product not found |
| Invalid store | Shows 404 or store not found |
| Invalid locale | Redirects to default locale |

---

## Deep Linking Support

| Route Type | Deep Link Support | Notes |
|------------|-------------------|-------|
| Product | ✅ Yes | `/[store]/[slug]` |
| Category | ✅ Yes | `/categories/[slug]` |
| Search | ✅ Yes | `/search?q=...` |
| Order | ✅ Yes | `/account/orders/[id]` |
| Chat | ✅ Yes | `/chat/[id]` |

---

## Route Performance

### Server-Side Rendering

| Route | Rendering | Cache |
|-------|-----------|-------|
| Homepage | SSR | Cached |
| Categories | SSR | Cached |
| Product | SSR | Cached per product |
| Search | SSR | Dynamic |
| Account | SSR | User-specific |
| Cart | CSR | User-specific |

### Loading States

- ✅ Skeleton loaders on homepage
- ✅ Loading spinner on cart
- ✅ Progressive loading on product grid
- ⚠️ Missing loading state on some account pages

---

## Recommendations

1. **Add loading states** to all route transitions
2. **Implement prefetching** for likely navigation targets
3. **Add error pages** for API failures
4. **Improve breadcrumbs** - add to PDP and category pages
5. **Add route transition animations** for smoother UX
6. **Implement shallow routing** for filters and tabs
