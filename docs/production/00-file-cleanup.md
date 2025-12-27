# Phase 0: Production File Cleanup

> **Priority:** 🔴 Critical (Before Launch)  
> **Estimated Time:** 2-3 hours  
> **Goal:** Remove bloat, duplicates, unused files, console logs, and noise before production  
> **Best Practice:** Next.js `removeConsole` compiler option, clean git history

---

## 📋 Pre-Cleanup Checklist

```powershell
# 1. Commit current work
git add . ; git commit -m "Pre-cleanup snapshot"

# 2. Create backup tag
git tag backup-pre-cleanup

# 3. Run existing clean script first
pnpm clean:artifacts
```

---

## 🗑️ Section 1: Root-Level Output Files (DELETE)

These are temporary outputs - regenerate fresh when needed:

```powershell
# Test/lint/typecheck outputs (9 files)
Remove-Item -Force e2e-smoke-output.txt, e2e-smoke-output-2.txt, e2e-smoke-output-3.txt
Remove-Item -Force lint-output.txt, typecheck-output.txt, unit-test-output.txt
Remove-Item -Force tsc-files.txt, knip-output.json
```

---

## 🗑️ Section 2: Timestamped Playwright Reports (DELETE)

```powershell
# Delete timestamped report folders (keep main playwright-report/)
Remove-Item -Recurse -Force playwright-report-*
```

---

## 🗑️ Section 3: Cleanup Folder (DELETE ENTIRELY)

The `cleanup/` folder contains **14+ timestamped audit folders** and obsolete plans.  
All useful content has been consolidated into `production/` plans.

```powershell
# DELETE entire cleanup folder - superseded by production/
Remove-Item -Recurse -Force cleanup/

# Files being deleted:
# - 14x mobile-audit-YYYYMMDD-HHMMSS/ folders with JSON reports
# - desktop-product-page-*.md (3 files)
# - mobile-product-page-*.md (3 files)  
# - onboarding-refactor-plan.md
# - mobile-design-tokens.md
# - jscpd-report.json, knip-*.json, palette-scan-report.txt, tsc-last.log
```

---

## 🗑️ Section 4: Root Markdown Files (DELETE)

These plans are superseded by `production/` plans:

```powershell
# OLD plans - superseded by production/MASTER_PLAN.md
Remove-Item -Force PRODUCTION_CLEANUP_PLAN.md
Remove-Item -Force PRODUCTION_CHECKLIST.md
Remove-Item -Force PRODUCT_PAGE_MASTERPLAN.md
Remove-Item -Force MOBILE_PRODUCT_PAGE_MASTERPLAN.md
Remove-Item -Force FULL_TESTING_PLAN.md
```

---

## 🔧 Section 5: Duplicate Config Files (DELETE ONE)

You have **two vitest configs** - only one is needed:

| File | Purpose | Keep? |
|------|---------|-------|
| `vitest.config.ts` | Dynamic imports, works in CJS/ESM | ✅ **KEEP** |
| `vitest.config.mts` | Static imports, ESM only | ❌ DELETE |

The `.ts` version handles ESM/CJS edge cases better.

**Important:** `vitest.config.mts` has `server.deps.inline` config for next-intl that `.ts` doesn't have.

**Action:** Merge the `server.deps.inline` config into `.ts`, then delete `.mts`:

```typescript
// Add to vitest.config.ts test object:
server: {
  deps: {
    inline: ['next-intl']
  }
}
```

```powershell
# After merging server.deps config into vitest.config.ts:
Remove-Item -Force vitest.config.mts
```

---

## 🧹 Section 6: Console Logs Cleanup (CODE CHANGES)

### 6.1 Production console.log Removal (Next.js Compiler)

Add to `next.config.ts` for automatic production console removal:

```typescript
// In next.config.ts - add to nextConfig object:
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'], // Keep errors and warnings
  } : false,
},
```

### 6.2 Manual Review Required (13 Locations)

These console statements need manual review - some may be intentional:

