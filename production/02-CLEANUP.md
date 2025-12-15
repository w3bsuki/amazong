# 🧹 PHASE 1: CODE CLEANUP

> **Priority:** 🟡 High - Reduces bundle size and maintenance burden  
> **Estimated Time:** 2-3 hours  
> **Tools Used:** Knip audit, grep search, manual review

---

## 📊 CLEANUP OVERVIEW

Based on Knip audit (`audit-results/knip-report.txt`):

| Category | Count | Impact |
|----------|-------|--------|
| Unused Files | 92 | 🔴 Bundle bloat |
| Unused Dependencies | 21 | 🟡 Install time, security risk |
| Unused Dev Dependencies | 4 | 🟢 Minor |
| Unused Exports | 206 | 🟢 Tree-shaking handles |
| Duplicate Exports | 5 | 🟢 Minor |
| Console Statements | 50+ | 🟡 Information leak |

---

## 🔴 CRITICAL CLEANUP (Do First)

### 1. Delete Demo/Test Routes
```powershell
# Demo sell page with mock form
Remove-Item -Recurse -Force "j:\amazong\app\[locale]\(main)\sell\demo1"

# Component audit page (development only)
Remove-Item -Recurse -Force "j:\amazong\app\[locale]\(main)\component-audit"

# Verify deletion
Test-Path "j:\amazong\app\[locale]\(main)\sell\demo1"         # False
Test-Path "j:\amazong\app\[locale]\(main)\component-audit"    # False
```

- [ ] Delete `app/[locale]/(main)/sell/demo1`
- [ ] Delete `app/[locale]/(main)/component-audit`
- [ ] Verify build passes after deletion

### 2. Delete Duplicate Schema Files
```powershell
# Old schema version (v4 is current)
Remove-Item -Force "j:\amazong\lib\sell-form-schema-v3.ts"

# Verify v4 is used everywhere
Select-String -Path "components/**/*.tsx","app/**/*.tsx" -Pattern "sell-form-schema-v3" -Recurse
# Should return nothing
```

- [ ] Delete `lib/sell-form-schema-v3.ts`
- [ ] Confirm all imports use v4

---

## 🟡 UNUSED FILES (Safe to Delete)

### Tier 1: Obviously Unused (Delete Now)
```powershell
# Scripts folder - development utilities only
Remove-Item -Force "j:\amazong\scripts\verify-product.js"
Remove-Item -Force "j:\amazong\scripts\seed.js"
Remove-Item -Force "j:\amazong\scripts\create-user.js"
Remove-Item -Force "j:\amazong\scripts\apply-migration.js"
Remove-Item -Force "j:\amazong\scripts\seed-data.ts"
Remove-Item -Force "j:\amazong\scripts\seed.ts"
Remove-Item -Force "j:\amazong\scripts\setup-db.ts"
Remove-Item -Force "j:\amazong\scripts\test-supabase-connection.ts"
```

- [ ] Delete 8 unused script files
- [ ] Keep `scripts/migrations.sql` (if needed for reference)

### Tier 2: Unused Components (Review Before Delete)
```
components/analytics.tsx                # Vercel analytics not implemented
components/app-sidebar.tsx              # Not used in current layout
components/attribute-filters.tsx        # Feature not implemented
components/breadcrumb.tsx               # Using app-breadcrumb instead
components/category-sidebar.tsx         # Not in use
components/category-subheader.tsx       # Replaced
components/data-table.tsx               # TanStack table not used
components/error-boundary.tsx           # Using global error handling
components/header-dropdowns.tsx         # Not in current header
components/image-upload.tsx             # Using photos-section instead
components/language-switcher.tsx        # Not in use
components/main-nav.tsx                 # Not in use
components/mega-menu.tsx                # Replaced with new implementation
components/mobile-search-bar.tsx        # Not in use
components/product-form-enhanced.tsx    # Not in use
components/product-form.tsx             # Using sell-form instead
components/product-variant-selector.tsx # Not implemented
components/promo-banner-strip.tsx       # Not in use
components/seller-card.tsx              # Not in use
components/sticky-add-to-cart.tsx       # Not in use
components/sticky-checkout-button.tsx   # Not in use
components/tabbed-product-section.tsx   # Not in use
components/theme-provider.tsx           # Using next-themes directly
components/upgrade-banner.tsx           # Not in use
```

