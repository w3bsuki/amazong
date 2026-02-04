# app-router.md — Next.js 16 App Router

> Layouts, pages, route groups, parallel routes for Treido.

## Treido Route Groups

| Group | Path | Purpose |
|-------|------|---------|
| `(main)` | `/[locale]/(main)/` | Public buyer routes (home, search, cart, categories) |
| `(account)` | `/[locale]/(account)/` | Authenticated user dashboard, settings |
| `(auth)` | `/[locale]/(auth)/` | Login, signup, password reset |
| `(checkout)` | `/[locale]/(checkout)/` | Checkout flow |
| `(sell)` | `/[locale]/(sell)/` | Seller listing creation |
| `(business)` | `/[locale]/(business)/` | Business/seller dashboard |
| `(admin)` | `/[locale]/(admin)/` | Admin panel |
| `(plans)` | `/[locale]/(plans)/` | Pricing page |
| `(chat)` | `/[locale]/(chat)/` | Messaging |

**Private folders** (not routable): `_components/`, `_lib/`, `_providers/`

## Treido Route Structure

```
app/
├── [locale]/                    # Locale prefix (en, bg)
│   ├── (main)/                  # Route group: main buyer routes
│   │   ├── page.tsx             # Home (/)
│   │   ├── search/              # Search results
│   │   ├── cart/                # Shopping cart
│   │   └── categories/          # Category pages
│   ├── (account)/               # Route group: user dashboard
│   │   ├── dashboard/
│   │   ├── orders/
│   │   └── settings/
│   ├── (auth)/                  # Route group: auth flows
│   │   ├── login/
│   │   ├── signup/
│   │   └── reset-password/
│   ├── (business)/              # Route group: seller dashboard
│   │   ├── dashboard/
│   │   ├── products/
│   │   └── orders/
│   └── [username]/              # Public profile + product detail
│       ├── page.tsx             # Profile page
│       └── [product-slug]/      # Product detail
├── api/
│   ├── webhooks/stripe/route.ts # Stripe webhooks
│   └── revalidate/route.ts      # On-demand ISR
└── auth/
    └── callback/route.ts        # OAuth callback (no locale)
```

## Route Parameters

### Single param
```tsx
// app/[locale]/products/[id]/page.tsx
type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ProductPage({ params }: Props) {
  const { locale, id } = await params;  // Next.js 16: params is Promise
  // ...
}
```

### Catch-all
```tsx
// app/[locale]/[...slug]/page.tsx
type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
};

// Matches: /en/a, /en/a/b, /en/a/b/c
export default async function Page({ params }: Props) {
  const { slug } = await params;
  // slug = ['a', 'b', 'c']
}
```

### Optional catch-all
```tsx
// app/[locale]/[[...slug]]/page.tsx

// Matches: /en, /en/a, /en/a/b
export default async function Page({ params }: Props) {
  const { slug } = await params;
  // slug = undefined | string[]
}
```

## Search Params

```tsx
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { category, sort, page } = await searchParams;
  
  // URLSearchParams example: ?category=electronics&sort=price
}
```

### Client-side search params
```tsx
'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }
}
```

## Navigation

### Link component
```tsx
import Link from 'next/link';

<Link href="/products">Products</Link>

// With params
<Link href={`/products/${product.id}`}>View</Link>

// With search params
<Link href={{ pathname: '/products', query: { category: 'electronics' } }}>
  Electronics
</Link>

// Prefetch control
<Link href="/products" prefetch={false}>No prefetch</Link>
```

### Programmatic navigation
```tsx
'use client';
import { useRouter } from 'next/navigation';

export function NavigateButton() {
  const router = useRouter();
  
  return (
    <button onClick={() => router.push('/products')}>
      Go to Products
    </button>
  );
}

// Available methods
router.push('/path');      // Navigate (adds to history)
router.replace('/path');   // Replace (no history entry)
router.back();             // Go back
router.forward();          // Go forward
router.refresh();          // Refresh Server Components
router.prefetch('/path');  // Prefetch route
```

## Route Groups

Route groups organize routes without affecting URL:

```
app/
├── (shop)/           # Group: shop routes
│   ├── layout.tsx    # Shop layout
│   ├── products/
│   └── cart/
├── (auth)/           # Group: auth routes  
│   ├── layout.tsx    # Auth layout (different from shop)
│   ├── login/
│   └── signup/
└── (seller)/         # Group: seller dashboard
    ├── layout.tsx    # Seller layout
    └── dashboard/
```

## Parallel Routes

Render multiple pages simultaneously:

```
app/
├── @modal/           # Parallel route slot
│   ├── default.tsx   # Default (when modal not active)
│   └── login/page.tsx
├── @sidebar/
│   └── page.tsx
├── layout.tsx        # Receives both slots as props
└── page.tsx
```

```tsx
// layout.tsx
export default function Layout({
  children,
  modal,
  sidebar,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    <>
      {sidebar}
      {children}
      {modal}
    </>
  );
}
```

## Intercepting Routes

Intercept routes for modals:

```
app/
├── products/
│   ├── [id]/page.tsx           # Full product page
│   └── (.)[id]/page.tsx        # Intercepted (modal view)
```

Convention:
- `(.)` — Same level
- `(..)` — One level up
- `(..)(..)` — Two levels up
- `(...)` — Root

## Loading & Error

### Loading UI
```tsx
// loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return <ProductPageSkeleton />;
}
```

### Error Boundary
```tsx
// error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Not Found
```tsx
// not-found.tsx
export default function NotFound() {
  return <div>Page not found</div>;
}

// Trigger from Server Component
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);
  if (!product) notFound();
}
```

## Middleware (proxy.ts)

⚠️ **Treido uses `proxy.ts` instead of `middleware.ts`** — no root `middleware.ts` allowed.

```tsx
// proxy.ts — NOT middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
  locales: ['en', 'bg'],
  defaultLocale: 'bg',
});

export function middleware(request: NextRequest) {
  // 1. i18n routing via next-intl
  const response = intlMiddleware(request);
  
  // 2. Set x-pathname for layout conditional rendering
  response.headers.set('x-pathname', request.nextUrl.pathname);
  
  // 3. Geo-detection for shipping zones
  const country = request.headers.get('x-vercel-ip-country') 
    || request.headers.get('cf-ipcountry');
  response.cookies.set('user-country', country || 'BG');
  
  // 4. Session refresh (Supabase)
  return updateSession(request, response);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
```

**Why proxy.ts?** Next.js runs `middleware.ts` automatically. Using `proxy.ts` gives explicit control over when/how middleware runs.

## Static Generation

### generateStaticParams
```tsx
// app/[locale]/products/[id]/page.tsx
export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: { id: true },
  });
  
  return products.map((product) => ({
    id: product.id,
  }));
}
```

### generateMetadata
```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      images: [product.image],
    },
  };
}
```
