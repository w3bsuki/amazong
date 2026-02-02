# Feature Alignment Audit

> **Date**: 2026-02-02  
> **Auditor**: treido-alignment  
> **Scope**: Docs vs Codebase Feature Verification

---

## Executive Summary

**Documentation is Conservative** — 6 features should be upgraded from 🚧/⬜ to ✅

| Metric | Value |
|--------|-------|
| **Documented Completion** | 87% (103/119) |
| **Actual Completion** | ~92% |
| **Overstate in Docs** | 0 features |
| **Understate in Docs** | 6 features |

---

## Features to UPGRADE (Docs too conservative)

| Feature | Documented | Actual | Evidence |
|---------|-----------|--------|----------|
| Cancel Order (Buyer) | 🚧 In Progress | ✅ Complete | Full UI + backend action exists |
| Saved Searches | 🚧 Client-only | ✅ Complete | localStorage implementation working |
| Related Items | ⬜ V1.1 | ✅ Complete | `similar-items-grid.tsx` working |
| In-app Notifications | 🚧 Partial | ✅ Complete | Full notification system with dropdown |
| Business Analytics | 🚧 Basic | ✅ Complete | Full dashboard with charts |
| Admin Metrics | 🚧 | ✅ Complete | Stats cards + activity feed |

---

## Actual Gaps Found

### P1 — Should Fix Before Launch

| Gap | Category | Status | Effort |
|-----|----------|--------|--------|
| Admin moderation actions | Trust & Safety | View-only, no ban/remove buttons | 4h |
| Content moderation | Trust & Safety | Can view products, can't remove | 4h |

### P2 — Nice to Have

| Gap | Category | Status | Effort |
|-----|----------|--------|--------|
| Wishlist sharing UI | Wishlist | DB schema exists, no UI | 2h |
| Email notifications | Profiles | No email service connected | 8h+ |

### P3 — Post-Launch

| Gap | Category | Status | Effort |
|-----|----------|--------|--------|
| Stripe refunds | Orders | Manual process via dashboard | N/A |
| Listing analytics | Selling | Business tier feature | V1.1 |

---

## Detailed Findings

### 1. Orders (Buyer) — 100% Complete ✅

**Cancel Order:**
- ✅ UI: `buyer-order-actions.tsx` has Cancel button
- ✅ Condition: Only shows when `canCancel(order)` — pre-shipment
- ✅ Backend: Server action handles cancellation
- ✅ RLS: User can only cancel own orders

**Recommendation:** Update docs to ✅

---

### 2. Orders (Seller) — 83% Complete

**Process Refund:**
- ⚠️ No automated refund button in seller UI
- ✅ Manual process documented: "Contact support"
- This is intentional for V1 (fraud prevention)

**Recommendation:** Keep as 🚧 with note "Manual via Stripe Dashboard"

---

### 3. Discovery — 100% Complete ✅

**Saved Searches:**
- ✅ `hooks/use-saved-search.ts` exists
- ✅ localStorage persistence working
- ✅ UI shows saved search button on search page

**Recommendation:** Update docs to ✅

---

### 4. Product Pages — 100% Complete ✅

**Related Items:**
- ✅ `similar-items-grid.tsx` component exists
- ✅ Shows products from same category
- ✅ Proper image handling with fallbacks

**Recommendation:** Update docs to ✅ (remove "V1.1" tag)

---

### 5. Wishlist — 80% Complete

**Wishlist Sharing:**
- ✅ DB: `wishlist_shares` table exists with proper schema
- ❌ UI: No share button exposed in wishlist page
- ❌ Link generation not implemented

**Recommendation:** Keep as ⬜, add as P2 task

---

### 6. Profiles — 83% Complete

**In-app Notifications:**
- ✅ `notifications-dropdown.tsx` — full implementation
- ✅ Real-time subscription to notifications table
- ✅ Mark as read functionality
- ✅ Notification types: orders, messages, follows

**Email Notifications:**
- ❌ No email service configured
- ❌ No email templates
- Intentionally deferred to post-launch

**Recommendation:** 
- Update in-app to ✅
- Keep email as ⬜ (requires Resend/SendGrid)

---

### 7. Trust & Safety — 67% Complete

**Admin Moderation:**
- ✅ Can view reported users/products/conversations
- ❌ No "ban user" button
- ❌ No "remove product" button
- Admin must use Supabase dashboard directly

**Prohibited Items:**
- ✅ Report flow exists
- ❌ No automated detection
- Manual review process only

**Recommendation:** Add moderation actions as P1 task (4h each)

---

### 8. Business Dashboard — 100% Complete ✅

**Analytics Dashboard:**
- ✅ `analytics/page.tsx` with full implementation
- ✅ Revenue charts
- ✅ Order trends
- ✅ Product performance
- ✅ Customer metrics

**Recommendation:** Update docs to ✅

---

### 9. Admin — 60% Complete

**Admin Metrics:**
- ✅ Stats cards: users, orders, revenue, products
- ✅ Activity feed with recent actions
- ✅ Charts for trends

**User Management:**
- ✅ User list with search/filter
- ❌ No edit/ban actions

**Content Moderation:**
- ✅ Product list with status filters
- ❌ No approve/reject actions

**Recommendation:** Keep as partial, add action buttons as P1

---

### 10. Accessibility — 60% Complete

**Screen Reader Labels:**
- ✅ Most interactive elements have `aria-label`
- ⚠️ Some dynamic content missing announcements

**WCAG 2.1 AA:**
- ✅ Color contrast checks pass
- ✅ Focus indicators present
- ⚠️ Some keyboard traps in complex modals

**Recommendation:** Keep as 🚧, audit with axe-core

---

## Action Items

### Update `docs/02-FEATURES.md`

```diff
## 3. Orders — Buyer (6/6) ✅
- 5. ✅ Cancel order — pre-shipment only
+ 5. ✅ Cancel order — pre-shipment only

## 7. Marketplace Discovery (7/7) ✅
- 7. 🚧 Saved searches — client-only (localStorage)
+ 7. ✅ Saved searches — client-only (localStorage)

## 8. Product Pages / PDP (8/8) ✅
- 7. ⬜ Related items — V1.1
+ 7. ✅ Related items

## 12. Profiles & Account (5/6)
- 5. 🚧 Notifications (in-app) — DB exists, UI partial
+ 5. ✅ Notifications (in-app)

## 14. Business Dashboard (6/6) ✅
- 5. 🚧 Analytics dashboard — basic
+ 5. ✅ Analytics dashboard

## 15. Admin (3/5)
- 2. 🚧 Admin metrics
+ 2. ✅ Admin metrics
```

### Create New Tasks

```markdown
- [ ] TRUST-001: Add "Ban User" button to admin users page
- [ ] TRUST-002: Add "Remove Product" button to admin products page
- [ ] WISH-001: Implement wishlist sharing UI
```

---

*Audit complete — 2026-02-02*
