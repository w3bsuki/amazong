# REACT 19 REFACTOR TASKS

**Goal**: 100% clean React 19 codebase. Zero tech debt. Zero over-engineering. Only best practices.

---

## EXECUTIVE SUMMARY

### Current State (AUDIT FINDINGS)
- ✅ Already using `useActionState` in auth forms (login, signup, forgot-password)
- ✅ Already using `useFormStatus` for pending states
- ✅ Using `useTransition` + `startTransition` pattern in ~20 components
- ❌ 20+ components still use manual `isLoading` state pattern
- ❌ 6+ components use `forwardRef` (can be removed in React 19)
- ❌ 100+ `"use client"` directives - many unnecessary
- ❌ No `useOptimistic` usage anywhere
- ❌ Many forms use manual `onSubmit` + `e.preventDefault()` instead of `action` prop

### React 19 Key Changes
1. **`ref` is a regular prop** - `forwardRef` no longer needed
2. **`useActionState`** - replaces `useFormState`
3. **`useFormStatus`** - built-in pending state
4. **`useOptimistic`** - optimistic UI updates
5. **`use()` hook** - conditional context/promise reading
6. **Form `action` prop** - native form handling

---

## PHASE 1: REMOVE FORWARDREF (React 19 Compatibility)

**Why**: In React 19, `ref` is a regular prop. `forwardRef` is unnecessary wrapper complexity.

### Files to Refactor

| File | Priority | Notes |
|------|----------|-------|
| `components/ui/toast.tsx` | HIGH | 6 forwardRef usages (ToastViewport, Toast, ToastAction, ToastClose, ToastTitle, ToastDescription) |
| `components/ui/carousel-scroll-button.tsx` | MEDIUM | Single forwardRef |
| `components/shared/product/product-card.tsx` | HIGH | forwardRef on ProductCard |
| `components/mobile/mobile-menu-sheet.tsx` | LOW | Uses useImperativeHandle - KEEP forwardRef (legit use) |
| `components/common/wishlist/wishlist-drawer.tsx` | LOW | Uses useImperativeHandle - KEEP forwardRef (legit use) |
| `app/[locale]/(sell)/_components/ui/category-picker/category-option.tsx` | MEDIUM | Single forwardRef |

### Pattern Change

```tsx
// ❌ OLD (React 18)
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return <button ref={ref} className={className} {...props} />
  }
)
Button.displayName = "Button"

// ✅ NEW (React 19)
function Button({ className, ref, ...props }: ButtonProps & { ref?: React.Ref<HTMLButtonElement> }) {
  return <button ref={ref} className={className} {...props} />
}
```

### Exceptions (KEEP forwardRef)
- Components using `useImperativeHandle` (MobileMenuSheet, WishlistDrawer)
- Radix UI wrappers that genuinely need ref forwarding to primitives

---

## PHASE 2: FORM HANDLING MODERNIZATION

### Priority 1: Convert Manual `onSubmit` to `action` Prop

**Pattern to find**: `onSubmit={handleSubmit}` or `onSubmit={(e) => { e.preventDefault(); ...`

| File | Current Pattern | Action |
|------|-----------------|--------|
| `components/shared/coming-soon-page.tsx` | `onSubmit={handleSubmit}` + `e.preventDefault()` | Convert to `action` |
| `components/support/support-chat-widget.tsx` | `e.preventDefault()` | Convert to server action |
| `components/seller/seller-rate-buyer-actions.tsx` | `onSubmit={handleSubmitRating}` | Convert to `action` |
| `components/buyer/buyer-order-actions.tsx` | `onSubmit={handleSubmitRating}` | Convert to `action` |
| `components/shared/product/product-buy-box.tsx` | `form.handleSubmit(onSubmit)` | Evaluate: RHF may stay |
| `app/[locale]/(sell)/_components/sell-form-unified.tsx` | Complex RHF form | KEEP RHF (complex validation) |
| `app/[locale]/(auth)/auth/reset-password/reset-password-client.tsx` | `form.handleSubmit(onSubmit)` | Convert to `useActionState` |
| `app/[locale]/(account)/account/profile/profile-content.tsx` | `handleProfileUpdate` | Convert to `action` |

### Priority 2: Replace Manual `isLoading` State

