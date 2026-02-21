# TypeScript 5.9 Full Audit + Refactor

> **For Codex CLI.** A focused TypeScript 5.9 + strictness alignment pass.
> Covers: `any` elimination, unsafe casts, unused type exports, return-type consistency, Zod boundary typing.
> **Does NOT touch:** DB/migrations/RLS, auth/session/access control logic, payments/webhooks/Stripe internals.

---

## Prerequisites

1. Read `AGENTS.md` — constraints + conventions.
2. Read `docs/STACK.md` — TS 5.9 config + strictness knobs.
3. Read `docs/DECISIONS.md` — why enforcement exists (security + boundaries).
4. Read `refactor/shared-rules.md` — mandatory rules for refactor work.
5. Fetch latest TypeScript guidance via Context7 (optional but recommended):
   - `resolve-library-id` → `query-docs` for **TypeScript** (`exactOptionalPropertyTypes`, narrowing, satisfies, type guards, inference patterns).

---

## Phase 1: AUDIT (read-only — use subagents for bulk discovery)

Catalog:
- `any` usage (`: any`, `as any`, `any[]`, `Record<string, any>`)
- Unsafe casts (`as Something` without runtime guards)
- `@ts-ignore` / `@ts-expect-error` usage
- Return type inconsistencies (implicit `any` returns, mixed unions, missing exhaustiveness)
- Zod boundary gaps (forms/actions/api inputs missing schema parse)

Output: a structured list of findings grouped by folder (`app/`, `components/`, `hooks/`, `lib/`).

---

## Phase 2: PLAN

Propose safe batches with file counts:
- **Batch A:** remove obvious unused types/exports and dead generics
- **Batch B:** replace `any` with concrete types in low-risk UI code
- **Batch C:** replace unsafe casts with type guards / parsing at boundaries
- **Batch D:** align Zod schemas with inferred types at boundaries (non-auth/non-payments only)

---

## Phase 3: EXECUTE

After each batch:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Rules:
- Pixel + behavior parity (no UX changes).
- Avoid auth/payment-sensitive internals unless explicitly approved.
- Prefer small, mechanical, verifiable refactors.

---

## Phase 4: REPORT

After execution, generate `refactor/typescript-audit-report.md`:

```markdown
# TypeScript 5.9 Audit + Refactor — Report

Completed: YYYY-MM-DD

## Metrics: Before → After
| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| any count (occurrences) | ? | ? | ? |
| @ts-ignore / @ts-expect-error | ? | ? | ? |

## Changes Made
[Categorized list]

## What Was NOT Changed (and why)
[Auth/payments/DB-sensitive or risky items]

## Recommendations
[Follow-ups]
```

