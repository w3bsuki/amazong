# MASTER PLAN — Production Push Refactor

> Treido's complete codebase refactor, alignment, and production-readiness plan.
> Orchestrated by GitHub Copilot + Codex MCP. Executed by Codex CLI in phases.
> Created: 2026-02-24

---

## Session Handoff Protocol

> **For any agent (Copilot or Codex) starting a new session:**
> 1. Read `AGENTS.md` (project rules)
> 2. Read this file (`refactor/production-push/MASTER-PLAN.md`) — check Progress Log below
> 3. Read `refactor/production-push/baseline.md` (if exists) for metrics
> 4. Read the specific `current.md` + `end_goal.md` pair for the task area
> 5. Run verification gates before AND after changes

## Progress Log

<!-- Append entries here after each completed batch. Format: date | tasks | outcome | gate status -->
| Date | Tasks Completed | Outcome | Gates |
|------|----------------|---------|-------|
| 2026-02-24 | Plan creation | 23 files, 37 tasks defined | N/A (no code changes) |
| 2026-02-25 | Audit + corrections | context7 docs verified, 8 corrections applied | N/A (docs only) |
| 2026-02-25 | REF-CLEANUP-001 | Baseline captured: unsafe casts=46 (32 files), console lines=111; knip: 5 unused files + 1 export (saved to `refactor/production-push/baseline-knip-2026-02-25.txt`); architecture: client=269/1151, over300=66, over500=3, duplicates clones=53 lines=628 | GREEN (typecheck, lint, styles:gate, test:unit, architecture:gate) |
| 2026-02-25 | REF-CLEANUP-002 | Repo hygiene: gitignore root artifacts (`.codex_*.txt`, eslint logs); moved Python scripts to `scripts/`; archived legacy `.pen` snapshots into `designs/archive/legacy-pen-files-2026-02-24.zip` | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | REF-CLEANUP-003 | Docs link drift repaired: added `ARCHITECTURE.md` + `docs/DOMAINS.md`; restored legacy `refactor-with-opus` task file links (10 pointer docs under `refactor/`) and `pnpm -s refactor:links:gate` passes | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | REF-CLEANUP-004 | Refactor docs consistency: updated `current.md` snapshots (overview metrics, project structure root clutter notes, TypeScript allowJs status) to reflect REF-CLEANUP progress | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | REF-CLEANUP-008 | Disabled `allowJs` in `tsconfig.json` | GREEN (typecheck) |
| 2026-02-25 | REF-CLEANUP-013 | CI/DX hygiene audit: `pnpm` scripts verified (typecheck, lint, styles:gate, test:unit, architecture:gate, knip, refactor:links:gate) | GREEN (typecheck, lint, styles:gate, test:unit, architecture:gate, knip) |
| 2026-02-25 | REF-CLEANUP-005 | Knip cleanup: removed unused category tree lite helpers; `pnpm -s knip` now clean | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | REF-CLEANUP-006 | Dead deps: none reported by Knip (dependencies clean) | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | REF-CLEANUP-007 | Logging standardization: replaced `console.*` with `logger.*` in production code; console grep now 0 | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | REF-CLEANUP-009 | Unsafe cast reduction: `as unknown as` now 15 occurrences (prod 3), remaining casts justified | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | REF-CLEANUP-010 | `generateStaticParams` helpers + duplicate reduction: helperized locale/empty params; jscpd clones 53→50, duplicated lines 628→587 | GREEN (typecheck, lint, styles:gate, test:unit, architecture:gate) |
| 2026-02-25 | REF-CLEANUP-011 | Tooling dedupe: reviewed scan scripts (distinct, shared utils); removed orphan `scripts/audit-set-request-locale.py` | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | REF-CLEANUP-012 | Test hygiene: extracted shared Next mocks into `test/mocks/*`; reduced duplicated mock setup | GREEN (typecheck, lint, styles:gate, test:unit) |
| 2026-02-25 | Phase 1 (REF-CLEANUP) | Before/after: casts 46→15 (prod 34→3); console 111→0; knip warnings 6→0; dupes clones 53→50 lines 628→587 | GREEN (typecheck, lint, styles:gate, test:unit, architecture:gate) |

---

## Scope

