# Audit — 2026-02-02 — Dev Department / Agent System

## ORCH

### Scope

- Goal: turn Treido’s agent fleet into a production-shipping “dev department” (clear roles, SSOT docs, folder invariants, non-generic skills, maintenance cadence).
- Bundle: Agent-system / ORCH control plane
- Areas scanned: `docs/**`, `.codex/**`, root `AGENTS.md`, folder-level `*/AGENTS.md`, `.codex/skills/**`

### Findings

1. **ORCH-SSOT-001** (High) `.codex/AGENTS.md` and `.codex/WORKFLOW.md` were duplicating SSOT content. Converted to thin DEPRECATED pointers to restore “one truth”.  
   - Evidence: `.codex/AGENTS.md:1`, `.codex/WORKFLOW.md:1`
2. **ORCH-ROLES-002** (High) Added explicit DOCS + STRUCTURE roles (skills + doc wiring) so repo health and SSOT maintenance have owners.  
   - Evidence: `docs/15-DEV-DEPARTMENT.md:34`, `.codex/skills/treido-docs/SKILL.md:1`, `.codex/skills/treido-structure/SKILL.md:1`

### Acceptance Checks

- [ ] `pnpm -s validate:skills`
- [ ] `node .codex/skills/treido-orchestrator/scripts/lint-tasks.mjs`
- [ ] `node .codex/skills/treido-orchestrator/scripts/lint-audit.mjs .codex/audit/2026-02-02_dev-department-agent-system.md`

### Risks

- If skills/docs drift again, agents regress to generic advice. Mitigation: weekly cadence in `docs/15-DEV-DEPARTMENT.md`.

---

## DOCS

### Scope

- Files: `docs/DOCS-PLAN.md`, `docs/00-INDEX.md`, `docs/AGENTS.md`, `docs/15-DEV-DEPARTMENT.md`, `docs/agents/AGENTS_PHASES.md`

### Findings

1. **DOCS-SSOT-001** (High) DOCS-PLAN now explicitly defines SSOT vs archive docs to prevent archived content from becoming “truth”.  
   - Evidence: `docs/DOCS-PLAN.md:3`
2. **DOCS-ENTRY-002** (Medium) 00-INDEX is clarified as the *docs hub* (not the rails/workflow entry point).  
   - Evidence: `docs/00-INDEX.md:3`
3. **DOCS-DRIFT-003** (Low) Removed a duplicated “V1 % complete” claim from 00-INDEX to avoid numbers drifting away from `docs/02-FEATURES.md`.  
   - Evidence: `docs/00-INDEX.md:71`
4. **DOCS-REFS-004** (Medium) Agents phases doc now points SSOT references at `docs/AGENTS.md` / `docs/WORKFLOW.md`.  
   - Evidence: `docs/agents/AGENTS_PHASES.md:108`, `docs/agents/AGENTS_PHASES.md:378`

### Acceptance Checks

- [ ] `rg -n \"\\*\\*Purpose:\\*\\*\" docs/DOCS-PLAN.md`
- [ ] `rg -n \"\\*\\*Docs Hub\\*\\*\" docs/00-INDEX.md`

### Risks

- SSOT drift returns if we re-introduce duplicated summaries (counts/percentages) in multiple docs.

---

## SKILLS

### Scope

- Files: `.codex/skills/**` (focus: orchestrator + spec skills), `.codex/stack.yml`

### Findings

1. **SKILLS-STACK-001** (High) Skills now point to `.codex/stack.yml` for stack facts instead of hardcoding versions.  
   - Evidence: `.codex/skills/spec-nextjs/SKILL.md:14`, `.codex/stack.yml:7`
2. **SKILLS-SSOT-002** (High) Orchestrator + spec skills now cite SSOT docs in `docs/*` and use `.codex/stack.yml` as stack SSOT.  
   - Evidence: `.codex/skills/treido-orchestrator/SKILL.md:44`, `.codex/skills/spec-tailwind/SKILL.md:393`
3. **SKILLS-EXAMPLE-003** (Medium) Workflow example uses real repo paths to avoid “fictional structure” training.  
   - Evidence: `.codex/skills/treido-orchestrator/references/workflow-example.md:25`

### Acceptance Checks

- [ ] `pnpm -s validate:skills`
- [ ] `rg -n \"Stack SSOT\" .codex/skills/spec-nextjs/SKILL.md`

### Risks

- Remaining skills may still reference deprecated SSOT paths in `SKILL.md` (see `.codex/TASKS.md` `SKILLS-SSOT-002`).

---

## AGENTS

### Scope

- Files: root `AGENTS.md`, `app/**/AGENTS.md`, `components/**/AGENTS.md`, `lib/**/AGENTS.md`, `supabase/AGENTS.md`, plus new boundary dirs (`hooks/`, `i18n/`, `messages/`)

### Findings

1. **AGENTS-COVERAGE-001** (Medium) Root folder list now includes high-signal AGENTS layers for `app/actions`, `hooks`, `i18n`, and `messages`.  
   - Evidence: `AGENTS.md:22`, `AGENTS.md:25`
2. **AGENTS-BOUNDARY-002** (Medium) Added minimal invariants for `hooks/`, `i18n/`, and `messages/` to reduce repeated i18n + boundary regressions.  
   - Evidence: `hooks/AGENTS.md:1`, `i18n/AGENTS.md:1`, `messages/AGENTS.md:1`

### Acceptance Checks

- [ ] `rg --files -g \"AGENTS.md\" | rg -n \"^(hooks|i18n|messages)\\\\AGENTS\\.md$\"`

### Risks

- If AGENTS rules get long or start embedding “how-to” essays, they’ll stop being enforceable invariants.
