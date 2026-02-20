# next-intl (i18n) Audit + Refactor

> **For Codex CLI.** Audit next-intl usage (en/bg), locale routing, and navigation import conventions.
> Focus: key parity, routing helpers, `setRequestLocale()` coverage, and dead translation cleanup.
> **Does NOT touch:** DB/migrations/RLS, auth/session logic, payments/webhooks. Avoid UI/UX copy changes unless required.

---

## Prerequisites

1. Read `AGENTS.md` — `Link`/`redirect` must come from `@/i18n/routing`.
2. Read `docs/STACK.md` — next-intl setup and file locations.
3. Read `docs/DECISIONS.md` — enforcement rationale.
4. Read `refactor/shared-rules.md` — batch discipline.

Optional: fetch latest next-intl guidance via Context7 if available.

---

## Phase 1: AUDIT (read-only)

Catalog:
- Key parity: `messages/en.json` vs `messages/bg.json`
- Unused keys (document; delete only if safe and not relied on dynamically)
- Missing `setRequestLocale(locale)` in Server Component pages/layouts
- Navigation imports:
  - No `next/link` usage
  - Use `Link`/`redirect` from `@/i18n/routing`
  - Prefer `usePathname`/`useRouter` from `@/i18n/routing` where applicable

Output: findings grouped by category.

---

## Phase 2: PLAN

Propose safe batches with file counts:
- **Batch A:** navigation import cleanup (mechanical)
- **Batch B:** missing `setRequestLocale` additions (Server Components only)
- **Batch C:** unused message key cleanup (only with strong evidence)

---

## Phase 3: EXECUTE

After each batch:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Phase 4: REPORT

After execution, generate `refactor/intl-audit-report.md`:

```markdown
# next-intl Audit + Refactor — Report

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

