# treido-verify - Decision Tree (full)

This is the full verify decision tree: always-on gates first, then the smallest risk-based tests, then escalation.

---

## Step 0 - Always run gates

Always:
- `pnpm -s typecheck`
- `pnpm -s lint`
- `pnpm -s styles:gate`

Preferred helper (same gates, less typing):
- `node .codex/skills/treido-verify/scripts/run-gates.mjs`

If any gate fails:
- Stop and report FAIL with the smallest actionable error (file:line).

---

## Step 1 - Decide whether to run tests

### If the change is styling-only / UI-only
- Run: `pnpm -s test:unit`

### If the change touches routing/auth/checkout/webhooks/payments
- Run: `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

### If the change is uncertain risk
- Default to: `pnpm -s test:unit`
- Escalate to orchestrator if there’s disagreement about risk level.

---

## Step 2 - Optional lint of planning artifacts (read-only)

If there was a recent audit/plan batch:
- `node .codex/skills/treido-verify/scripts/lint-plan.mjs`

If it reports issues:
- Do not edit `.codex/TASKS.md` yourself; report to `treido-orchestrator`.

---

## Step 3 - Escalation mapping (who fixes what)

- Typecheck/lint failures in UI/components -> `treido-frontend`
- Tailwind rails failures -> `treido-frontend` (with `spec-tailwind` guidance if needed)
- Next.js caching/boundary hazards -> `treido-frontend` (with `spec-nextjs` clarification if needed)
- Supabase auth/RLS/policies/migrations -> `treido-backend` (pause if migration/policy changes are needed)
- Stripe/webhook failures -> `treido-backend`

---

## Step 4 - Reporting rules

- Report must start with `## VERIFY`.
- Include: Summary (PASS/FAIL), what ran, and the first actionable error with file:line.
- Never include secrets/PII.

