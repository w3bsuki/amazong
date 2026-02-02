# AGENTS.md — Treido Agent Entry Point (SSOT)

> **Read this first.** Single entry point for humans + AI agents working in this repo.

| Scope | Agent behavior, project rails, boundaries |
|-------|------------------------------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## ⚡ Start Here

| Need | Go To |
|------|-------|
| **How to prompt AI** | [PROMPT-GUIDE.md](./PROMPT-GUIDE.md) |
| **All docs index** | [00-INDEX.md](./00-INDEX.md) |
| **Workflow phases** | [WORKFLOW.md](./WORKFLOW.md) |
| **Production push plan** | [13-PRODUCTION-PUSH.md](./13-PRODUCTION-PUSH.md) |
| **Active tasks** | `.codex/TASKS.md` |
| **Shipped work** | `.codex/SHIPPED.md` |
| **Decisions log** | `.codex/DECISIONS.md` |

---

## Project

| Item | Value |
|------|-------|
| **Product** | Treido — Bulgarian-first marketplace (C2C + B2B/B2C) |
| **Goal** | Ship production ASAP with clean boundaries and minimal bloat |
| **Stack** | Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase (RLS/Auth/Storage) + Stripe (Checkout + Connect) + next-intl |

---

## 🚦 Work Routing (Docs → Skills → Verify)

| Work Type | Docs to Follow | Audit Skills | Executor | Verify |
|-----------|----------------|--------------|----------|--------|
| **UI/Styling** | [04-DESIGN](./04-DESIGN.md) | `spec-tailwind` + `spec-shadcn` | `treido-ui` | `styles:gate` |
| **Components** | [04-DESIGN](./04-DESIGN.md), [03-ARCH](./03-ARCHITECTURE.md) | `spec-tailwind` + `spec-shadcn` | `treido-frontend` | All gates |
| **Pages/Routes** | [05-ROUTES](./05-ROUTES.md), [03-ARCH](./03-ARCHITECTURE.md) | `spec-nextjs` | `treido-frontend` | All gates |
| **Server Actions** | [07-API](./07-API.md) | `spec-nextjs` + `spec-supabase` | `treido-backend` | Gates + Unit |
| **Webhooks** | [08-PAYMENTS](./08-PAYMENTS.md) | `spec-supabase` | `treido-backend` | Gates + Unit |
| **Database/RLS** | [06-DATABASE](./06-DATABASE.md) | `spec-supabase` | `treido-backend` | RLS tests |
| **Auth** | [09-AUTH](./09-AUTH.md) | `spec-supabase` + `spec-nextjs` | `treido-backend` | E2E |
| **i18n** | [10-I18N](./10-I18N.md) | — | `treido-frontend` | All gates |
| **Full Audit** | [00-INDEX](./00-INDEX.md) | ALL specialists | Both lanes | All |

---

## Quick Start

```bash
pnpm install
pnpm dev
```

Gates:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

---

## Rails (Non-Negotiable)

- [ ] No secrets/PII in logs (server or client)
- [ ] All user-facing strings via `next-intl` (`messages/en.json`, `messages/bg.json`)
- [ ] Tailwind v4 only: no gradients, no arbitrary values, no hardcoded colors (run `pnpm -s styles:gate`)
- [ ] Default to Server Components; add `"use client"` only when required
- [ ] Cached server code: always `cacheLife()` + `cacheTag()`; never use `cookies()`/`headers()` inside cached functions
- [ ] Supabase: no `select('*')` in hot paths; project fields
- [ ] Stripe webhooks are idempotent + signature-verified
- [ ] Small batches (1–3 files), shippable, with verification
- [ ] No new animations (keep UX stable and fast)

---

## Do NOT

| Action | Why |
|--------|-----|
| Add new features without PRD/FEATURES update | Scope creep |
| Log secrets/PII | Security |
| Hardcode user-facing strings | i18n compliance |
| Use gradients/arbitrary Tailwind | Design system violation |
| Import route-private code across groups | Boundary violation |
| Read `cookies()`/`headers()` in cached functions | ISR storms |

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
| `components/providers/*` | Context providers |
| `hooks/*` | Reusable hooks |
| `lib/*` | Pure utilities (no React) |

---

## Agent Routing

