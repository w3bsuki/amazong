# Tech Debt Tracker

> Rolling inventory of known technical debt. Updated whenever debt is discovered or resolved.

| Last reviewed | 2026-02-12 |
|---------------|------------|

---

## Active Debt

| ID | Area | Description | Severity | Discovered | Plan |
|----|------|-------------|----------|------------|------|
| TD-001 | Database | `docs/DATABASE.md` is manually maintained — no auto-generation from live schema, risk of drift | Medium | 2026-02-12 | Run `scripts/generate-db-schema.mjs` on cadence |
| TD-004 | Linting | Custom lint rules don't inject remediation instructions into agent context | Low | 2026-02-12 | Extend ESLint config with custom rules |
| TD-005 | Testing | E2E tests require manual server start — no per-worktree app boot | Low | 2026-02-12 | — |
| TD-006 | Docs | Some docs still miss explicit `Last updated/verified` metadata despite freshness tooling | Medium | 2026-02-12 | Continue metadata backfill during doc updates |

---

## Resolved Debt

| ID | Area | Description | Resolved | How |
|----|------|-------------|----------|-----|
| TD-002 | Architecture | No structural tests enforcing module boundaries (cross-route imports, layer violations) | 2026-02-12 | Added `__tests__/architecture-boundaries.test.ts` boundary suite |
| TD-003 | Docs | No automated doc-freshness checks — "Last verified" dates may be stale | 2026-02-12 | Added and enforced `scripts/check-doc-freshness.mjs` |
| TD-007 | Docs IA | Docs information architecture drift (mixed core + business context, path inconsistencies) | 2026-02-12 | EP-002 hard reset: canonical core docs + `context/business` split + archive snapshot |

---

*Last updated: 2026-02-12*
