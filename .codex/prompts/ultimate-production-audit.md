````markdown
# Ultimate Production Audit Prompt

> **Purpose:** Full-stack production alignment audit with subagent orchestration, E2E testing, and folder-by-folder codebase verification.
> 
> **Runtime:** Variable (depends on model and codebase size)

## Quick Run

```bash
# Claude Opus 4 (recommended)
codex --model claude-opus-4-20250514 --approval auto-edit --full-auto "$(cat .codex/prompts/ultimate-production-audit.md)"

# Or any capable model
codex --model <your-model> --approval auto-edit --full-auto "$(cat .codex/prompts/ultimate-production-audit.md)"
```

---

## MASTER PROMPT

```
═══════════════════════════════════════════════════════════════════════════════
 ULTIMATE PRODUCTION AUDIT
═══════════════════════════════════════════════════════════════════════════════

Mission: COMPLETE production alignment audit + refactor of the Treido marketplace codebase.

Stack: Next.js 16 + React 19 + TypeScript + Tailwind v4 + shadcn/ui + Supabase + Stripe + next-intl
Target: Production-ready, zero-regression, 50% code reduction
Rails: docs/AGENTS.md (non-negotiables), docs/WORKFLOW.md (verification)

══════════════════════════════════════════════════════════════════════════
 PHASE 0: CLEANUP & PREPARATION (15-30 min)
══════════════════════════════════════════════════════════════════════════

## 0.1 — Clean existing audit artifacts

Delete or archive stale audit files to prevent confusion:

```bash
# Archive old audits
$date = Get-Date -Format "yyyy-MM-dd"
New-Item -ItemType Directory -Path ".codex/archive/audit-$date" -Force
Move-Item ".codex/audit/*.md" ".codex/archive/audit-$date/" -ErrorAction SilentlyContinue
Move-Item "cleanup/*" ".codex/archive/audit-$date/cleanup/" -ErrorAction SilentlyContinue

