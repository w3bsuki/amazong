# Next.js 16 — App Router Reference

## DO

### Server Components by default
Every component inside `app/` is a Server Component unless you add `"use client"`. Fetch data directly — no useEffect, no client-side fetching.

```tsx
// app/[locale]/(main)/products/page.tsx — Server Component (default)
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}
```

### `"use client"` only for interactivity
Only add when the component needs: state, effects, event handlers, browser APIs, or hooks like `useTranslations`.

```tsx
"use client"
import { useState } from "react"

export function AddToCartButton({ productId }: { productId: string }) {
  const [pending, setPending] = useState(false)
  // event handler = needs client
  return <button onClick={() => ...}>Add</button>
}
```

### Caching with `"use cache"` + `cacheLife` + `cacheTag`
Next.js 16 replaces `revalidate` with `"use cache"` directive. Always pair `cacheLife()` + `cacheTag()`. Use `createStaticClient()` (no cookies).

```tsx
import { cacheLife, cacheTag } from "next/cache"
import { createStaticClient } from "@/lib/supabase/server"

export async function getCategories() {
  "use cache"
  cacheLife("categories")
  cacheTag("categories")
  const supabase = createStaticClient()
  const { data } = await supabase.from("categories").select("id, name, slug")
  return data ?? []
}
```

### Cache invalidation with `updateTag`
In server actions, use `updateTag()` to bust specific cache entries.

```tsx
"use server"
import { updateTag } from "next/cache"

export async function createProduct(formData: FormData) {
  // ... insert product
  updateTag("products")
  redirect("/products")
}
```

### Composition with cached components
Pass dynamic content as children/slots through cached wrappers:

```tsx
async function CachedShell({ children }: { children: React.ReactNode }) {
  "use cache"
  const nav = await getNavItems()
  return <div><Nav items={nav} />{children}</div>
}
```

### Metadata via `generateMetadata`
Export async `generateMetadata` in page/layout files. Can use `"use cache"` inside.

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Products" })
  return { title: t("title") }
}
```

### Loading & error boundaries
Use `loading.tsx`, `error.tsx`, `not-found.tsx` per route segment. They compose automatically.

### `cacheComponents: true` in next.config.ts
Required to use `"use cache"` at component level. Already enabled in our config.

---

## DON'T

### Don't use `getSession()` in Server Components
It reads the JWT without re-validating. A spoofed token passes silently. Always use `getUser()`.

### Don't put `cookies()`, `headers()`, or user data inside `"use cache"`
These are dynamic — they break the cache. Fetch user data outside the cache boundary.

```tsx
// ❌ BAD
export async function getUserProfile() {
  "use cache" // cookies() inside = broken
  const supabase = createClient() // uses cookies
  // ...
}

// ✅ GOOD — use createStaticClient for cached, createClient for user-specific
```

### Don't use `revalidate` ISR-style
Deprecated in v16. Use `"use cache"` + `cacheLife()` profiles instead.

### Don't import `next/link` directly
Use `Link` from `@/i18n/routing` for locale-aware navigation.

### Don't use `fetch()` with `{ cache: 'no-store' }` for DB queries
We use Supabase client directly — no fetch wrapper needed. `createClient()` (with cookies) for user-specific, `createStaticClient()` for cached.

---

## OUR SETUP

- **Next.js 16.1.6** with App Router, `cacheComponents: true`
- **Middleware:** `proxy.ts` (Next.js 16 convention) — i18n + geo + session refresh
- **Cache profiles** in `next.config.ts`: `categories`, `products`, `deals`, `user`, `max`
- **Route groups:** `(main)`, `(account)`, `(auth)`, `(sell)`, `(checkout)`, etc.
- **Typed routes:** `typedRoutes: true` — Link href is statically typed
- **Image:** AVIF + WebP, quality levels [25,50,75,85,90,100], 30-day cache
