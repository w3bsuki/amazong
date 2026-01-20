# shadcn/ui Audit — 2026-01-20

## Evidence

- shadcn config: `components.json` (style `new-york`, `rsc: true`, css variables enabled, CSS source `app/globals.css`)
- Installed primitives: `components/ui/*` (39 files)
- Boundary check: `components/ui` imports of `@/app` and `@/hooks` → 0 matches

## Findings (prioritized)

### Critical

- [ ] None detected in the primitives boundary (no app imports/hooks from `components/ui`).

### High

- [ ] Ensure all app-level composition lives outside `components/ui/`:
  - Composites: `components/shared/*`
  - Shells: `components/layout/*`
  - This keeps primitives reusable and prevents server/client boundary confusion.

### Medium

- [ ] Inventory + usage audit (post-ship cleanup):
  - Identify unused primitives and remove if truly unused (use Knip + code search).
  - Confirm shadcn overrides are driven by tokens in `app/globals.css` (single source of truth).
