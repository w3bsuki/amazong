# Docs (Start Here)

This repo keeps documentation surface area intentionally small.

**Entrypoint chain**: `README.md` (root) → `docs/README.md` → canonical docs below.

---

## Canonical Docs (8 total, maintained)

### Root (3 docs)
| File | Purpose |
|------|---------|
| `README.md` | Quick start + pointers |
| `TODO.md` | Single source of truth backlog + done log |
| `agents.md` | Agent entry point (stack, commands, boundaries) |

### docs/ (5 docs)
| File | Purpose |
|------|---------|
| `docs/README.md` | This index |
| `docs/ENGINEERING.md` | Stack rules, boundaries, caching, Supabase patterns |
| `docs/DESIGN.md` | Design system source of truth (tokens, spacing, UI patterns) |
| `docs/PRODUCTION.md` | Ship checklist and launch gates |

### Supporting (deep-dives, not policy)
| Location | Purpose |
|----------|---------|
| `docs/guides/frontend.md` | Frontend patterns (components, i18n, responsive) |
| `docs/guides/backend.md` | Backend patterns (Supabase, caching, actions) |
| `docs/styling/README.md` | Styling system docs (guide, patterns, refactor plan) |
| `docs/guides/testing.md` | Testing guide (gates, unit, E2E) |
| `.claude/*` | Claude-specific rules/skills/commands |

---

## The Docs Contract

### Rule 1: Only canonical docs contain policy
Everything else is archive, task/work, or delete.

### Rule 2: One entrypoint chain
`README.md` → `docs/README.md` → canonical docs. No circular references.

### Rule 3: No new docs without index update
Any new `docs/*.md` must be classified here as: canonical, archive, or task/work.

### Rule 4: Dated plans are not canonical
Any doc with a date or "plan/audit" in filename is non-canonical by default.

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

Older planning/audit markdown is in `docs/archive/`. Use Git history if needed.
