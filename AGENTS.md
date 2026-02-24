# AGENTS.md — Treido

Treido is a mobile-first marketplace evolving into an AI-first commerce platform.
Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase · Stripe · next-intl (en/bg).

---

## Session Start (Mandatory)

1. Read `docs/state/NOW.md` first (current truth).
2. Read `TASKS.md` second (execution queue).
3. If task is strategic/architectural, read `docs/strategy/NORTH-STAR.md` and `docs/strategy/CAPABILITY-MAP.md`.
4. Load only the domain docs needed for the assigned task (routing table below).
5. If frameworks are unclear, use official docs from `docs/STACK.md` (or context7 MCP).

---

## How to Work

1. Think before editing. For multi-file work, sketch the plan first.
2. Work in batches. Verify after each batch.
3. Keep momentum: finish scoped tasks end-to-end when feasible.
4. Mark completed task checkboxes in `TASKS.md`.
5. If docs become stale while you work, update them in the same session.
6. For risky areas (auth/payments/DB/RLS/webhooks/destructive ops), stop and flag for human approval.

---

## Routing Table (Load Only What You Need)

| Working on | Read |
|------------|------|
| Current state, blockers, focus | `docs/state/NOW.md` |
| Session history (short) | `docs/state/CHANGELOG.md` |
| Long-term direction | `docs/strategy/NORTH-STAR.md` |
| Progress by capability/phase | `docs/strategy/CAPABILITY-MAP.md` |
| End-state architecture | `docs/architecture/TARGET-PLATFORM.md` |
| AI feature architecture | `docs/architecture/AI-PLATFORM.md` |
| What to execute now | `TASKS.md` |
| Launch audits/readiness | `docs/launch/CHECKLIST.md`, `docs/launch/TRACKER.md`, `docs/launch/CODEX.md` |
| Product context | `docs/PRD.md` |
| Tech stack + official doc links | `docs/STACK.md` |
| UI/styling/components | `docs/DESIGN.md` |
| Database/schema/query patterns | `docs/database.md` |
| Testing conventions | `docs/testing.md` |
| Why a pattern exists | `docs/DECISIONS.md` |
| Feature-specific implementation | `docs/features/<feature>.md` (auth, bottom-nav, checkout-payments, header, product-cards, search-filters, sell-flow) |
| Business strategy/pricing/GTM | `docs/business/*.md` |
| Public legal/help policy content | `docs/public/**` |
| Generated references | `docs/generated/**` |

Skills: `.agents/skills/treido-business-agent/SKILL.md` (business strategy/ops), `.agents/skills/treido-ai-platform-agent/SKILL.md` (AI features/eval/guardrails).

---

## File Map

```
AGENTS.md                        → Agent entry point and rules
TASKS.md                         → Single execution queue (phase-aligned)
claude.md                        → Orchestrator identity/process (no mutable state)

docs/state/NOW.md               → Current truth snapshot (read first)
docs/state/CHANGELOG.md         → Short session outcomes
docs/strategy/NORTH-STAR.md     → Vision and strategic direction
docs/strategy/CAPABILITY-MAP.md → Capability status by phase
docs/architecture/TARGET-PLATFORM.md → Layered end-state architecture
docs/architecture/AI-PLATFORM.md     → AI feature architecture contract

docs/PRD.md  docs/STACK.md  docs/DESIGN.md  docs/DECISIONS.md
docs/database.md  docs/testing.md  docs/features/*  docs/business/*
docs/launch/*  docs/public/*  docs/generated/*
.agents/skills/*                → Optional specialized workflows
```

---

## Knowledge That Prevents Mistakes

These aren't arbitrary rules — they exist because violating them causes real production incidents.

- **Auth:** `getUser()` only — `getSession()` reads the JWT without re-validating, so a spoofed token passes silently.
- **Webhooks:** `constructEvent()` before any DB write. Stripe signs payloads — without verification, forged events create fake orders.
- **Route privacy:** `_components/`, `_actions/`, `_lib/` are route-group-private. Never import across route groups.
- **Styling:** semantic tokens only (`bg-background`, `text-foreground`). No palette classes, hex, arbitrary values, or gradients. `pnpm -s styles:gate` catches violations.
- **Data:** no `select('*')` in hot paths. Use the correct Supabase client per context (→ `docs/STACK.md` § Supabase client table).
- **Performance:** no wide joins in list views. `createStaticClient()` for cached reads. Never cache user-specific data.
- **AI features:** Schema-validated outputs, pinned prompt versions, guardrails, and telemetry are mandatory.

**Stop and flag for approval:** DB schema/migrations/RLS, auth/session logic, payments/webhooks, destructive operations.

---

## Conventions

- Server Components by default. `"use client"` only when necessary.
- Client components are prop-driven; fetch server-side when possible.
- Zod at boundaries (forms, API/webhook inputs). Typed data internally.
- File naming: kebab-case. No version suffixes.
- Use `requireAuth()` from `lib/auth/require-auth.ts` in server actions.
- Navigation: use `Link` / `redirect` from `@/i18n/routing` (never `next/link`).
- `components/ui/` for primitives, `components/shared/` for cross-route composites, `components/layout/` for shells.

---

## Session Protocol

1. Start: read `docs/state/NOW.md` and `TASKS.md`.
2. Execute scoped work with minimal necessary context.
3. Verify gates after each batch.
4. Update `TASKS.md` checkboxes and notes.
5. End session: update `docs/state/NOW.md` (`updated_at`, blockers, focus, recent changes).
6. Add concise entry to `docs/state/CHANGELOG.md` for significant outcomes.
7. If a durable directional decision was made, append it to `docs/DECISIONS.md`.

---

## Verify

After each batch of changes:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

If you changed behavior, docs, or architecture assumptions, keep docs in sync in the same session.

*Last updated: 2026-02-24*
