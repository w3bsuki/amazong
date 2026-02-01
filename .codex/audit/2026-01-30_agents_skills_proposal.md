# Proposal — Spec Agents + Agent Workflow v2 (Treido) — 2026-01-30

Purpose: a **small, stable agent fleet** that ships production work fast *without* “AI slop” regressions on Treido’s stack (Next.js App Router + Tailwind v4 + shadcn/ui + Supabase + Stripe + next-intl).

This document is a **proposal + operating guide**, not SSOT. If accepted, promote the *minimal* parts into `.codex/AGENTS.md` + `.codex/WORKFLOW.md` + skill docs.

---

## Why spec agents (and why now)

Treido’s frontend/backend lanes already cover “do the work”, but the failure modes that cost the most time are **framework/library-specific**:

- Next.js: RSC vs client boundary leaks, caching hazards (`'use cache'` + request APIs), layout/suspense double-mounting.
- Tailwind v4: forbidden patterns (arbitrary values/palette/opacity hacks) creeping in, and “almost-token” drift that passes code review but fails `styles:gate`.
- shadcn/Radix: primitives vs composites boundary, drawer/dialog scroll + gesture conflicts, a11y regressions.
- Supabase: query shape drift (`select('*')`, bare `.select()`), RLS/policy intent drift, auth client misuse by context.

Generalist implementer skills can *implement* fixes, but they can’t reliably audit all of these at high precision with short prompts—especially when context is constrained.

**Spec agents solve this** by being:

- **AUDIT-only** (zero risk of “helpful” drive-by edits),
- **narrow and consistent** (repeatable checklists + fast-signal scripts),
- **mergeable** (one payload contract that the orchestrator can assemble),
- **cheap to run** (parallel audits, small output, evidence-first).

This matches the “skills” pattern used in Anthropic’s public examples: skills are **procedural**, self-contained, include **Examples/Guidelines**, and lean on **scripts as black boxes** when possible. (See: `anthropics/skills` repo root README and skills like `webapp-testing`.)

---

## Current state (as of 2026-01-30)

You already have a solid base:

- Control plane: `.codex/TASKS.md` (single queue), `.codex/WORKFLOW.md` (phases), `.codex/DECISIONS.md`.
- Implementer lanes: `treido-frontend`, `treido-backend`.
- Verifier: `treido-verify` (read-only).
- Orchestrator: `treido-orchestrator` (single writer).
- Newly added spec agents (AUDIT-only):
  - `spec-nextjs` (`## NEXTJS`)
  - `spec-tailwind` (`## TW4`)
  - `spec-shadcn` (`## SHADCN`)
  - `spec-supabase` (`## SUPABASE`)

Each spec agent is already shaped well: `SKILL.md` + `references/` + `scripts/scan.mjs`, output contract is the shared audit payload.

### Gaps / risks to resolve (proposal targets)

1) **SSOT doc path drift**
- Several docs still say “SSOT is `docs/*`”, but Treido SSOT is now in `.codex/project/*`.
- This creates avoidable confusion for humans and agents.

2) **Audit naming + ID namespace collision risk**
- The shared audit payload allows many auditor sections (`## TW4`, `## NEXTJS`, …), but lane skills also emit `NEXTJS-###`.
- If multiple auditors emit the same prefix (`NEXTJS-001`), merged audits can get duplicate IDs.

3) **Spec agents aren’t integrated into the orchestrator bundle matrix yet**
- Right now “UI bundle” means “frontend lane audit”; it should optionally mean “parallel Next.js + TW4 + shadcn audits” when the risk is high.

---

## Design goals (v2)

### Goals

- **Predictability**: same request → same phases → same artifacts.
- **Small diffs**: 1–3 file batches, always gated.
- **Mergeable audits**: parallel, read-only, evidence with `file:line`.
- **Less context bloat**: SKILL.md stays short; deep detail goes to `references/`.
- **Audits that actually catch regressions**: spec agents are where “deep knowledge” lives.

### Non-goals

- Creating 10+ overlapping micro-skills.
- Turning spec agents into implementers.
- Encoding “everything about Next.js” in one megadoc.

---

## Proposed fleet (keep it small)

### 1) `treido-orchestrator` (single-writer coordinator)

