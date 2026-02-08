# WORKFLOW.md — Dev Workflow & Prompt Guide

> How to ship: the 4-step loop, verification gates, pause rules, and prompt formatting.

| Scope | Development workflow, CI gates, prompt standards |
|-------|--------------------------------------------------|
| Audience | AI agents, developers |
| Type | Process Reference |
| Last updated | 2026-02-08 |

---

## 1. Shipping Workflow

Every task follows a 4-step loop: **Frame → Implement → Verify → Report.**

### Step 1: Frame

Define before writing any code:

- **Goal** — what you're achieving (1–2 sentences)
- **Scope** — paths / routes that will change
- **Non-goals** — what must NOT be touched
- **Risk lane:**
  - **Low-risk:** UI, docs, refactor, tests
  - **High-risk:** DB, auth, payments, destructive operations

### Step 2: Implement

- Work in small, reviewable batches
- Keep changes scoped to the declared paths
- Prefer direct fixes over speculative rewrites

### Step 3: Verify

Run only the checks that match the changed surface.

**Code changes (always):**

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

**Risk-based (business logic, data, integrations):**

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

**Docs / policy changes:**

```bash
pnpm -s docs:check
```

### Step 4: Report

Every implementation response must include:

1. **Files changed** — list of paths modified / created / deleted
2. **Commands run** — which gates were run and pass/fail status
3. **Risks & follow-ups** — assumptions, skipped checks, deferred items

---

## 2. Gate Commands

| Command | Purpose | When |
|---------|---------|------|
| `pnpm -s typecheck` | TypeScript (`tsc --noEmit`) | Every change |
| `pnpm -s lint` | ESLint | Every change |
| `pnpm -s styles:gate` | Tailwind token/palette scan | Every change |
| `pnpm -s test:unit` | Vitest unit tests | Business logic changes |
| `pnpm -s test:unit:coverage` | Unit tests + coverage thresholds | Changes to `lib/` or `hooks/` |
| `pnpm -s test:e2e:smoke` | Playwright smoke tests | Route/flow changes |
| `pnpm -s test:e2e` | Full E2E (all browsers) | Pre-deploy |
| `pnpm -s test:a11y` | Accessibility tests | UI changes |
| `pnpm build` | Production build | Pre-deploy |

### Full Pre-Deploy Gate

```bash
pnpm -s lint && pnpm -s typecheck && pnpm -s styles:gate && pnpm -s test:unit && pnpm build
```

---

## 3. High-Risk Pause Domains

**Stop and explicitly align with a human before finalizing changes to:**

| Domain | Examples |
|--------|----------|
| DB schema / migrations / RLS | Adding tables, altering columns, changing row-level security |
| Auth / session / access control | Login flows, role checks, middleware auth gating |
| Payments / Stripe / webhooks | Checkout, Connect, subscription billing, webhook handlers |
| Destructive / bulk data ops | DELETE queries, data backfills, mass updates |

These are non-negotiable pause points regardless of task urgency.

---

## 4. Prompt Formatting Guide

Use this format to get predictable, high-quality results from AI agents.

### One Prompt Packet

```text
Goal:
<1-2 sentences>

Scope:
<paths/routes to change>

Do not touch:
<paths/features to keep unchanged>

Docs to follow:
<docs/*.md references>

Done means:
<expected behavior and outputs>

Verification:
<exact commands to run>

Risk:
<low-risk | high-risk>
```

### Example: Implement

```text
Goal:
Fix mobile category chips spacing and hierarchy.

Scope:
components/mobile/category-nav/*

Do not touch:
data fetching or backend logic

Docs to follow:
docs/DESIGN.md
docs/WORKFLOW.md

Done means:
consistent spacing, no regression in active states

Verification:
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate

Risk:
low-risk
```

### Example: Review

```text
Goal:
Review checkout auth flow for bugs and regressions.

Scope:
app/[locale]/(checkout)/**
app/[locale]/(auth)/**

Do not touch:
no code changes, review only

Docs to follow:
docs/AUTH.md
docs/WORKFLOW.md

Done means:
findings ordered by severity with file references

Verification:
none

Risk:
high-risk
```

### Example: Plan

```text
Goal:
Plan migration from numbered docs links to semantic docs links.

Scope:
docs/**

Do not touch:
application runtime code

Docs to follow:
docs/INDEX.md

Done means:
decision-complete plan with sequence, risks, and checks

Verification:
pnpm -s docs:check

Risk:
low-risk
```

### Anti-Patterns

- "Fix this" without scope
- Missing "Do not touch" section
- Missing verification commands
- High-risk requests without explicitly labeling risk

---

## See Also

- `AGENTS.md` (root) — AI execution contract, context loading map
- `docs/TESTING.md` — Test strategy, coverage, QA protocol
- `docs/PRODUCTION.md` — Launch readiness tracker

---

*Last updated: 2026-02-08*
