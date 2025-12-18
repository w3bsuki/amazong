# 🚀 PRODUCTION CLEANUP MASTER PLAN

> **Created:** December 10, 2025  
> **Goal:** Clean, optimized codebase ready for production deployment  
> **Approach:** Systematic folder-by-folder audit with step-by-step execution

---

## 📋 EXECUTION CHECKLIST

Each section will be marked as:
- ⬜ **Not Started**
- 🔄 **In Progress**
- ✅ **Completed**

---

## 🗂️ PHASE 1: ROOT FOLDER CLEANUP

### Status: ✅ COMPLETED

### Files to DELETE (Temp/Debug Files):
```
✅ DELETED: temp_api_check.json
✅ DELETED: temp_api_response.json
✅ DELETED: temp_cat.json
✅ DELETED: temp_categories.json
✅ DELETED: temp_check.json
✅ DELETED: temp_mega_menu.txt
✅ DELETED: temp_old_subheader.txt
✅ DELETED: temp_pretty.json
✅ DELETED: categories_dump.json
✅ DELETED: categories_response.json
✅ DELETED: mega-menu-original.txt
⚠️ RESTORED: proxy.ts (CRITICAL - Next.js 16 middleware/routing!)
✅ DELETED: next.config.mjs (duplicate, kept .ts version)
✅ DELETED: EBAY_STYLE_GUIDE.html
✅ DELETED: config/mega-menu-config.new.ts (unused)
```

### ⚠️ IMPORTANT LESSON LEARNED:
**DO NOT DELETE `proxy.ts`** - In Next.js 16, this replaces `middleware.ts` and handles:
- i18n locale routing (redirect `/` to `/bg` or `/en`)
- Geo-detection for shipping zones
- Supabase session management

### Bug Fix Applied:
- Fixed `site-header.tsx`: Changed `/auth/sign-in` → `/auth/login` (correct route)

### MD Files - CATEGORIZED DECISION:

#### ✅ KEEP (Valuable Reference Documentation):
```
✅ supabase.md              - Supabase setup, schema info, search indexing (1340 lines!)
✅ STYLING.md               - Typography tokens, eBay-style guide, component standards (753 lines)
✅ CACHING.md               - Next.js 16 caching strategy, cache profiles (704 lines)
✅ CATEGORIES.md            - Full 38 category structure with Bulgarian translations (590 lines)
✅ FRONTEND.md              - Frontend audit, tech stack, production checklist (723 lines)
✅ BUSINESS_MODEL.md        - Business reference (if valuable)
```

#### ❌ DELETE (Completed Audit/Planning - No Longer Needed):
```
❌ AMAZON_MOBILE_AUDIT.md
❌ AUDIT_ACTION_PLAN.md
❌ AUDIT_SUMMARY.md
❌ BULGARIA_LAUNCH_PLAN.md
❌ CATEGORY_AUDIT_REPORT.md
❌ COMPREHENSIVE_AUDIT_REPORT.md
❌ COMPREHENSIVE_UI_AUDIT_PLAN.md
❌ DATABASE_SECURITY_REPORT.md
❌ DESKTOP.md
❌ EBAY_PRODUCT_PAGE_AUDIT.md
❌ EBAY_REDESIGN_PLAN.md
❌ EBAY_STYLE_GUIDE.html
❌ FRONTEND_BACKEND_ALIGNMENT_PLAN.md
❌ FRONTEND_BACKEND_ALIGNMENT_PLAN_V2.md
❌ HOMEPAGE_COLOR_AUDIT.md
❌ IMAGE_UPLOAD_COMPLETE.md
❌ IMAGE_UPLOAD_PLAN.md
❌ IMPROVEMENTS.md
❌ IMPROVEMENTS_FINAL.md
❌ MEGAMENU.md
❌ MOBILE.md
❌ MOBILE_FIX.md
❌ MOBILE_LANDING_PAGE_PLAN.md
❌ MOBILE_UX_AUDIT.md
❌ PLAN_COMPARISON.md
❌ PLAYWRIGHT_AUDIT_PLAN.md
❌ PLAYWRIGHT_AUDIT_REPORT.md
❌ PRODUCTION.md (old)
❌ PRODUCTION1.md
❌ PRODUCTION_AUDIT.md
❌ PRODUCTION_PUSH.md
❌ PRODUCTION_READY.md
❌ PRODUCTION_REFACTOR_PLAN.md
❌ PRODUCT_PAGE_FIX_PLAN.md
❌ QUICK_START_FIXES.md
❌ SELL_FORM_REFACTOR.md
❌ SHADCN_TAILWIND_V4_AUDIT.md
❌ SUPABASE_CATEGORIES_COMPLETE.md
❌ SUPABASE_CATEGORIES_FULL.md
❌ SUPABASE_TASKS.md
❌ supabase-attributes.md
❌ TAILWINDCSS_V4_AUDIT_PLAN.md
❌ TARGET_UI_AUDIT.md
❌ uiuxrefactor-gemini.md
❌ uiuxrefactor.md
```