**Pattern to find**: `const [isLoading, setIsLoading] = useState(false)`

This is over-engineering. React 19 provides `isPending` from `useTransition` or `useActionState`.

| File | Component | Replace With |
|------|-----------|--------------|
| `hooks/use-categories-cache.ts` | Hook | Keep (data fetch, not form) |
| `hooks/use-badges.ts` | Hook | Keep (data fetch, not form) |
| `components/support/support-chat-widget.tsx` | Chat | `useTransition` |
| `components/seller/seller-rate-buyer-actions.tsx` | Rating | `useFormStatus` |
| `components/sections/newest-listings-section.tsx` | Tab loading | `useTransition` |
| `components/sections/tabbed-product-feed.tsx` | Tab loading | `useTransition` |
| `components/sections/category-carousel-client.tsx` | Fetch | `useTransition` |
| `components/providers/wishlist-context.tsx` | Context | Keep (context state) |
| `components/providers/message-context.tsx` | Context | Keep (context state) |
| `components/orders/order-status-actions.tsx` | Actions | `useActionState` |
| `components/mobile/mobile-home-tabs.tsx` | Tabs | `useTransition` |
| `components/dropdowns/notifications-dropdown.tsx` | Notifications | `useTransition` |
| `components/buyer/buyer-order-actions.tsx` | Actions | `useActionState` |
| `app/[locale]/(auth)/_components/welcome-client.tsx` | Welcome | `useTransition` |
| `app/[locale]/(sell)/_components/fields/attributes-field.tsx` | Form field | Already uses useTransition |
| `app/[locale]/(sell)/sell/orders/client.tsx` | Orders | `useTransition` |
| `app/[locale]/(main)/wishlist/shared/[token]/add-all-to-cart.tsx` | Cart | `useTransition` |
| `app/[locale]/(account)/account/security/security-content.tsx` | Security | `useActionState` |
| `app/[locale]/(account)/account/wishlist/_components/share-wishlist-button.tsx` | Share | `useTransition` |

### Pattern Change

```tsx
// ❌ OLD: Manual loading state
const [isLoading, setIsLoading] = useState(false)
const handleSubmit = async () => {
  setIsLoading(true)
  try {
    await doSomething()
  } finally {
    setIsLoading(false)
  }
}

// ✅ NEW: useTransition
const [isPending, startTransition] = useTransition()
const handleSubmit = () => {
  startTransition(async () => {
    await doSomething()
  })
}

// ✅ NEW: useActionState (for forms)
const [state, action, isPending] = useActionState(serverAction, initialState)
```

---

## PHASE 3: ADD `useOptimistic` WHERE BENEFICIAL

### Candidates for Optimistic Updates

| Feature | File | Benefit |
|---------|------|---------|
| Wishlist toggle | `components/providers/wishlist-context.tsx` | Instant heart fill/unfill |
| Cart add/remove | `components/providers/cart-context.tsx` | Instant cart count update |
| Follow seller | `components/seller/follow-seller-button.tsx` | Instant button state |
| Rating submit | `components/seller/seller-rate-buyer-actions.tsx` | Instant star display |
| Order status | `components/orders/order-status-actions.tsx` | Instant status badge |

### Pattern

```tsx
// ✅ Optimistic wishlist toggle
const [optimisticWishlist, addOptimistic] = useOptimistic(
  wishlist,
  (state, productId: string) => {
    const isIn = state.some(p => p.id === productId)
    return isIn 
      ? state.filter(p => p.id !== productId)
      : [...state, { id: productId, pending: true }]
  }
)

async function toggleWishlist(productId: string) {
  addOptimistic(productId)
  await serverToggleWishlist(productId)
}
```

---

## PHASE 4: REDUCE `"use client"` SURFACE

### Over-Engineered Client Components

Many components have `"use client"` at the top but could be:
1. **Server Components** (no state, no effects, no browser APIs)
2. **Split** into Server wrapper + small Client leaf

### UI Components That DON'T Need "use client"

These are pure render components without state/effects:

| File | Reason | Action |
|------|--------|--------|
| `components/ui/badge.tsx` | Pure render, no state | Remove directive |
| `components/ui/separator.tsx` | Pure render | Remove directive |
| `components/ui/breadcrumb.tsx` | Pure render (all subcomponents) | Remove directive |
| `components/ui/label.tsx` | Pure render | Evaluate Radix |
| `components/ui/button.tsx` | Pure render (Slot is client) | Keep (asChild needs Slot) |
| `components/shared/trust-bar.tsx` | Check if pure | Evaluate |