| Metric | Current |
|--------|---------|
| Source files | 1,139 |
| Lines of code | ~120,788 |
| Route groups | 10 |
| Server actions | 40 files |
| API routes | 21 domains |
| CSS tokens | ~260 |
| Unit tests | 456/456 passing |
| Client component ratio | 21.2% (241/1,139) |
| Duplicate clones | 50 clusters, 587 lines |
| Unsafe casts (`as unknown as`) | 15 occurrences (prod: 3) |
| Console statements (prod) | 0 occurrences |
| `pb-20` hacks | 14 occurrences in 13 files |
| Non-Envelope actions | 29/40 (73%) |
| Root clutter artifacts | ~16 files |
| `generateStaticParams` duplicates | 0 identical implementations (shared helpers) |

---

## Phase Structure

| Phase | Name | Focus | Risk Level |
|-------|------|-------|------------|
| **REF-CLEANUP** | Cleanup | Dead code, repo hygiene, logging, casts, dupes | Zero to Low |
| **REF-ALIGNMENT** | Alignment | Architecture patterns, CSS modular, standardization | Low to Medium |
| **REF-POLISH** | Production Polish | UX, performance, mobile-first, bundle, metadata | Medium |

---

## Phase 1 — REF-CLEANUP (Safe, Mechanical)

**Exit criteria:** Gates green. Dead code/deps removed. Repo clean. No behavior changes.

| ID | Task | Scope | Depends | Status |
|----|------|-------|---------|--------|
| REF-CLEANUP-001 | Baseline snapshot + guardrail metrics | small | — | ✅ |
| REF-CLEANUP-002 | Repo hygiene: artifacts + root clutter | medium | — | ✅ |
| REF-CLEANUP-003 | Docs link drift repair | medium | — | ✅ |
| REF-CLEANUP-004 | Refactor-program doc consistency | small | 003 | ✅ |
| REF-CLEANUP-005 | Dead code: unused files/exports via Knip | medium | 001 | ✅ |
| REF-CLEANUP-006 | Dead deps: remove unused dependencies | medium | 005 | ✅ |
| REF-CLEANUP-007 | Logging standardization (ALL files, including auth/payments) | large | — | ✅ |
| REF-CLEANUP-008 | TypeScript config: disable `allowJs` | small | — | ✅ |
| REF-CLEANUP-009 | Unsafe cast reduction (ALL files, including auth/payments) | large | 001 | ✅ |
| REF-CLEANUP-010 | Duplicate reduction + `generateStaticParams` centralization | large | 001 | ✅ |
| REF-CLEANUP-011 | Tooling dedupe: scan script consolidation | medium | — | ✅ |
| REF-CLEANUP-012 | Tests hygiene: dedupe mocks/fixtures | medium | — | ✅ |
| REF-CLEANUP-013 | CI/DX hygiene audit | small | — | ✅ |
| REF-CLEANUP-014 | Migration fallback removal (post MIG-001) | large | MIG-001 | ⬜ |

---

## Phase 2 — REF-ALIGNMENT (Architecture + Consistency)

**Exit criteria:** Modular CSS. Standardized actions. Mobile spacing unified. Docs updated.

| ID | Task | Scope | Depends | Status |
|----|------|-------|---------|--------|
| REF-ALIGNMENT-001 | Split `globals.css` into modular imports | medium | — | ⬜ |
| REF-ALIGNMENT-002 | Prune/normalize legacy CSS tokens | large | 001 | ⬜ |
| REF-ALIGNMENT-003 | Remove Tailwind-colliding custom utilities | large | 001 | ⬜ |
| REF-ALIGNMENT-004 | Server actions → Envelope standard (ALL actions) | large | CLEANUP-007 | ⬜ |
| REF-ALIGNMENT-005 | Standardize boundary flow (Zod→auth→domain→Envelope) | large | 004 | ⬜ |
| REF-ALIGNMENT-006 | Typed Supabase query helpers | medium | — | ⬜ |
| REF-ALIGNMENT-007 | Centralize repeated query fragments | medium | 006 | ⬜ |
| REF-ALIGNMENT-008 | Move cross-route chrome to components/layout | large | — | ⬜ |
| REF-ALIGNMENT-009 | shadcn/ui primitives contract enforcement | medium | 008 | ⬜ |
| REF-ALIGNMENT-010 | Brand composites → components/shared | medium | 009 | ⬜ |
| REF-ALIGNMENT-011 | Mobile chrome spacing: eliminate `pb-20` hacks | large | 001 | ⬜ |
| REF-ALIGNMENT-012 | API naming normalization (slug vs id) | medium | — | ⬜ |
| REF-ALIGNMENT-013 | Tab bar state from AuthStateManager | medium | — | ⬜ |

