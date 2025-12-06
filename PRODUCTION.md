# 🧹 PRODUCTION CLEANUP AUDIT - FULL REPORT

This is the **comprehensive, exhaustive audit** of the entire codebase. Every file, folder, and line of code that needs cleanup is listed below.

---

## 📋 EXECUTIVE SUMMARY

| Category | Count | Status |
|----------|-------|--------|
| Root MD Files to Delete/Move | 46 | 🔴 Critical |
| Temp/Dump Files to Delete | 6 | 🔴 Critical |
| Unused npm Dependencies | 5 | 🟠 High |
| Unused Shadcn UI Components | 16 | 🟠 High |
| Unused Custom Components | 5 | 🟠 High |
| Duplicate Hooks (to delete) | 2 | 🟠 High |
| Duplicate Config Files | 1 | 🟠 High |
| JS Scripts → TS Conversion | 4 | 🟡 Medium |
| `console.log` Statements | 29 | 🟡 Medium |
| `: any` Type Usage | 27 | 🟡 Medium |
| Duplicate Images (png+jpg) | 11 | 🟡 Medium |
| TODO Comments | 1 | 🟢 Low |

---

## 🗑️ SECTION 1: FILES TO DELETE

### 1.1 Root-Level Markdown Files (46 files → Move to `docs/archive/`)
These clutter the root directory. Move all to `docs/archive/` or delete if obsolete:

```
AMAZON_MOBILE_AUDIT.md
AUDIT_ACTION_PLAN.md
AUDIT_SUMMARY.md
BULGARIA_LAUNCH_PLAN.md
BUSINESS_MODEL.md
CACHING.md
CATEGORIES.md
CATEGORY_AUDIT_REPORT.md
COMPREHENSIVE_AUDIT_REPORT.md
COMPREHENSIVE_UI_AUDIT_PLAN.md
DATABASE_SECURITY_REPORT.md
DESKTOP.md
EBAY_PRODUCT_PAGE_AUDIT.md
EBAY_REDESIGN_PLAN.md
FRONTEND.md
FRONTEND_BACKEND_ALIGNMENT_PLAN.md
FRONTEND_BACKEND_ALIGNMENT_PLAN_V2.md
HOMEPAGE_COLOR_AUDIT.md
IMAGE_UPLOAD_COMPLETE.md
IMAGE_UPLOAD_PLAN.md
IMPROVEMENTS.md
IMPROVEMENTS_FINAL.md
MEGAMENU.md
MOBILE.md
MOBILE_FIX.md
MOBILE_LANDING_PAGE_PLAN.md
MOBILE_UX_AUDIT.md
PLAN_COMPARISON.md
PLAYWRIGHT_AUDIT_PLAN.md
PLAYWRIGHT_AUDIT_REPORT.md
PRODUCTION.md (this file → keep or rename)
PRODUCTION1.md
PRODUCTION_PUSH.md
PRODUCTION_READY.md
PRODUCTION_REFACTOR_PLAN.md
PRODUCT_PAGE_FIX_PLAN.md
QUICK_START_FIXES.md
SHADCN_TAILWIND_V4_AUDIT.md
STYLING.md
SUPABASE_CATEGORIES_FULL.md
SUPABASE_TASKS.md
TAILWINDCSS_V4_AUDIT_PLAN.md
TARGET_UI_AUDIT.md
supabase.md
uiuxrefactor-gemini.md
uiuxrefactor.md
```

### 1.2 Temp/Dump Files (DELETE IMMEDIATELY)
```
temp_categories.json          ← DELETE
temp_mega_menu.txt            ← DELETE
mega-menu-original.txt        ← DELETE
categories_dump.json          ← DELETE
categories_response.json      ← DELETE
EBAY_STYLE_GUIDE.html         ← DELETE (orphan HTML file)
```

### 1.3 Duplicate Config Files
| File | Action |
|------|--------|
| `next.config.mjs` | DELETE (use `next.config.ts` only) |

### 1.4 Misplaced Root Files
| File | Action |
|------|--------|
| `proxy.ts` | MOVE to `lib/proxy.ts` |

---

## 📦 SECTION 2: UNUSED npm DEPENDENCIES

### 2.1 Dependencies to REMOVE from `package.json`
These packages are installed but **never imported** in the codebase:

