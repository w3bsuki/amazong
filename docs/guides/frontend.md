# Frontend Development Guide

Reference for UI/UX work on Treido. This is the **canonical frontend guide** for both humans and agents.

## Quick Reference

**Gates (run after every change):**
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
pnpm test:e2e:smoke
```

**Drift scans:**
```bash
pnpm -s exec node scripts/scan-tailwind-palette.mjs
pnpm -s exec node scripts/scan-tailwind-arbitrary.mjs
```

---

## Component Architecture

### Primitives (`components/ui/`)
- shadcn/ui components only
- No feature logic, no app hooks
- Import from `@/components/ui/*`

### Common (`components/common/`)
- Shared composites: cards, sections, badges
- Used across multiple routes
- Can use hooks from `hooks/**`

### Layout (`components/layout/`)
- Shells: headers, nav, sidebars, footers
- Mobile/desktop variants
- Responsive breakpoint handling

### Route-Owned (`app/[locale]/(group)/**/_components/`)
- Private to that route group
- Never import across route groups
- Co-located with the route that uses them

## Key UI Components

| Component | File | Purpose |
|-----------|------|---------|
| Product Card | `components/common/product-card.tsx` | Main product card |
| Product Card Hero | `components/common/product-card-hero.tsx` | Featured variant |
| Navigation | `components/navigation/` | Shared nav |
| Mobile Nav | `components/mobile/` | Bottom nav, drawers |
| Desktop Nav | `components/desktop/` | Mega menu |

## Responsive Design

### Breakpoints
```
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (large desktop)
```

### Testing Viewports
- Mobile: 390×844 (iPhone 14 Pro)
- Desktop: 1440×900

### Mobile-First Approach
```tsx
// Base = mobile, md: = tablet+, lg: = desktop+
className="p-3 md:p-4 lg:p-6"
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"

// Mobile only
className="block md:hidden"

// Desktop only
className="hidden md:block"
```

## i18n with next-intl

### Usage
```tsx
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('Namespace');
  return <p>{t('key')}</p>;
}
```

### Message Files
- `messages/en.json` - English
- `messages/bg.json` - Bulgarian
- Keep keys in sync between files
- Use dot notation for nesting: `Namespace.subKey`

### Rules
- No hardcoded user-facing strings
- Use localized routing from `@/i18n/routing`
- Always include locale in paths

## Images

### Next.js Image Component
```tsx
import Image from 'next/image';

<Image
  src={url}
  alt={descriptiveAlt}
  width={300}
  height={200}
  className="object-cover"
  priority  // Only for above-fold images
/>
```

### Utilities
- `lib/image-utils.ts` - URL normalization, placeholder generation
- `lib/normalize-image-url.ts` - Supabase storage URL handling

## State Management

### Rules
- `useState` for component-local state
- Fetch in Server Components when possible
- Use Server Actions for mutations
- **No global state libraries** (no Redux, Zustand, etc.)
- Use React Context sparingly

## Performance

### Bundle Size
- Import `{ specific }` not `* as lib`
- Use dynamic imports for heavy components

### Rendering
- Prefer Server Components (default in App Router)
- Add `'use client'` only when needed
- Avoid unnecessary re-renders

## Common Patterns

### Loading States
```tsx
<Suspense fallback={<ProductCardSkeleton />}>
  <ProductCard id={id} />
</Suspense>
```

### Empty States
- Always handle empty data gracefully
- Show helpful message, not blank screen

### Accessibility
- All interactive elements keyboard accessible
- Meaningful alt text on images
- ARIA labels where needed

## Files to Know

| File | Purpose |
|------|---------|
| `app/globals.css` | Global styles, Tailwind imports |
| `components/ui/button.tsx` | Primary button component |
| `components/ui/card.tsx` | Card primitives |
| `hooks/use-mobile.ts` | Mobile detection hook |
| `hooks/use-toast.ts` | Toast notifications |
| `lib/utils.ts` | `cn()` classname utility |

## Verification Checklist

Before marking frontend work complete:

- [ ] Tested on mobile viewport (390×844)
- [ ] Tested on desktop viewport (1440×900)
- [ ] All text uses i18n (no hardcoded strings)
- [ ] Images have alt text
- [ ] Interactive elements are keyboard accessible
- [ ] Loading states handled
- [ ] Error states handled
- [ ] `pnpm -s exec tsc -p tsconfig.json --noEmit` passes
- [ ] `pnpm test:e2e:smoke` passes