Owns:
- `.codex/audit/*` merged artifact
- `.codex/TASKS.md` task promotion + status updates

Does:
- Select bundle(s)
- Spawn **read-only** audits in parallel (including spec agents)
- Merge → plan → delegate execution → request verify

### 2) Implementer lanes (write code)

- `treido-frontend`: UI implementation.
- `treido-backend`: server/actions/routes/webhooks + Supabase migrations (when needed).

### 3) `treido-verify` (read-only verifier)

Runs gates and minimal tests, reports pass/fail back to orchestrator.

### 4) Spec agents (AUDIT-only specialists)

- `spec-nextjs`: `## NEXTJS` (RSC/client/caching/routing).
- `spec-tailwind`: `## TW4` (tokens/forbidden patterns).
- `spec-shadcn`: `## SHADCN` (ui boundary + Radix/a11y).
- `spec-supabase`: `## SUPABASE` (RLS/auth/query shape).

**Hard rule:** spec agents never patch code, never touch TASKS/audit files. They only return a payload.

---

## How the orchestrator should use spec agents

### Bundle selection (intent → audits spawned)

**UI (low risk)**: “minor styling”, “copy”, “layout tweak”
- Spawn: `treido-frontend` (AUDIT) only

**UI (high risk)**: “drawer/modal broken”, “performance”, “RSC boundary issue”, “streaming/suspense bug”
- Spawn in parallel:
  - `spec-nextjs` (AUDIT)
  - `spec-shadcn` (AUDIT)
  - `spec-tailwind` (AUDIT)
  - (optionally) `treido-frontend` (AUDIT) for broader UI context

**Backend (typical)**: “route handler”, “server action”, “Stripe”
- Spawn:
  - `treido-backend` (AUDIT)
  - (optionally) `spec-nextjs` if caching/boundaries involved

**Supabase (any RLS/schema/perf)**:
- Spawn:
  - `spec-supabase` (AUDIT)
  - `treido-backend` (AUDIT) if code changes are likely

**Full audit / production push**
- Spawn in parallel:
  - `spec-nextjs`, `spec-tailwind`, `spec-shadcn`, `spec-supabase`
  - plus `treido-frontend`/`treido-backend` if you want lane-wide context

### Why this split works

- Implementer lanes are great at editing code in Treido’s boundaries.
- Spec agents are great at *not missing* the deep pitfalls.
- Orchestrator merges and turns findings into **shippable batches**.

---

## Output contracts (must stay strict)

### Audit payload contract (single mergeable section)

All auditors (lanes in AUDIT mode + spec agents) must output exactly:

- one `## <AUDITOR_NAME>` section
- with `Scope`, `Findings` table, `Acceptance Checks`, `Risks`
- with real `file:line` evidence

Canonical contract: `.codex/skills/treido-orchestrator/references/audit-payload.md`

### Verify report contract

`treido-verify` returns a single verify report:

- commands run + pass/fail
- minimal next fix if failing

(No edits to TASKS/audit files.)

---

## ID strategy (avoid collisions)

### Problem

If multiple auditors use `NEXTJS-###`, merged audits can collide.

### Proposed solution (pick one)

**Option A (recommended): “One prefix per auditor type”**
- `spec-nextjs` owns all `NEXTJS-###` IDs.
- Lanes avoid emitting `NEXTJS-###`; in lane audits, Next.js findings should be filed under the lane name (e.g. `FRONTEND-###` / `BACKEND-###`) or a lane-specific prefix (`FE-###`, `BE-###`).
- Result: no collisions, cleaner ownership.

**Option B: “Namespaced prefixes”**
- Use namespaced IDs like `FE-NEXTJS-001`, `BE-NEXTJS-001`.
- This requires loosening any audit/task ID lint regex to accept multi-hyphen prefixes.

**Operational rule either way:** the orchestrator is responsible for rejecting merge outputs with duplicate IDs.

---

## Skill authoring guide (keep SKILL.md sharp)

This is the template to converge on (mirrors strong public skill patterns):

1) **Frontmatter**
- `name`, `description` only (keep it short; be precise about when to use).

2) **What the skill does**
- one paragraph
- explicit “Read-only / Write” statement

