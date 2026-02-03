# Dev Department / Agent System — Master Plan (Treido)

**Date**: 2026-02-02  
**Status**: Draft — Ready to implement in phases  
**Owner**: Dev Department (Human + ORCH)

This proposal turns the current “agent fleet” into a real **AI dev department**: clear roles, clear ownership, single sources of truth, and a maintenance cadence that prevents skills/docs from drifting into generic advice.

---

## 0) Reality Check: “Skills” ≠ Training

We can’t “train” these agents like fine-tuning in-repo. What we *can* do is build:

1) **Stable repo memory** via `AGENTS.md` files (hierarchical, path-scoped rules)  
2) **On-demand specialists** via `.codex/skills/<name>/SKILL.md` (progressive disclosure + references)  
3) **Deterministic tooling** via scripts and gates (so the system doesn’t rely on “remembering”)  

This matches both Anthropic’s “Agent Skills” model and OpenAI’s Codex skills + AGENTS.md layering approach.

---

## 1) Goals (What “Perfect” Means Here)

### Shipping goals
- Ship to production with predictable quality: **small batches + gates + audit discipline**.
- Reduce rework/thrashing: specialized agents produce **mergeable, evidence-backed outputs**.
- Make “run the right agent” trivial: clear triggers + routing + docs map.

### System goals
- **Single-source-of-truth** for: stack, rails, docs, tasks, and skills.
- “No more generic agents”: every skill references *real* Treido paths, patterns, and constraints.
- “No more context loss”: stable memory lives in docs + AGENTS.md; skills use progressive disclosure.

---

## 2) What We Already Have (and Why It Feels “Generic” Anyway)

### Already present in repo
- A solid skill fleet under `.codex/skills/` (orchestrator, frontend, backend, UI, verify, spec-* specialists).
- Docs hub + workflow specs under `docs/`.
- Validators: `pnpm -s validate:skills` and `pnpm -s skills:sync`.

### Why it can still feel generic
1) **Drift / duplication**: multiple files claim SSOT status (`docs/*` vs `.codex/*`), creating conflicting “truth”.
2) **Missing path rules**: almost no folder-level `AGENTS.md`, so local invariants aren’t enforced where work happens.
3) **No stack manifest**: skills embed versions/patterns in multiple places → goes stale → generic advice creeps in.
4) **Bloated SKILL.md**: generic framework theory in SKILL.md instead of Treido-specific checklists.

---

## 3) Dev Department: The “AI Team” We Actually Need

### Core executors (ship code)
1) **ORCH (Dev Lead / EM)** — owns planning + routing + task queue + “repo health” decisions  
2) **FRONTEND (UI engineer)** — owns App Router UI, shadcn composition, next-intl strings  
3) **BACKEND (Server engineer)** — owns server actions, Supabase patterns, Stripe/webhooks  
4) **UI/DESIGN (Product designer)** — pixel-perfect UI implementation + UX polish

### Read-only specialists (raise quality, prevent dumb mistakes)
5) **SPEC-NEXTJS** — RSC boundaries, caching rules, route group structure  
6) **SPEC-SUPABASE** — RLS, migrations, query shape, auth patterns  
7) **SPEC-TAILWIND / SPEC-SHADCN / SPEC-TYPESCRIPT** — rails enforcement

### Shipping gates + hygiene (protect production)
8) **VERIFY (QA)** — runs gates/tests; blocks execution if red  
9) **STRUCTURE (Repo janitor)** *(new)* — removes drift: dead code, boundary violations, folder moves, docs tidying (only via tasks + gates)  
10) **DOCS (Knowledge maintainer)** *(new)* — updates `docs/*` SSOT when shipped work changes system behavior

Notes:
- We do **not** create 20 micro-agents. Keep the fleet small; add domain playbooks as docs (e.g., payments) instead of new agents until it’s clearly warranted.
- “Payments/Plans/Billing” is a **domain playbook** owned by BACKEND + DOCS; we add a separate “BILLING” skill only if the workload becomes constant and risky.

This lines up with OpenAI’s “AI-native engineering team” framing across SDLC phases (plan/design/build/test/release/operate).

---

## 4) Ownership: Who Keeps the Repo Clean?

### Default owner of “clean state”: ORCH
ORCH owns:
- `.codex/TASKS.md` quality (small batches, clear verify steps)
- “What is SSOT?” decisions
- enforcing “no drift” policy: if something isn’t linked / isn’t verifiable, it’s not trusted

### Executor of “clean state” work: STRUCTURE (new)
STRUCTURE executes cleanup tasks:
- dead code removal (Knip), duplication reduction, boundary fixes
- file/folder moves with minimal blast radius
- enforcing folder-level invariants (AGENTS.md)

STRUCTURE never does product work; it’s “engineering hygiene only”.

