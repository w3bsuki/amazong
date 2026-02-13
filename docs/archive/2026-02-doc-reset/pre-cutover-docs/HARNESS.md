# HARNESS.md — Execution Harness Contract

> Operational contract for shipping and auditing with predictable, reviewable outputs.

| Scope | Failure handling, retries, timeouts, evidence, escalation |
|-------|----------------------------------------------------------|
| Audience | AI agents, developers |
| Owner | treido-orchestrator |
| Last verified | 2026-02-12 |
| Refresh cadence | Weekly + whenever gates/tooling change |
| Last updated | 2026-02-12 |

---

## 1) Purpose

This harness exists to make work:
- **Predictable** (same inputs produce the same outputs),
- **Reviewable** (small batches, explicit scope, evidence of verification),
- **Safe** (pause rules and escalation triggers),
- **Debbuggable** (failures classified with next actions).

Non-goals:
- Replacing product decisions (those require human alignment).
- Bypassing pause domains (DB/auth/payments/destructive ops).

---

## 2) Execution Model

Treido uses a single execution loop for all tasks:

1. **Frame** (goal, scope, non-goals, risk)
2. **Implement** (small, scoped batches)
3. **Verify** (run the required gates)
4. **Report** (files changed, commands run, risks/follow-ups)

The canonical prompt schema is `Prompt Packet v2` in `docs/WORKFLOW.md`.

Modes:
- `implement`: allowed to mutate repo state
- `review`: no mutations (findings only)
- `plan`: no mutations (decision-complete plan)
- `audit`: no mutations (evidence + findings)

---

## 3) Failure Classes And What To Do

### A) Typecheck/Lint/Style Gate Fails

Contract:
- Fix root cause, not symptoms.
- Keep changes within declared scope.
- Re-run the failing gate until green.

### B) Unit Tests Fail

Contract:
- If failures are adjacent to your change: fix them.
- If unrelated: record as a blocker and stop expanding scope.

### C) E2E/Playwright Failures

Contract:
- Classify as deterministic vs flaky.
- Deterministic: fix or file a blocker with repro steps.
- Suspected flaky: re-run once with trace; if still failing, treat as deterministic.

### D) Infra/Env Problems

Examples:
- Missing env vars for auth fixtures
- Supabase/Stripe credentials not present
- Playwright server reuse misconfigured

Contract:
- Do not guess. Record which variable/config is missing and the minimal steps to provide it.
- Prefer skipping tests that require missing credentials over inventing workarounds.

### E) High-Risk Domains (Pause)

If the task crosses into:
- DB schema/migrations/RLS
- Auth/session/access control
- Payments/webhooks/billing
- Destructive/bulk data operations

Contract:
- Stop and explicitly align with a human before finalizing.
- Provide a concrete diff plan and a rollback plan.

---

## 4) Retry And Timeout Policy

Retries:
- Default: **no blind retries**.
- Allowed: **one** retry for suspected flaky E2E failures (with trace/video enabled).
- Allowed: **one** retry for transient network installs if logs indicate a fetch error.

Timeouts:
- Prefer keeping timeouts explicit in scripts/tools rather than ad-hoc local overrides.
- If raising a timeout is necessary, document why and add it to the script/config (not the prompt).

---

## 5) Evidence And Artifacts

### Implementation Work

Minimum evidence in the final report:
- Files changed
- Commands run (pass/fail)
- Risks/follow-ups

### Audit Work (production-audit)

Audit output is a set of written phase documents with scenario outcomes and artifacts.

- Use `production-audit/TEMPLATE.md` for new phases.
- Evidence must be attributable: include the date and who ran it.
- If using screenshots/traces, record the artifact name/path.

---

## 6) Escalation Triggers (Human Handoff)

Stop and ask for alignment when:
- A pause domain is touched (see §3E)
- A requirement is ambiguous or requires policy interpretation (legal, refunds, disputes)
- A security finding is discovered (secrets, auth bypass, RLS holes)
- Fix would require large refactor outside scope

---

## 7) Security And Privacy

- Never paste real secrets (API keys, webhook secrets, service role keys) into logs or docs.
- Prefer describing where a secret is configured (`.env.local`, Vercel env vars) rather than its value.
- Do not log PII in client-visible logs.

---

*Last updated: 2026-02-12*
