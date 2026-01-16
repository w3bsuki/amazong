# Plan: Replace Main Page with Demo Desktop UX

## Overview

Replace the current main page (`/`) desktop experience with the enhanced `/demo` page UX while preserving the mobile experience.

**Why:** The `/demo` page has superior desktop UX:
- Two-column layout with sticky sidebar
- Categories + Filters in left sidebar
- Full-width search bar that expands to fill space
- Compact sort dropdown instead of tab bar
- Grid/list view toggle
- Clean card-based sections

---

## Current State

### Main Page (`app/[locale]/(main)/page.tsx`)
- **Mobile:** `MobileHomeTabs` component (Temu-style tabs) ✅ Keep
- **Desktop:** `TabbedProductFeed` from `components/sections/` (~576 lines)

### Demo Page (`app/[locale]/(main)/demo/page.tsx`)
- **Desktop only:** `DemoProductFeed` from `demo/_components/` (~807 lines)

---

## Migration Steps

### Phase 1: Backup & Prepare

```
□ 1.1  Git commit current state (clean working tree)
□ 1.2  Keep /demo route temporarily for A/B comparison
```

### Phase 2: Move Component

```
□ 2.1  Copy demo-product-feed.tsx → components/sections/desktop-product-feed.tsx
□ 2.2  Rename export: DemoProductFeed → DesktopProductFeed
□ 2.3  Rename skeleton: DemoProductFeedSkeleton → DesktopProductFeedSkeleton
□ 2.4  Update all internal references
```

### Phase 3: Update Main Page

```
□ 3.1  In app/[locale]/(main)/page.tsx:
       - Import DesktopProductFeed instead of TabbedProductFeed
       - Replace desktop section component
       - Keep mobile section unchanged (MobileHomeTabs)

□ 3.2  Update imports:
       OLD: import { TabbedProductFeed } from "@/components/sections/tabbed-product-feed"
       NEW: import { DesktopProductFeed } from "@/components/sections/desktop-product-feed"
```

### Phase 4: Cleanup Old Code

```
□ 4.1  Verify no other pages import TabbedProductFeed
       → grep -r "TabbedProductFeed" app/ components/
       
□ 4.2  If no other usages:
       - Delete components/sections/tabbed-product-feed.tsx
       - Or rename to tabbed-product-feed.old.tsx for safety

□ 4.3  Remove /demo route:
       - Delete app/[locale]/(main)/demo/ folder
       - Or keep as archive reference
```

### Phase 5: Verify

```
□ 5.1  pnpm -s exec tsc -p tsconfig.json --noEmit
□ 5.2  REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
□ 5.3  Manual test:
       - Desktop: / route shows new sidebar layout
       - Mobile: / route shows original MobileHomeTabs
       - Category filtering works
       - Sort dropdown works
       - Grid/list toggle works
       - Load more works
```

---

## Code Changes

### File: `app/[locale]/(main)/page.tsx`

```diff
- import { TabbedProductFeed, TabbedProductFeedSkeleton } from "@/components/sections/tabbed-product-feed"
+ import { DesktopProductFeed, DesktopProductFeedSkeleton } from "@/components/sections/desktop-product-feed"

  {/* DESKTOP */}
  <div className="hidden md:block w-full">
-   <div className="w-full bg-background py-4">
-     <div className="container">
-       <Suspense fallback={<TabbedProductFeedSkeleton />}>
-         <TabbedProductFeed
+   <div className="w-full bg-background py-4">
+     <div className="container">
+       <Suspense fallback={<DesktopProductFeedSkeleton />}>
+         <DesktopProductFeed
            locale={locale}
            categories={categoriesWithChildren}
            initialTab="newest"
            initialProducts={initialProducts}
          />
        </Suspense>
      </div>
    </div>
  </div>
```

### File: `components/sections/desktop-product-feed.tsx`

```diff
- export function DemoProductFeed({ ... }) { ... }
+ export function DesktopProductFeed({ ... }) { ... }

- export function DemoProductFeedSkeleton() { ... }
+ export function DesktopProductFeedSkeleton() { ... }
```

---

## Files Affected

| Action | File |
|--------|------|
| MODIFY | `app/[locale]/(main)/page.tsx` |
| CREATE | `components/sections/desktop-product-feed.tsx` |
| DELETE | `components/sections/tabbed-product-feed.tsx` (after verification) |
| DELETE | `app/[locale]/(main)/demo/` folder (optional) |

---

## Rollback Plan

If issues arise:
1. Revert `page.tsx` to use `TabbedProductFeed`
2. Keep old component file until stable

---

## Estimated Effort

- **Time:** ~15-30 minutes
- **Risk:** Low (isolated change, easy rollback)
- **Testing:** Typecheck + E2E smoke + manual verification

---

## Notes

- Mobile experience (`MobileHomeTabs`) is **completely unchanged**
- Desktop breakpoint is `md:` (768px+)
- The new layout uses `lg:` (1024px+) for sidebar visibility
- Consider adding `lg:hidden md:block` fallback for tablet sizes if needed