| Package | Size | Action |
|---------|------|--------|
| `recharts` | ~1MB | REMOVE - not used anywhere |
| `vaul` | drawer lib | REMOVE - using `@radix-ui/react-dialog` instead |
| `cmdk` | command palette | REMOVE - not used anywhere |
| `input-otp` | OTP input | REMOVE - not used anywhere |
| `react-resizable-panels` | ~50KB | REMOVE - not used anywhere |

**Note:** `marked` AND `react-markdown` are BOTH used in `components/ui/markdown.tsx`. Consider consolidating to one.

### 2.2 Radix UI Dependencies to REMOVE
These Radix primitives are installed but the corresponding Shadcn component is never used:

| Radix Package | Shadcn Component | Action |
|---------------|------------------|--------|
| `@radix-ui/react-aspect-ratio` | `aspect-ratio.tsx` | REMOVE |
| `@radix-ui/react-collapsible` | `collapsible.tsx` | REMOVE |
| `@radix-ui/react-context-menu` | `context-menu.tsx` | REMOVE |
| `@radix-ui/react-menubar` | `menubar.tsx` | REMOVE |
| `@radix-ui/react-navigation-menu` | `navigation-menu.tsx` | REMOVE |
| `@radix-ui/react-slider` | `slider.tsx` | REMOVE |
| `@radix-ui/react-toggle` | `toggle.tsx` | REMOVE |
| `@radix-ui/react-toggle-group` | `toggle-group.tsx` | REMOVE |

---

## 🧩 SECTION 3: UNUSED COMPONENTS

### 3.1 Shadcn UI Components to DELETE (`components/ui/`)
These were installed via `shadcn add` but are **never imported**:

| File | Lines | Action |
|------|-------|--------|
| `components/ui/alert.tsx` | ~50 | DELETE |
| `components/ui/aspect-ratio.tsx` | ~10 | DELETE |
| `components/ui/calendar.tsx` | ~200 | DELETE |
| `components/ui/carousel.tsx` | ~150 | DELETE |
| `components/ui/chart.tsx` | ~300 | DELETE |
| `components/ui/collapsible.tsx` | ~20 | DELETE |
| `components/ui/context-menu.tsx` | ~250 | DELETE |
| `components/ui/input-otp.tsx` | ~80 | DELETE |
| `components/ui/menubar.tsx` | ~250 | DELETE |
| `components/ui/navigation-menu.tsx` | ~200 | DELETE |
| `components/ui/resizable.tsx` | ~60 | DELETE |
| `components/ui/sidebar.tsx` | ~650 | DELETE |
| `components/ui/slider.tsx` | ~50 | DELETE |
| `components/ui/table.tsx` | ~100 | DELETE |
| `components/ui/toggle.tsx` | ~50 | DELETE |
| `components/ui/toggle-group.tsx` | ~60 | DELETE |

### 3.2 Custom Components to DELETE (`components/`)
| File | Reason | Action |
|------|--------|--------|
| `components/breadcrumb.tsx` | DUPLICATE of `app-breadcrumb.tsx` | DELETE |
| `components/product-form-enhanced.tsx` | Never imported | DELETE |
| `components/product-row.tsx` | Never imported (file is empty or unused) | DELETE |
| `components/main-nav.tsx` | Never imported | DELETE |
| `components/analytics.tsx` | Never imported (dead code) | DELETE |

### 3.3 Duplicate Hooks to DELETE
| Hook | Location | Keep | Delete |
|------|----------|------|--------|
| `useIsMobile` | `hooks/use-mobile.ts` ← KEEP | `components/ui/use-mobile.tsx` ← DELETE |
| `useToast` | `hooks/use-toast.ts` ← KEEP | `components/ui/use-toast.ts` ← DELETE |

**After deleting duplicates, update imports:**
- Change all `from "@/components/ui/use-mobile"` → `from "@/hooks/use-mobile"`
- Change all `from "@/components/ui/use-toast"` → `from "@/hooks/use-toast"`

---

## 🛠️ SECTION 4: TECH DEBT - CODE QUALITY FIXES

### 4.1 `console.log` Statements to REMOVE (29 total)