### Files to KEEP in Root:
```
✅ .env.local (required)
✅ .gitignore (required + UPDATED with tsconfig.tsbuildinfo, .playwright-mcp/)
✅ .mcp.json (if used)
✅ components.json (shadcn config)
✅ next-env.d.ts (auto-generated)
✅ next.config.ts (KEPT - TypeScript, more complete with "deals" cache profile)
✅ package.json (required)
✅ pnpm-lock.yaml (required)
✅ postcss.config.mjs (required)
✅ tsconfig.json (required)
✅ proxy.ts (CRITICAL - Next.js 16 routing/middleware!)
```

### Completed Actions:
```
✅ DELETED: next.config.mjs (duplicate)
✅ UPDATED: .gitignore (added tsconfig.tsbuildinfo, .playwright-mcp/)
✅ DELETED: config/mega-menu-config.new.ts (unused factory refactor)
✅ RESTORED: proxy.ts (accidentally deleted, broke localhost:3000 redirect)
✅ FIXED: site-header.tsx - /auth/sign-in → /auth/login
```

---

## 🗂️ PHASE 2: CONFIG FILES AUDIT

### Status: ✅ COMPLETED

### Config Files:
```
✅ next.config.ts           - KEPT (TypeScript, has all cache profiles including "deals")
✅ DELETED: next.config.mjs - Was duplicate, missing "deals" cache profile
✅ postcss.config.mjs       - KEPT
✅ tsconfig.json            - KEPT
✅ components.json          - KEPT
✅ .mcp.json                - KEPT (MCP config)
✅ DELETED: config/mega-menu-config.new.ts - Unused factory refactor
```

### Completed Tasks:
- [x] DELETED `next.config.mjs` - the `.ts` version is more complete
- [x] Added `tsconfig.tsbuildinfo` to `.gitignore`
- [x] Added `.playwright-mcp/` to `.gitignore`

---

## 🗂️ PHASE 3: FOLDER-BY-FOLDER CLEANUP

### Folder Priority Order:

| Order | Folder | Priority | Status | Dedicated Plan |
|-------|--------|----------|--------|----------------|
| 1 | `.cursor/` | LOW | ⬜ | No |
| 2 | `.next/` | SKIP | ⬜ | No (build output) |
| 3 | `.playwright-mcp/` | HIGH | ⬜ | No |
| 4 | `.vercel/` | SKIP | ⬜ | No (auto-generated) |
| 5 | `.vscode/` | LOW | ⬜ | No |
| 6 | `(account)/` | CHECK | ⬜ | No |
| 7 | `(main)/` | CHECK | ⬜ | No |
| 8 | `app/` | CRITICAL | ⬜ | **YES → APP.md** |
| 9 | `components/` | CRITICAL | ⬜ | **YES → COMPONENTS.md** |
| 10 | `config/` | MEDIUM | ⬜ | No |
| 11 | `docs/` | HIGH | ⬜ | No |
| 12 | `hooks/` | MEDIUM | ⬜ | No |
| 13 | `i18n/` | LOW | ⬜ | No |
| 14 | `lib/` | HIGH | ⬜ | No |
| 15 | `messages/` | LOW | ⬜ | No |
| 16 | `node_modules/` | SKIP | ⬜ | No |
| 17 | `public/` | MEDIUM | ⬜ | No |
| 18 | `scripts/` | HIGH | ⬜ | No |
| 19 | `supabase/` | MEDIUM | ⬜ | No |

---

## 📂 3.1 - `.cursor/`

