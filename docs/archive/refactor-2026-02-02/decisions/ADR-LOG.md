# Refactor Decisions

> ADR (Architecture Decision Records) for the refactor process

---

## ADR-001: Hybrid Approach for Refactor

**Date:** 2026-02-02  
**Status:** Accepted

**Context:** Need to clean up codebase before production. Options: (A) expand treido-orchestrator, (B) create dedicated refactor skill + /refactor folder, (C) ad-hoc audits only.

**Decision:** Option B — hybrid approach with dedicated `treido-refactor` skill + `/refactor/` artifact folder.

**Rationale:**
- Keeps treido-orchestrator focused on feature delivery
- Provides repeatability and consistent output formats
- Artifact tracking for audits, checklists, decisions

---

## ADR-002: Phase Ordering (Low → High Risk)

**Date:** 2026-02-02  
**Status:** Accepted

**Decision:** Execute cleanup in risk order: dead code → structural → behavioral

**Rationale:**
- Low-risk changes build confidence
- High-risk changes (Phase 4) get explicit human approval
- Easier to rollback if issues found

---

## ADR-003: Defer Phase 4 Unless Quantified Need

**Date:** 2026-02-02  
**Status:** Accepted

**Decision:** Don't execute Phase 4 (behavioral changes like RSC/caching) unless there's measured performance impact.

**Rationale:**
- Behavioral refactors are where cleanup projects die
- Focus on shipping, not perfection
- Can revisit post-production with metrics

---

*Log created: 2026-02-02*