#### `app/[locale]/(main)/sell/page.tsx` (10 statements)
```
Line 720: console.log("[ListingForm] handleSubmit called...")
Line 723: console.log("[ListingForm] Submission blocked...")
Line 1574: console.log("[SellPage] Fetching seller and categories...")
Line 1578: console.log("[SellPage] Checking seller status...")
Line 1595: console.log("[SellPage] Seller data:", sellerData)
Line 1604: console.log("[SellPage] Fetching categories...")
Line 1608: console.log("[SellPage] Categories:", categoriesData...)
Line 1614: console.log("[SellPage] Setting loading to false")
Line 1622: console.log("[SellPage] Auth state changed...")
Line 1646: console.log("[SellPage] Fallback: no auth state...")
```

#### `app/[locale]/(account)/account/orders/page.tsx` (3 statements)
```
Line 28: console.log('Orders page - User ID:', user.id)
Line 36: console.log('Simple orders query:', ...)
Line 51: console.log('Orders page - Orders found:', ...)
```

#### `app/api/checkout/webhook/route.ts` (4 statements)
```
Line 47: console.log('Processing checkout.session.completed:', ...)
Line 78: console.log('Order created successfully:', ...)
Line 129: console.log('Order items created:', ...)
Line 147: console.log('Payment succeeded:', ...)
```

#### `app/api/subscriptions/webhook/route.ts` (1 statement)
```
Line 98: console.log(`Subscription activated for seller...`)
```

#### `app/actions/checkout.ts` (7 statements)
```
Line 99: console.log('Processing order for user:', ...)
Line 106: console.log('Stripe session status:', ...)
Line 128: console.log('Order already exists:', ...)
Line 137: console.log('Parsed items:', ...)
Line 156: console.log('Creating order:', ...)
Line 169: console.log('Order created:', ...)
Line 200: console.log('Creating order items:', ...)
```

#### `lib/message-context.tsx` (4 statements)
```
Line 170: console.log("No authenticated user found")
Line 177: console.log("Loading conversations for user:", ...)
Line 194: console.log("Conversations query result:", ...)
Line 199: console.log("No conversations found")
```

### 4.2 `: any` Types to FIX (27 total)

#### Critical - API Routes
| File | Line | Code | Fix |
|------|------|------|-----|
| `app/api/upload-image/route.ts` | 106 | `catch (error: any)` | `catch (error: unknown)` |
| `app/api/stores/route.ts` | 64 | `catch (error: any)` | `catch (error: unknown)` |
| `app/api/products/search/route.ts` | 41 | `catch (error: any)` | `catch (error: unknown)` |
| `app/api/payments/webhook/route.ts` | 29 | `catch (error: any)` | `catch (error: unknown)` |
| `app/api/categories/route.ts` | 157 | `catch (error: any)` | `catch (error: unknown)` |
| `app/api/categories/products/route.ts` | 75 | `catch (error: any)` | `catch (error: unknown)` |
| `app/api/categories/attributes/route.ts` | 49 | `catch (error: any)` | `catch (error: unknown)` |

#### High Priority - Page Components
| File | Line | Code | Fix |
|------|------|------|-----|
| `app/[locale]/(main)/wishlist/shared/[token]/page.tsx` | 62 | `(item: any)` | Define `WishlistItem` type |
| `app/[locale]/(main)/sellers/page.tsx` | 30, 54, 56, 58 | `any[]`, `(seller: any)`, etc. | Define `Seller` type |
| `app/[locale]/(main)/seller/dashboard/page.tsx` | 109 | `(_event: any, session: any)` | Use Supabase types |
| `app/[locale]/(main)/sell/page.tsx` | 1573, 1621 | `(currentUser: any)`, etc. | Use `User` type |
| `app/[locale]/(main)/search/page.tsx` | 66 | `supabase: any` | Use `SupabaseClient` type |
| `app/[locale]/(main)/product/[id]/page.tsx` | 204, 225 | `(p: any, idx: number)` | Define `Product` type |
| `app/[locale]/(main)/categories/[slug]/page.tsx` | 84, 337 | `supabase: any`, `(product: any)` | Use proper types |
| `app/[locale]/(account)/account/security/security-content.tsx` | 79, 110, 132 | `catch (error: any)` | `catch (error: unknown)` |
| `app/[locale]/(account)/account/orders/page.tsx` | 124 | `(item: any)` | Define `OrderItem` type |

