# Opus Proposal: Docs & Skills System Iteration

**Date**: 2026-02-03  
**Author**: Opus 4.5 (Claude)  
**Status**: Decision-Complete Proposal (No Implementation)

---

## Executive Summary

The current Treido documentation and skills system has grown organically and now suffers from:

1. **Skill Fleet Bloat**: 18 skills in `.codex/skills/` + 15 skills in `.claude/skills/` = 33 total skills
2. **Contradictory SSOT**: Root AGENTS.md claims "3 skills" while docs/11-SKILLS.md lists 18
3. **Duplicated Guidance**: Multiple skills cover overlapping domains (design, mobile UX, accessibility)
4. **Unclear Entry Points**: 10+ AGENTS.md files scattered across folders with varying levels of detail
5. **No Lane-Based Workflow**: No mechanism to parallelize work without conflicts

**Proposed Solution**: Consolidate to **10 skills**, establish **3 always-read docs**, define **3 parallel lanes**, and create a **shared locks** mechanism for high-risk files.

---

## Section 1: Diagnosis — What's Wrong

### 1.1 Skill Fleet Problems

| Problem | Evidence | Impact |
|---------|----------|--------|
| **Skill count explosion** | 18 treido-* skills + 15 .claude/* skills | Agents waste context reading irrelevant skills |
| **Orchestrator indirection** | `treido-frontend` and `treido-backend` just route to other skills | Extra hop adds no value |
| **Overlapping coverage** | `treido-design` vs `treido-ui-ux-pro-max` vs `treido-mobile-ux` vs `treido-accessibility` | 4 skills for "make UI good" |
| **Tailwind split** | `treido-tailwind-v4` vs `treido-tailwind-v4-shadcn` | One topic, two skills |
| **Generic vendor skills** | `.claude/skills/*` are generic (not Treido-specific) | Compete with treido-* skills |

### 1.2 Documentation Problems

| Problem | Evidence | Impact |
|---------|----------|--------|
| **Multiple SSOT claims** | Root AGENTS.md, docs/AGENTS.md, .codex/AGENTS.md all claim to be entry points | Confusion about where to start |
| **Contradictory skill counts** | Root AGENTS.md: "3 skills", docs/11-SKILLS.md: "18 skills" | Trust erosion |
| **Scattered AGENTS.md** | 10+ files: root, docs/, app/, components/, components/ui/, hooks/, lib/, i18n/, messages/, supabase/ | No single boundary truth |
| **Docs vs .codex ambiguity** | Both contain "stable" docs; unclear what lives where | Drift between locations |

### 1.3 Workflow Problems

| Problem | Evidence | Impact |
|---------|----------|--------|
| **No parallel work model** | WORKFLOW.md describes sequential batches only | Agents can't work on app/lib/components in parallel |
| **No shared locks** | No list of files that require coordination | Race conditions on critical files |
| **No cross-lane API protocol** | If lib/ changes an export, components/ breaks | Breaks discovered late in batch |

---

## Section 2: Proposed File Tree

```
AGENTS.md                          # ← ALWAYS-READ #1: Rails + quick nav (< 100 lines)
README.md                          # Dev onboarding (not agent-focused)

docs/
├── 00-INDEX.md                    # ← ALWAYS-READ #2: Doc hub + links (< 150 lines)
├── WORKFLOW.md                    # ← ALWAYS-READ #3: Workflow + gates (< 100 lines)
├── 01-PRD.md                      # Product requirements
├── 02-FEATURES.md                 # Feature checklist
├── 03-ARCHITECTURE.md             # System design + boundaries
├── 04-DESIGN.md                   # UI/UX tokens + patterns
├── 05-ROUTES.md                   # Route map
├── 06-DATABASE.md                 # Schema + RLS
├── 07-API.md                      # Server actions
├── 08-PAYMENTS.md                 # Stripe flows
├── 09-AUTH.md                     # Auth patterns
├── 10-I18N.md                     # next-intl setup
├── 11-SKILLS.md                   # Skill fleet reference
├── 12-LAUNCH.md                   # Launch checklist
├── runbooks/                      # Operational runbooks
└── archive/                       # Historical (not SSOT)

.codex/
├── TASKS.md                       # Active work queue (high-churn)
├── SHIPPED.md                     # Done log
├── DECISIONS.md                   # ADR log
├── LOCKS.md                       # ← NEW: Shared locks list
├── skills/                        # ← CONSOLIDATED: 10 skills max
│   ├── treido-rails/SKILL.md
│   ├── treido-frontend/SKILL.md   # Merged: design + mobile + a11y + ui-ux-pro-max
│   ├── treido-backend/SKILL.md    # Merged: supabase + auth + stripe
│   ├── treido-nextjs/SKILL.md     # App Router + caching
│   ├── treido-tailwind/SKILL.md   # Merged: v4 + shadcn integration
│   ├── treido-shadcn/SKILL.md     # UI primitives + CVA
│   ├── treido-i18n/SKILL.md       # next-intl
│   ├── treido-testing/SKILL.md    # Playwright
│   ├── treido-structure/SKILL.md  # File placement
│   └── treido-skillsmith/SKILL.md # Skill system maintenance
├── refactor/                      # Refactor workspace
├── proposals/                     # Proposals like this one
└── archive/                       # Old audit notes

app/AGENTS.md                      # Boundary rules (keep short)
components/AGENTS.md               # Boundary rules (keep short)
components/ui/AGENTS.md            # Boundary rules (keep short)
lib/AGENTS.md                      # Boundary rules (keep short)
```

### Files to DELETE

```
.codex/AGENTS.md                   # Redirect pointer → delete
.codex/WORKFLOW.md                 # Redirect pointer → delete
.codex/project/*                   # Deprecated pointers → delete
.claude/skills/*                   # Generic skills → delete (content materialized into treido-*)
docs/AGENTS.md                     # Merge into root AGENTS.md
docs/PROMPT-GUIDE.md               # Merge into WORKFLOW.md
docs/SKILLS-GUIDE.md               # Merge into 11-SKILLS.md
docs/DOCS-PLAN.md                  # Archive after migration
docs/APP-FEEL-*.md                 # Archive (content in 04-DESIGN.md + treido-frontend)
hooks/AGENTS.md                    # Trivial boundary → comment in file instead
i18n/AGENTS.md                     # Trivial boundary → comment in file instead
messages/AGENTS.md                 # Trivial boundary → comment in file instead
lib/supabase/AGENTS.md             # Trivial boundary → comment in file instead
supabase/AGENTS.md                 # Trivial boundary → comment in file instead
```

---

## Section 3: SSOT Docs List (Top 3 Always-Read)

| Rank | Doc | Max Lines | Why Always-Read |
|------|-----|-----------|-----------------|
| **#1** | `AGENTS.md` (root) | 100 | Non-negotiables, pause conditions, quick nav. Every task starts here. |
| **#2** | `docs/00-INDEX.md` | 150 | Hub to all docs. Agents find topic docs here. |
| **#3** | `docs/WORKFLOW.md` | 100 | Loop (frame/implement/verify), gates, commands. Every task uses this. |

### Why These Three

- **AGENTS.md**: Answers "what rules apply everywhere?" and "where do I go next?"
- **00-INDEX.md**: Answers "where is the doc for X?"
- **WORKFLOW.md**: Answers "how do I ship safely?"

Everything else is **read-on-demand** based on task scope.

### Content Reductions

| Doc | Current Lines | Target Lines | Cuts |
|-----|---------------|--------------|------|
| `AGENTS.md` (root) | ~60 | ~80 | Absorb docs/AGENTS.md content, remove skill count lie |
| `docs/00-INDEX.md` | ~200 | ~150 | Remove diagrams, trim glossary |
| `docs/WORKFLOW.md` | ~100 | ~100 | Keep as-is, add lane section |

---

## Section 4: Skill Fleet Table

### Final Fleet (10 Skills)

| Skill | Purpose | Triggers | Boundaries | Do Not Touch | Verification | Pause When |
|-------|---------|----------|------------|--------------|--------------|------------|
| **treido-rails** | Non-negotiables + pause conditions | Every task (implicit) | Security, i18n, tokens, caching | Never modify without human approval | `pnpm lint`, `pnpm typecheck` | N/A (always on) |
| **treido-frontend** | UI/UX + design + mobile + accessibility | "design", "mobile", "a11y", "polish", "feel" | Styling, hierarchy, states, touch | No DB/auth/payments code | `pnpm styles:gate`, visual check | N/A |
| **treido-backend** | Data + auth + payments | "database", "auth", "stripe", "webhook" | Supabase, RLS, Stripe | No UI styling | `pnpm test:unit` | DB/auth/payment changes |
| **treido-nextjs** | App Router + caching + RSC | "cache", "server component", "route", "layout" | Next.js 16 patterns | No proxy.ts changes without approval | `pnpm build` | N/A |
| **treido-tailwind** | Tailwind v4 + shadcn theme | "token", "tailwind", "theme", "dark mode" | globals.css, token mapping | No palette/gradient/arbitrary | `pnpm styles:gate` | N/A |
| **treido-shadcn** | UI primitives + CVA | "component/ui", "shadcn", "radix", "primitive" | components/ui/* only | No app logic in primitives | `pnpm lint`, boundary check | N/A |
| **treido-i18n** | next-intl + translations | "translation", "i18n", "copy", "string" | messages/*, locale routing | No hardcoded strings | `pnpm test:unit` (i18n tests) | N/A |
| **treido-testing** | Playwright E2E | "test", "e2e", "playwright", "flaky" | e2e/*, test patterns | No production code in tests | `pnpm test:e2e:smoke` | N/A |
| **treido-structure** | File placement + boundaries | "where does X go", "import", "boundary" | Folder rules, naming | No business logic | `pnpm lint` (import rules) | N/A |
| **treido-skillsmith** | Skill system maintenance | "skill", "add skill", "merge skill" | .codex/skills/* only | No treido-rails changes | `pnpm validate:skills` | Skill deletion |

### Deprecated Skills (Remove)

| Skill | Reason | Migration |
|-------|--------|-----------|
| `treido-design` | Merged into `treido-frontend` | Content in treido-frontend |
| `treido-ui-ux-pro-max` | Merged into `treido-frontend` | Content in treido-frontend |
| `treido-mobile-ux` | Merged into `treido-frontend` | Content in treido-frontend |
| `treido-accessibility` | Merged into `treido-frontend` | Content in treido-frontend |
| `treido-tailwind-v4` | Renamed to `treido-tailwind` | Content in treido-tailwind |
| `treido-tailwind-v4-shadcn` | Merged into `treido-tailwind` | Content in treido-tailwind |
| `treido-shadcn-ui` | Renamed to `treido-shadcn` | Content in treido-shadcn |
| `treido-supabase` | Merged into `treido-backend` | Content in treido-backend |
| `treido-auth-supabase` | Merged into `treido-backend` | Content in treido-backend |
| `treido-stripe` | Merged into `treido-backend` | Content in treido-backend |
| `treido-nextjs-16` | Renamed to `treido-nextjs` | Content in treido-nextjs |

### Generic Skills (.claude/skills/*) — DELETE ALL

| Skill | Reason | What to Keep |
|-------|--------|--------------|
| `accessibility-compliance` | Covered by treido-frontend | Delete |
| `frontend-design` | Covered by treido-frontend | Delete |
| `i18n-localization` | Covered by treido-i18n | Delete |
| `mobile-ux-optimizer` | Covered by treido-frontend | Delete |
| `nextjs-supabase-auth` | Covered by treido-backend | Delete |
| `playwright` | Covered by treido-testing | Delete |
| `pwa-expert` | Not used in Treido (not a PWA) | Delete |
| `seo-audit` | Not a current priority | Delete |
| `stripe-best-practices` | Covered by treido-backend | Delete |
| `supabase-postgres-best-practices` | Covered by treido-backend | Delete |
| `tailwind-v4-shadcn` | Covered by treido-tailwind | Delete |
| `typescript-advanced-types` | Too generic; TS docs suffice | Delete |
| `ui-ux-pro-max` | Covered by treido-frontend | Delete |
| `vercel-react-best-practices` | Covered by treido-nextjs | Delete |
| `web-design-guidelines` | Covered by treido-frontend | Delete |

---

## Section 5: Workflow Loop (Lanes + Gates)

### Lane Model

Work can proceed in **parallel lanes** as long as lane boundaries are respected:

| Lane | Scope | Owner | Shared Files |
|------|-------|-------|--------------|
| **app** | `app/**`, routes, pages | Route developer | `proxy.ts`, `app/globals.css` |
| **lib** | `lib/**`, utilities, actions | Backend developer | `lib/supabase/server.ts`, `lib/utils.ts` |
| **components** | `components/**` | UI developer | `components.json`, `tailwind.config.*` |

### Shared Locks (Cross-Lane Coordination Required)

These files affect multiple lanes. Changes require coordination:

```
# CRITICAL (pause + notify all lanes)
proxy.ts                           # Request routing
app/globals.css                    # Token SSOT
lib/supabase/server.ts             # Supabase client factory
lib/supabase/static.ts             # Cached client factory
components.json                    # shadcn config

# HIGH (notify affected lanes)
lib/utils.ts                       # cn() and shared utilities
lib/types.ts                       # Shared type definitions
lib/constants.ts                   # Shared constants
messages/en.json                   # English translations
messages/bg.json                   # Bulgarian translations

# MEDIUM (check for conflicts before merge)
next.config.ts                     # Build config
tsconfig.json                      # TypeScript config
package.json                       # Dependencies
```

### Cross-Lane API Change Protocol

When changing an export that other lanes depend on:

1. **Announce**: Post to `.codex/TASKS.md` with `[BREAKING]` prefix
2. **Deprecate**: Add `@deprecated` JSDoc for 1 batch cycle
3. **Migrate**: Update all callers in same batch
4. **Remove**: Delete old export only after all callers updated

### Updated Workflow Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                     TREIDO SHIPPING LOOP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. FRAME                                                       │
│     ├─ State goal (1-2 sentences)                              │
│     ├─ Identify lane(s): app / lib / components                │
│     ├─ Check LOCKS.md for shared files                         │
│     └─ Classify risk: low / high                               │
│                                                                 │
│  2. IMPLEMENT                                                   │
│     ├─ Work in small batches (1-3 files)                       │
│     ├─ Stay in your lane unless cross-lane change announced    │
│     └─ Apply relevant skills (max 2-3 per task)                │
│                                                                 │
│  3. VERIFY                                                      │
│     ├─ pnpm typecheck                                          │
│     ├─ pnpm lint                                                │
│     ├─ pnpm styles:gate                                        │
│     ├─ pnpm docs:gate                                          │
│     └─ pnpm test:e2e:smoke (if risk > low)                     │
│                                                                 │
│  4. RECORD (if non-trivial)                                    │
│     ├─ Update .codex/TASKS.md                                  │
│     └─ Update .codex/SHIPPED.md                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Pause Conditions (Unchanged)

- DB schema/migrations/RLS
- Auth/session changes
- Payments/Stripe/webhooks
- Destructive/bulk operations
- ANY shared lock file without coordination

---

## Section 6: Migration Plan (Batch-by-Batch)

### Batch 1: Docs Consolidation (Low Risk)

**Goal**: Establish 3 always-read docs, remove duplicates.

| Action | Path | Notes |
|--------|------|-------|
| EDIT | `AGENTS.md` | Absorb docs/AGENTS.md content, update skill count to "10" |
| EDIT | `docs/00-INDEX.md` | Trim to 150 lines, remove diagram redundancy |
| EDIT | `docs/WORKFLOW.md` | Add lane section, add shared locks reference |
| DELETE | `docs/AGENTS.md` | Content merged into root AGENTS.md |
| DELETE | `docs/PROMPT-GUIDE.md` | Content merged into WORKFLOW.md |
| DELETE | `docs/SKILLS-GUIDE.md` | Content merged into 11-SKILLS.md |
| CREATE | `.codex/LOCKS.md` | Shared locks list |

**Verify**: `pnpm docs:gate`

---

### Batch 2: Skill Consolidation - Frontend (Medium Risk)

**Goal**: Merge 4 UI/UX skills into 1.

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `.codex/skills/treido-frontend/SKILL.md` | New merged skill |
| DELETE | `.codex/skills/treido-design/` | Merged |
| DELETE | `.codex/skills/treido-ui-ux-pro-max/` | Merged |
| DELETE | `.codex/skills/treido-mobile-ux/` | Merged |
| DELETE | `.codex/skills/treido-accessibility/` | Merged |

**Verify**: `pnpm validate:skills`

---

### Batch 3: Skill Consolidation - Backend (Medium Risk)

**Goal**: Merge 3 backend skills into 1.

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `.codex/skills/treido-backend/SKILL.md` | New merged skill (overwrite existing orchestrator) |
| DELETE | `.codex/skills/treido-supabase/` | Merged |
| DELETE | `.codex/skills/treido-auth-supabase/` | Merged |
| DELETE | `.codex/skills/treido-stripe/` | Merged |

**Verify**: `pnpm validate:skills`

---

### Batch 4: Skill Consolidation - Tailwind (Low Risk)

**Goal**: Merge 2 Tailwind skills into 1, rename for clarity.

| Action | Path | Notes |
|--------|------|-------|
| CREATE | `.codex/skills/treido-tailwind/SKILL.md` | New merged skill |
| DELETE | `.codex/skills/treido-tailwind-v4/` | Merged |
| DELETE | `.codex/skills/treido-tailwind-v4-shadcn/` | Merged |

**Verify**: `pnpm validate:skills`

---

### Batch 5: Skill Renames (Low Risk)

**Goal**: Rename skills for consistency.

| Action | Old Path | New Path |
|--------|----------|----------|
| RENAME | `.codex/skills/treido-shadcn-ui/` | `.codex/skills/treido-shadcn/` |
| RENAME | `.codex/skills/treido-nextjs-16/` | `.codex/skills/treido-nextjs/` |

**Verify**: `pnpm validate:skills`

---

### Batch 6: Delete Generic Skills (Low Risk)

**Goal**: Remove all `.claude/skills/*` (content materialized into treido-*).

| Action | Path | Notes |
|--------|------|-------|
| DELETE | `.claude/skills/accessibility-compliance/` | Covered by treido-frontend |
| DELETE | `.claude/skills/frontend-design/` | Covered by treido-frontend |
| DELETE | `.claude/skills/i18n-localization/` | Covered by treido-i18n |
| DELETE | `.claude/skills/mobile-ux-optimizer/` | Covered by treido-frontend |
| DELETE | `.claude/skills/nextjs-supabase-auth/` | Covered by treido-backend |
| DELETE | `.claude/skills/playwright/` | Covered by treido-testing |
| DELETE | `.claude/skills/pwa-expert/` | Not used |
| DELETE | `.claude/skills/seo-audit/` | Not priority |
| DELETE | `.claude/skills/stripe-best-practices/` | Covered by treido-backend |
| DELETE | `.claude/skills/supabase-postgres-best-practices/` | Covered by treido-backend |
| DELETE | `.claude/skills/tailwind-v4-shadcn/` | Covered by treido-tailwind |
| DELETE | `.claude/skills/typescript-advanced-types/` | Too generic |
| DELETE | `.claude/skills/ui-ux-pro-max/` | Covered by treido-frontend |
| DELETE | `.claude/skills/vercel-react-best-practices/` | Covered by treido-nextjs |
| DELETE | `.claude/skills/web-design-guidelines/` | Covered by treido-frontend |

**Verify**: `pnpm validate:skills`, `pnpm docs:gate`

---

### Batch 7: Cleanup Deprecated Pointers (Low Risk)

**Goal**: Remove redirect files and trivial AGENTS.md files.

| Action | Path | Notes |
|--------|------|-------|
| DELETE | `.codex/AGENTS.md` | Redirect pointer |
| DELETE | `.codex/WORKFLOW.md` | Redirect pointer |
| DELETE | `.codex/project/` | Deprecated pointers |
| DELETE | `hooks/AGENTS.md` | Trivial (add comment in hooks/index.ts) |
| DELETE | `i18n/AGENTS.md` | Trivial (add comment in i18n/config.ts) |
| DELETE | `messages/AGENTS.md` | Trivial (add comment in messages/en.json) |
| DELETE | `lib/supabase/AGENTS.md` | Trivial (add comment in server.ts) |
| DELETE | `supabase/AGENTS.md` | Trivial (add comment in migrations/) |
| ARCHIVE | `docs/DOCS-PLAN.md` | Move to docs/archive/ |
| ARCHIVE | `docs/APP-FEEL-GUIDE.md` | Move to docs/archive/ |
| ARCHIVE | `docs/APP-FEEL-COMPONENTS.md` | Move to docs/archive/ |
| ARCHIVE | `docs/APP-FEEL-CHECKLIST.md` | Move to docs/archive/ |

**Verify**: `pnpm docs:gate`

---

### Batch 8: Update References (Low Risk)

**Goal**: Update all docs and scripts to reference new structure.

| Action | Path | Notes |
|--------|------|-------|
| EDIT | `docs/11-SKILLS.md` | Update skill fleet table to show 10 skills |
| EDIT | `scripts/validate-agent-skills.mjs` | Update to check only `.codex/skills/` |
| EDIT | `scripts/docs-gate.mjs` | Remove `.claude/` from allowed paths if no longer needed |
| EDIT | `.github/copilot-instructions.md` | Update skill references |

**Verify**: `pnpm validate:skills`, `pnpm docs:gate`

---

## Section 7: Shared Locks List (Treido-Specific)

### Critical Locks (Pause + Coordinate All Lanes)

| File | Affects | Coordination Required |
|------|---------|----------------------|
| `proxy.ts` | All routes, i18n, auth | Full team review |
| `app/globals.css` | All styling | UI + component lanes |
| `lib/supabase/server.ts` | All data access | Backend + app lanes |
| `lib/supabase/static.ts` | Cached queries | Backend + app lanes |
| `components.json` | All shadcn components | Component lane |

### High Locks (Notify Affected Lanes)

| File | Affects | Notification Required |
|------|---------|----------------------|
| `lib/utils.ts` | All code using `cn()` | All lanes |
| `lib/types.ts` | Type consumers | All lanes |
| `lib/constants.ts` | Constant consumers | All lanes |
| `messages/en.json` | All i18n | App + component lanes |
| `messages/bg.json` | All i18n | App + component lanes |

### Medium Locks (Check Before Merge)

| File | Affects | Pre-Merge Check |
|------|---------|-----------------|
| `next.config.ts` | Build behavior | Run `pnpm build` |
| `tsconfig.json` | Type checking | Run `pnpm typecheck` |
| `package.json` | Dependencies | Run `pnpm install` |
| `pnpm-lock.yaml` | Dependency versions | Verify no conflicts |
| `vitest.config.ts` | Unit tests | Run `pnpm test:unit` |
| `playwright.config.ts` | E2E tests | Run `pnpm test:e2e:smoke` |

---

## Section 8: Success Criteria

After migration:

| Metric | Before | After |
|--------|--------|-------|
| Total skills | 33 | 10 |
| Always-read docs | Unclear | 3 |
| AGENTS.md files | 10+ | 4 (root, app/, components/, components/ui/) |
| Skill count consistency | Contradictory | Consistent "10" everywhere |
| Parallel work model | None | 3 lanes with shared locks |

---

## Appendix A: New Skill Templates

### treido-frontend SKILL.md (Merged)

```markdown
---
name: treido-frontend
description: Frontend specialist for Treido. Use for UI/UX design, mobile optimization, accessibility, and visual polish. Covers layout, hierarchy, states, touch targets, and WCAG compliance.
---

# treido-frontend

Comprehensive frontend expertise for Treido marketplace.

## When to Apply

- Designing screens or components (especially mobile-first)
- Reviewing UI for "native app feel" and polish
- Accessibility audits (WCAG 2.2 AA)
- Touch target sizing and mobile UX
- Visual hierarchy and spacing

## Non-Negotiables

- Tailwind v4 tokens only (no palette/gradients/arbitrary)
- All copy via next-intl
- Touch targets ≥ 44×44px (use `--spacing-touch-md`)
- Contrast ≥ 4.5:1 (AA)

## Core Patterns

[Content merged from treido-design, treido-ui-ux-pro-max, treido-mobile-ux, treido-accessibility]

## References

- `docs/04-DESIGN.md`
- `app/globals.css` (token SSOT)
```

### treido-backend SKILL.md (Merged)

```markdown
---
name: treido-backend
description: Backend specialist for Treido. Use for Supabase queries, RLS patterns, auth flows, and Stripe integration. Covers data access, security, and payment safety.
---

# treido-backend

Comprehensive backend expertise for Treido marketplace.

## When to Apply

- Writing Supabase queries
- Implementing auth/session patterns
- Stripe webhooks and payment flows
- RLS policy design
- API performance optimization

## Pause Conditions (ALWAYS)

- DB schema changes → human approval
- RLS policy changes → human approval
- Auth/session changes → human approval
- Stripe/webhook changes → human approval

## Core Patterns

[Content merged from treido-supabase, treido-auth-supabase, treido-stripe]

## References

- `docs/06-DATABASE.md`
- `docs/08-PAYMENTS.md`
- `docs/09-AUTH.md`
```

---

## Appendix B: Decision Log

| Decision | Rationale | Alternative Rejected |
|----------|-----------|---------------------|
| Keep AGENTS.md at root | Universal convention; agents expect it there | Moving to docs/ |
| 10 skills (not fewer) | Maintains domain separation without over-merging | 5-skill fleet (too broad) |
| Delete .claude/skills/* | Content duplicated in treido-*; single location | Keep both (confusion) |
| 3 lanes (app/lib/components) | Natural code ownership boundaries | 2 lanes (too coarse), 5 lanes (too fine) |
| LOCKS.md in .codex/ | High-churn operational file | In docs/ (wrong home) |

---

*Proposal complete. Ready for human review and approval before implementation.*
