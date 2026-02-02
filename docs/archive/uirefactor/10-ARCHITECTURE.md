# Technical Architecture

**Status:** Reference Document  
**Stack:** Next.js 16 + Shadcn/ui + Tailwind v4 + Supabase + Stripe

---

## 🏗️ Stack Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT                                │
│  Next.js 16 (App Router) + React 19 + TypeScript            │
│  Shadcn/ui + Tailwind v4 + Framer Motion                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                            │
│  - Server Components (default)                               │
│  - Server Actions (form submissions, mutations)              │
│  - Route Handlers (API endpoints)                            │
│  - Proxy (proxy.ts) for i18n + geo + session                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE                                │
│  - PostgreSQL (data)                                         │
│  - Auth (authentication)                                     │
│  - Storage (images)                                          │
│  - Realtime (chat, notifications)                           │
│  - Edge Functions (webhooks)                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     EXTERNAL                                 │
│  - Stripe (payments, Connect)                               │
│  - Cloudflare (CDN, images)                                 │
│  - AI Provider (search, suggestions)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
amazong/
├── app/                      # Next.js App Router
│   ├── [locale]/            # Locale-scoped routes
│   │   ├── (main)/          # Main layout group
│   │   │   ├── _components/ # Route-private components
│   │   │   ├── _providers/  # Route-private providers
│   │   │   ├── page.tsx     # Landing page
│   │   │   └── ...
│   │   ├── (auth)/          # Auth layout group
│   │   ├── sell/            # Listing creation
│   │   ├── [username]/      # Seller profiles
│   │   │   └── [productSlug]/ # Product pages
│   │   ├── chat/            # Messaging
│   │   ├── orders/          # Order history
│   ├── (business)/
│   │   └── dashboard/       # Business dashboard (premium)
│   ├── actions/             # Server Actions
│   ├── api/                 # Route Handlers
│   └── auth/                # Auth callbacks
├── components/
│   ├── ui/                  # Shadcn primitives (DO NOT EDIT)
│   ├── shared/              # Shared composites
│   ├── mobile/              # Mobile-specific
│   ├── desktop/             # Desktop-specific
│   ├── navigation/          # Nav components
│   ├── seller/              # Seller-related
│   └── providers/           # Context providers
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities
│   ├── supabase/           # Supabase clients
│   └── stripe/             # Stripe utilities
├── i18n/                    # Internationalization
├── messages/                # Translation files
├── supabase/               # Supabase config
│   └── migrations/         # Database migrations
├── proxy.ts                # Next.js 16 proxy (i18n + geo + session)
└── uirefactor/             # UI/UX planning docs
```

---

## 🔀 Routing & Request Flow

### proxy.ts (Entry Point)

```
Request
    │
    ▼
proxy.ts
    ├── 1. i18n locale detection (next-intl)
    ├── 2. Set x-pathname header
    ├── 3. Geo-detection (user-country, user-zone cookies)
    └── 4. Supabase session refresh (updateSession)
    │
    ▼
App Router
```

**Important:** We use `proxy.ts`, NOT `middleware.ts`. This is Next.js 16 convention.

### Route Groups

| Group | Purpose | Layout |
|-------|---------|--------|
| `(main)` | Primary app routes | Full nav, footer |
| `(auth)` | Login/signup | Minimal chrome |
| `(onboarding)` | Post-signup flow | Full-screen, no nav |

---

## 🗄️ Database Schema (Key Tables)

### Core Tables

```sql
profiles
├── id (uuid, PK)
├── username (unique)
├── display_name
├── avatar_url
├── account_type ('personal' | 'business')
├── location_city
├── created_at
└── onboarding_completed (boolean)

private_profiles (separate, secure)
├── id (uuid, FK to profiles)
├── vat_number
├── business_website
├── facebook_url
├── instagram_handle
└── physical_address

products
├── id (uuid, PK)
├── seller_id (FK to profiles)
├── title
├── description
├── price
├── currency
├── category_id
├── condition
├── status ('active' | 'sold' | 'paused')
└── created_at

orders
├── id (uuid, PK)
├── buyer_id (FK to profiles)
├── seller_id (FK to profiles)
├── product_id (FK to products)
├── status
├── stripe_payment_intent_id
└── created_at

