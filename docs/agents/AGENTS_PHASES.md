# Agent Fleet Roadmap — Treido Marketplace

> **Purpose**: Methodical, phased approach to perfecting each agent in the Treido agent fleet.
> **Session Strategy**: Work through ONE phase per session with full focus.
> **Last Updated**: 2026-01-31

---

## Executive Summary (Codex MCP Assessment)

**Current State**:
- `.codex/skills/*` is the **production SSOT** — validated, has workflow contracts, and a real "ship + verify" loop
- `agents/codex_*` is a **sandbox/incubator** — not production-ready, doesn't pass repo validator
- `agents/opus_*` is **draft/reference only** — contains outdated version assumptions (Next.js 15 vs actual 16.1.4)

**Recommendation**: Consolidate to `.codex/skills/*` as the single production system. Use `agents/` only for incubation of net-new roles.

---

## Agent Inventory

### Production Agents (`.codex/skills/*`)

| # | Agent | Type | Status | Phase |
|---|-------|------|--------|-------|
| 1 | `treido-orchestrator` | Coordinator | 🟡 Needs polish | Phase 1 |
| 2 | `treido-verify` | Verifier | 🟡 Needs polish | Phase 1 |
| 3 | `spec-tailwind` | Audit-only | 🟡 Needs polish | Phase 2 |
| 4 | `spec-shadcn` | Audit-only | 🟡 Needs polish | Phase 2 |
| 5 | `spec-nextjs` | Audit-only | 🟡 Needs polish | Phase 2 |
| 6 | `spec-supabase` | Audit-only | 🟡 Needs polish | Phase 2 |
| 7 | `spec-typescript` | Audit-only | 🟡 Needs polish | Phase 2 |
| 8 | `treido-frontend` | Executor | 🟡 Needs polish | Phase 3 |
| 9 | `treido-backend` | Executor | 🟡 Needs polish | Phase 3 |
| 10 | `treido-ui` | Design Executor | 🟡 Needs polish | Phase 4 |
| 11 | `treido-alignment` | Audit-only | 🟡 Needs polish | Phase 4 |

### Sandbox Agents (`agents/codex_*`) — For Review/Migration

| # | Agent | Status | Action |
|---|-------|--------|--------|
| 1 | `codex_orchestrator` | ⬜ Draft | Review → merge into treido-orchestrator |
| 2 | `codex_frontend` | ⬜ Draft | Review → merge into treido-frontend |
| 3 | `codex_backend` | ⬜ Draft | Review → merge into treido-backend |
| 4 | `codex_ui_design` | ⬜ Draft | Review → merge into treido-ui |
| 5 | `codex_spec_nextjs` | ⬜ Draft | Review → merge into spec-nextjs |
| 6 | `codex_spec_tailwind_v4` | ⬜ Draft | Review → merge into spec-tailwind |
| 7 | `codex_spec_shadcn` | ⬜ Draft | Review → merge into spec-shadcn |
| 8 | `codex_spec_supabase` | ⬜ Draft | Review → merge into spec-supabase |
| 9 | `codex_spec_typescript` | ⬜ Draft | Review → merge into spec-typescript |
| 10 | `codex_verify` | ⬜ Draft | Review → merge into treido-verify |

### Legacy/Deprecated (`agents/opus_*`) — Archive