# Clean temp files
Remove-Item "tmp-*" -Force -ErrorAction SilentlyContinue
```

## 0.2 — Create fresh audit directory structure

```bash
$auditRoot = ".codex/audit/$(Get-Date -Format 'yyyy-MM-dd')_production-audit"
New-Item -ItemType Directory -Path "$auditRoot" -Force
New-Item -ItemType Directory -Path "$auditRoot/00-cleanup" -Force
New-Item -ItemType Directory -Path "$auditRoot/01-structure" -Force
New-Item -ItemType Directory -Path "$auditRoot/02-stack" -Force
New-Item -ItemType Directory -Path "$auditRoot/03-browser-desktop" -Force
New-Item -ItemType Directory -Path "$auditRoot/04-browser-mobile" -Force
New-Item -ItemType Directory -Path "$auditRoot/05-folders" -Force
New-Item -ItemType Directory -Path "$auditRoot/06-issues" -Force
New-Item -ItemType Directory -Path "$auditRoot/07-plan" -Force
```

## 0.3 — Baseline snapshot

Record current state:
- `git status --porcelain`
- `git rev-parse --short HEAD`
- Run all gates and record results:
  - `pnpm -s docs:gate`
  - `pnpm -s typecheck`
  - `pnpm -s lint`
  - `pnpm -s styles:gate`
  - `pnpm -s knip`

Save to: `$auditRoot/00-cleanup/baseline.md`

══════════════════════════════════════════════════════════════════════════
 PHASE 1: STACK AUDITS (8 areas)
══════════════════════════════════════════════════════════════════════════

Run 8 READ-ONLY audits. Each produces a structured report.
Orchestrator aggregates findings and writes files. Subagents propose only.

NOTE: Update existing `.codex/refactor/*.md` files with findings (don't create duplicates).

## Subagent Manifest

┌────────────────────────────────────────────────────────────────────────┐
│ SUBAGENT A: STRUCTURE AUDIT                                            │
├────────────────────────────────────────────────────────────────────────┤
│ Goal: Map entire codebase structure, identify deletable artifacts       │
│ Scope: All root folders, IDE folders, temp folders, build artifacts    │
│ Output: $auditRoot/01-structure/structure-audit.md                     │
│                                                                         │
│ Tasks:                                                                  │
│ 1. List all root-level files and folders with purpose                  │
│ 2. Identify IDE/tool folders that should be gitignored                 │
│ 3. Find temp/one-off folders (temp-*, cleanup/, etc.)                  │
│ 4. Verify .gitignore completeness                                       │
│ 5. Propose delete/archive list with evidence                           │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SUBAGENT B: KNIP/DEAD CODE AUDIT                                       │
├────────────────────────────────────────────────────────────────────────┤
│ Goal: Identify all unused files, exports, dependencies                  │
│ Scope: Run `pnpm -s knip --reporter json` and analyze                  │
│ Output: $auditRoot/01-structure/dead-code-audit.md                     │
│                                                                         │
│ Tasks:                                                                  │
│ 1. List unused files (knip files)                                      │
│ 2. List unused exports (knip exports)                                   │
│ 3. List unused dependencies (knip dependencies)                         │
│ 4. Cross-reference with runtime usage (grep/semantic search)           │
│ 5. Categorize: safe-delete vs needs-investigation                      │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SUBAGENT C: NEXT.JS 16 APP ROUTER AUDIT                                │
├────────────────────────────────────────────────────────────────────────┤
│ Goal: Verify Next.js 16 best practices and RSC/client boundaries       │
│ Scope: app/**, next.config.ts, middleware                               │
│ Output: $auditRoot/02-stack/nextjs-audit.md                            │
│                                                                         │
│ Tasks:                                                                  │
│ 1. Audit "use client" usage (identify unnecessary client components)   │
│ 2. Verify route groups are correctly structured                         │
│ 3. Check loading.tsx/error.tsx/not-found.tsx consistency               │
│ 4. Verify generateMetadata/generateStaticParams usage                  │
│ 5. Check for Server Actions vs Route Handlers correctness              │
│ 6. Audit caching strategy (revalidate, unstable_cache)                 │
│ 7. Verify parallel routes and intercepting routes (if any)             │
│ 8. Check middleware.ts vs proxy.ts setup                                │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SUBAGENT D: TAILWIND V4 + SEMANTIC TOKENS AUDIT                        │
├────────────────────────────────────────────────────────────────────────┤
│ Goal: Enforce Tailwind v4 rails (tokens only, no palette/gradients)    │
│ Scope: All .tsx/.css files                                              │
│ Output: $auditRoot/02-stack/tailwind-v4-audit.md                       │
│                                                                         │
│ Tasks:                                                                  │
│ 1. Run `pnpm -s styles:gate` and analyze violations                    │
│ 2. Search for forbidden patterns:                                       │
│    - Arbitrary values: `[...]`                                          │
│    - Palette classes: `bg-blue-500`, `text-red-400`, etc.              │
│    - Gradients: `bg-gradient-*`, `from-*`, `to-*`, `via-*`             │
│    - Non-semantic colors                                                │
│ 3. Verify @theme variables in globals.css                              │
│ 4. Check shadcn-components.css alignment                                │
│ 5. Propose migration plan for violations                                │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SUBAGENT E: SHADCN/UI PRIMITIVES AUDIT                                 │
├────────────────────────────────────────────────────────────────────────┤
│ Goal: Ensure components/ui stays primitive-only, no app logic leakage  │
│ Scope: components/ui/**, components/**                                  │
│ Output: $auditRoot/02-stack/shadcn-audit.md                            │
│                                                                         │
│ Tasks:                                                                  │
│ 1. Verify components/ui/* are pure primitives (no fetch, no app state) │
│ 2. Identify app logic that leaked into primitives                       │
│ 3. Check Radix composition patterns                                     │
│ 4. Audit class-variance-authority usage                                 │
│ 5. Find duplicate/overlapping components in components/shared          │
│ 6. Verify cn() utility usage consistency                                │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SUBAGENT F: SUPABASE + AUTH AUDIT                                      │
├────────────────────────────────────────────────────────────────────────┤
│ Goal: Verify Supabase patterns, RLS, auth flow, query safety           │
│ Scope: lib/supabase/**, supabase/**, app/auth/**, app/actions/**       │
│ Output: $auditRoot/02-stack/supabase-audit.md                          │
│                                                                         │
│ Tasks:                                                                  │
│ 1. Check for `select('*')` on hot paths (forbidden)                    │
│ 2. Verify explicit column selection                                     │
│ 3. Audit RLS policies in supabase/migrations                            │
│ 4. Check auth flow (login/logout/session refresh)                       │
│ 5. Verify createClient patterns (server vs browser)                    │
│ 6. Check for N+1 query patterns                                         │
│ 7. Audit service role key usage (should be minimal)                    │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SUBAGENT G: I18N + NEXT-INTL AUDIT                                     │
├────────────────────────────────────────────────────────────────────────┤
│ Goal: Verify all user-facing copy uses next-intl, no hardcoded strings │
│ Scope: messages/**, i18n/**, all .tsx files with user-visible text     │
│ Output: $auditRoot/02-stack/i18n-audit.md                              │
│                                                                         │
│ Tasks:                                                                  │
│ 1. Run i18n parity test: keys in en.json must exist in bg.json         │
│ 2. Search for hardcoded UI strings in .tsx files                        │
│ 3. Verify useTranslations hook usage patterns                           │
│ 4. Check for `MISSING_MESSAGE` or raw translation keys in UI           │
│ 5. Audit locale routing (prefix-based)                                  │
│ 6. Verify getRequestConfig and i18n/request.ts setup                   │
└────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│ SUBAGENT H: TYPESCRIPT STRICTNESS AUDIT                                │
├────────────────────────────────────────────────────────────────────────┤
│ Goal: Verify TypeScript is strict, find type safety gaps               │
│ Scope: tsconfig.json, all .ts/.tsx files                                │
│ Output: $auditRoot/02-stack/typescript-audit.md                        │
│                                                                         │
│ Tasks:                                                                  │
│ 1. Verify tsconfig.json strict mode settings                            │
│ 2. Search for `any` types (should be minimal and justified)            │
│ 3. Check for `@ts-ignore` / `@ts-expect-error` usage                   │
│ 4. Audit type exports and imports patterns                              │
│ 5. Verify Supabase generated types are up to date                       │
│ 6. Check for missing return types on exported functions                 │
└────────────────────────────────────────────────────────────────────────┘

══════════════════════════════════════════════════════════════════════════
 PHASE 2: BROWSER AUDIT — DESKTOP
══════════════════════════════════════════════════════════════════════════

Method: Run existing E2E tests (`e2e/*.spec.ts`) + manual QA checklist.
Site: https://www.treido.eu (production) or localhost:3000 (dev)

## Desktop Viewport Configuration
- Resolution: 1440x900 (laptop)
- Locale: bg (primary), en (secondary check)
- User state: Guest (no auth)

## Desktop Routes to Audit (Sequential)

For each route, capture:
1. Screenshot (before/after interactions)
2. Console errors
3. Network failures
4. UI/UX issues
5. Missing translations
6. Broken links
7. Performance observations

### Route Checklist (Desktop)

```
HOME & NAVIGATION
├── / (redirect behavior)
├── /bg (home page)
├── /bg/search (empty + with query)
├── /bg/categories (main categories)
├── /bg/categories/[slug] (each major category)
└── Navigation (header, footer, breadcrumbs)

PRODUCT FLOW
├── /bg/search?q=iphone (search results)
├── /bg/search?q=iphone&page=2 (pagination)
├── /bg/[store]/[product-slug] (product detail)
├── Product interactions (images, tabs, variants)
└── Add to cart flow

CART & CHECKOUT
├── /bg/cart (empty + with items)
├── /bg/checkout (guest vs auth barrier)
├── Shipping step
├── Payment step (stop before actual payment)
└── Cart persistence

SELLER FLOW
├── /bg/sell (landing/wizard)
├── Sell wizard steps (as far as guest can go)
└── /bg/[username] (store profile pages)

ACCOUNT & AUTH
├── /bg/auth/login
├── /bg/auth/register
├── /bg/account (auth barrier)
└── Password reset flow

SUPPORT & LEGAL
├── /bg/customer-service
├── /bg/terms
├── /bg/privacy
├── /bg/faq
└── Footer links

SPECIAL FEATURES
├── /bg/todays-deals
├── /bg/chat (AI assistant)
├── /bg/assistant
└── Dark mode toggle (if exists)
```

Output: `$auditRoot/03-browser-desktop/` with separate .md for each area

══════════════════════════════════════════════════════════════════════════
 PHASE 3: BROWSER AUDIT — MOBILE
══════════════════════════════════════════════════════════════════════════

Method: Run E2E tests with mobile viewport + manual QA checklist.

## Mobile Viewport Configuration
- Resolution: 390x844 (iPhone 14 Pro)
- Touch simulation: enabled
- Locale: bg (primary)
- User state: Guest

## Mobile-Specific Focus Areas

1. Touch targets (min 44x44px)
2. Bottom navigation bar
3. Drawer/sheet interactions
4. Pull-to-refresh behavior
5. Scroll behavior (overscroll, momentum)
6. Safe area insets
7. Input handling (keyboard, autocomplete)
8. Mobile menu (hamburger)

### Route Checklist (Mobile)

Same routes as desktop, plus mobile-specific interactions:
- Bottom tab bar navigation
- Mobile search (expand/collapse)
- Product image gallery (swipe)
- Mobile cart sheet
- Mobile filters drawer
- Touch gestures throughout

Output: `$auditRoot/04-browser-mobile/` with separate .md for each area

## Cross-Platform Comparison

After both audits, create: `$auditRoot/04-browser-mobile/cross-platform-diff.md`
- Features working on desktop but broken on mobile
- Features working on mobile but broken on desktop
- Responsive breakpoint issues
- Navigation consistency issues

══════════════════════════════════════════════════════════════════════════
 PHASE 4: FOLDER-BY-FOLDER DEEP AUDIT
══════════════════════════════════════════════════════════════════════════

For EVERY root folder, produce a detailed audit.
Use the template from `.codex/refactor/ORCHESTRATION.md`.

NOTE: Existing audit files live in `.codex/refactor/_<folder>_.md` — UPDATE these rather than creating new files in $auditRoot.

## Folder Audit Template

For each folder `<FOLDER>`:

```
FOLDER AUDIT: <FOLDER>

1. PURPOSE
   - What SHOULD be in this folder (per project architecture)
   - What IS in this folder (inventory)

2. CONTENTS INVENTORY
   | File/Subfolder | Purpose | Keep/Move/Delete | Evidence |
   |----------------|---------|------------------|----------|

3. BOUNDARY VIOLATIONS
   - Server/client leaks
   - App logic in wrong layer
   - Circular dependencies
   - Import violations

4. DUPLICATION SIGNALS
   - Repeated patterns across files
   - Similar components with different names
   - Copy-paste code clusters

5. DELETE CANDIDATES (highest ROI first)
   | Item | Reason | References | Safe to Delete |
   |------|--------|------------|----------------|

6. MOVE/MERGE CANDIDATES
   | Item | From | To | Reason |
   |------|------|----|--------|

7. QUICK WINS (1-3 smallest safe changes)

8. VERIFICATION
   - Commands to run
   - What to check
```

## Folders to Audit (All of Them)

### Product Code Folders
- [ ] app/ (with deep dive into route groups)
- [ ] app/[locale]/ (each route group separately)
- [ ] app/actions/ (server actions)
- [ ] app/api/ (route handlers)
- [ ] components/ (top level organization)
- [ ] components/ui/ (shadcn primitives)
- [ ] components/shared/ (app composites)
- [ ] components/layout/ (layout components)
- [ ] components/mobile/ (mobile-specific)
- [ ] components/desktop/ (desktop-specific)
- [ ] hooks/ (custom hooks)
- [ ] lib/ (utilities and domain)
- [ ] lib/supabase/ (database layer)
- [ ] lib/data/ (cached data fetching)
- [ ] i18n/ (internationalization)
- [ ] messages/ (translation files)
- [ ] public/ (static assets)
- [ ] supabase/ (migrations and policies)

### Test/E2E Folders
- [ ] __tests__/ (unit tests)
- [ ] e2e/ (playwright specs)
- [ ] test/ (test utilities)

### Documentation Folders
- [ ] docs/ (stable documentation)
- [ ] docs-site/ (documentation website)
- [ ] .codex/ (operational state)

### Config/Tool Folders
- [ ] .github/ (CI/CD)
- [ ] .vscode/ (editor config)
- [ ] scripts/ (build/dev scripts)
- [ ] .storybook/ (if exists)

### Generated/Ignored (verify gitignore)
- [ ] .next/ (should not be committed)
- [ ] node_modules/ (should not be committed)
- [ ] playwright-report/ (should not be committed)
- [ ] storybook-static/ (should not be committed)
- [ ] test-results/ (should not be committed)

Output: `$auditRoot/05-folders/<folder-name>.md` for each

══════════════════════════════════════════════════════════════════════════
 PHASE 5: ISSUE CONSOLIDATION & PRIORITIZATION
══════════════════════════════════════════════════════════════════════════

## 5.1 — Aggregate all issues from all audits

Create master issue list in `$auditRoot/06-issues/`:
- `critical.md` — Ship blockers (must fix before production)
- `high.md` — Important but not blocking
- `medium.md` — Should fix soon
- `low.md` — Nice to have
- `deferred.md` — Out of scope for this audit

## 5.2 — Issue Template

```markdown
## ISSUE-XXX: <Short Title>

**Severity:** 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low
**Category:** Frontend | Backend | I18N | Performance | Security | UX
**Source:** Phase X — <Audit Name>

### Description
<What is wrong>

### Evidence
- File: <path>
- Screenshot: <if browser audit>
- Error: <console/network/typecheck>

### Impact
<What breaks if not fixed>

### Proposed Fix
<How to fix it>

### Files to Change
- <filepath1>
- <filepath2>

### Verification
- <command to verify fix>
- <what to look for>

### Dependencies
- Blocks: <other issues>
- Blocked by: <other issues>
```

## 5.3 — Create summary matrix

`$auditRoot/06-issues/SUMMARY.md`:

```markdown
| ID | Title | Severity | Category | Phase | Status |
|----|-------|----------|----------|-------|--------|
| ISSUE-001 | ... | 🔴 | Frontend | Browser-Mobile | Open |
```

══════════════════════════════════════════════════════════════════════════
 PHASE 6: REFACTOR BATTLE PLAN
══════════════════════════════════════════════════════════════════════════

## 6.1 — Update existing refactor files

Based on all audit findings, update:
- `.codex/refactor/TASKS.md` — Mark completed audits, add new tasks
- `.codex/refactor/_*.md` — Update each folder audit file with findings
- `.codex/refactor/*.md` — Update stack audit files

## 6.2 — Flow issues into `.codex/TASKS.md`

Critical/High issues become tasks in the active queue.
Follow the task format from `.codex/TASKS.md`:
- Priority, Owner, Verify, Files
- Respect the ≤15 Ready limit

## 6.3 — Create execution plan

`$auditRoot/07-plan/BATTLE-PLAN.md`:

### Immediate Actions (This Session)
- Delete confirmed dead code (knip-verified)
- Fix critical browser issues
- Fix gate failures

### Short-Term (Next 24-48 hours)
- Prioritized issue fixes
- Component consolidation batches
- i18n completeness

### Medium-Term (Next Week)
- Major refactors
- Performance optimizations
- Test coverage improvements

### Long-Term (Backlog)
- Architecture improvements
- Technical debt items
- Nice-to-haves

## 6.4 — Gate checkpoint plan

Define gate checkpoints between refactor batches:

```
BATCH 1: Dead code deletion
  └─ GATE: typecheck + lint + styles:gate + knip

BATCH 2: Critical browser fixes
  └─ GATE: typecheck + lint + manual browser check

BATCH 3: Component consolidation
  └─ GATE: typecheck + lint + styles:gate + test:unit

BATCH 4: i18n completeness
  └─ GATE: typecheck + lint + test:unit (i18n parity)

...and so on
```

══════════════════════════════════════════════════════════════════════════
 PHASE 7: EXECUTION (OPTIONAL — IF TIME PERMITS)
══════════════════════════════════════════════════════════════════════════

Only proceed to execution if:
1. All audits are complete
2. Issues are prioritized
3. Battle plan is approved (or --full-auto mode)

## Execution Rules

1. **One batch at a time** — No big-bang changes
2. **Gate between batches** — All gates must pass before next batch
3. **Commit checkpoints** — Small logical commits
4. **Rollback ready** — If gates fail, revert to last green state
5. **Document changes** — Update SHIPPED.md

## Batch Execution Template

```
BATCH N: <Name>

PRE-CHECK:
- [ ] All gates green
- [ ] Git clean (working tree)

CHANGES:
- [ ] <Change 1>
- [ ] <Change 2>
- [ ] ...

POST-CHECK:
- [ ] typecheck passes
- [ ] lint passes
- [ ] styles:gate passes
- [ ] knip passes
- [ ] (optional) test:unit passes

COMMIT:
- Message: <commit message>
- Files: <count>
```

══════════════════════════════════════════════════════════════════════════
 OUTPUT ARTIFACTS (What This Audit Produces)
══════════════════════════════════════════════════════════════════════════

```
.codex/audit/YYYY-MM-DD_production-audit/
├── 00-cleanup/
│   ├── baseline.md
│   ├── archive-log.md
│   └── git-status.md
├── 01-structure/
│   ├── structure-audit.md
│   └── dead-code-audit.md
├── 02-stack/
│   ├── nextjs-audit.md
│   ├── tailwind-v4-audit.md
│   ├── shadcn-audit.md
│   ├── supabase-audit.md
│   ├── i18n-audit.md
│   └── typescript-audit.md
├── 03-browser-desktop/
│   ├── home-navigation.md
│   ├── product-flow.md
│   ├── cart-checkout.md
│   ├── seller-flow.md
│   ├── account-auth.md
│   └── support-legal.md
├── 04-browser-mobile/
│   ├── home-navigation.md
│   ├── product-flow.md
│   ├── cart-checkout.md
│   ├── seller-flow.md
│   ├── account-auth.md
│   ├── support-legal.md
│   └── cross-platform-diff.md
├── 05-folders/
│   ├── app.md
│   ├── components.md
│   ├── hooks.md
│   ├── lib.md
│   ├── ... (one per root folder)
│   └── FOLDER-INDEX.md
├── 06-issues/
│   ├── critical.md
│   ├── high.md
│   ├── medium.md
│   ├── low.md
│   ├── deferred.md
│   └── SUMMARY.md
└── 07-plan/
    ├── BATTLE-PLAN.md
    ├── BATCH-LOG.md
    └── FINAL-REPORT.md
```

══════════════════════════════════════════════════════════════════════════
 HARD CONSTRAINTS (NEVER VIOLATE)
══════════════════════════════════════════════════════════════════════════

1. **NO SECRET/PII EXPOSURE** — Never log, commit, or display credentials
2. **PRESERVE BEHAVIOR** — Zero functional regressions
3. **SINGLE-WRITER** — Only orchestrator writes files; subagents propose
4. **GATE-GATED** — Never proceed if gates are red
5. **REVERSIBLE** — Every change must be revertable
6. **DOCUMENTED** — Every action logged in audit files
7. **INCREMENTAL** — Small batches, not big-bang

══════════════════════════════════════════════════════════════════════════
 START NOW
══════════════════════════════════════════════════════════════════════════

BEGIN PHASE 0:
1. Clean existing audit artifacts
2. Create fresh audit directory structure
3. Record baseline snapshot
4. Run all gates

Then proceed sequentially through Phases 1-7, checkpointing between phases.
```

---

## Quick Reference Commands

```bash
# Full audit
codex --model claude-opus-4-20250514 --approval auto-edit --full-auto "$(cat .codex/prompts/ultimate-production-audit.md)"

# Audit only (skip execution)
codex --model claude-opus-4-20250514 --approval auto-edit "Run phases 0-6 only"

# Single phase
codex "Run Phase N from .codex/prompts/ultimate-production-audit.md"
```

---

*Last updated: 2026-02-04*
````