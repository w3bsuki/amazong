# GUIDE.md — Workflow, Verification, Risk, Principles

> Consolidated execution contract for implementation work.

| Field | Value |
|-------|-------|
| Owner | treido-orchestrator |
| Last verified | 2026-02-15 |
| Refresh cadence | Weekly + whenever workflow, risk, or verification policy changes |

## Task Loop

1. Frame: define goal, scope boundaries, non-goals, and risk lane.
2. Implement: ship small, reviewable batches.
3. Verify: run the gates that match the changed surface. See Verification Matrix below.
4. Report: include changed files, verification outcomes, and risks/follow-ups.

Frame checklist before implementation:

- Goal is one sentence and testable.
- Scope and explicit non-goals are written.
- Risk lane is declared (`low-risk` or `high-risk`).
- High-risk domains are identified before editing starts.

## Risk Lanes

- `low-risk`: UI/docs/refactors/tests with no risky domain behavior changes.
- `high-risk`: any change touching DB, auth, payments, webhooks, or destructive data operations.
- `high-risk` work must follow High-Risk Pause before finalization.

Use the strictest lane when scope is mixed. If any touched surface is high-risk, treat the full task as high-risk.

## High-Risk Pause

### Stop-And-Ask Domains

Stop and align with a human before finalizing changes to:

- DB schema, migrations, or RLS policy behavior
- Auth/session/access control behavior
- Payments/webhooks/billing logic
- Destructive or bulk data operations

### Approval Log Format

Record approval in the implementation response or audit note:

```text
Risk Domain:
Requested Change:
Human Approval:
Date:
Rollback Plan:
```

### Rollback Expectations

- Describe rollback path before finalizing high-risk changes.
- Prefer reversible, small-batch migrations.
- If rollback is unclear, pause and resolve before merge.

## Verification Matrix

### Gate Matrix

| Change Surface | Required Commands |
|---|---|
| Any code change | `pnpm -s typecheck` + `pnpm -s lint` + `pnpm -s styles:gate` |
| Business logic / integrations | `pnpm -s test:unit` |
| User flow / route behavior | `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke` |
| Docs structure or contracts | `pnpm -s docs:check` |
| Release candidate | `pnpm -s lint && pnpm -s typecheck && pnpm -s styles:gate && pnpm -s test:unit && pnpm -s build` |

### When To Run Unit

Run the Business logic / integrations row above when logic changes in:

- `app/actions/**`
- `app/api/**`
- `lib/**`
- `hooks/**`

### When To Run E2E

Run the User flow / route behavior row above when route-level behavior, checkout/auth flow, or end-to-end state transitions are modified.

### Manual Checks

- Validate acceptance behavior described in the task goal.
- Confirm no scope creep into excluded files/features.
- For risky integrations, capture reproducible evidence in `production-audit/**`.
- Confirm docs changed in the same PR whenever runtime behavior changes.

### Release Checks

- Execute the Release candidate row above.
- Run `pnpm -s docs:advisory` to collect non-blocking documentation signals.
- Ensure any high-risk approvals and rollback notes are present in the final report.

## Report Format

Every implementation report must include:

1. Files changed (modified/created/deleted)
2. Verification commands run with pass/fail outcomes
3. Assumptions, risks, and deferred follow-ups

## Golden Principles

### 1. Parse At The Boundary, Trust Inside

Validate external input once at entry and keep typed data flowing inward. This prevents guessed shapes from leaking into runtime paths.

**Enforced by:** Zod schemas in `lib/validation/**`, webhook signature checks, and `safeParse()` at action/route boundaries.

### 2. Code Is Runtime Truth

Behavior disputes resolve to running code and migrations first, then documentation is aligned in the same change.

**Enforced by:** Execution rules in `AGENTS.md`, migration truth, and report requirements in this guide.

### 3. Semantic Tokens Only

Design-system bypasses create visual drift and make style regressions hard to control.

**Enforced by:** `pnpm -s styles:gate` scanners for palette classes, arbitrary values, and token-alpha shortcuts.

### 4. Never Use `getSession()` For Security Checks

Cookie-derived session reads are not enough for authorization decisions; server-verified user identity is required.

**Enforced by:** `lib/auth/require-auth.ts` helpers and architecture boundary tests.

### 5. No `select('*')` In Hot Paths

Wide selects increase payload size, reveal unnecessary schema surface, and reduce cache efficiency.

**Enforced by:** Architecture boundary tests and explicit projection conventions.

### 6. Supabase Client Selection Is Non-Negotiable

| Context | Client | Why |
|---|---|---|
| Server Components / Actions | `createClient()` | User-scoped reads/writes with auth cookies |
| Cached reads (`"use cache"`) | `createStaticClient()` | Cookie-free, cache-safe behavior |
| Route handlers | `createRouteHandlerClient(request)` | Request-scoped cookie access |
| Admin/webhooks | `createAdminClient()` | Service-role access after trust verification |

**Enforced by:** `lib/supabase/server.ts` client contracts and architecture boundary tests.

### 7. Route-Private Code Stays Private

Route-group internals are ownership boundaries, not shared modules.

**Enforced by:** Import-boundary tests and route-private folder conventions.

### 8. Webhooks Verify Before Writing

Verification first, writes second; retries must remain safe.

**Enforced by:** Signature verification in webhook handlers, idempotency constraints, and payments safety rules.

### 9. Server Components By Default

Defaulting to server render keeps data/auth logic centralized and minimizes unnecessary client state layers.

**Enforced by:** Frontend implementation defaults and component boundary guidance.

### 10. Respect The User's Device

Touch and motion quality is part of correctness, not polish.

- Touch targets: 44px default, 48px primary controls, 36px compact-only.
- No page-level horizontal overflow on mobile.
- Reduced motion support for non-essential animation.
- Keyboard-reachable interaction flows with visible focus.
- Safe-area utilities for notches/system chrome.

**Enforced by:** Mobile UX quality bar and accessibility checks.

### 11. High-Risk Domains Require Human Approval

Human checkpoints are mandatory for changes with irreversible or security-critical blast radius.

**Enforced by:** High-Risk Pause policy and approval log format in this guide.

### 12. Mechanical Enforcement Over Prose Promises

Rules that are not mechanically checked decay over time.

**Enforced by:** Verification Matrix gates plus boundary/style/contract checks wired into repository scripts.

## How Principles Evolve

1. When a recurring bug or confusion pattern appears, propose a principle update.
2. Encode the rule in a mechanical check where possible.
3. Add or revise the principle with an explicit `Enforced by` line.
4. Update dependent docs in the same change when conventions shift.
5. Retire duplicate wording from secondary docs once this guide is updated.

*Last updated: 2026-02-15*