---

## Phase 3 — REF-POLISH (UX, Performance, Shipping)

**Exit criteria:** Bundle reduced. SEO hardened. Route-by-route UX complete. E2E green.

| ID | Task | Scope | Depends | Status |
|----|------|-------|---------|--------|
| REF-POLISH-001 | Remove global MotionProvider | medium | ALIGN-008 | ⬜ |
| REF-POLISH-002 | Reduce global client provider footprint | large | 001 | ⬜ |
| REF-POLISH-003 | Sitemap caching/revalidation | small | — | ⬜ |
| REF-POLISH-004 | Metadata optimization (all routes) | large | — | ⬜ |
| REF-POLISH-005 | Image optimization audit | large | — | ⬜ |
| REF-POLISH-006 | Loading/error states completeness | medium | — | ⬜ |
| REF-POLISH-007 | Mobile-first UX sweep (per route group) | large | ALIGN-011 | ⬜ |
| REF-POLISH-008 | Bundle analysis + code splitting | large | 001, 002 | ⬜ |
| REF-POLISH-009 | Final E2E + a11y smoke | medium | all | ⬜ |
| REF-POLISH-010 | Close the loop: update state + changelog | small | all | ⬜ |

---

## Scope Authorization

> **Owner has authorized the full refactor.** All files — including auth, payments, checkout,
> and database-adjacent code — are in scope. No approval gates. Codex executes everything.
>
> **Safety net:** Verification gates (`typecheck + lint + styles:gate + test:unit`) run after
> every task. If a gate fails, Codex stops and reports. That's the guardrail, not permissions.
>
> **One real blocker:** REF-CLEANUP-014 depends on MIG-001 being deployed to Supabase first.
> That's a technical dependency, not an approval gate.

---

## Verification After Every Task

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

For architecture changes, also run:
```bash
pnpm -s architecture:gate
```

---

## Technology Docs (Current → End Goal)

Each folder contains `current.md` (what exists now) and `end_goal.md` (what we're targeting):

| # | Area | Folder |
|---|------|--------|
| 00 | Overview | `refactor/production-push/00-overview/` |
| 01 | Project Structure | `refactor/production-push/01-project-structure/` |
| 02 | Next.js 16 | `refactor/production-push/02-nextjs/` |
| 03 | Tailwind CSS v4 | `refactor/production-push/03-tailwindcss-v4/` |
| 04 | shadcn/ui | `refactor/production-push/04-shadcn-ui/` |
| 05 | Supabase | `refactor/production-push/05-supabase/` |
| 06 | TypeScript | `refactor/production-push/06-typescript/` |
| 07 | Components | `refactor/production-push/07-components/` |
| 08 | Frontend/Backend | `refactor/production-push/08-frontend-backend/` |
| 09 | Mobile-First UX | `refactor/production-push/09-mobile-first-ux/` |
| 10 | Performance | `refactor/production-push/10-performance/` |

---

## Dependency Graph

```
REF-CLEANUP-001 (baseline)
  ├── REF-CLEANUP-005 → REF-CLEANUP-006
  ├── REF-CLEANUP-009
  └── REF-CLEANUP-010

REF-CLEANUP-003 → REF-CLEANUP-004

REF-ALIGNMENT-001 (CSS split)
  ├── REF-ALIGNMENT-002
  ├── REF-ALIGNMENT-003
  └── REF-ALIGNMENT-011

REF-ALIGNMENT-006 → REF-ALIGNMENT-007
REF-ALIGNMENT-008 → REF-ALIGNMENT-009 → REF-ALIGNMENT-010

REF-CLEANUP-007 → REF-ALIGNMENT-004 → REF-ALIGNMENT-005

REF-ALIGNMENT-008 → REF-POLISH-001 → REF-POLISH-002
REF-ALIGNMENT-011 → REF-POLISH-007

All Phase 3 → REF-POLISH-009 → REF-POLISH-010
```

---

*Created: 2026-02-24 | Orchestrated by: GitHub Copilot + Codex MCP*
