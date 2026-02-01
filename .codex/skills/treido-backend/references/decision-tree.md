# treido-backend - Decision Tree (full)

This is the full decision tree for the backend execution lane.

---

## Step 0 - Mode selection

- If request includes `AUDIT:` -> AUDIT mode (read-only).
- If request includes `IMPL:` -> IMPL mode (patch code).
- If unclear -> default:
  - "audit/review/scan" language -> AUDIT
  - otherwise -> IMPL

---

## Step 1 - MCP preflight (required for DB truth)

If the work involves schema/RLS/policies/migrations:
- Run: `mcp__supabase__get_project_url`

If MCP is unavailable:
- stop and escalate (cannot claim DB truth safely).

---

## Step 2 - Risk/pause decisions

Pause (human approval required) before executing:
- migrations / schema changes
- RLS policy changes
- auth/access control changes
- payments/Stripe changes

You can still AUDIT safely while paused.

---

## Step 3 - Choose implementation shape

### Mutations from UI forms
- Prefer server actions (`'use server'`) with zod validation and auth checks.

### External integrations / webhooks
- Use route handlers (`app/api/**/route.ts`) with:
  - method validation
  - signature verification (Stripe)
  - idempotency
  - safe logging (no payload dumps)

### Cached/public reads
- Keep cached functions free of request APIs (`cookies()`/`headers()`).
- For Supabase reads in cached functions, use `createStaticClient()`.

---

## Step 4 - Verify

After each IMPL batch:
- `pnpm -s typecheck`
- `pnpm -s lint`

Run e2e smoke when auth/checkout/webhooks touched:
- `REUSE_EXISTING_SERVER=true pnpm -s test:e2e:smoke`

