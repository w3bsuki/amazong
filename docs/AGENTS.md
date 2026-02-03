# AGENTS.md — Treido Agent Entry Point (SSOT)

> **Read this first.** Single entry point for humans + AI working in this repo.

| Scope | Agent behavior, project rails, boundaries |
|-------|------------------------------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## ⚡ Start Here

| Need | Go To |
|------|-------|
| How to prompt | [PROMPT-GUIDE.md](./PROMPT-GUIDE.md) |
| All docs index | [00-INDEX.md](./00-INDEX.md) |
| Workflow | [WORKFLOW.md](./WORKFLOW.md) |
| Skills | [11-SKILLS.md](./11-SKILLS.md) |
| Active tasks (optional) | `.codex/TASKS.md` |
| Shipped log (optional) | `.codex/SHIPPED.md` |
| Decisions (optional) | `.codex/DECISIONS.md` |

---

## Project

| Item | Value |
|------|-------|
| Product | Treido — Bulgarian-first marketplace (C2C + B2B/B2C) |
| Goal | Ship production ASAP with clean boundaries and minimal bloat |
| Stack | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase + Stripe + next-intl |

---

## How to Work (V2)

- No prefixes/triggers required — describe the task in plain language.
- Apply skills automatically:
  - **Always**: `treido-rails`
  - UI/routes/i18n: `treido-frontend`
  - server/actions/Supabase/Stripe: `treido-backend`
- Ship in small batches (1–3 files) and run the gates.

---

## Rails (Non-Negotiable)

- [ ] No secrets/PII in logs (server or client)
- [ ] All user-facing strings via `next-intl` (`messages/en.json`, `messages/bg.json`)
- [ ] Tailwind v4 only: no gradients, no arbitrary values, no hardcoded colors (run `pnpm -s styles:gate`)
- [ ] Default to Server Components; add `"use client"` only when required
- [ ] Cached server code must be pure; never use `cookies()`/`headers()` inside cached functions
- [ ] Supabase: no `select('*')` in hot paths; select explicit fields
- [ ] Stripe webhooks are idempotent + signature-verified
- [ ] Small batches (1–3 files), shippable, with verification

---

## Pause Conditions (High Risk)

Stop and ask for explicit human approval before implementing:

- DB schema/migrations/RLS (`supabase/migrations/*`)
- Auth/access control/session changes
- Payments/Stripe/webhooks
- Destructive/bulk data operations
- External integrations

---

## Where Things Go (Boundaries)

| Location | Purpose |
|----------|---------|
| `app/[locale]/(group)/**/_components/*` | Route-private UI |
| `app/[locale]/(group)/**/_actions/*` | Route-private server actions |
| `app/actions/*` | Shared server actions |
| `components/ui/*` | shadcn primitives only (no app logic) |
| `components/shared/*` | Shared composites |
| `components/layout/*` | Header, footer, sidebars |
| `hooks/*` | Reusable hooks |
| `lib/*` | Pure utilities (no React) |

---

## Skills

Skills live in `.codex/skills/`.

| Skill | Purpose |
|-------|---------|
| `treido-rails` | Project rails + verification |
| `treido-frontend` | Frontend rules (Tailwind, shadcn, next-intl, App Router) |
| `treido-backend` | Backend rules (actions, Supabase, Stripe, caching) |
| `codex-iteration` | Maintain the skill system itself |

Legacy skills are kept only for reference under `.codex/skills/.archive/`.

Sync/validate:

```bash
pnpm -s skills:sync
pnpm -s validate:skills
```

---

## MCP Tools

| MCP | Prefix | Use For | Required? |
|-----|--------|---------|-----------|
| Supabase | `mcp__supabase__*` | DB schema, RLS, migrations | Required for DB/RLS work |

---

## Verification Gates

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

---

## Autonomous Behavior

- Default: make reasonable assumptions; note them.
- Pause for: DB migrations, auth changes, payments/Stripe.
- End responses with a clear status (e.g., what changed + what commands were run).

---

*Last updated: 2026-02-03*