### Components That SHOULD Be Split

Large client components that could have server parts:

| File | Server Part | Client Part |
|------|-------------|-------------|
| `components/shared/product/product-card.tsx` | Product display, pricing | Wishlist button, cart button |
| `components/shared/search/search-filters.tsx` | Filter layout | Filter interactions |
| `components/navigation/category-subheader.tsx` | Category display | Hover/click handlers |
| `components/dropdowns/notifications-dropdown.tsx` | Notification list | Mark read button |

### Pattern: Server Wrapper + Client Leaf

```tsx
// product-card.tsx (SERVER)
import { ProductCardActions } from "./product-card-actions"

async function ProductCard({ id, title, price, image }) {
  return (
    <div>
      <Image src={image} alt={title} />
      <h3>{title}</h3>
      <p>{formatPrice(price)}</p>
      <ProductCardActions id={id} /> {/* Client leaf */}
    </div>
  )
}

// product-card-actions.tsx (CLIENT)
"use client"
function ProductCardActions({ id }) {
  const { addToCart } = useCart()
  const { toggleWishlist } = useWishlist()
  // ...
}
```

---

## PHASE 5: CONTEXT CLEANUP

### Current Context Usage

| Context | File | Issue |
|---------|------|-------|
| CartContext | `components/providers/cart-context.tsx` | OK - needs client state |
| WishlistContext | `components/providers/wishlist-context.tsx` | OK - needs client state |
| MessageContext | `components/providers/message-context.tsx` | OK - needs client state |
| ThemeProvider | `components/providers/theme-provider.tsx` | OK - next-themes wrapper |
| AuthStateListener | `components/providers/auth-state-listener.tsx` | OK - Supabase listener |

### React 19 `use()` Opportunities

```tsx
// ✅ Conditional context reading (React 19)
function Component({ showCart }) {
  if (showCart) {
    const cart = use(CartContext) // Allowed in React 19!
    return <CartDisplay items={cart.items} />
  }
  return null
}
```

---

## PHASE 6: CLEANUP DEPRECATED PROPS

### ProductCard Deprecated Props

```tsx
// Remove these from ProductCardProps interface:
/** @deprecated Use originalPrice */
listPrice?: number | null
/** @deprecated Use username */
storeSlug?: string | null
/** @deprecated No longer used */
showPills?: boolean
/** @deprecated No longer used */
showMetaPills?: boolean
/** @deprecated No longer used */
showExtraPills?: boolean
/** @deprecated No longer used */
showSellerRow?: boolean
/** @deprecated No longer used */
cardStyle?: "default" | "marketplace"
/** @deprecated Use state="promoted" */
isBoosted?: boolean
```

### Action
1. Find all usages of deprecated props
2. Update call sites
3. Remove from interface
4. Remove handling code

---

## PHASE 7: REACT-HOOK-FORM EVALUATION

### Where RHF is Justified (KEEP)
- `app/[locale]/(sell)/_components/sell-form-unified.tsx` - Complex multi-step form
- `app/[locale]/(business)/_components/product-form-modal.tsx` - Complex validation
- `components/shared/product/product-buy-box.tsx` - Variant selection logic

### Where RHF is Overkill (CONSIDER REMOVING)
- `app/[locale]/(auth)/auth/reset-password/reset-password-client.tsx` - Simple form, use `useActionState`
- Single-field forms

### Pattern for Simple Forms

```tsx
// ❌ Over-engineered
const form = useForm<{ email: string }>({
  resolver: zodResolver(schema),
})

// ✅ React 19 native
const [state, action] = useActionState(serverAction, null)
<form action={action}>
  <input name="email" required />
  {state?.error && <p>{state.error}</p>}
</form>
```

---

## IMPLEMENTATION ORDER

### Sprint 1: Foundation (Days 1-2)
1. [ ] Remove `forwardRef` from `toast.tsx` (6 components)
2. [ ] Remove `forwardRef` from `carousel-scroll-button.tsx`
3. [ ] Remove `forwardRef` from `product-card.tsx`
4. [ ] Remove `forwardRef` from `category-option.tsx`
5. [ ] Verify builds, run tests