### Status: ⬜ Not Started

**Contents:**
```
📁 .cursor/
└── mcp.json
```

**Action:** ✅ KEEP - Editor config, no cleanup needed

---

## 📂 3.2 - `.next/`

### Status: ⬜ SKIP

**Action:** Build output folder - automatically regenerated. Add to `.gitignore` if not already.

---

## 📂 3.3 - `.playwright-mcp/`

### Status: ⬜ Not Started

**Contents:**
```
📁 .playwright-mcp/
├── 400+ screenshot files (.png)
└── Various audit/debug screenshots
```

**Issues Found:**
- ❌ ~400 screenshot files from testing/auditing
- ❌ Total size likely 100MB+
- ❌ Not needed for production

**Action:** 
- [ ] DELETE entire folder contents OR
- [ ] Add `/.playwright-mcp/` to `.gitignore`
- [ ] Delete all screenshots before push

---

## 📂 3.4 - `.vercel/`

### Status: ⬜ SKIP

**Contents:**
```
📁 .vercel/
├── project.json
└── README.txt
```

**Action:** Auto-generated by Vercel CLI. Should be in `.gitignore`.

---

## 📂 3.5 - `.vscode/`

### Status: ⬜ Not Started

**Contents:**
```
📁 .vscode/
├── mcp.json
└── settings.json
```

**Action:** ✅ KEEP - Can optionally clean settings.json of debug configs

---

## 📂 3.6 & 3.7 - `(account)/` & `(main)/`

### Status: ⬜ Not Started

**Contents:**
```
📁 (account)/ - EMPTY
📁 (main)/ - EMPTY
```

**Action:** ❌ DELETE both - Empty route group folders at root level

---

## 📂 3.8 - `app/` (CRITICAL - Needs APP.md)

### Status: ⬜ Not Started

**Structure Overview:**
```
📁 app/
├── globals.css
├── globals.css.backup ❌ DELETE
├── actions/
│   ├── checkout.ts
│   └── revalidate.ts
├── api/
│   ├── auth/sign-out/
│   ├── boost/
│   ├── categories/
│   ├── checkout/webhook/
│   ├── geo/
│   ├── payments/
│   ├── products/
│   ├── revalidate/
│   ├── stores/
│   ├── subscriptions/
│   └── upload-image/
├── auth/
│   ├── callback/
│   └── confirm/
└── [locale]/
    ├── (account)/
    ├── (auth)/
    ├── (main)/
    ├── (sell)/
    ├── error.tsx
    ├── layout.tsx
    ├── loading.tsx
    └── not-found.tsx
```

**Issues to Address:**
- [ ] `globals.css.backup` - DELETE
- [ ] Console logs in all files
- [ ] Unused imports
- [ ] Dead code
- [ ] API route optimization

**→ CREATE APP.md for detailed breakdown**

---

## 📂 3.9 - `components/` (CRITICAL - Needs COMPONENTS.md)

### Status: ⬜ Not Started

**Structure Overview:**
```
📁 components/
├── 50+ root component files
├── category-subheader.tsx.backup ❌ DELETE
├── mega-menu.tsx.backup ❌ DELETE
├── header-dropdowns.tsx.backup ❌ DELETE
├── category-subheader/
├── dropdowns/
├── header/ (EMPTY)
├── icons/
├── navigation/
├── sections/
├── sell/
├── skeletons/
└── ui/ (66 files)
```

**Issues to Address:**
- [ ] 3 backup files - DELETE
- [ ] Empty `header/` folder - DELETE
- [ ] Console logs in all files
- [ ] Duplicate components
- [ ] Unused components

**→ CREATE COMPONENTS.md for detailed breakdown**

---

## 📂 3.10 - `config/`

### Status: ⬜ Not Started

**Contents:**
```
📁 config/
├── category-icons.tsx         ✅ KEEP
├── mega-menu-config.ts        ✅ KEEP (actively imported by 5+ components)
├── mega-menu-config.new.ts    ❌ DELETE (NOT IMPORTED ANYWHERE - unused refactor attempt)
└── subcategory-images.ts      ✅ KEEP
```

**VERIFIED:** `mega-menu-config.ts` is imported by:
- `components/navigation/category-subheader.tsx`
- `components/category-subheader/mega-menu-panel.tsx`
- `components/category-subheader/mega-menu-banner.tsx`
- `components/category-subheader/category-subheader.tsx`
- `components/category-subheader.tsx`

