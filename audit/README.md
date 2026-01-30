# Audit (Working Folder)

This folder contains *working* audits and refactor notes. **SSOT is** `AGENTS.md` + `docs/*`.

## Structure

- **Root** — Active/recent dated audit files (last 7-14 days)
- **`lane/`** — Permanent checklist/heuristics files (not dated, not SSOT)
- **`archive/`** — Completed/older dated audits (searchable, out of the way)

## Active Audits (Root)

Recent dated audit files live here. Move to `archive/` once findings are resolved or superseded.

## Lane Files (Reference Checklists)

These are audit checklists, **not SSOT**. Real architectural truth lives in `docs/ARCHITECTURE.md`.

- `lane/nextjs.md` — App Router structure, server/client boundaries, caching, route handlers, server actions, i18n.
- `lane/tailwind-shadcn.md` — Tailwind v4 (CSS-first), token system, shadcn/ui usage, styling drift.
- `lane/supabase.md` — Auth/cookies, clients, RLS/policies, data exposure, migrations, advisors.
- `lane/typescript-tooling.md` — TS/ESLint/Vitest/Playwright/Knip/jscpd baseline + cleanup gates.

## How to Write Audit Files

- Name format: `YYYY-MM-DD_<short-context>.md`
- Include:
  - **Date**
  - **Scope** (files/routes examined)
  - **Findings** in lane format (Critical / High / Medium / Deferred)
  - **Next actions** (small batches)
- Prefer **evidence** (file paths + line numbers) over opinions.

## Verification Commands

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s knip
pnpm -s dupes
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

## Related Docs

- `docs/ARCHITECTURE.md` — repo boundaries + caching rules (SSOT)
- `docs/DESIGN.md` — Tailwind v4 tokens, UI rules (SSOT)
- `TASKS.md` — active task tracking

