# WORKFLOW.md — Shipping Loop (V2)

> The chat is the workflow. Keep batches small, follow rails, run gates.

| Scope | How work ships in this repo |
|-------|-----------------------------|
| Audience | AI agents, developers |
| Type | Reference |

---

## Default Loop

### 1) Frame

- State the goal (1–2 sentences)
- Name the scope (paths/routes) and non-goals
- Classify risk:
  - **Low-risk**: UI/styling, refactors, tests, docs
  - **High-risk**: DB/auth/payments/destructive operations (see pause conditions)

### 2) Implement

- Work in **small batches** (1–3 files) when possible
- Apply the relevant knowledge automatically:
  - UI/routes/i18n → `treido-frontend`
  - server/actions/Supabase/Stripe → `treido-backend`
  - always-on rails → `treido-rails`

### 3) Verify

Always after each batch:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
```

Risk-based:

```bash
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke
```

### 4) Record (Optional)

- Tasks: `.codex/TASKS.md`
- Decisions: `.codex/DECISIONS.md`

---

## Pause Conditions (High Risk)

Stop and ask for explicit human approval before implementing:

- DB schema changes, migrations, RLS policies
- Auth/access control/session handling
- Payments/Stripe/webhooks
- Destructive/bulk data operations

---

## Output Expectations

For implementation work:

- List the files changed
- List the verification commands run and their result
- No additional “audit artifacts” unless explicitly requested

---

*Last updated: 2026-02-03*
