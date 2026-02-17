# Refactor Progress Tracker

> Updated by Codex after each phase. Reviewed by Human + Copilot before next phase is created.

---

## Phase 1 — Discovery Audit

**Goal:** Full folder-tree audit. Find waste, fix safe issues, flag risky ones.

| Agent | Scope | Status |
|-------|-------|--------|
| Agent 1 | `components/` tree | ⬜ Not started |
| Agent 2 | `lib/` + `hooks/` | ⬜ Not started |
| Agent 3 | `app/` (routes, actions, api) | ⬜ Not started |

**Verification:** ⬜ `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

**Metrics before:**
| Metric | Value |
|--------|-------|
| Files | 762 |
| `"use client"` | 357 |
| >300-line files | 125 |
| >500-line files | 44 |
| Clones | 247 (3.06%) |

**Metrics after:** _(fill after phase completes)_

---

## Phase 2 — Client Boundary & Bundle

**Goal:** Reduce client-side JS. Remove unnecessary `"use client"`. Lazy-load heavy components.

| Agent | Scope | Status |
|-------|-------|--------|
| Agent 1 | `"use client"` audit on `components/` | ⬜ Not started |
| Agent 2 | `"use client"` audit on `app/` | ⬜ Not started |
| Agent 3 | Dynamic imports + bundle optimization | ⬜ Not started |

**Verification:** ⬜ `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

**Metrics before:** _(fill from Phase 1 after)_
**Metrics after:** _(fill after phase completes)_

---

## Phase 3 — Data & Performance

**Goal:** Caching, query optimization, dependency cleanup.

| Agent | Scope | Status |
|-------|-------|--------|
| Agent 1 | Caching (`"use cache"`, cacheLife, cacheTag) | ⬜ Not started |
| Agent 2 | Data layer (select, client→server, Supabase clients) | ⬜ Not started |
| Agent 3 | Dependency diet (knip, unused deps, heavy deps) | ⬜ Not started |

**Verification:** ⬜ `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

**Metrics before:** _(fill from Phase 2 after)_
**Metrics after:** _(fill after phase completes)_

---

## Phase 4 — Polish

**Goal:** Route completeness, CSS cleanup, code quality, final metrics.

| Agent | Scope | Status |
|-------|-------|--------|
| Agent 1 | Route completeness (loading, metadata, error) | ⬜ Not started |
| Agent 2 | CSS & styling cleanup | ⬜ Not started |
| Agent 3 | Code quality (oversized files, dead code, tests, i18n) | ⬜ Not started |

**Verification:** ⬜ `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit`

**Metrics before:** _(fill from Phase 3 after)_
**Metrics after (FINAL):** _(fill after phase completes)_
