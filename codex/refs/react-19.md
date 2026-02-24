# React 19 — Patterns Reference

## DO

### Server Components as the default
Components without `"use client"` are Server Components. They can be `async`, fetch data directly, and send zero JS to the client.

```tsx
// Server Component — no directive needed, can be async
export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id)
  return <ProductDetails product={product} />
}
```

### `useActionState` for form mutations
Replaces manual `useState` + `onSubmit` patterns. Returns `[state, action, isPending]`.

```tsx
"use client"
import { useActionState } from "react"
import { createListing } from "@/app/actions/listings"

function SellForm() {
  const [error, submitAction, isPending] = useActionState(
    async (prev: string | null, formData: FormData) => {
      const result = await createListing(formData)
      if (result.error) return result.error
      return null
    },
    null
  )

  return (
    <form action={submitAction}>
      <input name="title" required />
      <button disabled={isPending}>List Item</button>
      {error && <p className="text-destructive">{error}</p>}
    </form>
  )
}
```

### `useFormStatus` for submit buttons
Access pending state from within the form — works in child components.

```tsx
"use client"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? "Saving..." : "Save"}</button>
}
```

### Prop-driven client components
Pass data from Server Components as props. Client components don't fetch — they render.

```tsx
// Server Component (parent)
export default async function Page() {
  const products = await getProducts()
  return <ProductCarousel products={products} /> // client gets data as props
}
```

### Server Functions with `"use server"`
Define server-only functions callable from client. Must be async. Used for mutations.

```tsx
"use server"
import { requireAuth } from "@/lib/auth/require-auth"

export async function addToCart(productId: string) {
  const user = await requireAuth()
  // ... insert into cart
}
```

---

## DON'T

### Don't use `useEffect` for data fetching
Fetch in Server Components or use server actions. Client-side fetching is a last resort.

### Don't mix server/client logic in one file
A file is either `"use client"` or a Server Component. Don't try to conditional-branch.

### Don't pass non-serializable props to Client Components
Functions, classes, Date objects — these can't cross the server-client boundary as props. Use server actions for callbacks.

```tsx
// ❌ BAD — passing a function from server to client
<ClientComponent onSave={(data) => db.insert(data)} />

// ✅ GOOD — pass a server action reference
<ClientComponent saveAction={saveAction} />
```

### Don't use `useContext` for server data
Context only works in client components. Pass data as props from server, or use server actions.

### Don't wrap everything in `"use client"`
Every `"use client"` adds JS to the bundle. Push client boundaries as low in the tree as possible.

---

## OUR SETUP

- **React 19.2.4** — Server Components default
- **Forms:** `useActionState` + `useFormStatus` + server actions
- **Client components:** Always prop-driven (data fetched server-side, passed down)
- **Hooks:** `react-hook-form` 7.x for complex forms, `useActionState` for simple ones
- **Animations:** `framer-motion` 12.x (sparingly — client-only)
