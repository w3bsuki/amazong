# Phase Execution Prompts

> **Usage:** Copy-paste one phase prompt per new chat session.
> Always start by having the AI read `docs-v2/MASTER.md` — it contains the full blueprint.
> Phase 1 is complete (MASTER.md created).

---

## Phase 2 — Root Workflow Files

```
Read docs-v2/MASTER.md first — it's the blueprint for our docs restructure. Execute Phase 2.

Phase 2 creates 3 root workflow files that AI reads first for every task.

1. **REQUIREMENTS.md** (root) — Extract from docs/PRD.md + docs/FEATURES.md
   - Read docs/FEATURES.md (283 lines) — has all 119 features with ✅/🚧/⬜ status across 18 categories
   - Read docs/PRD.md (850 lines) — has V1 scope, launch criteria, business model
   - Create REQUIREMENTS.md in root using the R{n}.{m} ID format from MASTER.md
   - Each requirement = one line: `- [x] R1.1: Email signup with verification`
   - Group by area (R1: Auth, R2: Selling, R3: Cart, etc.)
   - Each section ends with `→ Deep dive:` pointers to relevant docs
   - Include the summary table at the bottom
   - Status must match FEATURES.md exactly (103/119 = 87%)

2. **DESIGN.md** (root) — Promote from docs/DESIGN.md
   - Read docs/DESIGN.md (~450 lines) — excellent design system SSOT
   - Copy to root DESIGN.md (not docs-v2/, the actual root)
   - No content changes needed — it's already comprehensive
   - Verify §8.5 app-feel section is present

3. **AGENTS.md** (root) — Rewrite with context loading map
   - Read current root AGENTS.md and docs/AGENTS.md and docs/WORKFLOW.md
   - Rewrite root AGENTS.md following the enhanced format in MASTER.md
   - Must have: Context Loading section (what to read for each topic), Execution Rules, Coding Conventions
   - Must reference: REQUIREMENTS.md, TASKS.md, DESIGN.md, and all docs/ files
   - Keep existing build/test commands and coding style sections
   - Fold in docs/AGENTS.md execution contract (pause rules, boundaries)

After creating all 3, run: pnpm -s typecheck && pnpm -s lint
Update MASTER.md Phase 2 checklist items to [x].
```

---

## Phase 3 — New Core Docs

```
Read docs-v2/MASTER.md first — it's the blueprint for our docs restructure. Execute Phase 3.

Phase 3 creates 3 new core docs inside docs-v2/.

1. **docs-v2/PRODUCTION.md** — Production readiness tracker
   - Read docs/LAUNCH.md (~400 lines), docs/PRODUCTION-PUSH.md (~80 lines), docs/status/LAUNCH-READINESS.yaml
   - Read docs/FEATURES.md summary table for current status per category
   - Create PRODUCTION.md following the template in MASTER.md
   - Feature Readiness table: every category with ✅/🟡/⬜ + blockers
   - Infrastructure Checklist: Sentry, webhooks, RLS, support playbooks, LCP, secrets
   - Environment section: env vars, Supabase, Stripe, Vercel
   - Launch Day Runbook: extract key steps from LAUNCH.md
   - Post-Launch Monitoring: dashboards, SLAs

2. **docs-v2/TESTING.md** — Testing strategy
   - Read docs/PRODUCTION-TEST-PLAN.md (~600 lines) — has 13-phase QA plan
   - Read docs/guides/testing.mdx for testing guide content
   - Read vitest.config.ts and playwright.config.ts for config details
   - Create TESTING.md following MASTER.md template
   - Quick Commands, Unit Tests (Vitest config, thresholds), E2E (Playwright config)
   - QA Protocol condensed from PRODUCTION-TEST-PLAN.md
   - Current Test Health: 405 unit, 22/23 E2E, all gates green

3. **docs-v2/WORKFLOW.md** — Dev workflow + prompt guide
   - Read docs/WORKFLOW.md (~60 lines) — shipping workflow loop
   - Read docs/PROMPT-GUIDE.md (~80 lines) — prompt formatting
   - Merge into single docs-v2/WORKFLOW.md
   - Section 1: Shipping workflow (frame → implement → verify → report)
   - Section 2: Gate commands
   - Section 3: High-risk pause domains
   - Section 4: Prompt formatting guide (appendix from PROMPT-GUIDE.md)

Update MASTER.md Phase 3 checklist items to [x].
```

