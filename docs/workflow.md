# Production Audit + Refactor Workflow

This is the execution workflow for getting Treido (`treido.eu`) live with a clean, consistent Next.js 16 + Supabase + shadcn/Tailwind v4 stack.

Sources of truth:

- Execution checklist + batch log (canonical): `tasks.md`
- Rules: `docs/ENGINEERING.md`, `docs/DESIGN.md`, `docs/TESTING.md`, `docs/PRODUCTION.md`
- Drift hotspots: `cleanup/palette-scan-report.txt`, `cleanup/arbitrary-scan-report.txt`, `styling/STYLE_GUIDE.md`
- Agent execution queues: `docs/frontend_tasks.md`, `docs/backend_tasks.md`

## Constraints (non-negotiable)

- No rewrites. No redesigns.
- No gradients. Don't add new animation/motion; remove non-essential motion where it hurts UX/perf/consistency.
- No new architectural layers (stores/query libs/DI frameworks).
- Don't touch secrets. Don't log keys/JWTs/full request bodies.
- Small batches (1-3 files/features), always deployable.
- Every non-trivial batch must run the gates:
  - Typecheck: `pnpm -s exec tsc -p tsconfig.json --noEmit`
  - E2E smoke: `REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke`

## Roles (agents)

- Orchestrator (lead): triage, batching, merge discipline, release gating, and keeping the checklist honest.
- Frontend agent (`docs/frontend.md`): UI/UX audit + refactors (desktop + mobile), accessibility, token/pattern compliance, layout consistency.
- Backend agent (`docs/backend.md`): Supabase security/perf audit, RLS correctness, query/caching sanity, Stripe/webhooks, middleware/proxy cost control.

## Agent briefs (copy/paste)

### Frontend agent

- Read: `docs/README.md`, `docs/workflow.md`, `docs/frontend_tasks.md`, `docs/DESIGN.md`, `docs/ENGINEERING.md`, `agents.md`
- Audit: Playwright MCP on P0 flows at 390x844 and 1440x900; capture screenshots + notes
- Execute: pick the top 1-3 issues, implement as a 1-3 file batch, then run `tsc` + `e2e:smoke`
- Record: add a Batch Log entry in `tasks.md` and tick items in `docs/frontend_tasks.md`

### Backend agent

- Read: `docs/README.md`, `docs/workflow.md`, `docs/backend_tasks.md`, `docs/ENGINEERING.md`, `docs/PRODUCTION.md`, `supabase_tasks.md`, `agents.md`
- Audit: Supabase MCP advisors (security + performance), plus targeted SQL for RLS/policies/indexes
- Execute: fix P0 items via minimal migrations; verify Stripe/webhooks and caching invariants; run `tsc` + `e2e:smoke` when code changes
- Record: add a Batch Log entry in `tasks.md` and tick items in `docs/backend_tasks.md`

## Parallel work rules (avoid merge conflicts)

- Don't edit the same files in parallel. Coordinate ownership for shared "hot" files:
  - `tasks.md`, `app/globals.css`, `messages/en.json`, `messages/bg.json`
  - `components/ui/**`, `components/common/**`, `components/layout/**`
  - `lib/supabase/**`, `proxy.ts`, `next.config.ts`
- If two tasks need the same file, pick one owner and queue the other change behind it.
- To avoid constant merge conflicts, default to:
  - Orchestrator owns `tasks.md`
  - FE agent owns `docs/frontend_tasks.md`
  - BE agent owns `docs/backend_tasks.md`
  - Orchestrator periodically copies batch entries from agent task files into `tasks.md`

## Work loop (repeat per batch): Scan -> Triage -> Ship

1. Scan (evidence-first)
   - Frontend: Playwright MCP on key flows (desktop + mobile viewports) + screenshot notes.
   - Backend: Supabase MCP advisors + targeted SQL checks for RLS/indexes/over-fetching.
2. Triage
   - Convert findings into small tasks (P0/P1/P2) with clear owner and "done when".
   - If a task can't be completed safely in <=1-3 files, split it.
3. Implement batch
   - Respect boundaries in `docs/ENGINEERING.md` (no cross-route imports of route-owned code).
   - Prefer deletion over abstraction. Prefer tokens/utilities over one-off Tailwind values.
4. Verify
   - Minimum: typecheck + E2E smoke.
   - If touching auth/checkout/sell: run the relevant Playwright spec(s) (not just smoke).
   - If touching data fetching/caching/middleware: add a small unit test if there's a natural place (`__tests__/`).
5. Record
   - Append to `tasks.md` Batch Log: what changed + commands run + follow-ups.
   - Mark completed checkboxes in `docs/frontend_tasks.md` / `docs/backend_tasks.md` (and optionally the longer plans).

## Triage rubric (what to do first)

P0 - Ship blockers

- Breaks core flows: auth, browse/search, product page, cart/checkout, sell listing, account essentials.
- Security gate: Supabase advisors, Auth dashboard toggles, RLS correctness.
- Vercel/Supabase cost regressions: missing `generateStaticParams()`, over-broad middleware, wide selects/deep joins.

P1 - High ROI quality

- UI drift on high-traffic surfaces (home/search/product/checkout).
- Mobile/desktop layout inconsistencies that hurt trust/conversion.
- Hot-path query slimming + missing indexes (measurable payload/latency improvements).

P2 - Defer

- Admin/demo routes, low-traffic pages, non-blocking polish, tooling cleanup.

## Batch template (paste into `tasks.md`)

Batch name: .  
Owner: FE / BE / Both  
Scope (1-3 files/features): .  
Risk: low / med / high  
Verification: `tsc` + `e2e:smoke` (+ spec if relevant)

Done when:

- Flow works end-to-end on desktop + mobile
- Styling matches `docs/DESIGN.md` + `styling/STYLE_GUIDE.md` (no gradients; cards flat; dense spacing; tokens)
- No new console noise; no secrets logged
- Gates pass

## Canonical flows (must stay green)

- Browse: `/en` -> Search -> Product -> Add to cart
- Checkout: Cart -> Checkout -> Stripe redirect -> Success/Cancel return
- Sell: `/en/sell` wizard -> Create listing -> Review listing
- Plans: `/en/plans` shows tiers and checkout works for paid tiers
- Account: profile/orders/selling management basics
- i18n: `/en` and `/bg` parity for key routes
