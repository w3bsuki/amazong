# Production Plan (Minimum Files, Highest Confidence)

## Readiness gates
- Typecheck
- Unit tests
- E2E smoke
- No unused files or dead imports
- Docs consolidated

## Steps
1. Complete docs consolidation (see DOCS-AUDIT.md).
2. Refactor to enforce boundaries and remove dead code (see REFACTOR-PLAN.md).
3. Delete generated artifacts and temp files.
4. Run typecheck and tests.
5. Validate runtime routes for critical flows.
6. Freeze structure: enforce no new root docs.

## Definition of done
- No duplicate docs across roots
- No generated artifacts in repo
- Clean build and test gates
- Minimal folder structure is enforced
