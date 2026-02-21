# React 19 Full Audit + Refactor

> **For Codex CLI.** A focused React 19 alignment pass.
> Covers: Server/Client boundary hygiene, hook patterns, context/provider discipline, `ref` patterns, and form patterns.
> **Does NOT touch:** DB/migrations/RLS, auth/session/access control logic, payments/webhooks/Stripe internals.

---

## Prerequisites

1. Read `AGENTS.md` — constraints + conventions.
2. Read `docs/STACK.md` — especially React 19 + Next.js App Router sections.
3. Read `docs/DESIGN.md` — UI + component organization contract (pixel/behavior parity).
4. Read `docs/DECISIONS.md` — why patterns exist.
5. Read `refactor/shared-rules.md` — mandatory refactor rules.
6. Fetch latest React 19 guidance via Context7:
   - `resolve-library-id` → `query-docs` for **React** (React 19 refs-as-prop, hooks guidance, context, forms/actions)

---

## Current Codebase Snapshot (baseline: 2026-02-20)

| Metric | Value |
|--------|-------|
| React version | 19.2.3 |
| `"use client"` directives | 214 |
| `forwardRef` usage (ts/tsx files) | 2 files |
| Context creation (`createContext`) | 12 files |
| Files using `useMemo` | 75 |
| Files using `useCallback` | 81 |
| Forms | react-hook-form + Zod, plus React 19 Actions in auth flows |

---

## Phase 1: AUDIT (read-only — use subagents for bulk discovery)

Launch subagents in parallel and catalog findings (no code edits in this phase):

### Audit 1A: Client Islands
- List all `"use client"` files, group by directory.
- Flag candidates where the directive exists only due to unnecessary hooks or wrapper modules.
- Identify split-island opportunities (Server wrapper + thin Client leaf).

### Audit 1B: Contexts & Providers
- Inventory every context/provider: path, purpose, what state it owns, and who consumes it.
- Flag provider bloat (big contexts with many unrelated fields) and unstable provider values (non-memoized objects/functions).

### Audit 1C: Hooks Hygiene
- Identify `useMemo`/`useCallback` usage that is unnecessary or incorrectly dependency-scoped.
- Prefer clarity and correctness; memoization only when it measurably reduces re-renders or stabilizes props for memoized children/context values.

### Audit 1D: `ref` Patterns
- Catalog `forwardRef` usage and decide whether to migrate to React 19 `ref`-as-prop.
- Ensure TypeScript typing remains correct and ref behavior remains identical.

### Audit 1E: Forms
- Catalog react-hook-form + Zod patterns and any usage of React 19 Actions (`useActionState`, `useFormStatus`).
- **Auth forms / `lib/auth/**` are audit-only** unless explicit human approval is provided.

---

## Phase 2: PLAN

Synthesize audit findings into safe, testable batches. Each batch should include an estimated file count.

**Priority 1 — Safe mechanical wins**
- Remove redundant `"use client"` directives (wrapper modules, unnecessary hook usage).
- Remove unnecessary `useMemo` / `useCallback` and simplify dependency arrays.

**Priority 2 — React 19 alignment**
- Replace `forwardRef` wrappers with `ref` as a prop where safe (per React 19 guidance).

**Priority 3 — Context discipline**
- Stabilize provider values (`useMemo`/`useCallback` where warranted).
- Split/merge contexts only when behavior can remain identical and blast radius is small.

---

## Phase 3: EXECUTE

Work through batches in priority order. After each batch, run:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Rules:
- Pixel + behavior parity (no UX changes).
- Grep before deleting any file/export.
- Stop and ask before touching: DB schema/migrations/RLS, auth/session/access control, payments/webhooks.

---

## Phase 4: REPORT

After execution, generate `refactor/react-audit-report.md`:

```markdown
# React 19 Audit + Refactor — Report

Completed: YYYY-MM-DD

## Metrics: Before → After
| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| "use client" directives | 214 | ? | ? |
| forwardRef (ts/tsx files) | 2 | ? | ? |
| createContext (files) | 12 | ? | ? |
| Files using useMemo | 75 | ? | ? |
| Files using useCallback | 81 | ? | ? |

## Changes Made
[Categorized list of all changes]

## What Was NOT Changed (and why)
[Items found in audit but skipped due to constraints/risk]

## Recommendations
[Follow-ups for later tasks]
```

---

## Verification (final)

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
pnpm -s architecture:scan
```

