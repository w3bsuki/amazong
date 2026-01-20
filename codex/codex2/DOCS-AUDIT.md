# Docs Audit (Summary + Actions)

## Observed issues
- Documentation is spread across multiple top-level roots (docs/, codex/, GPT+OPUS/, prompts/), plus numerous standalone root plans/audits, leading to duplication and drift.
- docs/ has overlapping domains (audit/, research/, roadmap/, launch/, operations/, policies/, compliance/) and multiple one-off guides at the root.
- Generated/test artifacts are stored in the repository root (playwright-report*, test-results, tsc.*), which should be ignored or removed.

## Immediate actions
1. Consolidate to a single documentation entry point in docs/README.md.
2. Merge duplicate content into four production-focused buckets:
   - docs/architecture/ (architecture + engineering)
   - docs/design/ (design + styling)
   - docs/ops/ (production, launch, operations)
   - docs/policies/ (policy + compliance)
3. Move obsolete or historical content into docs/archive/ or delete it.
4. Remove generated reports from the repo and add to .gitignore.
5. Decide whether docs-site/ is required. If not, delete. If yes, auto-generate from docs/ to prevent drift.

## Candidate consolidation mapping
- docs/ENGINEERING.md + LAYOUT-ARCHITECTURE-AUDIT.md + REFACTOR-LAYOUT-ARCHITECTURE.md -> docs/architecture/
- docs/DESIGN.md + docs/styling/* + docs/styling/README.md -> docs/design/
- docs/PRODUCTION.md + docs/PRODUCTION-WORKFLOW-GUIDE.md + docs/launch/ + docs/operations/ -> docs/ops/
- docs/policies/ + docs/compliance/ -> docs/policies/
- docs/audit/ + docs/research/ + docs/roadmap/ + codex/*.md -> docs/archive/

## Keep-or-archive guidance
- Keep: docs/README.md, architecture/design/ops/policies, a single production checklist
- Archive or delete: audits, roadmaps, research notes, historic plans, duplicate root documents
