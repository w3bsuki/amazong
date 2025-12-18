# 💀 BRUTAL CODEBASE AUDIT: Amazong Marketplace (REVISED)

> **Audited by**: Senior Dev AI  
> **Date**: December 17, 2025  
> **Revision**: v2 - After re-evaluation with nuance  
> **Verdict**: This codebase has **real issues** but also has **solid infrastructure in place**  
> **Estimated Cleanup Time**: 1-2 weeks of focused work

---

## 🔥 EXECUTIVE SUMMARY: The Revised Roast

Your project has **457+ TypeScript/TSX files**. Upon closer inspection:

- **~40-50 files are truly dead** (not 92 - Knip over-reported)
- **Many "unused" dependencies are shadcn/ui requirements** (calendar, carousel, resizable, input-otp)
- **React Contexts are NEEDED** - cart, wishlist, messages are core features
- **Some components are strategic reserves** for planned features

**The codebase has real problems, but I was too aggressive. Let me give you the REAL list.**

---

## 🎯 TL;DR - What To Actually Do

### DELETE (Confirmed Dead):
- ~50 unused component/lib files (~5000 lines)
- 8 unused npm packages
- Old scripts and demo folders
- Archived planning docs

### KEEP (I Was Wrong):
- ✅ All shadcn/ui components (calendar, carousel, input-otp, etc.)
- ✅ All React contexts (cart, wishlist, messages)
- ✅ react-markdown + remark plugins (used in common/markdown.tsx)
- ✅ @tanstack/react-table (for DataTable)
- ✅ data-table.tsx, image-upload.tsx, product-form components

### INTEGRATE (Instead of Delete):
- 📅 Calendar → Date pickers for orders/scheduling
- 🎠 Carousel → Product image galleries
- 🔢 Input-OTP → 2FA and phone verification
- 📊 DataTable → Business dashboard tables
- 📐 Resizable → Admin panel layouts

---

## 📊 THE REVISED DAMAGE REPORT

| Metric | Value | Verdict |
|--------|-------|---------|
| Total Component Files | 199 | 🟡 HIGH but acceptable for marketplace |
| App Route Files | 258 | ✅ Normal for i18n + features |
| **Actually** Unused Files | ~40-50 | 🔴 DELETE THESE |
| **Actually** Unused Dependencies | ~8 | 🟡 Some can stay |
| Unused Exports | 206 | 🟡 Many are intentional API surface |
| Circular Dependencies | 1 | 🔴 Fix immediately |
| ESLint Disable Comments | 21 | 🟡 Some are justified |
| `as any` Type Casts | 6 | 🔴 Type safety holes |
| TODO/FIXME Comments | 50+ | 📝 Deferred debt |
| Duplicate Code (jscpd) | ~17% in lib/data | 🔴 DRY violation |
| Archived Planning Docs | 36 files | 📚 Analysis paralysis |

---

## ✅ WHAT'S ACTUALLY GOOD (I Was Wrong About)

### 1. React Contexts ARE Used & Needed

```
components/providers/
├── cart-provider.tsx      ✅ USED - 15+ imports across app
├── wishlist-provider.tsx  ✅ USED - 8+ imports across app  
├── message-provider.tsx   ✅ USED - 4+ imports for chat
```

These are **core infrastructure**. Don't touch them.

### 2. Shadcn/UI Dependencies ARE Required

These packages are **shadcn/ui component dependencies**:

| Package | Used By | Verdict |
|---------|---------|---------|
| `react-day-picker` | `ui/calendar.tsx` | ✅ KEEP |
| `embla-carousel-react` | `ui/carousel.tsx` | ✅ KEEP |
| `react-resizable-panels` | `ui/resizable.tsx` | ✅ KEEP |
| `input-otp` | `ui/input-otp.tsx` | ✅ KEEP (2FA future) |
| `cmdk` | `ui/command.tsx` | ✅ KEEP (search) |
| `@radix-ui/react-collapsible` | `ui/collapsible.tsx` | ✅ KEEP |
| `@radix-ui/react-context-menu` | `ui/context-menu.tsx` | ✅ KEEP |

### 3. Strategic Reserve Components (Keep but Mark)

| Component | Why Keep |
|-----------|----------|
| `ui/calendar.tsx` | Date pickers for orders, scheduling |
| `ui/carousel.tsx` | Product image galleries |
| `ui/input-otp.tsx` | 2FA, phone verification |
| `ui/resizable.tsx` | Admin panels, chat layouts |
| `data-table.tsx` | Business dashboard tables |

### 4. React-Markdown IS Used

```tsx
// components/common/markdown.tsx - ACTIVELY USED
import ReactMarkdown from "react-markdown"
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"
```

This powers product descriptions and chat formatting. **KEEP**.

### 5. @tanstack/react-table - Strategic for Business Dashboard

Even if not used TODAY, it's the **standard for shadcn data tables**. If you plan to build admin dashboards, product management, or order tables - KEEP IT.

