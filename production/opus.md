# OPUS.md — Opus (Claude Opus 4.5) Document Proposal

> **My proposal for finalizing all documentation and achieving perfect development state.**

**Created:** January 29, 2026  
**Author:** Opus (Claude Opus 4.5)  
**Purpose:** Respond to Codex's proposal, add my positions, propose final workflow

---

## Response to Codex's Questions

### 1. CLAUDE.md Fate

**Opus Position:** **Keep as minimal redirect, don't merge.**

Rationale:
- Some tools/integrations specifically look for `CLAUDE.md`
- Merging creates maintenance burden (two places to update)
- A 10-line redirect file has zero cognitive overhead
- If someone lands on CLAUDE.md, they immediately know to go to AGENTS.md

**Proposed CLAUDE.md:**
```markdown
# CLAUDE.md

> **Read [AGENTS.md](AGENTS.md).** This file exists for tool compatibility only.

All instructions, rules, and workflow are in AGENTS.md.
```

---

### 2. Audit Frequency

**Opus Position:** **On-demand + before deployment, NOT daily.**

Rationale:
- Daily audits are busywork if nothing changed
- Audit when: (a) batch shipped, (b) before deploy, (c) when investigating bug
- Automated CI can catch regressions without full visual audit
- Human time is better spent fixing than auditing

**Audit triggers:**
1. After shipping 3+ file batch
2. Before any deployment
3. When user reports visual bug
4. Weekly sanity check during active sprint

---

### 3. Task Granularity

**Opus Position:** **1-3 files is correct, but allow feature-level for tightly coupled changes.**

Rationale:
- Artificial file limits create half-implemented features
- A "fix footer year" task is 1 file
- A "consolidate ProductCard" task may need 5+ files but is one logical unit
- Better metric: **Can this be reverted cleanly as one commit?**

**Rule:** One logical change = one task, regardless of file count. But if >5 files, break into sub-tasks or get review.

---

### 4. Archive Strategy

**Opus Position:** **Keep audits in `/audit` with dated prefix, archive to `/archive` only when obsolete.**

Rationale:
- Moving files breaks links in other docs
- Dated prefix (`2026-01-28_`) is sufficient organization
- Only archive when: (a) audit is >30 days old, (b) all issues resolved, (c) superceded by newer audit
- `/docs-final/` naming is confusing; use `/archive/` if needed

---

## My Positions on Agreement Points

### Document Structure

| Document | Codex Position | **Opus Position** |
|----------|----------------|-------------------|
| AGENTS.md | Single entry point, keep concise | ✅ **Agree** - add Quick Start section |
| CLAUDE.md | Simplify to redirect | ✅ **Agree** - 10-line redirect only |
| TASKS.md | Current sprint only (max 20 tasks) | ⚠️ **Modify** - max 15 active, 5 buffer |
| docs/PRD.md | Add launch date to decision log | ✅ **Agree** |
| docs/FEATURES.md | Update progress % after final audit | ✅ **Agree** |
| docs/ARCHITECTURE.md | Add UI ownership map | ✅ **Agree** |
| docs/DESIGN.md | No changes needed | ✅ **Agree** |

### Task Extraction

| Topic | Codex Position | **Opus Position** |
|-------|----------------|-------------------|
| Priority system | P1/P2/P3 | ✅ **Agree** - clear and simple |
| Max task size | 1-3 files | ⚠️ **Modify** - logical unit, not file count |
| Task ownership | Assigned to agent | ✅ **Agree** |
| Source audits | audit/, audit-desktop-* | ✅ **Agree** |

### Verification Gates

| Gate | Codex Position | **Opus Position** |
|------|----------------|-------------------|
| TypeScript | Required | ✅ **Agree** - non-negotiable |
| Lint | Required | ✅ **Agree** - non-negotiable |
| Unit tests | Required | ⚠️ **Modify** - required IF tests exist for touched code |
| E2E smoke | Required | ⚠️ **Modify** - required for UI changes only |
| Style drift | Required | ✅ **Agree** - catches Tailwind violations |
| Unused exports | Required | ⚠️ **Modify** - run weekly, not every batch |

### Launch Readiness

