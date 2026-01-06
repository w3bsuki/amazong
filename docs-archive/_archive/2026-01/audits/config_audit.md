# 🔥 CONFIG FOLDER AUDIT

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 1 |
| 🟠 HIGH | 4 |
| 🟡 MEDIUM | 6 |
| 🔵 LOW | 3 |

---

## 🔴 CRITICAL ISSUES

### 1. Dead Code: `MAX_VISIBLE_CATEGORIES` is NEVER USED

**File:** `config/mega-menu-config.ts`  
**Line:** 49

```typescript
// DEAD CODE - This const sits here lonely and unloved
const MAX_VISIBLE_CATEGORIES = 14
```

**Meanwhile**, in `components/navigation/mega-menu.tsx`, a DIFFERENT constant exists:
```typescript
const MAX_VISIBLE_SUBCATEGORIES = 16  // Local to the component
```

**Fix:** Either use `MAX_VISIBLE_CATEGORIES` from config or DELETE IT.

---

## 🟠 HIGH SEVERITY ISSUES

### 2. 17 Placeholder Images - Banner Config is HALF-BAKED

**File:** `config/mega-menu-config.ts`  
**Lines:** 243, 259, 275, 291, 312, 344, 376, 424, 440, 456, 472, 488, 520, 536, 552, 568, 585

**Description:** 17 category banners use `/placeholder.svg` instead of actual images!

**Affected Categories:**
- pets, books, jewelry-watches, garden-outdoor, health-wellness, tools-home
- musical-instruments, grocery, handmade, industrial, software
- services, gift-cards, bulgarian-traditional, e-mobility, hobbies, wholesale

**Fix:** Create proper banner images for each category.

---

### 3. Mismatched Banner Image - Automotive Uses TV Image!

**File:** `config/mega-menu-config.ts`  
**Line:** 129

```typescript
"automotive": {
  // ...
  banner: {
    title: "Auto Essentials",
    image: "/retro-living-room-tv.png",  // 🚗 ≠ 📺 WHAT?!
  }
}
```

**Fix:** Use an appropriate automotive image.

---

### 4. External URL Dependency - 85+ Unsplash URLs

**File:** `config/subcategory-images.ts`  
**Lines:** 5-175

**Description:** Entire `subcategoryImages` object relies on **85+ external Unsplash URLs**.

**Risks:**
- Unsplash API rate limits
- CDN outages
- URL deprecation
- CORS issues
- Performance (no local caching control)

**Fix:**
1. Download images to `public/`
2. Use Next.js Image optimization
3. Add proper fallback handling

---

### 5. Hardcoded Query Parameters in URLs

**File:** `config/subcategory-images.ts`  
**Description:** Every URL has `?w=200&q=80` hardcoded. Can't change sizes for mobile/desktop without editing 85+ lines.

```typescript
smartphones: "https://images.unsplash.com/photo-xxx?w=200&q=80",
```

**Fix:** Store base URLs and apply query params dynamically:
```typescript
const UNSPLASH_PARAMS = { w: 200, q: 80 }
function buildImageUrl(photoId: string) {
  return `https://images.unsplash.com/${photoId}?w=${UNSPLASH_PARAMS.w}&q=${UNSPLASH_PARAMS.q}`
}
```

---

## 🟡 MEDIUM SEVERITY ISSUES

### 6. Duplicate Image URLs - Copy-Paste Laziness

**File:** `config/subcategory-images.ts`

**Lazy Duplicates (problematic):**

| Image | Used For |
|-------|----------|
| `photo-1558618666` | outdoor-decor, knitting-crochet, raw-materials, vintage-antiques |
| `photo-1416879595882` | garden, plants-seeds, garden-tools, **hand-tools** (tools ≠ garden!) |

Line 167 uses a GARDEN image for `hand-tools`.

**Fix:** Find appropriate unique images for each distinct category.

---

### 7. Inconsistent Naming Conventions

**File:** `config/subcategory-images.ts`

```typescript
// Inconsistent patterns:
tvs                  // vs "tv-home-cinema"
dogs                 // vs "small-animals"
jewelry              // vs "fine-jewelry", "fashion-jewelry"
fitness              // vs "exercise-fitness" (redundant!)
outdoor              // vs "outdoor-recreation" (redundant!)
```

**Fix:** Establish naming convention and stick to it.

---

### 8. Missing TypeScript Type for Keys

**File:** `config/subcategory-images.ts`

**Description:** While `as const satisfies Record<string, string>` is used, there's no exported type for valid keys.

**Fix:** Export a type:
```typescript
export type SubcategorySlug = keyof typeof subcategoryImages
```

---

### 9. No Validation for Featured L1 Slugs

**File:** `config/mega-menu-config.ts`

**Description:** The `featured` arrays contain string slugs that aren't validated against actual category data.

```typescript
"fashion": {
  featured: ["fashion-mens", "fashion-womens", "fashion-kids"],  // No compile-time validation!
}
```

**Fix:** Create union type of valid L1 slugs:
```typescript
type L1Slug = "fashion-mens" | "fashion-womens" | ...
featured: L1Slug[]
```

---

### 10. Comments Without Actions - L2 Counts Are Stale

**File:** `config/mega-menu-config.ts`

```typescript
// ===== ELECTRONICS =====
// L1s: smartphones (6), pc-laptops (5), tablets (6), wearables (4), tv-audio (5)
// ^ Are these numbers still accurate? WHO KNOWS!
```

**Fix:** Remove these comments or generate them automatically from category data.

---

### 11. No JSDoc for `subcategoryImages` Export

**File:** `config/subcategory-images.ts`

**Fix:** Add proper documentation:
```typescript
/**
 * Fallback images for subcategory mega menu thumbnails.
 * Keys are category slugs, values are Unsplash URLs.
 */
```

---

## 🔵 LOW SEVERITY ISSUES

### 12. `CategoryBannerConfig` Could Use Branded Types

```typescript
// Current:
title: string
titleBg: string  // Bulgarian translation

// Better:
title: TranslationKey<'en'>
titleBg: TranslationKey<'bg'>
```

---

### 13. Banner `href` Uses Relative Paths

**Description:** All banner `href` values are hardcoded relative paths like `/en/categories/fashion`.

**Fix:** Use a route builder function:
```typescript
import { routes } from '@/lib/routes'
href: routes.category('fashion')
```

---

### 14. No Default Export

Both config files use named exports only. A default export would improve DX.

---

## ✅ WHAT'S ACTUALLY GOOD

1. **Proper TypeScript**: `as const satisfies` pattern is correctly used
2. **Good separation**: Config is separated from UI components
3. **Decent JSDoc**: `CategoryBannerConfig` has helpful interface documentation
4. **Consistent structure**: All 31 category configs follow the same shape
5. **Helper function**: `getCategoryBannerImage` provides proper fallback handling
6. **Organized sections**: Categories are grouped with clear comments

---

## Priority Fix Order

### Immediate
1. Delete unused `MAX_VISIBLE_CATEGORIES`
2. Fix automotive banner image

### This Week
1. Create proper banner images for 17 placeholder categories
2. Download Unsplash images locally

### This Sprint
1. Add TypeScript types for slugs
2. Standardize naming conventions
3. Add validation for featured L1 slugs