**`mega-menu-config.new.ts` has ZERO imports** - it was a factory-based refactor that was never adopted.

**Action:** Delete `mega-menu-config.new.ts`

---

## 📂 3.11 - `docs/`

### Status: ⬜ Not Started

**Contents:**
```
📁 docs/
├── 40+ category documentation files (.md)
├── DOCS_AUDIT_FINAL.md
├── FINAL_BACKEND_PLAN.md
├── IMPLEMENTATION.md
├── old_implementation.md ❌ DELETE
├── guide.md
├── refactor.md
└── _templates/
```

**Issues Found:**
- [ ] `old_implementation.md` - DELETE
- [ ] Review if all category docs are needed
- [ ] Planning docs may not be needed for production

---

## 📂 3.12 - `hooks/`

### Status: ⬜ Not Started

**Contents:**
```
📁 hooks/
├── use-categories-cache.ts
├── use-header-height.ts
├── use-horizontal-scroll.ts
├── use-media-query.ts
├── use-mobile.ts
├── use-product-search.ts
├── use-recently-viewed.ts
└── use-toast.ts
```

**Action:** ✅ KEEP - Review for console logs only

---

## 📂 3.13 - `i18n/`

### Status: ⬜ Not Started

**Contents:**
```
📁 i18n/
├── request.ts
└── routing.ts
```

**Action:** ✅ KEEP - Core i18n functionality

---

## 📂 3.14 - `lib/`

### Status: ⬜ Not Started

**Contents:**
```
📁 lib/
├── cart-context.tsx
├── category-icons.tsx ❌ DUPLICATE with config/?
├── currency.ts
├── geolocation.ts
├── image-utils.ts
├── message-context.tsx
├── sell-form-schema-v3.ts ❌ OLD VERSION?
├── sell-form-schema-v4.ts
├── shipping.ts
├── stripe.ts
├── toast-utils.ts
├── utils.ts
├── wishlist-context.tsx
├── data/
│   ├── categories.ts
│   └── products.ts
├── supabase/
│   ├── client.ts
│   ├── middleware.ts
│   └── server.ts
└── validations/
    └── auth.ts
```

**Issues Found:**
- [ ] `category-icons.tsx` - Duplicate with config/category-icons.tsx?
- [ ] `sell-form-schema-v3.ts` - Old version, likely delete if v4 is used
- [ ] Review for console logs

---

## 📂 3.15 - `messages/`

### Status: ⬜ Not Started

**Contents:**
```
📁 messages/
├── bg.json
└── en.json
```

**Action:** ✅ KEEP - i18n translation files

---

## 📂 3.16 - `node_modules/`

### Status: ⬜ SKIP

**Action:** Package dependencies - never commit, already in `.gitignore`

---

## 📂 3.17 - `public/`

### Status: ⬜ Not Started

**Contents:**
```
📁 public/
├── Various images (.jpg, .png, .svg)
├── Icons
└── Placeholder images
```

**Action:** Review for unused assets, optimize images

---

## 📂 3.18 - `scripts/`

### Status: ⬜ Not Started

**Contents:**
```
📁 scripts/
├── apply-migration.js
├── create-user.js
├── migrations.sql
├── seed-data.ts
├── seed.js
├── seed.ts ❌ DUPLICATE?
├── setup-db.ts
├── test-supabase-connection.ts
└── verify-product.js
```

**Issues Found:**
- [ ] `seed.js` vs `seed.ts` - Duplicates?
- [ ] `test-supabase-connection.ts` - Dev only?
- [ ] `verify-product.js` - Dev only?

---

## 📂 3.19 - `supabase/`

### Status: ⬜ Not Started

**Contents:**
```
📁 supabase/
├── .temp/ (CLI temp files)
├── migrations/ (17 migration files)
├── schema.sql
├── seed.sql
└── seed_categories.sql
```

**Action:** 
- [ ] Review `.temp/` - can be gitignored
- [ ] Consolidate migrations if needed

---

## 🔧 PHASE 4: GLOBAL CODE CLEANUP

### Status: ⬜ Not Started

