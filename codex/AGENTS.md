# Codex — Treido Refactor Command Center

You are a senior developer executing a full-codebase audit and refactor of **Treido**, a Next.js e-commerce marketplace. Your job is to **delete bloat, consolidate duplicates, fix bad code, and shrink the codebase** while keeping all user-facing behavior identical.

Read this file first. Then pick up any task file in this folder and execute it end-to-end.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.4 |
| React | React + React DOM | 19.2.3 |
| Language | TypeScript (strict) | 5.9.3 |
| Styling | Tailwind CSS v4 + shadcn/ui | 4.1.18 |
| Database | Supabase (Postgres + Auth + Storage) | SSR 0.8.0 |
| Payments | Stripe (Connect + Checkout) | 20.2.0 |
| i18n | next-intl | 4.7.0 |
| Validation | Zod | 4.3.5 |
| Icons | Phosphor Icons + Lucide | — |
| Motion | Framer Motion | 12.27.5 |
| Testing | Vitest (unit) + Playwright (E2E) | — |

---

## Project Structure (What Goes Where)

```
app/                        # Next.js App Router
  [locale]/                 # Locale-scoped routes
    (main)/                 # Public marketplace routes
    (account)/              # Authenticated user account
    (admin)/                # Admin panel
    (auth)/                 # Login/signup
    (business)/             # Seller dashboard
    (chat)/                 # Messaging
    (checkout)/             # Checkout flow
    (onboarding)/           # New user onboarding
    (plans)/                # Subscription plans
    (sell)/                 # Sell form + seller orders
    [username]/             # Public user profiles
    _components/            # Route-group-private components
    _lib/                   # Route-group-private utilities
    _providers/             # Route-group-private providers
    _actions/               # Route-group-private server actions
  actions/                  # Shared server actions
  api/                      # API route handlers

components/
  ui/                       # shadcn/ui PRIMITIVES ONLY (no app imports, no business logic)
  shared/                   # Reusable composites (no direct Supabase/Stripe)
  mobile/                   # Mobile-specific components
  desktop/                  # Desktop-specific components
  layout/                   # Layout shells, header, footer, sidebar
  providers/                # React context providers
  [other folders]           # Domain groupings (auth, category, charts, etc.)

lib/                        # Pure utilities, domain helpers, API clients
  ai/                       # AI SDK configuration
  auth/                     # Auth helpers
  data/                     # Data-fetching functions
  filters/                  # Filter logic
  supabase/                 # Supabase client + selects + types
  types/                    # Shared types
  validation/               # Zod schemas
  view-models/              # Data transformation

hooks/                      # React hooks (client-side)
messages/                   # i18n JSON (en.json, bg.json)
supabase/                   # Migrations, seed, edge functions
scripts/                    # Build/dev/CI scripts
```

---

## Non-Negotiables (DO NOT VIOLATE)

1. **No secrets or PII in logs.** Never log tokens, emails, passwords, or user data.
2. **All user-facing copy via `next-intl`.** No hardcoded English/Bulgarian strings in components.
3. **Tailwind v4 semantic tokens only.** No palette classes (`bg-red-500`), no gradients, no arbitrary values (`[#hex]`), no hardcoded colors.
4. **Server Components by default.** Only use `"use client"` when the component genuinely needs browser APIs, hooks, or event handlers.
5. **Pause on DB/auth/payments.** Do NOT modify Supabase migrations, RLS policies, auth flows, or Stripe webhook logic. Flag these for human review.
6. **`components/ui/` is primitives only.** No imports from `app/`, no business logic, no data fetching.

---

## Verification Gates

Run these after EVERY batch of changes (1-3 files per batch).

### Always run (every batch):

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

### Run when touching business logic, data, or routes:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

### Run periodically (after large refactors):

```bash
pnpm -s knip
pnpm -s dupes
```

If any gate fails, fix the failure before moving to the next batch. Never leave the build broken.

---

## Execution Rules

1. **Work in small batches.** 1-3 files per batch. Run gates after each batch.
2. **Delete aggressively.** If a file is unused, delete it. If two files do the same thing, keep the better one and delete the other. If code is over-engineered, simplify it.
3. **No new features.** This is a cleanup operation. Do not add functionality, only remove or consolidate.
4. **Preserve behavior.** The UI, API responses, auth flows, and payment flows must remain identical after refactor. Same routes, same rendered output, same data shapes.
5. **Commit atomically.** Each batch should be a logical unit that passes all gates.
6. **Use plan mode first.** Before touching files, scan the area thoroughly. Understand what's imported where. Only then delete/refactor.
7. **Trust the tools.** `knip` finds unused code. `jscpd` (via `pnpm -s dupes`) finds duplicates. `styles:gate` catches Tailwind violations. Use them.

---

## Recommended Execution Order

Execute task files in this order to minimize dependency conflicts:

1. **`dead-code.md`** — Remove unused files, dependencies, and artifacts first. Shrinks the surface for all subsequent tasks.
2. **`typescript.md`** — Fix type safety. Clean code is easier to refactor.
3. **`tailwindv4.md`** — Fix styling violations. Must happen before component restructuring.
4. **`shadcn.md`** — Restructure component library. Split/merge/delete components.
5. **`nextjs.md`** — Clean App Router structure. Remove unused routes, consolidate layouts.
6. **`supabase.md`** — Clean data layer. Consolidate selects, fix queries.
7. **`i18n.md`** — Clean translation files. Remove unused keys, fix parity.
8. **`scripts.md`** — Clean tooling. Remove one-off scripts, verify package.json scripts.

---

## Reference Docs (Read When Needed)

These live in `docs/` and provide deeper context:

- `docs/03-ARCHITECTURE.md` — System architecture and boundaries
- `docs/04-DESIGN.md` — Design system and token reference
- `docs/05-ROUTES.md` — Route map and page inventory
- `docs/06-DATABASE.md` — Database schema and RLS policies
- `docs/07-API.md` — API route documentation
- `docs/PROJECT-CLEANUP-MASTER-PLAN.md` — Prior cleanup plan and LOC baselines

---

## Baseline Metrics

As of 2026-02-03 (last measured):

- **Total TS/TSX LOC**: ~134,147
  - `app/`: ~75,706
  - `components/`: ~42,055
  - `lib/`: ~13,604
  - `hooks/`: ~2,782
- **Target**: Reduce by 30-50% while keeping all features working.

---

## What "Done" Looks Like

- All gates pass: `typecheck`, `lint`, `styles:gate`, `test:unit`, `test:e2e:smoke`
- `pnpm -s knip` reports zero unused files/exports/dependencies
- `pnpm -s dupes` reports zero duplicate code blocks (min 10 lines)
- No `any` types, no `@ts-ignore`, no `@ts-nocheck` in runtime code
- No palette classes, gradients, or arbitrary color values in Tailwind
- No hardcoded user-facing strings (all via next-intl)
- `components/ui/` contains only shadcn primitives (no composites, no stories)
- No duplicate/similar-purpose components (e.g., no "homeV2" alongside "home")
- No empty folders, no placeholder pages, no dead routes
- Every file in the repo is either imported by something or is an entrypoint

*Last updated: 2026-02-07*
