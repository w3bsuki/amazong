# Dead Code Audit Report

**Date:** 2026-02-02  
**Auditor:** AI Agent (Read-Only)  
**Tools Used:** Knip, grep, manual import tracing  
**Codebase:** Treido Marketplace (Next.js 16)

---

## Executive Summary

| Category | Count | Risk Level |
|----------|-------|------------|
| Unused Files | 2 | 🟢 Safe to remove |
| Unused Exports | 3 | 🟢 Safe to remove |
| Temp Files | 1 | 🟢 Safe to remove |
| Planning Artifacts | 3 folders | 🟡 Review before removal |
| Deprecated (Still Used) | 3 | ⚪ Keep (backward compat) |
| Intentionally Ignored Deps | 3 | ⚪ Keep (mobile build) |

**Total Removable Items:** 6 files/exports  
**Estimated Cleanup Time:** 15 minutes

---

## 1. Unused Files

Files confirmed as unused by Knip static analysis (not imported anywhere).

| Path | Type | Evidence | Safe to Remove? | Phase |
|------|------|----------|-----------------|-------|
| [app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx](app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx) | Component | Knip: unused file; `rg` shows no imports outside itself | ✅ Yes | 2 |
| [components/shared/auth/social-input.tsx](components/shared/auth/social-input.tsx) | Component | Knip: unused file; Only imported by above unused modal | ✅ Yes | 2 |

### Analysis Notes

- **post-signup-onboarding-modal.tsx**: This is a 700+ line onboarding modal that was superseded by the `/onboarding/*` route-based flow. The modal imports `SocialInput` and `boring-avatars`, contributing to bundle size without being rendered.

- **social-input.tsx**: A social media URL input component that was moved to `components/shared/auth/` but its only consumer (the modal above) is itself unused.

---

## 2. Unused Exports

Exports that exist but are never imported anywhere in the codebase.

