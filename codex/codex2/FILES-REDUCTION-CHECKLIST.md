# Files Reduction Checklist (Delete / Archive / Keep)

## Delete or gitignore (generated artifacts)
- .next/
- node_modules/
- playwright-report/, playwright-report-tmp/, playwright-report-tmp2/, playwright-report-tmp3/
- test-results/
- tsc.err.txt, tsc.out.txt
- any temp_* files

## Archive (move to docs/archive/)
- All root-level audits/plans that duplicate docs (AUDIT-*.md, PLAN-*.md, LAYOUT-ARCHITECTURE-AUDIT.md, REFACTOR-LAYOUT-ARCHITECTURE.md)
- codex/*.md content after consolidation
- docs/audit/, docs/research/, docs/roadmap/
- GPT+OPUS/ and prompts/ (unless explicitly used in build/test pipelines)

## Review for removal
- docs-site/ (keep only if actively used; otherwise delete)
- duplicate README/guides in root once consolidated into docs/

## Keep (core, production)
- app/, components/, hooks/, lib/, public/, messages/, supabase/, config/, scripts/
- tests: __tests__/, e2e/ (if required for CI)
- docs/ (but slimmed and consolidated)

## Sequence
1. Consolidate docs into new structure in docs/.
2. Move old docs to docs/archive/.
3. Delete/ignore build artifacts and temp files.
4. Remove duplicate root docs.
5. Enforce rule: no new docs outside docs/.
