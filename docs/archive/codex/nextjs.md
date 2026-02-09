
> Execution Status: Reference Only
> This playbook is an input reference. Active execution tracking lives in codex/master-refactor-plan.md and codex/phases/*.md.

# Task: Next.js App Router Audit & Refactor

> **Read `codex/AGENTS.md` first.** It contains the project context, folder map, non-negotiables, and verification gates.

## Objective

Clean up the Next.js App Router structure. Delete placeholder/stub routes that don't serve real content. Remove pass-through layouts that add no value. Consolidate duplicate patterns. Enforce Server Component by default. Eliminate over-engineered abstractions in route handlers and server actions.

---

## Phase 1: Route Inventory & Dead Route Audit

### 1.1 Audit Every Route Under `app/[locale]/(main)/`

These are the public marketplace routes. For each, open the `page.tsx` and determine if it renders real content or is a placeholder/stub:

| Route | Folder | Action |
|-------|--------|--------|
| Homepage | `(main)/page.tsx` | Keep — this is the main entry |
| Cart | `(main)/cart/` | Audit — is it functional? |
| Categories | `(main)/categories/` | Keep — core marketplace feature |
| Search | `(main)/search/` | Keep — core feature |
| Wishlist | `(main)/wishlist/` | Audit — is it functional? |
| Messages | `(main)/messages/` | Audit — is `(chat)/` the real messaging? If so, this might be dead |
| Sellers | `(main)/sellers/` | Audit — seller directory |
| Seller Dashboard | `(main)/seller/dashboard/` | Audit — vs `(business)/dashboard/`. Is this a duplicate? |
| Seller Settings | `(main)/seller/settings/` | Audit — vs `(account)/account/selling/`. Duplicate? |
| Gift Cards | `(main)/gift-cards/` | **Likely placeholder.** Read the page. If it shows a "coming soon" or stub UI, delete the route. |
| Registry | `(main)/registry/` | **Likely placeholder.** Read the page. If it shows stub UI, delete the route. |
| Today's Deals | `(main)/todays-deals/` | **Audit.** If it shows real deal listings, keep. If placeholder, delete. |
| Members | `(main)/members/` | **Audit.** What is this? If it's a member directory or membership page, check if functional. |
| About | `(main)/about/` | Keep if real, delete if placeholder. |
| Accessibility | `(main)/accessibility/` | Keep — likely an accessibility statement page. |
| Assistant | `(main)/assistant/` | Audit — AI shopping assistant. Is this functional? |

For `(main)/(legal)/`:
- `cookies/`, `privacy/`, `returns/`, `terms/` — These are legal pages. Keep if they have real content.
- `_components/` — shared legal page components. Keep if used by legal pages.

For `(main)/(support)/`:
- `contact/`, `customer-service/`, `faq/`, `feedback/`, `help/`, `security/` — 6 support routes. Audit each: real content or stubs? For those that are stubs, delete.

### 1.2 Audit Other Route Groups

**`app/[locale]/(admin)/admin/`:**
- Contains: `docs/`, `notes/`, `orders/`, `products/`, `sellers/`, `tasks/`, `users/`
- Verify the admin panel is functional. Delete any admin sub-routes that are stubs.

**`app/[locale]/(plans)/plans/`:**
- Confirm this subscription plans page is functional.

**`app/[locale]/(onboarding)/onboarding/`:**
- Confirm the onboarding flow is functional.

**`app/[locale]/api/onboarding/`:**
- There's an `app/[locale]/api/` folder with just `onboarding/`. This is unusual — locale-scoped API routes. Check if `app/api/` has the canonical version. If duplicated, delete the locale-scoped one.

### 1.3 Duplicate Route Detection

Check for potential route duplication across groups:
- `(main)/seller/dashboard/` vs `(business)/dashboard/` — same dashboard or different?
- `(main)/seller/settings/` vs `(account)/account/selling/` — same settings or different?
- `(main)/messages/` vs `(chat)/chat/` — same messaging or different entry points?

If any of these are duplicates serving the same purpose, delete the redundant one and update all links/redirects.

---

## Phase 2: Layout Audit

### 2.1 Pass-Through Layouts

A pass-through layout is one that only does `setRequestLocale(locale)` and returns `{children}`. These add no value — the locale setting can be done in the parent layout.

Scan every `layout.tsx` under `app/[locale]/`:

```bash
find app/[locale] -name "layout.tsx" -type f
```

For each layout:
1. Read the file.
2. If it ONLY does `setRequestLocale()` + returns `{children}` (with maybe a fragment wrapper), it's a pass-through.
3. Pass-through layouts CAN be deleted IF they don't define parallel route slots (`@modal/`, `@sidebar/`, etc.) or metadata.
4. Check if the layout defines any metadata (`generateMetadata`, `metadata` export). If yes, keep it.
5. Check if the layout has `@modal/` or `@*` subfolders (parallel routes). If yes, keep the layout — it's structurally required.

### 2.2 Empty `_components/`, `_lib/`, `_providers/` Folders

```bash
find app/ -name "_components" -type d -empty
find app/ -name "_lib" -type d -empty
find app/ -name "_providers" -type d -empty
```

Delete all empty private folders. Already confirmed: `app/[locale]/(main)/_components/` is empty — delete it.

### 2.3 Layout Nesting Depth

Check for excessively nested layouts:
```
app/[locale]/layout.tsx
  → app/[locale]/(main)/layout.tsx
    → app/[locale]/(main)/categories/layout.tsx
      → app/[locale]/(main)/categories/[slug]/layout.tsx
```

If inner layouts are pass-throughs, flatten the nesting.

---

## Phase 3: Server vs Client Component Audit

### 3.1 Find Unnecessary Client Components

Search for `"use client"` directives:

```bash
grep -rn '"use client"' --include="*.tsx" --include="*.ts" app/ components/
```

For each Client Component, check:
1. Does it use React hooks (`useState`, `useEffect`, `useRef`, `useContext`, etc.)?
2. Does it use browser-only APIs (`window`, `document`, `navigator`, etc.)?
3. Does it use event handlers (`onClick`, `onChange`, `onSubmit`, etc.)?

If a component has `"use client"` but uses NONE of the above, it should be a Server Component. Remove the directive.

Common false positives:
- Components that import other Client Components but don't themselves need to be client — these CAN be Server Components if they just pass children/props.
- Components that use `className` with dynamic values — this doesn't require `"use client"`.

### 3.2 Client Component Bloat

For Client Components that ARE legitimately client-side, check if they're doing too much:
1. Are they fetching data? Server Components should fetch, Client Components should receive data as props.
2. Are they importing server-only modules? This would cause build errors or bloated bundles.
3. Can they be split into a thin Client shell + Server Component children?

---

## Phase 4: API Route Handler Audit

### 4.1 Inventory All API Routes

```
app/api/
  admin/, assistant/, auth/, badges/, billing/, boost/, categories/,
  checkout/, connect/, health/, orders/, payments/, plans/, products/,
  revalidate/, sales/, seller/, subscriptions/, upload-chat-image/,
  upload-image/, wishlist/
```

For each API route:
1. Read the `route.ts` file.
2. Verify it's actively used (grep for fetch calls to that endpoint).
3. If unused, delete the entire route folder.
4. If used, verify it follows patterns:
   - Validates input with Zod schemas
   - Returns typed responses
   - Uses `lib/api/response-helpers.ts` for cached responses (if applicable)
   - Has proper error handling (no swallowed errors)

### 4.2 Consolidate Response Patterns

Check if route handlers have duplicated cache header logic, JSON response patterns, or error handling. These should use the shared `lib/api/response-helpers.ts` utility.

### 4.3 Upload Routes

Two upload routes: `upload-image/` and `upload-chat-image/`. Check if they can be consolidated into a single upload endpoint with a `type` parameter.

---

## Phase 5: Server Actions Audit

### 5.1 Shared Actions (`app/actions/`)

```
app/actions/
  blocked-users.ts, boosts.ts, buyer-feedback.ts, onboarding.ts, orders.ts,
  payments.ts, products.ts, profile.ts, reviews.ts, seller-feedback.ts,
  seller-follows.ts, subscriptions.ts, username.ts
```

For each action file:
1. Verify every exported function is called somewhere.
2. Delete unused action functions.
3. Check for duplicated logic across action files (e.g., common auth checks, common Supabase patterns).
4. Extract shared patterns into `lib/` utilities if duplicated 3+ times.

### 5.2 Route-Private Actions

Check all `_actions/` folders for:
- `app/[locale]/(sell)/_actions/sell.ts`
- `app/[locale]/(checkout)/_actions/`
- `app/[locale]/(chat)/_actions/`
- `app/[locale]/(auth)/_actions/`

Verify each is only used within its route group. If cross-group usage is found, move to `app/actions/`.

---

## Phase 6: Performance Guard & Debug Files

### 6.1 Debug/Performance Files

- `app/[locale]/(sell)/PerformanceMeasureGuard.tsx` — Read it. If it's a development-only performance measurement tool, delete it. If it provides production value, keep it but ensure it's properly integrated.

### 6.2 Error/Loading/Not-Found Boundaries

Verify every route group that needs error handling has:
- `error.tsx` — Client error boundary
- `loading.tsx` — Loading UI
- `not-found.tsx` (where applicable)

But don't over-add — only routes that users actually navigate to need these. Remove extra error/loading files from routes that inherit them from parent layouts.

---

## Verification

After all changes:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## Completion Criteria

- No placeholder/stub routes — every route renders real, functional content
- No pass-through layouts (unless structurally required for parallel routes or metadata)
- No empty `_components/`, `_lib/`, `_providers/` folders
- No duplicate routes serving the same purpose across route groups
- No unnecessary `"use client"` directives
- No unused API routes or server action functions
- All route handlers validate input and handle errors properly
- All gates pass
