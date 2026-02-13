# PROMPTS.md — Prompt Packets

> Copy-paste **one** packet per new chat to keep work deterministic and reviewable.

| Scope | Prompt packets for AI agents |
|-------|------------------------------|
| Audience | AI agents, developers |
| Owner | treido-orchestrator |
| Last verified | 2026-02-12 |
| Refresh cadence | Weekly + whenever workflow/gates change |
| Last updated | 2026-02-12 |

---

## 1) Choose A Mode

| Mode | What you want | Mutating? |
|------|---------------|-----------|
| `implement` | Make changes and ship | ✅ |
| `review` | Find bugs/risks, no edits | ❌ |
| `plan` | Produce a decision-complete plan | ❌ |
| `audit` | Validate + record evidence, no edits | ❌ |

Default: if unsure, use `review` first.

---

## 2) Prompt Packet v2 (Copy-Paste)

```text
Mode:
<implement | review | plan | audit>

Goal:
<1-2 sentences>

Scope:
<paths/routes to change or inspect>

Do not touch:
<explicit exclusions>

Docs to follow:
AGENTS.md
docs/WORKFLOW.md
<add relevant docs/* as needed>

Done means:
<expected behavior + required outputs>

Verification:
<exact commands to run, or "none" for review/audit>

Risk:
<low-risk | high-risk>

Evidence (audit only):
<where to record results + what artifacts to attach>
```

---

## 3) Packets

### Implement (Low-Risk)

```text
Mode:
implement

Goal:
<ship a small UI/docs/refactor change>

Scope:
<paths>

Do not touch:
DB schema, auth, payments, bulk data ops

Docs to follow:
AGENTS.md
docs/WORKFLOW.md
docs/DESIGN.md

Done means:
<what changed and what remains unchanged>

Verification:
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate

Risk:
low-risk
```

### Implement (High-Risk)

Use this only when you explicitly intend to touch high-risk domains. If the task drifts into a pause domain, stop and align with a human.

```text
Mode:
implement

Goal:
<auth/payments/db/etc change>

Scope:
<paths>

Do not touch:
<anything not required for the goal>

Docs to follow:
AGENTS.md
docs/WORKFLOW.md
<docs/AUTH.md | docs/PAYMENTS.md | docs/DATABASE.md as applicable>

Done means:
<expected behavior + rollback/mitigation notes>

Verification:
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke

Risk:
high-risk
```

### Review (Non-Mutating)

```text
Mode:
review

Goal:
Review <feature/flow> for bugs, regressions, and missing tests.

Scope:
<paths/routes>

Do not touch:
no code changes, review only

Docs to follow:
AGENTS.md
docs/WORKFLOW.md
<relevant docs/*.md>

Done means:
findings ordered by severity, with file references and concrete fix suggestions

Verification:
none

Risk:
<low-risk | high-risk>
```

### Plan (Decision-Complete)

```text
Mode:
plan

Goal:
Plan <work> with sequencing, interfaces, edge cases, and verification.

Scope:
<paths/routes>

Do not touch:
no code changes

Docs to follow:
AGENTS.md
docs/WORKFLOW.md
<relevant docs/*.md>

Done means:
decision-complete plan (no open decisions for the implementer)

Verification:
none

Risk:
<low-risk | high-risk>
```

### Audit (Non-Mutating Evidence)

```text
Mode:
audit

Goal:
Audit <flow> and record evidence for launch readiness.

Scope:
production-audit/<phase>.md
<runtime paths under inspection>

Do not touch:
no code changes; audit-only

Docs to follow:
AGENTS.md
docs/WORKFLOW.md
docs/TESTING.md
docs/PRODUCTION.md

Done means:
evidence recorded in production-audit docs with outcomes + issue IDs + artifacts

Verification:
<only if you are explicitly running a check, e.g. pnpm -s test:e2e:smoke>

Risk:
low-risk

Evidence (audit only):
Use production-audit/TEMPLATE.md and include screenshots/trace refs where applicable.
```

---

*Last updated: 2026-02-12*
