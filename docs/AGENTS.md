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

## How to Work (V4)

- No prefixes/triggers required — describe the task in plain language.
- Apply specialist skills as needed:
  - **Always**: `treido-rails`
  - UI/UX + mobile feel: `treido-design`, `treido-ui-ux-pro-max`, `treido-mobile-ux`, `treido-accessibility`
  - Frontend stack: `treido-nextjs-16`, `treido-tailwind-v4`, `treido-tailwind-v4-shadcn`, `treido-shadcn-ui`, `treido-i18n`
  - Backend stack: `treido-supabase`, `treido-auth-supabase`, `treido-stripe`
  - Testing: `treido-testing`
  - File placement: `treido-structure`
  - Skill maintenance: `treido-skillsmith`
- Ship in small batches (1–3 files) and verify via `docs/WORKFLOW.md`.

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
| `treido-rails` | Non-negotiables + pause conditions |
| `treido-structure` | File placement + boundaries |
| `treido-nextjs-16` | App Router + caching + request conventions |
| `treido-tailwind-v4` | Tailwind v4 tokens + forbidden patterns |
| `treido-tailwind-v4-shadcn` | Tailwind v4 + shadcn integration gotchas |
| `treido-shadcn-ui` | `components/ui/*` boundaries + composition |
| `treido-design` | UI/UX design specs + polish |
| `treido-ui-ux-pro-max` | Deep UI/UX guidance + patterns |
| `treido-mobile-ux` | Mobile touch + safe areas + iOS feel |
| `treido-accessibility` | WCAG 2.2 + ARIA patterns |
| `treido-i18n` | next-intl copy + locale hygiene |
| `treido-supabase` | Supabase SSR + queries + RLS mindset |
| `treido-auth-supabase` | Auth/session patterns (Supabase + Next.js) |
| `treido-stripe` | Stripe webhooks + payment safety |
| `treido-testing` | Playwright E2E + deflaking |
| `treido-skillsmith` | Maintain the skill system |

Validate: `pnpm -s validate:skills`

---

## MCP Tools

| MCP | Prefix | Use For | Required? |
|-----|--------|---------|-----------|
| Supabase | `mcp__supabase__*` | DB schema, RLS, migrations | Required for DB/RLS work |

---

## Verification Gates

See `docs/WORKFLOW.md` for the current gate checklist and commands.

---

## Autonomous Behavior

- Default: make reasonable assumptions; note them.
- Pause for: DB migrations, auth changes, payments/Stripe.
- End responses with a clear status (e.g., what changed + what commands were run).

---

*Last updated: 2026-02-03*
