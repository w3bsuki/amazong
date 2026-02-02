# Refactor Masterplan — Production Cleanup Initiative

> **Goal:** Clean up entire codebase before production push. Zero regressions, better performance, tighter structure.

| Status | Pre-Production Cleanup |
|--------|------------------------|
| Started | 2026-02-02 |
| Target | Production-ready |

---

## Phase Overview

| Phase | Name | Risk | Status | Description |
|-------|------|------|--------|-------------|
| 0 | Baseline & Guardrails | 🟢 Low | ✅ Complete | Record current state, define no-regression rules |
| 0.5 | Restore Green Gates | 🟢 Low | 🔜 Ready | Delete orphaned project, get ALL gates green |
| 1 | Audits | 🟢 Low | ✅ Complete | Parallel subagent audits across all domains |
| 2 | Low-Risk Cleanup | 🟢 Low | ⏳ After 0.5 | Dead code, unused exports, safe duplicates |
| 3 | Structural Refactor | 🟡 Medium | ⬜ Not Started | File moves, boundary enforcement, module dedup |
| 4 | High-Risk Behavioral | 🔴 High | ⚠️ DEFER | RSC/caching/routing changes — only if quantified need |
| 5 | Production Hardening | 🟡 Medium | ⬜ Not Started | Perf, bundle, final gates |

> **Note:** Phase 4 should be DEFERRED unless there's measured performance impact. Behavioral refactors are where cleanup projects die. Ship first, optimize with metrics later.

---

## Consolidated Findings Summary

### 🔴 Critical (Fix in Phase 2)

| Domain | Finding | Files | Impact |
|--------|---------|-------|--------|
| **Dead Code** | `temp-tradesphere-audit/` orphaned project | 26 files | 47 TS errors! |
| Next.js | `cookies()` in search/deals causes ISR storms | 2 | Performance |
| Dead Code | Unused 700+ line modal | 2 files | Bloat |
| shadcn | ProductGrid/SubcategoryCircles duplicates | 4 files | Maintenance |

### 🟠 High Priority (Phase 3)

| Domain | Finding | Files | Impact |
|--------|---------|-------|--------|
| Duplicates | 15+ Product type definitions | Many | Type safety |
| Duplicates | Price utils 90% overlap | 2 | Maintenance |
| Duplicates | Mobile/Desktop pairs 45-70% similar | 12+ | Maintenance |
| File Org | 11 folders at wrong level | Many | Architecture |
| TypeScript | 8 explicit `any`, 28 casts | ~10 | Type safety |

### 🟢 Good News

- ✅ **Tailwind v4:** Zero violations!
- ✅ **Supabase:** Strong patterns, 1 minor fix
- ✅ **No cross-route imports:** Architecture is clean
- ✅ **components/ui/:** shadcn purity maintained

---

## Phase 0: Baseline & Guardrails

### Current Gate Status
```powershell
pnpm -s typecheck     # ❌ 47 errors (from orphaned project)
pnpm -s lint          # ✅ Passing  
pnpm -s styles:gate   # ✅ Passing
pnpm -s ts:gate       # ⚠️ Check before Phase 2
pnpm -s test:unit     # Status: TBD
pnpm -s build         # Status: TBD
```

### No-Regression Rules
- [ ] All gates must pass after each phase
- [ ] No route behavior changes without explicit ticket
- [ ] No DB schema changes in cleanup phases
- [ ] Changes in batches of 1-3 files max
- [ ] Each batch verified before next

### Files to Protect (High Risk)
- `proxy.ts` — Request routing
- `lib/supabase/*` — DB clients
- `app/api/*/webhook/*` — Payment webhooks
- `middleware.ts` — Does NOT exist (Treido convention)

---

## Phase 1: Audits ✅ COMPLETE

All audits live in `/refactor/audits/`. Each auditor writes to their own file.