**Batch Delete Command:**
```powershell
$unusedComponents = @(
    "analytics.tsx",
    "app-sidebar.tsx",
    "attribute-filters.tsx",
    "breadcrumb.tsx",
    "category-sidebar.tsx",
    "category-subheader.tsx",
    "data-table.tsx",
    "error-boundary.tsx",
    "header-dropdowns.tsx",
    "image-upload.tsx",
    "language-switcher.tsx",
    "main-nav.tsx",
    "mega-menu.tsx",
    "mobile-search-bar.tsx",
    "product-form-enhanced.tsx",
    "product-form.tsx",
    "product-variant-selector.tsx",
    "promo-banner-strip.tsx",
    "seller-card.tsx",
    "sticky-add-to-cart.tsx",
    "sticky-checkout-button.tsx",
    "tabbed-product-section.tsx",
    "theme-provider.tsx",
    "upgrade-banner.tsx"
)

foreach ($file in $unusedComponents) {
    $path = "j:\amazong\components\$file"
    if (Test-Path $path) {
        Remove-Item -Force $path
        Write-Host "Deleted: $file"
    }
}
```

- [ ] Review each component before deleting
- [ ] Run `pnpm build` after each batch deletion
- [ ] Delete 24 unused components

### Tier 3: Unused UI Components (From shadcn)
```
components/ui/button-group.tsx
components/ui/calendar.tsx
components/ui/carousel.tsx
components/ui/chat-container.tsx
components/ui/code-block.tsx
components/ui/collapsible.tsx
components/ui/context-menu.tsx
components/ui/empty.tsx
components/ui/field.tsx
components/ui/input-group.tsx
components/ui/input-otp.tsx
components/ui/item.tsx
components/ui/kbd.tsx
components/ui/markdown.tsx
components/ui/menubar.tsx
components/ui/message.tsx
components/ui/prompt-input.tsx
components/ui/resizable.tsx
components/ui/scroll-button.tsx
components/ui/searchable-filter-list.tsx
components/ui/spinner.tsx
components/ui/toaster.tsx
components/ui/use-mobile.tsx
```

**Decision:** Keep shadcn/ui components for now. They're small and may be needed later.

- [ ] KEEP unused shadcn components (low priority cleanup)

### Tier 4: Unused Hooks & Lib Files
```powershell
# Hooks to delete
Remove-Item -Force "j:\amazong\hooks\use-business-account.ts"
Remove-Item -Force "j:\amazong\hooks\use-header-height.ts"

# Lib files to delete
Remove-Item -Force "j:\amazong\lib\category-icons.tsx"  # Replaced by config/
Remove-Item -Force "j:\amazong\lib\currency.ts"
Remove-Item -Force "j:\amazong\lib\toast-utils.ts"
```

- [ ] Delete 2 unused hooks
- [ ] Delete 3 unused lib files

---

## 📦 UNUSED DEPENDENCIES

### Remove from package.json
```json
// REMOVE these dependencies:
{
  "@dnd-kit/core": "^6.3.1",           // Drag-drop not implemented
  "@dnd-kit/modifiers": "^9.0.0",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "@radix-ui/react-collapsible": "...", // Not used
  "@radix-ui/react-context-menu": "...",
  "@radix-ui/react-menubar": "...",
  "@tanstack/react-table": "...",       // data-table.tsx deleted
  "@vercel/analytics": "...",           // analytics.tsx deleted
  "embla-carousel": "...",              // Not used
  "embla-carousel-autoplay": "...",
  "embla-carousel-react": "...",
  "input-otp": "...",                   // OTP not implemented
  "marked": "...",                      // Using react-markdown
  "react-day-picker": "...",            // Calendar not used
  "react-markdown": "...",              // Review: may be used
  "react-resizable-panels": "...",      // Not used
  "remark-breaks": "...",
  "remark-gfm": "...",
  "shiki": "...",                       // Code highlighting not used
  "use-stick-to-bottom": "..."          // Chat feature not using
}
```

```powershell
# Remove unused dependencies
pnpm remove @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities
pnpm remove @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-menubar
pnpm remove @tanstack/react-table @vercel/analytics
pnpm remove embla-carousel embla-carousel-autoplay embla-carousel-react
pnpm remove input-otp marked react-day-picker react-resizable-panels
pnpm remove remark-breaks remark-gfm shiki use-stick-to-bottom

# Verify build
pnpm build
```

