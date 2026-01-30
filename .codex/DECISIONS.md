# Decisions (Lightweight ADR Log)

Purpose: capture the final call after Codex <-> Opus debate, without keeping huge conversation context.

Rules:
- Append-only.
- Keep each decision small (target: <= 60 lines).
- Link to the task(s) in `TASKS.md` when relevant.

---

## Template

```md
## DEC-YYYY-MM-DD-##

Status: accepted | superseded | deprecated
Owners: treido-frontend | treido-backend | treido-supabase-mcp | treido-audit

Context
- What problem are we solving?
- What constraints/rails apply?

Decision
- What we will do (concrete).

Why
- Key tradeoffs and reasoning.

Consequences
- What becomes easier/harder?
- Any follow-ups / migration notes?

Links
- Conversation: .codex/CONVERSATION.md (or archived thread)
- Tasks: TASKS.md (task ids / section)
```

---

## DEC-2026-01-29-01

Status: accepted
Owners: treido-audit

Context
- We need reusable “agent skills” without 10–15 overlapping micro-checklists.
- We want fast shipping, low drift, and predictable audits.

Decision
- Standardize on 4 core repo skills:
  - `treido-frontend`
  - `treido-backend`
  - `treido-supabase-mcp`
  - `treido-audit`
- Move best practices into `.codex/references/*` instead of separate micro-skills.

Why
- Domain ownership reduces overlap.
- References keep the skill bodies short and stable.

Consequences
- If we later see repeated misses in a domain, we can add ONE more skill (e.g., `treido-quality`) backed by evidence.

Links
- Conversation: .codex/OPUS_CODEX_AGENT_DISCUSSION.md

---

## DEC-2026-01-29-02

Status: accepted
Owners: treido-audit

Context
- We want to consistently use Codex repo skills without adding process overhead.
- We want an Opus <-> Codex debate loop that does not burn tokens or rot.
- We want task ownership conventions to prevent churn in `TASKS.md`.

Decision
- Skill activation:
  - User can force skill with prefixes: `FRONTEND:`, `BACKEND:`, `SUPABASE:`, `AUDIT:`.
  - If not prefixed, Codex infers the owner skill but MUST still declare it explicitly.
- Response header:
  - Every response that does work starts with: `Using skill: <skill-name>`.
- Opus collaboration:
  - Use `.codex/CONVERSATION.md` for the single active debate thread.
  - After agreement, record the result in `.codex/DECISIONS.md`, then truncate `.codex/CONVERSATION.md`.
  - Default: delete/truncate; only archive full threads to `.codex/archive/YYYY-MM-DD-topic.md` when future debugging context is clearly valuable.
- Handoff signal:
  - End task completions with either `OPUS: review?` (when we want Opus to engage) or `DONE (no review needed)`.
- Tasks ownership:
  - Every task in `TASKS.md` has an Owner (one of the 4 core skills).
  - Owners update only their own tasks (notes/status); `treido-audit` can re-triage/reassign.
- Stale tasks:
  - Weekly `treido-audit` sweep marks tasks stale after 7 days of no movement and either re-triages or de-scopes.

Why
- Explicit “Using skill” prevents silent inference and keeps humans aligned.
- Two-file debate loop prevents context rot.
- Ownership avoids churn.

Consequences
- Minor discipline required: always add owner + handoff line.

Links
- Conversation: .codex/CONVERSATION.md (truncated after recording)
- Tasks: TASKS.md

---

## DEC-2026-01-29-03

Status: accepted
Owners: treido-frontend | treido-backend | treido-supabase-mcp | treido-audit

Context
- We want to use multiple terminals (Opus + Codex) without creating conflicts in `TASKS.md`.
- We want "skills" to be runnable via prompt templates, not vague vibes.

Decision
- Standardize a 3-phase workflow for parallel work:
  - Phase 1 (AUDIT): parallel terminals allowed; output findings to console only; no code edits; no `TASKS.md` edits.
  - Phase 2 (PLAN): sequential; a single designated writer consolidates findings into `TASKS.md` (add Owner + phase tag).
  - Phase 3 (EXECUTE): parallel terminals allowed; each skill works only on its own disjoint tasks; `TASKS.md` edits are sequential (single-writer rule).