---

## 💀 ACTUAL CRITICAL ISSUES (Revised List)

### 1. TRULY DEAD FILES (~40-50, Not 92)

After re-analysis, these are **actually dead** (never imported anywhere):

**Definitely Delete:**
```
components/analytics.tsx              # Dead - no imports
components/app-sidebar.tsx            # Dead - no imports
components/breadcrumb.tsx             # Dead - duplicate of app-breadcrumb.tsx
components/attribute-filters.tsx      # Dead - no imports
components/category-subheader.tsx     # Dead - no imports (877 lines!)
components/header-dropdowns.tsx       # Dead - no imports (900 lines!)
components/main-nav.tsx               # Dead - no imports
components/mega-menu.tsx              # Dead - no imports
components/mobile-search-bar.tsx      # Dead - replaced by mobile-search-overlay
components/nav-documents.tsx          # Dead - no imports
components/promo-banner-strip.tsx     # Dead - no imports
components/rating-scroll-link.tsx     # Dead - no imports
components/section-cards.tsx          # Dead - no imports
components/sign-out-button.tsx        # Dead - no imports
components/tabbed-product-section.tsx # Dead - no imports
components/theme-provider.tsx         # Dead - using next-themes directly

hooks/use-business-account.ts         # Dead - no imports
hooks/use-header-height.ts            # Dead - no imports

lib/category-icons.tsx                # Dead - duplicate of config/category-icons.tsx
lib/currency.ts                       # Dead - no imports
lib/sell-form-schema-v3.ts            # Dead - v4 is current
lib/toast-utils.ts                    # Dead - no imports

lib/data/badges.ts                    # Dead - duplicate of lib/badges.ts
lib/data/profile-data.ts              # Dead - 698 lines, no imports!

scripts/apply-migration.js            # Dead - old script
scripts/create-user.js                # Dead - old script
scripts/seed-data.ts                  # Dead - old script
scripts/seed.js                       # Dead - old script
scripts/seed.ts                       # Dead - old script
scripts/setup-db.ts                   # Dead - old script
scripts/test-supabase-connection.ts   # Dead - old script
scripts/verify-product.js             # Dead - old script

app/actions/notifications.ts          # Dead - no imports
app/actions/revalidate.ts             # Dead - no imports

components/badges/badge-progress.tsx  # Dead folder
components/badges/index.ts            
components/badges/seller-badge.tsx    
components/badges/trust-score.tsx     

components/category-subheader/        # Dead folder - entire directory
components/icons/index.ts             # Dead
components/navigation/                # Dead folder - entire directory

components/ui/button-group.tsx        # Dead - no imports
components/ui/chat-container.tsx      # Dead - no imports
components/ui/code-block.tsx          # Dead - replaced by common/code-block
components/ui/empty.tsx               # Dead - no imports
components/ui/field.tsx               # Dead - no imports
components/ui/input-group.tsx         # Dead - no imports
components/ui/item.tsx                # Dead - no imports
components/ui/kbd.tsx                 # Dead - no imports
components/ui/markdown.tsx            # Dead - replaced by common/markdown
components/ui/message.tsx             # Dead - no imports
components/ui/prompt-input.tsx        # Dead - no imports
components/ui/scroll-button.tsx       # Dead - no imports
components/ui/searchable-filter-list.tsx # Dead - no imports
components/ui/spinner.tsx             # Dead - no imports
components/ui/toaster.tsx             # Dead - no imports
components/ui/use-mobile.tsx          # DUPLICATE of hooks/use-mobile.ts

components/sell/schemas/              # Dead folder
app/[locale]/(main)/sell/demo1/       # Dead demo folder
```

**Keep (I was wrong):**
```
components/data-table.tsx             # KEEP - for business dashboard
components/error-boundary.tsx         # KEEP - good to have
components/image-upload.tsx           # KEEP - for sell flow
components/language-switcher.tsx      # KEEP - i18n feature
components/product-form.tsx           # KEEP - for sell flow
components/product-form-enhanced.tsx  # KEEP - for sell flow  
components/seller-card.tsx            # REVIEW - may be needed
components/sticky-add-to-cart.tsx     # KEEP - UX feature
components/sticky-checkout-button.tsx # KEEP - UX feature
components/upgrade-banner.tsx         # KEEP - monetization
ui/calendar.tsx                       # KEEP - shadcn
ui/carousel.tsx                       # KEEP - shadcn
ui/collapsible.tsx                    # KEEP - shadcn
ui/context-menu.tsx                   # KEEP - shadcn
ui/input-otp.tsx                      # KEEP - shadcn (2FA)
ui/menubar.tsx                        # KEEP - shadcn
ui/resizable.tsx                      # KEEP - shadcn
```

---

### 2. REVISED DEPENDENCY ANALYSIS

