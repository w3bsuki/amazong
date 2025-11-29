# AMZN E-Commerce Production Refactor Plan

**Generated:** November 29, 2025  
**Tech Stack:** Next.js 15+ (App Router), React 19, Tailwind CSS v4, shadcn/ui, Supabase, next-intl  
**Goal:** Production-ready desktop and mobile versions following best practices

---

## 📊 Audit Summary

### ✅ What's Working Well

| Area | Status | Notes |
|------|--------|-------|
| **i18n Setup** | ✅ Excellent | next-intl properly configured with BG/EN locales |
| **Image Optimization** | ✅ Good | Next/Image with AVIF/WebP, proper sizes, blur placeholders |
| **Accessibility** | ✅ Good | Skip links, ARIA labels, semantic HTML |
| **Mobile UX** | ✅ Good | Touch targets (44px+), snap scrolling, safe areas |
| **Design System** | ✅ Excellent | Comprehensive CSS variables, eBay-style tokens |
| **Component Library** | ✅ Good | shadcn/ui with Radix primitives |
| **Cart/Wishlist** | ✅ Good | Context-based state management |

### ⚠️ Issues Requiring Attention

| Priority | Issue | Impact |
|----------|-------|--------|
| 🔴 High | TypeScript errors ignored in build | Production bugs |
| 🔴 High | Missing error boundaries on key pages | User experience |
| 🟡 Medium | Tailwind v4 class migrations needed | Linting warnings |
| 🟡 Medium | Phosphor icons not optimized | Bundle size |
| 🟡 Medium | Missing loading states on some routes | Perceived performance |
| 🟢 Low | Unused imports in some files | Code cleanliness |
| 🟢 Low | Console 404 errors for missing resources | Clean logs |

---

## 🔧 Phase 1: Critical Fixes (Week 1)

### 1.1 Enable TypeScript Strict Mode

**Current Issue:** `next.config.mjs` has `ignoreBuildErrors: true`

```javascript
// next.config.mjs - REMOVE THIS
typescript: {
  ignoreBuildErrors: true, // ❌ Remove for production
},
```

**Action Items:**
- [ ] Remove `ignoreBuildErrors: true` from next.config.mjs
- [ ] Run `pnpm build` and fix all TypeScript errors
- [ ] Add proper type definitions for Supabase tables
- [ ] Ensure all component props are properly typed

### 1.2 Fix Tailwind v4 Class Migrations

**Files with deprecated classes:**

| File | Issue | Fix |
|------|-------|-----|
| `STYLING.md` | `focus:z-[100]` | `focus:z-100` |
| `cart/page.tsx` | `flex-shrink-0` | `shrink-0` |
| `gift-cards/page.tsx` | `bg-gradient-to-br` | `bg-linear-to-br` |
| `dropdown-menu.tsx` | `data-[disabled]:*` | `data-disabled:*` |
| `dropdown-menu.tsx` | `data-[inset]:*` | `data-inset:*` |

**Batch Fix Command:**
```bash
# Run find-and-replace across all files
pnpm dlx @tailwindcss/upgrade --config tailwind.config.ts
```

### 1.3 Remove Unused Imports

| File | Unused Import |
|------|---------------|
| `account/page.tsx` | `ChatCircle` |
| `gift-cards/page.tsx` | `Envelope` |

### 1.4 Optimize Phosphor Icons Imports

**Current (❌ Bad):**
```tsx
import { Package, CreditCard } from "@phosphor-icons/react/dist/ssr"
```

**Recommended (✅ Good):**
```tsx
import Package from "@phosphor-icons/react/dist/ssr/Package"
import CreditCard from "@phosphor-icons/react/dist/ssr/CreditCard"
```

**Or add to next.config.mjs:**
```javascript
experimental: {
  optimizePackageImports: ['@phosphor-icons/react'],
},
```

---

## 🎯 Phase 2: Performance Optimization (Week 2)

### 2.1 Add Loading States

**Missing loading.tsx files:**

```
app/[locale]/
├── loading.tsx          ✅ Add
├── product/
│   └── [id]/
│       └── loading.tsx  ✅ Add
├── search/
│   └── loading.tsx      ✅ Add
├── cart/
│   └── loading.tsx      ✅ Add
└── checkout/
    └── loading.tsx      ✅ Add
```

**Example loading.tsx:**
```tsx
// app/[locale]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container py-8">
      <Skeleton className="h-8 w-48 mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 2.2 Add Error Boundaries

**Create error.tsx files:**
```tsx
// app/[locale]/error.tsx
'use client'

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
```

### 2.3 Implement Route Prefetching Strategy

**Current:**
- Some links use `prefetch={true}`, some don't

**Recommended Strategy:**
```tsx
// High-traffic links: Always prefetch
<Link href="/" prefetch={true}>Home</Link>
<Link href="/search" prefetch={true}>Search</Link>
<Link href="/todays-deals" prefetch={true}>Deals</Link>

// Product cards: Prefetch first 4-6 only
<Link href={`/product/${id}`} prefetch={index < 6}>
  {productTitle}
</Link>

// Category links: Prefetch on hover
<HoverPrefetchLink href={`/categories/${slug}`}>
  {categoryName}
</HoverPrefetchLink>
```

### 2.4 Optimize Bundle Size

**Add bundle analyzer:**
```bash
pnpm add -D @next/bundle-analyzer
```

```javascript
// next.config.mjs
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(withNextIntl(nextConfig))
```

**Run analysis:**
```bash
ANALYZE=true pnpm build
```

---

## 📱 Phase 3: Mobile Optimization (Week 3)

### 3.1 Mobile Header Improvements

**Current Issues:**
- Fixed header takes significant space
- No scroll-to-hide behavior

**Recommended Changes:**
```tsx
// components/site-header.tsx
'use client'

