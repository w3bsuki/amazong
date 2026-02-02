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

- `docs/00-INDEX.md` — docs hub (start here)
- `docs/01-PRD.md` — what Treido is + launch scope
- `docs/02-FEATURES.md` — feature checklist (✅/🚧/⬜) + route map
- `docs/03-ARCHITECTURE.md` — module boundaries, caching, Supabase, Stripe, i18n
- `docs/04-DESIGN.md` — Tailwind v4 + shadcn tokens, UI rules, forbidden patterns
- `docs/13-PRODUCTION-PUSH.md` — production push plan (phases + SSOT links)

## Agent Workflow (Operations SSOT)

- `WORKFLOW.md` — roles, phases, output contracts, verification policy
- `.codex/TASKS.md` — active task queue (SSOT)

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

## Agent Routing (Quick Reference)

| Work Type | Agent | MCP Tools | Scope |
|-----------|-------|-----------|-------|
| Frontend UI/styling | `treido-frontend` | — | components, Tailwind, shadcn |
| Design/UX implementation | `treido-ui` | mcp__shadcn__* | pixel-perfect UI, modern design, lovable.dev quality |
| Frontend audit | `spec-tailwind` + `spec-shadcn` | — | token drift, boundary violations |
| Data alignment audit | `treido-alignment` | mcp__supabase__* | frontend/backend/DB contract gaps |
| Next.js/RSC/caching | `spec-nextjs` → `treido-frontend` | Next.js MCP (if available) | App Router, boundaries, caching |
| Backend/webhooks | `treido-backend` | `mcp__supabase__*` | server actions, route handlers, Stripe |
| Database/RLS/policies | `spec-supabase` → `treido-backend` | `mcp__supabase__*` **(required)** | schema, migrations, RLS |
| Full audit | `ORCH:` spawns all | all available | everything |
| Verification | `treido-verify` | — | gates, tests |

### Subagent Pattern

Orchestrator can spawn subagents for parallel work:
- Each subagent gets **fresh context** + **tight scope** (specific files/questions)
- Subagents return **structured recommendations** (not patches)
- **Orchestrator applies patches centrally** (avoids merge conflicts)
- Use for: parallel audits, splitting large task lists, domain-specific deep dives

## MCP Tools (Available)

| MCP | Tool Prefix | Use For | Required? |
|-----|-------------|---------|----------|
| Supabase | `mcp__supabase__*` | DB schema, RLS, migrations, policies, advisors | **Required** for DB work |
| Codex | `mcp__codex__*` | Cross-agent discussion, verification | Optional |
| Next.js | `mcp__next-devtools__*` | Framework questions, docs | Optional (if configured) |
| shadcn | `mcp__shadcn__*` | Component registry, examples | Optional (if configured) |

**Preflight Rule**: Before DB/RLS work, verify `mcp__supabase__*` tools are available. If not, STOP and notify user.

## Skills (Codex CLI)

Codex loads skills from `$CODEX_HOME/skills` (default: `%USERPROFILE%\\.codex\\skills` on Windows, `$HOME/.codex/skills` on macOS/Linux).

This repo vendors project-scoped skills under `.codex/skills/`. Treat repo skills as the source of truth and sync them into `$CODEX_HOME/skills` when needed.

Sync (recommended after pulling changes):

```bash
pnpm -s skills:sync
pnpm -s validate:skills
```

### Executor Skills (Repo) — AUDIT + IMPL

- `treido-orchestrator` (trigger: `ORCH:`) — coordinates workflow phases
- `treido-frontend` (trigger: `FRONTEND:`; modes: `AUDIT:` / `IMPL:`) — owns UI/routing changes
- `treido-backend` (trigger: `BACKEND:`; modes: `AUDIT:` / `IMPL:`) — owns server actions/DB changes
- `treido-ui` (trigger: `UI:` or `DESIGN:`) — pixel-perfect design implementation (lovable.dev quality)
- `treido-alignment` (trigger: `ALIGNMENT:AUDIT`) — frontend/backend/DB data contract auditor
- `treido-verify` (trigger: `VERIFY:`) — runs gates + tests

### Specialist Skills (Repo) — AUDIT-ONLY

Deep domain auditors. Read-only; no file patches; output structured payloads only.

