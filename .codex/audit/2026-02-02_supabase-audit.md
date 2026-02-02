# Supabase Best Practices Audit

> Audit Date: 2026-02-02 | Auditor: spec-supabase | Status: ✅ Complete

---

## Summary

**Overall Assessment:** ✅ Strong Supabase practices

| Category | Status | Notes |
|----------|--------|-------|
| Client Selection | ✅ Good | Clear patterns, one minor issue |
| Query Patterns | ✅ Good | Field projection throughout |
| RLS/Auth | ✅ Good | Proper `getUser()` usage |
| Error Handling | ✅ Good | Consistent try/catch + logging |
| Caching | ✅ Good | Proper separation of cached vs user data |

---

## Findings (Phase 3)

| Path:Line | Issue | Current | Fix | Phase |
|-----------|-------|---------|-----|-------|
| `lib/data/plans.ts:71-80` | Wrong client | `createClient()` reads cookies but fetches public data | Use `createStaticClient()` | 3 |
| `lib/data/plans.ts:71` | Missing cache | `getPlansForUpgrade()` fetches static data without caching | Add `'use cache'` + `cacheTag('plans')` | 3 |

---

## Acceptable Patterns (No Action)

| Path | Pattern | Why It's OK |
|------|---------|-------------|
| `components/providers/auth-state-manager.tsx` | Uses `getSession()` | Client-side context, Supabase JS validates token locally |
| `app/[locale]/(auth)/reset-password/` | Uses `getSession()` | Checking for recovery session on client |

---

## Client Usage Summary ✅

All five Supabase clients used correctly:

| Client | Use | Status |
|--------|-----|--------|
| `createClient()` | Server Components/Actions with cookies | ✅ |
| `createStaticClient()` | Cached queries (no cookies) | ✅ |
| `createRouteHandlerClient()` | API route handlers | ✅ |
| `createAdminClient()` | Webhooks, admin operations | ✅ |
| `createBrowserClient()` | Client Components | ✅ |

---

## Query Patterns ✅

| Pattern | Status |
|---------|--------|
| `select('*')` in hot paths | ✅ None found |
| Wide joins in list views | ✅ Properly constrained |
| Missing error handling | ✅ All queries wrapped |
| No pagination | ✅ `.limit()` or `.range()` used |

---

## RLS & Auth ✅

| Pattern | Status |
|---------|--------|
| `getUser()` for security | ✅ Used in all server actions |
| Admin client protection | ✅ `requireAdmin()` gates all admin ops |
| Webhook verification | ✅ Stripe signature checked first |

---

## Compliance Checklist

- [x] No `select('*')` in application code
- [x] Field projection on all hot-path queries
- [x] `getUser()` for server-side auth (not `getSession()`)
- [x] Admin client usage verified before RLS bypass
- [x] Cached functions use `createStaticClient()`
- [x] User-specific server actions don't use cache
- [x] Error handling on all Supabase calls
- [x] Pagination on list queries
- [x] Webhook idempotency keys

---

## Recommended Fix

```typescript
// lib/data/plans.ts - Change from:
export async function getPlansForUpgrade(): Promise<UpgradePlan[]> {
  const client = await createClient()  // ❌ Uses cookies
  // ...
}

// To:
export async function getPlansForUpgrade(): Promise<UpgradePlan[]> {
  'use cache'
  cacheTag('plans')
  cacheLife('categories')  // Plans rarely change
  
  const client = createStaticClient()  // ✅ No cookies
  // ...
}
```

---

*Generated: 2026-02-02*