#### Components & Lib
| File | Line | Code | Fix |
|------|------|------|-----|
| `components/reviews-section.tsx` | 127 | `(review: any)` | Define `Review` type |
| `components/image-upload.tsx` | 108 | `catch (error: any)` | `catch (error: unknown)` |
| `lib/wishlist-context.tsx` | 68 | `(item: any)` | Define `WishlistItem` type |
| `lib/data/products.ts` | 88 | `(p: any)` | Define `ProductRow` type |

---

## 📁 SECTION 5: SCRIPTS FOLDER CLEANUP

### 5.1 JS Scripts to Convert to TypeScript
| File | Lines | Action |
|------|-------|--------|
| `scripts/apply-migration.js` | ~70 | Convert to `apply-migration.ts` |
| `scripts/create-user.js` | ~60 | Convert to `create-user.ts` |
| `scripts/seed.js` | ~100 | Convert to `seed.ts` (already exists, DELETE `.js`) |
| `scripts/verify-product.js` | ~100 | Convert to `verify-product.ts` |

### 5.2 Duplicate Script Files
| Keep | Delete |
|------|--------|
| `scripts/seed.ts` | `scripts/seed.js` ← DELETE |

---

## 🖼️ SECTION 6: PUBLIC ASSETS CLEANUP

### 6.1 Duplicate Images (PNG + JPG pairs - keep only one format)
| Keep (PNG - higher quality) | Delete (JPG) |
|----------------------------|--------------|
| `abstract-beauty.png` | `abstract-beauty.jpg` |
| `colorful-toy-collection.png` | `colorful-toy-collection.jpg` |
| `cozy-cabin-interior.png` | `cozy-cabin-interior.jpg` |
| `diverse-fashion-collection.png` | `diverse-fashion-collection.jpg` |
| `diverse-people-listening-headphones.png` | `diverse-people-listening-headphones.jpg` |
| `modern-smartphone.png` | `modern-smartphone.jpg` |
| `retro-living-room-tv.png` | `retro-living-room-tv.jpg` |
| `vintage-camera-still-life.png` | `vintage-camera-still-life.jpg` |

**Also keep these jpg-only files:** `fitness-watch.jpg`, `office-chair.jpg`, `smart-speaker.jpg`

---

## 📝 SECTION 7: TODO/FIXME COMMENTS

| File | Line | Comment | Action |
|------|------|---------|--------|
| `components/product-page-content-new.tsx` | 96 | `// TODO: Replace inline locale checks with t.* translations` | Address or close |

---

## 🗂️ SECTION 8: FILE RENAMING

| Current Name | New Name | Reason |
|--------------|----------|--------|
| `components/product-page-content-new.tsx` | `components/product-page-content.tsx` | Remove "-new" suffix |

---

## 📊 SUMMARY ACTION PLAN

### Phase 1: Immediate Cleanup (5 minutes)
1. DELETE all temp/dump files (6 files)
2. DELETE `next.config.mjs`
3. DELETE duplicate hooks in `components/ui/`

### Phase 2: Component Cleanup (15 minutes)
1. DELETE all 16 unused Shadcn UI components
2. DELETE 5 unused custom components
3. UPDATE imports for hooks

### Phase 3: Dependency Cleanup (5 minutes)
1. `pnpm remove recharts vaul cmdk input-otp react-resizable-panels`
2. (Optional) Remove unused Radix packages

### Phase 4: Code Quality (30 minutes)
1. Remove all 29 `console.log` statements
2. Fix all 27 `: any` types with proper types

### Phase 5: Scripts & Assets (10 minutes)
1. Convert 4 JS scripts to TS
2. Delete duplicate JPG images (8 files)

### Phase 6: Documentation (10 minutes)
1. Move 46 root MD files to `docs/archive/`
2. Move 45 docs folder files to appropriate locations

---

## ✅ VERIFICATION CHECKLIST

After cleanup:
- [ ] `pnpm build` completes without errors
- [ ] `pnpm lint` passes
- [ ] Dev server starts correctly
- [ ] All pages load without console errors
- [ ] Search no longer finds `: any` in codebase
- [ ] `grep -r "console.log" app/ components/ lib/` returns no results
