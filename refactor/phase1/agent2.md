# Phase 1 — Agent 2: Lib + Hooks Audit

> **Scope:** Everything under `lib/` and `hooks/`
> **Read `refactor/shared-rules.md` first.**

---

## Your Folders

```
lib/
  ai/              → AI SDK integrations
  api/             → API utilities
  attributes/      → Product attributes
  auth/            → ⚠️ HIGH RISK — read only, flag issues
  badges/          → Badge logic
  boost/           → Boost/promotion logic
  cache/           → Cache utilities
  data/            → Data fetching functions
  filters/         → Filter logic
  navigation/      → Navigation helpers
  next/            → Next.js utilities
  sell/            → Sell flow utilities
  stripe.ts        → ⚠️ HIGH RISK — flag only
  stripe-connect.ts → ⚠️ HIGH RISK — flag only
  stripe-locale.ts → Low risk
  supabase/        → Supabase clients (server, browser, admin, static, route)
  types/           → TypeScript types
  ui/              → UI utilities
  upload/          → File upload logic
  utils/           → General utilities
  validation/      → Zod schemas
  view-models/     → View model transformations
  + ~15 root-level utility files (currency.ts, format-price.ts, etc.)

hooks/
  14 hook files (use-badges.ts, use-is-mobile.ts, use-product-search.ts, etc.)
```

## How to Work

**For each file,** ask:

1. **Is it used?** Grep for its filename and exports across the entire codebase. Zero imports = dead → delete.
2. **Does it belong in `lib/`?** Files in `lib/` must be framework-agnostic — no React imports (`useState`, `useEffect`, `createContext`, `'react'`). If a file imports React, it belongs in `hooks/` or `components/`. Flag or move it.
3. **Is there duplicate logic?** Multiple files doing similar things (e.g., `format-price.ts` + `price-formatting.ts` + `currency.ts` — are all needed? Do they overlap?). Consolidate.
4. **Are all exports used?** A file might be imported, but not all its exports are. Check each exported function/type — unused exports are dead weight. Remove them.
5. **Is it too big?** Over 300 lines → split into focused modules. Types into `types.ts`, utils into separate files.
6. **Does the naming make sense?** kebab-case, descriptive. No generic names like `utils.ts` with everything dumped in.
7. **Dead code inside live files?** Commented-out blocks, unused variables, unused functions → remove.

## Priority Order

1. `lib/data/` — data fetching functions. Check for duplicate queries, unused fetchers, `select('*')`.
2. Root `lib/` files — high variety, likely some overlap/dead files.
3. `lib/utils/` + `lib/utils.ts` — utility dumping ground. Check for dead exports, consolidation opportunities.
4. `lib/types/` — unused types, duplicate type definitions.
5. `lib/validation/` — unused schemas.
6. `hooks/` — are all 14 hooks actually used? Check each one.
7. Everything else: `ai/`, `api/`, `attributes/`, `badges/`, `boost/`, `cache/`, `filters/`, `navigation/`, `next/`, `sell/`, `ui/`, `upload/`, `view-models/`.

## Special Notes

- `lib/auth/` — **DON'T TOUCH.** Read it, flag issues, but don't modify.
- `lib/stripe.ts`, `lib/stripe-connect.ts` — **DON'T TOUCH.** Payments are high-risk.
- `lib/supabase/` — **DON'T TOUCH the client factories** (`server.ts`, `client.ts`, `admin.ts`, `static.ts`, `route.ts`). You can audit files that USE these clients, but don't modify the client creation logic.
- `lib/supabase/database.types.ts` — auto-generated. **NEVER MODIFY.**
- If you find `lib/` files that import from `app/` — that's a boundary violation. Flag it.
- `hooks/` should only contain hooks used by 2+ route groups. If a hook is only used by one route group, flag it for move to that route's `_lib/` or `_components/`.
- Run `pnpm -s knip` at the start of your scope — it's configured to find unused deps, exports, and files. Use its output as a starting point, then go deeper.

## Verification

After each folder:
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
- Exports removed (count)
- Duplicate logic consolidated (what merged into what)
- Issues flagged (high-risk zones, cross-scope items, boundary violations)
- Lines of code removed (rough estimate)