| # | Agent | Status | Action |
|---|-------|--------|--------|
| 1 | `opus_backend` | ❌ Outdated | Archive — generic, not Treido-rails-first |
| 2 | `opus_frontend` | ❌ Outdated | Archive — generic, not Treido-rails-first |
| 3 | `opus_nextjs` | ❌ Outdated | Archive — references Next.js 15 (we're on 16.1.4) |
| 4 | `opus_shadcn` | ❌ Outdated | Archive — generic guidance |
| 5 | `opus_supabase` | ❌ Outdated | Archive — generic guidance |
| 6 | `opus_tailwindcss` | ❌ Outdated | Archive — not v4 CSS-first |
| 7 | `opus_typescript` | ❌ Outdated | Archive — generic guidance |
| 8 | `opus_ui_design` | ❌ Outdated | Archive — generic guidance |

---

## Phased Roadmap

### Phase 0: Fleet Hygiene (Pre-requisite)
**Duration**: 1-2 hours
**Focus**: Clean up the agent landscape before deep work

- [ ] **0.1** Decide lifecycle: `agents/*` = incubator only; `.codex/skills/*` = production SSOT
- [ ] **0.2** Archive `agents/opus_*` (rename folder to `agents/_archived_opus/` or add deprecation headers)
- [ ] **0.3** Review `agents/codex_*` — identify delta vs `.codex/skills/*` for each agent
- [ ] **0.4** Document: Create migration checklist for sandbox → production

**Acceptance Criteria**:
- `pnpm -s validate:skills` passes
- No duplicate functionality between codex_* and treido-*
- Clear "DO NOT USE" markers on archived agents

---

### Phase 1: Foundation — Orchestrator + Verify
**Duration**: Full session each
**Why First**: Every other agent becomes safer once routing + verification are reliable

#### 1.1 `treido-orchestrator`
**File**: `.codex/skills/treido-orchestrator/SKILL.md`
**Role**: Coordinator — selects bundles, spawns audits, merges, plans, drives execution

**Current Gaps**:
- [ ] Bundle matrix missing: `treido-ui`, `treido-alignment`, `spec-typescript`
- [ ] Subagent spawn patterns need validation
- [ ] Pause conditions list incomplete

**Improvements Needed**:
- [ ] Add Design bundle (routes to `treido-ui`)
- [ ] Add Alignment bundle (routes to `treido-alignment`)
- [ ] Add TypeScript to Full bundle specialist list
- [ ] Validate subagent spawn templates work correctly
- [ ] Add explicit "what to do when MCP unavailable" fallbacks
- [ ] Add metrics/timing guidance for audit phases

**Definition of Done**:
- [ ] All bundles in `.codex/AGENTS.md:149-161` reflected in orchestrator matrix
- [ ] Subagent spawn tested with at least 2 specialists
- [ ] Full workflow (AUDIT → MERGE → PLAN → EXECUTE → VERIFY) runs end-to-end
- [ ] `pnpm -s validate:skills` passes

#### 1.2 `treido-verify`
**File**: `.codex/skills/treido-verify/SKILL.md`
**Role**: Read-only verifier — runs gates, reports pass/fail

**Current Gaps**:
- [ ] Plan lint script referenced but needs testing
- [ ] Risk-based test selection underdefined

**Improvements Needed**:
- [ ] Validate `lint-plan.mjs` script works
- [ ] Add explicit test selection criteria per bundle type
- [ ] Add Storybook verification path (if applicable)
- [ ] Add MCP-based verification (Supabase advisors) when available

**Definition of Done**:
- [ ] All gates run and report correctly
- [ ] Test selection logic documented and tested
- [ ] Output format matches workflow contract
- [ ] `pnpm -s validate:skills` passes

---

### Phase 2: Specialists — Audit Agents
**Duration**: Full session per specialist
**Why Order**: Frontend rails catch most churn; DB last (triggers pause conditions)

**Order**: `spec-tailwind` → `spec-shadcn` → `spec-nextjs` → `spec-supabase` → `spec-typescript`

#### 2.1 `spec-tailwind`
**File**: `.codex/skills/spec-tailwind/SKILL.md`
**Role**: Audit-only — Tailwind v4 tokens, forbidden patterns

**Checklist**:
- [ ] Evidence format: `path:line` always
- [ ] Finding IDs: `TW4-001..n` sequential
- [ ] Max 10 findings per audit
- [ ] All forbidden patterns documented
- [ ] Scan script (`scripts/scan.mjs`) works
- [ ] Output matches `audit-payload.md` contract

**Improvements Needed**:
- [ ] Add color swatch exception documentation
- [ ] Add `@theme` block validation
- [ ] Add dark mode token verification
- [ ] Validate `styles:gate` integration

#### 2.2 `spec-shadcn`
**File**: `.codex/skills/spec-shadcn/SKILL.md`
**Role**: Audit-only — shadcn/ui boundaries, Radix composition

**Checklist**:
- [ ] Evidence format: `path:line` always
- [ ] Finding IDs: `SHADCN-001..n` sequential
- [ ] Max 10 findings per audit
- [ ] Boundary rules (ui/* vs shared/*) clear
- [ ] Scan script (`scripts/scan.mjs`) works
- [ ] MCP integration (optional) documented

**Improvements Needed**:
- [ ] Add Base UI support detection (shadcn now supports both Radix and Base UI)
- [ ] Add CVA variant audit patterns
- [ ] Document accessibility checks

#### 2.3 `spec-nextjs`
**File**: `.codex/skills/spec-nextjs/SKILL.md`
**Role**: Audit-only — RSC boundaries, caching, routing

**Checklist**:
- [ ] Evidence format: `path:line` always
- [ ] Finding IDs: `NEXTJS-001..n` sequential
- [ ] Max 10 findings per audit
- [ ] Caching hazard detection (cookies/headers in cached functions)
- [ ] Scan script (`scripts/scan.mjs`) works
- [ ] MCP integration (Next.js devtools) documented

**Improvements Needed**:
- [ ] Add React 19 `use()` pattern detection
- [ ] Add `updateTag` vs `revalidateTag` guidance
- [ ] Document server action vs route handler selection

#### 2.4 `spec-supabase`
**File**: `.codex/skills/spec-supabase/SKILL.md`
**Role**: Audit-only — RLS, queries, auth patterns

**Checklist**:
- [ ] Evidence format: `path:line` always
- [ ] Finding IDs: `SUPABASE-001..n` sequential
- [ ] Max 10 findings per audit
- [ ] RLS detection via MCP
- [ ] Scan script (`scripts/scan.mjs`) works
- [ ] MCP preflight documented (REQUIRED for this agent)

**Improvements Needed**:
- [ ] Add storage bucket policy audit
- [ ] Add client selection matrix validation
- [ ] Document fallback when MCP unavailable

#### 2.5 `spec-typescript`
**File**: `.codex/skills/spec-typescript/SKILL.md`
**Role**: Audit-only — strictness, unsafe patterns, boundaries

**Checklist**:
- [ ] Evidence format: `path:line` always
- [ ] Finding IDs: `TYPESCRIPT-001..n` sequential
- [ ] Max 10 findings per audit
- [ ] Unsafe escape detection (`any`, casts, ts-ignore)
- [ ] Scan script (`scripts/scan.mjs`) works

**Improvements Needed**:
- [ ] Add zod inference pattern validation
- [ ] Add server/client type boundary checks
- [ ] Document return type stability guidance

---

### Phase 3: Executors — Implementation Agents
**Duration**: Full session per executor
**Why After Specialists**: Executors need audit findings to work from

#### 3.1 `treido-frontend`
**File**: `.codex/skills/treido-frontend/SKILL.md`
**Role**: Executor — UI/routing changes, RSC boundaries, i18n

**Checklist**:
- [ ] AUDIT mode produces correct payload
- [ ] IMPL mode keeps batches 1-3 files
- [ ] i18n updates (both en.json + bg.json)
- [ ] TW4 token-safe styling
- [ ] Verification gates run after each batch

**Improvements Needed**:
- [ ] Add React 19 patterns (use hook, promise passing)
- [ ] Add streaming/Suspense guidance
- [ ] Validate scan script works
- [ ] Add explicit "when to hand off to treido-ui"

#### 3.2 `treido-backend`
**File**: `.codex/skills/treido-backend/SKILL.md`
**Role**: Executor — server actions, Supabase, Stripe

**Checklist**:
- [ ] AUDIT mode produces correct payload
- [ ] IMPL mode keeps batches 1-3 files
- [ ] MCP preflight for DB work
- [ ] No secrets/PII in logs
- [ ] Stripe webhook idempotency

**Improvements Needed**:
- [ ] Add explicit pause condition handling
- [ ] Add migration safety checks
- [ ] Validate scan script works
- [ ] Add RLS policy creation templates

---

### Phase 4: Design + Alignment — Specialized Agents
**Duration**: Full session per agent
**Why Last**: High leverage but depends on core loop being stable

#### 4.1 `treido-ui`
**File**: `.codex/skills/treido-ui/SKILL.md`
**Role**: Design executor — lovable.dev-quality UI

**Checklist**:
- [ ] Token-safe styling only
- [ ] No gradients/glows/animations
- [ ] Mobile-first responsive
- [ ] Dark mode verified
- [ ] All states (loading/empty/error)

**Improvements Needed**:
- [ ] Add component pattern library reference
- [ ] Add accessibility audit checklist
- [ ] Add design QA checklist (visual verification)
- [ ] Document handoff to/from treido-frontend

#### 4.2 `treido-alignment`
**File**: `.codex/skills/treido-alignment/SKILL.md`
**Role**: Audit-only — DB/backend/frontend contract gaps

**Checklist**:
- [ ] MCP preflight (REQUIRED)
- [ ] Coverage matrix output
- [ ] Gap identification
- [ ] Clear task assignment (backend vs frontend)

**Improvements Needed**:
- [ ] Add type alignment verification
- [ ] Add enum/constraint validation
- [ ] Document fallback when MCP unavailable
- [ ] Add integration with treido-orchestrator bundles

---

### Phase 5: Optional — DOCS Agent
**Duration**: 1 session
**When**: Only if docs drift is hurting the project

**Potential `treido-docs` agent**:
- Trigger: `DOCS:`
- Writes: `docs/*` only
- Updates SSOT docs when shipped work changes architecture/rails/features

**Decision**: Currently handled by orchestrator. Add dedicated agent only if needed.

---

## Session Workflow Template

For each agent session:

```md
## Session: [Agent Name]
**Date**: YYYY-MM-DD
**Phase**: X.Y

### Pre-Session
- [ ] Read current SKILL.md
- [ ] Review Codex MCP feedback for this agent
- [ ] Identify gaps from checklist above

### Session Goals
1. ...
2. ...
3. ...

### Changes Made
- [ ] ...

### Verification
- [ ] `pnpm -s validate:skills` 
- [ ] Agent tested with sample request
- [ ] Output matches contract

### Notes/Decisions
...

### Next Session
...
```

---

## Progress Tracking

| Phase | Agent | Status | Session Date | Notes |
|-------|-------|--------|--------------|-------|
| 0 | Fleet Hygiene | ⬜ Not Started | | |
| 1.1 | treido-orchestrator | ⬜ Not Started | | |
| 1.2 | treido-verify | ⬜ Not Started | | |
| 2.1 | spec-tailwind | ⬜ Not Started | | |
| 2.2 | spec-shadcn | ⬜ Not Started | | |
| 2.3 | spec-nextjs | ⬜ Not Started | | |
| 2.4 | spec-supabase | ⬜ Not Started | | |
| 2.5 | spec-typescript | ⬜ Not Started | | |
| 3.1 | treido-frontend | ⬜ Not Started | | |
| 3.2 | treido-backend | ⬜ Not Started | | |
| 4.1 | treido-ui | ⬜ Not Started | | |
| 4.2 | treido-alignment | ⬜ Not Started | | |
| 5 | treido-docs (optional) | ⬜ Not Started | | |

---

## References

- `.codex/AGENTS.md` — Project SSOT
- `.codex/WORKFLOW.md` — Workflow contracts
- `.codex/skills/treido-orchestrator/references/audit-payload.md` — Audit output contract
- `agents/README.md` — Sandbox/incubator purpose
- `scripts/validate-agent-skills.mjs` — Skill validation rules

---

## Codex MCP Summary

> "Iterate on `treido-*` and `spec-*` in `.codex/skills/*` (SSOT + validated + synced via `skills:sync`). Use `agents/codex_*` only as an incubation area for net-new roles or major rewrites you don't trust yet — then graduate into `.codex/skills/*`."

> "Practical rule: If it's meant to run, it must live in `.codex/skills/*` and pass the repo skill structure rules."

