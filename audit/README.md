# Audit (Working Folder)

This folder contains *working* audits and refactor notes. SSOT lives in `AGENTS.md` + `docs/*`.

If you find older audit/docs elsewhere in the repo, link them from here and mark them as **archived** instead of duplicating content.

## How to use this folder

- Each audit file should be updated with:
  - **Date**
  - **Current state snapshot** (what exists today)
  - **Findings** in the lane format (Critical / High / Deferred)
  - **Next actions** (small batches)
- Prefer **evidence** (file paths + symbols) over opinions.

## Lanes

- `nextjs.md` — App Router structure, server/client boundaries, caching, route handlers, server actions, i18n.
- `tailwind-shadcn.md` — Tailwind v4 (CSS-first), token system, shadcn/ui usage, styling drift.
- `supabase.md` — Auth/cookies, clients, RLS/policies, data exposure, migrations, advisors.
- `typescript-tooling.md` — TS/ESLint/Vitest/Playwright/Knip/jscpd baseline + cleanup gates.

## Repeatable commands (baseline signals)

```bash
pnpm -s styles:scan
pnpm -s knip
pnpm -s dupes
pnpm -s typecheck
pnpm -s lint
pnpm -s test:unit
pnpm -s test:e2e:smoke
```

## Related docs (existing)

These are currently outside `audit/` but contain useful context:

- `docs/ARCHITECTURE.md` — repo boundaries + caching rules
- `CODEBASE_AUDIT_REFACTOR_2026-01-24.md` — broader audit/refactor proposal
- `docs-final/archive/root/TREIDO_AUDIT_2026-01-24.md` — runtime/UX audit (Playwright/Supabase MCP)
- `audit/AUDIT_TAILWIND_SHADCN_TWITTER_THEME_2026-01-24.md` — theming audit (Twitter theme)