### 4.1 Console Log Removal
```bash
# Find all console.log statements
grep -r "console.log" --include="*.ts" --include="*.tsx"
grep -r "console.error" --include="*.ts" --include="*.tsx"
grep -r "console.warn" --include="*.ts" --include="*.tsx"
```

### 4.2 Debug Code Removal
- [ ] Remove all `console.log` statements
- [ ] Remove all `debugger` statements
- [ ] Remove commented-out code blocks
- [ ] Remove TODO comments (or document them)

### 4.3 Import Cleanup
- [ ] Remove unused imports
- [ ] Sort imports consistently
- [ ] Remove duplicate imports

### 4.4 Type Safety
- [ ] Fix any `any` types
- [ ] Ensure strict TypeScript

---

## 📊 PHASE 5: FINAL VERIFICATION

### Status: ⬜ Not Started

- [ ] Run `pnpm build` - No errors
- [ ] Run `pnpm lint` - No warnings
- [ ] Test all routes work
- [ ] Verify database connections
- [ ] Check environment variables
- [ ] Test in production mode locally

---

## 📝 EXECUTION ORDER

1. **ROOT CLEANUP** → Delete temp/planning files
2. **EMPTY FOLDERS** → Delete (account)/, (main)/
3. **SCREENSHOT CLEANUP** → Clean .playwright-mcp/
4. **BACKUP FILES** → Delete all .backup files
5. **DUPLICATE FILES** → Consolidate configs
6. **APP FOLDER** → Create APP.md, clean systematically
7. **COMPONENTS** → Create COMPONENTS.md, clean systematically
8. **CONSOLE LOGS** → Global search and remove
9. **FINAL BUILD** → Verify everything works

---

## 🚨 DO NOT DELETE

These files/folders are REQUIRED:
- `.env.local`
- `.gitignore`
- `package.json`
- `pnpm-lock.yaml`
- `tsconfig.json`
- `next.config.ts` (keep the TypeScript version)
- `postcss.config.mjs`
- `components.json`
- **`proxy.ts`** ⚠️ CRITICAL - Next.js 16 routing/middleware!
- `app/` folder (contents)
- `components/` folder (contents)
- `lib/` folder (contents)
- `public/` folder (contents)
- `messages/` folder
- `i18n/` folder
- `hooks/` folder
- `supabase/migrations/`

### KEEP These MD Files (Valuable Documentation):
- `supabase.md` - Supabase setup guide (1340 lines)
- `STYLING.md` - Typography/styling standards (753 lines)
- `CACHING.md` - Next.js 16 caching strategy (704 lines)
- `CATEGORIES.md` - Category structure reference (590 lines)
- `FRONTEND.md` - Frontend audit checklist (723 lines)
- `BUSINESS_MODEL.md` - Business reference

---

## 📈 PROGRESS TRACKER

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Root Folder Cleanup | ✅ DONE |
| 2 | Config Files Audit | ✅ DONE |
| 3.1 | .cursor/ | ⬜ |
| 3.2 | .next/ | SKIP |
| 3.3 | .playwright-mcp/ | ⬜ |
| 3.4 | .vercel/ | SKIP |
| 3.5 | .vscode/ | ⬜ |
| 3.6-3.7 | (account)/ & (main)/ | ✅ DELETED (were empty at root) |
| 3.8 | app/ | ⬜ |
| 3.9 | components/ | ⬜ |
| 3.10 | config/ | ✅ DONE (deleted mega-menu-config.new.ts) |
| 3.11 | docs/ | ⬜ |
| 3.12 | hooks/ | ⬜ |
| 3.13 | i18n/ | ⬜ |
| 3.14 | lib/ | ⬜ |
| 3.15 | messages/ | ⬜ |
| 3.16 | node_modules/ | SKIP |
| 3.17 | public/ | ⬜ |
| 3.18 | scripts/ | ⬜ |
| 3.19 | supabase/ | ⬜ |
| 4 | Global Code Cleanup | ⬜ |
| 5 | Final Verification | ⬜ |

---

## 🐛 BUGS FIXED DURING CLEANUP

| File | Issue | Fix |
|------|-------|-----|
| `site-header.tsx` | Login link pointed to `/auth/sign-in` | Changed to `/auth/login` (correct route) |

---

**Ready to start Phase 1? Just say "GO" and we'll execute step by step.**