---

## Phase 4 — Migrate Existing Reference Docs

```
Read docs-v2/MASTER.md first — it's the blueprint for our docs restructure. Execute Phase 4.

Phase 4 migrates existing excellent reference docs into docs-v2/ with targeted consolidations.

1. **Copy these as-is** (no content changes, just copy to docs-v2/):
   - docs/PRD.md → docs-v2/PRD.md
   - docs/DATABASE.md → docs-v2/DATABASE.md
   - docs/API.md → docs-v2/API.md
   - docs/AUTH.md → docs-v2/AUTH.md
   - docs/I18N.md → docs-v2/I18N.md
   - docs/ROUTES.md → docs-v2/ROUTES.md

2. **ARCHITECTURE.md** — Copy + fold in DEV-DEPARTMENT.md
   - Read docs/ARCHITECTURE.md (~350 lines)
   - Read docs/DEV-DEPARTMENT.md (~50 lines) — ownership domains/principles
   - Copy ARCHITECTURE.md to docs-v2/, append DEV-DEPARTMENT.md content as new "## Ownership & Domains" section

3. **PAYMENTS.md** — Consolidate top-level + subdirectory
   - Read docs/PAYMENTS.md (~500 lines) — main Stripe doc
   - Read docs/payments/escrow-order-lifecycle.mdx
   - Read docs/payments/stripe-connect.mdx
   - Read docs/payments/webhooks.mdx
   - Read docs/payments/refunds-disputes.mdx
   - Read docs/payments/ops-runbook.mdx
   - Read docs/payments/index.mdx
   - Merge all into single docs-v2/PAYMENTS.md
   - Structure: keep top-level as the backbone, integrate unique content from subdirectory files
   - Don't duplicate — if top-level already covers a topic, skip the subdirectory version
   - Add ops runbook as appendix section

Total: 8 files created in docs-v2/.
Update MASTER.md Phase 4 checklist items to [x].
```

---

## Phase 5 — Feature Specs

```
Read docs-v2/MASTER.md first — it's the blueprint for our docs restructure. Execute Phase 5.

Phase 5 creates 9 feature spec files in docs-v2/features/. Each follows the standard template from MASTER.md:
- Goal (1 paragraph)
- Current Status (requirements count + production status)
- Requirements Mapping (table with R{n}.{m} IDs matching root REQUIREMENTS.md)
- Implementation Notes (key routes, components, actions, DB tables)
- Known Gaps & V1.1+ Items
- Cross-References

Source material to read:
- Root REQUIREMENTS.md (created in Phase 2) — for requirement IDs and status
- docs/PRD.md — for feature descriptions and business context
- docs/FEATURES.md — for implementation status
- docs/ROUTES.md — for route paths
- For app-feel.md specifically: read docs/APP-FEEL-GUIDE.md, docs/APP-FEEL-COMPONENTS.md, docs/APP-FEEL-CHECKLIST.md, docs/14-UI-UX-PLAN.md
- For monetization.md: read docs/business/monetization.mdx
- For trust-safety.md: read docs/business/specs/prd-trust-safety.mdx, docs/business/specs/prd-reputation-badges-ratings.mdx
- For chat.md: read docs/business/specs/prd-b2b-networking-chat.mdx

Create these 9 files:
1. docs-v2/features/selling.md
2. docs-v2/features/buying.md
3. docs-v2/features/chat.md
4. docs-v2/features/monetization.md
5. docs-v2/features/plans.md
6. docs-v2/features/trust-safety.md
7. docs-v2/features/search-discovery.md
8. docs-v2/features/app-feel.md (consolidates 5 overlapping files into 1)
9. docs-v2/features/onboarding.md

Keep each file focused and scannable. Implementation notes should reference actual route paths from ROUTES.md and actual DB tables from DATABASE.md where known. Don't make things up — use "TBD" if a specific route/table isn't clear from the source docs.

Update MASTER.md Phase 5 checklist items to [x].
```

