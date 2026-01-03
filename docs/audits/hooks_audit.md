# 🔥 HOOKS FOLDER AUDIT

## Executive Summary

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 2 |
| 🟠 HIGH | 5 |
| 🟡 MEDIUM | 8 |
| 🟢 LOW | 4 |

---

## 🔴 CRITICAL ISSUES

### 1. DEAD CODE: `usePublicBadges` Never Exported or Used

**File:** `hooks/use-badges.ts`  
**Lines:** 125-166

**Description:** This ENTIRE `usePublicBadges` hook is defined but:
- **Never exported** (missing `export` keyword)
- **Never used anywhere** in the codebase
- Just sitting there taking up 40+ lines

```typescript
function usePublicBadges(userId: string | null) {  // NO EXPORT!
```

**Fix:**
- Either **export it** if needed
- Or **DELETE IT** if not needed

---

### 2. DEAD CODE: `GEO_STORAGE_KEYS` Declared But Never Exported

**File:** `hooks/use-geo-welcome.ts`  
**Lines:** 309-310

```typescript
const GEO_STORAGE_KEYS = STORAGE_KEYS;
```

**Issues:**
- Declared at the end of the file
- **Never exported**
- **Never used**
- Comment says "Export storage keys for external use" but THERE'S NO EXPORT!

**Fix:**
```typescript
export const GEO_STORAGE_KEYS = STORAGE_KEYS;
```
Or delete it if no consumer exists.

---

## 🟠 HIGH SEVERITY ISSUES

### 3. Console.error Statements in Production Code

**File:** `hooks/use-product-search.ts`  
**Lines:** 50, 82, 108, 158

| Line | Call |
|------|------|
| 50 | `console.error("Search API error:", err)` |
| 82 | `console.error("Failed to load recent:", err)` |
| 108 | `console.error("Failed to save recent:", err)` |
| 158 | `console.error("Product fetch error:", err)` |

**Fix:** Use proper logging service or remove in production:
```typescript
if (process.env.NODE_ENV !== 'production') {
  console.error("Error:", err)
}
```

---

### 4. Duplicated localStorage Pattern Across 3 Hooks

**Files:**
- `hooks/use-product-search.ts`
- `hooks/use-recently-viewed.ts`
- `hooks/use-geo-welcome.ts`

**Description:** Three hooks implement nearly identical localStorage access patterns:
1. Check `typeof window`
2. Try/catch localStorage access
3. Silent failure handling

**Fix:** Extract to `lib/storage.ts`:
```typescript
export function safeLocalStorage<T>(key: string, fallback: T): [T, (value: T) => void]
```
Or create a `useLocalStorage` hook.

---

### 5. useToast - Side Effects Inside Reducer

**File:** `hooks/use-toast.ts`  
**Lines:** 91-108

The comment literally admits the sin:
```typescript
// ! Side effects ! - This could be extracted into a dismissToast() action,
// but I'll keep it here for simplicity
```

**Problem:** The reducer calls `setTimeout` which sets timeouts - **REDUCERS MUST BE PURE!**

**Fix:** Move side effects to a `useEffect` that watches for dismissed toasts.

---

### 6. useToast - Missing Cleanup for Timeouts

**File:** `hooks/use-toast.ts`  
**Lines:** 50-62

```typescript
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()
```

**Problem:** Module-level Map stores timeouts, but there's **no cleanup** when component unmounts or app hot-reloads.

**Impact:** Memory leak in long-running sessions.

**Fix:** Clear all timeouts when the last listener unsubscribes:
```typescript
if (listeners.length === 0) {
  toastTimeouts.forEach(clearTimeout)
  toastTimeouts.clear()
}
```

---

### 7. useToast - Dependency Array Bug

**File:** `hooks/use-toast.ts`  
**Lines:** 175-183

```typescript
React.useEffect(() => {
  listeners.push(setState)
  return () => {
    const index = listeners.indexOf(setState)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}, [state])  // 🚨 WHY IS STATE HERE?!
```

**Problem:** `state` in dependency array causes effect to **re-run on every state change**, repeatedly adding/removing listeners!

**Fix:**
```typescript
}, []) // Empty deps - subscribe once on mount
```

---

## 🟡 MEDIUM SEVERITY ISSUES

### 8. Missing `useMemo` for `trendingSearches`

**File:** `hooks/use-product-search.ts`  
**Lines:** 90-97

```typescript
const trendingSearches = [
  locale === "bg" ? "Черен петък оферти" : "Black Friday deals",
  // ...
]
```

**Problem:** Array recreated on every render.

**Fix:**
```typescript
const trendingSearches = useMemo(() => [...], [locale])
```