- Cross-boundary findings:
  - Phase 1: report in console and label the correct Owner; do not fix.
  - Phase 2: the designated writer routes them into `TASKS.md`.
- Add to each skill `SKILL.md`:
  - "Default Scope" (folders/patterns for Phase 1 scans)
  - copy/paste prompt templates for Audit / Plan / Execute

Why
- Parallelize safe work (scanning + disjoint code changes).
- Serialize the control plane (`TASKS.md`) to avoid merge conflicts and churn.

Consequences
- Requires discipline: only one terminal edits `TASKS.md` at a time.
- Phase 1 audits must be scoped (explicit paths > git diff > gates + targeted `rg`).

Links
- Conversation: .codex/CONVERSATION.md
- Tasks: TASKS.md

---

## DEC-2026-01-29-04

Status: accepted
Owners: treido-audit

Context
- We want Treido skills to follow the Agent Skills progressive-disclosure pattern and remain portable per-skill.
- Shared `.codex/references/` caused portability + drift risk.

Decision
- Keep `SKILL.md` lean and move deep-dive docs into per-skill `references/`.
- Delete `.codex/references/` and update all pointers to the new per-skill locations.
- Remove any requirement to print "Using skill: ..." in chat output (skills influence behavior, not formatting).

Why
- Progressive disclosure: load extra context only when relevant.
- Portability: each skill folder can be copied as a unit.
- Less spam: keep user-facing output clean.

Consequences
- Some duplication is acceptable if it keeps skills self-contained.
- Supersedes older references to `.codex/references/*` and "Using skill" output rules.

Links
- Conversation: .codex/CONVERSATION.md

---

## DEC-2026-01-29-05

Status: accepted
Owners: treido-audit | treido-frontend | treido-backend | treido-supabase-mcp

Context
- We want to run a full codebase restructure/refactor (many files, cross-boundary) without parallel agents conflicting.
- We already have the 3-phase workflow for parallel work (DEC-2026-01-29-03); we need a “program mode” to make dependencies explicit and keep the branch green.

Decision
- Use “Full Refactor Mode” = global 3-phase + human review gate:
  - Phase 1 (AUDIT): parallel, read-only scans by each Owner; console-only findings with Owner labels; no code edits; no `TASKS.md` edits.
  - Phase 2 (PLAN): single writer (`treido-audit`) consolidates into `TASKS.md` with task IDs, Owners, dependencies (`depends on …`), and round labels.
  - Phase 2.5 (REVIEW): human approves/reorders/scope-cuts and sets round/batch sizes.
  - Phase 3 (EXEC): parallel execution by Owners, round-by-round; 1–3 files per batch; run gates after each batch; if gates go red, pause all EXEC work until reverted/fixed and green again; single-writer rule for `TASKS.md` updates.

Why
- Parallel audits maximize coverage without creating conflicting changes.
- Consolidated planning forces explicit dependencies and sequencing.
- Green-gate checkpoints keep the refactor reversible and shippable.

Consequences
- More upfront planning and one human checkpoint before big moves.
- `TASKS.md` becomes the source for ordering and dependency tracking during the refactor program.

Links
- Conversation: .codex/CONVERSATION.md
- Tasks: TASKS.md

---

## DEC-2026-01-29-06

Status: accepted
Owners: treido-audit | treido-frontend | treido-backend | treido-supabase-mcp

Context
- In “Full Refactor Mode”, Phase 1 audits across domains generate many findings.
- `treido-audit` should not be required to “out-expert” specialists; consolidation must be mostly mechanical to avoid misinterpretation and conflicting work.

Decision
- In Phase 1 (AUDIT), each Owner produces **task proposals** (not freeform findings) using a strict template:
  - `id:` (e.g. `FE-001`, `BE-003`, `SB-002`)
  - `severity:` Critical | High | Medium
  - `scope:` paths/routes
  - `problem:` 1–2 lines
  - `suggested fix:` 1–2 lines
  - `deps:` optional list of other ids
  - `owner:` fixed to their skill
