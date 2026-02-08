
> Execution Status: Reference Only
> This playbook is an input reference. Active execution tracking lives in codex/master-refactor-plan.md and codex/phases/*.md.

# Task: Dead Code & Dependency Cleanup

> **Read `codex/AGENTS.md` first.** It contains the project context, folder map, non-negotiables, and verification gates.

## Objective

Delete every file, export, dependency, and artifact that is not actively used. This is the first task because it reduces the surface area for all subsequent refactors.

---

## Phase 1: Tooling-Driven Dead Code Detection

### 1.1 Run Knip (unused file/export/dependency scanner)

```bash
pnpm -s knip
```

Knip is already configured in `knip.json`. It will report:
- **Unused files** — TS/TSX files not imported by any entrypoint
- **Unused exports** — Named exports that nothing imports
- **Unused dependencies** — Packages in `package.json` with zero imports
- **Unused devDependencies** — Dev packages not referenced by any config or script

For every finding:
1. Verify it is genuinely unused (check for dynamic imports, re-exports, and barrel files).
2. If confirmed unused, delete the file or remove the export.
3. If it's a dependency, run `pnpm remove <package>`.
4. Run gates after each batch of deletions.

### 1.2 Run Duplicate Code Detection

```bash
pnpm -s dupes
```

This runs `jscpd` across `app/`, `components/`, and `lib/` with `--min-lines 10`. For every duplicate block found:
1. Determine which copy is the canonical one (the one with more imports, better location, etc.).
2. Delete the duplicate and update all importers to use the canonical version.
3. If both copies are identical utilities, extract to a shared location in `lib/`.

---

## Phase 2: Manual Dead Code Audit

Knip may miss things due to dynamic imports or barrel exports. Manually audit these known problem areas:

### 2.1 Root-Level Junk Files

- `tmp-delete-test.txt` — Delete it.
- `cleanup/` folder — Contains old scan reports (`arbitrary-scan-report.txt`, `palette-scan-report.txt`, `semantic-token-scan-report.txt`, `token-alpha-scan-report.txt`, `mobile-chrome-scan-report.txt`, `ux-snapshots/`). These are artifacts from past audits. Delete the entire `cleanup/` folder.
- `storybook-static/` — Built Storybook output. Should be gitignored, not committed. Delete the folder and ensure it's in `.gitignore`.

### 2.2 Reference/Guide Folders

- `shadcn-tailwind-v4-ecommerce-ui-guide/` — A reference guide folder with 10+ markdown files and a `snippets/` subfolder. This is documentation/learning material, not runtime code. Delete the entire folder if it's not referenced by any script or build process. Check `tsconfig.json` excludes — it's already excluded from TypeScript compilation, confirming it's not runtime code.

### 2.3 Docs Duplication

The `docs/` folder has TWO sets of the same documents:
- Numbered: `01-PRD.md`, `02-FEATURES.md`, `03-ARCHITECTURE.md`, ..., `15-DEV-DEPARTMENT.md`
- Unnumbered: `PRD.md`, `FEATURES.md`, `ARCHITECTURE.md`, ..., `DEV-DEPARTMENT.md`

Also has: `INDEX.md` and `00-INDEX.md`.

Audit which set is canonical (likely the numbered set since it's more organized). Diff the pairs. If they're identical or the unnumbered ones are stale copies, delete the unnumbered duplicates. If they differ, keep the more recent version under the numbered name.

Additionally audit:
- `docs/archive/` — Contains `cleanup/`, `legal-drafts/`, `production-2026-02-02/`, `refactor-2026-02-02/`, `uirefactor/`. This is all archived material. Delete the entire `docs/archive/` folder.
- `docs/refactor.md` — Likely an old refactor plan. Delete if superseded by `docs/PROJECT-CLEANUP-MASTER-PLAN.md`.
- `docs/DOCS-PLAN.md`, `docs/PROMPT-GUIDE.md` — Audit for relevance. Delete if they're meta-docs rather than product docs.

### 2.4 Binary Assets in Wrong Locations

- `components/auth/image.png` — A PNG file inside a component folder. Either move to `public/` if it's used, or delete if it's not.

### 2.5 Legacy Agent Configuration

- `.codex/` folder — Already marked as legacy in root `AGENTS.md`. Contains `agents/`, `rules/`, and a deprecated `AGENTS.md`. Delete the entire `.codex/` folder since the new `codex/` (no dot) replaces its purpose.

### 2.6 TSConfig Excludes Pointing to Nonexistent Folders

Check if these folders in `tsconfig.json` excludes actually exist:
- `inspiration/`
- `temp-tradesphere-audit/`
- `refactor/`

If they don't exist, remove their entries from `tsconfig.json` excludes. If they do exist, they're likely old audit artifacts — delete the folders and then clean the excludes.

---

## Phase 3: Hooks Audit

Audit every file in `hooks/`:

```
hooks/
  use-badges.ts
  use-category-attributes.ts
  use-category-counts.ts
  use-category-navigation.ts
  use-current-username.ts
  use-filter-count.ts
  use-geo-welcome.ts
  use-instant-category-browse.ts
  use-mobile.ts
  use-notification-count.ts
  use-product-quick-view-details.ts
  use-product-search.ts
  use-recently-viewed.ts
  use-toast.ts
  use-view-mode.ts
```

For each hook: grep the codebase for imports. If a hook has zero importers, delete it. If it has exactly one importer, consider inlining it into that component.

Also check `__tests__/hooks/` — delete test files for hooks that no longer exist.

---

## Phase 4: Dependency Cleanup

### 4.1 Check for Redundant Icon Libraries

The project uses BOTH `@phosphor-icons/react` AND `lucide-react` AND `@tabler/icons-react`. That's 3 icon libraries.

1. Grep the codebase for imports from each library.
2. Determine which library has the most usage.
3. If one library has very few imports (< 5), migrate those icons to the dominant library and remove the dependency.
4. Ideally the project should use at most 2 icon libraries (one primary, shadcn's lucide for primitives).

### 4.2 Check for Unused Dependencies

Beyond what knip catches, manually check these potentially unused packages:
- `boring-avatars` — Search for imports
- `photoswipe` — Search for imports
- `react-markdown` + `remark-gfm` — Search for imports
- `cmdk` — Used by shadcn Command component? Verify.
- `client-only` and `server-only` — Verify usage
- `@capacitor/*` packages — Mobile app wrappers. If Capacitor builds aren't actively used, these are dead weight. But DON'T remove without confirming with the human.

### 4.3 Check DevDependency Bloat

- `@storybook/*` packages (3 packages) — Is Storybook actively used? If stories are being deleted in shadcn.md task, Storybook itself may become removable. Flag but don't remove yet.
- `jscpd` — Used by `pnpm -s dupes`. Keep.
- `@lhci/cli` — Lighthouse CI. Keep if actively used in CI.

---

## Phase 5: Empty Folders and Orphaned Files

After all deletions, scan for:
- Empty directories (no files remaining) — delete them
- Barrel files (`index.ts`) that re-export nothing or re-export from deleted modules — fix or delete
- Import paths that now point to deleted files — fix all broken imports

Run final verification:

```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s styles:gate
pnpm -s test:unit
pnpm -s knip
```

---

## Completion Criteria

- `pnpm -s knip` reports zero unused files, exports, and dependencies
- `pnpm -s dupes` reports zero duplicate code blocks
- No junk files in root (`tmp-*`, `*.bak`, etc.)
- No orphaned folders (`cleanup/`, `shadcn-tailwind-v4-ecommerce-ui-guide/`, `storybook-static/`, `docs/archive/`)
- All `tsconfig.json` excludes reference folders that actually exist
- All gates pass cleanly
