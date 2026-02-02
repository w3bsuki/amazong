# Codex MCP Review – Iteration #1

**Reviewed:** February 1, 2026  
**Reviewer:** Codex MCP (AI Backend Specialist)  
**Status:** Issues addressed in iteration #2

---

## 🚨 Critical Issues Found (Status Updated)

### 1. Rails Conflicts
~~The plan calls for gradients and new animations which are **explicitly disallowed** in this repo.~~

**✅ RESOLVED:** Removed from plan. Using existing motion only.

---

### 2. Onboarding Middleware Approach Wrong
~~The plan proposes middleware.ts redirect, but repo uses `?onboarding=true` via confirm route.~~

**✅ RESOLVED:** Updated to use OnboardingProvider pattern (client-side modal, not middleware redirect).

---

### 3. Database Schema Conflicts
- `account_type` already set via DB trigger from signup metadata
- VAT already lives in `private_profiles`, not `profiles`

**✅ ACKNOWLEDGED:** Will use `private_profiles` for business fields. Server action with elevated privileges for account_type changes during onboarding.

---

### 4. DrawerManager Duplicates Existing
~~Component structure proposes new drawer system~~

**✅ RESOLVED:** Using existing Vaul-based drawer + context providers. No new primitive.

---

### 5. Tap Count Claim False
~~Plan claims "tap count same" for drawer vs pills.~~

**✅ ACKNOWLEDGED:** Updated docs to reflect drawer adds one tap for subcategories. Trade-off accepted for cleaner UI.

---

## ⚠️ Strategic Concerns (Updated)

### Feed Default Changed
**Decision Changed:** Grid is now default (product-first), not feed.

- Matches original Codex recommendation
- Feed available as optional toggle (P2)
- Grid fallback when supply is sparse

### AI Search Pattern
**Confirmed:** Integrated in main search bar (not separate button)

### Analytics Table Design
Raw `product_views` table will explode. Use:
- Daily aggregates per product/seller/source
- Materialized views
- Don't store `viewer_id` (PII concern)

---

## ❓ Questions Answered

1. **Account Type Policy:**
   ✅ **Business is free identity choice.** Users can switch Personal → Business easily. Business → Personal requires support (one-way easy).

2. **Drawer URL Behavior:**
   ✅ **URL-driven.** Deep links work, back button closes drawer. Shareable URLs like `/search?category=fashion`.

3. **Supply Reality Check:**
   ✅ **Grid default.** Until supply grows, grid is safer default. Feed is optional toggle for users with follows.

---

## ✅ What's Already Good

Codex confirmed these are feasible and aligned:
- Drawer system architecture (via Vaul)
- Circle + drawer for categories (with noted improvements)
- AI search integration approach
- CSV export/import design (with noted improvements)
- Post-signup onboarding concept

---

## 📝 Action Items (Status Updated)

| Priority | Document | Action | Status |
|----------|----------|--------|--------|
| P0 | `01-MASTER-PLAN.md` | Remove gradient/animation requirements | ⬜ Pending |
| P0 | `02-ONBOARDING-FLOW.md` | Replace middleware redirect | ✅ Done |
| P0 | `02-ONBOARDING-FLOW.md` | Update gating for onboarding | ⬜ Pending |
| P0 | `05-BUSINESS-FEATURES.md` | Align with `private_profiles` | ⬜ Pending |
| P0 | `05-BUSINESS-FEATURES.md` | Aggregated analytics design | ⬜ Pending |
| P1 | `03-LANDING-PAGE.md` | Grid default + feed optional | ⬜ Pending |
| P1 | `04-NAVIGATION.md` | URL-driven drawer spec | ⬜ Pending |
| P2 | `06-COMPONENTS.md` | Remove DrawerManager | ⬜ Pending |
| P2 | `06-COMPONENTS.md` | Align file structure | ⬜ Pending |

---

## 🔄 Next Steps

1. ✅ All strategic questions answered
2. ⬜ Apply remaining P0 fixes to documents
3. ⬜ Request Codex MCP iteration #2 review
4. ⬜ Begin implementation (Week 1)
