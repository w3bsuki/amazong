# Backend Audit Report

> **Date**: 2026-02-02  
> **Auditor**: treido-backend + spec-supabase  
> **Scope**: Server Actions, API Routes, Supabase, Stripe, Migrations, Auth, Validation

---

## Executive Summary

| Category | Status | Critical | High | Medium | Low |
|----------|--------|----------|------|--------|-----|
| Server Actions | ✅ Pass | 0 | 0 | 1 | 1 |
| API Routes | ✅ Pass | 0 | 0 | 0 | 0 |
| Supabase Usage | ✅ Pass | 0 | 0 | 0 | 1 |
| Stripe Integration | ✅ Excellent | 0 | 0 | 0 | 0 |
| Database Migrations | ✅ Excellent | 0 | 0 | 0 | 0 |
| Authentication | ✅ Pass | 0 | 0 | 0 | 1 |
| Data Validation | ✅ Excellent | 0 | 0 | 0 | 0 |
| Error Handling | ✅ Pass | 0 | 0 | 0 | 1 |
| **Total** | ✅ **Production Ready** | **0** | **0** | **1** | **4** |

**Overall Grade**: ✅ **Production Ready**

---

## Positive Findings ✅

### Security Excellent

1. **All server actions verify auth**: 13/13 action files use `supabase.auth.getUser()`
2. **Webhook signatures verified**: All 4 webhook routes use `stripe.webhooks.constructEvent()`
3. **RLS enabled everywhere**: All user tables have Row Level Security
4. **Anon privileges hardened**: Cannot INSERT/UPDATE/DELETE any tables
5. **SECURITY DEFINER functions secured**: `SET search_path = public, pg_temp`
6. **Idempotency implemented**: Unique indexes on Stripe IDs
7. **Multi-key rotation supported**: Webhook secrets support comma-separated keys

### Data Safety Excellent

1. **Zod validation throughout**: Profile, products, orders, subscriptions
2. **No `select('*')` in hot paths**: All queries use explicit projections
3. **SQL injection prevented**: Parameterized queries via Supabase SDK
4. **PII not logged**: Generic error messages returned

### Key Security Migrations

| Migration | Purpose |
|-----------|---------|
| `20260124213000_anon_privileges_hardening.sql` | Revokes anon DML |
| `20260130021328_secure_security_definer_rpcs.sql` | Locks down functions |
| `20260125091000_profiles_restrict_authenticated_updates.sql` | Protects profile fields |
| `20260131123000_stripe_webhook_idempotency.sql` | Unique indexes |

---

## Findings (All Low/Medium)

### BE-001: Missing Zod validation in seller-follows

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **File** | `app/actions/seller-follows.ts#L23` |
| **Description** | `sellerId` parameter not validated with Zod |
| **Fix** | Add `z.string().uuid()` validation |
| **Security Impact** | Low — RLS prevents exploitation |
| **Phase** | 3 |

---

### BE-002: No app-level rate limiting

| Field | Value |
|-------|-------|
| **Severity** | Medium |
| **Files** | All `app/actions/*.ts` |
| **Description** | Relies on Supabase/Vercel rate limits only |
| **Fix** | Consider adding rate limiting for reviews/feedback |
| **Security Impact** | Medium — spam potential |
| **Phase** | Post-launch |

---

### BE-004: Some queries have wide projections

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **File** | `app/actions/orders.ts#L59-L72` |
| **Description** | `ORDER_ITEM_LIST_SELECT` joins multiple tables |
| **Fix** | Consider splitting for large result sets |
| **Security Impact** | None — data is filtered |
| **Phase** | 5 (optimization) |

---

### BE-007: Auth redirect could be stricter

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **File** | `app/auth/callback/route.ts#L4-L8` |
| **Description** | `safeNextPath()` only checks leading slashes |
| **Fix** | Consider allowlist of valid redirect paths |
| **Security Impact** | Low — current checks prevent protocol-relative |
| **Phase** | Post-launch |

---

### BE-008: Some error messages pass through

| Field | Value |
|-------|-------|
| **Severity** | Low |
| **File** | `app/actions/subscriptions.ts#L103` |
| **Description** | `error.message` passed to client in some catches |
| **Fix** | Sanitize or mask internal error details |
| **Security Impact** | Low — Stripe errors don't contain secrets |
| **Phase** | 3 |

---

## Verified Security Checklist

- [x] All server actions verify authentication
- [x] Webhook signatures verified with `constructEvent()`
- [x] RLS enabled on all user tables  
- [x] No `select('*')` in hot paths
- [x] SECURITY DEFINER functions have `SET search_path`
- [x] Anon role cannot INSERT/UPDATE/DELETE
- [x] Stripe idempotency keys used
- [x] OAuth callbacks validate redirect paths
- [x] Passwords re-verified before changes
- [x] Error messages don't expose PII

---

## Webhook Routes Verified

| Route | Signature | Idempotent | Multi-key |
|-------|-----------|------------|-----------|
| `/api/checkout/webhook` | ✅ | ✅ | ✅ |
| `/api/payments/webhook` | ✅ | ✅ | ✅ |
| `/api/connect/webhook` | ✅ | ✅ | ✅ |
| `/api/subscriptions/webhook` | ✅ | ✅ | ✅ |

---

## Recommendations

### Before Launch
- ✅ **None critical** — backend is production ready

### Short-term (Post-Launch)
1. Add Zod validation to `seller-follows.ts` sellerId
2. Sanitize Stripe API error messages
3. Consider allowlist for auth redirect paths

### Long-term
1. Implement app-level rate limiting
2. Add request logging with correlation IDs
3. Set up alerting for webhook failures

---

## Effort Estimates

| Phase | Items | Est. Hours |
|-------|-------|------------|
| 3 | 2 | 1h |
| Post-launch | 2 | 2h |
| **Total** | **4** | **3h** |

---

*Audit complete — 2026-02-02*
