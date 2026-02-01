# ⚠️ ARCHIVED — Reference Only

> **DO NOT USE THESE TRIGGERS.** This folder is archived.
>
> **Production SSOT**: `.codex/skills/`
> **Production triggers**: `ORCH:`, `FRONTEND:`, `BACKEND:`, `UI:`, `VERIFY:`, `SPEC-*:AUDIT`
>
> See `.codex/AGENTS.md` for current agent routing.

---

## What This Folder Was

This folder contained **proposed** agent skills (`codex_*` and `opus_*`) used during skill architecture iteration.

The best content has been **ported** to `.codex/skills/`:
- Decision trees → `references/decision-tree.md` in each skill
- Anti-patterns → `treido-ui/references/anti-patterns.md`
- Core principles → Integrated into SKILL.md files

## Why Archived?

Per `.codex/proposals/AGENT-SKILL-ITERATION.md`, we converged on:
1. **Single SSOT**: `.codex/skills/` is the only production system
2. **No competing dialects**: `CODEX-*` and `OPUS-*` triggers are deprecated
3. **Reference only**: This folder is preserved for historical context

## If You Need to Reference Something

The `codex_*` and `opus_*` skills here contain useful patterns, but:
- ⚠️ Some examples violate Treido rails (palette colors, gradients, opacity hacks)
- ⚠️ Some reference outdated APIs (Next.js 15 vs our 16.1.4)
- ✅ Use `.codex/skills/` versions instead — they're Treido-safe

## Ported Content Summary

| Source | Ported To |
|--------|-----------|
| opus_ui_design "What Makes Bad AI UI" | `.codex/skills/treido-ui/references/anti-patterns.md` |
| opus_tailwindcss decision trees | `.codex/skills/spec-tailwind/references/decision-tree.md` |
| opus_shadcn composition patterns | `.codex/skills/spec-shadcn/references/decision-tree.md` |
| opus_nextjs caching patterns | `.codex/skills/spec-nextjs/references/decision-tree.md` |
| codex_* core principles | Integrated into `.codex/AGENTS.md` rails |

---

# Historical Content Below (Do Not Use)

---

## Proposed `codex_*` Agent Skills — Treido Marketplace

This folder contains **proposed** agent skills (review-first) for the Treido Marketplace project.

The repo’s active SSOT skills live in `.codex/skills/` (sync with `pnpm -s skills:sync`), but this
folder is intentionally a sandbox for iteration and upgrades.

## Why `codex_*`?

- Clear provenance: anything `codex_*` was drafted by Codex (this assistant)
- Safe iteration: review here first, then migrate into `.codex/skills/` once trusted

## Core Principles (All `codex_*` Agents)

### 1) Design-First, System Thinking
- Plan before implementing
- Think in **components + reusable patterns**, not one-off pages
- Use “design intent” language (hierarchy, rhythm, density, affordances)
- Prefer real content + realistic states (empty/loading/error)

### 2) Treido Rails (Non-Negotiable)
- Tailwind v4 tokens only (no palette colors, no arbitrary values)
- No gradients, no glows, no “AI-purple” accents
- Default Server Components; add `"use client"` only when necessary
- All user-facing strings via `next-intl`
- Cached server code follows `cacheLife()` + `cacheTag()` rules
- Supabase work respects RLS and avoids `select('*')` in hot paths

### 3) Lovable-quality UI Craft
- Generous whitespace, clear hierarchy, restrained surfaces
- Subtle depth only (single shadow level per elevation)
- Consistent interactive states (hover/active/selected/focus)
- Mobile-first layouts and touch targets

## Recommended Agent Roster

### Coordinator Agent (Planning + Routing)
- `codex_orchestrator` — selects specialists/executors, keeps batches small, drives verification.

### Meta Agent (Skill System Iteration)
- `codex_iteration` — iterates on agent skills architecture and hygiene; keeps `.codex/skills` SSOT and `validate:skills` green.

### Executor Agents (AUDIT + IMPL)
- `codex_frontend` — Next.js App Router UI/routing, RSC boundaries, i18n, token-safe Tailwind.
- `codex_backend` — server actions/route handlers, Supabase, Stripe, caching safety.
- `codex_ui_design` — **strictly UI/UX styling + layout craft** (shadcn + Tailwind v4 tokens).

### Specialist Agents (AUDIT-ONLY)
- `codex_spec_nextjs` — App Router structure, caching, server/client boundaries, proxy/middleware rails.
- `codex_spec_tailwind_v4` — token drift, forbidden patterns, Tailwind v4 CSS-first best practices.
- `codex_spec_shadcn` — primitives boundary, Radix composition, CVA variants.
- `codex_spec_supabase` — RLS/policies, query shape, auth/session patterns.
- `codex_spec_typescript` — strictness, unsafe patterns, module boundaries, type ergonomics.

### Verification Agent (Read-only)
- `codex_verify` — runs gates/tests and reports pass/fail + next steps.

## Usage Triggers (Proposal)

| Agent | Trigger | Example |
|-------|---------|---------|
| codex_orchestrator | `CODEX-ORCH:` | `CODEX-ORCH: Run UI audit then implement fixes` |
| codex_iteration | `CODEX-ITERATION:` | `CODEX-ITERATION: Improve agent skill structure + validation` |
| codex_frontend | `CODEX-FRONTEND:` | `CODEX-FRONTEND: Refactor product card layout` |
| codex_backend | `CODEX-BACKEND:` | `CODEX-BACKEND: Add Stripe webhook idempotency` |
| codex_ui_design | `CODEX-UI:` / `CODEX-DESIGN:` | `CODEX-UI: Make search results feel premium` |
| codex_spec_nextjs | `CODEX-NEXTJS:AUDIT` | `CODEX-NEXTJS:AUDIT: audit caching hazards` |
| codex_spec_tailwind_v4 | `CODEX-TW4:AUDIT` | `CODEX-TW4:AUDIT: scan token drift` |
| codex_spec_shadcn | `CODEX-SHADCN:AUDIT` | `CODEX-SHADCN:AUDIT: boundary review` |
| codex_spec_supabase | `CODEX-SUPABASE:AUDIT` | `CODEX-SUPABASE:AUDIT: RLS review` |
| codex_spec_typescript | `CODEX-TS:AUDIT` | `CODEX-TS:AUDIT: remove unsafe any` |
| codex_verify | `CODEX-VERIFY:` | `CODEX-VERIFY: run gates after UI batch` |

## File Structure

```
agents/
├── README.md
├── codex_orchestrator/
│   └── SKILL.md
├── codex_iteration/
│   └── SKILL.md
├── codex_frontend/
│   └── SKILL.md
├── codex_backend/
│   └── SKILL.md
├── codex_ui_design/
│   └── SKILL.md
├── codex_spec_nextjs/
│   └── SKILL.md
├── codex_spec_tailwind_v4/
│   └── SKILL.md
├── codex_spec_shadcn/
│   └── SKILL.md
├── codex_spec_supabase/
│   └── SKILL.md
├── codex_spec_typescript/
│   └── SKILL.md
└── codex_verify/
    └── SKILL.md
```

## Migration to `.codex/skills/` (When Ready)

When you trust a `codex_*` agent, port it to `.codex/skills/`:
- Rename underscores → hyphens (repo validator requires lowercase + hyphens).
- Add `references/00-index.md` and `scripts/*` (repo skill structure requirement).
- Run:

```bash
pnpm -s validate:skills
pnpm -s skills:sync
```