**Actually Remove (8 packages):**
```json
"@dnd-kit/core": "^6.3.1",           // Not used YET - remove for now, add when needed
"@dnd-kit/modifiers": "^9.0.0",      // Not used YET
"@dnd-kit/sortable": "^10.0.0",      // Not used YET
"@dnd-kit/utilities": "^3.2.2",      // Not used YET
"@vercel/analytics": ...,            // Not implemented - remove until needed
"embla-carousel": "8.6.0",           // Peer dep only - keep embla-carousel-react
"shiki": ...,                        // Not used - remove
"use-stick-to-bottom": ...,          // Not used - remove
```

**KEEP - Shadcn/UI Requirements:**
```json
"@radix-ui/react-collapsible": ...,  // ✅ ui/collapsible.tsx
"@radix-ui/react-context-menu": ..., // ✅ ui/context-menu.tsx  
"@radix-ui/react-menubar": ...,      // ✅ ui/menubar.tsx
"embla-carousel-react": ...,         // ✅ ui/carousel.tsx
"embla-carousel-autoplay": ...,      // ✅ carousel autoplay feature
"input-otp": ...,                    // ✅ ui/input-otp.tsx (2FA ready)
"react-day-picker": ...,             // ✅ ui/calendar.tsx
"react-resizable-panels": ...,       // ✅ ui/resizable.tsx
```

**KEEP - Actually Used:**
```json
"marked": ...,                       // ✅ Used in common/markdown.tsx
"react-markdown": ...,               // ✅ Used in common/markdown.tsx
"remark-breaks": ...,                // ✅ Used in common/markdown.tsx
"remark-gfm": ...,                   // ✅ Used in common/markdown.tsx
```

**KEEP - Strategic (Business Dashboard):**
```json
"@tanstack/react-table": ...,        // ✅ Keep for DataTable component
```

**DevDependencies - Actually Remove:**
```json
"cross-env": ...,                    // Not used in scripts
"dotenv": ...,                       // Not used (Next.js handles env)
"shadcn": ...,                       // CLI tool, not needed in deps (use npx)
"supabase": ...,                     // CLI tool, not needed in deps (use npx)
```

---

### 3. COMPONENT ORGANIZATION (Valid Criticism)

Your `components/` folder does have organization issues:

**Already Colocated (Good):**
```
app/[locale]/(account)/account/_components/  ✅ Account-specific components
app/[locale]/(business)/dashboard/_components/  ✅ Business-specific components
app/[locale]/(sell)/_components/  ✅ Sell-specific components
```

**Shared Components (OK in components/):**
```
components/
├── add-to-cart.tsx           ✅ Shared - used everywhere
├── wishlist-button.tsx       ✅ Shared - used everywhere
├── mobile-menu-sheet.tsx     ✅ Shared - layout component
├── mobile-tab-bar.tsx        ✅ Shared - layout component
├── product-card/             ✅ Shared - used in many pages
└── providers/                ✅ Shared - app-wide contexts
```

**Needs Cleanup (Prefix Soup):**
```
components/
├── desktop-filter-modal.tsx  # 482 lines - move to search route?
├── desktop-filters.tsx       # Move to search route?
├── desktop-search.tsx        # 380 lines - could split
├── mobile-filters.tsx        # 370 lines - could merge with desktop?
├── mobile-search-overlay.tsx # 426 lines - could split
```

**The real problem isn't prefix naming - it's that some files are too big and could be colocated better.**

---

### 4. BLOATED COMPONENTS (Still Valid)

**Components over 400 lines are code smells. Revised verdict:**

| File | Lines | Verdict |
|------|-------|---------|
| `header-dropdowns.tsx` | 900 | 💀 **DELETE** - Dead file |
| `category-subheader.tsx` | 877 | 💀 **DELETE** - Dead file |
| `data-table.tsx` | 788 | ✅ **KEEP** - Use for business dashboard |
| `category-circles.tsx` | 751 | 🔴 **SPLIT** - Active, but too big |
| `product-form-enhanced.tsx` | 689 | ✅ **KEEP** - Sell flow needs it |
| `chat-interface.tsx` | 687 | 🔴 **SPLIT** - Active, too big |
| `sidebar.tsx` (ui) | 672 | ✅ **KEEP** - Shadcn default |
| `product-page-content-new.tsx` | 652 | 🔴 **SPLIT** - Active, too big |
| `sidebar-menu.tsx` | 581 | 🔴 **SPLIT** - Active, too big |
| `message-provider.tsx` | 539 | 🟡 **REVIEW** - Context is complex but functional |
| `plan-card.tsx` | 492 | 🟡 **REVIEW** - May be OK for complexity |
| `desktop-filter-modal.tsx` | 482 | 🔴 **SPLIT** - Active, too big |
| `product-card.tsx` | 455 | 🟡 **CLEAN** - Remove deprecated props |

**Action Plan for Large Files:**
1. Delete dead ones immediately (saves 1,800+ lines)
2. Split active ones over time into smaller sub-components
3. Clean up deprecated props/eslint-disables in product-card

