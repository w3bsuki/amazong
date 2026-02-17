# Phase 1 — Agent 1: Components Audit

> **Scope:** Everything under `components/`
> **Read `refactor/shared-rules.md` first.**

---

## Your Folders

```
components/
  ui/           → 36 files (shadcn primitives)
  shared/       → product/, filters/, search/, wishlist/, field.tsx, count-badge.tsx, dropdown-product-item.tsx, user-avatar.tsx
  layout/       → header/ (mobile + desktop), sidebar/
  mobile/       → category-nav/, chrome/, drawers/
  desktop/      → desktop-specific components
  auth/         → auth forms
  providers/    → context providers
  grid/         → grid layout components
  dropdowns/    → dropdown components
```

## How to Work

**For each folder,** read every file. For each file, ask:

1. **Is it used?** Grep for its exports across the entire codebase. Zero imports = dead. Delete it (after verifying — see shared-rules.md).
2. **Does it need `"use client"`?** If it has the directive, check: does it DIRECTLY use `useState`, `useEffect`, `useRef`, `useContext`, event handlers (`onClick`, `onChange`, etc.), browser APIs (`window`, `document`), or `useTranslations()`? If none of these — remove the directive.
3. **Is it in the right place?** A `components/shared/` file used by only 1 route group? Flag for move. A `components/ui/` file with domain logic (supabase calls, business rules)? Flag for move.
4. **Is it too big?** Over 300 lines → identify what can be extracted (types, sub-components, utils).
5. **Is there duplicate logic?** Similar patterns across multiple files → consolidate into a shared util.
6. **Naming?** kebab-case only. No version suffixes, no generic names.
7. **Dead code inside live files?** Commented-out blocks >3 lines, unused functions, unused variables → remove.

## Priority Order

Start with the highest-traffic components (rendered most often):

1. `components/shared/product/` — product cards, displayed on every listing page
2. `components/shared/filters/` — search/filter UI, hot path
3. `components/layout/` — header and sidebar, rendered on every page
4. `components/mobile/` — drawers, nav, chrome (mobile-first app)
5. `components/ui/` — shadcn primitives (many files, usually clean)
6. Everything else: `desktop/`, `auth/`, `providers/`, `grid/`, `dropdowns/`, `shared/` (remaining)

## Special Notes

- `components/ui/` must stay domain-logic-free. If you find supabase imports, data fetching, or business logic — flag it.
- `components/providers/auth-state-manager.tsx` — **DON'T TOUCH** (auth, high-risk). Flag any issues but don't modify.
- `components/shared/` files that import from route-private `app/[locale]/(group)/_components/` are violating architecture boundaries — flag them.
- Many `components/mobile/drawers/` are interaction-heavy (state, animations). They probably legitimately need `"use client"`. Don't force-remove it — but check if any can be split into server wrapper + client island.

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
- Issues flagged (things you found but couldn't safely fix, or cross-scope items)
- `"use client"` directives removed (count)
- Lines of code removed (rough estimate)
