# Phase 4 — Agent 1: Route Completeness

> **Scope:** Every route has loading states, metadata, error boundaries, and no data waterfalls.
> **Read `refactor/shared-rules.md` first.**

---

## Objectives

1. Add missing `loading.tsx` to every route with a `page.tsx`.
2. Add missing `generateMetadata()` or static `metadata` to every user-facing page.
3. Ensure every route group has an `error.tsx`.
4. Check for data waterfalls in layouts.

## How to Work

### 1. Find missing `loading.tsx`

For every directory in `app/` that has a `page.tsx`, check if it also has a `loading.tsx`:
```bash
# PowerShell
Get-ChildItem -Recurse -Filter page.tsx app/ | ForEach-Object {
  $dir = $_.DirectoryName
  if (-not (Test-Path "$dir/loading.tsx")) { Write-Host "MISSING: $dir" }
}
```

For each missing one, create a minimal skeleton:
```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
```

Tailor the skeleton shape to roughly match the page content if you can tell from reading the page file. Header-shaped skeleton for pages with headers, grid-shaped for listing pages, etc.

### 2. Find missing metadata

```bash
grep -rL "generateMetadata\|export const metadata" app/[locale]/**/page.tsx
```

For each page missing metadata, add `generateMetadata()`:
```tsx
import type { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Page Title — Treido",
    description: "Brief page description.",
  }
}
```

For dynamic pages (product detail, seller profile), use params to build dynamic metadata:
```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productSlug } = await params
  // Fetch product title for dynamic metadata
  return { title: `${productTitle} — Treido` }
}
```

**Don't add metadata to:** admin pages, internal tool pages, or layout-only route groups without their own page.

### 3. Check error boundary coverage

```bash
# Which route groups have error.tsx?
Get-ChildItem -Recurse -Filter error.tsx app/[locale]/ | Select-Object DirectoryName
```

Every direct child route group of `app/[locale]/` should have an `error.tsx`. Create missing ones:
```tsx
"use client"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <button onClick={reset} className="text-primary underline">Try again</button>
    </div>
  )
}
```

Note: `error.tsx` MUST have `"use client"` — this is a Next.js requirement.

### 4. Check data waterfalls in layouts

Read every `layout.tsx` in `app/[locale]/`. If a layout fetches data synchronously (awaits a query before rendering children), the child `page.tsx` is blocked.

Fix: wrap data-dependent layout sections in `<Suspense>`:
```tsx
import { Suspense } from "react"

export default function Layout({ children }) {
  return (
    <div>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      {children}
    </div>
  )
}
```

## Verification

After each batch of changes: `pnpm -s typecheck && pnpm -s lint`
After all changes: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

## Output

- `loading.tsx` files created (count + list)
- `generateMetadata` added (count + list)
- `error.tsx` files created (count + list)
- Data waterfalls fixed in layouts (list)
- Remaining gaps flagged (if any)
