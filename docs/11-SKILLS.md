# 11-SKILLS.md — AI Agent Skills Reference

> **Agent skill system** for the Treido project. Documents all Codex CLI skills, triggers, and workflow.

| Scope | AI agent automation |
|-------|---------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## Skill → Doc → Verify Matrix

| Skill | Must Read Docs | Verify With |
|-------|----------------|-------------|
| `treido-ui` | [04-DESIGN](./04-DESIGN.md) | `styles:gate` |
| `treido-frontend` | [04-DESIGN](./04-DESIGN.md), [03-ARCHITECTURE](./03-ARCHITECTURE.md), [05-ROUTES](./05-ROUTES.md) | All gates |
| `treido-backend` | [06-DATABASE](./06-DATABASE.md), [07-API](./07-API.md), [08-PAYMENTS](./08-PAYMENTS.md) | Gates + Unit |
| `spec-tailwind` | [04-DESIGN](./04-DESIGN.md) | `styles:gate` |
| `spec-shadcn` | [04-DESIGN](./04-DESIGN.md) | `lint` |
| `spec-nextjs` | [03-ARCHITECTURE](./03-ARCHITECTURE.md) | `typecheck` |
| `spec-supabase` | [06-DATABASE](./06-DATABASE.md) | RLS tests |

---

## Quick Reference

| Trigger | Skill | Mode | Use For |
|---------|-------|------|---------|
| `ORCH:` | treido-orchestrator | FULL | Coordinate full workflow |
| `FRONTEND:` | treido-frontend | AUDIT/IMPL | UI/routing changes |
| `BACKEND:` | treido-backend | AUDIT/IMPL | Server actions, webhooks, DB |
| `UI:` / `DESIGN:` | treido-ui | IMPL | Premium UI implementation |
| `ALIGNMENT:AUDIT` | treido-alignment | AUDIT | Data contract gaps |
| `VERIFY:` | treido-verify | READ | Run gates/tests |
| `ITERATION:` | codex-iteration | AUDIT/IMPL | Skill system maintenance |
| `SPEC-NEXTJS:AUDIT` | spec-nextjs | AUDIT | App Router, caching |
| `SPEC-TAILWIND:AUDIT` | spec-tailwind | AUDIT | Token enforcement |
| `SPEC-SHADCN:AUDIT` | spec-shadcn | AUDIT | Primitive boundaries |
| `SPEC-SUPABASE:AUDIT` | spec-supabase | AUDIT | RLS, queries, auth |
| `SPEC-TYPESCRIPT:AUDIT` | spec-typescript | AUDIT | Type safety |

---

## Executor Skills (AUDIT + IMPL)

| Skill | Trigger | Purpose | Writes |
|-------|---------|---------|--------|
| **treido-orchestrator** | `ORCH:` | Central coordinator — spawns audits, merges, plans, delegates | `.codex/audit/*`, `.codex/TASKS.md` |
| **treido-frontend** | `FRONTEND:` | UI/routing lane — Tailwind tokens, shadcn, next-intl | Application code |
| **treido-backend** | `BACKEND:` | Server lane — actions, webhooks, Supabase, Stripe | `app/actions/*`, `app/api/*`, `lib/*` |
| **treido-ui** | `UI:` / `DESIGN:` | Premium design — lovable.dev quality, visual hierarchy | UI components |
| **treido-alignment** | `ALIGNMENT:AUDIT` | Contract auditor — schema/backend/frontend gaps | Nothing (audit-only) |
| **treido-verify** | `VERIFY:` | QA runner — gates, risk-based tests | Nothing (read-only) |
| **codex-iteration** | `ITERATION:` | Meta-skill — maintain skill system itself | `.codex/skills/*` |

---

## Specialist Skills (AUDIT-ONLY)

Read-only domain auditors. No file patches; return structured payloads only.