| Work Type | Agent | MCP Tools | Scope |
|-----------|-------|-----------|-------|
| Frontend UI/styling | `treido-frontend` | — | components, Tailwind, shadcn |
| Design/UX | `treido-ui` | mcp__shadcn__* | pixel-perfect UI |
| Frontend audit | `spec-tailwind` + `spec-shadcn` | — | token drift |
| Data alignment | `treido-alignment` | mcp__supabase__* | contract gaps |
| Next.js/RSC/caching | `spec-nextjs` → `treido-frontend` | — | App Router |
| Backend/webhooks | `treido-backend` | mcp__supabase__* | server actions, Stripe |
| Database/RLS | `spec-supabase` → `treido-backend` | mcp__supabase__* | schema, migrations |
| Full audit | `ORCH:` | all | everything |
| Verification | `treido-verify` | — | gates, tests |

---

## MCP Tools

| MCP | Prefix | Use For | Required? |
|-----|--------|---------|-----------|
| Supabase | `mcp__supabase__*` | DB schema, RLS, migrations | **Required** for DB work |
| Codex | `mcp__codex__*` | Cross-agent discussion | Optional |
| Next.js | `mcp__next-devtools__*` | Framework docs | Optional |
| shadcn | `mcp__shadcn__*` | Component registry | Optional |

**Preflight**: Before DB/RLS work, verify `mcp__supabase__*` tools available.

---

## Skills

Skills are vendored in `.codex/skills/`. Sync/validate:

```bash
pnpm -s skills:sync
pnpm -s validate:skills
```

### Executor Skills (AUDIT + IMPL)

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `treido-orchestrator` | `ORCH:` | Coordinates workflow |
| `treido-frontend` | `FRONTEND:` | UI/routing |
| `treido-backend` | `BACKEND:` | Server actions/DB |
| `treido-ui` | `UI:` / `DESIGN:` | Pixel-perfect design |
| `treido-alignment` | `ALIGNMENT:AUDIT` | Contract gaps |
| `treido-verify` | `VERIFY:` | Gates + tests |

### Specialist Skills (AUDIT-ONLY)

| Skill | Trigger | Domain |
|-------|---------|--------|
| `spec-nextjs` | `SPEC-NEXTJS:AUDIT` | App Router, caching |
| `spec-tailwind` | `SPEC-TAILWIND:AUDIT` | Tailwind v4 tokens |
| `spec-shadcn` | `SPEC-SHADCN:AUDIT` | shadcn boundaries |
| `spec-supabase` | `SPEC-SUPABASE:AUDIT` | RLS, queries |
| `spec-typescript` | `SPEC-TYPESCRIPT:AUDIT` | Type safety |

---

## Bundle Matrix

| User Intent | Bundle | Audit Lanes | Executor |
|-------------|--------|-------------|----------|
| "fix styling" | UI | `spec-tailwind` + `spec-shadcn` | `treido-frontend` |
| "design", "pixel-perfect" | Design | `spec-tailwind` + `spec-shadcn` | `treido-ui` |
| "missing data" | Alignment | `treido-alignment` | Both lanes |
| "routing", "RSC" | Next.js | `spec-nextjs` | `treido-frontend` |
| "backend", "webhook" | Backend | `spec-nextjs` + `spec-supabase` | `treido-backend` |
| "RLS", "schema" | Supabase | `spec-supabase` | `treido-backend` |
| "full audit" | Full | ALL | Both |

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

Weekly:

```bash
pnpm -s knip
pnpm -s dupes
```

---

## Operational Docs

| Resource | Location | Purpose |
|----------|----------|---------|
| Workflow spec | [WORKFLOW.md](./WORKFLOW.md) | How agents coordinate |
| Active tasks | `.codex/TASKS.md` | Current work queue |
| Shipped log | `.codex/SHIPPED.md` | Completed work |
| Decisions | `.codex/DECISIONS.md` | ADR log |
| Skill definitions | `.codex/skills/` | Full skill specs |
| Debate thread | `.codex/CONVERSATION.md` | Active discussion |

---

## Autonomous Behavior

- **Default**: Do not ask for confirmation. Make reasonable assumptions; note them.
- **Pause for**: DB migrations, auth changes, payments/Stripe.
- **End with**: `DONE` (no review prompt needed).

---

*Last updated: 2026-02-01*