import { useScrollDirection } from '@/hooks/use-scroll-direction'

export function SiteHeader() {
  const scrollDirection = useScrollDirection()
  
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
      scrollDirection === 'down' && "md:translate-y-0 -translate-y-full"
    )}>
      {/* ... */}
    </header>
  )
}
```

### 3.2 Add Mobile Bottom Tab Bar

**Recommended for mobile:**
```
┌─────────────────────────────────────┐
│            AMZN Header              │
├─────────────────────────────────────┤
│                                     │
│           Page Content              │
│                                     │
├─────────────────────────────────────┤
│  🏠    🔍    ❤️    👤    🛒    │
│ Home Search Wishlist Account Cart   │
└─────────────────────────────────────┘
```

**Implementation exists in `mobile-tab-bar.tsx` - ensure it's being used:**
```tsx
// app/[locale]/layout.tsx
import { MobileTabBar } from "@/components/mobile-tab-bar"

// Add to layout (mobile only)
<div className="md:hidden">
  <MobileTabBar />
</div>
```

### 3.3 Touch Optimizations

**Ensure all interactive elements meet WCAG 2.1 AA:**
- Minimum touch target: 44x44px ✅ Already defined in globals.css
- Adequate spacing between touch targets
- Visual feedback on touch (active states)

---

## 🔒 Phase 4: Security & Production (Week 4)

### 4.1 Environment Variables Audit

**Required for production:**
```env
# .env.production
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=         # Server-only
STRIPE_SECRET_KEY=                  # Server-only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### 4.2 Security Headers

**Add to next.config.mjs:**
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 4.3 Rate Limiting

**Add to API routes:**
```typescript
// lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

export const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  analytics: true,
})
```

### 4.4 CSP Headers

**Add Content Security Policy:**
```javascript
{
  key: 'Content-Security-Policy',
  value: `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' *.supabase.co;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: *.supabase.co images.unsplash.com;
    font-src 'self' fonts.googleapis.com fonts.gstatic.com;
    connect-src 'self' *.supabase.co;
  `.replace(/\n/g, '')
}
```

---

## 📊 Phase 5: Analytics & Monitoring (Week 5)

### 5.1 Web Vitals Tracking

**Add to layout:**
```tsx
// components/web-vitals.tsx
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Send to analytics
    console.log(metric)
    
    // Example: Send to Vercel Analytics
    // window.va?.track(metric.name, {
    //   value: Math.round(metric.value),
    //   rating: metric.rating,
    // })
  })
  
  return null
}
```

### 5.2 Error Tracking

**Recommended: Sentry integration**
```bash
pnpm add @sentry/nextjs
```

### 5.3 Performance Monitoring

**Target metrics:**
| Metric | Target | Current |
|--------|--------|---------|
| LCP | < 2.5s | Measure |
| FID | < 100ms | Measure |
| CLS | < 0.1 | Measure |
| TTFB | < 200ms | Measure |

---

## 🧪 Phase 6: Testing (Week 6)

### 6.1 Add E2E Tests with Playwright

```bash
pnpm add -D @playwright/test
```

**Test files to create:**
```
tests/
├── e2e/
│   ├── homepage.spec.ts
│   ├── search.spec.ts
│   ├── product.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── auth.spec.ts
└── playwright.config.ts
```

### 6.2 Add Component Tests

```bash
pnpm add -D @testing-library/react @testing-library/jest-dom vitest
```

---

## 📋 Pre-Launch Checklist

### Technical
- [ ] TypeScript strict mode enabled
- [ ] All build warnings resolved
- [ ] Bundle size optimized (<500KB initial)
- [ ] Images optimized with Next/Image
- [ ] Fonts optimized with next/font
- [ ] Error boundaries on all routes
- [ ] Loading states on all async routes
- [ ] 404 and 500 pages styled

### SEO
- [ ] Meta tags on all pages
- [ ] OpenGraph images
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Structured data (JSON-LD)

### Performance
- [ ] Lighthouse score > 90 all categories
- [ ] Core Web Vitals passing
- [ ] First load JS < 100KB per route
- [ ] Images lazy loaded below fold

### Accessibility
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Color contrast verified

### Security
- [ ] Environment variables secured
- [ ] API routes protected
- [ ] Rate limiting implemented
- [ ] CSP headers configured
- [ ] HTTPS enforced

### Mobile
- [ ] Responsive on all breakpoints
- [ ] Touch targets 44px minimum
- [ ] Safe area insets handled
- [ ] No horizontal overflow
- [ ] Smooth scrolling

---

## 🚀 Deployment Recommendations

### Vercel (Recommended)
```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

### Build Command
```bash
pnpm build
```

### Environment Setup
1. Configure Supabase production project
2. Set up Stripe production keys
3. Configure domain and SSL
4. Set up monitoring (Sentry, Vercel Analytics)

---

## 📈 Post-Launch Monitoring

1. **Real User Monitoring (RUM)**
   - Vercel Analytics / Web Vitals
   - User session recordings

2. **Error Tracking**
   - Sentry error reports
   - Slack/Discord alerts

3. **Performance Regression**
   - Lighthouse CI in GitHub Actions
   - Bundle size tracking

4. **A/B Testing**
   - Feature flags for gradual rollout
   - Conversion tracking

---

## 📚 Reference Documentation

- [Next.js Best Practices](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Supabase Docs](https://supabase.com/docs)
- [next-intl Docs](https://next-intl-docs.vercel.app)

---

**Estimated Timeline:** 6 weeks  
**Priority:** High → Low (Phase 1 → Phase 6)

