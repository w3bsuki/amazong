# Phase 1 — Agent 3: App Routes Audit

> **Scope:** Everything under `app/`
> **Read `refactor/shared-rules.md` first.**

---

## Your Folders

```
app/
  [locale]/
    (main)/        → Homepage, discovery, search, categories, cart
    (account)/     → User account, orders, settings
    (auth)/        → Login, register, forgot-password
    (sell)/        → Seller dashboard, listing creation, seller orders
    (checkout)/    → Checkout payment flow
    (business)/    → Business/seller onboarding + dashboard
    (chat)/        → Buyer-seller messaging
    (admin)/       → Admin panel
    (plans)/       → Subscription plans
    (onboarding)/  → Post-signup onboarding wizard
    [username]/    → Public seller profiles + product detail pages
    _components/   → Locale-level shared components
    _providers/    → Locale-level providers
    layout.tsx, error.tsx, loading.tsx, not-found.tsx, locale-providers.tsx
  actions/         → Server actions (products, orders, payments, profile, reviews, boosts)
  api/             → Route handlers (webhooks, REST endpoints, health checks)
  global-error.tsx, global-not-found.tsx, globals.css, sitemap.ts, robots.txt
```

## How to Work

**For each route group,** audit the `_components/`, `_actions/`, `_lib/` subdirectories, then the pages themselves.

For each file, ask:

1. **Is it used?** Grep for its exports. Dead route-private components are easy to miss.
2. **Cross-group imports?** A `_components/` file should ONLY be imported within its own route group. Grep for the filename across all of `app/` — if another route group imports it, flag it as a boundary violation.
3. **Does it need `"use client"`?** Same rules as shared-rules.md. Route page components are often thin server wrappers around client components — check if the page itself needs the directive or if it can be server.
4. **Missing `loading.tsx`?** Every route with a `page.tsx` should have a `loading.tsx` (or its parent layout provides one). Check each route directory.
5. **Missing `generateMetadata()`?** Every user-facing page should export `generateMetadata` or static `metadata` for SEO. Check each `page.tsx`.
6. **Is the page too big?** Over 300 lines → extract sub-components into colocated `_components/`.
7. **Naming?** kebab-case. No generic `client.tsx` — rename to `<feature>-client.tsx`. No version suffixes.
8. **Dead code?** Commented-out blocks, unused imports, unused variables.

## Priority Order

Work largest route groups first:

1. `app/[locale]/(main)/` — homepage, search, categories. Biggest route group, most components.
2. `app/[locale]/(sell)/` — sell flow. Complex forms, many client components.
3. `app/[locale]/[username]/` — profiles + PDP. High-traffic pages.
4. `app/[locale]/(account)/` — account/orders. Medium complexity.
5. `app/[locale]/(checkout)/` — ⚠️ contains payment flow. Audit but be careful.
6. `app/[locale]/_components/` + `_providers/` — locale-level shared.
7. `app/actions/` — server actions. Check for dead actions, unused exports.
8. `app/api/` — route handlers. Check for dead endpoints.
9. Everything else: `(auth)`, `(business)`, `(chat)`, `(admin)`, `(plans)`, `(onboarding)`.

## Special Notes

- **DON'T TOUCH** `app/api/checkout/webhook/`, `app/api/payments/webhook/`, `app/api/subscriptions/webhook/`, `app/api/connect/`. These are payment/auth critical paths. Read and flag issues only.
- **DON'T TOUCH** auth flows in `(auth)/` beyond naming/dead-code cleanup. Don't restructure auth logic.
- `app/actions/` that deal with payments (`checkout.ts`, payment-related) — read and flag, don't modify business logic.
- `app/[locale]/locale-providers.tsx` and `app/[locale]/_providers/` — thin context providers. Low risk but don't remove without checking all consumers.
- If you find components in `app/[locale]/_components/` that are only used by one route group — flag for move to that group's `_components/`.
- If you find components in a route group's `_components/` that are used by multiple groups — flag as boundary violation.
- **Create missing `loading.tsx`** files using a minimal skeleton:
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

## Verification

After each route group:
```bash
pnpm -s typecheck && pnpm -s lint
```

After your full scope:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

## Output

When done, report:
- Files modified (and what changed)
- Files deleted (and why — confirmed zero usage)
- Files created (`loading.tsx` additions)
- `"use client"` directives removed (count)
- `generateMetadata` added (count)
- Cross-group boundary violations found (list)
- Issues flagged (payment/auth zones, cross-scope items needing Agent 1 or 2)
- Lines of code removed (rough estimate)
