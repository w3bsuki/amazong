# CODEX CLEANUP SWEEP — Production Codebase Hardening

> **Goal:** Systematically audit every folder in the codebase, fix naming, delete dead code, and leave a production-clean tree.  
> **Safety net:** Do NOT push to git. All changes are local-only — revertible via `git checkout .` or GitHub.  
> **Approach:** Use subagents. One folder at a time. Methodical. Exhaustive.

---

## 0. BEFORE YOU START — Read These Files

```
AGENTS.md          — Non-negotiable project rules
ARCHITECTURE.md    — Canonical directory structure + module map
docs/DESIGN.md     — UI/frontend token contract
```

These define what SHOULD exist. Anything that contradicts them is a cleanup target.

---

## 1. NAMING CONVENTIONS (Enforce Everywhere)

### Files & Folders
- **kebab-case** for all files and folders: `mobile-home.tsx`, `product-card.tsx`
- **No version suffixes** in production code: `home-v4` → `home`, `use-home-v4-discovery-feed` → `use-home-discovery-feed`
- **No `-old`, `-backup`, `-copy`, `-temp`, `-draft`, `-wip`** suffixes
- **Route-private folders** use underscore prefix: `_components/`, `_actions/`, `_lib/`, `_providers/`
- **Test files** mirror source names: `lib/home-pools.ts` → `__tests__/home-pools.test.ts`

### Known Renames Needed
| Current | Target | Why |
|---------|--------|-----|
| `lib/home-v4-pools.ts` | `lib/home-pools.ts` | Drop version suffix |
| `hooks/use-home-v4-discovery-feed.ts` | `hooks/use-home-discovery-feed.ts` | Drop version suffix (check if `use-home-discovery-feed.ts` already exists — if so, the old one is dead code, delete it) |
| `app/[locale]/(main)/_components/mobile-home-v4.tsx` | `app/[locale]/(main)/_components/mobile-home.tsx` | Drop version suffix (delete old `mobile-home.tsx` if it exists and is superseded) |
| `e2e/home-v4.spec.ts` | `e2e/home.spec.ts` | Drop version suffix |
| `__tests__/home-v4-pools.test.ts` | `__tests__/home-pools.test.ts` | Match renamed source |
| `__tests__/hooks/use-home-v4-discovery-feed.test.ts` | `__tests__/hooks/use-home-discovery-feed.test.ts` | Match renamed hook |

**CRITICAL:** When renaming, you MUST update ALL imports/references across the entire codebase. Use grep to find every import path, every dynamic import, every test reference, every config reference. Miss nothing.

---

## 2. WHAT TO DELETE

### Dead Code Signals
- Files with **zero imports** (use `grep -r "from.*filename"` to verify)
- Old versions superseded by newer files (e.g., `mobile-home.tsx` if `mobile-home-v4.tsx` is the active one)
- Commented-out code blocks (> 10 lines of comments that are dead code)
- Unused exports (functions/components exported but never imported anywhere)
- Empty files, empty folders, placeholder files

### Likely Deletion Candidates (Verify Before Deleting)
| Path | Reason | Verify |
|------|--------|--------|
| `cleanup/` | Scan report artifacts — not production code | Confirm nothing imports from here |
| `production-audit/` | Audit evidence — not runtime code | Confirm not imported |
| `docs-revamp/` | Empty staging folder | Confirm empty |
| `app/legacy-vars.css` | Legacy — check if still imported in `globals.css` | grep for imports |
| `CODEX-PRODUCTION-PUSH.md` | Temp orchestration doc | Confirm not referenced |
| `TASKS.md` | Task tracker — not production code (keep if team uses it) | Ask/skip |
| Old hook if both exist: `hooks/use-home-discovery-feed.ts` alongside `use-home-v4-discovery-feed.ts` | One supersedes the other | Check which is imported |

