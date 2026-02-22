# Code Cleanup & Dead Code Sweep

> Codex: Read `AGENTS.md` first. Execute sections top-to-bottom.
> After each section, run `pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit`.
> 
> **PARALLEL WORK WARNING:** Another agent is simultaneously editing mobile UI/styling files.
> **DO NOT touch any file matching these patterns:**
> - `components/layout/header/mobile/*.tsx`
> - `components/mobile/category-nav/*.tsx`
> - `components/shared/product/card/mobile.tsx`
> - `components/shared/visual-drawer-surface.tsx`
> - `app/[locale]/(main)/_components/mobile-home/*.tsx`
> - `app/[locale]/(main)/_components/mobile/*.tsx`
> - `app/[locale]/(main)/categories/[slug]/_components/mobile/*.tsx`
> - `app/[locale]/(account)/_components/account-layout-content.tsx`
> - `app/[locale]/(sell)/_components/layouts/*.tsx`
> - `app/[locale]/(chat)/_components/messages-page-client.tsx`
> - `app/[locale]/(checkout)/_components/checkout-page-layout.tsx`
> - `app/[locale]/_components/search/mobile-search-overlay.tsx`
> - `app/[locale]/[username]/[productSlug]/_components/mobile/mobile-bottom-bar.tsx`
>
> If you're unsure whether a file is safe, skip it.

---

## Section 1 — Delete Confirmed Dead Files

These files have **zero imports** anywhere in application code. Verified dead.

Delete each file. If deletion breaks any import, the typecheck will catch it — stop and investigate.

### Files to delete:

1. `app/[locale]/(account)/account/_components/mobile-account-hub.tsx`
2. `app/[locale]/(account)/account/_components/mobile-account-sign-out-row.tsx`
3. `app/[locale]/(main)/search/_components/mobile-browse-mode-switch.tsx`
4. `app/[locale]/(sell)/_components/steps/step-what.tsx`
5. `app/[locale]/[username]/_components/profile/profile-settings-panel.tsx`
6. `app/[locale]/[username]/_components/profile/profile-tabs.tsx`
7. `components/layout/header/desktop/minimal-header.tsx`

### After deleting #3 (`mobile-browse-mode-switch.tsx`):
- Check if `e2e/mobile-browse-mode.spec.ts` exists. If it does and it ONLY tests the deleted component, delete the spec too.
- Check `scripts/scan-mobile-chrome-consistency.mjs` — if it references `mobile-browse-mode-switch`, remove that reference.

### Verification:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

---

## Section 2 — Eliminate Category Re-export Shims

These top-level `lib/` category modules are thin re-export shims and should not be imported anymore:

1. `lib/category-tree.ts`
2. `lib/category-display.ts`
3. `lib/category-colors.ts`

### Steps:
1. Replace imports to use the canonical modules in `lib/data/categories/`:
   - `lib/category-tree.ts` → `lib/data/categories/types.ts`
   - `lib/category-display.ts` → `lib/data/categories/display.ts`
   - `lib/category-colors.ts` → `lib/data/categories/colors.ts`
2. Delete the 3 shim files.
3. Run verification.

### Verification:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

---

## Section 3 — Investigate & Remove Unused Dependencies

Run `pnpm knip` to get the current list of unused dependencies/exports.

For each finding knip reports:
1. **Unused dependencies:** Verify with a grep for the package import. If truly unused, `pnpm remove <package>`.
2. **Unused exports:** If the export is in a file NOT on the do-not-touch list above, remove the dead export.
3. **Unused files:** If knip flags additional dead files beyond Section 1, verify and delete them.

Focus on production dependencies first. Skip devDependencies unless knip is very confident they're unused.

### Candidates to investigate specifically:
- `recharts` — is it imported anywhere in app/?
- `remark-gfm` — is it imported anywhere?
- `boring-avatars` — still used?
- `cmdk` — still wired up?
- `photoswipe` — still used for gallery?
- `@ai-sdk/groq` — are all 3 AI providers used or just 1-2?

If a package IS used, leave it. Only remove packages with zero application imports.

### Verification:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s test:unit
```

---

## Section 4 — Clean Up Test `any` Types

These test files use `as any` or `: any` casts for mocks. Replace with proper types where easy.

### Files to improve (if you can type them properly without excessive effort):
- `__tests__/proxy-middleware.test.ts` — 5 instances of `as any` for mock objects
- `__tests__/supabase-middleware-session.test.ts` — 1 instance of `as any`

**Approach:** Create minimal mock types or use `Partial<T>` + `as T` instead of `as any`. Or use `vi.fn()` typed generics.

If typing a mock properly requires importing heavy types or is non-trivial, skip it — `as any` in tests is acceptable.

### Do NOT touch:
- E2E test files (Playwright `any` patterns are standard)

### Verification:
```bash
pnpm -s typecheck && pnpm -s test:unit
```

---

## Section 5 — Architecture & Code Quality Scan

Run the project's architecture scanner and fix any new findings:

```bash
pnpm -s architecture:scan
```

For each finding:
- **Oversized files (>300 lines):** If the file is NOT on the do-not-touch list, look for easy extraction opportunities (helper functions, sub-components). Only refactor if the extraction is clean and obvious.
- **Duplicate code:** If jscpd flags duplicate blocks between files, evaluate if a shared utility makes sense. Only extract if both files can cleanly use the shared code.
- **Client boundary issues:** If a `"use client"` file could be a Server Component (no hooks, no event handlers, no browser APIs), remove the directive.

Don't force refactors. If a file is complex and the extraction isn't obvious, skip it.

### Verification:
```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

---

## Section 6 — Final Full Verification

Run the complete gate check:

```bash
pnpm -s typecheck && pnpm -s lint && pnpm -s styles:gate && pnpm -s test:unit
```

All must pass. Zero regressions.

---

*Created: 2026-02-21*
