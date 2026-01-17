# Migrate Demo Mobile → Main Homepage

**Goal**: Replace the current `(main)` mobile homepage with the `/demo/mobile` implementation.

---

## Current Structure

```
app/[locale]/
├── (main)/                    ← Main route group (current production)
│   ├── layout.tsx
│   └── page.tsx               ← Desktop + Mobile homepage
│
└── (demo)/demo/mobile/        ← Demo route (new mobile UX)
    ├── page.tsx
    └── _components/
        └── mobile-demo-landing.tsx
```

## Target Structure

```
app/[locale]/
├── (main)/
│   ├── layout.tsx
│   └── page.tsx               ← Uses MobileDemoLanding on mobile
│
└── (demo)/demo/mobile/        ← Keep for reference/testing
```

---

## Migration Steps

### Step 1: Move the Component

Copy `mobile-demo-landing.tsx` to shared components:

```bash
# Create target directory
mkdir -p components/mobile/home

# Copy component
cp "app/[locale]/(demo)/demo/mobile/_components/mobile-demo-landing.tsx" \
   "components/mobile/home/mobile-home-landing.tsx"
```

### Step 2: Rename Export

In `components/mobile/home/mobile-home-landing.tsx`, rename the export:

```diff
- export function MobileDemoLanding() {
+ export function MobileHomeLanding() {
```

Create an index file:

```ts
// components/mobile/home/index.ts
export { MobileHomeLanding } from "./mobile-home-landing"
```

### Step 3: Update Main Homepage

In `app/[locale]/(main)/page.tsx`, add mobile detection:

```tsx
import { headers } from "next/headers"
import { MobileHomeLanding } from "@/components/mobile/home"

// Existing desktop component
import { DesktopHomePage } from "./_components/desktop-home-page"

export default async function HomePage() {
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent)

  if (isMobile) {
    return <MobileHomeLanding />
  }

  return <DesktopHomePage />
}
```

### Step 4: Alternative - CSS-Only Approach

If you prefer client-side detection (simpler, no SSR logic):

```tsx
// app/[locale]/(main)/page.tsx
import { MobileHomeLanding } from "@/components/mobile/home"
import { DesktopHomePage } from "./_components/desktop-home-page"

export default function HomePage() {
  return (
    <>
      {/* Mobile: visible below md breakpoint */}
      <div className="md:hidden">
        <MobileHomeLanding />
      </div>

      {/* Desktop: visible at md+ */}
      <div className="hidden md:block">
        <DesktopHomePage />
      </div>
    </>
  )
}
```

**Note**: This renders both components. For bundle optimization, use dynamic imports:

```tsx
import dynamic from "next/dynamic"

const MobileHomeLanding = dynamic(
  () => import("@/components/mobile/home").then(m => m.MobileHomeLanding),
  { ssr: true }
)

const DesktopHomePage = dynamic(
  () => import("./_components/desktop-home-page").then(m => m.DesktopHomePage),
  { ssr: true }
)
```

---

## Quick Checklist

- [ ] Copy `mobile-demo-landing.tsx` → `components/mobile/home/`
- [ ] Rename export to `MobileHomeLanding`
- [ ] Update imports (remove any demo-specific paths)
- [ ] Update `(main)/page.tsx` to conditionally render mobile
- [ ] Run typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
- [ ] Test mobile viewport at `/` route
- [ ] Run smoke tests: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

---

## Component Dependencies

The `MobileHomeLanding` component requires:

| Import | Package |
|--------|---------|
| `@phosphor-icons/react` | Icons (Bell, Cart, etc.) |
| `next-intl` | `useLocale()` |
| `@/i18n/routing` | `Link` |
| `@/lib/utils` | `cn()` |
| `@/components/ui/button` | `Button` |

All of these are already available in the main app.

---

## Mock Data → Real Data

The demo uses `MOCK_PRODUCTS` and `MOCK_CATEGORIES`. To connect real data:

1. **Categories**: Fetch from `lib/categories.ts` or Supabase
2. **Products**: Use existing product queries from `lib/queries/`
3. **Flash Deals**: Query products with `is_flash_deal = true` or similar flag

Example server component approach:

```tsx
// app/[locale]/(main)/page.tsx
import { getCategories } from "@/lib/queries/categories"
import { getFeaturedProducts } from "@/lib/queries/products"

export default async function HomePage() {
  const [categories, products] = await Promise.all([
    getCategories(),
    getFeaturedProducts({ limit: 12 })
  ])

  // ... render with real data
}
```

---

## Rollback

If issues arise, simply revert `(main)/page.tsx` to its previous state. The demo route remains untouched at `/demo/mobile`.