---

### 5. THE PRODUCT-CARD SAGA

You have **FOUR** different product card implementations:

```
components/common/product-card/product-card.tsx       # 455 lines, CURRENT
components/common/product-card/product-card-featured.tsx  # 356 lines, CURRENT
components/common/product-card/product-card-skeleton.tsx  # CURRENT
components/cards/index.ts                             # Re-export (deprecated notice)
```

The "current" product-card.tsx has **15 eslint-disable comments** for unused variables and **11 @deprecated props**:

```tsx
/** @deprecated Use originalPrice - kept for backward compatibility */
listPrice?: number | null
/** @deprecated Not used - kept for backward compatibility */
tags?: string[]
/** @deprecated Not used - kept for backward compatibility */
isPrime?: boolean
/** @deprecated Not used - kept for backward compatibility */
make?: string | null
/** @deprecated Not used - kept for backward compatibility */
model?: string | null
/** @deprecated Not used - kept for backward compatibility */
year?: string | number | null
/** @deprecated Not used - kept for backward compatibility */
color?: string | null
/** @deprecated Not used - kept for backward compatibility */
size?: string | null
/** @deprecated Not used - kept for backward compatibility */
sellerId?: string | null
/** @deprecated Use username - kept for backward compatibility */
storeSlug?: string | null
```

**This is not backward compatibility. This is fear of breaking things.**

---

### 6. THE UI FOLDER ABUSE

`components/ui/` should ONLY contain shadcn/ui primitives. Yours contains:

```
components/ui/
├── accordion.tsx          ✅ shadcn
├── button.tsx             ✅ shadcn
├── ...
├── button-group.tsx       ❌ NOT shadcn - move to common/
├── chat-container.tsx     ❌ NOT shadcn - DEAD FILE
├── code-block.tsx         ❌ NOT shadcn - DEAD FILE
├── empty.tsx              ❌ NOT shadcn - DEAD FILE
├── field.tsx              ❌ NOT shadcn - DEAD FILE
├── input-group.tsx        ❌ NOT shadcn - move to common/
├── item.tsx               ❌ NOT shadcn - DEAD FILE
├── kbd.tsx                ❌ NOT shadcn - DEAD FILE
├── markdown.tsx           ❌ NOT shadcn - DEAD FILE
├── message.tsx            ❌ NOT shadcn - DEAD FILE
├── page-container.tsx     ❌ NOT shadcn - move to layout/
├── prompt-input.tsx       ❌ NOT shadcn - move to common/
├── scroll-button.tsx      ❌ NOT shadcn - DEAD FILE
├── searchable-filter-list.tsx ❌ NOT shadcn - DEAD FILE
├── spinner.tsx            ❌ NOT shadcn - DEAD FILE
├── toaster.tsx            ❌ NOT shadcn - DEAD FILE
├── use-mobile.tsx         ❌ HOOK IN UI?! - move to hooks/
├── use-toast.ts           ❌ HOOK IN UI?! - DUPLICATE of hooks/use-toast.ts
```

---

### 7. DUPLICATE CODE (jscpd Report)

Your worst duplicate offenders:

| File | Duplicate % | Verdict |
|------|-------------|---------|
| `lib/data/badges.ts` | 33% tokens | 🔴 REFACTOR |
| `lib/data/store.ts` | 24% tokens | 🔴 REFACTOR |
| `lib/data/profile-data.ts` | 17% tokens | 🔴 REFACTOR |

---

### 8. THE MARKDOWN GRAVEYARD

You have **36 planning/audit documents** in `docs/archive/`:

```
docs/archive/
├── ACCOUNT.md
├── ACCOUNT_PAGE_AUDIT.md
├── ACCOUNT_UX_UI_IMPROVEMENT_PLAN.md
├── APP.md
├── BUSINESS_DASHBOARD_PRD.md
├── BUSINESS_MODEL.md
├── CACHING.md
├── CATEGORIES.md
├── CODEBASE_AUDIT_PLAN.md
├── COMPONENTS.md
├── COMPREHENSIVE_MOBILE_DESKTOP_AUDIT_PLAN.md
├── DESKTOP_AUDIT.md
├── DESKTOP_MOBILE_UI_AUDIT_DEC16.md
├── DESKTOP_UI_UX_AUDIT.md
├── FRONTEND.md
├── fullaudit.md
├── GEO_WELCOME_MODAL_PLAN.md
├── guide1.md
├── MASTER_REFACTOR.md
├── MOBILE_AUDIT.md
├── MOBILE_PRODUCT_PAGE_FIXES.md
├── MOBILE_UI_UX_AUDIT.md
├── PRODUCTION_AUDIT_FINAL.md
├── PRODUCTION_CLEANUP.md
├── PRODUCTION_FIX_SUMMARY.md
├── PRODUCTION_PUSH.md
├── PRODUCTION_PUSH_PLAN.md
├── PRODUCTION_PUSH_PLAN_DEC16.md
├── PRODUCT_CARD_FINAL_REFACTOR.md
├── PRODUCT_CARD_REFACTOR_PLAN.md
├── PRODUCT_PAGE_REFACTOR.md
├── PURCHASE_NOTIFICATION_SYSTEM.md
├── SERVER_CLIENT_CACHING_AUDIT.md
├── STYLING.md
├── supabase1.md
├── VERIFICATION_BADGE_SYSTEM.md
```

