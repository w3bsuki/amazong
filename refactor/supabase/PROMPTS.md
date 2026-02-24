# Supabase Refactor — Codex Prompts

> Ready-to-paste prompts for the human to send to Codex.
> One prompt per phase. Execute in order.
> Each prompt is self-contained — Codex loads its own context.

---

## Phase 1: Foundation (Domain 1 — Governance)

```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/DOMAINS.md § "Domain 1: Schema Truth + Governance".
Read refactor/supabase/AUDIT.md for live DB data.

Do all DB-GOV-* tasks from refactor/supabase/DOMAINS.md:
1. DB-GOV-001: Live schema inventory snapshot
2. DB-GOV-002: Fix stale schema references in docs
3. DB-GOV-003: Schema drift detection gate
4. DB-GOV-004: Migration governance docs

After each task, verify: pnpm -s typecheck && pnpm -s lint
```

---

## Phase 2: Fast Wins (Domains 2 + 8 — Indexes + Sync)

```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/DOMAINS.md § "Domain 2" and § "Domain 8".
Read refactor/supabase/AUDIT.md § "4. Indexes" for the exact FK list.

Do these tasks:
1. DB-IDX-001: Add missing FK indexes — Pack A (8 indexes)
2. DB-IDX-002: Add missing FK indexes — Pack B (7 indexes)
3. DB-IDX-003: Performance advisor verification note
4. SYNC-001: Remove stale sellers references
5. SYNC-002: Regenerate and verify DB types
6. SYNC-003: Add recurring DB health checklist

⚠️ STOP AND FLAG: DB-IDX-001 and DB-IDX-002 create migrations.
Write the migration SQL but DO NOT apply. Flag for human review.
Use CREATE INDEX IF NOT EXISTS for idempotency.

After non-migration tasks, verify: pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

---

## Phase 3: RLS Hardening (Domain 3)

```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/DOMAINS.md § "Domain 3: RLS Hardening".
Read refactor/supabase/AUDIT.md § "3. RLS Policies" for exact policy data.

Do these tasks:
1. DB-RLS-001: Standardize admin policies to is_admin()
2. DB-RLS-002: Tighten write-role scope from public to authenticated
3. DB-RLS-003: Add WITH CHECK on UPDATE where missing
4. DB-RLS-004: RLS regression test harness

⚠️ STOP AND FLAG: DB-RLS-001, DB-RLS-002, DB-RLS-003 are RLS migrations.
Write the migration SQL. DO NOT apply. Flag for human review.
Each migration should CREATE OR REPLACE the policy properly.
Include rollback SQL as comments.

DB-RLS-004 is code-only (test harness) and can be committed directly.
```

---

## Phase 4: RPC Cleanup (Domain 5)

```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/DOMAINS.md § "Domain 5: RPC Surface Cleanup".
Read refactor/supabase/AUDIT.md § "2. Functions" for the full function list.

Do these tasks:
1. DB-RPC-001: Resolve missing admin_paid_revenue_total
   - Check lib/auth/admin.ts for the call site
   - Decide: create the RPC or remove the dead code path
   - If removing code: just remove it and verify gates pass
   - If adding RPC: write migration SQL and FLAG for human review
2. DB-RPC-002: RPC grant audit and lockdown (FLAG — migration)
3. DB-RPC-003: Deprecate unused RPCs (FLAG — migration)
4. DB-RPC-004: RPC callsite inventory + CI lock (code-only, commit directly)

Verify: pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

---

## Phase 5: Trigger Cleanup (Domain 4)

```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/DOMAINS.md § "Domain 4: Trigger/Function Lifecycle Cleanup".
Read refactor/supabase/AUDIT.md § "5. Trigger Chains" for the full cascade analysis.

⚠️ THIS IS THE HIGHEST-RISK DOMAIN. Be extremely careful.

Do these tasks:
1. DB-TRG-004: Trigger chain observability report (code-only, safe)
2. DB-TRG-003: Remove orphan trigger functions (FLAG — migration)
   - Verify each function is truly orphaned before writing DROP
   - Cross-reference with live trigger list
3. DB-TRG-001: Consolidate products listing-stat triggers (FLAG — migration)
   - The dual-pipeline (stock-based vs status-based) must be unified
   - Pick ONE active-listing definition and document the choice
4. DB-TRG-002: Harden handle_new_order_item security (FLAG — migration)
   - Review if row_security=off is actually needed
   - Document justification if kept

ALL trigger migrations must be FLAGGED for human review. No exceptions.
```

---

## Phase 6: Code Decomposition (Domain 6)

```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/DOMAINS.md § "Domain 6: Code Decomposition".

Do these tasks:
1. CODE-SPLIT-001: Split lib/auth/business.ts (1,234 lines) into lib/business/ modules
2. CODE-SPLIT-003: Split lib/supabase/messages.ts into queries/mutations/transformers

DO NOT touch CODE-SPLIT-002 (edge function) unless explicitly asked.

Rules:
- Preserve all public exports via barrel files
- All existing imports must work without changes to consumers
- No behavior changes — pure structural refactor
- Verify: pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Phase 7: Migration Rebaseline (Domain 7)

```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/DOMAINS.md § "Domain 7: Migration Rebaseline".

⚠️ HIGH-RISK DOMAIN. All tasks require human approval.

Do these tasks:
1. DB-MIG-001: Migration classification manifest (doc-only, safe)
2. DB-MIG-002: Category restore compaction plan (doc-only, safe)

STOP AFTER THESE TWO. Do not proceed to DB-MIG-003 or DB-MIG-004
without explicit human instruction. Those involve creating baseline
migrations and testing on dev branches.
```

---

## Quick Reference: Single-Task Prompts

For any individual task:
```
Read AGENTS.md. Read refactor/supabase/PLAN.md.
Read refactor/supabase/AUDIT.md.
Do task [TASK-ID] from refactor/supabase/DOMAINS.md.
```

---

*Last updated: 2026-02-24*