| Skill | Trigger | Domain | Output IDs | Dependencies |
|-------|---------|--------|------------|--------------|
| **spec-nextjs** | `SPEC-NEXTJS:AUDIT` | App Router, RSC, caching | `NEXTJS-001`... | — |
| **spec-tailwind** | `SPEC-TAILWIND:AUDIT` | Tailwind v4 tokens | `TW4-001`... | `app/globals.css` |
| **spec-shadcn** | `SPEC-SHADCN:AUDIT` | shadcn/ui boundaries | `SHADCN-001`... | `components.json` |
| **spec-supabase** | `SPEC-SUPABASE:AUDIT` | RLS, queries, auth | `SUPABASE-001`... | Supabase MCP |
| **spec-typescript** | `SPEC-TYPESCRIPT:AUDIT` | Type safety | `TYPESCRIPT-001`... | — |

---

## Workflow Phases

```
┌──────────────────────────────────────────────────────────────┐
│  Phase 0: FRAME (Orchestrator)                               │
│  - Capture goal, scope, constraints                          │
│  - Select bundle (UI/Next.js/Backend/Supabase/Full)          │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  Phase 1: AUDIT (Parallel, read-only)                        │
│  - Specialists scan scope                                    │
│  - Return structured payloads (max 10 findings each)         │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  Phase 1.5: MERGE (Orchestrator, single writer)              │
│  - Creates .codex/audit/YYYY-MM-DD_<context>.md              │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  Phase 2: PLAN (Orchestrator, single writer)                 │
│  - Converts findings to .codex/TASKS.md                      │
│  - Max 20 tasks, ≤15 Ready                                   │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  Phase 3: EXECUTE (Implementers, one lane at a time)         │
│  - 1-3 file batches                                          │
│  - treido-frontend OR treido-backend OR treido-ui            │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│  Phase 4: VERIFY (Read-only)                                 │
│  - Gates: typecheck, lint, styles:gate                       │
│  - Risk-based tests                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## Bundle Matrix

| User Intent | Bundle | Specialists | Executor |
|-------------|--------|-------------|----------|
| "fix styling", "UI looks off" | UI | `spec-tailwind` + `spec-shadcn` | `treido-frontend` |
| "design", "pixel-perfect" | Design | `spec-tailwind` + `spec-shadcn` | `treido-ui` |
| "missing data", "frontend/backend gap" | Alignment | `treido-alignment` | Both lanes |
| "routing", "RSC", "caching" | Next.js | `spec-nextjs` | `treido-frontend` |
| "backend issue", "webhook" | Backend | `spec-nextjs` + `spec-supabase` | `treido-backend` |
| "database", "RLS", "policies" | Supabase | `spec-supabase` | `treido-backend` |
| "full audit", "what's wrong" | Full | ALL specialists | Both executors |

---

## Pause Conditions

Human approval required before EXECUTE for:

- DB migrations or schema changes
- Auth/access control changes
- Payments/Stripe/billing flows
- Destructive data operations
- External service integrations
- Privacy/security-sensitive changes

Auto-execute (no pause): UI fixes, TypeScript improvements, refactoring, tests, docs.

---

## Skill Management

```bash
# Sync skills from repo to $CODEX_HOME/skills
pnpm -s skills:sync

# Validate skill structure
pnpm -s validate:skills
```

Skills are vendored in `.codex/skills/`. Each skill follows:

```
.codex/skills/<skill-name>/
├── SKILL.md          # Main definition (frontmatter + content)
├── references/       # Supporting docs, decision trees
└── scripts/          # Automation (scan, lint, etc.)
```

---

## MCP Tools

| MCP | Prefix | Required For |
|-----|--------|--------------|
| Supabase | `mcp__supabase__*` | DB work (schema, RLS, migrations) |
| shadcn | `mcp__shadcn__*` | Component registry |
| Next.js | `mcp__next-devtools__*` | Framework docs |

**Preflight**: Before DB/RLS work, verify `mcp__supabase__*` tools available.

---

## Verification Gates

Always run after each batch:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Conditional (risk-based):

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

---

## See Also

- [AGENTS.md](./AGENTS.md) — Entry point, rails
- [WORKFLOW.md](./WORKFLOW.md) — Operations workflow
- `.codex/TASKS.md` — Active task queue
- `.codex/skills/*/SKILL.md` — Full skill definitions

---

*Last updated: 2026-02-01*