---

## Phase 6 — Subdirectory Migration

```
Read docs-v2/MASTER.md first — it's the blueprint for our docs restructure. Execute Phase 6.

Phase 6 migrates subdirectories into docs-v2/.

1. **docs/business/** → **docs-v2/business/**
   - Copy entire directory tree as-is (~30 files)
   - No content changes — well-organized, different audience

2. **docs/public/** → **docs-v2/public/**
   - Copy entire directory tree as-is (~22 files)
   - No content changes — production-ready legal/help/policy content

3. **docs/guides/** → **docs-v2/guides/**
   - Copy backend.mdx, frontend.mdx, deployment.mdx, testing.mdx (rename .mdx → .md)
   - Do NOT copy ios-marketplace-ui-pack/ (empty directory)
   - Do NOT copy index.mdx (not needed)

4. **docs/runbooks/** → **docs-v2/runbooks/**
   - Copy PROD-DATA-002-junk-listings.md as-is

5. **codex/** → **docs-v2/archive/codex/**
   - Move entire codex/ directory (16 files) into docs-v2/archive/codex/
   - These are completed refactor playbooks — historical reference only

Use terminal commands (cp/xcopy) for bulk directory copies rather than reading+creating each file.

Update MASTER.md Phase 6 checklist items to [x].
```

---

## Phase 7 — Cutover

```
Read docs-v2/MASTER.md first — it's the blueprint for our docs restructure. Execute Phase 7.

Phase 7 is the final cutover. This deletes old docs and promotes docs-v2 to docs.

⚠️ DESTRUCTIVE — verify docs-v2/ is complete before proceeding.

Pre-flight checks:
1. Verify docs-v2/ has all expected files:
   - 11 core docs (PRD, ARCHITECTURE, DATABASE, API, AUTH, PAYMENTS, I18N, ROUTES, PRODUCTION, TESTING, WORKFLOW)
   - 9 feature specs in features/
   - business/ (~30 files), public/ (~22 files), guides/ (4 files), runbooks/ (1 file)
   - archive/codex/ (16 files)
2. Verify root has: AGENTS.md, TASKS.md, REQUIREMENTS.md, DESIGN.md, README.md
3. Run: pnpm -s typecheck && pnpm -s lint

Cutover steps:
1. Delete docs/ directory entirely
2. Rename docs-v2/ → docs/
3. Delete root codex/ directory (now in docs/archive/codex/)
4. Delete MASTER.md from docs/ (blueprint fulfilled) — but keep PROMPTS.md for reference or delete it too
5. Update docs-site sync script (scripts/sync-docs-site.mjs) to match new docs/ structure
6. Run pnpm docs:sync to verify docs-site regeneration
7. Update any cross-references in root AGENTS.md that point to old paths
8. Verify all internal markdown links resolve (grep for broken refs)
9. Final gates: pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate

Post-cutover:
- Commit: `docs: restructure to spec-driven documentation`
- Mark all Phase 7 items [x] in... wait, MASTER.md is deleted. We're done! 🎉
```

---

## Quick Reference — What Each Phase Produces

| Phase | Creates | File Count |
|-------|---------|------------|
| 1 ✅ | `docs-v2/MASTER.md` | 1 |
| 2 | Root: `REQUIREMENTS.md`, `DESIGN.md` (promoted), `AGENTS.md` (rewritten) | 3 |
| 3 | `docs-v2/`: `PRODUCTION.md`, `TESTING.md`, `WORKFLOW.md` | 3 |
| 4 | `docs-v2/`: PRD, ARCHITECTURE, DATABASE, API, AUTH, PAYMENTS, I18N, ROUTES | 8 |
| 5 | `docs-v2/features/`: 9 feature specs | 9 |
| 6 | `docs-v2/`: business/, public/, guides/, runbooks/, archive/codex/ | ~73 (copies) |
| 7 | Cutover: delete docs/, rename docs-v2/ → docs/ | 0 (net reduction) |
