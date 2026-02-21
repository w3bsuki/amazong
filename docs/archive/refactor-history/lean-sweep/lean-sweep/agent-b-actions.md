# Phase B — Server Action Consolidation

> **Scope:** De-bloat server actions. Adopt `requireAuth()`. Split oversized files.
> **Read `refactor/shared-rules.md` first.**
> **Read `lib/auth/require-auth.ts` to understand the existing auth helper.**

---

## The Problem

`app/actions/` has 13 files totaling 5,194 lines. Key issues:

1. **64 manual auth checks** instead of using `requireAuth()` from `lib/auth/require-auth.ts`
2. **`canSellerRateBuyer` duplicated** across `orders.ts` and `buyer-feedback.ts`
3. **Oversized files:** orders.ts (947L), products.ts (828L), username.ts (665L)

## Step 1: Understand `requireAuth()`

Read `lib/auth/require-auth.ts` completely. Understand:
- What it returns (user object + supabase client)
- How it handles errors (throws? returns error?)
- What the calling convention is

## Step 2: Adopt `requireAuth()` in all actions

For each file in `app/actions/`:

**Find the pattern:**
```ts
const supabase = await createClient()
const { data: { user }, error: authError } = await supabase.auth.getUser()
if (authError || !user) return { success: false, error: "Not authenticated" }
```

**Replace with:**
```ts
const { user, supabase } = await requireAuth()
```

Adjust the error handling to match `requireAuth()`'s return/throw pattern.

**Important:**
- Some actions use `createAdminClient()` — these should NOT use `requireAuth()`. They still need auth checks but use the admin client for DB operations.
- Some actions in `_actions/` directories (route-private) may have their own auth patterns. Only change `app/actions/` (shared actions).

## Step 3: Merge `canSellerRateBuyer`

Two implementations exist:
- `app/actions/orders.ts` — takes `orderItemId`, ~68 lines
- `app/actions/buyer-feedback.ts` — takes `orderId`, ~55 lines

**Steps:**
1. Read both implementations completely
2. Create a single shared function in `app/actions/orders.ts` or a new `app/actions/_lib/seller-rating.ts`
3. Make it accept both `orderItemId` and `orderId` (or the most general interface)
4. Update both call sites
5. Delete the duplicate

## Step 4: Split oversized action files

**`app/actions/orders.ts` (947 lines):**
- List all exported functions
- Group by concern: order CRUD, order status updates, rating/feedback, returns
- Extract secondary groups into new files: `order-status.ts`, `order-returns.ts`, etc.
- Keep the primary operations in `orders.ts`

**`app/actions/products.ts` (828 lines):**
- Group: product CRUD, publish/unpublish, bulk operations, image management
- Extract secondary groups

**`app/actions/username.ts` (665 lines):**
- Audit: is this one function or many? Read it.
- If bloated with utilities, extract helpers.

**Splitting rules:**
- Each new file should be 100-300 lines
- All server actions must use `"use server"` at the top
- Update all imports after splitting
- Run typecheck after each split

## Step 5: Standardize error returns

If action files use inconsistent error return shapes, standardize to:
```ts
type ActionResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }
```

Only do this if the pattern is already mostly consistent. Don't refactor return types in actions that have complex existing consumers.

## Verification

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

## Output

Log in `refactor/lean-sweep/extractions.md`:
- Actions converted to `requireAuth()` (count + files)
- `canSellerRateBuyer` merge details
- Files split (old → new files)
- Lines removed (total)