### DO NOT DELETE
- Any file in `components/ui/` (shadcn primitives — all owned and used)
- Any file referenced in `ARCHITECTURE.md` module map
- Translation files (`messages/en.json`, `messages/bg.json`)
- Config files (`next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, etc.)
- Supabase migrations (`supabase/`)
- Test infrastructure (`test/setup.ts`, `test/shims/`, `vitest.config.ts`, etc.)
- E2E fixtures and setup (`e2e/fixtures/`, `e2e/global-setup.ts`)

---

## 3. METHODOLOGY — Subagent-Per-Folder Sweep

### Execution Order

Process folders **top-down, breadth-first**. Each folder gets its own subagent. The subagent:

1. **Lists all files** in the folder
2. **For each file:** checks if it's imported anywhere in the codebase (`grep -rn "from.*<filename>" --include="*.ts" --include="*.tsx"`)
3. **Identifies:** dead code, bad naming, version suffixes, empty files
4. **Renames** files that violate naming conventions (+ updates ALL imports)
5. **Deletes** confirmed dead files
6. **Reports** what was changed

### Folder Processing Order

```
PHASE 1 — Root-level files
  Root config files, markdown docs, top-level scripts

PHASE 2 — lib/ (deepest dependency, no app imports allowed)
  lib/                          (each subfolder individually)
  lib/ai/
  lib/api/
  lib/attributes/
  lib/auth/
  lib/badges/
  lib/boost/
  lib/data/
  lib/filters/
  lib/icons/
  lib/navigation/
  lib/next/
  lib/sell/
  lib/supabase/
  lib/types/
  lib/ui/
  lib/upload/
  lib/utils/
  lib/validation/
  lib/view-models/

PHASE 3 — hooks/
  hooks/

PHASE 4 — components/ (shared layer)
  components/ui/               (audit only — no deletions unless truly unused)
  components/shared/
  components/shared/product/
  components/shared/category/
  components/shared/filters/
  components/shared/search/
  components/shared/profile/
  components/shared/wishlist/
  components/layout/
  components/layout/header/
  components/layout/sidebar/
  components/desktop/
  components/mobile/
  components/mobile/category-nav/
  components/mobile/drawers/
  components/auth/
  components/providers/
  components/dropdowns/
  components/grid/

PHASE 5 — app/[locale]/_components/ (locale-level shared)
  app/[locale]/_components/
  app/[locale]/_components/auth/
  app/[locale]/_components/charts/
  app/[locale]/_components/drawers/
  app/[locale]/_components/nav/
  app/[locale]/_components/navigation/
  app/[locale]/_components/orders/
  app/[locale]/_components/providers/
  app/[locale]/_components/search/
  app/[locale]/_components/seller/
  app/[locale]/_providers/

PHASE 6 — Route groups (each group = one subagent)
  app/[locale]/(main)/              — Homepage, search, categories, cart
  app/[locale]/(main)/_components/
  app/[locale]/(main)/_components/mobile/
  app/[locale]/(main)/_components/desktop/
  app/[locale]/(main)/_components/category/
  app/[locale]/(main)/_components/filters/
  app/[locale]/(main)/_components/layout/
  app/[locale]/(main)/_components/search-controls/
  app/[locale]/(main)/_lib/
  app/[locale]/(main)/_providers/
  app/[locale]/(main)/cart/
  app/[locale]/(main)/categories/
  app/[locale]/(main)/search/
  app/[locale]/(main)/seller/
  app/[locale]/(main)/sellers/
  app/[locale]/(main)/wishlist/
  app/[locale]/(main)/todays-deals/
  app/[locale]/(main)/gift-cards/
  app/[locale]/(main)/members/
  app/[locale]/(main)/registry/
  app/[locale]/(main)/about/
  app/[locale]/(main)/accessibility/
  app/[locale]/(main)/assistant/
  app/[locale]/(main)/demo/
  app/[locale]/(main)/messages/
  app/[locale]/(main)/(legal)/
  app/[locale]/(main)/(support)/

  app/[locale]/(account)/
  app/[locale]/(auth)/
  app/[locale]/(sell)/
  app/[locale]/(checkout)/
  app/[locale]/(business)/
  app/[locale]/(chat)/
  app/[locale]/(plans)/
  app/[locale]/(admin)/
  app/[locale]/(onboarding)/
  app/[locale]/[username]/

PHASE 7 — app/actions/ and app/api/
  app/actions/
  app/api/                      (each subfolder)

PHASE 8 — Supporting directories
  i18n/
  messages/
  scripts/
  e2e/
  __tests__/
  __tests__/api/
  __tests__/hooks/
  test/
  supabase/
  public/
  docs/
  cleanup/                      (likely full deletion)
  production-audit/             (likely full deletion)

PHASE 9 — Final verification
  Run full gate: pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
  Run unit tests: pnpm -s test:unit
  Fix any breakage from renames/deletions
```

---

## 4. SUBAGENT PROMPT TEMPLATE

For each folder, spawn a subagent with this prompt pattern:

```
CONTEXT: You are cleaning up the Treido marketplace codebase for production.
Read AGENTS.md and ARCHITECTURE.md for project rules and canonical structure.

TASK: Audit the folder `<FOLDER_PATH>` and all its direct files.

STEPS:
1. List every file in `<FOLDER_PATH>`.
2. For each file:
   a. Check naming: must be kebab-case, no version suffixes (-v2, -v3, -v4),
      no -old/-backup/-copy/-temp/-draft/-wip suffixes.
   b. Check if imported anywhere: run `grep -rn "from.*<filename-without-ext>" --include="*.ts" --include="*.tsx" .`
      Also check for dynamic imports, re-exports, and test references.
   c. Check for large blocks of commented-out code (>10 lines).
   d. Check for unused exports within the file.
3. RENAME files that violate naming conventions:
   - Use `mv` to rename the file
   - Update EVERY import across the entire codebase that references the old name
   - Update EVERY test file that references the old name
   - Verify no broken imports remain: `grep -rn "<old-name>" --include="*.ts" --include="*.tsx" .`
4. DELETE files that are confirmed dead (zero imports, not a route page/layout/loading/error/not-found).
   - NEVER delete: page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx, route.ts (these are Next.js conventions)
   - NEVER delete config files or translation files
5. DELETE empty folders after cleanup.
6. Remove large commented-out code blocks within remaining files.

REPORT back:
- Files renamed (old → new) and how many imports were updated
- Files deleted and confirmation they had zero references
- Files kept with concerns (potential dead code but uncertain)
- Any errors encountered

DO NOT modify business logic, styling, or functionality. This is a naming + dead-code cleanup only.
```

---

## 5. VERIFICATION GATES

### After Each Phase
```bash
pnpm -s typecheck        # Must pass — catches broken imports
pnpm -s lint             # Must pass — catches import issues
```

### After All Phases Complete
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate
pnpm -s test:unit
```

### If Anything Breaks
- Check if a rename missed an import — grep for the old name
- Check if a deletion removed something still needed — `git diff --stat` to see what changed
- Revert specific files with `git checkout -- <path>` if needed

---

## 6. DECISION LOG

Track every non-trivial decision in this format:

```
DECISION: <what was decided>
REASON: <why>
FILES: <affected files>
```

Write decisions to `.codex/CLEANUP-DECISIONS.md` as you go.

---

## 7. CONSTRAINTS

- **NO git push** — all changes stay local
- **NO database changes** — no migrations, no RLS changes
- **NO business logic changes** — only naming and dead code removal
- **NO dependency changes** — no adding/removing packages
- **NO new features** — this is cleanup only
- **PRESERVE all tests** — rename test files to match renamed sources, but don't delete working tests
- **PRESERVE all translations** — `messages/*.json` are untouchable
- **PRESERVE all configs** — `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `playwright.config.ts`, `components.json`, `knip.json`, `postcss.config.mjs`

---

## 8. SUCCESS CRITERIA

When done:
1. Zero version suffixes (`-v2`, `-v3`, `-v4`) in any filename
2. Zero `-old`/`-backup`/`-copy`/`-temp` suffixed files
3. All files follow kebab-case naming
4. No empty folders remain
5. No files with zero imports (except entry points: page/layout/route/config)
6. `cleanup/` and `production-audit/` removed (or justified)
7. `pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate` passes
8. `pnpm -s test:unit` passes
9. `.codex/CLEANUP-DECISIONS.md` documents every deletion and rename rationale
