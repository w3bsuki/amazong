# Supabase Backend Refactor — Master Plan

> The definitive guide for the Treido Supabase backend production cleanup.
> Created: 2026-02-24 | Owner: Orchestrator + Codex collaborative planning
> Status: **Planning complete — ready for execution**

---

## Vision: What "Done" Looks Like

After this refactor, Treido's Supabase backend is:

1. **Zero lint warnings** from Supabase Security + Performance Advisors (except Pro-gated features)
2. **Schema-docs parity** — live DB, generated types, and docs all match. Stale references eliminated.
3. **RLS hardened** — all write policies use `authenticated` role (not `public`), all UPDATE policies have `WITH CHECK`, admin checks use `is_admin()` consistently
4. **No orphan artifacts** — no detached trigger functions, no missing RPCs, no unused tables lingering
5. **Trigger chains documented and optimized** — hot-path write amplification reduced on `products` and `order_items`
6. **RPC surface intentional** — app-called RPCs documented, internal-only RPCs revoked from public grants
7. **Migration history manageable** — legacy archive separated, baseline created, category batch restores compacted
8. **Code decomposed** — no 1,000+ line god files in the backend layer
9. **CI drift detection** — automated checks prevent schema/types/docs from drifting again

---

## Current State (Audit Summary)

| Metric | Count | Health |
|--------|------:|--------|
| Tables | 44 | OK |
| Views | 3 + 1 materialized | OK |
| Functions (public) | 92 | NEEDS CLEANUP |
| Triggers | 98 | NEEDS REVIEW |
| RLS Policies | 109 (public schema) | NEEDS HARDENING |
| Indexes | 149 | 15 MISSING FK indexes |
| Edge Functions | 1 | OK (but monolithic) |
| Storage Buckets | 2 | OK |
| Realtime Subscribers | 4 | OK |
| Migration Files | ~700 active + 1,107 legacy | NEEDS REBASELINE |
| Security Advisor Warnings | 1 (leaked password — Pro plan req) | TRACKED |
| Performance Advisor Warnings | 15 unindexed FKs | ACTIONABLE |
| `select('*')` Violations | 0 | EXCELLENT |
| `getSession()` Server Violations | 0 | EXCELLENT |

### Key Findings

**Critical:**
- `admin_paid_revenue_total` RPC called in code but **missing from live DB** (silent fallback every admin page load)
- 15 foreign keys without covering indexes (perf impact on JOINs/cascading deletes)
- 13 UPDATE policies missing `WITH CHECK` clauses
- Several write policies granted to `public` role instead of `authenticated`

**High:**
- `lib/auth/business.ts` — 1,234-line god file mixing auth, data, stats, transformers
- Two redundant seller-stats trigger pipelines on `products` INSERT (conflicting active criteria)
- `handle_new_order_item` runs `SECURITY DEFINER` with `row_security=off`
- Stale `sellers` table in docs (doesn't exist in live schema)

**Medium:**
- ~700 migration files (400+ from category batch restore incident)
- 1,107 legacy sync duplicates consuming repo space
- `variant_options` and `shipping_zones` tables appear unused by application code
- `brands` table has no direct `.from()` queries
- Edge function uses pinned SDK v2.39.3 (may drift from app)

**Already Excellent (Don't Touch):**
- Client factory architecture (server.ts, client.ts, shared.ts, middleware.ts)
- Auth patterns (requireAuth everywhere, getUser on server)
- Query hygiene (explicit column projections)
- Realtime hook centralization
- Storage RLS
- Webhook verification ordering

---

## Refactor Domains (8 total)

| # | Domain | Priority | Risk | Human Approval | Est. Tasks |
|---|--------|----------|------|---------------|------------|
| 1 | Schema Truth + Governance | P0 | Low | No | 4 |
| 2 | FK Index Backfill | P0 | Low | Yes (migrations) | 3 |
| 3 | RLS Hardening | P1 | Medium | Yes (migrations) | 4 |
| 4 | Trigger/Function Cleanup | P1 | High | Yes (migrations) | 4 |
| 5 | RPC Surface Cleanup | P1 | Medium | Yes (some) | 4 |
| 6 | Code Decomposition | P2 | Low | No | 3 |
| 7 | Migration Rebaseline | P2 | High | Yes (all) | 4 |
| 8 | Docs/Types/CI Sync | P2 | Low | No | 3 |

**Execution order:** 1 → 2 → 3 → 5 → 4 → 8 → 6 → 7

Domain 1 is the foundation (understand before changing). Domain 2 is fast wins. Domains 3-5 are the core safety/perf work. Domain 6-7 are cleanup. Domain 8 ties it together.

---

## Risk Management

### Needs Human Approval (Per AGENTS.md)
- ALL database migrations (schema changes, RLS changes, trigger changes)
- Any auth/session logic changes
- Any payment/webhook behavior changes

### What Could Break
| Action | Risk | Mitigation |
|--------|------|------------|
| RLS policy rewrites | Block legitimate writes | Test with SQL harness before deploying |
| Trigger removal | Silent side-effect loss (notifications, stats) | Map full cascade chain first (done — see AUDIT.md) |
| Migration squash | Break branch/dev DB restore | Rehearse on Supabase dev branch first |
| Index creation on large tables | Write locks during creation | Use `CREATE INDEX CONCURRENTLY` |
| RPC grant/revoke | Break runtime calls | Verify app callsite inventory first |

### Safety Rails
1. Every migration domain has a verification step
2. Supabase dev branches for testing before production
3. Architecture boundary tests catch regressions automatically
4. All migrations are idempotent where possible (`IF NOT EXISTS`)

---

## Execution Protocol

### For Each Domain:
1. Orchestrator writes tasks to TASKS.md with context pointers
2. Human approves migration-domain tasks
3. Codex executes bounded task set
4. Orchestrator verifies via Supabase MCP (advisors, SQL queries)
5. Human reviews and applies approved migrations
6. Gates: `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

### Codex Prompt Pattern:
```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/DOMAINS.md § Domain [N].
Then do all unchecked DB-[PREFIX]-* tasks from TASKS.md, top to bottom.
```

---

## File Map

```
refactor/supabase/
├── PLAN.md          ← This file (master plan, vision, execution protocol)
├── AUDIT.md         ← Complete audit data (tables, policies, indexes, triggers, functions)
├── DOMAINS.md       ← Per-domain task breakdown with acceptance criteria
└── PROMPTS.md       ← Ready-to-paste Codex prompts for each domain
```

---

*Last updated: 2026-02-24*