messages
├── id (uuid, PK)
├── conversation_id
├── sender_id (FK to profiles)
├── content
└── created_at
```

### Security Model

- `profiles`: Public read, restricted write (specific fields only)
- `private_profiles`: Owner read/write only
- `products`: Public read, owner write
- `orders`: Buyer/seller read only
- `messages`: Conversation participants only

---

## 🔐 Authentication Flow

```
1. User signs up (email/password or OAuth)
         │
         ▼
2. Supabase creates auth.users record
         │
         ▼
3. DB trigger creates profiles record
   (account_type defaults to 'personal')
         │
         ▼
4. Redirect to /auth/confirm (email) or home (OAuth)
         │
         ▼
5. proxy.ts refreshes session
         │
         ▼
6. OnboardingProvider checks onboarding_completed
         │
         ▼
7. If false → Show onboarding modal/flow
```

### Session Management Location

| File | Purpose |
|------|---------|
| `proxy.ts` | Entry point, calls updateSession |
| `lib/supabase/middleware.ts` | updateSession implementation |
| `lib/supabase/server.ts` | Server-side Supabase client |
| `lib/supabase/client.ts` | Client-side Supabase client |

---

## 🎨 UI Architecture

### Component Hierarchy

```
primitives (components/ui/*)
    └── DO NOT EDIT - shadcn generated
    └── Drawer, Button, Input, etc.

composites (components/shared/*)
    └── Combine primitives
    └── ProductCard, SearchInput, etc.

route-private (app/[locale]/(group)/_components/*)
    └── Page-specific components
    └── Not shared across routes
```

### Drawer System

Using **Vaul** (via shadcn):
- `components/ui/drawer.tsx` - Base primitive
- `components/mobile/category-nav/category-drawer-context.tsx` - Category state

**DO NOT create new drawer primitives.** Use existing system.

### Animation

- Framer Motion for complex animations
- CSS transitions for simple hover/focus
- **No new decorative animations** (repo rule)

---

## 💳 Payment Architecture

### Stripe Flow

```
Buyer clicks "Buy"
        │
        ▼
Server Action creates Stripe Checkout Session
        │
        ▼
Redirect to Stripe Checkout
        │
        ▼
Stripe webhook → /api/webhooks/stripe
        │
        ├── checkout.session.completed → Create order
        └── payment_intent.succeeded → Update order status
```

### Stripe Connect (Seller Payouts)

```
Seller onboards to Stripe Connect
        │
        ▼
stripe_account_id saved to private_profiles
        │
        ▼
On sale: Platform takes fee, transfers to seller
```

---

## 🌐 i18n Architecture

### Routing

```
/bg/...  → Bulgarian locale
/en/...  → English locale
```

### Translation Files

```
messages/
├── bg.json
├── en.json
└── shared.json
```

### Usage

```tsx
import { useTranslations } from 'next-intl';

const t = useTranslations('ProductPage');
return <h1>{t('title')}</h1>;
```

---

## 📊 Data Fetching Patterns

### Server Components (Default)

```tsx
// app/[locale]/[username]/[productSlug]/page.tsx
export default async function ProductPage({ params }) {
  const product = await getProduct(params.username, params.productSlug);
  return <ProductView product={product} />;
}
```

### Client Components (When Needed)

```tsx
'use client';

export function InteractiveWidget() {
  const [state, setState] = useState();
  // Client-side logic
}
```

### Server Actions (Mutations)

```tsx
// app/actions/products.ts
'use server';

export async function createProduct(formData: FormData) {
  // Validate, insert, return
}
```

---

## 🧪 Testing

| Type | Tool | Location |
|------|------|----------|
| Unit | Vitest | `__tests__/` |
| E2E | Playwright | `e2e/` |
| Types | TypeScript | `pnpm tsc --noEmit` |
| Lint | ESLint | `pnpm lint` |

### Running Tests

```bash
pnpm test:unit      # Vitest unit tests
pnpm test:e2e       # Playwright E2E
pnpm lint           # ESLint
pnpm typecheck      # TypeScript check
```

---

## 🚀 Deployment

- **Platform:** Vercel
- **Database:** Supabase (hosted)
- **CDN:** Cloudflare
- **Domain:** treido.com

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```