- `spec-nextjs` (trigger: `SPEC-NEXTJS:AUDIT`) — Next.js 16 App Router (RSC, caching, routing, server actions)
- `spec-tailwind` (trigger: `SPEC-TAILWIND:AUDIT`) — Tailwind v4 (tokens, forbidden patterns, Treido rails)
- `spec-shadcn` (trigger: `SPEC-SHADCN:AUDIT`) — shadcn/ui (primitives, composition, boundaries)
- `spec-supabase` (trigger: `SPEC-SUPABASE:AUDIT`) — Supabase (RLS, queries, auth, migrations)
- `spec-typescript` (trigger: `SPEC-TYPESCRIPT:AUDIT`) — TypeScript (strictness, unsafe patterns, boundary-safe types)
Trigger convention (specialists): start the request with `SPEC-<DOMAIN>:AUDIT`, followed by optional context blocks.

- Goal/context: <1–2 sentences>
- Scope hints:
  - Files: <3–12 paths>
  - Routes/tables: <optional>

### Workflow

1. **Start**: `ORCH:` selects a bundle (UI/Next.js/Backend/Supabase/Full) and spawns specialists in parallel
2. **Audit**: Specialists run read-only analysis; return structured payloads
3. **Merge**: Orchestrator writes one merged audit file under `.codex/audit/`
4. **Plan**: Orchestrator writes prioritized tasks into `.codex/TASKS.md`
5. **Execute**: `treido-frontend` / `treido-backend` patches code in 1–3 file batches
6. **Verify/Test**: `treido-verify` runs gates and risk-based tests

### Bundle Matrix

| User intent | Bundle | Specialists (AUDIT) | Executor (IMPL) |
|---|---|---|---|
| "fix styling", "UI looks off" | UI | `spec-tailwind` + `spec-shadcn` | `treido-frontend` |
| "design", "pixel-perfect", "modern UI" | Design | `spec-tailwind` + `spec-shadcn` | `treido-ui` |
| "missing data", "frontend/backend gap" | Alignment | `treido-alignment` | `treido-frontend` + `treido-backend` |
| "routing", "RSC", "caching" | Next.js | `spec-nextjs` | `treido-frontend` |
| "backend issue", "webhook" | Backend | `spec-nextjs` + `spec-supabase` | `treido-backend` |
| "database", "RLS", "policies" | Supabase | `spec-supabase` | `treido-backend` |
| "full audit", "what's wrong" | Full | ALL specialists | Both executors |

References (repo):
- Audit payload contract: `.codex/skills/treido-orchestrator/references/audit-payload.md`
- Workflow example: `.codex/skills/treido-orchestrator/references/workflow-example.md`
- Skill reference indices:
  - `.codex/skills/treido-orchestrator/references/00-index.md`
  - `.codex/skills/treido-frontend/references/00-index.md`
  - `.codex/skills/treido-backend/references/00-index.md`
  - `.codex/skills/treido-verify/references/00-index.md`

Opus <-> Codex debate loop (repo):
- `.codex/CONVERSATION.md` (single active thread; keep short; includes "Current State" header)
- `.codex/DECISIONS.md` (append-only decisions log)

Usage: mention the skill name in your request, or use the trigger prefixes defined in each SKILL.md.

Operational conventions:
- **Autonomous by default**: Do not ask for confirmation. Pick scope from TASKS.md Ready items. Make reasonable assumptions; note them in the report.
- End task completions with: `DONE` (no review prompt needed).
- Only pause for: DB schema/migrations, auth/access control, payments/Stripe.

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
  - Prefer updating existing SSOT docs (`docs/*`, `.codex/TASKS.md`) over adding new files.
  - Exception: script-generated reports under `cleanup/` are allowed.
- SSOT docs live in `docs/` (start at `docs/00-INDEX.md`).
- `.codex/project/*` is deprecated and may contain only thin pointers for backward compatibility.
- Working audits belong in `.codex/audit/` (dated files, lane format).
- Historical planning snapshots belong in `docs/archive/`.
- Business/legal/public docs belong in `docs-site/` (do not mix with engineering docs).
- Keep docs modular (≤500 lines each). If a doc grows, split it and update this file.
