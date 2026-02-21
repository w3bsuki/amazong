# Manual Audit Findings (Read-the-Code)

Date: 2026-02-20

This report is **manual**: it’s based on reading concrete files and tracing patterns across callsites. It intentionally focuses on **what can realistically be improved** without rewriting the app or touching approval‑gated areas (auth/payments/webhooks/DB).

---

## What I reviewed manually (selected hotspots)

Routing + feature surfaces:

- `app/[locale]/(main)/search/page.tsx`
- `app/[locale]/(main)/search/_lib/search-products.ts`
- `app/[locale]/(main)/categories/[slug]/_components/mobile/product-feed.tsx`
- `app/[locale]/_components/category-browse-drawer.tsx`
- `app/[locale]/(checkout)/_components/checkout-page-layout.tsx`
- `app/[locale]/(account)/account/billing/page.tsx`

Shared UI patterns:

- `components/shared/product/quick-view/product-quick-view-desktop-content.tsx`
- `components/shared/product/quick-view/product-quick-view-mobile-content.tsx`
- `app/[locale]/_components/nav/nav-user.tsx`
- `app/[locale]/(account)/account/_components/account-sidebar.tsx`
- `app/[locale]/(admin)/admin/loading.tsx`
- `app/[locale]/(admin)/admin/products/loading.tsx`
- `app/[locale]/(admin)/admin/sellers/loading.tsx`

State/data layers:

- `components/providers/cart-context.tsx`
- `components/providers/message-context.tsx`
- `lib/data/categories/hierarchy.ts`
- `lib/data/categories/subcategories.ts`
- `lib/data/products/queries.ts`
- `lib/data/products/normalize.ts`
- `lib/types/products.ts`
- `lib/supabase/messages.ts`

---

## Findings (with realistic improvements)

### 1) Search page is doing “data plumbing” that already exists elsewhere

`app/[locale]/(main)/search/page.tsx` manually:

- fetches root + sub categories with raw Supabase queries
- builds rail category structures
- maps raw search results into `ProductGridProduct` inline

But the repo already has optimized + cached category fetchers:

- `lib/data/categories/hierarchy.ts` (`getCategoryHierarchy`, `getCategoryTreeDepth3`)
- `lib/data/categories/subcategories.ts` (`getSubcategoriesForBrowse`, `getSubcategoriesWithCounts`)

Realistic improvement:

- Replace the “rootCats/subCats” Supabase querying in `search/page.tsx` with calls to `lib/data/categories/*`.
- You get: less page LOC, consistent ordering rules, and one place to evolve category depth rules.

Why this matters:

- A page is easier to break when it mixes **UI composition** with **low-level category querying**.

### 2) There are multiple “Product” shapes; unify around `UIProduct`

You currently have at least three representations in play:

- `lib/types/products.ts` → `UIProduct` (already the “view model” shape)
- `lib/data/products/*` → `Product` (DB-ish normalized row) + `toUI(p): UIProduct` in `lib/data/products/normalize.ts`
- Search feature → a separate `Product` type in `app/[locale]/(main)/search/_lib/types` and a custom row-to-product mapping in `app/[locale]/(main)/search/_lib/search-products.ts`

Realistic improvement:

- Make search return `UIProduct[]` by reusing the existing product normalization pipeline:
  - normalize DB row → `Product` (via `lib/data/products/normalize.ts`)
  - then `toUI()` → `UIProduct`
- Then map `UIProduct` → `ProductGridProduct` via a single shared helper (see next finding).

This is one of the only refactors that can **actually reduce meaningful LOC** (because it removes repeated “row mapping” blocks), while also making listing surfaces behave more consistently.

### 3) `ProductGridProduct` mapping is duplicated across listing surfaces

Examples:

- `app/[locale]/(main)/search/page.tsx` builds `gridProducts` inline
- `app/[locale]/(main)/categories/[slug]/_components/mobile/product-feed.tsx` has `mapToGridProduct(product: UIProduct)`
- `app/[locale]/(main)/_components/desktop/use-desktop-home-controller.ts` has its own `toGridProduct(...)`