Plus another 10 in `production/`:
```
production/
├── 01-SECURITY.md
├── 02-CLEANUP.md
├── 03-REFACTOR.md
├── 04-PERFORMANCE.md
├── 05-TESTING.md
├── 06-DEPLOYMENT.md
├── 07-POST-LAUNCH.md
├── FINAL-TASKS.md
├── QUICK-REFERENCE.md
├── TECH-STACK.md
```

**You've spent more time planning cleanups than actually cleaning.**

---

### 9. VERSION SUFFIX HELL

Files with version suffixes indicate abandoned iterations:

```
lib/sell-form-schema-v3.ts          # DEAD - v4 is current
lib/sell-form-schema-v4.ts          # Current
```

Where are v1 and v2? Probably deleted. Why wasn't v3 deleted too?

---

### 10. CIRCULAR DEPENDENCY

```
app/[locale]/(account)/account/sales/page.tsx 
  → app/[locale]/(account)/account/sales/sales-table.tsx
  → (back to page.tsx)
```

This will cause weird runtime bugs.

---

### 11. TYPE SAFETY HOLES

Found `as any` casts:

```typescript
// lib/supabase/client.ts:35
} as any

// app/[locale]/(main)/demo/landing1/page.tsx:524-526
make={(product as any).make}
model={(product as any).model}
year={(product as any).year}

// app/api/products/search/route.ts:46
const productImages = (p as any).product_images as
```

These are ticking time bombs.

---

### 12. HOOKS LOCATION CHAOS

Hooks are scattered in 3 places:

```
hooks/use-badges.ts          # Correct location
hooks/use-toast.ts           # Correct location
hooks/...

components/ui/use-mobile.tsx # WRONG - duplicate!
components/ui/use-toast.ts   # WRONG - duplicate!
```

---

## ✅ THE FIX PLAN

### Phase 0: Backup & Branch (30 min)

```bash
git checkout -b cleanup/brutal-audit-$(date +%Y%m%d)
git push -u origin cleanup/brutal-audit-$(date +%Y%m%d)
```

---

### Phase 1: Delete ACTUALLY Dead Files (Day 1) ⏱️ 2 hours

**1.1 Delete confirmed dead files (verified no imports)**