---

### 9. useProductSearch - Giant Hook Violates SRP

**File:** `hooks/use-product-search.ts`  
**Lines:** 1-293

**Responsibilities (7 total!):**
1. Debouncing
2. Product search API calls
3. Recent searches management
4. Recent products management
5. Price formatting
6. Trending searches
7. LocalStorage persistence

**Fix:** Split into composable hooks:
- `useDebounce`
- `useRecentSearches`
- `useSearchProducts`
- `usePriceFormatter`

---

### 10. `useDebounce` Not Exported

**File:** `hooks/use-product-search.ts`  
**Lines:** 61-76

A perfectly good generic `useDebounce` hook is hidden inside:
```typescript
function useDebounce<T>(value: T, delay: number): T {
```
Not exported. Not reusable.

**Fix:** Extract to `hooks/use-debounce.ts` and export it.

---

### 11. useGeoWelcome - No Error Boundary for Supabase Failures

**File:** `hooks/use-geo-welcome.ts`  
**Lines:** 160-175

```typescript
const { data: { user } } = await supabase.auth.getUser();

if (user) {
  const { data: profile } = await supabase
    .from('profiles')
    .select(...)
```

**Problem:** No try/catch! If Supabase is down, the whole initialization fails silently.

**Fix:** Wrap in try/catch, handle gracefully.

---

### 12. Missing Return Type Annotations

Several functions missing explicit return types:
- `use-badges.ts`: `getBadgeColor` returns `string | null`
- `use-geo-welcome.ts`: `dismissModal` returns `void`
- `use-mobile.ts`: `getDeviceType` returns `string`

---

### 13. useRecentlyViewed - Double localStorage Write

**File:** `hooks/use-recently-viewed.ts`  
**Lines:** 50-55

```typescript
useEffect(() => {
  if (isLoaded && typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }
}, [products, isLoaded])
```

**Problem:** Fires on **every** products change, even when loading from localStorage on mount.

**Fix:** Track if changes originated from user action vs initial load.

---

### 14. RecentlyViewedProduct - Deprecated Field Without Migration

**File:** `hooks/use-recently-viewed.ts`  
**Lines:** 14-15

```typescript
/** Seller username for SEO-friendly URLs */
username?: string | null
/** @deprecated Use 'username' instead */
storeSlug?: string | null
```

**Problem:** Deprecated field exists with no migration strategy.

**Fix:** Add migration in load effect to rename `storeSlug` → `username`.

---

### 15. Inconsistent Error Handling Patterns

| Hook | Pattern |
|------|---------|
| `use-product-search.ts` | Catches, logs, and re-throws |
| `use-recently-viewed.ts` | Catches and silently ignores |
| `use-badges.ts` | Empty catch blocks |
| `use-geo-welcome.ts` | Silent failures |

**Fix:** Establish consistent error handling pattern.

---

## 🟢 LOW SEVERITY ISSUES

### 16. Magic Numbers Without Constants

**File:** `hooks/use-badges.ts`  
**Line:** 39

```typescript
const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000
```

**Fix:**
```typescript
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000
```

---

### 17. TOAST_REMOVE_DELAY Suspiciously Large

**File:** `hooks/use-toast.ts`  
**Line:** 9

```typescript
const TOAST_REMOVE_DELAY = 1000000  // ~16 minutes?!
```

**Fix:** Review if this is intentional.

---

### 18. Missing JSDoc on Public Interfaces

Exported interfaces like `Badge`, `GeoWelcomeState`, `RecentlyViewedProduct` lack JSDoc.

---

### 19. Inconsistent Quote Styles

| Hook | Style |
|------|-------|
| `use-badges.ts` | Single quotes |
| `use-toast.ts` | Double quotes |
| `use-mobile.ts` | Single quotes |

**Fix:** Run Prettier with consistent config.

---

## ✅ WHAT'S ACTUALLY GOOD

1. **`use-mobile.ts`** - Clean, uses `useSyncExternalStore` properly, proper SSR handling
2. **`use-badges.ts`** - Simple, focused, proper error message
3. **Proper AbortController usage** in `use-product-search.ts` fetch calls
4. **Consistent use of `JSON.parse`** for localStorage parsing
5. **Good TypeScript interfaces** overall

---

## Priority Fix Order

1. **Delete dead code** (Issues #1, #2)
2. **Fix useToast dependency array** (Issue #7) - causes bugs NOW
3. **Remove/fix console.error** (Issue #3)
4. **Extract localStorage utilities** (Issue #4)
5. **Fix useToast reducer purity** (Issues #5, #6)