Realistic improvement:

- Create one canonical mapping function, e.g. `toProductGridProduct(ui: UIProduct): ProductGridProduct`, and reuse it.
- This reduces duplicated field lists (which are brittle and easy to drift).

### 4) UI i18n is inconsistent: some places still hardcode strings via `locale === 'bg' ? ...`

There are legitimate locale checks for **number/date formatting** (that’s fine), but there are also lots of UI copy ternaries embedded in components (example: `app/[locale]/(account)/account/_components/account-sidebar.tsx`).

Realistic improvement:

- Move UI copy ternaries to `next-intl` messages (keep locale-based number/date formatting where needed).
- Result: slimmer components, fewer “bg/en” conditionals, fewer “translate-by-branch” bugs.

This is not “free” (it shifts LOC into JSON), but it materially improves maintainability.

### 5) Styling contract drift exists in a few “utility string” files

Example:

- `components/mobile/chrome/mobile-control-recipes.ts` uses `text-[13px]` in class strings.

That pattern is explicitly forbidden by the design contract (arbitrary Tailwind values). The low-risk fix is to use the semantic token class (`text-compact`) instead.

### 6) Sidebar “user menu” pattern is duplicated

Duplication is obvious between:

- `app/[locale]/_components/nav/nav-user.tsx`
- `app/[locale]/(account)/account/_components/account-sidebar.tsx` (`AccountNavUser`)

Realistic improvement:

- Create one shared component for the “avatar + name + dropdown” chrome that accepts menu items as props.
- This should also remove the odd style drift (semicolons + mega import line) in those files.

### 7) Quick view desktop/mobile has repeatable blocks (price/discount/out-of-stock)

`components/shared/product/quick-view/product-quick-view-*-content.tsx` duplicates:

- price row + original price + discount badge + out-of-stock badge
- condition badge

Realistic improvement:

- Extract shared subcomponents for:
  - price row / discount row
  - condition + shipping badges row
- Keep layout differences (desktop: footer bar; mobile: inline buttons), but stop duplicating the “business rules UI”.

### 8) Loading skeletons repeat the same “dashboard/table skeleton language”

Admin loadings repeat the same structures with small variations:

- `app/[locale]/(admin)/admin/loading.tsx`
- `app/[locale]/(admin)/admin/products/loading.tsx`
- `app/[locale]/(admin)/admin/sellers/loading.tsx`

Realistic improvement:

- Introduce a small set of shared skeleton building blocks (stats cards, table header row, table body rows, pagination).
- Then each route’s `loading.tsx` becomes a short composition file.

### 9) Providers are maintainability hotspots (not necessarily “delete-able”)

Cart:

- `components/providers/cart-context.tsx` mixes:
  - storage parsing/sanitization
  - server RPC sync
  - UI state + totals

Messages:

- `components/providers/message-context.tsx` is already split into internal hooks, but still duplicates “build Message with optional sender profile” logic in multiple places.
- `useTypingIndicator()` is a stub (rate limit only); `isOtherUserTyping` exists as state but doesn’t appear to be driven by realtime events here.

Realistic improvement:

- Keep providers as-is functionally, but collapse repeated transformer logic into one helper per provider (stays in-file if you want fewer files).
- For messages: either implement typing events end-to-end or remove the unused surface area (after verifying no UI depends on it).

---

## Approval-gated areas (audit-only unless you explicitly approve)

Per `AGENTS.md`, do not refactor without explicit approval:

- Auth/session internals (`lib/auth/**`, `components/providers/auth-state-manager.tsx`)
- Payments/webhooks (`app/actions/payments.ts`, `app/actions/boosts.ts`, `app/api/**/webhook/**`, Connect)
- DB schema/migrations/RLS (`supabase/migrations/**`)
