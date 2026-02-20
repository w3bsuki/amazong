# shadcn/ui Audit + Refactor

> **For Codex CLI.** Audit and tighten `components/ui/*` primitives.
> Focus: primitive purity, variant consistency (CVA), accessibility basics, and dead component cleanup.
> **Does NOT touch:** DB/migrations/RLS, auth/session logic, payments/webhooks. Avoid UI/UX changes unless required by gates.

---

## Prerequisites

1. Read `AGENTS.md` — `components/ui/` must stay primitive-only.
2. Read `docs/STACK.md` — shadcn conventions + key deps.
3. Read `docs/DESIGN.md` — token contract, motion, touch targets.
4. Read `docs/DECISIONS.md` — enforcement rationale (mechanical gates).
5. Read `refactor/shared-rules.md` — batch discipline + deletion rules.

Optional: fetch latest shadcn guidance via Context7 if available.

---

## Phase 1: AUDIT (read-only — use subagents for bulk discovery)

Catalog:
- `components/ui/*` that contain domain logic (fetching, app/ imports, business rules)
- Cross-layer import violations (ui importing app/ or route-private code)
- Variant issues (CVA definitions, inconsistent `variant`/`size` naming)
- Accessibility gaps in primitives (aria labels, keyboard behavior, focus-visible styling)
- Duplicated primitives (multiple button/badge/etc patterns)
- Dead/unreferenced ui components (verify with grep before deletion)

Output: findings list grouped by component.

---

## Phase 2: PLAN

Propose safe batches with file counts:
- **Batch A:** move domain logic out of `components/ui/` (no UI behavior change)
- **Batch B:** variant/type cleanup (CVA, prop typing) without changing classes
- **Batch C:** delete dead ui primitives (only after zero-usage proof)

---

## Phase 3: EXECUTE

After each batch:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

Rules:
- Pixel + behavior parity.
- No palette/arbitrary/token-alpha usage.
- Respect route-private boundaries.

---

## Phase 4: REPORT

After execution, generate `refactor/shadcn-audit-report.md`:

```markdown
# shadcn/ui Audit + Refactor — Report

Completed: YYYY-MM-DD

## Findings
[Grouped list]

## Changes Made
[Categorized list]

## What Was NOT Changed (and why)
[Risky items]

## Recommendations
[Follow-ups]
```