```powershell
# === DEFINITELY DEAD COMPONENTS ===
Remove-Item -Force "j:\amazong\components\analytics.tsx"
Remove-Item -Force "j:\amazong\components\app-sidebar.tsx"
Remove-Item -Force "j:\amazong\components\attribute-filters.tsx"
Remove-Item -Force "j:\amazong\components\breadcrumb.tsx"
Remove-Item -Force "j:\amazong\components\category-subheader.tsx"    # 877 lines dead!
Remove-Item -Force "j:\amazong\components\header-dropdowns.tsx"       # 900 lines dead!
Remove-Item -Force "j:\amazong\components\main-nav.tsx"
Remove-Item -Force "j:\amazong\components\mega-menu.tsx"
Remove-Item -Force "j:\amazong\components\mobile-search-bar.tsx"
Remove-Item -Force "j:\amazong\components\nav-documents.tsx"
Remove-Item -Force "j:\amazong\components\promo-banner-strip.tsx"
Remove-Item -Force "j:\amazong\components\rating-scroll-link.tsx"
Remove-Item -Force "j:\amazong\components\section-cards.tsx"
Remove-Item -Force "j:\amazong\components\sign-out-button.tsx"
Remove-Item -Force "j:\amazong\components\tabbed-product-section.tsx"
Remove-Item -Force "j:\amazong\components\theme-provider.tsx"

# === DEAD HOOKS ===
Remove-Item -Force "j:\amazong\hooks\use-business-account.ts"
Remove-Item -Force "j:\amazong\hooks\use-header-height.ts"

# === DEAD LIB FILES ===
Remove-Item -Force "j:\amazong\lib\category-icons.tsx"       # Duplicate of config/
Remove-Item -Force "j:\amazong\lib\currency.ts"
Remove-Item -Force "j:\amazong\lib\sell-form-schema-v3.ts"   # Old version
Remove-Item -Force "j:\amazong\lib\toast-utils.ts"
Remove-Item -Force "j:\amazong\lib\data\badges.ts"           # 652 lines dead!
Remove-Item -Force "j:\amazong\lib\data\profile-data.ts"     # 698 lines dead!

# === DEAD SCRIPTS ===
Remove-Item -Force "j:\amazong\scripts\apply-migration.js"
Remove-Item -Force "j:\amazong\scripts\create-user.js"
Remove-Item -Force "j:\amazong\scripts\seed-data.ts"
Remove-Item -Force "j:\amazong\scripts\seed.js"
Remove-Item -Force "j:\amazong\scripts\seed.ts"
Remove-Item -Force "j:\amazong\scripts\setup-db.ts"
Remove-Item -Force "j:\amazong\scripts\test-supabase-connection.ts"
Remove-Item -Force "j:\amazong\scripts\verify-product.js"

# === DEAD ACTIONS ===
Remove-Item -Force "j:\amazong\app\actions\notifications.ts"
Remove-Item -Force "j:\amazong\app\actions\revalidate.ts"

# === DEAD FOLDERS ===
Remove-Item -Recurse -Force "j:\amazong\components\badges"
Remove-Item -Recurse -Force "j:\amazong\components\category-subheader"
Remove-Item -Recurse -Force "j:\amazong\components\navigation"
Remove-Item -Force "j:\amazong\components\icons\index.ts"
Remove-Item -Recurse -Force "j:\amazong\components\sell\schemas"
Remove-Item -Recurse -Force "j:\amazong\app\[locale]\(main)\sell\demo1"

# === DEAD UI COMPONENTS (non-shadcn) ===
Remove-Item -Force "j:\amazong\components\ui\button-group.tsx"
Remove-Item -Force "j:\amazong\components\ui\chat-container.tsx"
Remove-Item -Force "j:\amazong\components\ui\code-block.tsx"       # Replaced by common/
Remove-Item -Force "j:\amazong\components\ui\empty.tsx"
Remove-Item -Force "j:\amazong\components\ui\field.tsx"
Remove-Item -Force "j:\amazong\components\ui\input-group.tsx"
Remove-Item -Force "j:\amazong\components\ui\item.tsx"
Remove-Item -Force "j:\amazong\components\ui\kbd.tsx"
Remove-Item -Force "j:\amazong\components\ui\markdown.tsx"         # Replaced by common/
Remove-Item -Force "j:\amazong\components\ui\message.tsx"
Remove-Item -Force "j:\amazong\components\ui\prompt-input.tsx"
Remove-Item -Force "j:\amazong\components\ui\scroll-button.tsx"
Remove-Item -Force "j:\amazong\components\ui\searchable-filter-list.tsx"
Remove-Item -Force "j:\amazong\components\ui\spinner.tsx"
Remove-Item -Force "j:\amazong\components\ui\toaster.tsx"
Remove-Item -Force "j:\amazong\components\ui\use-mobile.tsx"       # Duplicate of hooks/

# === DEAD BUSINESS COMPONENTS ===
Remove-Item -Force "j:\amazong\components\business\business-date-range-picker.tsx"
Remove-Item -Force "j:\amazong\components\business\business-page-header.tsx"
```

**1.2 DO NOT DELETE (Keep for features):**

```powershell
# These look unused but are needed:
# components/data-table.tsx           - Business dashboard
# components/error-boundary.tsx       - Error handling
# components/image-upload.tsx         - Sell flow
# components/language-switcher.tsx    - i18n
# components/product-form.tsx         - Sell flow
# components/product-form-enhanced.tsx - Sell flow
# components/seller-card.tsx          - Seller profiles
# components/sticky-add-to-cart.tsx   - Product UX
# components/sticky-checkout-button.tsx - Checkout UX
# components/upgrade-banner.tsx       - Monetization
# components/category-sidebar.tsx     - Category navigation

# These are shadcn/ui - KEEP:
# ui/calendar.tsx, ui/carousel.tsx, ui/collapsible.tsx
# ui/context-menu.tsx, ui/input-otp.tsx, ui/menubar.tsx
# ui/resizable.tsx
```

**1.3 Verify build still works**

```powershell
pnpm build
```

---

### Phase 2: Remove Actually Unused Dependencies (Day 1) ⏱️ 30 min

```powershell
# Only remove what's ACTUALLY unused:
pnpm remove @dnd-kit/core @dnd-kit/modifiers @dnd-kit/sortable @dnd-kit/utilities
pnpm remove @vercel/analytics
pnpm remove embla-carousel  # Keep embla-carousel-react, remove peer-only
pnpm remove shiki
pnpm remove use-stick-to-bottom

# Dev dependencies - CLI tools (use npx instead)
pnpm remove -D cross-env dotenv shadcn supabase
```

**DO NOT REMOVE (I was wrong):**
```
# These are shadcn/ui dependencies:
# @radix-ui/react-collapsible - ui/collapsible.tsx
# @radix-ui/react-context-menu - ui/context-menu.tsx
# @radix-ui/react-menubar - ui/menubar.tsx
# @tanstack/react-table - DataTable component
# embla-carousel-react - ui/carousel.tsx
# embla-carousel-autoplay - carousel feature
# input-otp - ui/input-otp.tsx (ready for 2FA)
# marked - common/markdown.tsx
# react-day-picker - ui/calendar.tsx
# react-markdown - common/markdown.tsx
# react-resizable-panels - ui/resizable.tsx
# remark-breaks - common/markdown.tsx
# remark-gfm - common/markdown.tsx
```

