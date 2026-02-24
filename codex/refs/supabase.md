# Supabase — Server-Side Patterns Reference

## DO

### Use the correct client per context

| Client | When | Module |
|--------|------|--------|
| `createClient()` | Server Components, server actions (needs user session) | `lib/supabase/server.ts` |
| `createRouteHandlerClient(req)` | Route handlers (`app/api/*`) | `lib/supabase/server.ts` |
| `createStaticClient()` | Cached queries inside `"use cache"` (no cookies) | `lib/supabase/server.ts` |
| `createAdminClient()` | Service-role ops after trust verification | `lib/supabase/server.ts` |
| `createBrowserClient()` | Client Components | `lib/supabase/client.ts` |

### `getUser()` for auth — NEVER `getSession()`
`getSession()` reads the JWT without re-validating. A spoofed token passes silently.

```tsx
// ✅ CORRECT
const { data: { user } } = await supabase.auth.getUser()
if (!user) redirect("/login")

// ❌ DANGEROUS — never in production code
const { data: { session } } = await supabase.auth.getSession()
```

### Cookie handling with `getAll`/`setAll`
The `@supabase/ssr` package requires this exact pattern:

```tsx
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — safe to ignore
            // (middleware handles session refresh)
          }
        },
      },
    }
  )
}
```

### Select specific columns
Never `select('*')` in hot paths. Always name columns.

```tsx
// ✅ GOOD
const { data } = await supabase
  .from("products")
  .select("id, title, price, slug, images")
  .limit(20)

// ❌ BAD — fetches entire row including unused columns
const { data } = await supabase.from("products").select("*")
```

### Typed queries
Use generated types from `supabase gen types`.

```tsx
import type { Database } from "@/lib/supabase/database.types"
type Product = Database["public"]["Tables"]["products"]["Row"]
```

### Error handling
Always check `error` from Supabase responses. Use typed error envelopes.

```tsx
const { data, error } = await supabase.from("products").select("id, title")
if (error) throw new Error(`Products query failed: ${error.message}`)
```

---

## DON'T

### Don't use `createClient()` inside `"use cache"`
`createClient()` uses `cookies()` — dynamic, breaks cache. Use `createStaticClient()`.

### Don't use `getSession()` anywhere
Always `getUser()`. This is a security rule, not a preference.

### Don't use wide joins in list views
Keep list queries lean. Load relations only on detail pages.

```tsx
// ❌ BAD in a list view
.select("*, seller(*), category(*), reviews(*)")

// ✅ GOOD — minimal for list, full for detail
.select("id, title, price, images, seller_id")
```

### Don't cache user-specific data
Never put user-specific queries inside `"use cache"`. Another user could see cached data.

### Don't forget `requireAuth()` in server actions
All mutating server actions must verify the user.

```tsx
"use server"
import { requireAuth } from "@/lib/auth/require-auth"

export async function updateProfile(formData: FormData) {
  const user = await requireAuth() // throws if unauthenticated
  // ...
}
```

---

## OUR SETUP

- **Package:** `@supabase/ssr` 0.8.0 + `@supabase/supabase-js` 2.91.0
- **Clients:** 5 specialized clients in `lib/supabase/server.ts` + browser in `lib/supabase/client.ts`
- **Auth helper:** `requireAuth()` from `lib/auth/require-auth.ts` for server action auth
- **Types:** Generated `database.types.ts`
- **RLS:** Enabled on all tables — client queries respect row-level security
