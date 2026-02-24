# Codex — Refactor Agent

You are executing a full production-quality refactor of **Treido**, a Next.js 16 marketplace app (React 19, Supabase, Stripe, Tailwind v4, shadcn/ui, next-intl).

---

## Your Mission

Make this codebase exemplary. Clean, fast, correct, minimal. Every file follows best practices. Every pattern is intentional.

---

## How to Work

1. **Read `PLAN.md`** — the master plan. 10 phases, in order.
2. **For each phase**, read the referenced file in `codex/refs/` to load patterns and anti-patterns.
3. **Scan the codebase** for the patterns described. Don't guess — grep, search, read files.
4. **Fix in batches.** Group related changes, apply them, then verify.
5. **After each phase**, run the verification gate:
   ```bash
   pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
   ```
6. **Create a checklist** as you work. Track what you've scanned and what you've fixed. Check items off.
7. **Move to the next phase** only after the current phase's gates pass.

---

## Reference Files

| Phase | Reference |
|-------|-----------|
| 2. Next.js Alignment | `codex/refs/nextjs.md` |
| 3. Tailwind + shadcn | `codex/refs/tailwind-v4.md` + `codex/refs/shadcn.md` |
| 4. Component Architecture | `codex/refs/shadcn.md` + `codex/refs/react-19.md` |
| 5. Supabase Patterns | `codex/refs/supabase.md` |
| 6. Type Safety | `codex/refs/typescript.md` |
| 8. i18n Completeness | `codex/refs/next-intl.md` |

Golden target structure: `codex/GOLDEN-STRUCTURE.md`

---

## Project Context

Read these for project-specific rules (they're short):
- `AGENTS.md` — project identity, conventions, what NOT to do
- `docs/STACK.md` — how each technology is configured

---

## Critical Rules

### STOP — Do Not Touch
- **Database schema / migrations** — flag for human
- **RLS policies** — flag for human
- **Auth session logic** — flag for human (but DO fix `getSession()` → `getUser()`)
- **Stripe webhook handlers** — flag for human
- **Destructive operations** — no deleting data, no force pushes

### Always
- Preserve all existing functionality
- Run gates after each phase
- Use `requireAuth()` in server actions that mutate
- Use semantic tokens only (never palette classes)
- Use `Link`/`redirect` from `@/i18n/routing` (never `next/link`)
- Use `getUser()` (never `getSession()`)

### Naming
- Files: `kebab-case`
- No version suffixes (`-v2`, `-new`, `-old`)
- No generic names (`client.tsx`, `utils.tsx` at route level)

---

## Verification Commands

```bash
# Standard gate (run after every phase)
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit

# Extended checks
pnpm -s architecture:gate    # Boundary enforcement
pnpm -s ts:gate               # Type safety gate
pnpm knip                     # Dead code detection
```

---

## Tools Available

- **Supabase MCP** — for database queries if needed
- **Subagents** — use for parallel work across different directories
- **Deep think / plan mode** — use for complex decisions (component splits, architecture)
- **grep/search** — use extensively to find patterns before fixing them

---

## Success Criteria

When you're done, the codebase should:
- Pass ALL gates with zero warnings
- Have zero `any`, `@ts-ignore`, `@ts-expect-error`
- Have zero palette/arbitrary/gradient classes
- Have zero `console.log` in production code
- Have zero hardcoded user-facing strings
- Have zero `getSession()` calls
- Use correct Supabase client per context
- Use `"use cache"` + `cacheLife()` + `cacheTag()` for all cacheable data
- Have `"use client"` only where genuinely needed
- Be measurably smaller (fewer files, fewer lines) while doing the same thing

Go. Phase 1 first.