| File | Line | Type | Action |
|------|------|------|--------|
| `lib/url-utils.ts` | 48 | `console.warn` | ⚠️ Keep - runtime warning |
| `lib/supabase/middleware.ts` | 53 | `console.warn` | ⚠️ Keep - config warning |
| `lib/supabase/client.ts` | 33 | `console.warn` | ⚠️ Keep - env warning |
| `i18n/routing.ts` | 37 | `console.warn` | ⚠️ Keep - i18n fallback |
| `i18n/request.ts` | 109 | `console.warn` | ⚠️ Keep - missing translation |
| `components/providers/message-context.tsx` | 199 | `console.warn` | ⚠️ Keep - RPC fallback |
| `components/providers/auth-state-listener.tsx` | 33 | `console.warn` | ⚠️ Keep - refresh error |
| `app/[locale]/(sell)/sell/_lib/categories.ts` | 119 | `console.log` | ❌ **DELETE** |
| `app/[locale]/(checkout)/_actions/checkout.ts` | 135 | `console.warn` | ⚠️ Keep - parse error |
| `app/[locale]/(business)/dashboard/_lib/categories.ts` | 108 | `console.log` | ❌ **DELETE** |
| `app/api/subscriptions/webhook/route.ts` | 85, 156 | `console.log` | ❌ **DELETE** or convert to proper logging |

**E2E Test Console Logs (KEEP)** - These are for test debugging:
- `e2e/smoke.spec.ts` - DOM timing
- `e2e/global-setup.ts` - Warmup logs
- `e2e/auth.spec.ts`, `e2e/accessibility.spec.ts` - Test diagnostics

---

## 📝 Section 7: TODO Comments Cleanup

Review and resolve these 13 TODO comments before production:

| File | Line | TODO |
|------|------|------|
| `components/shared/product/product-buy-box.tsx` | 144 | Implement add to cart |
| `lib/auth/business.ts` | 743, 779, 780 | Reviews table, shipping/payment setup |
| `app/[locale]/(sell)/_components/fields/pricing-field.tsx` | 231 | Price suggestions |
| `app/[locale]/(chat)/_components/conversation-list.tsx` | 188 | Check own message |
| `app/[locale]/(business)/_components/order-detail-view.tsx` | 155 | Status update action |
| `app/[locale]/(business)/_components/orders-table.tsx` | 272 | Bulk status update |
| `app/[locale]/(account)/account/orders/[id]/_components/order-detail-content.tsx` | 174, 193 | Return request, shipping |
| `app/api/checkout/webhook/route.ts` | 183 | Email service integration |

**Action:** For each TODO:
1. Implement the feature, OR
2. Create GitHub issue and link it, OR  
3. Remove if no longer relevant

---

## 🖼️ Section 8: Public Images Audit

### Current `public/` images (33 files):

**KEEP - Active product/category images:**
- `categories/*.webp` (5 files) - Category images
- `placeholder-*.{jpg,svg,png}` - UI placeholders
- `icon*.{svg,png}` - App icons
- `apple-icon.png` - iOS icon

**REVIEW - Potentially unused demo images:**

```powershell
# Search for image usage in codebase
Get-ChildItem -Path "J:\amazong" -Recurse -Include "*.tsx","*.ts" | Select-String -Pattern "abstract-beauty|colorful-toy|cozy-cabin|diverse-fashion|fitness-watch|modern-smartphone|office-chair|retro-living|smart-speaker|vintage-camera|electronics-components|gaming-setup|modern-computer|modern-minimalist|portable-speaker" | Select-Object Path, LineNumber, Line
```

**Note:** Many images have duplicate formats (jpg + png). Keep only one format - Next.js Image optimization will convert to WebP/AVIF automatically.

| Image | Files | Action |
|-------|-------|--------|
| `abstract-beauty` | jpg + png | Delete one |
| `colorful-toy-collection` | jpg + png | Delete one |
| `cozy-cabin-interior` | jpg + png | Delete one |
| `diverse-fashion-collection` | jpg + png | Delete one |
| `diverse-people-listening-headphones` | jpg + png | Delete one |
| `modern-smartphone` | jpg + png | Delete one |
| `retro-living-room-tv` | jpg + png | Delete one |
| `vintage-camera-still-life` | jpg + png | Delete one |

