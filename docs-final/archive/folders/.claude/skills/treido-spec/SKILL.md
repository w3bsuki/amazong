---
name: treido-spec
description: Spec-driven development skill using .specs/ folder system. Triggers on "SPEC:" prefix and feature planning requests.
---

# Treido Spec (Spec-Driven Development)

Use this skill to turn a vague request into an execution-ready spec in `.specs/`.

## .specs System

All specs live in `.specs/` with folder-based lifecycle:
- `.specs/queue/` — Ready to start (prioritized)
- `.specs/active/` — Currently being worked (max 3)
- `.specs/completed/` — Done and verified
- `.specs/blocked/` — Waiting on external

Each spec folder contains:
- `requirements.md` — EARS-notation requirements + acceptance criteria
- `tasks.md` — Checkable task list
- `context.md` — Agent handoff notes

**Key files:**
- `.specs/README.md` — System overview
- `.specs/AGENT-PROTOCOL.md` — Claude ↔ Codex collaboration rules
- `.specs/ROADMAP.md` — Master production launch roadmap
- `.specs/templates/` — Spec templates (feature, audit, refactor)

## Entry Criteria (ask if missing)

- Outcome: what should the user be able to do?
- Constraints: "no schema changes", "no new deps", preserve URLs/UI, etc.
- Surfaces: which routes/screens are involved (or "unknown").
- Success criteria: UX + correctness + perf + tests.

## On Any "SPEC:" Prompt

1. Load the relevant canonical docs:
   - UI/i18n: `docs/FRONTEND.md` + `docs/DESIGN.md`
   - Data/auth/payments: `docs/BACKEND.md` + `docs/ENGINEERING.md`
   - Tests/gates: `docs/TESTING.md`
2. Check `.specs/ROADMAP.md` for existing related specs
3. Choose template from `.specs/templates/`:
   - `feature-spec.md` — New features
   - `audit-spec.md` — Audits/reviews
   - `refactor-spec.md` — Refactoring work
4. Create spec folder in `.specs/queue/<spec-name>/`:
   - `requirements.md` — Fill template
   - `tasks.md` — Decomposed shippable steps
   - `context.md` — Initial state
5. Update `.specs/queue/INDEX.md` with new spec
6. Generate copy/paste prompts for execution roles

## Spec Folder Structure

```
.specs/queue/<spec-name>/
├── requirements.md   # EARS requirements + acceptance criteria
├── tasks.md          # Checkable task list
└── context.md        # Agent handoff context
```

## Task Decomposition Rules

- Each task is 1–3 files max
- Each task can be verified independently
- Every task includes verification (gates + any targeted tests)
- Tasks are sequenced by dependency

## Agent Prompts (copy/paste)

Generate prompts for execution roles:
- `FRONTEND:` for UI work
- `BACKEND:` for server actions/route handlers
- `SUPABASE:` for RLS/migrations audits
- `TAILWIND:` / `SHADCN:` for styling
- `I18N:` / `NEXTJS:` / `TS:` / `TEST:` / `PERF:` / `A11Y:` / `STRIPE:` as needed

## Verification Gates

All specs must pass before completion:
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Workflow

1. **Create**: `SPEC: <description>` → creates in `queue/`
2. **Start**: Move from `queue/` → `active/`
3. **Execute**: Work through `tasks.md`, update `context.md`
4. **Verify**: Codex runs gates and reviews
5. **Complete**: Move from `active/` → `completed/`, create `summary.md`

## Examples

### Example: Create new spec
```
SPEC: plan saved searches for buyers
```

### Example: Start working on spec
```
TREIDO: Start .specs/queue/p0-turbopack-crash, move to active
```

### Example: Codex verification
```
/verify active/p0-turbopack-crash
```