### Quality gate: VERIFY
VERIFY blocks merges/batches when:
- `typecheck/lint/styles:gate` fail
- tests fail (risk-based set)

---

## 5) SSOT Map (Fixing Drift)

We need one truth per category:

### Stable engineering truth (docs)
- `docs/00-INDEX.md` — docs hub
- `docs/AGENTS.md` — project rails + routing rules
- `docs/WORKFLOW.md` — workflow + output contracts
- `docs/11-SKILLS.md` — triggers + what to use when

### Runtime state (codex runtime)
- `.codex/TASKS.md` — task queue (SSOT for active work)
- `.codex/audit/*` — dated audits
- `.codex/DECISIONS.md` — append-only decisions

### Fleet definition (skills)
- `.codex/skills/**` — repo-scoped skills (SSOT)

### New: Stack manifest (single truth)
Add:
- `.codex/stack.yml` — versions + “we do it this way in Treido” facts (see Phase 1)

We keep backward-compat pointers where needed, but only one file is the “truth”.

---

## 6) AGENTS.md Strategy (Folder-Level Invariants)

OpenAI’s AGENTS.md model is hierarchical: root rules + more specific subfolder rules override as you go deeper.

We should add **short** `AGENTS.md` files in high-traffic folders. Rule: invariants only, no essays.

Recommended initial set:
- `app/AGENTS.md` — Next.js App Router rules + server/client boundary rails
- `app/actions/AGENTS.md` — server action rules (auth/caching/tag invalidation)
- `components/AGENTS.md` — shared component boundaries (no data fetching)
- `components/ui/AGENTS.md` — shadcn primitives boundary (no app logic)
- `lib/AGENTS.md` — pure utilities rule
- `lib/supabase/AGENTS.md` — Supabase client + auth patterns
- `supabase/AGENTS.md` — migrations/RLS rules (append-only mindset)
- `docs/AGENTS.md` — docs-only editing rules

Each should link back to the relevant SSOT doc section (`docs/03-ARCHITECTURE.md`, `docs/04-DESIGN.md`, etc).

---

## 7) Skill Design Rules (So Skills Stop Being “Generic”)

### Hard rules
- SKILL.md is the **execution checklist**, not a textbook.
- Generic theory goes into `references/` (load on demand).
- Every “Critical” claim must be evidence-backed (file:line + search evidence for absence claims).
- Skills must reference *Treido facts* via `.codex/stack.yml` (not hardcoded in 10 places).

### Progressive disclosure
Follow the agent-skill progressive disclosure pattern: small base instructions, then references as needed.

### Avoid fragmentation
Limit triggers to a consistent small set (ORCH/FRONTEND/BACKEND/UI/VERIFY/DOCS/STRUCTURE + spec-*).

---

## 8) Phased Implementation Plan (Doable, Not Fantasy)

### Phase 1 — Foundation (1–2 days)
- Add `.codex/stack.yml` (SSOT for versions + “Treido conventions”)
- Add `docs/15-DEV-DEPARTMENT.md` (this proposal distilled into stable ops)
- Add folder-level `AGENTS.md` files (invariants only)

### Phase 2 — Fleet hardening (2–5 days)
- Slim each SKILL.md to “checklist + repo facts”
- Move generic content into `references/`
- Add evidence contract guardrails to spec-* (no “Critical” without proof)

### Phase 3 — Add missing roles (as needed)
- Add `treido-docs` skill (DOCS:) if docs updates become frequent
- Add `treido-structure` skill (STRUCTURE:) if cleanup work becomes a constant stream
- Add domain playbooks in docs for payments/plans rather than new skills (unless necessary)

### Phase 4 — Maintenance cadence (weekly)
- Weekly “fleet health” run:
  - `pnpm -s validate:skills`
  - `pnpm -s knip` / `pnpm -s dupes` (if configured)
  - review `.codex/DECISIONS.md` for drift
- Quarterly: prune redundant docs, merge proposals into SSOT docs

---

## 9) What We Will NOT Do (Non-goals)

- No “one agent per feature” explosion.
- No duplicated SSOTs.
- No heavy process docs that no one reads.
- No rewriting half the repo “for cleanliness” without shipping value.

---

## 10) Next Actions (Immediate)

1) Implement Phase 1 now (stack manifest + folder AGENTS + stable dev department doc).  
2) After that, pick one skill per iteration (starting with `spec-nextjs` + `spec-supabase`) and harden them.  

---

## References (external)

- Anthropic Agent Skills (overview): https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- OpenAI Codex Skills: https://developers.openai.com/codex/skills/
- OpenAI AGENTS.md (hierarchical repo rules): https://developers.openai.com/codex/agents-md/
- OpenAI: Building AI Teams: https://developers.openai.com/codex/teams/
- AgentSkills standard: https://agentskills.io/standard
- skills.sh docs: https://skills.sh/docs
