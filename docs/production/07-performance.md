# Phase 7: Performance Optimization ⬜ AUDIT NEEDED

> **Priority:** 🔴 Critical  
> **Status:** Config ready, needs Lighthouse verification  
> **Estimated Time:** 2-3 hours  
> **Goal:** Achieve excellent Core Web Vitals, fast load times, and production-ready performance  
> **Tech Stack:** Next.js 16, React 19, Tailwind v4, Supabase, next-intl 4.x

---

## ✅ Current Configuration Status

Your project has excellent performance foundations:
- ✅ `cacheComponents: true` with custom `cacheLife` profiles
- ✅ Image optimization with AVIF/WebP, 30-day cache TTL
- ✅ Turbopack filesystem caching for dev
- ✅ `optimizePackageImports` for heavy dependencies
- ✅ Bundle analyzer configured
- ✅ Compression enabled, `poweredByHeader: false`

---

## 📋 Pre-Audit Checklist

```bash
# 1. Production build
pnpm build

# 2. Run Lighthouse
pnpm test:lighthouse

# 3. Bundle analysis
ANALYZE=true pnpm build
```

---

## 🎯 Core Web Vitals Targets

| Metric | Target | What It Measures |
|--------|--------|------------------|
| **LCP** | ≤2.5s | Largest Contentful Paint - main content visibility |
| **INP** | ≤200ms | Interaction to Next Paint - responsiveness |
| **CLS** | ≤0.1 | Cumulative Layout Shift - visual stability |

### Pages to Test

- [ ] Home (`/en`)
- [ ] Product page (`/en/{seller}/{slug}`)
- [ ] Search results (`/en/search`)
- [ ] Category page (`/en/category/{slug}`)
- [ ] Cart (`/en/cart`)

---

## 1. Server Components & Bundle Size

### Best Practice: Default to Server Components

```tsx
// ✅ GOOD: Server Component (default)
export default async function ProductPage({ params }) {
  const product = await getProduct((await params).slug);
  return (
    <div>
      <ProductInfo product={product} /> {/* Server */}
      <AddToCartButton productId={product.id} /> {/* Client - only this */}
    </div>
  );
}

// ❌ BAD: Entire page as client
"use client"
export default function ProductPage({ product }) {
  // Everything ships to client
}
```

### Audit Checklist

- [ ] All components default to Server Components unless they need state/effects
- [ ] `"use client"` pushed to smallest possible component
- [ ] Heavy libraries lazy loaded or kept server-side
- [ ] Check for unnecessary client boundaries

### Files to Audit

```bash
# Find all client components
grep -r '"use client"' --include="*.tsx" components/ app/
```

- [ ] `components/product/*` - Verify minimal client components
- [ ] `components/mobile/*` - Check for over-clientization
- [ ] `components/desktop/*` - Same as above

---

## 2. Cache Components (Next.js 16)

### Your Cache Profiles (from next.config.ts)

| Profile | Stale | Revalidate | Expire | Use Case |
|---------|-------|------------|--------|----------|
| `categories` | 5 min | 1 hour | 1 day | Category listings |
| `products` | 1 min | 5 min | 1 hour | Product pages |
| `deals` | 30 sec | 2 min | 10 min | Time-sensitive promotions |
| `user` | 30 sec | 1 min | 5 min | Personalization |

### Implementation Pattern

```tsx
import { cacheLife, cacheTag } from 'next/cache';

export async function getProduct(slug: string) {
  'use cache';
  cacheLife('products');
  cacheTag(`product-${slug}`);
  
  return await db.products.findBySlug(slug);
}

// Invalidation in Server Actions
export async function updateProduct(id: string) {
  'use server';
  await db.products.update(id);
  updateTag(`product-${id}`);
}
```

### Audit Checklist

- [ ] Data fetching functions use `'use cache'` with appropriate profiles
- [ ] `cacheTag()` applied for granular invalidation
- [ ] Static pages use `generateStaticParams()` for pre-rendering
- [ ] Dynamic data wrapped in `<Suspense>` for streaming

---

## 3. Image Optimization

### Your Current Config ✅

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 2592000, // 30 days
}
```

### Best Practices

```tsx
// ✅ Static import (automatic width/height/blur)
import heroImage from './hero.png';
<Image src={heroImage} alt="Hero" placeholder="blur" />

// ✅ Above-fold images: priority or preload
<Image src="/product.jpg" priority alt="Product" width={600} height={400} />

// ✅ Responsive images with sizes
<Image
  src="/hero.jpg"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  alt="Hero"
/>

// ❌ Never use raw <img> tags
```

### Audit Checklist

```bash
# Find raw img tags
grep -r "<img" --include="*.tsx" app/ components/
```

- [ ] All images use `<Image>` from `next/image`
- [ ] Hero/LCP images have `priority` prop
- [ ] Responsive images use proper `sizes` attribute
- [ ] No oversized images (check product images especially)
- [ ] External images listed in `remotePatterns`

---

## 4. Font Optimization

### Best Practice: next/font

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Prevent FOIT
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Audit Checklist

- [ ] Using `next/font` for all fonts
- [ ] `display: 'swap'` or `'optional'` to prevent FOIT
- [ ] Font subsets specified (e.g., `['latin']`)
- [ ] No external font loading (`@font-face` in CSS)
- [ ] Check CLS from font loading

---

## 5. Bundle Optimization

### Already Configured ✅

```typescript
experimental: {
  optimizePackageImports: ['@phosphor-icons/react', 'date-fns', 'recharts'],
}
```

### Additional Libraries to Consider

```typescript
// next.config.ts
optimizePackageImports: [
  '@phosphor-icons/react',
  'date-fns',
  'recharts',
  'lucide-react',
  '@radix-ui/react-*', // All Radix UI components
  'framer-motion',
]
```

### Bundle Analysis Commands

```bash
# Generate bundle analysis
ANALYZE=true pnpm build

