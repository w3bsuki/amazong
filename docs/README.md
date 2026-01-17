# Docs (Start Here)

This repo keeps documentation surface area intentionally small, but **complete**:
development + product + business docs live under `docs/`.

**Entrypoint chain**: `README.md` (root) → `docs/README.md` → canonical docs below.

---

## Canonical Docs (maintained)

### Root (3 docs)
| File | Purpose |
|------|---------|
| `README.md` | Quick start + pointers |
| `TODO.md` | Single source of truth backlog + done log |
| `agents.md` | Agent entry point (stack, commands, boundaries) |

### Development (core rules)
| File | Purpose |
|------|---------|
| `docs/ENGINEERING.md` | Stack rules, boundaries, caching, Supabase patterns |
| `docs/DESIGN.md` | Design system source of truth (tokens, spacing, UI patterns) |
| `docs/PRODUCTION.md` | Ship checklist and launch gates |

### Product + Business (Treido.eu)
| File | Purpose |
|------|---------|
| `docs/roadmap/README.md` | Phases overview + principles |
| `docs/roadmap/v1.md` | V1 launch scope (classifieds-first + boosts) |
| `docs/roadmap/v2.md` | V2 scope (card payments + marketplace payouts) |
| `docs/roadmap/v3.md` | V3 scope (scale & expansion) |
| `docs/business/model.md` | Monetization model (V1 vs V2) |
| `docs/business/plans.md` | Plans, perks, and access (personal vs business) |
| `docs/business/PLAN-admin-docs-structure.md` | Master plan for /admin/docs system |
| `docs/research/bulgarian-market-2026.md` | Bulgarian market analysis + competitor pricing |

### Supporting (deep-dives, not policy)
| Location | Purpose |
|----------|---------|
| `docs/guides/frontend.md` | Frontend patterns (components, i18n, responsive) |
| `docs/guides/backend.md` | Backend patterns (Supabase, caching, actions) |
| `docs/guides/testing.md` | Testing guide (gates, unit, E2E) |
| `docs/styling/README.md` | Styling system docs (guide, patterns, refactor plan) |
| `docs/launch/README.md` | Production launch playbook + AI-executable plans |
| `docs/PRODUCTION-WORKFLOW-GUIDE.md` | Launch workflow guide (wrapper for legacy references) |
| `docs/GPTVSOPUSFINAL.md` | Agent roles/protocol pointer (wrapper for legacy references) |
| `docs/audit/` | Research audits (competitive + UX) |
| `.claude/*` | Claude-specific rules/skills/commands |

---

## The Docs Contract

### Rule 1: Only canonical docs contain policy
Everything else is research, archive, task/work, or delete.

### Rule 2: One entrypoint chain
`README.md` → `docs/README.md` → canonical docs. No circular references.

### Rule 3: No new docs without index update
Any new `docs/**` Markdown must be classified here as: canonical, supporting, research, or archive.

### Rule 4: Dated plans/audits are not canonical
Anything with a date, “audit”, or “plan” in the filename is non-canonical by default.

---

## Working Rules

- No rewrites / no redesigns. Work in small batches.
- Don't touch secrets. Don't log keys/JWTs/full request bodies.
- Every non-trivial change must pass:
  ```bash
  pnpm -s exec tsc -p tsconfig.json --noEmit
  REUSE_EXISTING_SERVER=true pnpm test:e2e:smoke
  ```

---

## Archive

Historical/dated material lives in `docs/archive/`. Research/audits live in `docs/audit/`.