3) **Decision tree**
- a short “if X → do Y” flow so the agent doesn’t freestyle

4) **Required output contract**
- exactly what to return (and what not to do)

5) **Default scope**
- folders/globs only

6) **Checklist**
- bullet list of what to look for

7) **Fast signals**
- one script command (`node .../scan.mjs`) + a few `rg` snippets
- treat scripts as black boxes first (run `--help` if applicable) before reading code

8) **Examples**
- 2–4 examples of prompts that correctly trigger the skill

9) **Guidelines**
- 5–10 bullets of “do/don’t”

### Line limits (why it matters)

- Target `SKILL.md` size: **≤ 300 lines** (hard cap **≤ 500**).
- Deep material goes in `references/` as small topic files (≤ 200–300 lines each).
- Why: keeps the activation payload tight and improves response reliability under context limits.

---

## Operating guide (how humans + agents use this day-to-day)

### “Audit-first” loop (default)

1) `ORCH:` frames goal and selects bundle.
2) Orchestrator spawns audits in parallel:
   - lanes (`treido-frontend`/`treido-backend`) in `AUDIT:` mode as needed
   - spec agents for deep checks when risk is high
3) Orchestrator merges into `.codex/audit/YYYY-MM-DD_<context>.md`.
4) Orchestrator promotes tasks into `.codex/TASKS.md` (≤15 Ready, ≤20 total).
5) Implementer executes 1–3 file batch.
6) `VERIFY:` runs gates (and minimal tests).
7) Repeat.

### When to skip spec agents

Skip when the change is trivial and already covered by gates:
- tiny copy changes (still next-intl)
- small layout tweaks in one file that obviously won’t touch boundaries

Run spec agents when:
- you touch `components/ui/*`, any drawers/dialogs, or cross-route shells
- you touch cached server code (`'use cache'`)
- you touch `proxy.ts` / auth glue
- you touch Supabase migrations/policies

---

## Concrete proposals to adopt (short list)

1) **Integrate spec agents into orchestrator bundle matrix**
- UI-high-risk and Full audits should spawn `spec-*` in parallel by default.

2) **Resolve ID collisions**
- Prefer Option A: only spec agents emit domain prefixes (`NEXTJS-###`, `TW4-###`, `SHADCN-###`, `SUPABASE-###`).
- Lane audits use lane IDs for everything else.

3) **Fix SSOT path drift**
- Replace “SSOT is `docs/*`” references with `.codex/project/*` in the control-plane docs and audit README.

4) **Add “Examples” + “Guidelines” blocks to each Treido skill**
- This is a consistent missing piece compared to the best public skills.

5) **Enforce structure via automation**
- Keep `pnpm -s validate:skills` and expand it if needed to:
  - ensure each skill has at least 2 Examples
  - ensure read-only skills explicitly say “do not patch”

---

## Suggested prompt templates

### Orchestrator: UI high risk audit

```md
ORCH:AUDIT
Goal: Fix mobile drawer scroll + performance regressions.
Scope hints: components/ui/drawer.tsx, components/mobile/drawers/*, app/[locale]/locale-providers.tsx
Risk: high (mobile gestures + RSC boundaries)

Run spec audits: SPEC-NEXTJS, SPEC-SHADCN, SPEC-TAILWIND.
Return merged `.codex/audit/YYYY-MM-DD_drawer-scroll.md`.
```

### Spec agent invocation

```md
SPEC-SHADCN:AUDIT
Goal/context: Audit drawer primitive + usage for scroll/gesture conflicts.
Scope hints: components/ui/drawer.tsx, components/mobile/drawers/product-quick-view-drawer.tsx
Return ONLY the audit payload section.
```

---

## Appendix: what we copy from anthropics/skills (high-signal)

From Anthropic’s public skill repo:

- Skills are self-contained folders with `SKILL.md` + optional scripts/resources.
- Their SKILL template explicitly includes **Examples** and **Guidelines**.
- Some skills emphasize using helper scripts as “black boxes” first to avoid context bloat (e.g. `webapp-testing`).

We should copy the **structure**, not the aesthetics (Treido’s design rails differ, and our UI intentionally bans gradients/arbitrary values even though some “frontend-design” style skills encourage them).