- [ ] Remove 21 unused dependencies
- [ ] Run `pnpm install` to update lockfile
- [ ] Verify build passes

### Unused Dev Dependencies (Optional)
```powershell
# These are safe to keep but not strictly needed
pnpm remove cross-env dotenv
# KEEP: shadcn (for future component additions)
# KEEP: supabase (for migrations)
```

- [ ] Consider removing `cross-env` and `dotenv`

---

## 🔍 CONSOLE.LOG CLEANUP

### Find All Console Statements
```powershell
# Find all console.log/warn/error in production code
Select-String -Path "components/**/*.tsx","app/**/*.tsx","lib/**/*.ts" `
  -Pattern "console\.(log|warn|error)" -Recurse | 
  Select-Object Path, LineNumber, Line | 
  Format-Table -AutoSize
```

### Rules for Console Statements
| Type | Production Action |
|------|-------------------|
| `console.log` | ❌ REMOVE - Information leak |
| `console.error` (user-facing) | ⚠️ KEEP - But add error boundary |
| `console.error` (API routes) | ✅ KEEP - Server-side logging OK |
| `console.warn` | ⚠️ REVIEW - Usually remove |

### Critical Files to Clean
```typescript
// These have the most console statements:
app/api/categories/route.ts              // 5 console.log - REMOVE
app/api/checkout/webhook/route.ts        // 6 console.log - KEEP (server logging)
app/api/subscriptions/webhook/route.ts   // 4 console.log - KEEP (server logging)
app/[locale]/(sell)/sell/page.tsx        // 1 console.log - REMOVE
components/sell/steps/step-photos.tsx    // 1 console.log - REMOVE
components/sell/sections/photos-section.tsx // 1 console.log - REMOVE
```

- [ ] Remove console.log from components
- [ ] Review and keep server-side logging
- [ ] Consider adding proper logging library post-launch

---

## 📁 DUPLICATE CODE/FILES

### 1. Reviews Section (3 versions)
```
components/reviews-section.tsx          # Original
components/reviews-section-server.tsx   # Server component version
components/reviews-section-client.tsx   # Client component version
```
**Decision:** Keep server + client, remove original if not imported

- [ ] Check which reviews-section is actually used
- [ ] Delete unused versions

### 2. Category Subheader (2 locations)
```
components/category-subheader.tsx                           # Root
components/category-subheader/                              # Folder with multiple files
```
**Decision:** Keep the folder version, delete root file

- [ ] Delete `components/category-subheader.tsx`

### 3. Sell Form Schemas
```
lib/sell-form-schema-v3.ts              # OLD
lib/sell-form-schema-v4.ts              # CURRENT
components/sell/schemas.ts               # Different schema?
components/sell/schemas/                 # Folder with multiple
```
**Decision:** Consolidate to v4 only

- [ ] Verify v4 is used everywhere
- [ ] Delete v3 and unused schemas folder

---

## ✅ CLEANUP CHECKLIST SUMMARY

### Critical (Blockers)
- [ ] Delete demo routes (demo1, component-audit)
- [ ] Delete old schema (v3)
- [ ] Run `pnpm build` to verify

### High Priority
- [ ] Delete 24 unused components
- [ ] Remove 21 unused dependencies
- [ ] Clean console.log from components

### Medium Priority
- [ ] Delete 8 unused scripts
- [ ] Delete unused hooks and lib files
- [ ] Remove duplicate code

### Low Priority (Post-Launch)
- [ ] Clean up unused exports
- [ ] Remove unused shadcn components
- [ ] Add proper logging library

---

## 🏁 PHASE 1 COMPLETION CRITERIA

```powershell
# Run these checks before proceeding to Phase 2

# 1. Build passes
pnpm build # SUCCESS

# 2. Demo routes deleted
Test-Path "app/[locale]/(main)/sell/demo1" # False
Test-Path "app/[locale]/(main)/component-audit" # False

# 3. Old schema deleted
Test-Path "lib/sell-form-schema-v3.ts" # False

# 4. Dependencies reduced (check package.json size)
(Get-Content package.json | ConvertFrom-Json).dependencies.PSObject.Properties.Count
# Should be ~50-55 (down from ~70)

# 5. No console.log in components (excluding error handling)
Select-String -Path "components/**/*.tsx" -Pattern "console\.log" -Recurse
# Should return 0 or only intentional server logging
```

---

*Tools Used: Knip, grep, PowerShell*
