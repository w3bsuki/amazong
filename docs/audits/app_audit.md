# 🔥 APP FOLDER AUDIT

## Executive Summary

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Route Structure | 2 | 4 | 4 | 2 | 12 |
| API Routes | 1 | 3 | 4 | 1 | 9 |
| Server Actions | 1 | 2 | 3 | 1 | 7 |
| Code Quality | 0 | 6 | 9 | 4 | 19 |
| Performance | 2 | 3 | 2 | 1 | 8 |
| File Organization | 0 | 2 | 2 | 1 | 5 |
| **TOTAL** | **6** | **20** | **24** | **10** | **60** |

---

## 🔴 CRITICAL ISSUES

### 1. Empty `[...notFound]/` folder
**Path:** `app/[locale]/[...notFound]/`  
**Severity:** CRITICAL  
**Description:** Dead catch-all route doing nothing - just an empty folder taking up space.

**Fix:** Delete immediately.

---

### 2. Console.log Statements in Production Webhooks
**Files:** Multiple API routes  
**Count:** 19+ console.log statements  
**Severity:** CRITICAL  

**Affected Files:**
- `app/api/webhooks/stripe/route.ts`
- `app/api/products/route.ts`
- Various other API routes

**Fix:** Remove all console.log or replace with proper logging service.

---

### 3. Unexported Server Action Functions
**Severity:** CRITICAL  
**Description:** 10+ server action functions declared but never exported.

**Affected Files:**
- `app/actions/cart.ts`
- `app/actions/orders.ts`
- `app/actions/products.ts`
- `app/actions/reviews.ts`
- `app/actions/wishlist.ts`

**Fix:** Export functions or delete dead code.

---

### 4. N+1 Category Queries
**Severity:** CRITICAL  
**Description:** 4+ database roundtrips instead of 1 for category data.

**Fix:** Consolidate into single query with proper joins.

---

### 5. generateMetadata Wrong Syntax
**Severity:** CRITICAL  
**Description:** Second argument syntax is invalid in some pages.

**Fix:** Review and correct all generateMetadata implementations.

---

### 6. Duplicate Product Creation Endpoints
**Severity:** CRITICAL  
**Files:** 
- `app/api/products/route.ts`
- `app/[locale]/(business)/dashboard/products/new/` actions

**Fix:** Consolidate to single endpoint.

---

## 🟠 HIGH SEVERITY ISSUES

### 7. Placeholder Pages (7 total)
**Severity:** HIGH  
**Description:** "Coming Soon" placeholder pages that should be removed or completed.

**Pages:**
- `/advertise`
- `/affiliates`
- `/blog`
- `/careers`
- `/investors`
- `/registry`
- `/store-locator`

---

### 8. Deprecated `/api/stores` Endpoint
**Severity:** HIGH  
**Description:** Still accessible but functionality moved elsewhere.

**Fix:** Remove or redirect.

---

### 9. Duplicate Seller Dashboards
**Severity:** HIGH  
**Paths:**
- `app/[locale]/seller/dashboard`
- `app/[locale]/(business)/dashboard`

**Fix:** Consolidate to single dashboard implementation.

---

### 10. Product Routes Just Call notFound()
**Severity:** HIGH  
**Paths:**
- `app/[locale]/(main)/product/[id]/`
- `app/[locale]/(main)/product/[...slug]/`

**Fix:** Delete these dead routes.

---

## 🟡 MEDIUM SEVERITY ISSUES

### 11. Inconsistent Layout Patterns
Multiple layouts with duplicated header/footer logic.

### 12. Missing Error Boundaries
Several route groups lack proper error.tsx files.

### 13. Hardcoded Locale Values
`'bg'` and `'en'` scattered throughout instead of using constants.

### 14. Large Page Components
Some page.tsx files exceed 500 lines - should be split.

---

## 🟢 LOW SEVERITY ISSUES

### 15. Inconsistent File Naming
Mix of kebab-case and camelCase in route folders.

### 16. Missing Loading States
Some routes lack loading.tsx files.

---

## Quick Wins - Delete Immediately

```bash
# Delete empty/dead routes:
app/[locale]/[...notFound]/
app/[locale]/(main)/product/[id]/
app/[locale]/(main)/product/[...slug]/
```

---

## Priority Fix Order

1. **Week 1:** Delete dead routes, remove console.logs
2. **Week 2:** Export/delete unused server actions, fix N+1 queries
3. **Week 3:** Consolidate duplicate endpoints
4. **Week 4:** Complete or remove placeholder pages
