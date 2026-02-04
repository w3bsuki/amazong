# performance.md — Next.js Performance Optimization

> Bundle, rendering, and runtime performance for Treido.

## Bundle Optimization

### Analyze bundle
```bash
# Build with bundle analyzer
ANALYZE=true pnpm build
```

### Code splitting

```tsx
// Automatic: Each page is a separate chunk
// Manual: Dynamic imports
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('@/components/charts/heavy-chart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,  // Skip SSR for client-only components
  }
);
```

### Tree-shaking friendly imports

```tsx
// ❌ BAD: Imports entire library
import { Button, Card, Dialog } from '@/components/ui';

// ✅ GOOD: Individual imports
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
```

### Barrel file optimization

```tsx
// components/ui/index.ts
// Use 'use client' directive sparingly
// Re-exports can break tree-shaking

// ✅ Prefer direct imports over barrel files for performance
```

## Image Optimization

### Next.js Image

```tsx
import Image from 'next/image';

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  
  // Performance props
  priority={isAboveFold}      // LCP images
  loading="lazy"              // Below fold
  placeholder="blur"          // Blur placeholder
  blurDataURL={blurHash}      // Base64 blur
  
  // Sizing
  sizes="(max-width: 768px) 100vw, 50vw"
  
  // Quality
  quality={85}                // 75-85 recommended
/>
```

### Responsive images

```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  fill                        // Fill parent container
  sizes="100vw"
  className="object-cover"
  priority
/>
```

### Image formats

Next.js automatically serves:
- WebP for supported browsers
- AVIF when configured
- Original format as fallback

```tsx
// next.config.ts
const config = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};
```

## Font Optimization

### next/font

```tsx
// app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${jakarta.variable}`}>
      {children}
    </html>
  );
}
```

### Local fonts

```tsx
import localFont from 'next/font/local';

const customFont = localFont({
  src: './fonts/custom.woff2',
  display: 'swap',
});
```

## Script Optimization

### next/script

```tsx
import Script from 'next/script';

// Analytics - load after page is interactive
<Script
  src="https://www.googletagmanager.com/gtag/js"
  strategy="afterInteractive"
/>

// Non-critical - load when idle
<Script
  src="https://example.com/widget.js"
  strategy="lazyOnload"
/>

// Critical - block rendering (rare)
<Script
  src="https://example.com/critical.js"
  strategy="beforeInteractive"
/>
```

## Rendering Performance

### Server Components (default)

```tsx
// ✅ Server Component: Zero client JS
export default async function ProductList() {
  const products = await getProducts();
  return (
    <ul>
      {products.map(p => <li key={p.id}>{p.name}</li>)}
    </ul>
  );
}
```

### Minimal Client Components

```tsx
// ✅ Keep Client Components small and leaf-level
'use client';

export function AddToCartButton({ productId }: Props) {
  // Only this component ships to client
  return <button onClick={() => addToCart(productId)}>Add</button>;
}
```

### Streaming with Suspense

```tsx
// ✅ Stream slow data to avoid blocking
export default function Page() {
  return (
    <main>
      <FastContent />
      <Suspense fallback={<SlowSkeleton />}>
        <SlowContent />
      </Suspense>
    </main>
  );
}
```

## Core Web Vitals

### LCP (Largest Contentful Paint)

```tsx
// ✅ Priority for above-fold images
<Image src={heroImage} priority />

// ✅ Preload critical assets
<link rel="preload" href="/hero.jpg" as="image" />

// ✅ Avoid layout shifts
<Image width={800} height={600} />  // Always specify dimensions
```

### CLS (Cumulative Layout Shift)

```tsx
// ✅ Reserve space for dynamic content
<div className="min-h-[200px]">
  <Suspense fallback={<Skeleton className="h-[200px]" />}>
    <DynamicContent />
  </Suspense>
</div>

// ✅ Font display swap
const font = Inter({ display: 'swap' });
```

### INP (Interaction to Next Paint)

```tsx
// ✅ Use transitions for non-urgent updates
const [isPending, startTransition] = useTransition();

function handleClick() {
  startTransition(() => {
    setExpensiveState(newValue);
  });
}

// ✅ Debounce frequent inputs
const debouncedSearch = useDebouncedCallback(
  (value) => setQuery(value),
  300
);
```

## Data Fetching Performance

### Parallel fetching

```tsx
// ✅ Parallel: Both start immediately
export default async function Page() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
}

// ❌ Sequential: Waterfall
export default async function Page() {
  const products = await getProducts();
  const categories = await getCategories();  // Waits for products
}
```

### Prefetching

```tsx
import Link from 'next/link';

// ✅ Prefetch on hover (default for Link)
<Link href="/products">Products</Link>

// Disable prefetch for low-priority links
<Link href="/terms" prefetch={false}>Terms</Link>
```

## Memory & Runtime

### Avoid memory leaks

```tsx
'use client';

useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal });
  
  // ✅ Cleanup
  return () => controller.abort();
}, []);
```

### Memoization

```tsx
'use client';

// ✅ Memoize expensive computations
const sortedProducts = useMemo(
  () => products.sort((a, b) => a.price - b.price),
  [products]
);

// ✅ Stable callbacks
const handleClick = useCallback(() => {
  // ...
}, [dependency]);
```

## Monitoring

### Vercel Analytics

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

### Performance marks

```tsx
'use client';

useEffect(() => {
  performance.mark('component-mounted');
  
  return () => {
    performance.measure('component-lifetime', 'component-mounted');
  };
}, []);
```

## Checklist

- [ ] Images use next/image with proper sizing
- [ ] Above-fold images have priority
- [ ] Fonts use next/font with display: swap
- [ ] Third-party scripts use appropriate strategy
- [ ] Heavy components are dynamically imported
- [ ] Server Components used by default
- [ ] Client Components are small and leaf-level
- [ ] Slow data wrapped in Suspense
- [ ] Parallel data fetching where possible
- [ ] No layout shifts (reserved space)
- [ ] Bundle analyzed for unnecessary code
