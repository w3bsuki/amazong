# AGENT 2: Backend (Opus 4.5)

> Terminal 2 — Backend/Data Production Sprint

## Quick Start Prompt
```
Read these files in order, then execute the tasks:
1. agents.md (repo rules)
2. docs/GPTVSOPUSFINAL.md (workflow)
3. docs/backend_tasks.md (queue)
4. docs/PRODUCTION.md (launch checklist)

Execute P0 tasks. Run Supabase advisors. Run gates after each change.
```

---

## Mission
Ship backend fixes that unblock production launch. Focus on:
1. Stripe checkout currency fix (P0 blocker)
2. Supabase security (advisors clean)
3. API robustness (error handling, no secrets logged)

## Context Files to Read
- `agents.md` — non-negotiable rails
- `docs/ENGINEERING.md` — stack rules + boundaries
- `docs/GPTVSOPUSFINAL.md` — workflow + handoff format
- `docs/backend_tasks.md` — current P0 queue
- `docs/PRODUCTION.md` — launch blockers checklist
- `supabase_tasks.md` — Supabase-specific tasks

## P0 Execution Queue

### Task 1: Stripe Currency Mismatch
**Problem:** `/en/plans` checkout fails due to EUR vs BGN currency mismatch.

**Files:** `app/api/subscriptions/checkout/route.ts`, `lib/stripe-locale.ts`, potentially `supabase/` price config

**Done when:**
- Checkout creates Stripe session without currency error
- Return URLs use correct locale prefix
- Gates pass

### Task 2: Supabase Security Advisors
**Run:** `mcp_supabase_get_advisors({ type: "security" })`

**Done when:**
- 0 actionable security warnings (or explicitly documented deferrals)
- RLS policies validated for user-facing tables
- `TASK-enable-leaked-password-protection.md` handed to human if dashboard-only

### Task 3: Payments E2E Verification
**Surface:** `/en/plans` → Stripe checkout → return to `/en/account/plans`

**Done when:**
- Full checkout flow works (test mode)
- Webhook handles `checkout.session.completed` correctly
- Plan applied via `metadata.plan_id`

### Task 4: Performance Advisors (if time)
**Run:** `mcp_supabase_get_advisors({ type: "performance" })`

**Done when:**
- Unused indexes documented (defer removal until post-launch)
- No `select('*')` in hot paths
- Query shapes optimized where obvious wins exist

## Gates (run after EVERY change)
```bash
pnpm -s exec tsc -p tsconfig.json --noEmit
REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
```

## Rules (from agents.md)
- Use `createClient()` for cookie-aware server ops
- Use `createStaticClient()` for cached reads (no cookies)
- Use `createAdminClient()` ONLY for server-internal ops
- RLS enforced end-to-end for user writes
- Validate sessions with `getUser()` not `getSession()`
- Never log secrets/JWTs

## Supabase MCP Commands
```javascript
// Security audit (run FIRST on any DB task)
mcp_supabase_get_advisors({ type: "security" })

// Performance audit
mcp_supabase_get_advisors({ type: "performance" })

// Schema check
mcp_supabase_list_tables({ schemas: ["public"] })

// Diagnostic query
mcp_supabase_execute_sql({ query: "SELECT ..." })

// DDL (ask first!)
mcp_supabase_apply_migration({ name: "...", query: "..." })
```

## Handoff Format
After each task, update docs/backend_tasks.md with:
```markdown
## Batch Log entry

Batch name: BE - [description]
Owner: BE
Scope (1-3 files/features): [files]
Risk: low / med / high
Verification: `tsc` + `e2e:smoke`

Done when:
- [observable outcome]
- Gates pass
```

## Key Files Reference
- `lib/supabase/server.ts` — client factories
- `lib/stripe-locale.ts` — locale URL helpers
- `app/api/subscriptions/` — checkout/portal/webhook routes
- `app/actions/subscriptions.ts` — subscription actions

---

## Copy-Paste Start Command
```
I'm the Backend agent. Reading:
- agents.md
- docs/GPTVSOPUSFINAL.md
- docs/backend_tasks.md
- docs/PRODUCTION.md

Starting with: Supabase security advisors audit, then Stripe currency fix.
```