| Path:Line | Export Name | Evidence | Safe to Remove? | Phase |
|-----------|-------------|----------|-----------------|-------|
| [components/shared/field.tsx:181](components/shared/field.tsx#L181) | `FieldLegend` | Knip: unused export; `rg` confirms no imports | ✅ Yes | 2 |
| [components/shared/field.tsx:182](components/shared/field.tsx#L182) | `FieldSet` | Knip: unused export; `rg` confirms no imports | ✅ Yes | 2 |
| [components/mobile/category-nav/category-mini-bar.tsx:28](components/mobile/category-nav/category-mini-bar.tsx#L28) | `CategoryMiniBar` | Knip: unused export; Re-exported in index.ts but never consumed | ✅ Yes | 2 |

### Analysis Notes

- **FieldLegend/FieldSet**: These are form primitives in the field component file that were created but never adopted. The file also exports `Field`, `FieldGroup`, `FieldError`, `FieldDescription` which ARE used.

- **CategoryMiniBar**: A mobile category navigation component that was likely superseded by other navigation patterns. It's exported from the index but no consumer exists.

---

## 3. Temp/Test Files

Files that appear to be temporary or test artifacts.

| Path | Type | Evidence | Safe to Remove? | Phase |
|------|------|----------|-----------------|-------|
| [tmp-delete-test.txt](tmp-delete-test.txt) | Test file | Contents: `test\n`; Name explicitly says "delete" | ✅ Yes | 2 |

---

## 4. Planning Artifacts (Folders)

Documentation and planning folders that are not code but may be candidates for archival.

| Path | Description | Recommendation |
|------|-------------|----------------|
| `cleanup/` | Old Tailwind scan reports (all show 0 findings now) | 🟡 Archive or delete |
| `docs/archive/refactor-2026-02-02/` | Refactor planning snapshot | 🟡 Reference only |
| `docs/archive/uirefactor/` | UI planning snapshot | 🟡 Reference only |

### Analysis Notes

These folders contain planning documents, not executable code. They don't affect bundle size but do add to repository size and may cause confusion:

- **cleanup/**: The scan reports are now empty (system has been cleaned). Safe to remove.
- **docs/archive/refactor-2026-02-02/**: Historical refactor planning snapshot.
- **docs/archive/uirefactor/**: Historical UI specifications snapshot.

---

## 5. Unused Dependencies

### Intentionally Ignored (Mobile Build)

These packages are listed in `knip.json` `ignoreDependencies` for future Capacitor mobile builds:

| Package | Reason to Keep |
|---------|----------------|
| `@capacitor/android` | Future Android build |
| `@capacitor/core` | Capacitor runtime |
| `@capacitor/ios` | Future iOS build |
| `tailwindcss` | Used via PostCSS |
| `tw-animate-css` | Used via CSS imports |

**Recommendation:** Keep all. These are legitimate dependencies for the mobile build pipeline defined in `capacitor.config.ts`.

### Potentially Unused (Needs Verification)

Knip crashed during dependency analysis (reporter bug), but no unused dependencies were flagged before the crash. Manual spot-checks found all major dependencies in use:

- ✅ `boring-avatars` - Used in 6 files for avatar generation
- ✅ `photoswipe` - Used in desktop gallery component
- ✅ `react-markdown` + `remark-gfm` - Used in admin docs
- ✅ `vaul` - Used in drawer component
- ✅ `cmdk` - Used in command palette

---

## 6. Dead Routes

No dead routes found. All page files are either:
- Linked in navigation
- Accessible via dynamic routes
- Intercepting routes (modals)

API routes were also verified - all have documented consumers (client fetches, webhooks, or external integrations).

---

## 7. Commented/Disabled Code

No large blocks of commented code found. Search patterns used:
- `// BEGIN.*REMOVE`
- `// TODO.*remove`
- Multi-line comment blocks (200+ chars)

All returned no concerning matches.

---

## 8. Legacy Patterns

### Deprecated Fields (Still Required)

| Location | Pattern | Status |
|----------|---------|--------|
| `lib/url-utils.ts:10` | `@deprecated storeSlug` | ⚪ Keep - migration in progress |
| `hooks/use-recently-viewed.ts:14` | `@deprecated storeSlug` | ⚪ Keep - backward compat |
| `lib/data/products.ts:38` | `@deprecated promotion_id` | ⚪ Keep - legacy data exists |

These fields are marked deprecated but still referenced in the codebase for backward compatibility with existing data. Do not remove until migration is complete.

### Misleading Names (Not Dead)

| Path | Actual Status |
|------|---------------|
| `app/legacy-vars.css` | **Active** - Contains CSS variables for calc-based values that can't be in Tailwind theme |

---

## 9. Feature Flags

All feature flags in `lib/feature-flags.ts` are at 100% rollout:

| Flag | Status |
|------|--------|
| `drawerSystem` | 100% enabled |
| `drawerProductQuickView` | 100% enabled |
| `drawerCart` | 100% enabled |
| `drawerMessages` | 100% enabled |
| `drawerAccount` | 100% enabled |
| `routeModalProductQuickView` | 100% enabled |

**No dead code from feature flags.**

---

## Recommended Actions

### Phase 2 (Low-Risk Cleanup)

1. **Delete unused files:**
   ```bash
   rm app/[locale]/(main)/_components/post-signup-onboarding-modal.tsx
   rm components/shared/auth/social-input.tsx
   rm tmp-delete-test.txt
   ```

2. **Remove unused exports from `components/shared/field.tsx`:**
   - Remove `FieldLegend` and `FieldSet` from exports object (lines 181-182)
   - Keep internal function definitions if used internally

3. **Remove `CategoryMiniBar` export:**
   - Delete `components/mobile/category-nav/category-mini-bar.tsx`
   - Remove re-export from `components/mobile/category-nav/index.ts`

4. **Archive/delete planning folders:**
   ```bash
   # cleanup/ contains scan outputs + guides (keep if still useful)
   # planning snapshots live in docs/archive/
   ```

### Verification Commands

After cleanup, run:
```bash
pnpm -s typecheck
pnpm -s lint
pnpm -s knip
pnpm -s test:unit
```

---

## Risk Notes

| Item | Risk | Mitigation |
|------|------|------------|
| `post-signup-onboarding-modal.tsx` | Low - modal is not rendered | Verify no dynamic imports |
| `social-input.tsx` | Low - only used by above | Safe after modal removed |
| `CategoryMiniBar` | Low - exported but unused | Check no dynamic imports first |
| Planning folders | None - not code | Git history preserves content |

---

## Appendix: Knip Configuration

Current `knip.json` ignores:
- Test files (`**/*.test.{ts,tsx}`, `**/*.spec.ts`, `e2e/**`, `__tests__/**`)
- Scripts (`scripts/**`)
- Generated types (`lib/supabase/database.types.ts`)
- Cleanup artifacts (`cleanup/**`)

This is appropriate and explains why test files don't appear as "unused."

---

*Report generated 2026-02-02. This is a READ-ONLY audit - no changes were made.*