| Auditor | File | Domain | Status | Findings |
|---------|------|--------|--------|----------|
| Next.js 16 | [nextjs16.md](./audits/nextjs16.md) | App Router, RSC, caching | ✅ | 2 high, 8 medium |
| Tailwind v4 | [tailwind-v4.md](./audits/tailwind-v4.md) | Tokens, gradients, arbitrary | ✅ | 0 violations! |
| shadcn Structure | [shadcn-structure.md](./audits/shadcn-structure.md) | Component purity, boundaries | ✅ | 2 critical, 4 medium |
| Dead Code | [dead-code.md](./audits/dead-code.md) | Unused files, exports, deps | ✅ | 2 files, 3 exports |
| Duplicates | [duplicates.md](./audits/duplicates.md) | Copy-paste, redundant logic | ✅ | 6 categories |
| File Organization | [file-organization.md](./audits/file-organization.md) | Structure, boundaries | ✅ | 21 issues |
| TypeScript | [typescript.md](./audits/typescript.md) | Types, `any`, assertions | ✅ | 8 any, 28 casts |
| Supabase | [supabase.md](./audits/supabase.md) | RLS, queries, clients | ✅ | 1 minor issue |

### Audit Output Format
Each audit must include:
1. **Summary** — High-level findings count
2. **Findings Table** — path:line, severity, description, proposed fix
3. **Risk Level** — Low/Medium/High
4. **Phase to Apply** — Which cleanup phase handles this

---

## Phase 2: Low-Risk Mechanical Cleanup

### Scope
- Remove dead/unused files (confirmed by knip + manual review)
- Remove unused exports/imports
- Delete orphaned components
- Consolidate duplicates where types/tests protect us
- Clean up `/cleanup` folder (legacy scan reports)

### Entry Criteria
- Phase 1 audits complete
- All findings categorized by risk

### Exit Criteria
- All Phase 2 findings resolved
- Gates still passing

---

## Phase 3: Structural Refactor

### Scope
- Enforce component boundaries (`components/ui/` purity)
- Move misplaced files to correct locations
- Dedupe modules with similar functionality
- Standardize naming conventions
- Consolidate scattered utils into `lib/`

### Entry Criteria
- Phase 2 complete
- Snapshot of working state

### Exit Criteria
- Boundaries clean
- No cross-boundary imports
- Gates passing

---

## Phase 4: High-Risk Behavioral

### Scope
- RSC boundary changes
- Caching pattern updates
- Route group restructuring
- Server action refactoring
- Anything that changes runtime behavior

### Entry Criteria
- Phase 3 complete
- E2E smoke passing
- Explicit human review for each change

### Exit Criteria
- All behavioral changes verified
- E2E full suite passing
- Performance baseline maintained

---

## Phase 5: Production Hardening

### Scope
- Bundle size audit
- Performance hotspots
- Build-time correctness
- Final security review
- Documentation cleanup

### Entry Criteria
- Phases 2-4 complete
- All gates green

### Exit Criteria
- Production build succeeds
- Bundle size acceptable
- All tests passing
- Ready for deployment

---

## Audit Subagents

Each subagent is responsible for one domain. They:
1. Audit the entire codebase for their domain
2. Write findings to their audit file
3. Categorize by severity and phase
4. Do NOT make changes (read-only)

### Subagent Responsibilities

| Agent | MCP Tools | Focus Areas |
|-------|-----------|-------------|
| spec-nextjs | mcp_next-devtools_* | App Router patterns, RSC, caching, layouts |
| spec-tailwind | — | Tailwind v4 compliance, tokens, arbitrary values |
| spec-shadcn | mcp_shadcn_* | Component structure, purity, registry compliance |
| spec-supabase | mcp_supabase_* | RLS, queries, client usage |
| spec-typescript | — | Type safety, any usage, assertions |
| dead-code-auditor | — | Unused files, exports, deps (knip + manual) |
| duplicates-auditor | — | Code duplication, redundant implementations |
| structure-auditor | — | File organization, boundaries, naming |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-02 | Use hybrid approach (skill + /refactor folder) | Best of both — repeatability + artifact tracking |
| 2026-02-02 | Manual audits with agent help (not pure scripts) | Scripts can suggest, decisions need human review |
| 2026-02-02 | Keep treido-orchestrator for features only | Don't bloat general orchestrator with cleanup specifics |

---

## Files Index

```
/refactor/
├── MASTERPLAN.md          # This file — overall plan
├── audits/                 # Audit outputs from subagents
│   ├── nextjs16.md
│   ├── tailwind-v4.md
│   ├── shadcn-structure.md
│   ├── dead-code.md
│   ├── duplicates.md
│   ├── file-organization.md
│   ├── typescript.md
│   └── supabase.md
├── decisions/             # ADRs specific to refactor
├── checklists/            # Per-phase completion checklists
└── baseline/              # Snapshots of current state
```

---

*Last updated: 2026-02-02*
