# Shared Rules — All Agents

> Read this BEFORE your agent task. These rules are non-negotiable.

---

## Verification (After Every Change)

```bash
# After modifying a file:
pnpm -s typecheck

# After completing a folder:
pnpm -s typecheck && pnpm -s lint

# After completing your full scope:
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Before Deleting Anything

1. **Grep for usage** — zero results means safe to delete:
   ```bash
   grep -rn "filename-or-export" --include="*.ts" --include="*.tsx" --include="*.mjs" --include="*.css" .
   ```
2. **Next.js magic files are NEVER dead:** `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `sitemap.ts`, `template.tsx`, `default.tsx`
3. **Test-only imports are NOT dead** — if a file is only imported by tests, keep it.
4. **Verify typecheck after deletion** — broken imports = you deleted something used.

---

## DO

- Remove unnecessary `"use client"` — default to Server Components
- Rename non-kebab-case files (no version suffixes, no temp names, no generic `client.tsx`)
- Move misplaced files to correct architectural location
- Consolidate duplicate logic into shared utilities
- Remove commented-out code blocks (>3 lines) — they live in git
- Split files over 300 lines into focused modules
- Remove unused imports, exports, variables, functions

## DON'T

- Touch DB schema, migrations, or RLS policies (`supabase/`)
- Touch auth/session/access control logic (`lib/auth/`, `components/providers/auth-state-manager.tsx`)
- Touch payment/webhook/billing code (Stripe webhooks, Connect)
- Create new features — audit + refactor only
- Delete files without verifying zero usage via grep
- Remove `"use client"` from components that genuinely use hooks/handlers/browser APIs
- Break the existing i18n setup
- Modify test assertions (fix broken imports only)

## STOP AND FLAG (document, don't modify)

- Any file in `supabase/`, Stripe webhook routes, Connect routes
- Auth logic in `lib/auth/`, `components/providers/auth-state-manager.tsx`
- Stripe secrets or webhook signature verification
- Anything that could break payments or auth

---

## Architecture Boundaries

```
components/ui/         → shadcn primitives ONLY (no domain logic, no data fetching)
components/shared/     → shared composites (used by 2+ route groups)
components/layout/     → shells (header, sidebar, footer)
components/providers/  → thin React contexts
components/mobile/     → mobile-specific components
components/desktop/    → desktop-specific components
components/auth/       → auth forms

app/[locale]/(group)/_components/  → route-private (NEVER import across groups)
app/[locale]/(group)/_actions/     → route-private server actions
app/[locale]/(group)/_lib/         → route-private utilities

lib/                   → framework-agnostic (NO React imports, NO app/ imports)
hooks/                 → shared React hooks (used by 2+ route groups)
```

**Placement checks:**
- Route-private `_components/` file imported by another route group? → Move to `components/shared/`
- `components/shared/` file only used by one route group? → Move to that route's `_components/`
- File in `lib/` that imports React? → Move to `hooks/` or `components/`
- File in `components/ui/` with domain logic? → Move to `components/shared/`

## Naming Standards

| Type | Pattern | Example |
|------|---------|---------|
| Components | `kebab-case.tsx` | `product-card.tsx` |
| Hooks | `use-<name>.ts` | `use-is-mobile.ts` |
| Utilities | `kebab-case.ts` | `format-price.ts` |
| Server actions | `kebab-case.ts` in `_actions/` | `checkout.ts` |
| Types | `kebab-case.ts` in `lib/types/` | `product.ts` |

**Forbidden:** version suffixes (`home-v4.tsx`), temp names (`sidebar-old.tsx`), generic names (`client.tsx` → rename to `<feature>-client.tsx`).

## Styling

- Semantic tokens only: `bg-background`, `text-foreground`, `border-border`, `bg-primary`
- Forbidden: palette classes (`bg-gray-100`), raw hex (`#fff`), arbitrary values (`w-[560px]`)
- Enforced by: `pnpm -s styles:gate`

---

## Project Context

For full project identity, stack, conventions → read root `AGENTS.md`.
For refactor history, known bloat signals → read root `REFACTOR.md` (read-only).
