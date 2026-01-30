# AGENTS.md — Treido Marketplace (SSOT)

Read this first. This file is the **single entry point** for humans + AI agents working in this repo.

## Project

- Product: **Treido** — Bulgarian-first marketplace (C2C + B2B/B2C), eBay/Vinted meets StockX
- Goal: ship production ASAP with clean boundaries and minimal bloat
- Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase (RLS/Auth/Storage) + Stripe (Checkout + Connect) + next-intl

## Quick Start

```bash
pnpm install
pnpm dev
```

Common gates:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

## Canonical Docs (SSOT)

Only these docs define “how the project works”. If something conflicts with them, it’s wrong/outdated.

- `docs/PRD.md` — what Treido is + launch scope
- `docs/FEATURES.md` — feature checklist (✅/🚧/⬜) + route map
- `docs/ARCHITECTURE.md` — module boundaries, caching, Supabase, Stripe, i18n
- `docs/DESIGN.md` — Tailwind v4 + shadcn tokens, UI rules, forbidden patterns

## Rails (Non‑Negotiable)

- [ ] No secrets/PII in logs (server or client)
- [ ] All user-facing strings via `next-intl` (`messages/en.json`, `messages/bg.json`)
- [ ] Tailwind v4 only: no gradients, no arbitrary values, no hardcoded colors (run `pnpm -s styles:gate`)
- [ ] Default to Server Components; add `"use client"` only when required
- [ ] Cached server code: always `cacheLife()` + `cacheTag()`; never use `cookies()`/`headers()` inside cached functions
- [ ] Supabase: no `select('*')` in hot paths; project fields
- [ ] Stripe webhooks are idempotent + signature-verified
- [ ] Small batches (1–3 files), shippable, with verification
- [ ] No new animations (keep UX stable and fast)

## Do NOT

- Don’t add new features (scope creep) unless PRD/FEATURES updated first.
- Don’t log secrets/PII (server or client).
- Don’t ship hardcoded user-facing strings (always use `next-intl`).
- Don’t use gradients, arbitrary Tailwind values, or hardcoded colors (run `pnpm -s styles:gate`).
- Don’t import route-private code across route groups.
- Don’t read `cookies()`/`headers()` inside cached (`'use cache'`) functions.

## Where Things Go (Boundaries)

- `app/[locale]/(group)/**/_components/*` route-private UI
- `app/[locale]/(group)/**/_actions/*` route-private server actions
- `app/actions/*` shared server actions
- `components/ui/*` shadcn primitives only (no app logic/hooks)
- `components/shared/*` shared composites (cards, blocks, forms)
- `components/layout/*` shells (header, footer, sidebars)
- `components/providers/*` thin providers/contexts
- `hooks/*` reusable hooks
- `lib/*` pure utilities/clients/domain helpers (no React)

## Skills (Codex CLI)

Codex loads skills from `$CODEX_HOME/skills` (default: `%USERPROFILE%\\.codex\\skills` on Windows, `$HOME/.codex/skills` on macOS/Linux).

This repo vendors project-scoped skills under `.codex/skills/`. Treat repo skills as the source of truth and sync them into `$CODEX_HOME/skills` when needed.

Core Treido skills (repo) — new system:
- `treido-orchestrator` (trigger: `ORCH:`)
- `treido-impl-frontend` (trigger: `FE-IMPL:`)
- `treido-impl-backend` (trigger: `BE-IMPL:`)
- `treido-verify` (trigger: `VERIFY:`)

Auditor skills (repo, read-only; payload contract):
- `treido-audit-nextjs` (trigger: `NEXTJS-AUDIT:`)
- `treido-audit-tw4` (trigger: `TW4-AUDIT:`)
- `treido-audit-shadcn` (trigger: `SHADCN-AUDIT:`)
- `treido-audit-supabase` (trigger: `SUPABASE-AUDIT:`)
- `treido-audit-typescript` (trigger: `TS-AUDIT:`)

Legacy skills (deprecated; kept for reference):
- `treido-frontend`, `treido-backend`, `treido-audit`, `treido-tailwind-v4`, `treido-shadcn`, `treido-designer`, `treido-supabase-mcp`

Suggested flow:
- Start: `ORCH:` selects a bundle (UI/Backend/Supabase/Full) and spawns auditors in parallel
- Merge: orchestrator writes one merged audit file under `audit/`
- Plan: orchestrator writes prioritized tasks into `TASKS.md`
- Execute: `treido-impl-frontend` / `treido-impl-backend` patches code in 1–3 file batches
- Verify/Test: `treido-verify` runs gates and risk-based tests

References (repo):
- Audit payload contract: `.codex/skills/treido-orchestrator/references/audit-payload.md`
- Workflow example: `.codex/skills/treido-orchestrator/references/workflow-example.md`
- Legacy references: `.codex/skills/treido-frontend/references/nextjs.md`, `.codex/skills/treido-frontend/references/tailwind.md`, `.codex/skills/treido-frontend/references/shadcn.md`

Opus <-> Codex debate loop (repo):
- `.codex/CONVERSATION.md` (single active thread; keep short; includes "Current State" header)
- `.codex/DECISIONS.md` (append-only decisions log)

Usage: mention the skill name in your request, or use the trigger prefixes defined in each SKILL.md.

Operational conventions:
- End task completions with a handoff signal: `OPUS: review?` or `DONE (no review needed)`.

If skills are missing, install them into `$CODEX_HOME/skills` before starting a session. You can also run `pnpm -s validate:skills` to validate both repo + user skill folders.

## Verification Gates (Run Often)

Always:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Conditional:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

Weekly + before deploy + cleanup batches:

```bash
pnpm -s knip
pnpm -s dupes
```

## Docs Hygiene

- Do not create new Markdown files unless explicitly requested by the human.
  - Prefer updating existing SSOT docs (`AGENTS.md`, `TASKS.md`, `docs/*`) over adding new files.
  - Exception: script-generated reports under `cleanup/` are allowed.
- SSOT docs live in `docs/` (linked above).
- Working audits belong in `audit/` (dated files, lane format).
- Refactor workplans belong in `refactor/` (indexes + file maps).
- Business/legal/public docs belong in `docs-site/` (do not mix with engineering docs).
- Keep docs modular (≤500 lines each). If a doc grows, split it and update this file.