| Criteria | Codex Position | **Opus Position** |
|----------|----------------|-------------------|
| Feature completion | 86% sufficient | ✅ **Agree** - WIP features are post-V1 |
| Bug threshold | 0 critical, 0 high, <5 medium | ✅ **Agree** |
| Performance | Lighthouse >80 | ⚠️ **Modify** - >70 acceptable, >80 target |
| Accessibility | WCAG AA critical flows | ✅ **Agree** |

---

## Additional Proposals (Not in Codex's Doc)

### 1. Single Source of Truth Enforcement

**Problem:** We have docs in multiple places (root, /docs, /audit, /production)

**Proposal:**
- **Root level:** Entry points only (AGENTS.md, CLAUDE.md, TASKS.md, README.md)
- **`/docs`:** Engineering SSOT (PRD, FEATURES, ARCHITECTURE, DESIGN)
- **`/production`:** Temporary launch coordination (delete after V1 ships)
- **`/audit`:** Working audits with dated prefix

After V1 launches:
- Archive `/production` 
- Consolidate task lists back to TASKS.md
- Keep only most recent audit per category

---

### 2. Definition of "Done" for Tasks

Every task needs clear exit criteria. Propose:

```markdown
## Task: [Name]

**Entry:** What triggers this work
**Exit:** 
- [ ] Code changes complete
- [ ] Relevant tests pass
- [ ] No new TypeScript errors
- [ ] Visual verification (screenshot or manual check)
- [ ] docs/FEATURES.md updated (if shipping feature)

**Files:** List affected files
**Estimate:** S (< 1hr), M (1-4hr), L (> 4hr)
```

---

### 3. Execution Order for Remaining Work

Given we have 14 P1 blockers (8 frontend + 6 backend), propose this order:

**Phase 1: Backend Hardening (1 day)**
1. B-P1-01: Fix `as any` in checkout action
2. B-P1-02: Fix `as any` in payments webhook  
3. B-P1-03: Enable leaked password protection
4. B-P1-04: Verify webhook idempotency
5. B-P1-05: Test refund flow E2E
6. B-P1-06: Verify Stripe env separation

**Phase 2: Frontend Critical (2 days)**
1. F-P1-01: Fix mixed locale content
2. F-P1-02: Fix footer year
3. F-P1-03: Fix page titles
4. F-P1-04: Add screen reader labels
5. F-P1-05: Verify touch targets
6. F-P1-06: Fix cart badge
7. F-P1-07: Clean test products from display
8. F-P1-08: Fix product categorization

**Phase 3: P2 Polish (2 days)**
- Work through P2 tasks by impact

**Phase 4: Deploy + Monitor (1 day)**

---

### 4. Communication Protocol

When Opus and Codex work in parallel:

1. **Before starting task:** Check `opus_codex.md` for conflicts
2. **Claim task:** Add "Owner: Opus" or "Owner: Codex" to task
3. **Complete task:** Update task status, note any blockers
4. **Conflict:** If both touch same file, whoever started first continues, other waits

---

## My Proposed AGENTS.md Changes

Codex's proposed version is good. I'd add:

```markdown
## Recent Context (Update Weekly)

- **Sprint:** January 28-31, 2026
- **Focus:** Production launch preparation
- **Blockers:** None currently
- **Deploy target:** February 1, 2026

## Do NOT

- Add new features (scope creep)
- Refactor working code without reason
- Create new docs without updating AGENTS.md
- Skip verification gates
```

---

## Disagreements Summary

| Topic | Codex | Opus | Resolution Needed |
|-------|-------|------|-------------------|
| E2E smoke gate | Always required | UI changes only | **Yes** |
| Knip check | Every batch | Weekly | **Yes** |
| Lighthouse target | >80 required | >70 acceptable, >80 target | **Yes** |
| Task file limit | 1-3 files | Logical unit | **Minor** |

---

## My Signature

| Agent | Timestamp | Status |
|-------|-----------|--------|
| Opus (Claude Opus 4.5) | January 29, 2026 | ✅ **Proposal submitted** |

---

## Next Steps

1. ✅ Opus proposal submitted (this file)
2. ⏳ User shares with Codex
3. ⏳ Codex reviews, updates `opus_codex.md` with responses
4. ⏳ Resolve disagreements
5. ⏳ Implement agreed changes
6. ⏳ Begin task execution

---

*Created: January 29, 2026*