---

## 📜 Section 9: Scripts Audit

### Current scripts (8 files):

| Script | Purpose | Keep? |
|--------|---------|-------|
| `clean-artifacts.mjs` | Cleans build artifacts | ✅ Keep |
| `run-playwright.mjs` | Runs Playwright tests | ✅ Keep |
| `validate-agent-skills.mjs` | Agent validation | ✅ Keep |
| `scan-tailwind-palette.mjs` | Palette scanning | ⚠️ Review - one-time use? |
| `mobile-audit.mjs` | Mobile audit | ❌ Delete - audits complete |
| `probe-runtime.mjs` | Runtime probing | ⚠️ Review - dev only? |
| `cleanup-phase1.ps1` | Cleanup script | ❌ Delete - old phase script |
| `migrations.sql` | SQL migrations | 🔄 Move to `supabase/migrations/` |

```powershell
# Delete obsolete scripts
Remove-Item -Force scripts/mobile-audit.mjs
Remove-Item -Force scripts/cleanup-phase1.ps1

# Move SQL to proper location
Move-Item scripts/migrations.sql supabase/migrations/
```

---

## 📦 Section 10: Unused Dependencies Check

Run Knip to find unused dependencies:

```powershell
# knip is already a devDependency in this repo
pnpm -s exec knip --reporter=compact
```

Review output and remove any unused:
- devDependencies that are never used
- Dependencies with no imports

---

## 🔒 Section 11: Update .gitignore

Add to `.gitignore` to prevent future bloat:

```gitignore
# Test/lint outputs (regenerate fresh)
e2e-smoke-output*.txt
lint-output.txt
typecheck-output.txt
unit-test-output.txt
tsc-files.txt
knip-output.json

# Timestamped reports
playwright-report-*/
test-results-*/

# Webpack cache files
*.old

# Cleanup folder (archived)
cleanup/
```

---

## ✅ Phase 0 Completion Checklist

### Files to Delete (23+ items):
- [ ] `e2e-smoke-output.txt`, `e2e-smoke-output-2.txt`, `e2e-smoke-output-3.txt`
- [ ] `lint-output.txt`, `typecheck-output.txt`, `unit-test-output.txt`
- [ ] `tsc-files.txt`, `knip-output.json`
- [ ] `playwright-report-*` folders
- [ ] `cleanup/` entire folder (14 audit folders + 10 files)
- [ ] `PRODUCTION_CLEANUP_PLAN.md`, `PRODUCTION_CHECKLIST.md`
- [ ] `PRODUCT_PAGE_MASTERPLAN.md`, `MOBILE_PRODUCT_PAGE_MASTERPLAN.md`
- [ ] `FULL_TESTING_PLAN.md`
- [ ] `vitest.config.mts` (after merging into `.ts`)
- [ ] `scripts/mobile-audit.mjs`, `scripts/cleanup-phase1.ps1`

### Code Changes:
- [ ] Add `removeConsole` to `next.config.ts` compiler options
- [ ] Delete `console.log` in `sell/_lib/categories.ts:119`
- [ ] Delete `console.log` in `dashboard/_lib/categories.ts:108`
- [ ] Convert webhook `console.log` to proper logging or delete
- [ ] Review/resolve 13 TODO comments
- [ ] Merge vitest configs: add `server.deps.inline` to `.ts`

### Config Updates:
- [ ] Update `.gitignore` with new patterns
- [ ] Move `scripts/migrations.sql` to `supabase/migrations/`

### Verification:
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test:unit` passes
- [ ] `pnpm build` succeeds
- [ ] `pnpm test:e2e` passes

### Commit:
```powershell
git add .
git commit -m "Phase 0: Production file cleanup - removed 23+ bloat files, console logs, duplicates"
```

---

## 📊 Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Root files | ~25 | ~15 |
| cleanup/ folder | 24 items | 0 (deleted) |
| Console.log in prod code | 5 | 0 |
| Duplicate configs | 2 | 1 |
| Obsolete plans | 5 | 0 |

---

## 🏁 Next Step

→ Proceed to [Phase 1: Next.js Best Practices](./01-nextjs.md)