---

### Phase 3: Fix Circular Dependency (Day 1) ⏱️ 30 min

```
app/[locale]/(account)/account/sales/page.tsx
  ↔ app/[locale]/(account)/account/sales/sales-table.tsx
```

**Fix**: Extract shared types/interfaces to a separate file that both can import.

---

### Phase 4: Clean Product Card (Day 2) ⏱️ 4 hours

**4.1 Remove all deprecated props from ProductCardProps**

Remove these from `components/common/product-card/product-card.tsx`:
- `listPrice` (use `originalPrice`)
- `tags` (unused)
- `isPrime` (unused)
- `make` (unused)
- `model` (unused)
- `year` (unused)
- `color` (unused)
- `size` (unused)
- `sellerId` (unused)
- `storeSlug` (use `username`)

**4.2 Remove all eslint-disable comments and fix the underlying issues**

**4.3 Delete re-export wrapper**

```powershell
Remove-Item -Recurse -Force "j:\amazong\components\cards"
```

Update any imports from `@/components/cards` to `@/components/common/product-card`

---

### Phase 5: Consolidate Hooks (Day 2) ⏱️ 1 hour

**5.1 Delete duplicate hook in ui/**

`components/ui/use-toast.ts` is a duplicate of `hooks/use-toast.ts`. Delete the ui one and update imports.

```powershell
# Already deleted in Phase 1, just update imports:
# Change: import { useToast } from "@/components/ui/use-toast"
# To:     import { useToast } from "@/hooks/use-toast"
```

---

### Phase 6: Fix Type Safety (Day 2) ⏱️ 2 hours

**6.1 Replace all `as any` casts with proper types**

- `lib/supabase/client.ts:35` - Fix cookie options type
- `app/[locale]/(main)/demo/landing1/page.tsx` - Define proper product type
- `app/api/products/search/route.ts` - Define ProductImage type

---

### Phase 7: Colocate Route Components (Day 3-4) ⏱️ 8 hours

This is the big one. Move components to be colocated with their routes.

**7.1 Account components → app/(account)/_components/**

```powershell
# These are already in place based on file structure, but verify:
# app/[locale]/(account)/account/_components/
```

**7.2 Business components**

Move `components/business/*` to `app/[locale]/(business)/_components/`

**7.3 Sell components**

Move `components/sell/*` to `app/[locale]/(sell)/_components/`

---

### Phase 8: Split Bloated Components (Day 5-6) ⏱️ 8 hours

Target: Every component under 300 lines

| Component | Current | Target |
|-----------|---------|--------|
| `category-circles.tsx` (751) | 1 file | 3-4 files |
| `chat-interface.tsx` (687) | 1 file | 4-5 files |
| `product-page-content-new.tsx` (652) | 1 file | 4-5 files |
| `sidebar-menu.tsx` (581) | 1 file | 2-3 files |
| `message-provider.tsx` (539) | 1 file | 2-3 files |
| `plan-card.tsx` (492) | 1 file | 2-3 files |
| `desktop-filter-modal.tsx` (482) | 1 file | 3-4 files |
| `product-card.tsx` (455) | 1 file | 2-3 files |

---

### Phase 9: Refactor Duplicate Code (Day 7) ⏱️ 4 hours

Focus on files with highest duplicate percentages:

- `lib/badges.ts` (678 lines, 33% duplicate) → Extract shared patterns
- `lib/data/store.ts` (431 lines, 24% duplicate) → DRY up queries
- `lib/data/profile-data.ts` (698 lines, 17% duplicate) → DRY up queries

---

### Phase 10: Archive Planning Docs (Day 7) ⏱️ 1 hour

```powershell
# Delete ALL docs in archive - they're outdated
Remove-Item -Recurse -Force "j:\amazong\docs\archive"

# Keep production docs but consolidate into ONE file
# Or delete them too if they're stale
```

---

### Phase 11: Clean Unused Exports (Day 8) ⏱️ 4 hours

The 206 unused exports from Knip need cleanup:

1. Remove unused function exports
2. Remove unused type exports
3. Remove unused constants

---

### Phase 12: Final Validation (Day 8) ⏱️ 2 hours

```powershell
# Type check
pnpm tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build

# Run Knip again
pnpm dlx knip

# Check bundle size
pnpm analyze
```

---

## 📋 CHECKLIST

### Phase 1: Delete Dead Files
- [ ] Delete 92 unused files
- [ ] Verify build passes

### Phase 2: Remove Dependencies  
- [ ] Remove 21 unused packages
- [ ] Verify build passes

### Phase 3: Fix Circular Dependency
- [ ] Break sales page ↔ sales-table cycle

### Phase 4: Clean Product Card
- [ ] Remove 11 deprecated props
- [ ] Remove 15 eslint-disable comments
- [ ] Delete cards/ re-export

### Phase 5: Consolidate Hooks
- [ ] Remove ui/use-toast.ts duplicate
- [ ] Remove ui/use-mobile.tsx duplicate
- [ ] Update all imports

### Phase 6: Fix Type Safety
- [ ] Remove all `as any` casts
- [ ] Add proper types

### Phase 7: Colocate Components
- [ ] Move business/* to route
- [ ] Move sell/* to route
- [ ] Update all imports

### Phase 8: Split Bloated Components
- [ ] category-circles.tsx → split
- [ ] chat-interface.tsx → split
- [ ] product-page-content-new.tsx → split
- [ ] sidebar-menu.tsx → split
- [ ] message-provider.tsx → split
- [ ] plan-card.tsx → split
- [ ] desktop-filter-modal.tsx → split
- [ ] product-card.tsx → split

### Phase 9: Refactor Duplicates
- [ ] lib/badges.ts → DRY
- [ ] lib/data/store.ts → DRY
- [ ] lib/data/profile-data.ts → DRY

### Phase 10: Archive Docs
- [ ] Delete or consolidate docs/archive
- [ ] Consolidate production/ docs

### Phase 11: Clean Exports
- [ ] Remove 206 unused exports
- [ ] Remove 57 unused types

### Phase 12: Final Validation
- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Build passes
- [ ] Knip is clean
- [ ] Bundle size acceptable

---

## 🎯 REVISED SUCCESS METRICS

After cleanup, you should have:

| Metric | Before | After | Notes |
|--------|--------|-------|-------|
| Dead files deleted | ~50 | 0 | Conservative cleanup |
| Unused deps | 8 | 0 | Keep shadcn deps |
| Unused exports | 206 | ~50 | Some are intentional API |
| Component files | 199 | ~160 | Keep useful ones |
| Circular deps | 1 | 0 | Fix immediately |
| ESLint disables | 21 | ~10 | Some are justified |
| `as any` casts | 6 | 0 | Fix all |
| Max component lines | 900 | 400 | Gradual refactor |
| Planning docs | 46 | ~10 | Archive old ones |

---

## 📦 INTEGRATION OPPORTUNITIES

Instead of deleting everything, consider USING these packages:

### 1. @tanstack/react-table → DataTable Component
```tsx
// Use data-table.tsx for:
// - Business dashboard product list
// - Order management table
// - Admin panels
```

### 2. @dnd-kit → Image Reordering (Add Later)
```tsx
// Future: Drag-drop for sell flow image ordering
// Don't add now, but keep it in mind for v2
```

### 3. Input-OTP → 2FA & Phone Verification
```tsx
// Ready for:
// - Two-factor authentication
// - Phone number verification
// - Secure checkout OTP
```

### 4. Calendar + Date Picker → Order Scheduling
```tsx
// Use for:
// - Delivery date selection
// - Promotion scheduling
// - Business analytics date range
```

### 5. Carousel → Product Image Gallery
```tsx
// Use for:
// - Product page image carousel
// - Homepage hero banners
// - Related products slider
```

### 6. Resizable Panels → Admin Layouts
```tsx
// Use for:
// - Chat interface (sidebar + messages)
// - Admin dashboard panels
// - Email-client style layouts
```

---

## 💡 PREVENTION: How To Not End Up Here Again

1. **Delete unused code within 2 weeks** - Set a deadline
2. **Component size limit: 400 lines** - Beyond that, split
3. **Colocate when possible** - `_components/` in routes
4. **Run `pnpm dlx knip` monthly** - Catch cruft early
5. **No version suffixes** - Use git branches instead
6. **One active planning doc** - Archive completed ones
7. **If not used in 3 months, delete it**

---

## 🏁 REVISED CONCLUSION

This codebase has:
- ✅ **Solid infrastructure** (contexts, providers, shadcn setup)
- ✅ **Good route organization** (app router with groups)
- ✅ **Strategic dependencies** (ready for features)
- 🔴 **~50 actually dead files** (delete these)
- 🔴 **Analysis paralysis** (too many planning docs)
- 🔴 **Some bloated components** (split over time)
- 🔴 **Duplicate code patterns** (DRY up lib/data)

**The fix is surgical, not scorched earth.** Delete what's dead, keep what's strategic, and integrate the unused packages into actual features.

---

## 🚀 QUICK WIN: Immediate Actions (1 Day)

1. **Delete ~50 confirmed dead files** (saves ~5000 lines)
2. **Remove 8 unused dependencies** (smaller bundle)
3. **Fix circular dependency** (sales page)
4. **Delete docs/archive/** (or move to wiki)

**That's 80% of the cleanup value in 20% of the effort.**

---

*This revised audit balances honesty with practicality. 🎯*