### Sprint 2: Form Modernization (Days 3-5)
1. [ ] Convert `coming-soon-page.tsx` to `action` prop
2. [ ] Convert `seller-rate-buyer-actions.tsx` to `useActionState`
3. [ ] Convert `buyer-order-actions.tsx` to `useActionState`
4. [ ] Convert `order-status-actions.tsx` to `useActionState`
5. [ ] Convert `reset-password-client.tsx` to `useActionState`
6. [ ] Convert `profile-content.tsx` to `useActionState`

### Sprint 3: Replace Manual Loading States (Days 6-8)
1. [ ] Audit each `isLoading, setIsLoading` usage
2. [ ] Replace with `useTransition` where applicable
3. [ ] Replace with `useFormStatus` for form buttons
4. [ ] Test all loading states

### Sprint 4: Optimistic Updates (Days 9-10)
1. [ ] Add `useOptimistic` to wishlist toggle
2. [ ] Add `useOptimistic` to cart operations
3. [ ] Add `useOptimistic` to follow seller
4. [ ] Test rollback behavior on errors

### Sprint 5: Client Component Reduction (Days 11-14)
1. [ ] Audit all `"use client"` directives
2. [ ] Remove from pure render components
3. [ ] Split large client components
4. [ ] Create server wrappers with client leaves
5. [ ] Benchmark bundle size improvement

### Sprint 6: Cleanup (Days 15-16)
1. [ ] Remove deprecated ProductCard props
2. [ ] Remove unused code paths
3. [ ] Update types
4. [ ] Final audit

---

## VALIDATION CHECKLIST

### Per Component
- [ ] No `forwardRef` unless using `useImperativeHandle`
- [ ] No manual `isLoading` state for form submissions
- [ ] No `onSubmit` + `e.preventDefault()` pattern
- [ ] `"use client"` only where truly needed
- [ ] No deprecated prop handling

### Global
- [ ] TypeScript strict mode passes
- [ ] All E2E tests pass
- [ ] Bundle size improved (target: -15%)
- [ ] Lighthouse performance score ≥ 90
- [ ] No React warnings in console

---

## ANTI-PATTERNS REFERENCE

### ❌ Don't Do This

```tsx
// Manual loading state
const [isLoading, setIsLoading] = useState(false)

// forwardRef when not needed
const Button = React.forwardRef((props, ref) => ...)

// onSubmit with preventDefault
<form onSubmit={(e) => { e.preventDefault(); handle() }}>

// "use client" on pure render components
"use client"
function Badge({ children }) { return <span>{children}</span> }

// useEffect for server-fetchable data
useEffect(() => { fetch('/api/data').then(...) }, [])
```

### ✅ Do This Instead

```tsx
// useTransition for async operations
const [isPending, startTransition] = useTransition()

// ref as regular prop (React 19)
function Button({ ref, ...props }) { return <button ref={ref} {...props} /> }

// form action prop
<form action={serverAction}>

// Server component by default (no directive)
function Badge({ children }) { return <span>{children}</span> }

// Server component with await
async function ProductList() {
  const products = await fetchProducts()
  return <ul>{products.map(...)}</ul>
}
```

---

## SUCCESS METRICS

| Metric | Current | Target |
|--------|---------|--------|
| `forwardRef` usages | 6 | 2 (only useImperativeHandle) |
| Manual `isLoading` state | 20+ | 5 (only for non-form use) |
| `onSubmit` + `preventDefault` | 15+ | 0 |
| `"use client"` components | 100+ | 60 |
| Bundle size (JS) | TBD | -15% |
| useOptimistic usages | 0 | 5+ |

---

## NOTES

### react-hook-form Coexistence
RHF is fine for complex forms with many fields, conditional validation, array fields, etc.
For simple forms (1-3 fields), native React 19 patterns are cleaner.

### Radix UI Components
Most `ui/*.tsx` files wrap Radix primitives. Radix needs `"use client"` internally.
However, many wrappers are pure render and don't need it themselves.

### Testing After Changes
Run full test suite after each sprint:
```bash
pnpm test:e2e
pnpm -s exec tsc --noEmit
```