# Check output
# .next/analyze/client.html - Client bundle
# .next/analyze/nodejs.html - Server bundle
```

### Red Flags to Check

- [ ] First Load JS > 100KB per route
- [ ] Duplicate dependencies
- [ ] Large libraries in client bundle (should be server-side)
- [ ] Unshaken tree imports

### Common Offenders in This Project

| Library | Size | Solution |
|---------|------|----------|
| `recharts` | ~300KB | Lazy load, keep server-side |
| `framer-motion` | ~100KB | Lazy load animations |
| `photoswipe` | ~40KB | Dynamic import |
| `@phosphor-icons/react` | Variable | Tree shaking via optimizePackageImports |

---

## 6. next-intl Static Rendering

### Critical Pattern: `setRequestLocale`

```tsx
// app/[locale]/page.tsx
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }) {
  const { locale } = await params;
  
  // CRITICAL: Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('HomePage');
  return <h1>{t('title')}</h1>;
}
```

### Audit Checklist

- [ ] All pages/layouts call `setRequestLocale()`
- [ ] `generateStaticParams()` exports locale list
- [ ] `NextIntlClientProvider` receives explicit `locale`, `timeZone`, `now`
- [ ] Only necessary messages passed to client

---

## 7. Supabase Query Performance

### From Phase 2 Advisors

| Issue | Priority | Fix |
|-------|----------|-----|
| Missing index on `cart_items.product_id` | High | Add covering index |
| RLS policies without `(select auth.uid())` | Medium | Wrap in select for single evaluation |
| Duplicate index on `wishlists` | Low | Drop redundant index |

### Best Practice: Query Patterns

```typescript
// ✅ Efficient: Select only needed columns
const products = await supabase
  .from('products')
  .select('id, name, price, image_url')
  .limit(20);

// ❌ Inefficient: Select all columns
const products = await supabase.from('products').select('*');
```

---

## 8. Lazy Loading & Code Splitting

### Dynamic Imports for Heavy Components

```tsx
import dynamic from 'next/dynamic';

// Lazy load chart component
const RevenueChart = dynamic(() => import('@/components/charts/RevenueChart'), {
  loading: () => <Skeleton className="h-[300px]" />,
  ssr: false, // Client-only for charts
});

// Lazy load gallery
const PhotoSwipeGallery = dynamic(
  () => import('@/components/product/PhotoSwipeGallery'),
  { ssr: false }
);
```

### Audit Checklist

- [ ] Charts dynamically imported with `ssr: false`
- [ ] Heavy UI components lazy loaded
- [ ] Below-fold content deferred
- [ ] Modals/drawers dynamically imported

---

## 9. Mobile Performance

### Test on Throttled Network

```bash
# Chrome DevTools: Network → Slow 3G
# Or Lighthouse: Performance → Mobile
```

### Checklist

- [ ] Test on throttled 3G network
- [ ] Touch targets ≥44x44px (WCAG)
- [ ] No horizontal scroll
- [ ] Skeleton loaders for async content
- [ ] Reduce initial payload for mobile

---

## 10. SEO Performance

### Technical SEO Checklist

- [ ] `sitemap.ts` generates valid sitemap
- [ ] `robots.txt` configured correctly
- [ ] Canonical URLs via `generateMetadata()`
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] No duplicate content across locales

### Metadata Best Practices

```tsx
// app/[locale]/product/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.image_url }],
    },
  };
}
```

### Structured Data

- [ ] Product schema on product pages
- [ ] BreadcrumbList schema
- [ ] Organization schema on home
- [ ] Review/Rating schema (when reviews exist)

---

## 11. Monitoring & Reporting

### Web Vitals Reporting

```tsx
// components/WebVitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    console.log(metric);
  });
  return null;
}

// app/[locale]/layout.tsx
import { WebVitals } from '@/components/WebVitals';

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  );
}
```

---

## 📊 Performance Metrics Tracker

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Lighthouse Performance | >80 | ? | ⬜ |
| Lighthouse Accessibility | >90 | ? | ⬜ |
| Lighthouse SEO | >90 | ? | ⬜ |
| First Load JS (Home) | <100KB | ? | ⬜ |
| LCP | <2.5s | ? | ⬜ |
| INP | <200ms | ? | ⬜ |
| CLS | <0.1 | ? | ⬜ |

---

## ✅ Phase 7 Completion Checklist

### Core Web Vitals
- [ ] LCP < 2.5s on all key pages
- [ ] INP < 200ms
- [ ] CLS < 0.1

### Bundle & Loading
- [ ] First Load JS < 100KB per route
- [ ] Heavy components lazy loaded
- [ ] Bundle analysis reviewed

### Images & Fonts
- [ ] All images use `next/image`
- [ ] Hero images have `priority`
- [ ] Fonts use `next/font`

### Caching
- [ ] Cache profiles applied correctly
- [ ] Static pages pre-rendered
- [ ] Supabase queries optimized

### i18n
- [ ] `setRequestLocale()` in all pages/layouts
- [ ] Static params generated for locales

### SEO
- [ ] Metadata on all pages
- [ ] Structured data valid
- [ ] Sitemap/robots.txt working

---

## 🏁 Commands Reference

```bash
# Build for production
pnpm build

# Run Lighthouse CI
pnpm test:lighthouse

# Analyze bundle
ANALYZE=true pnpm build

# Run production server
pnpm start

# Check TypeScript
pnpm typecheck
```

---

## 🔗 Next Step

→ Proceed to [Phase 8: Security](./08-security.md)