- Add this template to each skill’s Phase 1 prompt templates so outputs are consistent.
- In Phase 2 (PLAN), `treido-audit` consolidates proposals into `TASKS.md` (Owners + deps + rounds). Ambiguous proposals are sent back to the Owner for clarification instead of guessed.
- `treido-audit` runs both:
  - **Pre**: consolidation + sequencing (Phase 2)
  - **Post**: rails/gates verification after execution batches (Phase 3/REVIEW)

Why
- Makes consolidation deterministic and reduces cross-domain misunderstandings.
- Keeps specialists responsible for domain correctness, while `treido-audit` manages sequencing and rails.

Consequences
- Slightly more structured Phase 1 output, but less planning churn and fewer conflicts.

Links
- Conversation: .codex/CONVERSATION.md
- Tasks: TASKS.md

---

## DEC-2026-01-29-07

Status: accepted
Owners: treido-audit

Context
- Opus (VS Code) and Codex (CLI) coordinate in two terminals and can easily create merge conflicts or doc sprawl.
- We want Opus + Codex to act as orchestrators/architects, and the repo skills to act as executors.

Decision
- Use a 3-layer coordination model:
  - **Work queue (control plane):** `TASKS.md` (single-writer rule)
  - **Debate + decisions (control plane):**
    - `.codex/CONVERSATION.md` as the single active thread, kept short and truncated after a decision
    - `.codex/DECISIONS.md` as the append-only final log
  - **Long-form notes (no shared editing):**
    - `codex+opus/opus.md` (Opus only)
    - `codex+opus/codex.md` (Codex only)
- `.codex/CONVERSATION.md` includes a `Current State` header (workflow/stage/blockers/next) for fast context pickup.
- Apply a **single-scribe** rule per thread: the thread opener is the scribe (unless explicitly handed off). The scribe copies/summarizes the other side’s response into `.codex/CONVERSATION.md`, records the decision in `.codex/DECISIONS.md`, then truncates `.codex/CONVERSATION.md` back to the template.
- Do not use `CLAUDE.md` as an inbox/chat log (tool compatibility shim).

Why
- Prevents concurrent edits to shared files while still enabling structured debate and a durable decision trail.
- Keeps “control plane” files low-churn and prevents markdown sprawl.

Consequences
- Requires discipline: one active thread at a time and explicit scribe ownership.

Links
- Conversation: .codex/CONVERSATION.md
- Tasks: TASKS.md

---

## DEC-2026-01-29-08

Status: accepted
Owners: treido-audit
Supersedes: DEC-2026-01-29-07

Context
- The `codex+opus/*` long-form outboxes duplicated purpose once `.codex/CONVERSATION.md` + `.codex/DECISIONS.md` were in place.
- The previous `.codex/CONVERSATION.md` template was too verbose and risked “template rot”.
- A strict “single-scribe” rule felt like process overhead for quick exchanges.

Decision
- Delete `codex+opus/` (obsolete).
- Keep `.codex/CONVERSATION.md` as the single active thread, but simplify the template to:
  - `Current State` (2 lines: `State`, `Next`)
  - `Thread` (Prompt + OPUS + CODEX)
- Replace “single-scribe rule” with a lighter constraint:
  - Avoid concurrent edits; if both terminals need to write, pick a temporary scribe for that thread.

Why
- Reduces friction and prevents process/tooling from becoming the product.
- Keeps coordination durable without requiring people to fill out lots of metadata.

Consequences
- Requires basic discipline: truncate after decisions and avoid two terminals editing the same file at once.

Links
- Conversation: .codex/CONVERSATION.md

---

## DEC-2026-01-29-09

Status: accepted
Owners: treido-audit | treido-frontend | treido-backend | treido-supabase-mcp
Supersedes: DEC-2026-01-29-06

Context
- Phase 1 “task proposals” are useful for fast consolidation, but the 7-field block format was too heavy for real usage.

Decision
- Keep Phase 1 output as “task proposals”, but use a **minimal, one-line format**:
  - `<ID> (<severity>) <scope> — <problem -> suggested fix>`
  - Optional second line only when needed: `deps:` and/or `handoff:`
- Update Phase 1 prompt templates in all 4 skills to match this format.

Why
- Retains the consolidation benefits without turning audits into ticket-writing.

Consequences
- Less friction in Phase 1, while still enabling dependency references when the refactor program scales up.

Links
- Conversation: .codex/CONVERSATION.md
